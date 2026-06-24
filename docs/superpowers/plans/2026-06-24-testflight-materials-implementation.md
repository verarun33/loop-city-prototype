# LOOP TestFlight Materials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a repo-tracked draft of TestFlight/App Store manual materials and make `ios:release-check` verify that the material set exists.

**Architecture:** Extend the existing release readiness script with one additional Markdown document check. Keep all release copy in `docs/release/` and avoid changing iOS signing, Bundle ID, app metadata, or production behavior.

**Tech Stack:** Node.js ES modules, npm scripts, Markdown release documentation.

---

## 文件结构

新增：

- `docs/release/ios-app-store-materials.md`：TestFlight / App Store Connect 人工材料草稿。

修改：

- `scripts/verify-ios-release-readiness.mjs`：检查材料文档存在和关键栏目。
- `docs/release/ios-testflight-readiness.md`：链接材料草稿。
- `docs/project/CURRENT_STATE.md`：记录阶段 2E。

不修改：

- `ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj/project.pbxproj`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`
- `package.json`

## 任务 1：扩展 release-check 失败检查

**文件：**
- 修改：`scripts/verify-ios-release-readiness.mjs`

**接口：**
- 消耗：阶段 2D 的 release readiness 脚本。
- 产出：`npm run ios:release-check` 因材料文档缺失而失败。

- [ ] **步骤 1：新增材料文档路径**

在 `readinessDocPath` 后加入：

```js
const materialsDocPath = join(root, "docs", "release", "ios-app-store-materials.md");
```

- [ ] **步骤 2：读取材料文档**

在读取 `readinessDoc` 后加入：

```js
const materialsDoc = readRequired(materialsDocPath, "App Store materials 文档");
```

- [ ] **步骤 3：检查材料栏目**

在 readiness 文档关键词检查后加入：

```js
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
```

- [ ] **步骤 4：运行 RED 验证**

运行：

```sh
npm run ios:release-check
```

预期失败：

```text
App Store materials 文档 缺失
```

- [ ] **步骤 5：提交失败检查**

```sh
git add scripts/verify-ios-release-readiness.mjs
git commit -m "新增 TestFlight 材料失败检查"
```

## 任务 2：新增 TestFlight / App Store 人工材料草稿

**文件：**
- 新增：`docs/release/ios-app-store-materials.md`
- 修改：`docs/release/ios-testflight-readiness.md`

**接口：**
- 消耗：任务 1 的失败检查。
- 产出：`npm run ios:release-check` 通过。

- [ ] **步骤 1：新增材料文档**

创建 `docs/release/ios-app-store-materials.md`：

```markdown
# LOOP iOS App Store / TestFlight 材料草稿

日期：2026-06-24
状态：草稿，供 TestFlight 和 App Store Connect 填写前复核。

## App Store Connect 基础信息

- App 名称：LOOP 城市回路
- 主语言：简体中文
- 当前 Bundle ID：`com.verarun.loopcity.webview`
- 类别建议：生活方式 / 旅游
- SKU：需要 Vera 在 App Store Connect 创建 app record 前确认。
- 支持 URL：需要 Vera 确认正式域名或支持页面。
- 隐私政策 URL：需要 Vera 确认正式隐私政策页面。
- Copyright：需要 Vera 确认公司或个人主体。

## TestFlight Beta 信息

测试说明草稿：

LOOP 城市回路是一个城市探索 WebView-first 原型 app。请重点测试首页浏览、城市通行证、兴趣地图、我的页面、照片记录、定位打卡和系统分享入口。

首个 build 变更说明草稿：

- 保留当前移动网页原型的 UI 和交互。
- 接入 iOS WebView app 外壳。
- 接入相机/相册、定位和系统分享 native bridge。
- 建立 TestFlight 前的 repo 级 release 检查。

内部测试关注点：

- 刘海区域、底部工具栏和 WebView 安全区是否正常。
- 相机、相册、定位权限弹窗文案是否容易理解。
- 分享面板是否能打开，并能取消返回。
- Web 原型页面在 iPhone 尺寸下是否仍保持当前视觉。

## App Review notes

LOOP 城市回路当前采用 WebView-first 架构：主要产品界面由本地打包 Web 资产提供，iOS 原生层负责系统能力和 app 外壳。当前原生能力包括相机/相册入口、一次性定位请求和系统分享面板。

