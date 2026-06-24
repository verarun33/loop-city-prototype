# LOOP 相机/相册 Native Bridge 设计

日期：2026-06-24
状态：阶段 2 待执行设计

## 背景

LOOP / 城市回路当前采用 WebView-first。Web 层已经有“拍照记录”原型流程：

- 用户在路线或城市通行证站点里点击“拍照记录”。
- Web sheet 让用户选择“拍照”或“上传照片”。
- 当前原型使用模拟图片保存到“我的”的今日、本周、本月、全年记录。

iOS 外壳当前只实现了基础 `window.LoopNative`、`ready` 和 `haptic`。`Info.plist` 已有相机和相册权限文案，但还没有真正调用系统相机或相册。

## 目标

把现有 Web photo sheet 渐进增强为 iOS 原生拍照/选图流程，同时保持浏览器原型不退化。

用户在 iOS app 内选择：

- “拍照”：打开系统相机，拍摄后保存到当前站点记录。
- “上传照片”：打开系统相册选择器，选择后保存到当前站点记录。

保存后的记录继续进入现有“我的”统计和记录详情，不重做个人页 UI。

## 非目标

本阶段不做：

- 服务器上传。
- iCloud 同步。
- 图片编辑器。
- 多图批量选择。
- 照片永久资产库。
- 账号同步。
- 支付、订单或商家核销逻辑。
- SwiftUI 重写 Web 页面。

## 推荐方案

采用窄 bridge + 原生系统选择器。

Web 继续作为产品 UI 事实来源。Web 只发明确消息：

- `camera.capture`
- `photo.pick`

iOS 原生接管系统相机和相册。原生完成后，不直接改 Web 状态，而是向 Web 派发一个统一的浏览器事件：

- `loopnative:photo-result`

Web 收到事件后，走现有 `savePhotoRecord` 记录路径。

## 比较过的方案

### 方案 A：`UIImagePickerController` + `PHPickerViewController`

推荐。

优点：

- 不引入新依赖。
- 相机能力直接来自系统。
- 相册使用 `PHPickerViewController`，不需要先申请完整相册读取权限。
- 可以保持 Swift 外壳很小。

代价：

- Swift coordinator 会比当前 `haptic` handler 稍复杂。
- 需要处理取消、设备无相机、编码失败和回调注入。

### 方案 B：Web `<input type="file">`

暂不采用为主路径。

优点：

- Web 改动少。
- 浏览器和 WebView 都能部分工作。

问题：

- App 感弱。
- 难以统一触感、取消、权限和未来扩展。
- 不符合“原生层负责系统能力”的项目决策。

浏览器模式可继续保留当前模拟 sheet 或后续加 file input，但 iOS app 主路径应走 native bridge。

### 方案 C：完整 SwiftUI 照片模块

暂不采用。

优点：

- 原生体验可以更完整。

问题：

- 容易开始重写产品 UI。
- 对当前阶段过重。
- 与 WebView-first 决策冲突。

## Bridge 协议

### Web 到原生：`camera.capture`

Payload：

```json
{
  "requestId": "photo-1",
  "routeId": "route-shanghai-coffee-01",
  "routeTitle": "上海咖啡地图 Vol.01",
  "stopIndex": 0,
  "stopName": "O.P.S. Cafe",
  "maxDimension": 1280,
  "jpegQuality": 0.78
}
```

含义：

- `requestId`：Web 生成的请求 ID，用于把结果对应回当前站点。
- `routeId`、`routeTitle`、`stopIndex`、`stopName`：调试和未来埋点用，原生不依赖这些字段改业务状态。
- `maxDimension`：原生返回图片的长边上限。
- `jpegQuality`：原生 JPEG 压缩质量，范围 `0.1` 到 `0.95`，超出时原生按 `0.78` 处理。

### Web 到原生：`photo.pick`

Payload 与 `camera.capture` 一致。

差异：

- 原生打开相册选择器。
- 本阶段只允许选择一张图片。

### 原生到 Web：`loopnative:photo-result`

成功 detail：

