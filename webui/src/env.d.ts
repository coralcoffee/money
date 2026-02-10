/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTHORITY?: string;
  readonly VITE_CLIENT_ID?: string;
  readonly PUBLIC_API_BASE_URL?: string;
  readonly PUBLIC_AUTHORITY?: string;
  readonly PUBLIC_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type RuntimeMode = "remote" | "local" | "auto";
type EffectiveMode = "remote" | "local";

interface RuntimeApiConfig {
  mode: RuntimeMode;
  effectiveMode: EffectiveMode;
  apiBaseUrl: string;
  remoteBaseUrl: string;
  localBaseUrl: string;
  healthPath: string;
  localFallbackUsed: boolean;
}

interface DesktopApiBridge {
  ping: () => Promise<{ time: number; message: string }>;
  getRuntimeConfig: () => Promise<RuntimeApiConfig>;
  getSettingsFilePath: () => Promise<string>;
}

interface Window {
  api?: DesktopApiBridge;
}