权限用途：

- 相机：用于后续保存城市打卡照片。
- 相册：用于从相册选择城市记录照片。
- 定位：用于确认用户是否正在进行城市路线打卡。

当前仍是原型阶段。若提交审核前照片记录、账号、支付或核销改为真实后端，需要同步更新审核说明和隐私标签。

## 截图清单

建议首批截图顺序：

1. 今日首页：展示 LOOP 顶部栏、今日探索和记录列表。
2. 城市通行证：展示进行中的城市通行证和地图折页式卡片。
3. 兴趣地图：展示行进中的兴趣地图或地图列表。
4. 我的页面：展示个人进度、记录和城市探索统计。
5. 路线详情：展示通行证/地图详情和分享入口。

截图生产要求：

- 使用 iPhone 竖屏尺寸。
- 避免遮挡刘海和底部工具栏。
- 保留中文 UI。
- 不展示真实个人隐私信息。

## 隐私标签草稿

需要最终确认的数据类型：

- 定位：当前用于路线打卡确认；需要确认是否保存到后端。
- 照片：当前用于城市记录；需要确认是否上传或只保存在本地。
- 用户内容：打卡记录、照片、备注和路线进度需要根据最终实现填写。
- 购买：城市通行证如接入真实支付，需要补充购买数据。
- 标识符和分析：当前未建立正式埋点；如后续接入需要补充。
- 联系信息：如引入账号登录，需要按账号字段补充。

## 人工确认项

- Apple Developer Team / Team ID
- 正式 Bundle ID
- App Store Connect SKU
- 支持 URL
- 隐私政策 URL
- Copyright 主体
- TestFlight 内部测试成员
- App Review notes 最终稿
- 截图产物
- 生产后端和隐私标签最终状态
```

- [ ] **步骤 2：更新 readiness 文档**

在 `docs/release/ios-testflight-readiness.md` 的“当前自动检查”列表中加入：

```markdown
- TestFlight / App Store Connect 人工材料草稿存在，并包含核心栏目。
```

在“TestFlight 前人工待办”中加入：

```markdown
- 人工材料草稿：先维护 `docs/release/ios-app-store-materials.md`，再把确认后的内容填入 App Store Connect。
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

- [ ] **步骤 4：提交材料草稿**

```sh
git add docs/release/ios-app-store-materials.md docs/release/ios-testflight-readiness.md
git commit -m "记录 TestFlight 人工材料草稿"
```

## 任务 3：更新阶段状态并验证

**文件：**
- 修改：`docs/project/CURRENT_STATE.md`

- [ ] **步骤 1：更新 CURRENT_STATE**

在 `docs/project/CURRENT_STATE.md` 中追加阶段 2E：

```markdown
阶段 2E 已完成：TestFlight / App Store 人工材料草稿已建立。`docs/release/ios-app-store-materials.md` 记录 App Store Connect 基础信息、TestFlight Beta 信息、App Review notes、截图清单、隐私标签草稿和人工确认项；`npm run ios:release-check` 会检查材料文档存在和关键栏目。
```

在相关文档中加入：

- `docs/superpowers/specs/2026-06-24-testflight-materials-design.md`
- `docs/superpowers/plans/2026-06-24-testflight-materials-implementation.md`
- `docs/release/ios-app-store-materials.md`

把下一步改为：

```markdown
下一步可继续规划真实签名配置、截图生产、照片记录真实后端持久化或推送提醒。
```

- [ ] **步骤 2：运行完整验证**

运行：

```sh
npm run ios:release-check
npm run check
npm test
npm run ios:build
```

- [ ] **步骤 3：提交阶段状态**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "完成 TestFlight 人工材料阶段状态"
```

## 任务 4：合并回 main

- [ ] **步骤 1：确认 feature worktree**

```sh
git status --short --branch
npm test
```

- [ ] **步骤 2：快进合并**

```sh
cd /Users/veraxian/Documents/城市回路
git pull --ff-only origin main
git merge --ff-only codex/testflight-materials-20260624
```

- [ ] **步骤 3：主线验证**

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:release-check
npm run ios:build
```

- [ ] **步骤 4：推送并清理**

```sh
git push origin main
git worktree remove /Users/veraxian/Documents/城市回路/.worktrees/testflight-materials-20260624
git worktree prune
git branch -d codex/testflight-materials-20260624
```
