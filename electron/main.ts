import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";

const isDev = process.env.NODE_ENV !== "production";
const DEV_SERVER = process.env.DEV_SERVER || "http://localhost:3000";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    await win.loadURL(DEV_SERVER);
    // win.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = join(process.cwd(), "dist", "webui", "index.html");
    await win.loadFile(indexHtml);
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
