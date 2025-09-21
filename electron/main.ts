import { app, BrowserWindow, ipcMain } from "electron";
import path, { join } from "node:path";

const isDev = process.env.NODE_ENV !== "production";
const DEV_SERVER = process.env.DEV_SERVER || "http://localhost:3000";

let win: BrowserWindow | null = null;

function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 3000;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 700,
    autoHideMenuBar: !isDev,
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  // macOS: typical behavior is to keep app running until Cmd+Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Example round-trip:
ipcMain.handle("ping", async () => "pong from main");
