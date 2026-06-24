# LOOP 相机/相册 Native Bridge 实施计划

> **给 agentic worker 的要求：**执行本计划时必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`。任务步骤使用 checkbox（`- [ ]`）方便追踪。

**目标：** 让 iOS WebView app 通过窄 native bridge 打开系统相机/相册，并把结果保存进现有 LOOP 照片记录流程。

**架构：** Web 仍是产品 UI 事实来源。Web photo sheet 在 iOS shell 内发送 `camera.capture` / `photo.pick`，iOS 用系统 picker 获得图片后派发 `loopnative:photo-result`，Web 再调用现有记录写入路径。浏览器模式保留当前模拟体验。

**技术栈：** 原生 HTML/CSS/JavaScript、Node.js 验证脚本、SwiftUI `UIViewRepresentable`、`WKWebView`、UIKit `UIImagePickerController`、PhotosUI `PHPickerViewController`、Xcode Simulator build。

## 全局约束

- 每个任务开始前使用 `superpowers:using-superpowers` 和 `karpathy-guidelines`。
- 执行代码任务前使用 `test-driven-development`。
- 完成声明前使用 `verification-before-completion`。
- 项目文档默认中文。
- 保持 WebView-first，不做 SwiftUI 全量重写。
- Web 层必须在没有 `window.LoopNative` 的浏览器模式下继续工作。
- Native bridge 只接受文档化 message，不暴露宽泛原生控制口。
- 本阶段不做服务器上传、账号同步、图片编辑、多图选择、支付、定位或分享。
- 每个任务结束时只提交该任务相关文件。

---

## 文件结构

修改：

- `docs/architecture/native-bridge-registry.md`：把 `camera.capture`、`photo.pick` 从预留消息提升为当前消息，并记录 response event。
- `script.js`：新增 native photo request adapter，增强 `savePhotoRecord`，保持浏览器 fallback。
- `scripts/verify-featured-pass.mjs`：新增 Web bridge 行为守门检查。
- `scripts/verify-ios-webview-wrapper.mjs`：新增 iOS bridge handler 和系统 picker 守门检查。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`：实现相机/相册 handler、图片缩放编码、结果事件回传。
- `docs/project/CURRENT_STATE.md`：阶段完成后更新接力状态。

不修改：

- `styles.css`：本阶段不改 UI 视觉。
- `index.html`：本阶段不需要新增 DOM。
- `data/loop-data-v0.1.js`：本阶段不改数据基线。

---

## 任务 1: Bridge Registry 和验证器 RED

**文件：**
- 修改：`scripts/verify-ios-webview-wrapper.mjs`
- 修改：`scripts/verify-featured-pass.mjs`

**接口：**
- 消耗：现有 `LOOP_NATIVE_BRIDGE_MESSAGES`、`window.LoopNative`、`docs/architecture/native-bridge-registry.md`
- 产出：失败检查，要求后续任务实现 `camera.capture`、`photo.pick`、`loopnative:photo-result`

- [ ] **步骤 1: 在 iOS wrapper 检查里新增失败条件**

在 `scripts/verify-ios-webview-wrapper.mjs` 中，读取 `webViewScreen` 后加入：

