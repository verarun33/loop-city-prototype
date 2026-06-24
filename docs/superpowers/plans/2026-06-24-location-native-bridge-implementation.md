# LOOP 定位 Native Bridge 实施计划

> **给 agentic worker 的要求：**执行本计划时必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`。任务步骤使用 checkbox（`- [ ]`）方便追踪。

**目标：** 让 iOS WebView app 通过 `location.request` 请求一次系统定位，并把成功结果接回现有定位打卡流程。

**架构：** Web 仍是产品 UI 事实来源。Web check-in sheet 在 iOS shell 内发送 `location.request`，iOS 用 `CLLocationManager` 获取一次当前位置后派发 `loopnative:location-result`，Web 再调用现有路线推进逻辑。浏览器模式保留当前模拟确认体验。

**技术栈：** 原生 HTML/CSS/JavaScript、Node.js 验证脚本、SwiftUI `UIViewRepresentable`、`WKWebView`、CoreLocation `CLLocationManager`、Xcode Simulator build。

## 全局约束

- 每个任务开始前使用 `superpowers:using-superpowers` 和 `karpathy-guidelines`。
- 执行代码任务前使用 `test-driven-development`。
- 完成声明前使用 `verification-before-completion`。
- 项目文档默认中文。
- 保持 WebView-first，不做 SwiftUI 全量重写。
- Web 层必须在没有 `window.LoopNative` 的浏览器模式下继续工作。
- Native bridge 只接受文档化 message，不暴露宽泛原生控制口。
- 本阶段不做后台定位、连续轨迹、地图 SDK、服务端验真、反作弊或坐标上传。
- 每个任务结束时只提交该任务相关文件。

---

## 文件结构

修改：

- `scripts/verify-ios-webview-wrapper.mjs`：新增 iOS location bridge 守门检查。
- `scripts/verify-featured-pass.mjs`：新增 Web location bridge 行为守门检查。
- `docs/architecture/native-bridge-registry.md`：把 `location.request` 从预留消息提升为当前消息，并记录 response event。
- `script.js`：新增 native location request adapter，增强 `confirmCheckinAction`，保持浏览器 fallback。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`：新增定位用途文案。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`：实现 CoreLocation handler 和结果事件回传。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`：最后由 `npm run ios:sync` 同步根 Web 资产。
- `docs/project/CURRENT_STATE.md`：阶段完成后更新接力状态。

不修改：

- `styles.css`：本阶段不改 UI 视觉。
- `index.html`：本阶段不需要新增 DOM。
- `data/loop-data-v0.1.js`：本阶段不改数据基线。

---

## 任务 1：新增 Location Bridge 失败检查

**文件：**
- 修改：`scripts/verify-ios-webview-wrapper.mjs`
- 修改：`scripts/verify-featured-pass.mjs`

**接口：**
- 消耗：当前 registry、Web check-in flow、iOS WebView wrapper。
- 产出：失败检查，要求后续任务实现 `location.request`、`loopnative:location-result`、`CLLocationManager` 和 Web result handler。

- [ ] **步骤 1：扩展 iOS wrapper 检查**

在 `scripts/verify-ios-webview-wrapper.mjs` 中，读取 `webViewScreen` 后加入：

