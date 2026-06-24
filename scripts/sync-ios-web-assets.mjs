import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const webRoot = join(root, "ios", "LoopCityWebViewApp", "LoopCityWebViewApp", "Web");
const webDataRoot = join(webRoot, "data");

mkdirSync(webRoot, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg"]) {
  copyFileSync(join(root, file), join(webRoot, file));
}

rmSync(webDataRoot, { force: true, recursive: true });
mkdirSync(webDataRoot, { recursive: true });
copyFileSync(join(root, "data", "loop-data-v0.1.js"), join(webDataRoot, "loop-data-v0.1.js"));

console.log("Synced web prototype assets into iOS WebView app.");
