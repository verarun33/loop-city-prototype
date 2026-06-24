# LOOP TestFlight Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repo-level TestFlight readiness audit that records what is locally verifiable and what still requires manual Apple/App Store work.

**Architecture:** Keep the app WebView-first and add one Node.js verification script beside the existing `scripts/verify-*.mjs` checks. The script validates local iOS metadata and release documentation, then reports warnings for external items that cannot be verified on this machine.

**Tech Stack:** Node.js ES modules, npm scripts, Xcode project metadata, Info.plist text inspection, Markdown release documentation.

---

## 文件结构

新增：

- `scripts/verify-ios-release-readiness.mjs`：repo 级 TestFlight readiness 守门脚本。
- `docs/release/ios-testflight-readiness.md`：中文 TestFlight 准备清单。

修改：

- `package.json`：新增 `ios:release-check` 命令。
- `docs/project/CURRENT_STATE.md`：记录阶段 2D 已完成和下一步。

不修改：

- `ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj/project.pbxproj`：本阶段不改签名或 Bundle ID。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`：本阶段只审计，不改权限文案或版本号。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Assets.xcassets/AppIcon.appiconset/loop-city-app-icon-1024.png`：本阶段不改图标视觉。

## 任务 1：新增 TestFlight readiness 失败检查

**文件：**
- 修改：`package.json`
- 新增：`scripts/verify-ios-release-readiness.mjs`

**接口：**
- 消耗：当前 iOS app metadata。
- 产出：`npm run ios:release-check` 命令。此任务结束时因为 release 文档还不存在，命令应该失败。

- [ ] **步骤 1：新增 npm 命令**

把 `package.json` 的 scripts 从：

```json
"ios:build": "npm run ios:check && xcodebuild -project ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj -scheme LoopCityWebViewApp -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build"
```

改为：

```json
"ios:build": "npm run ios:check && xcodebuild -project ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj -scheme LoopCityWebViewApp -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build",
"ios:release-check": "npm run ios:check && node scripts/verify-ios-release-readiness.mjs"
```

- [ ] **步骤 2：新增 readiness 脚本**

创建 `scripts/verify-ios-release-readiness.mjs`：

```js
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
  if (!/^\\d+(\\.\\d+){0,2}$/.test(value)) {
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
```

- [ ] **步骤 3：运行 RED 验证**

运行：

```sh
npm run ios:release-check
```

预期失败：

```text
TestFlight readiness 文档 缺失
```

- [ ] **步骤 4：提交失败检查**

```sh
git add package.json scripts/verify-ios-release-readiness.mjs
git commit -m "新增 TestFlight readiness 失败检查"
```

## 任务 2：新增中文 TestFlight 准备清单

**文件：**
- 新增：`docs/release/ios-testflight-readiness.md`

**接口：**
- 消耗：任务 1 的失败检查。
- 产出：`npm run ios:release-check` 通过，且输出 DEVELOPMENT_TEAM warning。

- [ ] **步骤 1：创建 release 文档目录**

```sh
mkdir -p docs/release
```

- [ ] **步骤 2：新增中文清单**

创建 `docs/release/ios-testflight-readiness.md`：

```markdown
# LOOP iOS TestFlight 准备清单

日期：2026-06-24
状态：Repo 级审计已建立，真实 TestFlight 发布尚未开始。

## 当前自动检查

运行：

```sh
npm run ios:release-check
```

这个命令会先运行 `npm run ios:check`，再检查：

- iOS WebView 包内 Web 资产和根目录资产同步。
- `Info.plist` 包含 app 显示名、版本号、build 号、相机/相册/定位权限文案。
- Xcode project 使用 `com.verarun.loopcity.webview` 作为当前 Bundle ID。
- iOS deployment target 是 `17.0`。
- app icon asset 引用 `loop-city-app-icon-1024.png`，且文件是 PNG。
- 本文档包含 TestFlight 前的人工待办。

## 当前本地状态

- Simulator 构建命令：`npm run ios:build`
- 当前构建方式：`CODE_SIGNING_ALLOWED=NO`
- 当前显示名：`LOOP 城市回路`
- 当前版本号：`0.1`
- 当前 build 号：`1`
- 当前 Bundle ID：`com.verarun.loopcity.webview`
- 当前 Apple Developer Team：尚未配置，`DEVELOPMENT_TEAM` 为空。

## TestFlight 前人工待办

- Apple Developer Team：确认团队、Team ID、付费开发者账号状态。
- 签名配置：为 `com.verarun.loopcity.webview` 或正式 Bundle ID 配置 Automatic Signing / provisioning profile。
- App Store Connect：创建 app record，确认 SKU、Bundle ID、名称、主语言和类别。
- 隐私标签：根据最终数据流填写相机、相册、定位、分析、账号和后端数据使用情况。
- 截图：准备 iPhone 尺寸截图，至少覆盖首页、地图/通行证、我的、记录或打卡流程。
- 审核说明：解释 WebView-first 架构、城市路线原型状态、需要的权限用途。
- TestFlight：准备内部测试成员、测试说明和首个 build 的变更说明。
- 生产后端：确认照片记录、用户账号、支付或核销相关数据是否仍是原型本地状态。

## 不要误判

- `npm run ios:build` 通过只说明 Simulator 无签名构建通过，不等于 TestFlight ready。
- `DEVELOPMENT_TEAM` 为空是当前已知人工待办，不能视为发布完成。
- 当前权限文案可用于原型阶段；正式审核前需要按最终功能再读一遍。
- 当前 Bundle ID 是否用于正式上架，需要 Vera 在 Apple Developer 和 App Store Connect 中确认。
```

