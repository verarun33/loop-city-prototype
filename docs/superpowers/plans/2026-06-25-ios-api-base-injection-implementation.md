# LOOP iOS API Base 注入实施计划

日期：2026-06-25

## 目标

实现一个默认关闭的 iOS API base 注入点，让 Phase 3A 的 Web photo sync adapter 未来可以从原生配置读取生产或 staging API base。

## 文件范围

修改：

- `scripts/verify-ios-webview-wrapper.mjs`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`
- `docs/project/CURRENT_STATE.md`

不修改：

- `script.js`
- `server.mjs`
- Xcode signing / Bundle ID

## 任务 1：新增失败检查

在 `verify-ios-webview-wrapper.mjs` 中要求：

- `Info.plist` 包含 `LoopAPIBaseURL`
- `WebViewScreen.swift` 包含 `loopApiBaseURL`
- `WebViewScreen.swift` 包含 `LOOP_API_BASE_URL`
- `WebViewScreen.swift` 包含 `dataset.apiBase`

运行：

```sh
npm run ios:check
```

预期先失败，失败点为缺少 `loopApiBaseURL` 或 `LoopAPIBaseURL`。

## 任务 2：实现 iOS 注入

- 在 `Info.plist` 添加 `LoopAPIBaseURL`，默认空字符串。
- 在 `WebViewScreen.swift` 增加 `loopApiBaseURL` 配置读取。
- 在 document-start script 里安全注入：
  - `window.LOOP_API_BASE_URL`
  - `document.documentElement.dataset.apiBase`

## 任务 3：验证与提交

运行：

```sh
npm run ios:check
npm run ios:release-check
npm run ios:build
```

阶段结束后更新 `docs/project/CURRENT_STATE.md`，说明该注入点默认关闭、尚未配置生产域名。
