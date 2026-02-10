import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist/desktop",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "desktop/main.ts"),
        },
        output: {
          entryFileNames: "main.cjs",
          format: "cjs",
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist/desktop",
      emptyOutDir: false,
      rollupOptions: {
        input: {
          preload: resolve(__dirname, "desktop/preload.ts"),
        },
        output: {
          entryFileNames: "preload.cjs",
          format: "cjs",
        },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, "webui"),
    plugins: [react()],
    envPrefix: ["VITE_", "PUBLIC_"],
    resolve: {
      alias: {
        "@": resolve(__dirname, "webui/src"),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: resolve(__dirname, "dist/webui"),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, "webui/index.html"),
      },
    },
  },
});
