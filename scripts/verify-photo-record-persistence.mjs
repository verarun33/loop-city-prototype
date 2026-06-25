import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const server = readFileSync(join(root, "server.mjs"), "utf8");
const script = readFileSync(join(root, "script.js"), "utf8");
const gitignore = readFileSync(join(root, ".gitignore"), "utf8");

function requireIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} 必须包含：${expected}`);
}

requireIncludes(gitignore, ".loop-data/", ".gitignore");

for (const expected of [
  "/api/photo-records",
  "handlePhotoRecords",
  "savePhotoRecordPayload",
  "PHOTO_TOO_LARGE",
  "DUPLICATE_PHOTO"
]) {
  requireIncludes(server, expected, "server.mjs");
}

for (const expected of [
  "photoRecordApiBase",
  "buildPhotoRecordPayload",
  "syncPhotoRecord",
  "syncStatus",
  "remotePhotoUrl"
]) {
  requireIncludes(script, expected, "script.js");
}

console.log("Photo record persistence checks passed.");
