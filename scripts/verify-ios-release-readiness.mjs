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

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}
console.log("iOS TestFlight readiness repo checks passed.");
