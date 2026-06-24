# LOOP 定位 Native Bridge 设计

日期：2026-06-24
状态：阶段 2B 待执行设计

## 背景

LOOP / 城市回路当前已经完成 WebView-first iOS app foundation，并完成阶段 2A：相机/相册 native bridge。

Web 层已有“定位打卡”原型流程：

- 用户在路线或城市通行证站点点击“定位打卡”。
- Web sheet 展示当前站点、下一站提示和确认按钮。
- 点击确认后，Web 直接推进路线进度。

这个流程目前只是产品模拟，没有调用 iOS 系统定位。下一阶段应把“确认到站”渐进增强为一次性原生定位请求，同时保持浏览器原型可用。

## 目标

让 iOS app 内的“定位打卡”通过 native bridge 请求一次当前位置，并在定位成功后推进现有路线进度。

用户体验：

- 浏览器模式继续使用当前模拟确认。
- iOS app 模式下，点击“确认到达本站”后打开系统定位授权或直接获取当前位置。
- 定位成功后，继续走现有 `confirmCheckinAction` 逻辑。
- 定位失败或取消授权时，不推进站点，只给出清楚反馈。

## 非目标

本阶段不做：

- 后台定位。
- 连续轨迹记录。
- 地图 SDK。
- 精确地理围栏。
- 反作弊。
- 服务端验真。
- 订单、核销或商家后台联动。
- 把用户坐标上传到网络。
- 重写 check-in sheet UI。

## 推荐方案

采用窄 bridge + 一次性 `CoreLocation` 请求。

Web 发送：

- `location.request`

iOS 原生层使用 `CLLocationManager` 请求 when-in-use 授权，并调用一次 `requestLocation()`。

iOS 完成后派发：

- `loopnative:location-result`

Web 收到成功结果后调用增强版：

```js
confirmCheckinAction(routeItem, locationAsset)
```

旧调用仍保持兼容：

```js
confirmCheckinAction(routeItem)
```

## 比较过的方案

### 方案 A：一次性原生定位请求

推荐。

优点：

- 符合“原生层负责系统能力”的项目决策。
- 不引入地图 SDK。
- 不保存连续轨迹，隐私边界清楚。
- 可以直接增强现有 check-in flow。

代价：

- 需要处理 iOS 授权状态、拒绝、定位失败和超时。
- Simulator 可能没有可用坐标，需要失败回传而不是崩溃。

### 方案 B：浏览器 Geolocation API

不作为 iOS app 主路径。

优点：

- Web 改动少。

问题：

- WebView file URL 环境下权限体验不可控。
- 不利于后续与 iOS 隐私文案、触感和 app 审核说明统一。

### 方案 C：直接接地图 SDK 和地理围栏

暂不采用。

优点：

- 未来可做更严肃的到店验证。

问题：

- 对当前阶段过重。
- 会引入供应商、Key、费用、隐私和审核复杂度。
- 容易把“路线原型”拖成生产定位系统。

## Bridge 协议

### Web 到原生：`location.request`

Payload：

```json
{
  "requestId": "location-1",
  "routeId": "route-shanghai-coffee-01",
  "routeTitle": "上海咖啡地图 Vol.01",
  "stopIndex": 0,
  "stopName": "O.P.S. Cafe",
  "timeoutMs": 12000
}
```

字段含义：

- `requestId`：Web 生成的请求 ID，用于把结果对应回当前站点。
- `routeId`、`routeTitle`、`stopIndex`、`stopName`：原生不改业务状态，只用于回传和未来调试。
- `timeoutMs`：Web 期望的最长等待时间。iOS 可以钳制到 `4000` 到 `20000` 毫秒之间。

### 原生到 Web：`loopnative:location-result`

成功 detail：

```json
{
  "requestId": "location-1",
  "ok": true,
  "latitude": 31.216,
  "longitude": 121.474,
  "accuracy": 35,
  "authorizationStatus": "authorizedWhenInUse",
  "capturedAt": "2026-06-24T18:20:00.000Z"
}
```

失败 detail：

```json
{
  "requestId": "location-1",
  "ok": false,
  "reason": "denied",
  "message": "定位权限未开启"
}
```

允许的 `reason`：

- `denied`
- `restricted`
- `unavailable`
- `timeout`
- `invalid-payload`
- `unknown`

## Web 行为

Web 新增 location request adapter。

行为规则：

- 如果不在 iOS native shell，保留当前模拟确认流程。
- 如果在 iOS native shell 且 bridge 支持 `location.request`，点击 check-in 确认按钮时先发送 native request。
- 请求发送后关闭 action sheet，并显示“正在确认定位...”。
- 收到成功结果后调用 `confirmCheckinAction(routeItem, locationAsset)`。
- 收到失败结果后不推进路线，只显示失败 toast。
- 用户再次点击定位打卡时可以重试。

`locationAsset` 字段：

```js
{
  requestId: "location-1",
  latitude: 31.216,
  longitude: 121.474,
  accuracy: 35,
  authorizationStatus: "authorizedWhenInUse",
  capturedAt: "2026-06-24T18:20:00.000Z",
  stopIndex: 0,
  station: "O.P.S. Cafe"
}
```

本阶段只把定位结果保存在本地状态中，供调试和后续记录扩展使用。它不上传到网络。

## iOS 行为

iOS 新增：

- `location.request` handler。
- `NativeLocationRequest` 解析结构。
- `LocationRequestController` 或等价 coordinator 内部封装。
- `CLLocationManagerDelegate` 回调。
- `loopnative:location-result` 事件派发。

授权规则：

- `.notDetermined`：请求 when-in-use 授权。
- `.authorizedWhenInUse` 或 `.authorizedAlways`：调用 `requestLocation()`。
- `.denied`：回传 `denied`。
- `.restricted`：回传 `restricted`。

定位规则：

- 成功拿到坐标后，立即回传第一条可用位置。
- 失败时回传 `unavailable` 或 `unknown`。
- 超时时回传 `timeout`，并清理当前 pending request。

## 隐私和审核

需要在 `Info.plist` 增加：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>LOOP 会用当前位置确认你是否正在进行城市路线打卡。</string>
```

隐私边界：

- 本阶段不上传坐标。
- 本阶段不做后台定位。
- 本阶段不保存连续轨迹。
- Web 仅把一次性结果用于推进当前站点。

## 验证策略

新增或扩展以下检查：

- `scripts/verify-ios-webview-wrapper.mjs`
  - 验证 `WebViewScreen.swift` 包含 `location.request`、`loopnative:location-result`、`CLLocationManager`、`CLLocationManagerDelegate`。
  - 验证 `Info.plist` 包含 `NSLocationWhenInUseUsageDescription`。
- `scripts/verify-featured-pass.mjs`
  - 验证 Web 定义 `requestNativeLocation`。
  - 验证 Web 监听 `loopnative:location-result`。
  - 验证 `confirmCheckinAction(routeItem, locationAsset = null)` 兼容定位结果。
  - 验证浏览器 fallback 仍保留原确认路径。

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

- 浏览器模式下，定位打卡仍可按原型模拟推进。
- iOS app 中，Web 可以发出 `location.request`。
- iOS app 中，定位成功后路线按当前逻辑推进到下一站。
- iOS app 中，定位拒绝、受限、失败或超时不会推进站点。
- `Info.plist` 有清楚中文定位用途说明。
- 不引入地图 SDK。
- 不上传坐标。
- 不重写 check-in sheet UI。

## 接力说明

本设计进入实施时，按这个计划执行：

`docs/superpowers/plans/2026-06-24-location-native-bridge-implementation.md`
