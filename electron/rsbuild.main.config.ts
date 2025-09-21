import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  source: {
    entry: { main: "./electron/main.ts" },
  },
  output: {
    distPath: { root: "dist/electron" },
    filename: { js: "[name].cjs" },
    target: "node",
  },
  tools: {
    rspack: (config) => {
      config.target = ["electron-main"];
      if (!config.externals) config.externals = {};
      if (typeof config.externals === 'object' && !Array.isArray(config.externals)) {
        config.externals.electron = "commonjs2 electron";
      }
      if (!config.node) config.node = {};
      config.node.__dirname = false;
      config.node.__filename = false;
      if (!config.output) config.output = {};
      config.output.library = { type: "commonjs2" };
      config.devtool =
        process.env.NODE_ENV === "production"
          ? false
          : "eval-cheap-module-source-map";
    },
  },
});
