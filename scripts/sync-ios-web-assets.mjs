import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const webRoot = join(root, "ios", "LoopCityWebViewApp", "LoopCityWebViewApp", "Web");

mkdirSync(webRoot, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg"]) {
  copyFileSync(join(root, file), join(webRoot, file));
}

console.log("Synced web prototype assets into iOS WebView app.");
