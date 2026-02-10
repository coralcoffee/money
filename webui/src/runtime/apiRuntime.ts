type RuntimeMode = "remote" | "local" | "auto";
type EffectiveMode = "remote" | "local";

export type RuntimeApiConfig = {
  mode: RuntimeMode;
  effectiveMode: EffectiveMode;
  apiBaseUrl: string;
  remoteBaseUrl: string;
  localBaseUrl: string;
  healthPath: string;
  localFallbackUsed: boolean;
};

const defaultApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.PUBLIC_API_BASE_URL ?? "";
let runtimeApiBaseUrl = defaultApiBaseUrl;
let runtimeConfig: RuntimeApiConfig | null = null;

export function getApiBaseUrl(): string {
  return runtimeApiBaseUrl;
}

export function setRuntimeApiConfig(config: RuntimeApiConfig): void {
  runtimeConfig = config;
  runtimeApiBaseUrl = config.apiBaseUrl || defaultApiBaseUrl;
}

export function getRuntimeApiConfig(): RuntimeApiConfig | null {
  return runtimeConfig;
}
