# LOOP 分享 Native Bridge 实施计划

> **给 agentic worker 的要求：**执行本计划时必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`。任务步骤使用 checkbox（`- [ ]`）方便追踪。

**目标：** 让路线详情和城市通行证详情可以通过 `share.open` 打开 iOS 系统分享面板，并让浏览器模式保留 Web fallback。

**架构：** Web 继续负责产品 UI 和分享 payload。iOS shell 只处理 `share.open`，展示 `UIActivityViewController`，并通过 `loopnative:share-result` 回传完成、取消或失败。分享不改变路线状态、不写记录、不请求新权限。

**技术栈：** 原生 HTML/CSS/JavaScript、Node.js 验证脚本、SwiftUI `UIViewRepresentable`、`WKWebView`、UIKit `UIActivityViewController`、Xcode Simulator build。

## 全局约束

- 每个任务开始前使用 `superpowers:using-superpowers` 和 `karpathy-guidelines`。
- 执行代码任务前使用 `test-driven-development`。
- 完成声明前使用 `verification-before-completion`。
- 项目文档默认中文。
- 保持 WebView-first，不做 SwiftUI 全量重写。
- Web 层必须在没有 `window.LoopNative` 的浏览器模式下继续工作。
- Native bridge 只接受文档化 message，不暴露宽泛原生控制口。
- 本阶段不做 Universal Links、深链、分享图片、二维码、短链、统计埋点、社交 SDK 或后端。
- 分享不改变路线进度、订单、核销、照片或记录。
- 每个任务结束时只提交该任务相关文件。

---

## 文件结构

修改：

- `scripts/verify-ios-webview-wrapper.mjs`：新增 iOS share bridge 守门检查。
- `scripts/verify-featured-pass.mjs`：新增 Web share bridge 行为守门检查。
- `docs/architecture/native-bridge-registry.md`：把 `share.open` 从预留消息提升为当前消息，并记录 response event。
- `index.html`：在路线详情头部加入轻量分享按钮。
- `styles.css`：给详情头部工具区和分享按钮增加小样式。
- `script.js`：新增 native share adapter、Web fallback 和按钮绑定。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`：实现 `UIActivityViewController` handler 和结果事件回传。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html`、`styles.css`、`script.js`：最后由 `npm run ios:sync` 同步根 Web 资产。
- `docs/project/CURRENT_STATE.md`：阶段完成后更新接力状态。

不修改：

- `data/loop-data-v0.1.js`：本阶段不改数据基线。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`：系统分享不需要新增权限文案。

---

## 任务 1：新增 Share Bridge 失败检查

**文件：**
- 修改：`scripts/verify-ios-webview-wrapper.mjs`
- 修改：`scripts/verify-featured-pass.mjs`

**接口：**
- 消耗：当前 registry、Web route detail、iOS WebView wrapper。
- 产出：失败检查，要求后续任务实现 `share.open`、`loopnative:share-result`、`UIActivityViewController` 和 Web fallback。

- [ ] **步骤 1：扩展 iOS wrapper 检查**

在 `scripts/verify-ios-webview-wrapper.mjs` 的 location bridge 检查后加入：

