# 本地通知 Native Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a narrow iOS local-notification bridge so the existing notification setting can request permission and schedule one local reminder without adding remote push infrastructure.

**Architecture:** Keep WebView-first. Web owns the settings UI and sends `notification.schedule` only when the native shell supports it; iOS owns `UNUserNotificationCenter` authorization and local scheduling, then dispatches `loopnative:notification-result` back to Web.

**Tech Stack:** Vanilla Web app, WKWebView bridge, SwiftUI app shell, UserNotifications, existing Node verification scripts.

---

## File Structure

- Modify `scripts/verify-ios-webview-wrapper.mjs`: add RED checks for the notification bridge contract.
- Modify `script.js`: add Web bridge registry entry, request tracking, notification payload, native request and result handler.
- Modify `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`: add local notification request parsing, authorization, scheduling and result dispatch.
- Modify `docs/architecture/native-bridge-registry.md`: document `notification.schedule` and `loopnative:notification-result`.
- Run `npm run ios:sync` through `ios:check` so `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js` stays generated from root `script.js`.
- Modify `docs/project/CURRENT_STATE.md`: record Phase 3C-0 after implementation.

## Task 1: Add RED Verification

**Files:**
- Modify: `scripts/verify-ios-webview-wrapper.mjs`

- [ ] **Step 1: Add failing bridge checks**

In `scripts/verify-ios-webview-wrapper.mjs`, add these checks:

```js
for (const expected of ["notification.schedule", "loopnative:notification-result", "UNUserNotificationCenter", "NativeNotificationRequest"]) {
  if (!webViewScreen.includes(expected)) {
    throw new Error(`WebViewScreen.swift 必须实现 native notification bridge：${expected}`);
  }
}

for (const expected of ["notification.schedule", "requestNativeNotificationReminder", "handleNativeNotificationResult"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js 必须实现 notification bridge adapter：${expected}`);
  }
}

for (const expected of ["notification.schedule", "loopnative:notification-result", "denied", "invalid-payload", "failed"]) {
  if (!bridgeRegistry.includes(expected)) {
    throw new Error(`native-bridge-registry.md 必须记录 notification bridge：${expected}`);
  }
}
```

- [ ] **Step 2: Run RED check**

Run:

```sh
npm run ios:check
```

Expected: fail with missing `notification.schedule` or `native notification bridge`.

- [ ] **Step 3: Commit RED check**

```sh
git add scripts/verify-ios-webview-wrapper.mjs
git commit -m "新增通知 bridge 失败检查"
```

## Task 2: Implement Web Adapter

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add bridge registry and state**

Change `LOOP_NATIVE_BRIDGE_MESSAGES` to include `notification.schedule`.

Add:

```js
const nativeNotificationRequests = new Map();
let nativeNotificationRequestCounter = 0;
```

- [ ] **Step 2: Add payload and request helpers**

Add near share bridge helpers:

```js
function notificationReminderPayload() {
  nativeNotificationRequestCounter += 1;
  const requestId = `notification-${Date.now()}-${nativeNotificationRequestCounter}`;
  nativeNotificationRequests.set(requestId, { createdAt: Date.now(), kind: "route-reminder" });
  return {
    requestId,
    kind: "route-reminder",
    title: "LOOP 城市回路",
    body: "明天可以继续完成一条城市路线。",
    delaySeconds: 86400
  };
}

function requestNativeNotificationReminder() {
  if (!nativeBridgeCanPost("notification.schedule")) return false;
  const payload = notificationReminderPayload();
  window.LoopNative.post("notification.schedule", payload);
  showToast("正在打开系统通知授权...");
  return true;
}
```

- [ ] **Step 3: Add result handler**

Add:

```js
function handleNativeNotificationResult(event) {
  const detail = event.detail || {};
  const requestId = detail.requestId || "";
  if (!nativeNotificationRequests.has(requestId)) return;
  nativeNotificationRequests.delete(requestId);
  if (detail.ok && detail.scheduled) {
    showToast("已为你开启一条本地路线提醒。");
    return;
  }
  if (detail.reason === "denied") showToast("通知权限未开启，暂时不能发送提醒。");
  else showToast(detail.message || "通知提醒暂时无法开启。");
}
```

- [ ] **Step 4: Wire settings action and event listener**

In `renderSettingsPanel()`, make `notify` call:

```js
if (action === "notify") {
  if (requestNativeNotificationReminder()) return;
  showToast("iOS app 中会使用本地通知提醒你继续探索。");
  return;
}
```

Add:

```js
window.addEventListener("loopnative:notification-result", handleNativeNotificationResult);
```

- [ ] **Step 5: Verify Web syntax**

Run:

```sh
npm run check
```

Expected: pass.

## Task 3: Implement iOS Local Notification Handler

**Files:**
- Modify: `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`

- [ ] **Step 1: Import UserNotifications**

Add:

```swift
import UserNotifications
```

- [ ] **Step 2: Add request struct**

Add inside `Coordinator`:

```swift
private struct NativeNotificationRequest {
    let requestId: String
    let kind: String
    let title: String
    let body: String
    let delaySeconds: TimeInterval

