# iOS Simulator Smoke 设计

日期：2026-06-25
阶段：3D-0
范围：LOOP 城市回路 WebView-first Apple app

## 背景

当前项目已经有 `npm run ios:build`，可以用关闭签名的 iOS Simulator 目标编译 Xcode 工程。但“能编译”还不等于“能安装、能启动、首屏能被系统渲染”。随着 WebView bridge 增加，相机、定位、分享、通知和 API base 注入都需要一个更贴近真实 App 的本机 smoke 入口。

本阶段只补 repo 内可自动化的 Simulator smoke，不声明 TestFlight 或 App Store 完成，也不要求 Apple Developer Team、真实签名、真机权限弹窗或生产 API。

## 目标

新增 `npm run ios:smoke`：

- 选择一台可用 iOS Simulator。
- 用 `xcodebuild` 构建 Debug simulator app。
- 启动 simulator，安装 app，并启动 bundle id `com.verarun.loopcity.webview`。
- 等待首屏稳定后截图。
- 把截图保存到本地忽略目录，作为人工和后续自动检查证据。

## 非目标

- 不上传 TestFlight。
- 不配置 Apple Developer Team。
- 不新增 Push Notifications capability。
- 不验证真实相机、照片、定位、通知弹窗或 Apple 登录。
- 不替代人工视觉 QA；截图只证明 app 能启动并渲染。

## 方案比较

推荐方案：新增 Node 脚本包装 `xcodebuild` 和 `xcrun simctl`。

优点是和当前项目脚本体系一致，不新增依赖；可以在失败时输出清楚命令；也能放进 `ios:release-check` 做静态存在性检查。

备选方案：使用 Xcode UI 手动运行并截图。

这更接近人工流程，但不可复跑，未来窗口无法从 repo 恢复同样的验证路径。

备选方案：引入 Fastlane 或 xcodebuild 外部封装。

长期可能有价值，但当前项目还没有签名、证书、TestFlight 上传链路；此阶段引入会过重。

## 设计

新增脚本 `scripts/ios-simulator-smoke.mjs`，只依赖 Node 内置模块。

默认设备选择顺序：

1. 如果设置 `LOOP_IOS_SMOKE_DEVICE`，使用该设备名。
2. 否则优先使用 `iPhone 17 Pro`。
3. 如果默认设备不可用，回退到 `xcrun simctl list devices available --json` 中第一台可用 iPhone。

构建输出放在 `.loop-build/ios-smoke/DerivedData`。截图输出放在 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`。这两个目录都应被 `.gitignore` 忽略。

脚本步骤：

1. 读取 simulator 列表，确定目标设备 UDID。
2. 执行 `xcodebuild -project ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj -scheme LoopCityWebViewApp -destination platform=iOS Simulator,id=<UDID> -derivedDataPath .loop-build/ios-smoke/DerivedData CODE_SIGNING_ALLOWED=NO build`。
3. 执行 `xcrun simctl boot <UDID>`；如果设备已经启动，视为可继续。
4. 执行 `xcrun simctl bootstatus <UDID> -b`。
5. 执行 `xcrun simctl install <UDID> <app path>`。
6. 执行 `xcrun simctl launch <UDID> com.verarun.loopcity.webview`。
7. 短暂等待，执行 `xcrun simctl io <UDID> screenshot <png path>`。
8. 检查截图文件存在且大小大于 0。

## 验证

新增失败检查先要求：

- `package.json` 存在 `ios:smoke`。
- `scripts/ios-simulator-smoke.mjs` 存在，并包含关键命令：`xcodebuild`、`simctl install`、`simctl launch`、`simctl io`、`screenshot`。
- `docs/release/ios-testflight-readiness.md` 记录 Simulator smoke 命令。
- `.gitignore` 忽略 `.loop-build/` 和 `.loop-artifacts/`。

实现后至少运行：

```sh
npm run ios:release-check
npm run ios:smoke
```

阶段结束前继续跑完整项目验证：

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

## 风险

- Simulator 设备名会随 Xcode 版本变化，所以脚本需要自动回退到可用 iPhone。
- 首次启动 simulator 可能较慢，所以 `bootstatus -b` 必须等待设备真正可用。
- 截图只能证明渲染出画面，不证明每个 WebView 功能都正常；功能契约仍由现有 `ios:check`、Web smoke 和后续真机 smoke 覆盖。