```js
for (const expected of ["location.request", "loopnative:location-result", "CLLocationManager", "CLLocationManagerDelegate"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native location bridge：${expected}`);
  }
}
```

在 `Info.plist` 检查数组中加入：

```js
"NSLocationWhenInUseUsageDescription"
```

在 `bridgeRegistry` 检查后加入：

```js
for (const expected of ["loopnative:location-result", "denied", "restricted", "timeout", "invalid-payload"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 location bridge 结果：${expected}`);
  }
}
```

- [ ] **步骤 2：扩展 Web 行为检查**

在 `scripts/verify-featured-pass.mjs` 的 `checks` 数组中，紧跟 check-in flow 检查后加入：

```js
  ["native location bridge can request a one-shot location", /requestNativeLocation[\s\S]*location\.request/],
  ["native location bridge listens for result events", /loopnative:location-result[\s\S]*handleNativeLocationResult/],
  ["checkin action accepts native location asset", /function confirmCheckinAction\(routeItem,\s*locationAsset\s*=\s*null\)/],
```

- [ ] **步骤 3：运行 RED 验证**

运行：

```sh
npm run ios:check
```

预期：

```text
WebViewScreen.swift 必须实现 native location bridge：location.request
```

运行：

```sh
node scripts/verify-featured-pass.mjs
```

预期：

```text
Missing featured pass prototype pieces:
- native location bridge can request a one-shot location
- native location bridge listens for result events
- checkin action accepts native location asset
```

- [ ] **步骤 4：提交 RED 检查**

```sh
git add scripts/verify-ios-webview-wrapper.mjs scripts/verify-featured-pass.mjs
git commit -m "新增定位 bridge 失败检查"
```

---

## 任务 2：记录 Location Bridge 协议

**文件：**
- 修改：`docs/architecture/native-bridge-registry.md`
- 修改：`script.js`
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`

**接口：**
- 消耗：任务 1 的失败检查。
- 产出：`LOOP_NATIVE_BRIDGE_MESSAGES` 包含 `location.request`；registry 记录 request 和 result；iOS plist 有定位用途文案。

- [ ] **步骤 1：更新 bridge registry**

在“当前消息”中追加：

````markdown
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
````

从“预留消息”删除：

```markdown
- `location.request`
```

在“原生到 Web 事件”中追加：

````markdown
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
````

- [ ] **步骤 2：扩展 Web message allowlist**

把 `script.js` 中：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick"]);
```

改为：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick", "location.request"]);
```

- [ ] **步骤 3：新增 Info.plist 定位用途文案**

在 `NSPhotoLibraryUsageDescription` 后加入：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>LOOP 会用当前位置确认你是否正在进行城市路线打卡。</string>
```

- [ ] **步骤 4：验证并提交**

运行：

```sh
npm run check
```

预期：退出码 0。

运行：

```sh
npm run ios:check
```

预期：仍然失败，失败原因前进到 Swift 未实现 location handler。

提交：

```sh
git add docs/architecture/native-bridge-registry.md script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist
git commit -m "记录定位 native bridge 协议"
```

---

## 任务 3：Web Location Adapter

**文件：**
- 修改：`script.js`

**接口：**
- 消耗：`LOOP_NATIVE_BRIDGE_MESSAGES`、`window.LoopNative.post(name, payload)`、现有 `confirmCheckinAction(routeItem)`。
- 产出：`requestNativeLocation(routeItem)`、`handleNativeLocationResult(event)`、`confirmCheckinAction(routeItem, locationAsset = null)`。

- [ ] **步骤 1：新增 request state**

在 native photo state 后加入：

```js
const nativeLocationRequests = new Map();
let nativeLocationRequestCounter = 0;
```

- [ ] **步骤 2：新增 payload builder**

在 `requestNativePhoto` 后加入：

```js
function nativeLocationPayload(routeItem) {
  const stop = currentActionStop(routeItem);
  nativeLocationRequestCounter += 1;
  const requestId = `location-${Date.now()}-${nativeLocationRequestCounter}`;
  nativeLocationRequests.set(requestId, {
    routeId: routeItem.id,
    stopIndex: stop.index,
    station: stop.name,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    stopIndex: stop.index,
    stopName: stop.name,
    timeoutMs: 12000
  };
}
```

- [ ] **步骤 3：新增 native request sender**

在 `nativeLocationPayload` 后加入：

```js
function requestNativeLocation(routeItem) {
  if (!nativeBridgeCanPost("location.request")) return false;
  const payload = nativeLocationPayload(routeItem);
  window.LoopNative.post("location.request", payload);
  closePassActionSheet();
  showToast("正在确认定位...");
  return true;
}
```

- [ ] **步骤 4：新增 result handler**

在 `requestNativeLocation` 后加入：

```js
function handleNativeLocationResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativeLocationRequests.get(requestId);
  if (!request) return;
  nativeLocationRequests.delete(requestId);
  const routeItem = routeById(request.routeId);
  if (!routeItem) return;
  if (!detail.ok) {
    if (detail.reason === "denied" || detail.reason === "restricted") showToast("定位权限未开启，暂时不能确认到站。");
    else if (detail.reason === "timeout") showToast("定位超时，请再试一次。");
    else showToast(detail.message || "定位失败，请稍后重试。");
    return;
  }
  const locationAsset = {
    requestId,
    latitude: Number(detail.latitude),
    longitude: Number(detail.longitude),
    accuracy: Number(detail.accuracy) || 0,
    authorizationStatus: detail.authorizationStatus || "",
    capturedAt: detail.capturedAt || new Date().toISOString(),
    stopIndex: request.stopIndex,
    station: request.station
  };
  confirmCheckinAction(routeItem, locationAsset);
}
```

- [ ] **步骤 5：让 check-in confirm 优先走 native**

在 `confirmPassAction` 中，把：

```js
if (mode === "checkin") {
  confirmCheckinAction(routeItem);
  return;
}
```

替换为：

```js
if (mode === "checkin") {
  if (requestNativeLocation(routeItem)) return;
  confirmCheckinAction(routeItem);
  return;
}
```

- [ ] **步骤 6：增强 confirmCheckinAction**

把函数签名：

```js
function confirmCheckinAction(routeItem) {
```

改为：

```js
function confirmCheckinAction(routeItem, locationAsset = null) {
```

在 `persistUserState();` 前加入：

```js
if (locationAsset) {
  state.lastCheckinLocation = {
    ...locationAsset,
    routeId: routeItem.id,
    routeTitle: routeItem.title
  };
}
```

- [ ] **步骤 7：安装 result listener**

在 `window.addEventListener("loopnative:photo-result", handleNativePhotoResult);` 后加入：

```js
window.addEventListener("loopnative:location-result", handleNativeLocationResult);
```

- [ ] **步骤 8：验证并提交**

运行：

```sh
node scripts/verify-featured-pass.mjs
npm run check
```

预期：

- `Featured pass prototype checks passed.`
- `npm run check` 退出码 0。

提交：

```sh
git add script.js
git commit -m "接入 Web 原生定位 bridge adapter"
```

---

## 任务 4：iOS CoreLocation Handler

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`

**接口：**
- 消耗：`location.request` payload。
- 产出：`loopnative:location-result` event detail。

- [ ] **步骤 1：引入 CoreLocation**

在文件顶部加入：

```swift
import CoreLocation
```

- [ ] **步骤 2：新增 request model 和 state**

在 `Coordinator` 中加入：

```swift
private var activeLocationRequest: NativeLocationRequest?
private var locationTimeoutTask: Task<Void, Never>?
private lazy var locationManager: CLLocationManager = {
    let manager = CLLocationManager()
    manager.delegate = self
    manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    return manager
}()

private struct NativeLocationRequest {
    let requestId: String
    let timeoutMs: Double

    init?(payload: [String: Any]) {
        guard let requestId = payload["requestId"] as? String, !requestId.isEmpty else {
            return nil
        }
        self.requestId = requestId
        let timeout = payload["timeoutMs"] as? Double ?? 12000
        self.timeoutMs = min(max(timeout, 4000), 20000)
    }
}
```

- [ ] **步骤 3：分派 location message**

在 `userContentController` 的 switch 里加入：

```swift
case "location.request":
    handleLocationRequest(payload: payload)
```

- [ ] **步骤 4：实现 request handler**

在 `Coordinator` 中加入：

```swift
private func handleLocationRequest(payload: [String: Any]) {
    guard let request = NativeLocationRequest(payload: payload) else {
        sendLocationResult(requestId: payload["requestId"] as? String ?? "", reason: "invalid-payload", message: "定位请求缺少 requestId")
        return
    }
    activeLocationRequest = request
    switch locationManager.authorizationStatus {
    case .notDetermined:
        locationManager.requestWhenInUseAuthorization()
    case .authorizedAlways, .authorizedWhenInUse:
        requestCurrentLocation()
    case .denied:
        finishLocationFailure(reason: "denied", message: "定位权限未开启")
    case .restricted:
        finishLocationFailure(reason: "restricted", message: "定位权限受限")
    @unknown default:
        finishLocationFailure(reason: "unknown", message: "定位授权状态未知")
    }
}
```

- [ ] **步骤 5：实现定位请求、成功和失败回传**

在 `Coordinator` 中加入：

```swift
private func requestCurrentLocation() {
    guard let request = activeLocationRequest else { return }
    startLocationTimeout(for: request)
    locationManager.requestLocation()
}

private func startLocationTimeout(for request: NativeLocationRequest) {
    locationTimeoutTask?.cancel()
    locationTimeoutTask = Task { @MainActor [weak self] in
        try? await Task.sleep(nanoseconds: UInt64(request.timeoutMs * 1_000_000))
        guard self?.activeLocationRequest?.requestId == request.requestId else { return }
        self?.finishLocationFailure(reason: "timeout", message: "定位超时")
    }
}

private func finishLocationFailure(reason: String, message: String) {
    guard let request = activeLocationRequest else { return }
    locationTimeoutTask?.cancel()
    locationTimeoutTask = nil
    activeLocationRequest = nil
    sendLocationResult(requestId: request.requestId, reason: reason, message: message)
}

private func sendLocationResult(requestId: String, reason: String, message: String) {
    let payload: [String: Any] = [
        "requestId": requestId,
        "ok": false,
        "reason": reason,
        "message": message
    ]
    dispatchLocationResult(payload)
}

private func sendLocationResult(request: NativeLocationRequest, location: CLLocation) {
    let payload: [String: Any] = [
        "requestId": request.requestId,
        "ok": true,
        "latitude": location.coordinate.latitude,
        "longitude": location.coordinate.longitude,
        "accuracy": location.horizontalAccuracy,
        "authorizationStatus": locationAuthorizationLabel(locationManager.authorizationStatus),
        "capturedAt": ISO8601DateFormatter().string(from: location.timestamp)
    ]
    dispatchLocationResult(payload)
}

private func locationAuthorizationLabel(_ status: CLAuthorizationStatus) -> String {
    switch status {
    case .authorizedAlways: return "authorizedAlways"
    case .authorizedWhenInUse: return "authorizedWhenInUse"
    case .denied: return "denied"
    case .restricted: return "restricted"
    case .notDetermined: return "notDetermined"
    @unknown default: return "unknown"
    }
}

private func dispatchLocationResult(_ payload: [String: Any]) {
    guard
        let data = try? JSONSerialization.data(withJSONObject: payload),
        let json = String(data: data, encoding: .utf8)
    else {
        return
    }
    let script = "window.dispatchEvent(new CustomEvent('loopnative:location-result', { detail: \(json) }));"
    webView?.evaluateJavaScript(script)
}
```

- [ ] **步骤 6：实现 CLLocationManagerDelegate**

在文件末尾加入：

```swift
extension WebViewScreen.Coordinator: CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        guard activeLocationRequest != nil else { return }
        switch manager.authorizationStatus {
        case .authorizedAlways, .authorizedWhenInUse:
            requestCurrentLocation()
        case .denied:
            finishLocationFailure(reason: "denied", message: "定位权限未开启")
        case .restricted:
            finishLocationFailure(reason: "restricted", message: "定位权限受限")
        case .notDetermined:
            break
        @unknown default:
            finishLocationFailure(reason: "unknown", message: "定位授权状态未知")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let request = activeLocationRequest, let location = locations.last else {
            finishLocationFailure(reason: "unavailable", message: "没有获得当前位置")
            return
        }
        locationTimeoutTask?.cancel()
        locationTimeoutTask = nil
        activeLocationRequest = nil
        sendLocationResult(request: request, location: location)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        finishLocationFailure(reason: "unavailable", message: error.localizedDescription)
    }
}
```

- [ ] **步骤 7：验证并提交**

运行：

```sh
npm run ios:check
npm run ios:build
```

预期：

- `iOS WebView wrapper checks passed.`
- `BUILD SUCCEEDED`。

提交：

```sh
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift
git commit -m "实现 iOS 定位 bridge handler"
```

---

## 任务 5：同步资产、更新状态并完整验证

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`
- 修改：`docs/project/CURRENT_STATE.md`

**接口：**
- 消耗：任务 3 的根 `script.js`。
- 产出：iOS bundle 内 Web 资产与根资产一致，状态文档记录阶段结果。

- [ ] **步骤 1：同步 Web 资产**

运行：

```sh
npm run ios:sync
```

预期：

```text
Synced web prototype assets into iOS WebView app.
```

- [ ] **步骤 2：更新状态文档**

把 `docs/project/CURRENT_STATE.md` 的“下一步任务”更新为：

```markdown
阶段 2B 已完成：定位 native bridge 已接入。Web 浏览器模式保留原模拟确认流程，iOS app 模式可通过 `location.request` 请求一次系统定位，并通过 `loopnative:location-result` 写回现有定位打卡流程。

下一步可继续规划分享 bridge、照片记录真实后端持久化或 TestFlight 准备。
```

- [ ] **步骤 3：运行完整验证**

运行：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

预期：

- `npm run data:check` 输出 `LOOP 数据基础检查通过。`
- `npm run ui:check` 输出 `移动个人页 UI 检查通过。`
- `npm run check` 退出码 0。
- `npm test` 输出 `Featured pass prototype checks passed.`
- `npm run ios:check` 输出 `iOS WebView wrapper checks passed.`
- `npm run ios:build` 输出 `BUILD SUCCEEDED`。

- [ ] **步骤 4：提交阶段完成状态**

```sh
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js docs/project/CURRENT_STATE.md
git commit -m "完成定位 bridge 阶段状态"
```

---

## 自检

- Spec 覆盖：本计划覆盖 `location.request`、`loopnative:location-result`、浏览器 fallback、iOS `CLLocationManager`、授权失败、定位失败、定位超时和验证命令。
- Scope 检查：本计划只做一次性定位，不包含后台定位、地图 SDK、服务端验真、反作弊或坐标上传。
- 占位标记扫描：本文没有未完成章节或未定义任务。
- 类型一致性：`requestId`、`latitude`、`longitude`、`accuracy`、`authorizationStatus`、`capturedAt` 在 Web、Swift 和 registry 中名称一致。

## 执行接力

计划已完成并保存到 `docs/superpowers/plans/2026-06-24-location-native-bridge-implementation.md`。

推荐执行方式：

1. `superpowers:subagent-driven-development`：每个 task 一个新 agent，主线程逐 task review。
2. `superpowers:executing-plans`：当前线程按 task 顺序执行，每个 task 结束做验证和提交。

考虑到本项目上下文较长，推荐第 1 种。