    init?(payload: [String: Any]) {
        guard
            let requestId = payload["requestId"] as? String, !requestId.isEmpty,
            let title = payload["title"] as? String, !title.isEmpty,
            let body = payload["body"] as? String, !body.isEmpty
        else {
            return nil
        }
        self.requestId = requestId
        self.kind = payload["kind"] as? String ?? "route-reminder"
        self.title = title
        self.body = body
        let delay = payload["delaySeconds"] as? Double ?? 86400
        self.delaySeconds = min(max(delay, 60), 604800)
    }
}
```

- [ ] **Step 3: Route bridge message**

Add to the switch:

```swift
case "notification.schedule":
    handleNotificationSchedule(payload: payload)
```

- [ ] **Step 4: Add scheduling function**

Add:

```swift
private func handleNotificationSchedule(payload: [String: Any]) {
    guard let request = NativeNotificationRequest(payload: payload) else {
        sendNotificationResult(
            requestId: payload["requestId"] as? String ?? "",
            reason: "invalid-payload",
            message: "通知请求缺少 requestId、title 或 body"
        )
        return
    }

    Task { @MainActor in
        do {
            let granted = try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])
            guard granted else {
                sendNotificationResult(
                    requestId: request.requestId,
                    reason: "denied",
                    message: "通知权限未开启"
                )
                return
            }

            let content = UNMutableNotificationContent()
            content.title = request.title
            content.body = request.body
            content.sound = .default
            content.userInfo = ["kind": request.kind]

            let identifier = "loop-\(request.requestId)"
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: request.delaySeconds, repeats: false)
            let notification = UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
            try await UNUserNotificationCenter.current().add(notification)
            sendNotificationResult(
                requestId: request.requestId,
                scheduled: true,
                authorizationStatus: "authorized",
                identifier: identifier
            )
        } catch {
            sendNotificationResult(
                requestId: request.requestId,
                reason: "failed",
                message: error.localizedDescription
            )
        }
    }
}
```

- [ ] **Step 5: Add result dispatch helpers**

Add:

```swift
private func sendNotificationResult(
    requestId: String,
    scheduled: Bool,
    authorizationStatus: String,
    identifier: String
) {
    let payload: [String: Any] = [
        "requestId": requestId,
        "ok": true,
        "scheduled": scheduled,
        "authorizationStatus": authorizationStatus,
        "identifier": identifier
    ]
    dispatchNotificationResult(payload)
}

private func sendNotificationResult(requestId: String, reason: String, message: String) {
    let payload: [String: Any] = [
        "requestId": requestId,
        "ok": false,
        "scheduled": false,
        "reason": reason,
        "message": message
    ]
    dispatchNotificationResult(payload)
}

private func dispatchNotificationResult(_ payload: [String: Any]) {
    guard
        let data = try? JSONSerialization.data(withJSONObject: payload),
        let json = String(data: data, encoding: .utf8)
    else {
        return
    }
    let script = "window.dispatchEvent(new CustomEvent('loopnative:notification-result', { detail: \(json) }));"
    webView?.evaluateJavaScript(script)
}
```

- [ ] **Step 6: Verify iOS build**

Run:

```sh
npm run ios:build
```

Expected: pass.

## Task 4: Document Bridge Contract

**Files:**
- Modify: `docs/architecture/native-bridge-registry.md`

- [ ] **Step 1: Add `notification.schedule` message section**

Document payload and iOS behavior exactly as the spec states.

- [ ] **Step 2: Add `loopnative:notification-result` event section**

Document success detail, failure detail and allowed failure reasons.

- [ ] **Step 3: Run check**

Run:

```sh
npm run ios:check
```

Expected: pass after Web and Swift implementation are present.

## Task 5: Update State, Verify, Merge

**Files:**
- Modify: `docs/project/CURRENT_STATE.md`
- Generated by `npm run ios:sync`: `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`

- [ ] **Step 1: Update current state**

Record Phase 3C-0 as complete and add the spec/plan docs to the related documents list.

- [ ] **Step 2: Commit implementation**

Use small commits:

```sh
git add script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift docs/architecture/native-bridge-registry.md
git commit -m "接入本地通知 native bridge"

git add docs/project/CURRENT_STATE.md
git commit -m "记录本地通知 bridge 阶段状态"
```

- [ ] **Step 3: Full branch verification**

Run:

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

Expected: all pass, with the known `DEVELOPMENT_TEAM` warning during `ios:release-check`.

- [ ] **Step 4: Merge and push**

From main checkout:

```sh
git merge --ff-only codex/local-notification-bridge-20260625
npm run data:check
npm run ui:check
npm run check
npm test
npm run photo:persistence-check
npm run ios:check
npm run ios:release-check
npm run ios:build
git push origin main
git worktree remove .worktrees/local-notification-bridge-20260625
git branch -d codex/local-notification-bridge-20260625
```

Expected: main equals origin/main and the worktree is cleanly removed.

## Plan Self-Review

- Spec coverage: Covers Web adapter, iOS handler, registry docs, verification and current-state update.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: Uses `notification.schedule`, `loopnative:notification-result`, `NativeNotificationRequest`, `requestNativeNotificationReminder` consistently.
