# LOOP 分享 Native Bridge 设计

日期：2026-06-24
状态：阶段 2C 待执行设计

## 背景

LOOP / 城市回路当前已经完成 WebView-first iOS app foundation，并完成阶段 2A 相机/相册 native bridge、阶段 2B 定位 native bridge。

`docs/architecture/native-bridge-registry.md` 里仍预留 `share.open`。分享是下一个合适的小能力：它不需要后端，不改变路线状态，也能让 iOS app 看起来更像完整产品。

当前 Web 原型没有真正的分享入口。本阶段需要补一个轻量入口，并在 iOS app 内打开系统分享面板。

## 目标

让用户在路线详情或城市通行证详情里分享当前地图。

用户体验：

- iOS app 模式下，点击“分享”后打开系统分享面板。
- 浏览器模式下，优先使用 `navigator.share`；不可用时尝试复制分享文案。
- 分享成功、取消或失败都只给轻量 toast，不改变路线进度、订单、核销或记录。
- 分享入口不占用底部主行动按钮，不影响定位打卡、拍照记录和完成探索。

## 非目标

本阶段不做：

- Universal Links。
- 深度打开指定路线。
- 分享图片生成。
- 分享二维码。
- 分享统计埋点。
- 社交平台定制卡片。
- 服务端短链。
- 登录态分享。
- 分享后奖励或任务。

## 推荐方案

采用窄 bridge + iOS 系统 `UIActivityViewController`。

Web 发送：

- `share.open`

iOS 原生层打开系统分享面板。

iOS 完成后派发：

- `loopnative:share-result`

Web 浏览器模式走 fallback：

1. `navigator.share` 可用时调用浏览器分享。
2. 否则用 `navigator.clipboard.writeText` 尝试复制分享文案。
3. 复制失败时提示“分享文案已准备好”，不弹浏览器 alert。

## 比较过的方案

### 方案 A：原生系统分享面板

推荐。

优点：

- 符合“原生层负责系统能力”的项目决策。
- 不需要社交平台 SDK。
- iOS 审核和用户预期都清楚。
- Web 只负责生成分享 payload。

代价：

- 需要 iOS presentation 和取消回调处理。
- Simulator 不一定能完整验证每个分享目标，只验证面板可构建和事件协议。

### 方案 B：只用 Web `navigator.share`

不作为 iOS app 主路径。

优点：

- Web 改动少。

问题：

- file URL WebView 环境下能力不稳定。
- 不能统一 iOS 系统分享体验。
- 不利于后续扩展 app 原生能力。

### 方案 C：自定义分享弹层

暂不采用。

优点：

- 视觉可控。

问题：

- 会变成平台选择、复制、图片、二维码的一整套 UI。
- 当前阶段过重，也会分散原生 app 基础能力建设。

## Bridge 协议

### Web 到原生：`share.open`

Payload：

```json
{
  "requestId": "share-1",
  "routeId": "route-shanghai-coffee-01",
  "routeTitle": "上海咖啡地图 Vol.01",
  "title": "上海咖啡地图 Vol.01",
  "text": "我在 LOOP 城市回路发现了一张上海咖啡地图 Vol.01：复兴中路、太原路、安福路一线的城市路线。",
  "url": "https://verarun33.github.io/loop-city-prototype/",
  "subject": "LOOP 城市回路"
}
```

字段含义：

- `requestId`：Web 生成的请求 ID，用于对应分享结果。
- `routeId`、`routeTitle`：业务上下文，只用于回传和未来调试。
- `title`：分享标题。
- `text`：分享正文。
- `url`：当前公开原型链接。本阶段不做深链。
- `subject`：iOS share sheet 可用的主题。

### 原生到 Web：`loopnative:share-result`

成功 detail：

```json
{
  "requestId": "share-1",
  "ok": true,
  "completed": true,
  "activityType": "com.apple.UIKit.activity.CopyToPasteboard"
}
```

取消 detail：

```json
{
  "requestId": "share-1",
  "ok": false,
  "completed": false,
  "reason": "cancelled",
  "message": "用户取消了分享"
}
```

允许的失败原因：

- `cancelled`
- `invalid-payload`
- `unavailable`
- `failed`
- `unknown`

## Web 行为

Web 新增 share adapter。

行为规则：

- 分享入口放在路线详情顶部工具区，和关闭按钮同级，避免挤压底部主行动区。
- 没有当前路线时隐藏分享入口。
- iOS native shell 且支持 `share.open` 时，点击分享发送 native request。
- 浏览器模式优先调用 `navigator.share`。
- 浏览器没有分享能力时尝试复制分享文案。
- 所有失败都只 toast，不改变任何产品状态。

分享文案规则：

- 城市通行证：强调“城市通行证”和价格/有效期。
- 普通兴趣地图：强调路线主题、城市和站点数量。
- 链接暂用公开原型根链接：`https://verarun33.github.io/loop-city-prototype/`。

## iOS 行为

iOS 新增：

- `share.open` handler。
- `NativeShareRequest` 解析结构。
- `UIActivityViewController` presentation。
- `loopnative:share-result` 事件派发。

原生层只接收有限字段，不执行任意 Web 指令。

分享内容：

- 至少包含 `text`。
- 如果 `url` 可解析，作为 `URL` item 一起分享。
- `subject` 可通过 `setValue(_:forKey:)` 提供给系统分享面板。

取消和失败：

- 用户取消：回传 `cancelled`。
- payload 缺少 `requestId` 或 `text`：回传 `invalid-payload`。
- 当前没有可展示的 root view controller：回传 `unavailable`。
- completion handler 返回 error：回传 `failed`。

## 隐私和审核

本阶段不需要新增 Info.plist 权限。

隐私边界：

- 不上传分享内容。
- 不做分享统计。
- 不读取通讯录或社交账号。
- 只调用系统分享面板。

## 验证策略

新增或扩展以下检查：

- `scripts/verify-ios-webview-wrapper.mjs`
  - 验证 `WebViewScreen.swift` 包含 `share.open`、`loopnative:share-result`、`UIActivityViewController`。
  - 验证 registry 记录 `share.open`、`loopnative:share-result`、`cancelled`、`invalid-payload`、`unavailable`、`failed`。
- `scripts/verify-featured-pass.mjs`
  - 验证 Web 定义 `requestNativeShare`。
  - 验证 Web 定义 `shareRoutePayload`。
  - 验证 Web 监听 `loopnative:share-result`。
  - 验证 route detail 有 `routeShareButton` 入口。
  - 验证浏览器 fallback 包含 `navigator.share` 和 `navigator.clipboard.writeText`。

阶段结束前运行：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

## 验收标准

- 路线详情页有轻量分享入口。
- 浏览器模式可走 `navigator.share` 或复制 fallback。
- iOS app 中 Web 可以发出 `share.open`。
- iOS app 中 `share.open` 打开系统分享面板。
- 分享取消或失败不会改变路线状态。
- registry 记录 request 和 result event。
- 不引入社交 SDK。
- 不新增后端、短链、二维码或分享图片。

## 接力说明

本设计进入实施时，按这个计划执行：

`docs/superpowers/plans/2026-06-24-share-native-bridge-implementation.md`
