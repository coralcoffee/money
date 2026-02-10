import { contextBridge, ipcRenderer } from "electron";

type Api = {
  ping: () => Promise<{ time: number; message: string }>;
  getRuntimeConfig: () => Promise<{
    mode: "remote" | "local" | "auto";
    effectiveMode: "remote" | "local";
    apiBaseUrl: string;
    remoteBaseUrl: string;
    localBaseUrl: string;
    healthPath: string;
    localFallbackUsed: boolean;
  }>;
  getSettingsFilePath: () => Promise<string>;
};

const api: Api = {
  ping: () => ipcRenderer.invoke("ping"),
  getRuntimeConfig: () => ipcRenderer.invoke("runtime:get-api-config"),
  getSettingsFilePath: () => ipcRenderer.invoke("runtime:get-settings-file-path"),
};

declare global {
  interface Window {
    api: Api;
  }
}

contextBridge.exposeInMainWorld("api", api);
