import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./src/renderer/index.html",
  },
  source: {
    entry: { index: "./src/renderer/main.tsx" },
    define: {
      __DEV__: process.env.NODE_ENV !== "production",
    },
  },
  output: {
    distPath: { root: "dist/renderer" },
    assetPrefix: "/",
  },
});
