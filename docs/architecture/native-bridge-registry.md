# LOOP Native Bridge Registry

日期：2026-06-24

native bridge 通过 `window.LoopNative` 暴露给 Web app。

## 当前消息

### `ready`

方向：Web 到原生

用途：通知原生外壳 Web app 已加载并识别 native shell。

Payload：

```json
{
  "href": "file:///app/Web/index.html",
  "dataVersion": "20260624-deep-culture-v1"
}
```

原生行为：可以忽略。

### `haptic`

方向：Web 到原生

用途：请求 iOS 轻触感反馈。

Payload：

```json
{}
```

原生行为：触发 `UIImpactFeedbackGenerator(style: .light)`。

### `camera.capture`

方向：Web 到原生

用途：请求 iOS 打开系统相机，拍摄当前站点照片。

Payload：

```json
{
  "requestId": "photo-1",
  "routeId": "route-id",
  "routeTitle": "上海咖啡地图 Vol.01",
  "stopIndex": 0,
  "stopName": "O.P.S. Cafe",
  "maxDimension": 1280,
  "jpegQuality": 0.78
}
```

原生行为：打开系统相机。成功或失败后派发 `loopnative:photo-result`。

### `photo.pick`

方向：Web 到原生

用途：请求 iOS 打开系统相册选择器，选择当前站点照片。

Payload 与 `camera.capture` 一致。

原生行为：打开单选相册选择器。成功或失败后派发 `loopnative:photo-result`。

### `location.request`

方向：Web 到原生

用途：请求 iOS 获取一次当前位置，用于确认当前站点打卡。

Payload：

```json
{
  "requestId": "location-1",
  "routeId": "route-id",
  "routeTitle": "上海咖啡地图 Vol.01",
  "stopIndex": 0,
  "stopName": "O.P.S. Cafe",
  "timeoutMs": 12000
}
```

原生行为：请求 when-in-use 定位授权并获取一次当前位置。成功或失败后派发 `loopnative:location-result`。

## 预留消息

以下消息只预留，不实现：

- `share.open`

产品代码不要调用预留消息，直到对应实施计划定义 payload、response event、权限行为、失败行为和验证检查。

## 原生到 Web 事件

### `loopnative:photo-result`

方向：原生到 Web

用途：返回拍照或相册选择结果。

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

允许的失败原因：

- `cancelled`
- `unavailable`
- `denied`
- `invalid-payload`
- `encode-failed`
- `unknown`

### `loopnative:location-result`

方向：原生到 Web

用途：返回一次性定位结果。

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

允许的失败原因：

- `denied`
- `restricted`
- `unavailable`
- `timeout`
- `invalid-payload`
- `unknown`
