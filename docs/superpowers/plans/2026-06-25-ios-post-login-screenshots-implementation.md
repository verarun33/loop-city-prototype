# iOS 登录后截图场景 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `npm run ios:screenshots` 默认生成登录首屏、今日首页、地图页、我的页和我的记录 sticky 表头共 5 个截图场景。

**Architecture:** 继续复用现有 iOS Simulator smoke 和 WebView-first 架构。iOS shell 只负责把截图场景环境变量变成本地 `index.html` 查询参数；Web 层只在白名单场景中进入 demo 登录态和目标页面；截图包脚本负责设备和场景的组合输出。

**Tech Stack:** Node.js ESM、SwiftUI/WKWebView、xcrun simctl、localStorage/sessionStorage、PNG header/metrics 读取。

---

## File Structure

- `scripts/verify-ios-webview-wrapper.mjs`：iOS WebView wrapper 和 Web 场景启动器的静态守门。
- `scripts/verify-ios-release-readiness.mjs`：截图包、smoke 脚本和发布材料的静态守门。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`：读取 `LOOP_SCREENSHOT_SCENARIO`，安全拼接 `loopScreenshotScenario` 查询参数。
- `scripts/ios-simulator-smoke.mjs`：支持 `LOOP_IOS_SMOKE_SCENARIO`，通过 `SIMCTL_CHILD_LOOP_SCREENSHOT_SCENARIO` 传给 app。
- `script.js`：新增截图场景白名单和 `applyScreenshotScenario()`，复用现有 demo 用户和视图切换。
- `scripts/ios-screenshot-pack.mjs`：从设备循环扩展成设备 × 场景循环，并更新 manifest。
- `docs/project/CURRENT_STATE.md`：记录阶段 3D-2 的完成状态、截图数量和验证结果。

## Assumptions

- 当前 `simctl launch` 不支持 `--env`，环境变量必须通过 `SIMCTL_CHILD_` 前缀传给被启动的 app。
- `login` 场景必须显式清除 auth session，否则连续截图时前一个 demo 登录态可能污染登录首屏。
- 本阶段不做像素级页面识别，只沿用现有 PNG metrics 防止空白、系统帧和未渲染画面。

### Task 1: 新增登录后截图场景失败检查

**Files:**
- Modify: `scripts/verify-ios-webview-wrapper.mjs`
- Modify: `scripts/verify-ios-release-readiness.mjs`

- [ ] **Step 1: 扩展 WebView wrapper 静态检查**

在 `scripts/verify-ios-webview-wrapper.mjs` 的 `webViewScreen` 检查区域，紧跟 API base 检查后加入：

```js
for (const expected of ["LOOP_SCREENSHOT_SCENARIO", "loopScreenshotScenario", "screenshotScenarioLaunchURL"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须支持截图场景参数：${expected}`);
  }
}
```

在 `script` 检查区域，紧跟 `installNativeShellBridge` 检查后加入：

```js
for (const expected of ["SCREENSHOT_SCENARIOS", "applyScreenshotScenario", "loopScreenshotScenario", "profile-records", "dataset.screenshotScenario"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js 必须实现截图场景启动器：${expected}`);
  }
}
```

- [ ] **Step 2: 扩展 release readiness 静态检查**

在 `scripts/verify-ios-release-readiness.mjs` 的 smoke script 检查区域，紧跟 `LOOP_IOS_SMOKE_SCREENSHOT_PATH` 后加入：

```js
requireIncludes(smokeScript, "LOOP_IOS_SMOKE_SCENARIO", "ios-simulator-smoke.mjs");
requireIncludes(smokeScript, "SIMCTL_CHILD_LOOP_SCREENSHOT_SCENARIO", "ios-simulator-smoke.mjs");
```

在 screenshot pack script 检查区域，把当前 expected 数组：

```js
for (const expected of ["LOOP_IOS_SCREENSHOT_DEVICES", "manifest.json", "ios-screenshots", "spawnSync"]) {
  requireIncludes(screenshotPackScript, expected, "ios-screenshot-pack.mjs");
}
```

替换为：

```js
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
```

- [ ] **Step 3: 运行失败检查并确认 RED**

Run:

```sh
npm run ios:release-check
```

Expected: FAIL，错误包含 `WebViewScreen.swift 必须支持截图场景参数` 或 `ios-simulator-smoke.mjs 必须包含：LOOP_IOS_SMOKE_SCENARIO`。

- [ ] **Step 4: 提交失败检查**

Run:

```sh
git add scripts/verify-ios-webview-wrapper.mjs scripts/verify-ios-release-readiness.mjs
git commit -m "新增 iOS 登录后截图失败检查"
```

### Task 2: 接入 iOS shell 与 smoke 场景参数

**Files:**
- Modify: `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`
- Modify: `scripts/ios-simulator-smoke.mjs`

- [ ] **Step 1: 让 WebView 加载带场景参数的本地 URL**

在 `WebViewScreen.swift` 的 `updateUIView` 后加入：

```swift
    private var sanitizedScreenshotScenario: String {
        let rawValue: String
        if let environmentValue = ProcessInfo.processInfo.environment["LOOP_SCREENSHOT_SCENARIO"] {
            rawValue = environmentValue
        } else {
            rawValue = ""
        }
        let trimmed = rawValue.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !trimmed.isEmpty else {
            return ""
        }
        guard trimmed.range(of: #"^[a-z0-9-]+$"#, options: .regularExpression) != nil else {
            return ""
        }
        return trimmed
    }

    private func screenshotScenarioLaunchURL(for indexURL: URL) -> URL {
        let scenario = sanitizedScreenshotScenario
        guard !scenario.isEmpty else {
            return indexURL
        }
        guard var components = URLComponents(url: indexURL, resolvingAgainstBaseURL: false) else {
            return indexURL
        }
        components.queryItems = [URLQueryItem(name: "loopScreenshotScenario", value: scenario)]
        if let url = components.url {
            return url
        }
        return indexURL
    }
