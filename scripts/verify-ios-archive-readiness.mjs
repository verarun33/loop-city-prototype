import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function readRequired(path, label) {
  if (!existsSync(path)) throw new Error(`${label} 缺失：${path}`);
  return readFileSync(path, "utf8");
}

function requireIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} 必须包含：${expected}`);
}

const packageJson = readRequired(join(root, "package.json"), "package.json");
const archiveScript = readRequired(join(root, "scripts", "ios-archive.mjs"), "iOS archive 脚本");
const exportTemplate = readRequired(
  join(root, "ios", "LoopCityWebViewApp", "ExportOptions.testflight.plist.template"),
  "ExportOptions 模板"
);
const archiveDoc = readRequired(join(root, "docs", "release", "ios-archive-and-upload.md"), "iOS archive 手册");
const readinessDoc = readRequired(join(root, "docs", "release", "ios-testflight-readiness.md"), "TestFlight readiness 文档");
const gitignore = readRequired(join(root, ".gitignore"), ".gitignore");

for (const expected of ["\"ios:archive:check\"", "\"ios:archive\"", "\"ios:export\"", "ios:archive:check"]) {
  requireIncludes(packageJson, expected, "package.json");
}

for (const expected of [
  "xcodebuild",
  "archive",
  "-exportArchive",
  "LOOP_IOS_DEVELOPMENT_TEAM",
  "LOOP_IOS_ARCHIVE_PATH",
  "LOOP_IOS_EXPORT_PATH",
  "ExportOptions.plist",
  "app-store-connect"
]) {
  requireIncludes(archiveScript, expected, "ios-archive.mjs");
}

for (const expected of [
  "__LOOP_IOS_EXPORT_METHOD__",
  "__LOOP_IOS_DEVELOPMENT_TEAM__",
  "__LOOP_IOS_BUNDLE_ID__"
]) {
  requireIncludes(exportTemplate, expected, "ExportOptions.testflight.plist.template");
}

for (const expected of [
  "LOOP_IOS_DEVELOPMENT_TEAM",
  "npm run ios:archive",
  "npm run ios:export",
  "App Store Connect",
  "TestFlight"
]) {
  requireIncludes(archiveDoc, expected, "ios-archive-and-upload.md");
}

requireIncludes(readinessDoc, "npm run ios:archive", "ios-testflight-readiness.md");
requireIncludes(readinessDoc, "docs/release/ios-archive-and-upload.md", "ios-testflight-readiness.md");
requireIncludes(gitignore, ".loop-artifacts/", ".gitignore");

console.log("iOS archive readiness checks passed.");
