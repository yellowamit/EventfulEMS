const { spawn } = require("child_process");
const path = require("path");

// Ensure C:\Windows\System32 is in PATH on Windows to avoid spawn ENOENT errors
if (process.platform === "win32") {
  const system32 = "C:\\Windows\\System32";
  const paths = (process.env.PATH || "").split(path.delimiter);
  const containsSystem32 = paths.some(
    (p) => p.trim().toLowerCase() === system32.toLowerCase()
  );
  if (!containsSystem32) {
    process.env.PATH = `${process.env.PATH}${path.delimiter}${system32}`;
  }
}

function startWorkspace(name) {
  // Spawn the workspace dev script
  const child = spawn("npm", ["run", "dev", "--workspace", name], {
    shell: true,
    stdio: "pipe",
    env: process.env,
  });

  // Prefix output lines with [api] or [client]
  child.stdout.on("data", (data) => {
    const output = data.toString().trim();
    if (output) {
      output.split("\n").forEach((line) => {
        console.log(`[${name}] ${line}`);
      });
    }
  });

  child.stderr.on("data", (data) => {
    const output = data.toString().trim();
    if (output) {
      output.split("\n").forEach((line) => {
        console.error(`[${name}] ${line}`);
      });
    }
  });

  child.on("close", (code) => {
    console.log(`[${name}] Server exited with code ${code}`);
    process.exit(code || 0);
  });

  return child;
}

console.log("Starting development servers in parallel...");
const apiChild = startWorkspace("api");
const clientChild = startWorkspace("client");

// Clean up child processes on exit
const cleanup = () => {
  console.log("\nShutting down dev servers...");
  try {
    apiChild.kill();
  } catch (e) {}
  try {
    clientChild.kill();
  } catch (e) {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
