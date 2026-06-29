# iOS 归档与 TestFlight 上传准备设计

日期：2026-06-29
阶段：3E-0
范围：LOOP 城市回路 WebView-first Apple app

## 背景

LOOP 当前已经能在 iOS Simulator 中构建、启动、截图，并通过 `npm run ios:release-check` 做 repo 级 TestFlight 准备审计。阶段 3D-2 已把截图包扩展到登录、今日、地图、我的和记录 sticky 表头五个场景。

下一步不是直接声称“可以上架”，而是把真实 TestFlight build 前最容易丢三落四的归档、导出和上传前检查沉淀到 repo：让本地命令清楚说明还缺什么，能在 Apple Team 配好后直接执行 archive/export，也能在 Team 缺失时给出可读失败。

## 已确认边界

- 继续采用 WebView-first，不重写 SwiftUI。
- 不把 Apple Developer Team ID、账号、证书或密码写进 repo。
- 不引入 fastlane、第三方上传工具或新的依赖。
- 不自动登录 App Store Connect，不自动上传 TestFlight。
- 当前阶段只建立本机可验证的归档准备链路和中文操作手册。

## 方案比较

### 推荐方案：Node 脚本包装 xcodebuild archive/export

新增轻量 Node 脚本，复用现有 `scripts/*.mjs` 风格：

- `npm run ios:archive:check`：静态检查 archive/export 脚本、导出模板和文档是否齐全。
- `npm run ios:archive`：读取环境变量后执行 `xcodebuild archive`。
- `npm run ios:export`：读取环境变量后生成临时 `ExportOptions.plist`，再执行 `xcodebuild -exportArchive`。

优点：和现有项目脚本一致；没有新依赖；失败信息可以中文化；Team ID 通过环境变量注入，不进 git。

风险：没有 Apple Developer Team 时无法真正完成 device archive/export，只能做静态和 dry-run 检查。

### 备选方案：只写文档，不写脚本

优点：最快，不会碰构建链路。

缺点：后续仍要靠人工复制命令，容易忘记 archive path、export method、Team ID 和 release-check 顺序，不符合项目“repo 是事实来源”的纪律。

### 备选方案：直接上 fastlane

优点：长期发布自动化更成熟。

缺点：当前项目还没有真实 Apple Team、App Store Connect app record 和证书状态；此时引入 fastlane 会把问题变复杂，也会制造额外凭证管理面。

## 设计

### 脚本入口

`package.json` 新增三个命令：

```json
"ios:archive:check": "node scripts/verify-ios-archive-readiness.mjs",
"ios:archive": "node scripts/ios-archive.mjs archive",
"ios:export": "node scripts/ios-archive.mjs export"
```

`ios:release-check` 继续是总入口，追加运行 `ios:archive:check`。这样发布前审计会覆盖归档链路存在性，但不会在没有 Team ID 时硬跑真实 archive。

### 环境变量

真实归档需要人工提供：

- `LOOP_IOS_DEVELOPMENT_TEAM`：Apple Developer Team ID。脚本不接受空值执行真实 archive/export。

可选覆盖：

- `LOOP_IOS_ARCHIVE_PATH`：默认 `.loop-artifacts/ios-archive/LoopCityWebViewApp.xcarchive`。
- `LOOP_IOS_EXPORT_PATH`：默认 `.loop-artifacts/ios-archive/export`。
- `LOOP_IOS_EXPORT_METHOD`：默认 `app-store-connect`。
- `LOOP_IOS_BUNDLE_ID`：默认 `com.verarun.loopcity.webview`。

### archive 脚本

`scripts/ios-archive.mjs` 只负责命令编排：

- 先运行 `npm run ios:check`，确保 Web 资产已同步并通过 wrapper 检查。
- 校验 `LOOP_IOS_DEVELOPMENT_TEAM` 存在。
- 执行：

