#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const handleExit = () => {
  console.log("Exiting without error.");
  process.exit();
};

const handleError = (e) => {
  console.error("ERROR! An error was encountered while executing");
  console.error(e);
  console.log("Exiting with error.");
  process.exit(1);
};

process.on("SIGINT", handleExit);
process.on("uncaughtException", handleError);

const rootDir = path.join(__dirname, "..");
const args = process.argv;

const directory = args[2] || "deno-starter";
const targetDir = path.join(process.cwd(), directory);

cp.execSync("curl -fsSL https://deno.land/x/install/install.sh | sh", {
  cwd: rootDir,
  stdio: "inherit",
});

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

fs.writeFileSync(
  path.join(targetDir, "index.js"),
  `import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("Deno App serving on http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}`
);

console.log(`
Deno App successfully created

To start:
mkdir ${directory}
deno run --allow-net index.js

Please sure you added Deno to your $PATH
`);

handleExit();