```js
for (const expected of ["camera.capture", "photo.pick", "loopnative:photo-result", "UIImagePickerController", "PHPickerViewController"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native photo bridge：${expected}`);
  }
}
```

在检查 `bridgeRegistry` 的循环后加入：

```js
for (const expected of ["loopnative:photo-result", "invalid-payload", "encode-failed", "unavailable", "cancelled"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 photo bridge 结果：${expected}`);
  }
}
```

- [ ] **步骤 2: 在 Web 行为检查里新增失败条件**

在 `scripts/verify-featured-pass.mjs` 的 `checks` 数组中，紧跟现有 photo flow 检查后加入：

```js
  ["native photo bridge can request camera and photo picker", /requestNativePhoto[\s\S]*camera\.capture[\s\S]*photo\.pick/],
  ["native photo bridge listens for result events", /loopnative:photo-result[\s\S]*handleNativePhotoResult/],
  ["photo save accepts native photo asset", /function savePhotoRecord\(routeItem,\s*source\s*=\s*"camera",\s*photoAsset\s*=\s*null\)/],
```

- [ ] **步骤 3: 运行 RED 验证**

运行：

```sh
npm run ios:check
```

预期：

```text
WebViewScreen.swift 必须实现 native photo bridge：camera.capture
```

运行：

```sh
npm run ui:check
```

预期：

```text
FAIL native photo bridge can request camera and photo picker
```

- [ ] **步骤 4: 提交 RED 检查**

```sh
git add scripts/verify-ios-webview-wrapper.mjs scripts/verify-featured-pass.mjs
git commit -m "新增相机相册 bridge 失败检查"
```

---

## 任务 2: 记录 Native Bridge 协议

**文件：**
- 修改：`docs/architecture/native-bridge-registry.md`
- 修改：`script.js`

**接口：**
- 消耗：任务 1 的失败检查
- 产出：`LOOP_NATIVE_BRIDGE_MESSAGES` 包含 `camera.capture`、`photo.pick`；registry 记录 response event

- [ ] **步骤 1: 更新 bridge message registry**

在 `docs/architecture/native-bridge-registry.md` 的“当前消息”里追加：

````markdown
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
````

在“预留消息”下删除 `camera.capture` 和 `photo.pick` 两项，保留：

```markdown
- `location.request`
- `share.open`
```

在文档底部追加：

````markdown
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
````

- [ ] **步骤 2: 扩展 Web message allowlist**

把 `script.js` 中：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic"]);
```

改为：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick"]);
```

- [ ] **步骤 3: 运行本任务验证**

运行：

```sh
npm run ios:check
```

预期： 仍然失败，失败原因前进到 Swift 未实现 picker 字符串。

运行：

```sh
npm run check
```

预期： 退出码 0。

- [ ] **步骤 4: 提交 registry 更新**

```sh
git add docs/architecture/native-bridge-registry.md script.js
git commit -m "记录相机相册 native bridge 协议"
```

---

## 任务 3: Web Native Photo Adapter

**文件：**
- 修改：`script.js`

**接口：**
- 消耗：`LOOP_NATIVE_BRIDGE_MESSAGES`、`window.LoopNative.post(name, payload)`
- 产出：`requestNativePhoto(source, routeItem)`、`handleNativePhotoResult(event)`、增强版 `savePhotoRecord(routeItem, source, photoAsset = null)`

- [ ] **步骤 1: 在 `script.js` 中加入 request state**

在 `LOOP_NATIVE_BRIDGE_MESSAGES` 下方加入：

```js
const nativePhotoRequests = new Map();
let nativePhotoRequestCounter = 0;
```

- [ ] **步骤 2: 加入 native capability 判断和 payload builder**

在 `installNativeShellBridge` 前加入：

```js
function nativeBridgeCanPost(messageName) {
  const native = window.LoopNative;
  return Boolean(
    native &&
    native.platform === "ios" &&
    typeof native.post === "function" &&
    LOOP_NATIVE_BRIDGE_MESSAGES.includes(messageName)
  );
}

function nativePhotoPayload(routeItem, source) {
  const stop = currentActionStop(routeItem);
  nativePhotoRequestCounter += 1;
  const requestId = `photo-${Date.now()}-${nativePhotoRequestCounter}`;
  nativePhotoRequests.set(requestId, {
    routeId: routeItem.id,
    stopIndex: stop.index,
    source,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    stopIndex: stop.index,
    stopName: stop.name,
    maxDimension: 1280,
    jpegQuality: 0.78
  };
}
```

- [ ] **步骤 3: 加入 request sender**

在 `nativePhotoPayload` 后加入：

```js
function requestNativePhoto(source, routeItem) {
  const messageName = source === "upload" ? "photo.pick" : "camera.capture";
  if (!nativeBridgeCanPost(messageName)) return false;
  const payload = nativePhotoPayload(routeItem, source);
  window.LoopNative.post(messageName, payload);
  closePassActionSheet();
  showToast(source === "upload" ? "正在打开系统相册..." : "正在打开系统相机...");
  return true;
}
```

- [ ] **步骤 4: 加入 result handler**

在 `requestNativePhoto` 后加入：

```js
function handleNativePhotoResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativePhotoRequests.get(requestId);
  if (!request) return;
  nativePhotoRequests.delete(requestId);
  const routeItem = routeById(request.routeId);
  if (!routeItem) return;
  if (!detail.ok) {
    if (detail.reason === "cancelled") showToast("已取消照片记录。");
    else if (detail.reason === "unavailable") showToast("当前设备无法打开这个系统入口。");
    else showToast(detail.message || "照片没有保存，请稍后再试。");
    return;
  }
  const photoAsset = {
    imageDataUrl: detail.imageDataUrl || "",
    mimeType: detail.mimeType || "image/jpeg",
    width: Number(detail.width) || 0,
    height: Number(detail.height) || 0
  };
  if (!photoAsset.imageDataUrl.startsWith("data:image/")) {
    showToast("照片格式暂时无法保存。");
    return;
  }
  const saved = savePhotoRecord(routeItem, request.source, photoAsset);
  state.photoTaken = saved || state.photoTaken;
  showToast(saved ? `${currentActionStop(routeItem).name} 的照片已保存到我的 LOOP。` : "这一站已经保存过照片，每个站点只能保留一张。");
  persistUserState();
  renderRouteDetail();
  renderOngoingExploration();
  if (state.view === "folio") renderProfile();
}
```

- [ ] **步骤 5: 接入 photo source 点击**

把 `bindEvents` 中的 photo source handler：

```js
if (photoSourceButton) {
  state.passActionMode = photoSourceButton.dataset.photoSource;
  renderPassActionSheet();
  return;
}
```

替换为：

```js
if (photoSourceButton) {
  const source = photoSourceButton.dataset.photoSource;
  const routeItem = routeById(state.passActionRouteId);
  if (routeItem && requestNativePhoto(source, routeItem)) return;
  state.passActionMode = source;
  renderPassActionSheet();
  return;
}
```

- [ ] **步骤 6: 增强 savePhotoRecord**

把函数签名：

```js
function savePhotoRecord(routeItem, source = "camera") {
```

替换为：

```js
function savePhotoRecord(routeItem, source = "camera", photoAsset = null) {
```

把函数内 `photo` 对象替换为：

```js
const photoUrl = photoAsset?.imageDataUrl || photoPreviewForRoute(routeItem);
const photo = {
  station: stop.name,
  stopIndex: stop.index,
  source: sourceText,
  url: photoUrl,
  mimeType: photoAsset?.mimeType || "",
  width: photoAsset?.width || 0,
  height: photoAsset?.height || 0
};
```

- [ ] **步骤 7: 安装 result listener**

在 `installNativeShellBridge();` 前加入：

```js
window.addEventListener("loopnative:photo-result", handleNativePhotoResult);
```

- [ ] **步骤 8: 运行 Web 验证**

运行：

```sh
npm run ui:check
npm run check
```

预期：

- `npm run ui:check` 输出 `Featured pass prototype checks passed.`
- `npm run check` 退出码 0。

- [ ] **步骤 9: 提交 Web adapter**

```sh
git add script.js
git commit -m "接入 Web 原生照片 bridge adapter"
```

---

## 任务 4: iOS Camera 和 Photo Picker Handler

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`

**接口：**
- 消耗：`camera.capture`、`photo.pick` payload
- 产出：`loopnative:photo-result` JavaScript event detail

- [ ] **步骤 1: 引入 PhotosUI**

在文件顶部：

```swift
import SwiftUI
import WebKit
```

改为：

```swift
import PhotosUI
import SwiftUI
import WebKit
```

- [ ] **步骤 2: 让 coordinator 持有 webView**

在 `makeUIView` 创建 `webView` 后、设置 delegate 前加入：

```swift
context.coordinator.attach(webView)
```

在 `Coordinator` 类开头加入：

```swift
private weak var webView: WKWebView?
private var activePhotoRequest: NativePhotoRequest?

func attach(_ webView: WKWebView) {
    self.webView = webView
}
```

- [ ] **步骤 3: 增加 request model**

在 `Coordinator` 类里加入：

```swift
private struct NativePhotoRequest {
    let requestId: String
    let source: String
    let maxDimension: CGFloat
    let jpegQuality: CGFloat

    init?(payload: [String: Any], source: String) {
        guard let requestId = payload["requestId"] as? String, !requestId.isEmpty else {
            return nil
        }
        self.requestId = requestId
        self.source = source
        let dimension = payload["maxDimension"] as? Double ?? 1280
        self.maxDimension = CGFloat(min(max(dimension, 320), 2048))
        let quality = payload["jpegQuality"] as? Double ?? 0.78
        self.jpegQuality = CGFloat(min(max(quality, 0.1), 0.95))
    }
}
```

- [ ] **步骤 4: 分派 bridge message**

把 `userContentController` 尾部：

```swift
if name == "haptic" {
    UIImpactFeedbackGenerator(style: .light).impactOccurred()
}
```

替换为：

```swift
let payload = body["payload"] as? [String: Any] ?? [:]

switch name {
case "haptic":
    UIImpactFeedbackGenerator(style: .light).impactOccurred()
case "camera.capture":
    handleCameraCapture(payload: payload)
case "photo.pick":
    handlePhotoPick(payload: payload)
default:
    break
}
```

- [ ] **步骤 5: 增加相机 handler**

在 `Coordinator` 类中加入：

```swift
private func handleCameraCapture(payload: [String: Any]) {
    guard let request = NativePhotoRequest(payload: payload, source: "camera") else {
        sendPhotoResult(requestId: payload["requestId"] as? String ?? "", source: "camera", reason: "invalid-payload", message: "拍照请求缺少 requestId")
        return
    }
    guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
        sendPhotoResult(requestId: request.requestId, source: request.source, reason: "unavailable", message: "当前设备无法打开相机")
        return
    }
    activePhotoRequest = request
    let picker = UIImagePickerController()
    picker.sourceType = .camera
    picker.cameraCaptureMode = .photo
    picker.delegate = self
    present(picker)
}
```

- [ ] **步骤 6: 增加相册 handler**

在 `Coordinator` 类中加入：

```swift
private func handlePhotoPick(payload: [String: Any]) {
    guard let request = NativePhotoRequest(payload: payload, source: "upload") else {
        sendPhotoResult(requestId: payload["requestId"] as? String ?? "", source: "upload", reason: "invalid-payload", message: "选图请求缺少 requestId")
        return
    }
    activePhotoRequest = request
    var configuration = PHPickerConfiguration(photoLibrary: .shared())
    configuration.filter = .images
    configuration.selectionLimit = 1
    let picker = PHPickerViewController(configuration: configuration)
    picker.delegate = self
    present(picker)
}
```

- [ ] **步骤 7: 增加展示和失败回传工具**

在 `Coordinator` 类中加入：

```swift
private func present(_ viewController: UIViewController) {
    guard let presenter = webView?.window?.rootViewController else {
        sendPhotoResult(requestId: activePhotoRequest?.requestId ?? "", source: activePhotoRequest?.source ?? "camera", reason: "unavailable", message: "无法展示系统照片入口")
        return
    }
    presenter.present(viewController, animated: true)
}

private func sendPhotoResult(requestId: String, source: String, reason: String, message: String) {
    let payload: [String: Any] = [
        "requestId": requestId,
        "source": source,
        "ok": false,
        "reason": reason,
        "message": message
    ]
    dispatchPhotoResult(payload)
}
```

- [ ] **步骤 8: 增加图片编码和 JS dispatch**

在 `Coordinator` 类中加入：

```swift
private func sendPhotoResult(request: NativePhotoRequest, image: UIImage) {
    let resized = resizedImage(image, maxDimension: request.maxDimension)
    guard let jpeg = resized.jpegData(compressionQuality: request.jpegQuality) else {
        sendPhotoResult(requestId: request.requestId, source: request.source, reason: "encode-failed", message: "照片编码失败")
        return
    }
    let payload: [String: Any] = [
        "requestId": request.requestId,
        "source": request.source,
        "ok": true,
        "imageDataUrl": "data:image/jpeg;base64,\(jpeg.base64EncodedString())",
        "mimeType": "image/jpeg",
        "width": Int(resized.size.width),
        "height": Int(resized.size.height)
    ]
    dispatchPhotoResult(payload)
}

private func resizedImage(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
    let size = image.size
    let longest = max(size.width, size.height)
    guard longest > maxDimension else { return image }
    let scale = maxDimension / longest
    let targetSize = CGSize(width: size.width * scale, height: size.height * scale)
    let renderer = UIGraphicsImageRenderer(size: targetSize)
    return renderer.image { _ in
        image.draw(in: CGRect(origin: .zero, size: targetSize))
    }
}

private func dispatchPhotoResult(_ payload: [String: Any]) {
    guard
        let data = try? JSONSerialization.data(withJSONObject: payload),
        let json = String(data: data, encoding: .utf8)
    else { return }
    let script = "window.dispatchEvent(new CustomEvent('loopnative:photo-result', { detail: \(json) }));"
    webView?.evaluateJavaScript(script)
}
```

- [ ] **步骤 9: 实现 delegate extensions**

在 `WebViewScreen` 文件末尾、`WebViewScreen` 结构体结束后加入：

```swift
extension WebViewScreen.Coordinator: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        sendPhotoResult(requestId: request?.requestId ?? "", source: request?.source ?? "camera", reason: "cancelled", message: "用户取消了拍照")
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        guard let request, let image = info[.originalImage] as? UIImage else {
            sendPhotoResult(requestId: request?.requestId ?? "", source: request?.source ?? "camera", reason: "unknown", message: "没有获得照片")
            return
        }
        sendPhotoResult(request: request, image: image)
    }
}

