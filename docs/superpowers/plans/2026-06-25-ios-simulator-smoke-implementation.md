# iOS Simulator Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `npm run ios:smoke`，让 LOOP iOS WebView app 可以在本机 iOS Simulator 中自动构建、安装、启动并保存截图证据。

**Architecture:** 用一个 Node 内置模块脚本包装 `xcodebuild` 与 `xcrun simctl`，不引入外部依赖。`ios:release-check` 只做静态守门，真正启动 simulator 的重操作由 `ios:smoke` 手动或阶段验证时运行。

**Tech Stack:** Node.js ESM、npm scripts、xcodebuild、xcrun simctl、Xcode iOS Simulator。

---

### Task 1: 新增失败检查

**Files:**
- Modify: `scripts/verify-ios-release-readiness.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: 写失败检查**

在 `scripts/verify-ios-release-readiness.mjs` 中新增读取对象：

```js
const packageJsonPath = join(root, "package.json");
const smokeScriptPath = join(root, "scripts", "ios-simulator-smoke.mjs");
const gitignorePath = join(root, ".gitignore");
```

并新增读取：

```js
const packageJson = readRequired(packageJsonPath, "package.json");
const smokeScript = readRequired(smokeScriptPath, "iOS Simulator smoke 脚本");
const gitignore = readRequired(gitignorePath, ".gitignore");
```

在材料文档检查后新增：

```js
requireIncludes(packageJson, "\"ios:smoke\"", "package.json");

for (const expected of ["xcodebuild", "simctl", "install", "launch", "screenshot"]) {
  requireIncludes(smokeScript, expected, "ios-simulator-smoke.mjs");
}

for (const expected of [".loop-build/", ".loop-artifacts/"]) {
  requireIncludes(gitignore, expected, ".gitignore");
}

requireIncludes(readinessDoc, "npm run ios:smoke", "ios-testflight-readiness.md");
```

- [ ] **Step 2: 运行失败检查并确认 RED**

Run:

```sh
npm run ios:release-check
```

Expected: FAIL，原因是 `scripts/ios-simulator-smoke.mjs` 缺失或 `package.json` 还没有 `ios:smoke`。

- [ ] **Step 3: 提交失败检查**

```sh
git add scripts/verify-ios-release-readiness.mjs
git commit -m "新增 iOS Simulator smoke 失败检查"
```

### Task 2: 实现 smoke 脚本与 npm 入口

**Files:**
- Create: `scripts/ios-simulator-smoke.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: 新增 npm script**

在 `package.json` 的 `scripts` 中新增：

```json
"ios:smoke": "node scripts/ios-simulator-smoke.mjs"
```

- [ ] **Step 2: 新增 smoke 脚本**

创建 `scripts/ios-simulator-smoke.mjs`，职责是：

```js
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
```

脚本必须包含这些函数：

```js
function run(command, args, options = {}) {}
function runAllowingAlreadyBooted(command, args) {}
function listDevices() {}
function chooseDevice(devices) {}
function ensureFile(path, label) {}
function decodePngMetrics(path) {}
async function waitForRenderedScreenshot(udid) {}
```

脚本必须执行：

```js
xcodebuild -project ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj -scheme LoopCityWebViewApp -destination platform=iOS Simulator,id=<UDID> -derivedDataPath .loop-build/ios-smoke/DerivedData CODE_SIGNING_ALLOWED=NO build
xcrun simctl boot <UDID>
xcrun simctl bootstatus <UDID> -b
xcrun simctl install <UDID> <app path>
xcrun simctl launch <UDID> com.verarun.loopcity.webview
xcrun simctl io <UDID> screenshot <screenshot path>
```

- [ ] **Step 3: 更新忽略目录**

在 `.gitignore` 增加：

```gitignore
.loop-build/
.loop-artifacts/
```

- [ ] **Step 4: 运行 release check 并确认 GREEN**

Run:

```sh
npm run ios:release-check
```

Expected: PASS，可带已有 `DEVELOPMENT_TEAM` warning。

- [ ] **Step 5: 运行实际 smoke**

Run:

```sh
npm run ios:smoke
```

Expected: PASS，并生成 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`；如果先截到白屏或启动过渡黑屏，脚本会继续轮询直到像素分布显示 WebView 首屏已渲染。

- [ ] **Step 6: 提交实现**

```sh
git add package.json .gitignore scripts/ios-simulator-smoke.mjs
git commit -m "接入 iOS Simulator smoke"
```

### Task 3: 更新发布文档与项目状态

**Files:**
- Modify: `docs/release/ios-testflight-readiness.md`
- Modify: `docs/project/CURRENT_STATE.md`

- [ ] **Step 1: 更新 release 文档**

在 `docs/release/ios-testflight-readiness.md` 中记录：

```md
### iOS Simulator smoke

`npm run ios:smoke` 会在本机 simulator 中构建、安装并启动 WebView app，截图输出到 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`。

这个命令用于 repo 级启动 smoke，不代表 TestFlight 上传或真机权限验证完成。
```

- [ ] **Step 2: 更新当前状态**

在 `docs/project/CURRENT_STATE.md` 中新增阶段 3D-0：

```md
阶段 3D-0 已完成：iOS Simulator smoke 已建立。

- `npm run ios:smoke` 会构建 Debug simulator app、安装、启动并保存截图。
- 输出目录是 `.loop-artifacts/ios-smoke/`，构建缓存是 `.loop-build/ios-smoke/`，均不进入 git。
- 这只证明 simulator 可启动和首屏可截图；TestFlight 上传、真实签名和真机权限 smoke 仍是后续人工/阶段任务。
```

- [ ] **Step 3: 运行完整验证**

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
```

Expected: 全部 PASS；`ios:release-check` 允许已有 `DEVELOPMENT_TEAM` warning。

- [ ] **Step 4: 提交文档状态**

```sh
git add docs/release/ios-testflight-readiness.md docs/project/CURRENT_STATE.md
git commit -m "记录 iOS Simulator smoke 阶段状态"
```
