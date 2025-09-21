import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: { "@": "./webui/src" },
    entry: { index: "./webui/src/main.tsx" },
  },
  html: { template: "./webui/index.html" },
  server: { port: 3000 },
  output: {
    distPath: { root: "dist/webui" },
  },
});