extension WebViewScreen.Coordinator: PHPickerViewControllerDelegate {
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        guard let request else {
            return
        }
        guard let provider = results.first?.itemProvider else {
            sendPhotoResult(requestId: request.requestId, source: request.source, reason: "cancelled", message: "用户取消了选图")
            return
        }
        provider.loadObject(ofClass: UIImage.self) { [weak self] object, _ in
            Task { @MainActor in
                guard let self else { return }
                guard let image = object as? UIImage else {
                    self.sendPhotoResult(requestId: request.requestId, source: request.source, reason: "unknown", message: "没有获得照片")
                    return
                }
                self.sendPhotoResult(request: request, image: image)
            }
        }
    }
}
```

- [ ] **步骤 10: 运行 iOS 验证**

运行：

```sh
npm run ios:check
```

预期：

```text
iOS WebView wrapper checks passed.
```

运行：

```sh
npm run ios:build
```

预期：

```text
BUILD SUCCEEDED
```

- [ ] **步骤 11: 提交 iOS handler**

```sh
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift
git commit -m "实现 iOS 相机相册 bridge handler"
```

---

## 任务 5: 同步 iOS Web 资产并完成阶段验证

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`
- 修改：`docs/project/CURRENT_STATE.md`

**接口：**
- 消耗：任务 3 的根 `script.js`
- 产出：iOS bundle 内 Web 资产与根资产一致，状态文档记录阶段结果

