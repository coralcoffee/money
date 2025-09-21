import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: { "@": "./renderer/src" },
    entry: { index: "./renderer/src/main.tsx" },
  },
  html: { template: "./renderer/index.html" },
  server: { port: 3000 },
  output: {
    distPath: { root: "dist/renderer" },
  },
});
