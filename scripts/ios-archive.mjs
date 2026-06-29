import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const mode = process.argv[2] || "";
const appRoot = join(root, "ios", "LoopCityWebViewApp");
const projectPath = join(appRoot, "LoopCityWebViewApp.xcodeproj");
const templatePath = join(appRoot, "ExportOptions.testflight.plist.template");
const archivePath = process.env.LOOP_IOS_ARCHIVE_PATH || join(root, ".loop-artifacts", "ios-archive", "LoopCityWebViewApp.xcarchive");
const exportPath = process.env.LOOP_IOS_EXPORT_PATH || join(root, ".loop-artifacts", "ios-archive", "export");
const generatedExportOptionsPath = join(root, ".loop-artifacts", "ios-archive", "ExportOptions.plist");
const developmentTeam = String(process.env.LOOP_IOS_DEVELOPMENT_TEAM || "").trim();
const exportMethod = String(process.env.LOOP_IOS_EXPORT_METHOD || "app-store-connect").trim();
const bundleId = String(process.env.LOOP_IOS_BUNDLE_ID || "com.verarun.loopcity.webview").trim();

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    encoding: "utf8"
  });
  if (result.error) fail(`${command} 启动失败：${result.error.message}`);
  if (result.status !== 0) fail(`${command} 退出失败，阶段：${mode}`);
}

function requireTeam() {
  if (!developmentTeam) {
    fail("缺少 LOOP_IOS_DEVELOPMENT_TEAM。请先在本机环境变量中设置 Apple Developer Team ID，再运行真实 archive/export。");
  }
}

function ensureDirectory(path) {
  mkdirSync(path, { recursive: true });
}

function generateExportOptions() {
  const template = readFileSync(templatePath, "utf8");
  const output = template
    .replaceAll("__LOOP_IOS_EXPORT_METHOD__", exportMethod)
    .replaceAll("__LOOP_IOS_DEVELOPMENT_TEAM__", developmentTeam)
    .replaceAll("__LOOP_IOS_BUNDLE_ID__", bundleId);
  ensureDirectory(dirname(generatedExportOptionsPath));
  writeFileSync(generatedExportOptionsPath, output);
}

function runArchive() {
  requireTeam();
  ensureDirectory(dirname(archivePath));
  run("npm", ["run", "ios:check"]);
  run("xcodebuild", [
    "-project",
    projectPath,
    "-scheme",
    "LoopCityWebViewApp",
    "-configuration",
    "Release",
    "-destination",
    "generic/platform=iOS",
    "-archivePath",
    archivePath,
    `DEVELOPMENT_TEAM=${developmentTeam}`,
    "CODE_SIGN_STYLE=Automatic",
    "archive"
  ]);
  console.log(`iOS archive generated: ${archivePath}`);
}

function runExport() {
  requireTeam();
  if (!existsSync(archivePath)) {
    fail(`archive 不存在：${archivePath}。请先运行 npm run ios:archive。`);
  }
  generateExportOptions();
  ensureDirectory(exportPath);
  run("xcodebuild", [
    "-exportArchive",
    "-archivePath",
    archivePath,
    "-exportPath",
    exportPath,
    "-exportOptionsPlist",
    generatedExportOptionsPath
  ]);
  console.log(`iOS export generated: ${exportPath}`);
}

if (mode === "archive") {
  runArchive();
} else if (mode === "export") {
  runExport();
} else {
  fail("用法：node scripts/ios-archive.mjs archive|export");
}
