# iOS 归档与 TestFlight 上传准备 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 repo 化的 iOS archive/export 准备链路，让 Apple Team 配好后可以按脚本生成 TestFlight 候选产物，并在 Team 缺失时给出清楚失败。

**Architecture:** 继续沿用 Node.js ESM 脚本和 Xcode project。`verify-ios-archive-readiness.mjs` 负责静态守门；`ios-archive.mjs` 负责 archive/export 命令编排；ExportOptions 模板进入 git，真实 Team ID 和生成后的 plist 留在 `.loop-artifacts/`。

**Tech Stack:** Node.js ESM、xcodebuild、Xcode automatic signing、property list XML、npm scripts。

---

## File Structure

- `scripts/verify-ios-archive-readiness.mjs`：新增静态检查，确认 archive/export 命令、脚本、模板和文档都存在。
- `scripts/ios-archive.mjs`：新增 archive/export runner，读取环境变量，生成 export plist，并调用 `xcodebuild`。
- `ios/LoopCityWebViewApp/ExportOptions.testflight.plist.template`：新增 exportOptions 模板，使用占位符避免提交 Team ID。
- `package.json`：新增 `ios:archive:check`、`ios:archive`、`ios:export`，并让 `ios:release-check` 串联 archive check。
- `docs/release/ios-archive-and-upload.md`：新增中文手册。
- `docs/release/ios-testflight-readiness.md`：补充 archive/export 命令和手册链接。
- `docs/release/ios-app-store-materials.md`：更新截图/上传材料说明。
- `docs/project/CURRENT_STATE.md`：阶段结束时记录 3E-0 状态和验证结果。

## Assumptions

- 当前没有可提交进 repo 的 Apple Team ID；真实 archive/export 命令必须从环境变量读取 `LOOP_IOS_DEVELOPMENT_TEAM`。
- `xcodebuild archive` 针对 `generic/platform=iOS` 需要真实签名配置，未设置 Team 时失败是正确行为。
- `.loop-artifacts/` 已被 `.gitignore` 忽略，生成的 `.xcarchive`、ExportOptions.plist 和 export 产物不进入 git。

### Task 1: 新增 archive readiness 失败检查

**Files:**
- Create: `scripts/verify-ios-archive-readiness.mjs`
- Modify: `package.json`
- Modify: `scripts/verify-ios-release-readiness.mjs`

- [ ] **Step 1: 新增 archive readiness 静态脚本**

Create `scripts/verify-ios-archive-readiness.mjs` with checks for files and strings that do not exist yet:

```js
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
```

- [ ] **Step 2: 在 release readiness 中串联 archive check**

In `scripts/verify-ios-release-readiness.mjs`, add:

```js
const archiveReadinessScriptPath = join(root, "scripts", "verify-ios-archive-readiness.mjs");
```

Then read it:

```js
const archiveReadinessScript = readRequired(archiveReadinessScriptPath, "iOS archive readiness 脚本");
```

Add string checks:

```js
for (const expected of ["LOOP_IOS_DEVELOPMENT_TEAM", "ios-archive-and-upload.md", "ExportOptions.testflight.plist.template"]) {
  requireIncludes(archiveReadinessScript, expected, "verify-ios-archive-readiness.mjs");
}
```

- [ ] **Step 3: 在 package.json 加 RED 命令**

Add:

```json
"ios:archive:check": "node scripts/verify-ios-archive-readiness.mjs"
```

Update:

```json
"ios:release-check": "npm run ios:check && node scripts/verify-ios-release-readiness.mjs && npm run ios:archive:check"
```

- [ ] **Step 4: 运行 RED**

Run:

```sh
npm run ios:release-check
```

Expected: FAIL with `iOS archive 脚本 缺失` or `ExportOptions 模板 缺失`.

- [ ] **Step 5: Commit RED**

Run:

```sh
git add package.json scripts/verify-ios-release-readiness.mjs scripts/verify-ios-archive-readiness.mjs
git commit -m "新增 iOS 归档准备失败检查"
```

### Task 2: 新增 archive/export runner 和模板

**Files:**
- Create: `scripts/ios-archive.mjs`
- Create: `ios/LoopCityWebViewApp/ExportOptions.testflight.plist.template`
- Modify: `package.json`

- [ ] **Step 1: 新增 ExportOptions 模板**

Create `ios/LoopCityWebViewApp/ExportOptions.testflight.plist.template`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>__LOOP_IOS_EXPORT_METHOD__</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>teamID</key>
  <string>__LOOP_IOS_DEVELOPMENT_TEAM__</string>
  <key>destination</key>
  <string>export</string>
  <!-- Bundle ID tracked by the archive script: __LOOP_IOS_BUNDLE_ID__ -->
