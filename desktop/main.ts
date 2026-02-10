import { app, BrowserWindow, ipcMain } from "electron";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path, { join } from "node:path";

const isDev = process.env.NODE_ENV !== "production";
const DEV_SERVER = process.env.DEV_SERVER || "http://localhost:3000";
const HEALTH_TIMEOUT_MS = 1500;
const HEALTH_RETRY_COUNT = 8;
const HEALTH_RETRY_INTERVAL_MS = 400;

type ApiMode = "remote" | "local" | "auto";
type RuntimeApiConfig = {
  mode: ApiMode;
  effectiveMode: "remote" | "local";
  apiBaseUrl: string;
  remoteBaseUrl: string;
  localBaseUrl: string;
  healthPath: string;
  localFallbackUsed: boolean;
};
type DesktopSettings = {
  api: {
    mode: ApiMode;
    remoteBaseUrl: string;
    localBaseUrl: string;
    healthPath: string;
    localEnabled: boolean;
  };
};

let win: BrowserWindow | null = null;
let localApiProcess: ChildProcessWithoutNullStreams | null = null;
let runtimeApiConfig: RuntimeApiConfig | null = null;
let desktopSettingsFilePath = "";

function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 3000;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  // Correctly construct the file path for production
  return path.join(__dirname, "../webui", htmlFileName);
}

function normalizeMode(rawMode: string | undefined): ApiMode {
  if (rawMode === "remote" || rawMode === "local" || rawMode === "auto") {
    return rawMode;
  }
  return "auto";
}

