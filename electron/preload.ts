import { contextBridge, ipcRenderer } from "electron";

type Api = {
  ping: () => Promise<{ time: number; message: string }>;
};

const api: Api = {
  ping: () => ipcRenderer.invoke("ping"),
};

declare global {
  interface Window {
    api: Api;
  }
}

contextBridge.exposeInMainWorld("api", api);
