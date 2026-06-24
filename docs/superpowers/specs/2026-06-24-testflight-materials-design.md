# LOOP TestFlight 人工材料设计

日期：2026-06-24

## 背景

阶段 2D 已经建立 `npm run ios:release-check`，可以检查 repo 内 iOS 发布准备项，并明确当前 `DEVELOPMENT_TEAM` 仍是人工待办。下一步需要把 TestFlight 和 App Store Connect 会用到的人工材料先集中到 repo，避免后续靠聊天记录拼凑。

本阶段不是最终提交给 Apple 的文案，也不会登录 App Store Connect。它只准备一份可持续迭代的中文材料草稿，并让 release check 能发现材料文件缺失或栏目不完整。

## 目标

- 新增 `docs/release/ios-app-store-materials.md`，集中记录 TestFlight / App Store Connect 人工材料草稿。
- 扩展 `scripts/verify-ios-release-readiness.mjs`，要求材料文档存在，并包含关键栏目。
- 更新 `docs/release/ios-testflight-readiness.md`，把材料文档纳入人工待办路径。
- 阶段结束时更新 `docs/project/CURRENT_STATE.md`。

## 非目标

- 不把草稿视为最终 Apple 审核文案。
- 不生成截图图片、不启动模拟器截图、不制作 App Store Connect 页面。
- 不填写真实支持 URL、隐私政策 URL、Copyright、SKU 或 Team ID。
- 不修改 app metadata、Bundle ID、签名、版本号或权限文案。
- 不加入 CI、fastlane 或 App Store Connect API。

## 设计

### 1. 材料文档

新增 `docs/release/ios-app-store-materials.md`，使用中文记录：

- App Store Connect 基础信息草稿：名称、主语言、类别、Bundle ID 当前值、SKU 待 Vera 确认。
- TestFlight beta 信息：测试说明、首个 build 变更说明、内部测试关注点。
- App Review notes 草稿：说明 WebView-first 架构、权限用途、当前原型边界。
- 截图清单：建议截图的页面和顺序，但不生成图片。
- 隐私标签草稿：把相机、相册、定位、账号、支付、分析和后端状态拆开，标记哪些仍需最终确认。
- 人工确认项：支持 URL、隐私政策 URL、Team ID、SKU、正式 Bundle ID、生产后端。

### 2. release-check 扩展

`scripts/verify-ios-release-readiness.mjs` 新增 `materialsDocPath`，读取 `docs/release/ios-app-store-materials.md`。

脚本要求材料文档包含：

- `App Store Connect 基础信息`
- `TestFlight Beta 信息`
- `App Review notes`
- `截图清单`
- `隐私标签草稿`
- `人工确认项`
- `WebView-first`
- `LOOP 城市回路`

如果文档缺失或缺栏目，`npm run ios:release-check` 失败。真实 Apple 账号和外部 URL 仍只作为人工待办，不作为脚本失败。

### 3. readiness 文档串联

`docs/release/ios-testflight-readiness.md` 的人工待办补充材料文档路径，让后续窗口知道先更新草稿，再去 App Store Connect 填写。

### 4. 当前状态

`docs/project/CURRENT_STATE.md` 追加阶段 2E：TestFlight 人工材料草稿已建立。下一步可继续真实签名配置、截图生产或照片记录后端持久化。

## 验证

本阶段完成前必须在 feature worktree 跑：

```sh
npm run ios:release-check
npm run check
npm test
npm run ios:build
```

合并到 `main` 后必须重新跑：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:release-check
npm run ios:build
```

## 风险和边界

- 草稿不是最终上架材料，需要 Vera 在 App Store Connect 前逐条确认。
- 隐私标签必须等真实账号、支付、照片持久化和后端数据流确认后再最终填写。
- 截图清单不是截图产物，后续仍需要真实设备或模拟器截图工作。
