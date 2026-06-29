import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const appRoot = join(root, "ios", "LoopCityWebViewApp");
const infoPath = join(appRoot, "LoopCityWebViewApp", "Info.plist");
const projectPath = join(appRoot, "LoopCityWebViewApp.xcodeproj", "project.pbxproj");
const appIconContentsPath = join(appRoot, "LoopCityWebViewApp", "Assets.xcassets", "AppIcon.appiconset", "Contents.json");
const appIconPath = join(appRoot, "LoopCityWebViewApp", "Assets.xcassets", "AppIcon.appiconset", "loop-city-app-icon-1024.png");
const readinessDocPath = join(root, "docs", "release", "ios-testflight-readiness.md");
const materialsDocPath = join(root, "docs", "release", "ios-app-store-materials.md");
const packageJsonPath = join(root, "package.json");
const smokeScriptPath = join(root, "scripts", "ios-simulator-smoke.mjs");
const screenshotPackScriptPath = join(root, "scripts", "ios-screenshot-pack.mjs");
const releaseInputsScriptPath = join(root, "scripts", "ios-release-inputs.mjs");
const archiveReadinessScriptPath = join(root, "scripts", "verify-ios-archive-readiness.mjs");
const gitignorePath = join(root, ".gitignore");

const warnings = [];

function readRequired(path, label) {
  if (!existsSync(path)) throw new Error(`${label} 缺失：${path}`);
  return readFileSync(path, "utf8");
}

function requireIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} 必须包含：${expected}`);
}

function extractPlistString(plist, key) {
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`));
  return match?.[1] || "";
}

function requireVersion(value, label) {
  if (!/^\d+(\.\d+){0,2}$/.test(value)) {
    throw new Error(`${label} 版本格式不正确：${value || "(空)"}`);
  }
}

const info = readRequired(infoPath, "Info.plist");
const project = readRequired(projectPath, "Xcode project");
const appIconContents = readRequired(appIconContentsPath, "AppIcon Contents.json");
const readinessDoc = readRequired(readinessDocPath, "TestFlight readiness 文档");
const materialsDoc = readRequired(materialsDocPath, "App Store materials 文档");
const packageJson = readRequired(packageJsonPath, "package.json");
const smokeScript = readRequired(smokeScriptPath, "iOS Simulator smoke 脚本");
const screenshotPackScript = readRequired(screenshotPackScriptPath, "iOS screenshot pack 脚本");
const releaseInputsScript = readRequired(releaseInputsScriptPath, "iOS release inputs 脚本");
const archiveReadinessScript = readRequired(archiveReadinessScriptPath, "iOS archive readiness 脚本");
const gitignore = readRequired(gitignorePath, ".gitignore");

requireIncludes(info, "<string>LOOP 城市回路</string>", "CFBundleDisplayName");
requireIncludes(info, "NSCameraUsageDescription", "Info.plist");
requireIncludes(info, "NSPhotoLibraryUsageDescription", "Info.plist");
requireIncludes(info, "NSLocationWhenInUseUsageDescription", "Info.plist");

requireVersion(extractPlistString(info, "CFBundleShortVersionString"), "CFBundleShortVersionString");
requireVersion(extractPlistString(info, "CFBundleVersion"), "CFBundleVersion");

requireIncludes(project, "PRODUCT_BUNDLE_IDENTIFIER = com.verarun.loopcity.webview;", "Bundle ID");
requireIncludes(project, "IPHONEOS_DEPLOYMENT_TARGET = 17.0;", "iOS deployment target");
requireIncludes(project, "CODE_SIGN_STYLE = Automatic;", "Code signing style");
if (project.includes("DEVELOPMENT_TEAM = \"\";")) {
  warnings.push("DEVELOPMENT_TEAM 为空：这是 TestFlight 前必须人工补齐的签名配置。");
}

requireIncludes(appIconContents, "loop-city-app-icon-1024.png", "AppIcon.appiconset");
const pngSignature = readFileSync(appIconPath).subarray(0, 8).toString("hex");
if (pngSignature !== "89504e470d0a1a0a") {
  throw new Error("App icon 文件不是有效 PNG 签名：loop-city-app-icon-1024.png");
}

for (const expected of ["Apple Developer Team", "App Store Connect", "隐私标签", "截图", "审核说明", "TestFlight"]) {
  requireIncludes(readinessDoc, expected, "ios-testflight-readiness.md");
}

for (const expected of [
  "App Store Connect 基础信息",
  "TestFlight Beta 信息",
  "App Review notes",
  "截图清单",
  "隐私标签草稿",
  "人工确认项",
  "WebView-first",
  "LOOP 城市回路"
]) {
  requireIncludes(materialsDoc, expected, "ios-app-store-materials.md");
}

requireIncludes(packageJson, "\"ios:smoke\"", "package.json");
requireIncludes(packageJson, "\"ios:screenshots\"", "package.json");
requireIncludes(packageJson, "\"ios:inputs\"", "package.json");
requireIncludes(smokeScript, "LOOP_IOS_SMOKE_SCREENSHOT_PATH", "ios-simulator-smoke.mjs");
requireIncludes(smokeScript, "LOOP_IOS_SMOKE_SCENARIO", "ios-simulator-smoke.mjs");
requireIncludes(smokeScript, "SIMCTL_CHILD_LOOP_SCREENSHOT_SCENARIO", "ios-simulator-smoke.mjs");
requireIncludes(smokeScript, "LOOP_IOS_SMOKE_SIMCTL_TIMEOUT_MS", "ios-simulator-smoke.mjs");
requireIncludes(smokeScript, "simctlCommandTimeoutMs", "ios-simulator-smoke.mjs");

for (const expected of [
  "xcodebuild",
  "simctl",
  "install",
  "launch",
  "screenshot",
  "waitForRenderedScreenshot",
  "decodePngMetrics",
  "contentSampleCrop",
  "hasAccentContent",
  "darkRatio",
  "colorfulRatio"
]) {
  requireIncludes(smokeScript, expected, "ios-simulator-smoke.mjs");
}

for (const expected of [".loop-build/", ".loop-artifacts/"]) {
  requireIncludes(gitignore, expected, ".gitignore");
}

requireIncludes(readinessDoc, "npm run ios:smoke", "ios-testflight-readiness.md");
requireIncludes(readinessDoc, "npm run ios:screenshots", "ios-testflight-readiness.md");
requireIncludes(materialsDoc, ".loop-artifacts/ios-screenshots/", "ios-app-store-materials.md");

for (const expected of [
  "LOOP_IOS_SCREENSHOT_DEVICES",
  "LOOP_IOS_SCREENSHOT_SCENARIOS",
  "defaultScreens",
  "profile-records",
  "manifest.json",
  "ios-screenshots",
  "spawnSync"
]) {
  requireIncludes(screenshotPackScript, expected, "ios-screenshot-pack.mjs");
}

for (const expected of ["LOOP_IOS_DEVELOPMENT_TEAM", "ios-archive-and-upload.md", "ExportOptions.testflight.plist.template"]) {
  requireIncludes(archiveReadinessScript, expected, "verify-ios-archive-readiness.mjs");
}

for (const expected of ["neededNow", "beforeArchive", "beforeAppStore", "LOOP_IOS_DEVELOPMENT_TEAM", "ios-release-inputs.json"]) {
  requireIncludes(releaseInputsScript, expected, "ios-release-inputs.mjs");
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}
console.log("iOS TestFlight readiness repo checks passed.");
