import { spawn } from "node:child_process";
import process from "node:process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [];

function start(name, cwd, args) {
  const child = spawn(npmCmd, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    if (shuttingDown) return;
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
}

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("CipherFlow client", process.cwd(), ["run", "dev:client"]);
start("Fezzi app", process.cwd(), ["run", "dev:fezzi"]);