```js
for (const expected of ["share.open", "loopnative:share-result", "UIActivityViewController"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native share bridge：${expected}`);
  }
}
```

在 registry 结果检查后加入：

```js
for (const expected of ["loopnative:share-result", "cancelled", "invalid-payload", "unavailable", "failed"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 share bridge 结果：${expected}`);
  }
}
```

- [ ] **步骤 2：扩展 Web 行为检查**

在 `scripts/verify-featured-pass.mjs` 的 native location 检查后加入：

```js
  ["route detail has a native share entry point", /routeShareButton[\s\S]*分享|分享[\s\S]*routeShareButton/],
  ["native share bridge can request system share sheet", /requestNativeShare[\s\S]*share\.open/],
  ["native share bridge builds route payloads", /shareRoutePayload[\s\S]*routeTitle[\s\S]*LOOP_SHARE_URL/],
  ["native share bridge listens for result events", /loopnative:share-result[\s\S]*handleNativeShareResult/],
  ["web share fallback uses browser share or clipboard", /navigator\.share[\s\S]*navigator\.clipboard\.writeText/],
```

- [ ] **步骤 3：运行 RED 验证**

运行：

```sh
npm run ios:check
```

预期：

```text
WebViewScreen.swift 必须实现 native share bridge：share.open
```

运行：

```sh
node scripts/verify-featured-pass.mjs
```

预期包含：

```text
Missing featured pass prototype pieces:
- route detail has a native share entry point
- native share bridge can request system share sheet
- native share bridge builds route payloads
- native share bridge listens for result events
- web share fallback uses browser share or clipboard
```

- [ ] **步骤 4：提交 RED 检查**

```sh
git add scripts/verify-ios-webview-wrapper.mjs scripts/verify-featured-pass.mjs
git commit -m "新增分享 bridge 失败检查"
```

---

## 任务 2：记录 Share Bridge 协议和详情页入口

**文件：**
- 修改：`docs/architecture/native-bridge-registry.md`
- 修改：`index.html`
- 修改：`styles.css`
- 修改：`script.js`

**接口：**
- 消耗：任务 1 的失败检查。
- 产出：registry 记录 `share.open` 和 `loopnative:share-result`；Web message allowlist 包含 `share.open`；路线详情头部有 `routeShareButton`。

- [ ] **步骤 1：更新 bridge registry**

在“当前消息”中追加：

````markdown
### `share.open`

方向：Web 到原生

用途：请求 iOS 打开系统分享面板，分享当前路线或城市通行证。

Payload：

```json
{
  "requestId": "share-1",
  "routeId": "route-id",
  "routeTitle": "上海咖啡地图 Vol.01",
  "title": "上海咖啡地图 Vol.01",
  "text": "我在 LOOP 城市回路发现了一张上海咖啡地图 Vol.01。",
  "url": "https://verarun33.github.io/loop-city-prototype/",
  "subject": "LOOP 城市回路"
}
```

原生行为：打开 `UIActivityViewController`。完成、取消或失败后派发 `loopnative:share-result`。
````

从“预留消息”删除：

```markdown
- `share.open`
```

在“原生到 Web 事件”中追加：

````markdown
### `loopnative:share-result`

方向：原生到 Web

用途：返回系统分享面板结果。

成功 detail：

```json
{
  "requestId": "share-1",
  "ok": true,
  "completed": true,
  "activityType": "com.apple.UIKit.activity.CopyToPasteboard"
}
```

失败或取消 detail：

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
````

- [ ] **步骤 2：扩展 Web message allowlist**

把 `script.js` 中：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick", "location.request"]);
```

改为：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic", "camera.capture", "photo.pick", "location.request", "share.open"]);
```

在 bridge 常量附近加入：

```js
const LOOP_SHARE_URL = "https://verarun33.github.io/loop-city-prototype/";
```

- [ ] **步骤 3：新增路线详情分享入口**

把 `index.html` 的路线详情头部按钮：

```html
<button class="close-button" type="button" id="routeClose" aria-label="关闭">×</button>
```

替换为：

```html
<div class="route-detail-tools">
  <button class="route-share-button" type="button" id="routeShareButton" aria-label="分享这张地图">分享</button>
  <button class="close-button" type="button" id="routeClose" aria-label="关闭">×</button>
</div>
```

- [ ] **步骤 4：新增分享入口样式**

在 `.route-detail-head` 样式后加入：

```css
.route-detail-tools {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.route-share-button {
  min-width: 44px;
  min-height: 38px;
  border: 1px solid rgba(37, 71, 208, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--blue);
  font-size: 12px;
  font-weight: 1000;
  box-shadow: 0 10px 24px rgba(32, 36, 43, 0.08);
}
```

- [ ] **步骤 5：扩展 DOM 映射**

在 `dom` 对象中 `routeClose` 附近加入：

```js
routeShareButton: document.getElementById("routeShareButton"),
```

- [ ] **步骤 6：验证并提交**

运行：

```sh
npm run check
```

预期：退出码 0。

运行：

```sh
npm run ios:check
```

预期：仍然失败，失败原因前进到 Swift 未实现 share handler。

提交：

```sh
git add docs/architecture/native-bridge-registry.md index.html styles.css script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/styles.css ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "记录分享 native bridge 协议"
```

---

## 任务 3：Web Share Adapter

**文件：**
- 修改：`script.js`

**接口：**
- 消耗：`LOOP_NATIVE_BRIDGE_MESSAGES`、`window.LoopNative.post(name, payload)`、`state.activeRoute`、`routeById`。
- 产出：`shareRoutePayload(routeItem)`、`requestNativeShare(routeItem)`、`fallbackWebShare(routeItem)`、`handleNativeShareResult(event)`、`shareActiveRoute()`。

- [ ] **步骤 1：新增 request state**

在 native location state 后加入：

```js
const nativeShareRequests = new Map();
let nativeShareRequestCounter = 0;
```

- [ ] **步骤 2：新增分享文案 builder**

在 `nativeLocationPayload` 后加入：

```js
function shareRouteText(routeItem) {
  const city = cities[routeItem.city || state.city]?.name || currentCity().name;
  if (routeItem.isFeaturedPass) {
    return `我在 LOOP 城市回路发现了${routeItem.title}：${routeItem.price}，${routeItem.validDays}天有效，${routeItem.benefits.length} 个城市站点。`;
  }
  return `我在 LOOP 城市回路发现了${routeItem.title}：${city} ${routeItem.stops.length} 站，适合${routeItem.bestFor || "今天出门"}。`;
}
```

- [ ] **步骤 3：新增 payload builder**

在 `shareRouteText` 后加入：

```js
function shareRoutePayload(routeItem) {
  nativeShareRequestCounter += 1;
  const requestId = `share-${Date.now()}-${nativeShareRequestCounter}`;
  nativeShareRequests.set(requestId, {
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    createdAt: Date.now()
  });
  return {
    requestId,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    title: routeItem.title,
    text: shareRouteText(routeItem),
    url: LOOP_SHARE_URL,
    subject: "LOOP 城市回路"
  };
}
```

- [ ] **步骤 4：新增 native request sender**

在 `shareRoutePayload` 后加入：

```js
function requestNativeShare(routeItem) {
  if (!nativeBridgeCanPost("share.open")) return false;
  const payload = shareRoutePayload(routeItem);
  window.LoopNative.post("share.open", payload);
  showToast("正在打开系统分享...");
  return true;
}
```

- [ ] **步骤 5：新增 Web fallback**

在 `requestNativeShare` 后加入：

```js
async function fallbackWebShare(routeItem) {
  const payload = shareRoutePayload(routeItem);
  nativeShareRequests.delete(payload.requestId);
  const shareData = { title: payload.title, text: payload.text, url: payload.url };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("分享面板已打开。");
    } catch (error) {
      showToast(error?.name === "AbortError" ? "已取消分享。" : "暂时无法分享，请稍后再试。");
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
    showToast("分享文案已复制。");
  } catch {
    showToast("分享文案已准备好，可以手动复制。");
  }
}
```

- [ ] **步骤 6：新增 result handler**

在 `fallbackWebShare` 后加入：

```js
function handleNativeShareResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  const request = nativeShareRequests.get(requestId);
  if (!request) return;
  nativeShareRequests.delete(requestId);
  if (detail.ok && detail.completed) {
    showToast("已完成分享。");
    return;
  }
  if (detail.reason === "cancelled") showToast("已取消分享。");
  else showToast(detail.message || "暂时无法分享，请稍后再试。");
}
```

- [ ] **步骤 7：新增分享入口动作**

在 `handleNativeShareResult` 后加入：

```js
function shareActiveRoute() {
  const routeItem = state.activeRoute;
  if (!routeItem) {
    showToast("先打开一张地图再分享。");
    return;
  }
  if (requestNativeShare(routeItem)) return;
  void fallbackWebShare(routeItem);
}
```

- [ ] **步骤 8：绑定按钮和 result listener**

在 `bindEvents()` 中 `dom.routeClose` 绑定附近加入：

```js
dom.routeShareButton.addEventListener("click", shareActiveRoute);
```

在 `window.addEventListener("loopnative:location-result", handleNativeLocationResult);` 后加入：

```js
window.addEventListener("loopnative:share-result", handleNativeShareResult);
```

- [ ] **步骤 9：验证并提交**

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
git commit -m "接入 Web 原生分享 bridge adapter"
```

---

## 任务 4：iOS UIActivityViewController Handler

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`

**接口：**
- 消耗：`share.open` payload。
- 产出：`loopnative:share-result` event detail。

- [ ] **步骤 1：新增 request model**

在 `NativeLocationRequest` 后加入：

```swift
private struct NativeShareRequest {
    let requestId: String
    let title: String
    let text: String
    let url: URL?
    let subject: String

    init?(payload: [String: Any]) {
        guard
            let requestId = payload["requestId"] as? String, !requestId.isEmpty,
            let text = payload["text"] as? String, !text.isEmpty
        else {
            return nil
        }
        self.requestId = requestId
        self.title = payload["title"] as? String ?? "LOOP 城市回路"
        self.text = text
        self.url = (payload["url"] as? String).flatMap(URL.init(string:))
        self.subject = payload["subject"] as? String ?? self.title
    }
}
```

- [ ] **步骤 2：分派 share message**

在 `userContentController` 的 switch 里加入：

```swift
case "share.open":
    handleShareOpen(payload: payload)
```

- [ ] **步骤 3：实现 request handler**

在 `handleLocationRequest` 后加入：

```swift
private func handleShareOpen(payload: [String: Any]) {
    guard let request = NativeShareRequest(payload: payload) else {
        sendShareResult(
            requestId: payload["requestId"] as? String ?? "",
            reason: "invalid-payload",
            message: "分享请求缺少 requestId 或 text"
        )
        return
    }
    var items: [Any] = [request.text]
    if let url = request.url {
        items.append(url)
    }
    let controller = UIActivityViewController(activityItems: items, applicationActivities: nil)
    controller.setValue(request.subject, forKey: "subject")
    controller.completionWithItemsHandler = { [weak self] activityType, completed, _, error in
        Task { @MainActor in
            guard let self else { return }
            if let error {
                self.sendShareResult(
                    requestId: request.requestId,
                    reason: "failed",
                    message: error.localizedDescription
                )
                return
            }
            if completed {
                self.sendShareResult(
                    requestId: request.requestId,
                    completed: true,
                    activityType: activityType?.rawValue
                )
            } else {
                self.sendShareResult(
                    requestId: request.requestId,
                    reason: "cancelled",
                    message: "用户取消了分享"
                )
            }
        }
    }
    presentShareController(controller, request: request)
}
```

- [ ] **步骤 4：实现 presentation 和结果回传**

在 `handleShareOpen` 后加入：

```swift
private func presentShareController(_ controller: UIActivityViewController, request: NativeShareRequest) {
    guard let presenter = webView?.window?.rootViewController else {
        sendShareResult(
            requestId: request.requestId,
            reason: "unavailable",
            message: "无法展示系统分享面板"
        )
        return
    }
    if let popover = controller.popoverPresentationController, let webView {
        popover.sourceView = webView
        popover.sourceRect = CGRect(x: webView.bounds.midX, y: webView.bounds.midY, width: 1, height: 1)
        popover.permittedArrowDirections = []
    }
    presenter.present(controller, animated: true)
}

private func sendShareResult(requestId: String, completed: Bool, activityType: String?) {
    var payload: [String: Any] = [
        "requestId": requestId,
        "ok": true,
        "completed": completed
    ]
    if let activityType {
        payload["activityType"] = activityType
    }
    dispatchShareResult(payload)
}

private func sendShareResult(requestId: String, reason: String, message: String) {
    let payload: [String: Any] = [
        "requestId": requestId,
        "ok": false,
        "completed": false,
        "reason": reason,
        "message": message
    ]
    dispatchShareResult(payload)
}

private func dispatchShareResult(_ payload: [String: Any]) {
    guard
        let data = try? JSONSerialization.data(withJSONObject: payload),
        let json = String(data: data, encoding: .utf8)
    else {
        return
    }
    let script = "window.dispatchEvent(new CustomEvent('loopnative:share-result', { detail: \(json) }));"
    webView?.evaluateJavaScript(script)
}
```

- [ ] **步骤 5：验证并提交**

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
git commit -m "实现 iOS 分享 bridge handler"
```

---

## 任务 5：同步资产、更新状态并完整验证

**文件：**
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html`
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/styles.css`
- 修改：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`
- 修改：`docs/project/CURRENT_STATE.md`

**接口：**
- 消耗：任务 2 和任务 3 的根 Web 资产。
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
阶段 2C 已完成：分享 native bridge 已接入。路线详情和城市通行证详情可以通过轻量分享入口触发 `share.open`，iOS app 模式打开系统分享面板，并通过 `loopnative:share-result` 回传完成、取消或失败；浏览器模式保留 `navigator.share` 和复制 fallback。

下一步可继续规划照片记录真实后端持久化、TestFlight 准备或推送提醒。
```

在“相关文档”列表中追加：

```markdown
- `docs/superpowers/specs/2026-06-24-share-native-bridge-design.md`
- `docs/superpowers/plans/2026-06-24-share-native-bridge-implementation.md`
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
git add ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/styles.css ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js docs/project/CURRENT_STATE.md
git commit -m "完成分享 bridge 阶段状态"
```

---

## 自检

- Spec 覆盖：本计划覆盖 `share.open`、`loopnative:share-result`、路线详情入口、浏览器 fallback、iOS `UIActivityViewController`、取消、失败和验证命令。
- Scope 检查：本计划只做系统分享，不包含深链、分享图、二维码、短链、社交 SDK、统计埋点或后端。
- 占位标记扫描：本文没有未完成章节或未定义任务。
- 类型一致性：`requestId`、`routeId`、`routeTitle`、`title`、`text`、`url`、`subject`、`completed`、`activityType` 在 Web、Swift 和 registry 中名称一致。

## 执行接力

计划已完成并保存到 `docs/superpowers/plans/2026-06-24-share-native-bridge-implementation.md`。

推荐执行方式：

1. `superpowers:subagent-driven-development`：每个 task 一个新 agent，主线程逐 task review。
2. `superpowers:executing-plans`：当前线程按 task 顺序执行，每个 task 结束做验证和提交。

考虑到本项目上下文较长，推荐第 1 种；如果当前环境不启用子任务，则使用第 2 种。