```sh
xcodebuild \
  -project ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj \
  -scheme LoopCityWebViewApp \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath .loop-artifacts/ios-archive/LoopCityWebViewApp.xcarchive \
  DEVELOPMENT_TEAM=<Team ID> \
  CODE_SIGN_STYLE=Automatic \
  archive
```

### export 脚本

`scripts/ios-archive.mjs export`：

- 校验 Team ID。
- 校验 archive path 已存在。
- 从模板生成 `.loop-artifacts/ios-archive/ExportOptions.plist`。
- 执行：

```sh
xcodebuild \
  -exportArchive \
  -archivePath .loop-artifacts/ios-archive/LoopCityWebViewApp.xcarchive \
  -exportPath .loop-artifacts/ios-archive/export \
  -exportOptionsPlist .loop-artifacts/ios-archive/ExportOptions.plist
```

生成的 `ExportOptions.plist` 不进入 git；模板进入 git。

### 导出模板

新增：

```text
ios/LoopCityWebViewApp/ExportOptions.testflight.plist.template
```

模板保留占位符：

- `__LOOP_IOS_EXPORT_METHOD__`
- `__LOOP_IOS_DEVELOPMENT_TEAM__`
- `__LOOP_IOS_BUNDLE_ID__`

脚本执行时生成真实 plist，避免把 Team ID 提交到 repo。

### 静态守门

新增 `scripts/verify-ios-archive-readiness.mjs`，检查：

- `package.json` 包含 `ios:archive:check`、`ios:archive`、`ios:export`。
- `ios:release-check` 串联 `ios:archive:check`。
- `scripts/ios-archive.mjs` 包含 `xcodebuild`、`archive`、`-exportArchive`、`LOOP_IOS_DEVELOPMENT_TEAM`、`ExportOptions.plist`。
- export template 存在，并包含三个占位符。
- release 文档包含 archive/export 命令和 Team ID 说明。
- `.gitignore` 包含 `.loop-artifacts/`，确保 archive/export 产物不进 git。

### 文档

新增：

```text
docs/release/ios-archive-and-upload.md
```

内容包括：

- 本阶段能自动做什么。
- 缺 Team ID 时为什么会失败。
- Vera 配好 Apple Developer Team 后如何运行 archive/export。
- 如何把导出的产物上传到 App Store Connect。
- 上传前必须重跑的验证命令。

`docs/release/ios-testflight-readiness.md` 和 `docs/release/ios-app-store-materials.md` 补充指向这份手册。

## 错误处理

- Team ID 为空：脚本退出 1，并提示设置 `LOOP_IOS_DEVELOPMENT_TEAM`。
- archive path 不存在：export 退出 1，并提示先运行 `npm run ios:archive`。
- export method 为空：使用 `app-store-connect`。
- xcodebuild 失败：保持原始输出，脚本只补充命令阶段说明。
- 未生成 IPA：不伪装成功，保留 `.xcarchive` 和 export 输出供人工排查。

## 验证

阶段内 TDD RED：

```sh
npm run ios:release-check
```

预期先失败，因为 archive readiness 脚本或 package command 尚不存在。

实现后运行：

```sh
npm run ios:archive:check
npm run ios:release-check
node scripts/ios-archive.mjs archive
node scripts/ios-archive.mjs export
```

其中最后两个命令在未设置 `LOOP_IOS_DEVELOPMENT_TEAM` 时应以清楚的中文错误退出，而不是静默通过。

阶段收尾运行：

```sh
npm test
npm run ios:release-check
npm run ios:build
```

如时间允许，再运行一条缩小版截图 smoke：

```sh
LOOP_IOS_SMOKE_SIMCTL_TIMEOUT_MS=60000 LOOP_IOS_SCREENSHOT_DEVICES="iPhone 17 Pro" LOOP_IOS_SCREENSHOT_SCENARIOS="login" npm run ios:screenshots
```

## 非目标

- 不提交真实 Team ID。
- 不上传 TestFlight build。
- 不创建 App Store Connect app record。
- 不处理 App Privacy 最终表单。
- 不接入付费、账号或生产照片云存储。