```

把 `loadLocalPrototype(in:)` 末尾：

```swift
        webView.loadFileURL(indexURL, allowingReadAccessTo: webDirectory)
```

替换为：

```swift
        webView.loadFileURL(screenshotScenarioLaunchURL(for: indexURL), allowingReadAccessTo: webDirectory)
```

- [ ] **Step 2: 让 smoke 脚本可向 app 传场景**

在 `scripts/ios-simulator-smoke.mjs` 的 `preferredDeviceName` 后加入：

```js
const screenshotScenario = String(process.env.LOOP_IOS_SMOKE_SCENARIO || "").trim();
```

把 `run(command, args, options = {})` 中的 `spawnSync` 配置扩展为：

```js
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: options.env ? { ...process.env, ...options.env } : process.env
  });
```

在 `runAllowingAlreadyBooted` 后加入：

```js
function appLaunchEnvironment() {
  if (!screenshotScenario) return {};
  return {
    SIMCTL_CHILD_LOOP_SCREENSHOT_SCENARIO: screenshotScenario
  };
}
```

把 `main()` 中的启动命令：

```js
  run("xcrun", ["simctl", "launch", device.udid, bundleId]);
```

替换为：

```js
  run("xcrun", ["simctl", "launch", device.udid, bundleId], { env: appLaunchEnvironment() });
```

- [ ] **Step 3: 运行 iOS 静态检查并确认 Task 1 的部分错误消失**

Run:

```sh
npm run ios:check
```

Expected: FAIL。`WebViewScreen.swift 必须支持截图场景参数` 不再出现；失败应继续指向 `script.js 必须实现截图场景启动器`。

- [ ] **Step 4: 提交 iOS 场景参数接入**

Run:

```sh
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift scripts/ios-simulator-smoke.mjs
git commit -m "接入 iOS 截图场景参数"
```

### Task 3: 接入 Web 截图场景启动器

**Files:**
- Modify: `script.js`

- [ ] **Step 1: 新增截图场景白名单常量**

在 `PROFILE_RECORD_PAGE_SIZE` 后加入：

```js
const SCREENSHOT_SCENARIOS = Object.freeze(["login", "home", "atlas", "folio", "profile-records"]);
```

- [ ] **Step 2: 新增场景读取和执行函数**

在 `loginWithCredentials()` 后、`continueRegisterAccount()` 前加入：

```js
function screenshotScenarioFromURL() {
  try {
    return new URLSearchParams(window.location.search).get("loopScreenshotScenario") || "";
  } catch {
    return "";
  }
}