```json
{
  "requestId": "photo-1",
  "source": "camera",
  "ok": true,
  "imageDataUrl": "data:image/jpeg;base64,...",
  "mimeType": "image/jpeg",
  "width": 960,
  "height": 1280
}
```

失败或取消 detail：

```json
{
  "requestId": "photo-1",
  "source": "camera",
  "ok": false,
  "reason": "cancelled",
  "message": "用户取消了拍照"
}
```

允许的 `reason`：

- `cancelled`
- `unavailable`
- `denied`
- `invalid-payload`
- `encode-failed`
- `unknown`

## Web 行为

Web 新增一个很薄的 native photo adapter。

行为规则：

- 如果不在 iOS native shell，保持当前模拟拍照/上传流程。
- 如果在 iOS native shell 且 bridge 支持目标消息，点击“拍照”直接发送 `camera.capture`。
- 如果在 iOS native shell 且 bridge 支持目标消息，点击“上传照片”直接发送 `photo.pick`。
- 请求发送后关闭 action sheet，并显示等待 toast。
- 收到成功结果后调用增强版 `savePhotoRecord(routeItem, source, photoAsset)`。
- 收到取消结果时不写记录，只提示用户已取消。
- 收到失败结果时不写记录，提示用户重试。

`savePhotoRecord` 增强后继续保持旧调用兼容：

```js
savePhotoRecord(routeItem, source)
savePhotoRecord(routeItem, source, photoAsset)
```

`photoAsset` 字段：

```js
{
  imageDataUrl: "data:image/jpeg;base64,...",
  mimeType: "image/jpeg",
  width: 960,
  height: 1280
}
```

记录内图片优先使用 `photoAsset.imageDataUrl`，没有真实照片时继续使用现有模拟图片。

## iOS 行为

iOS 原生层新增：

- `camera.capture` handler。
- `photo.pick` handler。
- 一个最小请求解析结构。
- 一个统一图片压缩和 JavaScript event dispatch 方法。

相机使用 `UIImagePickerController`。

相册使用 `PHPickerViewController`。

图片返回前做处理：

- 缩放到 `maxDimension` 长边以内。
- 转成 JPEG。
- 组装成 data URL。
- 不读取或上传 EXIF。
- 不写入系统相册。

如果设备没有相机，例如 Simulator，返回：

```json
{
  "ok": false,
  "reason": "unavailable"
}
```

## 隐私和安全

- 本阶段不上传照片到网络。
- 本阶段不把照片写入服务器。
- 本阶段不保留 EXIF 作为产品数据。
- 图片只进入 Web 当前本地状态和现有持久化路径。
- 原生返回给 Web 的 JavaScript 必须用 JSON 序列化，不拼接未转义字符串。

## 验证策略

新增或扩展以下检查：

- `scripts/verify-ios-webview-wrapper.mjs`
  - 验证 Swift 中出现 `camera.capture`、`photo.pick`、`PHPickerViewController`、`UIImagePickerController`、`loopnative:photo-result`。
  - 验证 `Info.plist` 保留相机/相册文案。
- `scripts/verify-featured-pass.mjs`
  - 验证 Web 定义 `requestNativePhoto`。
  - 验证 Web 监听 `loopnative:photo-result`。
  - 验证 `savePhotoRecord` 支持第三个 `photoAsset` 参数。
  - 验证浏览器 fallback 仍保留 `camera-frame` 和 `upload-drop`。

阶段结束前运行：

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

## 验收标准

- 浏览器访问原型时，拍照/上传流程仍按原型模式工作。
- iOS app 中，Web 可以发出 `camera.capture` 和 `photo.pick`。
- iOS app 中，相机不可用时不会崩溃，会回传 `unavailable`。
- iOS app 中，用户取消拍照或选图不会写入记录。
- iOS app 中，成功拍照或选图后，当前站点记录使用真实 data URL 作为照片。
- 每个站点仍只允许保存一张照片。
- 现有个人页 UI 和统计结构不被重写。

## 接力说明

本设计进入实施时，按这个计划执行：

`docs/superpowers/plans/2026-06-24-camera-photo-native-bridge-implementation.md`
