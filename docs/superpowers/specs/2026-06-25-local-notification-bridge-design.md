# 本地通知 Native Bridge 设计

日期：2026-06-25
阶段：3C-0
状态：准备实施

## 背景

`我的` 页的设置面板已经有“通知 / 路线提醒 / 到期提醒”的产品入口，但当前点击后只显示占位 toast。LOOP 的 Apple app 方向是 WebView-first，iOS 层负责系统权限和原生能力，因此通知能力应该先作为一个窄 native bridge 接入。

本阶段只做 iOS 本地通知，不做远程推送。这样可以让 TestFlight 原型具备“提醒我继续探索”的真实系统能力，同时不依赖 Apple Developer Team 的 Push capability、生产后端、账号系统或营销自动化。

## 目标

- 新增 `notification.schedule` bridge message，让 Web 可以请求 iOS 授权并排一个本地提醒。
- 新增 `loopnative:notification-result` 事件，让 iOS 把授权、排程、失败或拒绝结果回传给 Web。
- 让“设置 -> 通知”从纯占位变成渐进增强：iOS app 中走 native bridge，浏览器模式保持轻量 toast。
- 更新 bridge registry 和 `ios:check` 守门，防止后续遗漏通知 bridge。

## 非目标

- 不实现 APNs 远程推送。
- 不增加 Push Notifications capability。
- 不接后台任务、云端营销、服务端提醒队列或真实账号。
- 不设计复杂通知设置页。
- 不改变当前 WebView-first UI 架构。

## 用户体验

用户在“我的 -> 设置 -> 通知”点击通知项：

- iOS app 模式：Web 发送 `notification.schedule`，iOS 请求通知权限并安排一条本地提醒。Web 根据结果展示 toast。
- 浏览器模式：不调用原生能力，继续展示“iOS app 中会使用本地提醒”的轻量说明。

第一版提醒文案保持通用：

- title：`LOOP 城市回路`
- body：`明天可以继续完成一条城市路线。`
- delaySeconds：`86400`

这条提醒不是生产自动化，只是让 TestFlight 用户能验证通知权限和本地提醒链路。

## Bridge 契约

### Web -> iOS：`notification.schedule`

Payload：

```json
{
  "requestId": "notification-1",
  "kind": "route-reminder",
  "title": "LOOP 城市回路",
  "body": "明天可以继续完成一条城市路线。",
  "delaySeconds": 86400
}
```

字段规则：

- `requestId` 必须非空。
- `title` 和 `body` 必须非空。
- `delaySeconds` 由 iOS 夹在 `60...604800` 秒之间，避免排即时或过远提醒。
- `kind` 当前只用于标记来源，iOS 可以不做业务解释。

### iOS -> Web：`loopnative:notification-result`

成功 detail：

```json
{
  "requestId": "notification-1",
  "ok": true,
  "scheduled": true,
  "authorizationStatus": "authorized",
  "identifier": "loop-notification-1"
}
```

失败 detail：

```json
{
  "requestId": "notification-1",
  "ok": false,
  "scheduled": false,
  "reason": "denied",
  "message": "通知权限未开启"
}
```

允许失败原因：

- `invalid-payload`
- `denied`
- `failed`
- `unknown`

## Web 设计

- `LOOP_NATIVE_BRIDGE_MESSAGES` 增加 `notification.schedule`。
- 新增 `nativeNotificationRequests` 和 request counter，按 `requestId` 追踪请求。
- 新增 `notificationReminderPayload()`、`requestNativeNotificationReminder()` 和 `handleNativeNotificationResult()`。
- 设置面板的 `notify` action 优先尝试 native bridge；如果不可用，展示浏览器 fallback toast。

Web 不保存复杂通知偏好。第一阶段只确认 bridge 可用，未来如果要做细分通知开关，再单独设计本地设置模型。

## iOS 设计

- `WebViewScreen.swift` 引入 `UserNotifications`。
- 新增 `NativeNotificationRequest` 解析 payload。
- `userContentController` 增加 `notification.schedule` 分支。
- iOS 调用 `UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])`。
- 授权成功后用 `UNTimeIntervalNotificationTrigger` 安排本地通知。
- 通过 `dispatchNotificationResult()` 派发结果事件。

本地通知不需要 `Info.plist` usage description，也不需要 Push capability。

## 验证

扩展 `scripts/verify-ios-webview-wrapper.mjs`：

- `WebViewScreen.swift` 必须包含 `notification.schedule`、`loopnative:notification-result`、`UNUserNotificationCenter` 和 `NativeNotificationRequest`。
- `script.js` 必须包含 `notification.schedule`、`requestNativeNotificationReminder` 和 `handleNativeNotificationResult`。
- `docs/architecture/native-bridge-registry.md` 必须记录新 message、事件和失败原因。

完整阶段验证：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run photo:persistence-check
npm run ios:check
npm run ios:release-check
npm run ios:build
```

## 风险和边界

- Simulator 构建能验证编译和 bridge 代码存在，但不能替代真机通知权限体验。
- 用户如果拒绝通知权限，本阶段只反馈结果，不引导跳系统设置。
- 本地提醒是原型体验，不代表生产推送策略已经确定。
