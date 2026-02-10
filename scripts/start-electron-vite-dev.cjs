const { spawn } = require("node:child_process");

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn("electron-vite", ["dev"], {
  stdio: "inherit",
  shell: true,
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
