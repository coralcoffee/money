import { mkdirSync, cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outMain = resolve(__dirname, "../dist/main");
mkdirSync(outMain, { recursive: true });

// Transpile TS for main & preload using ts-node/tsc? We’ll bundle by tsconfig emit.
// For simplicity here we copy source and rely on ts-node/register is NOT recommended.
// Better: compile with tsc just for main/preload.

console.log("Compiling main & preload with tsc...");

import("node:child_process").then(({ execSync }) => {
  execSync("tsc -p tsconfig.main.json", { stdio: "inherit" });
});

// Copy renderer index.html already in dist/renderer via rsbuild
console.log("Renderer built to dist/renderer");
