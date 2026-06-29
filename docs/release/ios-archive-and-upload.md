# LOOP iOS 归档、导出与 TestFlight 上传手册

日期：2026-06-29
状态：本机准备链路已建立，真实上传需要 Apple Developer Team 和 App Store Connect 权限。

## 本阶段能自动检查什么

`npm run ios:release-check` 现在会覆盖三层准备状态：

- WebView 包装和 Web 资产同步。
- TestFlight readiness / App Store materials 文档存在。
- archive/export 脚本、ExportOptions 模板和本手册存在。

单独检查 archive/export 准备项：

```sh
npm run ios:archive:check
```

这个命令只做 repo 级静态检查，不会调用 Apple 账号，也不会生成真实归档。

## Team ID

真实归档和导出必须先在本机设置 Apple Developer Team ID：

```sh
export LOOP_IOS_DEVELOPMENT_TEAM="<你的 Team ID>"
```

不要把 Team ID 写进 repo、文档示例以外的固定配置、截图或提交信息。当前 Xcode project 的 `DEVELOPMENT_TEAM` 仍保持空值，避免把账号信息固化到仓库。

## 归档

运行：

```sh
npm run ios:release-check
export LOOP_IOS_DEVELOPMENT_TEAM="<你的 Team ID>"
npm run ios:archive
```

默认归档输出：

```text
.loop-artifacts/ios-archive/LoopCityWebViewApp.xcarchive
```

如需覆盖归档路径：

```sh
export LOOP_IOS_ARCHIVE_PATH="/absolute/path/LoopCityWebViewApp.xcarchive"
npm run ios:archive
```

## 导出

归档成功后运行：

```sh
npm run ios:export
```

默认导出输出：

```text
.loop-artifacts/ios-archive/export/
```

脚本会从模板生成：

```text
.loop-artifacts/ios-archive/ExportOptions.plist
```

可选覆盖：

```sh
export LOOP_IOS_EXPORT_METHOD="app-store-connect"
export LOOP_IOS_EXPORT_PATH="/absolute/path/export"
export LOOP_IOS_BUNDLE_ID="com.verarun.loopcity.webview"
npm run ios:export
```

## 上传到 App Store Connect

本阶段不自动上传。导出成功后，可以用 Xcode Organizer 或 Apple Transporter 上传导出的产物。

上传前人工确认：

- Apple Developer Team / Team ID 正确。
- App Store Connect 已创建对应 app record。
- Bundle ID 与 App Store Connect app record 一致。
- `docs/release/ios-app-store-materials.md` 里的测试说明、审核说明、截图和隐私草稿已复核。
- 生产后端、账号、照片、定位、支付或核销状态没有被误写成已完成。

## 常见失败

### 缺少 Team ID

输出类似：

```text
缺少 LOOP_IOS_DEVELOPMENT_TEAM。请先在本机环境变量中设置 Apple Developer Team ID，再运行真实 archive/export。
```

处理方式：设置 `LOOP_IOS_DEVELOPMENT_TEAM` 后重跑。

### archive 不存在

输出类似：

```text
archive 不存在：... 请先运行 npm run ios:archive。
```

处理方式：先完成归档，再导出。

### xcodebuild 签名失败

处理方式：

- 打开 `ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj`。
- 确认 Signing & Capabilities 里的 Team 可用。
- 确认 Bundle ID 在 Apple Developer 和 App Store Connect 中存在。
- 回到终端重跑 `npm run ios:archive`。

## 发布前必须重跑

每次准备上传前运行：

```sh
npm test
npm run ios:release-check
npm run ios:build
```

如需刷新 App Store 截图基线：

```sh
npm run ios:screenshots
```

这些命令通过不等于 TestFlight 已上传；它们只说明 repo、本地 Simulator 构建和发布材料底座处于可复核状态。
