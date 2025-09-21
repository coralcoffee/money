import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./webui/src/main.tsx" },
  },
  resolve: {
    alias: { "@": "./webui/src" },
  },
  html: { template: "./webui/index.html" },
  server: { port: 3000 },
  output: {
    distPath: {
      root: path.resolve(__dirname, "../dist/webui"),
    },
    filename: {
      js: "[name].[contenthash].js",
    },
    assetPrefix: "./",
  },
});
