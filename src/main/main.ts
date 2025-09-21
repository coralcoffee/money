import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
const devUrl = process.env.DEV_SERVER_URL || "http://127.0.0.1:3000";

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  try {
    if (isDev) {
      await win.loadURL(devUrl);
      win.webContents.openDevTools({ mode: "detach" });
    } else {
      const indexHtml = path.join(__dirname, "../renderer/index.html");
      await win.loadFile(indexHtml);
    }
  } catch (error) {
    console.error("Failed to load window content:", error);
  }

  win.on("closed", () => {
    win = null;
  });
}

// Simple IPC example
ipcMain.handle("ping", async () => {
  return { time: Date.now(), message: "pong from main" };
});

app.whenReady().then(async () => {
  await createWindow();
  
  app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
