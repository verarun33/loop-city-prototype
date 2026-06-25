# LOOP 城市回路 iOS WebView App 架构

日期：2026-06-24
状态：阶段 1 执行依据

## 摘要

LOOP Apple app 使用 WebView-first 架构。现有网页原型仍是 canonical UI。SwiftUI 只负责聚焦的原生外壳：打包 Web 资产、管理 `WKWebView`，并通过一个很小的 bridge 暴露必要 iOS 能力。

## Repo 结构

关键文件：

- `index.html`：根 Web app 入口。
- `styles.css`：根 Web app 样式。
- `script.js`：根 Web app 行为和原型数据。
- `server.mjs`：本地开发服务。
- `scripts/sync-ios-web-assets.mjs`：把根 Web 资产复制进 iOS bundle。
- `scripts/verify-ios-webview-wrapper.mjs`：验证 iOS wrapper 和资产同步。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`：SwiftUI `WKWebView` 宿主和 bridge 注入。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/`：iOS app 使用的打包 Web 资产。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`：iOS 权限和 app 元信息。

## 运行模式

App 有两种运行模式：

1. 浏览器模式：根 Web 资产在普通浏览器或本地服务里运行。
2. iOS 外壳模式：同一套根资产被复制进 app bundle，由 `WKWebView` 加载。

Web app 必须在两种模式下都能工作。原生能力只能作为渐进增强。

## 资产同步

根资产是事实来源：

- `index.html`
- `styles.css`
- `script.js`
- `favicon.svg`

同步命令：

```sh
npm run ios:sync
```

iOS 检查命令会验证必要文件、资产一致性、app icon 引用、`Info.plist` 权限和 native bridge 标记：

```sh
npm run ios:check
```

阶段 1 会把 `data/` 也纳入同步。

## 原生外壳

`WebViewScreen.swift` 创建 `WKWebView`，包含：

- 允许 inline media playback。
- 启用 JavaScript。
- 透明背景。
- 返回/前进手势。
- scroll view 不自动调整 safe-area inset。
- 从 bundle 的 `Web` 目录加载本地文件。

外部 URL 处理：

- `file`、`about`、`data`、`blob` 允许。
- `http` 和 `https` 允许。
- 其他 scheme 交给 `UIApplication.shared.open`。

## Native Bridge

原生在 document start 注入 `window.LoopNative`：

- `platform`：当前为 `"ios"`。
- `shellVersion`：当前为 `"0.1"`。
- `post(name, payload)`：向原生发送命名消息。

Web app 监听 `loopnative:ready`，标记 `document.documentElement.dataset.nativeShell`，并发送 `ready`。

原生也会在 document start 注入可选 API base：

- `Info.plist` 里的 `LoopAPIBaseURL` 是配置来源。
- 默认值为空，表示不启用后端同步。
- 非空时会写入 `window.LOOP_API_BASE_URL` 和 `document.documentElement.dataset.apiBase`。
- Web 层仍通过 `photoRecordApiBase()` 读取配置，不需要新增 bridge message。

当前原生消息：

- `haptic`：触发 `UIImpactFeedbackGenerator(style: .light)`。

未来消息应遵循这个形状：

```js
window.LoopNative.post("camera.capture", {
  requestId: "record-photo-001",
  source: "profile-record"
});
```

如果功能需要响应结果，应先设计明确的 callback/event 模式，再让产品依赖它。

## 边界规则

Web 负责：

- 产品导航。
- 页面布局。
- 城市内容。
- 卡片和横向 rails 交互。
- 原型记录。
- 用户可见文案。

iOS 负责：

- App 打包。
- 权限。
- 原生能力请求。
- 触感等硬件体验。
- 未来相机、相册、定位和分享 API。
- App Store 和 TestFlight 准备。

共享契约：

- bridge message 名称。
- bridge payload 形状。
- 资产同步行为。
- 验证命令。

## 错误处理

如果打包 Web 资产缺失，iOS app 显示朴素 fallback 文案，而不是崩溃。

如果 `window.LoopNative` 不存在，浏览器模式继续运行，只是不启用原生能力。

如果原生收到不支持的 bridge message，先忽略。只有功能需要时才增加结构化确认。

## 测试策略

基础检查：

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

涉及 WebView UI 的改动，还要检查本地浏览器或 Simulator app 的实际展示。

bridge 功能必须先在 `scripts/verify-ios-webview-wrapper.mjs` 增加检查，再实现。

## 近期架构工作

阶段 1 推荐任务：

1. 把产品数据从 `script.js` 逐步抽到显式数据文件。
2. 在新增相机、定位、分享消息前，建立 bridge message registry。
3. 当 bridge 功能超过一两个消息时，增加浏览器安全的 bridge adapter。
4. 给个人页关键移动 UI 增加轻量 smoke check。
5. 签名和 bundle ID 确认后，再定义 TestFlight build settings。

## 约束

- 没有明确需求前，不引入大型 app 框架。
- 除非是系统界面，不在 SwiftUI 重做产品 UI。
- 原生能力不能成为浏览器模式必需条件。
- iOS Web 资产必须从根文件同步，不手写分叉版本。
- 不把无关数据种子、视觉调整和原生外壳工作混在一个提交里。
