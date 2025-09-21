// electron/util.ts
export function getAppTitle() {
  return "Electron + Rsbuild Demo";
}

export function isDev() {
  return process.env.NODE_ENV !== "production";
}