function knownScreenshotScenario(value) {
  return SCREENSHOT_SCENARIOS.includes(value) ? value : "";
}

function scrollProfileRecordsForScreenshot() {
  const stickyHead = document.querySelector(".profile-record-sticky-head");
  if (!stickyHead) return;
  const frameBox = dom.appFrame.getBoundingClientRect();
  const headBox = stickyHead.getBoundingClientRect();
  const targetTop = dom.appFrame.scrollTop + headBox.top - frameBox.top - 2;
  dom.appFrame.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  syncRecordScrollFloat();
}

function afterScreenshotRender(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function applyScreenshotScenario() {
  const requestedScenario = screenshotScenarioFromURL().trim().toLowerCase();
  const scenario = knownScreenshotScenario(requestedScenario) || "login";
  if (!requestedScenario) return;
  document.documentElement.dataset.screenshotScenarioRequested = requestedScenario;

  if (scenario === "login") {
    clearSession();
    showAuthGate("login");
    document.documentElement.dataset.screenshotScenario = "login";
    return;
  }

  const demoUser = ensureDemoUser();
  setAuthenticatedUser(demoUser, true);
  if (scenario === "home") switchView("home");
  else if (scenario === "atlas") switchView("atlas");
  else switchView("folio");

  afterScreenshotRender(() => {
    if (scenario === "profile-records") scrollProfileRecordsForScreenshot();
    document.documentElement.dataset.screenshotScenario = scenario;
  });
}
```

- [ ] **Step 3: 在初始化末尾调用场景启动器**

把文件末尾：

```js
schedulePhotoSyncRetry();
render();
```

替换为：

```js
schedulePhotoSyncRetry();
render();
applyScreenshotScenario();
```

- [ ] **Step 4: 运行 iOS wrapper 静态检查确认 GREEN**

Run:

```sh
npm run ios:check
```

Expected: PASS。此时 `ios:release-check` 仍会等待 Task 4 的截图包场景扩展。

- [ ] **Step 5: 提交 Web 场景启动器**

Run:

```sh
git add script.js
git commit -m "接入 Web 登录后截图场景"
```

### Task 4: 扩展截图包为设备 × 场景输出

**Files:**
- Modify: `scripts/ios-screenshot-pack.mjs`

- [ ] **Step 1: 新增默认场景列表**

在 `defaultDevices` 后加入：

```js
const defaultScreens = ["login", "home", "atlas", "folio", "profile-records"];
const screens = (process.env.LOOP_IOS_SCREENSHOT_SCENARIOS || defaultScreens.join(","))
  .split(",")
  .map((screen) => screen.trim())
  .filter(Boolean);
```

- [ ] **Step 2: 把单设备截图函数改成设备和场景组合**

把 `function runSmokeForDevice(device) { ... }` 整个函数替换为：

```js
function runSmokeForDeviceAndScreen(device, screen) {
  const slug = slugifyDeviceName(device);
  const outputPath = join(outputRoot, slug, `${screen}.png`);
  mkdirSync(dirname(outputPath), { recursive: true });

  const result = spawnSync("node", ["scripts/ios-simulator-smoke.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      LOOP_IOS_SMOKE_DEVICE: device,
      LOOP_IOS_SMOKE_SCENARIO: screen,
      LOOP_IOS_SMOKE_SCREENSHOT_PATH: outputPath
    },
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`截图生成失败：${device} / ${screen}`);
  if (!existsSync(outputPath)) throw new Error(`截图缺失：${outputPath}`);

  const size = readPngSize(outputPath);
  return {
    device,
    slug,
    screen,
    scenario: screen,
    path: outputPath,
    ...size
  };
}
```

- [ ] **Step 3: 更新 manifest 生成逻辑**

把 manifest 构造：

```js
const manifest = {
  generatedAt: new Date().toISOString(),
  note: "当前为登录首屏基线截图，不代表最终 App Store 提交截图完成。",
  screenshots: devices.map(runSmokeForDevice)
};
```

替换为：

```js
const screenshots = devices.flatMap((device) =>
  screens.map((screen) => runSmokeForDeviceAndScreen(device, screen))
);

const manifest = {
  generatedAt: new Date().toISOString(),
  note: "当前为自动化产品页面基线截图，不代表最终 App Store 提交截图完成。",
  devices,
  screens,
  screenshots
};
```

把输出循环：

```js
for (const screenshot of manifest.screenshots) {
  console.log(`- ${screenshot.device}: ${screenshot.width}x${screenshot.height}, ${screenshot.path}`);
}
```

替换为：

```js
for (const screenshot of manifest.screenshots) {
  console.log(`- ${screenshot.device} / ${screenshot.screen}: ${screenshot.width}x${screenshot.height}, ${screenshot.path}`);
}
```

- [ ] **Step 4: 运行 release readiness 静态检查确认 GREEN**

Run:

```sh
npm run ios:release-check
```

Expected: PASS，允许已有 `DEVELOPMENT_TEAM` warning。

- [ ] **Step 5: 运行截图包单设备单场景快速验证**

Run:

```sh
LOOP_IOS_SCREENSHOT_DEVICES="iPhone 17 Pro" LOOP_IOS_SCREENSHOT_SCENARIOS="login" npm run ios:screenshots
```

Expected: PASS，生成 `.loop-artifacts/ios-screenshots/iphone-17-pro/login.png`，manifest 的 `screens` 为 `["login"]`。

- [ ] **Step 6: 运行截图包单设备五场景验证**

Run:

```sh
LOOP_IOS_SCREENSHOT_DEVICES="iPhone 17 Pro" npm run ios:screenshots
```

Expected: PASS，生成 `login.png`、`home.png`、`atlas.png`、`folio.png`、`profile-records.png` 五张 PNG。

- [ ] **Step 7: 提交截图包场景扩展**

Run:

```sh
git add scripts/ios-screenshot-pack.mjs
git commit -m "扩展 iOS 截图包登录后场景"
```

### Task 5: 更新项目状态并完整验证

**Files:**
- Modify: `docs/project/CURRENT_STATE.md`

- [ ] **Step 1: 更新当前状态文件**

在 `docs/project/CURRENT_STATE.md` 的已完成阶段列表和下一步任务区域加入 3D-2：

```md
阶段 3D-2 已完成：iOS 登录后截图场景自动化已建立。

- `npm run ios:screenshots` 默认生成 `login`、`home`、`atlas`、`folio` 和 `profile-records` 五个场景。
- 默认设备仍是 `iPhone 17 Pro Max` 和 `iPhone 17 Pro`，因此默认截图数量是 10 张。
- iOS shell 只在 `LOOP_SCREENSHOT_SCENARIO` 存在时给本地 `index.html` 附加 `loopScreenshotScenario` 查询参数，普通 app 启动行为不变。
- Web 场景启动器只使用白名单场景和 demo 用户数据，不接真实账号，也不改变线上原型。
```

在验证记录里加入：

```md
- `npm run ios:screenshots` 已生成 2 个设备 × 5 个场景的截图包，并写入 `.loop-artifacts/ios-screenshots/manifest.json`。
```

- [ ] **Step 2: 运行完整验证**

Run:

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run photo:persistence-check
npm run ios:check
npm run ios:release-check
npm run ios:build
npm run ios:smoke
npm run ios:screenshots
```

Expected: 全部 PASS；`ios:release-check` 允许已有 `DEVELOPMENT_TEAM` warning。

- [ ] **Step 3: 检查最终截图 manifest**

Run:

```sh
node -e 'const m=require("./.loop-artifacts/ios-screenshots/manifest.json"); console.log(m.screens.join(",")); console.log(m.screenshots.length);'
```

Expected:

```text
login,home,atlas,folio,profile-records
10
```

- [ ] **Step 4: 提交阶段状态**

Run:

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "记录 iOS 登录后截图阶段状态"
```

- [ ] **Step 5: 推送 main**

Run:

```sh
git push origin main
```

Expected: 推送成功，`main` 不再领先 `origin/main`。
