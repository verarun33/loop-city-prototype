# iOS Screenshot Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `npm run ios:screenshots`，把 LOOP iOS WebView app 的登录首屏截图稳定输出成 App Store 材料基线。

**Architecture:** 让 `ios-simulator-smoke.mjs` 支持自定义截图输出路径；新增 `ios-screenshot-pack.mjs` 批量调用 smoke 脚本并生成 manifest。`ios:release-check` 只做静态守门，真正截图由 `ios:screenshots` 运行。

**Tech Stack:** Node.js ESM、npm scripts、xcodebuild、xcrun simctl、PNG header 读取。

---

### Task 1: 新增截图包失败检查

**Files:**
- Modify: `scripts/verify-ios-release-readiness.mjs`

- [ ] **Step 1: 写失败检查**

在 `scripts/verify-ios-release-readiness.mjs` 中新增：

```js
const screenshotPackScriptPath = join(root, "scripts", "ios-screenshot-pack.mjs");
```

读取：

```js
const screenshotPackScript = readRequired(screenshotPackScriptPath, "iOS screenshot pack 脚本");
```

新增检查：

```js
requireIncludes(packageJson, "\"ios:screenshots\"", "package.json");
requireIncludes(smokeScript, "LOOP_IOS_SMOKE_SCREENSHOT_PATH", "ios-simulator-smoke.mjs");

for (const expected of ["LOOP_IOS_SCREENSHOT_DEVICES", "manifest.json", "ios-screenshots", "spawnSync"]) {
  requireIncludes(screenshotPackScript, expected, "ios-screenshot-pack.mjs");
}

requireIncludes(readinessDoc, "npm run ios:screenshots", "ios-testflight-readiness.md");
requireIncludes(materialsDoc, ".loop-artifacts/ios-screenshots/", "ios-app-store-materials.md");
```

- [ ] **Step 2: 运行失败检查并确认 RED**

Run:

```sh
npm run ios:release-check
```

Expected: FAIL，原因是 `scripts/ios-screenshot-pack.mjs` 缺失或 `package.json` 缺少 `ios:screenshots`。

- [ ] **Step 3: 提交失败检查**

```sh
git add scripts/verify-ios-release-readiness.mjs
git commit -m "新增 iOS 截图包失败检查"
```

### Task 2: 实现截图包脚本

**Files:**
- Modify: `scripts/ios-simulator-smoke.mjs`
- Create: `scripts/ios-screenshot-pack.mjs`
- Modify: `package.json`
- Modify: `docs/release/ios-testflight-readiness.md`
- Modify: `docs/release/ios-app-store-materials.md`

- [ ] **Step 1: 让 smoke 支持自定义截图路径**

把 `scripts/ios-simulator-smoke.mjs` 的截图路径改成：

```js
const screenshotPath =
  process.env.LOOP_IOS_SMOKE_SCREENSHOT_PATH || join(screenshotDir, "loop-city-ios-smoke.png");
```

- [ ] **Step 2: 新增 npm script**

在 `package.json` 中新增：

```json
"ios:screenshots": "node scripts/ios-screenshot-pack.mjs"
```

- [ ] **Step 3: 新增截图包脚本**

创建 `scripts/ios-screenshot-pack.mjs`，职责：

```js
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
```

脚本必须包含：

```js
const defaultDevices = ["iPhone 17 Pro Max", "iPhone 17 Pro"];
function slugifyDeviceName(name) {}
function readPngSize(path) {}
function runSmokeForDevice(device) {}
```

每个设备写入：

```text
.loop-artifacts/ios-screenshots/<slug>/login.png
```

最后写入：

```text
.loop-artifacts/ios-screenshots/manifest.json
```

- [ ] **Step 4: 更新发布文档**

在 `docs/release/ios-testflight-readiness.md` 中记录：

```md
- App Store 截图包命令：`npm run ios:screenshots`
```

在 `docs/release/ios-app-store-materials.md` 的截图相关段落记录：

```md
自动截图包输出目录：`.loop-artifacts/ios-screenshots/`。当前只生成登录首屏基线，不代表最终 App Store 提交截图完成。
```

- [ ] **Step 5: 运行 release check 并确认 GREEN**

Run:

```sh
npm run ios:release-check
```

Expected: PASS，可带已有 `DEVELOPMENT_TEAM` warning。

- [ ] **Step 6: 运行截图包生成**

Run:

```sh
npm run ios:screenshots
```

Expected: PASS，生成两张 PNG 和 `manifest.json`。

- [ ] **Step 7: 提交实现**

```sh
git add package.json scripts/ios-simulator-smoke.mjs scripts/ios-screenshot-pack.mjs docs/release/ios-testflight-readiness.md docs/release/ios-app-store-materials.md
git commit -m "接入 iOS 截图包自动化"
```

### Task 3: 更新当前状态并完整验证

**Files:**
- Modify: `docs/project/CURRENT_STATE.md`

- [ ] **Step 1: 更新当前状态**

新增阶段 3D-1：

```md
阶段 3D-1 已完成：iOS App Store 截图包自动化底座已建立。

- `npm run ios:screenshots` 会复用 simulator smoke，默认生成 `iPhone 17 Pro Max` 和 `iPhone 17 Pro` 的登录首屏截图。
- 输出目录是 `.loop-artifacts/ios-screenshots/`，并生成 `manifest.json`。
- 这仍不是最终 App Store 截图；后续需要补登录后首页、地图、通行证、我的和记录页面。
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

- [ ] **Step 3: 提交状态**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "记录 iOS 截图包阶段状态"
```