- [ ] **步骤 3：运行 GREEN 验证**

运行：

```sh
npm run ios:release-check
```

预期：

```text
Warning: DEVELOPMENT_TEAM 为空
iOS TestFlight readiness repo checks passed.
```

- [ ] **步骤 4：提交 release 清单**

```sh
git add docs/release/ios-testflight-readiness.md
git commit -m "记录 TestFlight 准备清单"
```

## 任务 3：更新阶段状态并完整验证

**文件：**
- 修改：`docs/project/CURRENT_STATE.md`

**接口：**
- 消耗：任务 1 和任务 2 的脚本与文档。
- 产出：阶段 2D 状态记录和完整验证通过。

- [ ] **步骤 1：更新 CURRENT_STATE**

在 `docs/project/CURRENT_STATE.md` 中：

- 把“阶段 1、阶段 2A、阶段 2B、阶段 2C 已完成”改为“阶段 1、阶段 2A、阶段 2B、阶段 2C、阶段 2D 已完成”。
- 把最新功能基线改为“阶段 2D TestFlight 准备审计已建立”。
- 在近期关键提交加入：
  - `记录 TestFlight 准备清单`
  - `新增 TestFlight readiness 失败检查`
  - `规划 TestFlight 准备审计`
- 在下一步任务中追加阶段 2D 说明：

```markdown
阶段 2D 已完成：TestFlight 准备审计已建立。项目现在有 `npm run ios:release-check` 用于 repo 级发布前检查，并有 `docs/release/ios-testflight-readiness.md` 明确区分自动检查项和人工发布待办。当前仍未配置 Apple Developer Team，也未上传 TestFlight build。
```

- 在相关文档中加入：
  - `docs/superpowers/specs/2026-06-24-testflight-readiness-design.md`
  - `docs/superpowers/plans/2026-06-24-testflight-readiness-implementation.md`
  - `docs/release/ios-testflight-readiness.md`

- 把下一步改为：

```markdown
下一步可继续规划照片记录真实后端持久化、真实签名配置、TestFlight 人工材料或推送提醒。
```

- [ ] **步骤 2：运行完整验证**

运行：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:release-check
npm run ios:build
```

预期全部 exit 0，其中 `ios:release-check` 可以输出 `DEVELOPMENT_TEAM` warning。

- [ ] **步骤 3：提交阶段状态**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "完成 TestFlight 准备审计阶段状态"
```

## 任务 4：合并回 main

**文件：**
- 无新增修改，执行 git 和验证命令。

- [ ] **步骤 1：确认 feature worktree 干净**

```sh
git status --short --branch
npm test
```

预期：工作区干净，`npm test` exit 0。

- [ ] **步骤 2：在 main 快进合并**

```sh
cd /Users/veraxian/Documents/城市回路
git status --short --branch
git pull --ff-only origin main
git merge --ff-only codex/testflight-readiness-20260624
```

- [ ] **步骤 3：在 main 重新完整验证**

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:release-check
npm run ios:build
```

- [ ] **步骤 4：推送并清理 worktree**

```sh
git push origin main
git worktree remove /Users/veraxian/Documents/城市回路/.worktrees/testflight-readiness-20260624
git worktree prune
git branch -d codex/testflight-readiness-20260624
```