function getDefaultSettings(): DesktopSettings {
  return {
    api: {
      mode: "auto",
      remoteBaseUrl: "http://127.0.0.1:5000",
      localBaseUrl: "http://127.0.0.1:5073",
      healthPath: "/health",
      localEnabled: true,
    },
  };
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function loadDesktopSettings(): DesktopSettings {
  const defaults = getDefaultSettings();
  desktopSettingsFilePath = path.join(app.getPath("userData"), "settings.json");

  try {
    const raw = readFileSync(desktopSettingsFilePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isObjectLike(parsed) || !isObjectLike(parsed.api)) {
      throw new Error("Invalid settings format.");
    }

    const api = parsed.api as Record<string, unknown>;
    const merged: DesktopSettings = {
      api: {
        mode: normalizeMode(typeof api.mode === "string" ? api.mode : undefined),
        remoteBaseUrl:
          typeof api.remoteBaseUrl === "string" && api.remoteBaseUrl.trim().length > 0
            ? api.remoteBaseUrl
            : defaults.api.remoteBaseUrl,
        localBaseUrl:
          typeof api.localBaseUrl === "string" && api.localBaseUrl.trim().length > 0
            ? api.localBaseUrl
            : defaults.api.localBaseUrl,
        healthPath:
          typeof api.healthPath === "string" && api.healthPath.trim().length > 0
            ? api.healthPath
            : defaults.api.healthPath,
        localEnabled: typeof api.localEnabled === "boolean" ? api.localEnabled : defaults.api.localEnabled,
      },
    };
    return merged;
  } catch {
    mkdirSync(path.dirname(desktopSettingsFilePath), { recursive: true });
    writeFileSync(desktopSettingsFilePath, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isApiHealthy(baseUrl: string, healthPath: string): Promise<boolean> {
  const healthUrl = `${trimTrailingSlash(baseUrl)}${healthPath.startsWith("/") ? healthPath : `/${healthPath}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(healthUrl, { method: "GET", signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function resolveLocalApiCommand(localBaseUrl: string): { command: string; args: string[]; cwd: string } {
  const apiUrl = trimTrailingSlash(localBaseUrl);
  if (isDev) {
    return {
      command: "dotnet",
      args: ["run", "--project", "webapi/src/Money.HttpApi.Host/Money.HttpApi.Host.csproj", "--urls", apiUrl],
      cwd: process.cwd(),
    };
  }

  const exeName = process.platform === "win32" ? "Money.HttpApi.Host.exe" : "Money.HttpApi.Host";
  const webApiDir = path.join(process.resourcesPath, "dist", "webapi");
  return {
    command: path.join(webApiDir, exeName),
    args: ["--urls", apiUrl],
    cwd: webApiDir,
  };
}

async function ensureLocalApiRunning(localBaseUrl: string, healthPath: string): Promise<boolean> {
  if (await isApiHealthy(localBaseUrl, healthPath)) {
    return true;
  }

  const localCommand = resolveLocalApiCommand(localBaseUrl);
  localApiProcess = spawn(localCommand.command, localCommand.args, {
    cwd: localCommand.cwd,
    stdio: "pipe",
    windowsHide: true,
  });

  localApiProcess.stdout.on("data", (chunk: Buffer) => {
    console.log(`[webapi] ${chunk.toString().trim()}`);
  });
  localApiProcess.stderr.on("data", (chunk: Buffer) => {
    console.error(`[webapi] ${chunk.toString().trim()}`);
  });
  localApiProcess.on("exit", (code) => {
    console.warn(`[webapi] exited with code ${code ?? -1}`);
    localApiProcess = null;
  });

  for (let i = 0; i < HEALTH_RETRY_COUNT; i += 1) {
    if (await isApiHealthy(localBaseUrl, healthPath)) {
      return true;
    }
    await delay(HEALTH_RETRY_INTERVAL_MS);
  }
  return false;
}

async function resolveRuntimeApiConfig(): Promise<RuntimeApiConfig> {
  const settings = loadDesktopSettings();
  const mode = normalizeMode(process.env.MONEY_API_MODE || settings.api.mode);
  const healthPath = process.env.MONEY_API_HEALTH_PATH || settings.api.healthPath;
  const remoteBaseUrl = trimTrailingSlash(
    process.env.MONEY_REMOTE_API_BASE_URL || process.env.PUBLIC_API_BASE_URL || settings.api.remoteBaseUrl,
  );
  const localBaseUrl = trimTrailingSlash(process.env.MONEY_LOCAL_API_BASE_URL || settings.api.localBaseUrl);
  const localEnabled =
    (process.env.MONEY_LOCAL_API_ENABLED || "").trim().length > 0
      ? process.env.MONEY_LOCAL_API_ENABLED?.toLowerCase() !== "false"
      : settings.api.localEnabled;

  if (mode === "remote") {
    return {
      mode,
      effectiveMode: "remote",
      apiBaseUrl: remoteBaseUrl,
      remoteBaseUrl,
      localBaseUrl,
      healthPath,
      localFallbackUsed: false,
    };
  }

  if (mode === "local") {
    const localReady = await ensureLocalApiRunning(localBaseUrl, healthPath);
    if (!localReady) {
      throw new Error("Local API mode is enabled but local API failed to start.");
    }
    return {
      mode,
      effectiveMode: "local",
      apiBaseUrl: localBaseUrl,
      remoteBaseUrl,
      localBaseUrl,
      healthPath,
      localFallbackUsed: false,
    };
  }

  const remoteHealthy = await isApiHealthy(remoteBaseUrl, healthPath);
  if (remoteHealthy) {
    return {
      mode,
      effectiveMode: "remote",
      apiBaseUrl: remoteBaseUrl,
      remoteBaseUrl,
      localBaseUrl,
      healthPath,
      localFallbackUsed: false,
    };
  }

  if (!localEnabled) {
    return {
      mode,
      effectiveMode: "remote",
      apiBaseUrl: remoteBaseUrl,
      remoteBaseUrl,
      localBaseUrl,
      healthPath,
      localFallbackUsed: false,
    };
  }

  const localReady = await ensureLocalApiRunning(localBaseUrl, healthPath);
  if (localReady) {
    return {
      mode,
      effectiveMode: "local",
      apiBaseUrl: localBaseUrl,
      remoteBaseUrl,
      localBaseUrl,
      healthPath,
      localFallbackUsed: true,
    };
  }

  return {
    mode,
    effectiveMode: "remote",
    apiBaseUrl: remoteBaseUrl,
    remoteBaseUrl,
    localBaseUrl,
    healthPath,
    localFallbackUsed: false,
  };
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 700,
    // autoHideMenuBar: !isDev,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: join(__dirname, "preload.cjs"),
    },
  });
  if (isDev) {
    await win.loadURL(DEV_SERVER);
  } else {
    await win.loadFile(resolveHtmlPath("index.html"));
  }

  win.on("closed", () => (win = null));
}

app.whenReady().then(async () => {
  runtimeApiConfig = await resolveRuntimeApiConfig();
  console.log(`[runtime] settings file=${desktopSettingsFilePath}`);
  console.log(
    `[runtime] api mode=${runtimeApiConfig.mode} effective=${runtimeApiConfig.effectiveMode} base=${runtimeApiConfig.apiBaseUrl}`,
  );
  await createWindow();
});

app.on("window-all-closed", () => {
  // macOS: typical behavior is to keep app running until Cmd+Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Example round-trip:
ipcMain.handle("ping", async () => ({
  message: "pong from main",
  time: Date.now(),
}));

ipcMain.handle("runtime:get-api-config", async (): Promise<RuntimeApiConfig> => {
  if (!runtimeApiConfig) {
    runtimeApiConfig = await resolveRuntimeApiConfig();
  }
  return runtimeApiConfig;
});

ipcMain.handle("runtime:get-settings-file-path", async (): Promise<string> => {
  if (!desktopSettingsFilePath) {
    loadDesktopSettings();
  }
  return desktopSettingsFilePath;
});

app.on("before-quit", () => {
  if (localApiProcess) {
    localApiProcess.kill();
    localApiProcess = null;
  }
});
