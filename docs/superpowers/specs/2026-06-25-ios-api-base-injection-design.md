# LOOP iOS API Base 注入设计

日期：2026-06-25

## 背景

照片记录 Phase 3A 已经提供 Web sync adapter：Web 会读取 `window.LOOP_API_BASE_URL`、`document.documentElement.dataset.apiBase` 或 `localStorage["loop.apiBase"]`，有值时才把照片记录同步到 `/api/photo-records`。

当前缺口是 iOS 离线包没有正式的原生配置入口。之后接生产 API 域名时，如果没有原生注入点，就只能改 Web 代码或依赖用户本地存储，这不适合作为 app 配置路径。

## 目标

- 让 iOS 壳在 document start 注入可选的 API base。
- 默认值必须为空，保持当前线上原型和 iOS 离线包不主动同步。
- Web 仍继续使用 Phase 3A 已有的 `photoRecordApiBase()`，不新增宽 bridge message。
- 通过 `ios:check` 守门，避免后续漏掉注入配置。

## 非目标

- 不填写真实生产 API 域名。
- 不接真实账号、对象存储、支付订单或删除/导出能力。
- 不改变 `window.LoopNative.post(...)` bridge 协议。
- 不改变当前照片记录 UI。

## 方案

iOS 从 `Info.plist` 读取 `LoopAPIBaseURL`：

- 如果为空：只注入空字符串，不启用同步。
- 如果非空：在 Web 文档开始阶段设置 `window.LOOP_API_BASE_URL`，并同步写入 `document.documentElement.dataset.apiBase`，让 Web adapter 能读到同一个配置。

注入仍放在现有 `nativeBootstrapScript` 附近，避免多处 document-start script 争夺初始化顺序。

## 验证

- `scripts/verify-ios-webview-wrapper.mjs` 检查：
  - `Info.plist` 包含 `LoopAPIBaseURL`。
  - `WebViewScreen.swift` 包含 `loopApiBaseURL` 和 `LOOP_API_BASE_URL`。
  - 注入脚本会写 `dataset.apiBase`。
- 完整验证继续使用：
  - `npm run ios:check`
  - `npm run ios:release-check`
  - `npm run ios:build`

## 后续边界

生产域名确定后，只需要把 `LoopAPIBaseURL` 的值接到 build setting、xcconfig 或 release 配置。本阶段先保留空值，避免误把 dev API 当生产服务。