</dict>
</plist>
```

- [ ] **Step 2: 新增 archive/export runner**

Create `scripts/ios-archive.mjs` with:

```js
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
    "-project", projectPath,
    "-scheme", "LoopCityWebViewApp",
    "-configuration", "Release",
    "-destination", "generic/platform=iOS",
    "-archivePath", archivePath,
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
    "-archivePath", archivePath,
    "-exportPath", exportPath,
    "-exportOptionsPlist", generatedExportOptionsPath
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
```

- [ ] **Step 3: 在 package.json 加真实命令**

Add:

```json
"ios:archive": "node scripts/ios-archive.mjs archive",
"ios:export": "node scripts/ios-archive.mjs export"
```

- [ ] **Step 4: 验证 runner 行为**

Run:

```sh
node --check scripts/ios-archive.mjs
node scripts/ios-archive.mjs archive
node scripts/ios-archive.mjs export
```

Expected:
- `node --check` PASS.
- `archive` and `export` exit 1 with a clear `缺少 LOOP_IOS_DEVELOPMENT_TEAM` message.
- `npm run ios:archive:check` still fails until Task 3 creates `docs/release/ios-archive-and-upload.md`.

- [ ] **Step 5: Commit implementation**

Run:

```sh
git add package.json scripts/ios-archive.mjs ios/LoopCityWebViewApp/ExportOptions.testflight.plist.template
git commit -m "接入 iOS 归档导出脚本"
```

### Task 3: 补齐 release 手册

**Files:**
- Create: `docs/release/ios-archive-and-upload.md`
- Modify: `docs/release/ios-testflight-readiness.md`
- Modify: `docs/release/ios-app-store-materials.md`

- [ ] **Step 1: 新增中文手册**

Create `docs/release/ios-archive-and-upload.md` with sections:

```markdown
# LOOP iOS 归档、导出与 TestFlight 上传手册

日期：2026-06-29
状态：本机准备链路已建立，真实上传需要 Apple Developer Team 和 App Store Connect 权限。

## 本阶段能自动检查什么

...
```

The file must include exact commands:

```sh
npm run ios:release-check
export LOOP_IOS_DEVELOPMENT_TEAM="<你的 Team ID>"
npm run ios:archive
npm run ios:export
```

- [ ] **Step 2: 更新 TestFlight readiness 文档**

Add current local state bullets for:

```markdown
- 真机归档准备检查：`npm run ios:archive:check`
- 真机归档命令：`npm run ios:archive`
- 导出命令：`npm run ios:export`
- 归档和上传手册：`docs/release/ios-archive-and-upload.md`
```

Also add a manual todo:

```markdown
- 归档导出：设置 `LOOP_IOS_DEVELOPMENT_TEAM` 后运行 `npm run ios:archive` 和 `npm run ios:export`。
```

- [ ] **Step 3: 更新材料草稿**

In `docs/release/ios-app-store-materials.md`, add an upload handoff note that exported artifacts live under `.loop-artifacts/ios-archive/export/` after successful `npm run ios:export`.

- [ ] **Step 4: 验证文档被静态检查覆盖**

Run:

```sh
npm run ios:archive:check
npm run ios:release-check
```

Expected: both PASS.

- [ ] **Step 5: Commit docs**

Run:

```sh
git add docs/release/ios-archive-and-upload.md docs/release/ios-testflight-readiness.md docs/release/ios-app-store-materials.md
git commit -m "记录 iOS 归档上传手册"
```

### Task 4: 更新阶段状态并做收尾验证

**Files:**
- Modify: `docs/project/CURRENT_STATE.md`

- [ ] **Step 1: 更新 CURRENT_STATE**

Add stage `3E-0` with:

- `npm run ios:archive:check` exists.
- `npm run ios:archive` and `npm run ios:export` exist.
- Team ID still manual and not committed.
- No TestFlight upload has happened.

- [ ] **Step 2: Run final verification**

Run:

```sh
npm test
npm run ios:release-check
npm run ios:build
```

Expected:
- All commands exit 0.
- `ios:release-check` may still print the known `DEVELOPMENT_TEAM` warning.

- [ ] **Step 3: Commit state**

Run:

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "更新 iOS 归档阶段状态"
```

- [ ] **Step 4: Final status**

Run:

```sh
git status --short --branch
git log --oneline --decorate -6
```

Expected: clean worktree on `codex/ios-release-archive-prep-20260629`.
