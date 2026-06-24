import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const appRoot = join(root, "ios", "LoopCityWebViewApp");

const requiredFiles = [
  "LoopCityWebViewApp.xcodeproj/project.pbxproj",
  "LoopCityWebViewApp/LoopCityWebViewApp.swift",
  "LoopCityWebViewApp/WebViewScreen.swift",
  "LoopCityWebViewApp/Info.plist",
  "LoopCityWebViewApp/LaunchScreen.storyboard",
  "LoopCityWebViewApp/Assets.xcassets/AppIcon.appiconset/loop-city-app-icon-1024.png",
  "LoopCityWebViewApp/Web/index.html",
  "LoopCityWebViewApp/Web/styles.css",
  "LoopCityWebViewApp/Web/script.js",
  "LoopCityWebViewApp/Web/favicon.svg"
];

const missing = requiredFiles.filter((file) => !existsSync(join(appRoot, file)));
if (missing.length) {
  throw new Error(`Missing iOS WebView wrapper files:\n${missing.join("\n")}`);
}

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg"]) {
  const source = readFileSync(join(root, file), "utf8");
  const bundled = readFileSync(join(appRoot, "LoopCityWebViewApp", "Web", file), "utf8");
  if (source !== bundled) {
    throw new Error(`Bundled iOS Web asset is out of sync: ${file}`);
  }
}

const webViewScreen = readFileSync(join(appRoot, "LoopCityWebViewApp", "WebViewScreen.swift"), "utf8");
for (const expected of ["WKWebView", "loadFileURL", "allowsBackForwardNavigationGestures"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift must include ${expected}`);
  }
}

const info = readFileSync(join(appRoot, "LoopCityWebViewApp", "Info.plist"), "utf8");
for (const expected of ["NSCameraUsageDescription", "NSPhotoLibraryUsageDescription", "UILaunchStoryboardName", "UIViewControllerBasedStatusBarAppearance"]) {
  if (!info.includes(expected)) {
    throw new Error(`Info.plist must include ${expected}`);
  }
}

const project = readFileSync(join(appRoot, "LoopCityWebViewApp.xcodeproj", "project.pbxproj"), "utf8");
for (const expected of ["Web", "LaunchScreen.storyboard", "LoopCityWebViewApp", "PRODUCT_BUNDLE_IDENTIFIER"]) {
  if (!project.includes(expected)) {
    throw new Error(`project.pbxproj must reference ${expected}`);
  }
}

const appIcon = readFileSync(join(appRoot, "LoopCityWebViewApp", "Assets.xcassets", "AppIcon.appiconset", "Contents.json"), "utf8");
if (!appIcon.includes("loop-city-app-icon-1024.png")) {
  throw new Error("AppIcon.appiconset must reference loop-city-app-icon-1024.png");
}

console.log("iOS WebView wrapper checks passed.");