- [ ] **步骤 1: 同步 Web 资产**

运行：

```sh
npm run ios:sync
```

预期：

```text
iOS Web assets synced.
```

- [ ] **步骤 2: 更新状态文档**

把 `docs/project/CURRENT_STATE.md` 的“下一步任务”更新为：

```markdown
阶段 2A 已完成：相机/相册 native bridge 已接入。Web 浏览器模式保留原模拟照片流程，iOS app 模式可通过 `camera.capture` 和 `photo.pick` 打开系统入口，并通过 `loopnative:photo-result` 写回现有照片记录。

下一步可继续规划定位 bridge、分享 bridge 或照片记录的真实后端持久化。
```

并把“最近完整验证时间”保持为 `2026-06-24`。

- [ ] **步骤 3: 运行完整验证**

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
- `npm run ui:check` 输出 `Featured pass prototype checks passed.`
- `npm run check` 退出码 0。
- `npm test` 退出码 0。
- `npm run ios:check` 输出 `iOS WebView wrapper checks passed.`
- `npm run ios:build` 输出 `BUILD SUCCEEDED`。

- [ ] **步骤 4: 提交阶段完成状态**

```sh
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js docs/project/CURRENT_STATE.md
git commit -m "完成相机相册 bridge 阶段状态"
```

---

## 自检

- Spec 覆盖：本计划覆盖 `camera.capture`、`photo.pick`、`loopnative:photo-result`、浏览器 fallback、iOS picker、取消和失败回传、验证命令。
- Scope 检查：本计划只做相机/相册照片记录，不包含定位、分享、账号、上传或支付。
- 占位标记扫描：本文没有未完成章节或未定义任务。
- 类型一致性：`requestId`、`source`、`imageDataUrl`、`mimeType`、`width`、`height` 在 Web、Swift 和 registry 中名称一致。

## 执行接力

计划已完成并保存到 `docs/superpowers/plans/2026-06-24-camera-photo-native-bridge-implementation.md`.

推荐执行方式：

1. `superpowers:subagent-driven-development`：每个 task 一个新 agent，主线程逐 task review。
2. `superpowers:executing-plans`：当前线程按 task 顺序执行，每个 task 结束做验证和提交。

考虑到本项目上下文较长，推荐第 1 种。
