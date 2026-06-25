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
  "LoopCityWebViewApp/Web/data/loop-data-v0.1.js",
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

const rootData = readFileSync(join(root, "data", "loop-data-v0.1.js"), "utf8");
const bundledData = readFileSync(join(appRoot, "LoopCityWebViewApp", "Web", "data", "loop-data-v0.1.js"), "utf8");
if (rootData !== bundledData) {
  throw new Error("iOS 打包数据资产不同步：data/loop-data-v0.1.js");
}

const webViewScreen = readFileSync(join(appRoot, "LoopCityWebViewApp", "WebViewScreen.swift"), "utf8");
for (const expected of ["WKWebView", "loadFileURL", "allowsBackForwardNavigationGestures"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift must include ${expected}`);
  }
}
for (const expected of ["WKUserContentController", "WKUserScript", "LoopNative", "loopNative", "WKScriptMessageHandler"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift must include native bridge piece: ${expected}`);
  }
}
for (const expected of ["loopApiBaseURL", "LOOP_API_BASE_URL", "dataset.apiBase"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 API base 注入：${expected}`);
  }
}
for (const expected of ["camera.capture", "photo.pick", "loopnative:photo-result", "UIImagePickerController", "PHPickerViewController"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native photo bridge：${expected}`);
  }
}
for (const expected of ["location.request", "loopnative:location-result", "CLLocationManager", "CLLocationManagerDelegate"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native location bridge：${expected}`);
  }
}
for (const expected of ["share.open", "loopnative:share-result", "UIActivityViewController"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native share bridge：${expected}`);
  }
}

const script = readFileSync(join(root, "script.js"), "utf8");
for (const expected of ["installNativeShellBridge", "loopnative:ready", "nativeShell"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js must include native shell bridge hook: ${expected}`);
  }
}

const bridgeRegistry = readFileSync(join(root, "docs", "architecture", "native-bridge-registry.md"), "utf8");
for (const expected of ["ready", "haptic", "camera.capture", "photo.pick", "location.request", "share.open"]) {
  if (!bridgeRegistry.includes(`\`${expected}\``)) {
    throw new Error(`native-bridge-registry.md 必须记录 bridge message：${expected}`);
  }
}
for (const expected of ["loopnative:photo-result", "invalid-payload", "encode-failed", "unavailable", "cancelled"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 photo bridge 结果：${expected}`);
  }
}
for (const expected of ["loopnative:location-result", "denied", "restricted", "timeout", "invalid-payload"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 location bridge 结果：${expected}`);
  }
}
for (const expected of ["loopnative:share-result", "cancelled", "invalid-payload", "unavailable", "failed"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 share bridge 结果：${expected}`);
  }
}

for (const expected of ["LOOP_NATIVE_BRIDGE_MESSAGES", "ready", "haptic"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js 必须定义 bridge registry 标记：${expected}`);
  }
}

const info = readFileSync(join(appRoot, "LoopCityWebViewApp", "Info.plist"), "utf8");
for (const expected of ["NSCameraUsageDescription", "NSPhotoLibraryUsageDescription", "NSLocationWhenInUseUsageDescription", "UILaunchStoryboardName", "UIViewControllerBasedStatusBarAppearance"]) {
  if (!info.includes(expected)) {
    throw new Error(`Info.plist must include ${expected}`);
  }
}
if (!info.includes("LoopAPIBaseURL")) {
  throw new Error("Info.plist must include LoopAPIBaseURL");
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
