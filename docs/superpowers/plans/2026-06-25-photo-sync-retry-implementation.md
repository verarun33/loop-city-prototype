# LOOP Photo Sync Retry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight Web retry queue for pending photo syncs so local photo records can be retried when an API base becomes available again.

**Architecture:** Keep `savePhotoRecord()` as the optimistic local write. Add small retry helpers around the existing `syncPhotoRecord()` adapter, using raw `state.records[].photos` metadata and a `photoSyncInFlight` set to prevent duplicate concurrent uploads.

**Tech Stack:** Browser JavaScript, existing Node static verification scripts, existing iOS Web asset sync.

---

## 文件结构

修改：

- `scripts/verify-photo-record-persistence.mjs`：新增 retry queue 静态守门。
- `script.js`：新增 pending 扫描、重试调度和重复上传处理。
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`：通过 `npm run ios:sync` 同步。
- `docs/project/CURRENT_STATE.md`：阶段完成后更新。

不修改：

- `server.mjs`：复用已有 `POST /api/photo-records` 和 `409 DUPLICATE_PHOTO`。
- Swift native bridge：本阶段不新增原生消息。

## 任务 1：新增 RED 检查

- [ ] **Step 1：扩展照片持久化检查脚本**

在 `scripts/verify-photo-record-persistence.mjs` 的 Web expected 列表里加入：

```js
"collectPendingPhotoSyncs",
"retryPendingPhotoSync",
"schedulePhotoSyncRetry",
"photoSyncInFlight",
"routeIdForPhotoRecord",
"window.addEventListener(\"online\""
```

- [ ] **Step 2：运行 RED**

```sh
npm run photo:persistence-check
```

预期失败：

```text
script.js 必须包含：collectPendingPhotoSyncs
```

- [ ] **Step 3：提交 RED 检查**

```sh
git add scripts/verify-photo-record-persistence.mjs
git commit -m "新增照片同步重试失败检查"
```

## 任务 2：实现重试队列

- [ ] **Step 1：在 `script.js` 的 native request 状态附近新增重试状态**

```js
const PHOTO_SYNC_RETRY_DELAY_MS = 1800;
const photoSyncInFlight = new Set();
let photoSyncRetryTimer = null;
```

- [ ] **Step 2：在 `savePhotoRecord()` 写入 routeId**

新记录对象增加：

```js
routeId: routeItem.id,
```

向已有记录补照片时也执行：

```js
existing.routeId = existing.routeId || routeItem.id;
```

- [ ] **Step 3：新增兼容 helpers**

在 `buildPhotoRecordPayload()` 前新增：

```js
function routeIdForPhotoRecord(record) {
  if (record?.routeId) return record.routeId;
  const match = String(record?.id || "").match(/^rec-photo-\d+-(.+)$/);
  return match?.[1] || "";
}

function photoSyncClientId(record, photo) {
  return `${record.id}-${photo.stopIndex}-${Math.abs(stableHash(photo.station || ""))}`;
}

function routeContextForPhotoRecord(record) {
  const routeId = routeIdForPhotoRecord(record);
  return routeById(routeId, record.city || state.city) || {
    id: routeId,
    title: record.title || "照片记录",
    city: record.city || state.city,
    layer: record.layer || "",
    stops: Array.isArray(record.stops) ? record.stops : []
  };
}
```

- [ ] **Step 4：新增 pending 收集和调度**

在 `syncPhotoRecord()` 后新增：

```js
function collectPendingPhotoSyncs() {
  if (!photoRecordApiBase()) return [];
  return state.records.flatMap((record) => {
    const photos = Array.isArray(record.photos) ? record.photos : [];
    const routeItem = routeContextForPhotoRecord(record);
    if (!routeItem.id) return [];
    return photos
      .filter((photo) => photo?.syncStatus === "pending" && String(photo.url || "").startsWith("data:image/"))
      .map((photo) => ({ record, photo, routeItem }));
  });
}

async function retryPendingPhotoSync() {
  const pending = collectPendingPhotoSyncs();
  for (const item of pending) {
    const clientPhotoId = photoSyncClientId(item.record, item.photo);
    if (photoSyncInFlight.has(clientPhotoId)) continue;
    const payload = buildPhotoRecordPayload(item.routeItem, item.photo.source || "camera", null, item.record, item.photo);
    await syncPhotoRecord(payload, item.record, item.photo);
  }
}

function schedulePhotoSyncRetry() {
  if (photoSyncRetryTimer || !photoRecordApiBase()) return;
  photoSyncRetryTimer = window.setTimeout(() => {
    photoSyncRetryTimer = null;
    void retryPendingPhotoSync();
  }, PHOTO_SYNC_RETRY_DELAY_MS);
}
```

- [ ] **Step 5：给 `syncPhotoRecord()` 加并发和 duplicate 处理**

在函数开头计算 `clientPhotoId` 并使用 `photoSyncInFlight`，同时把 `409 DUPLICATE_PHOTO` 视为 synced。失败 catch 里调用 `schedulePhotoSyncRetry()`。

- [ ] **Step 6：添加触发点**

在 native ready 后、初始化后和 online 事件中调用：

```js
schedulePhotoSyncRetry();
window.addEventListener("online", schedulePhotoSyncRetry);
```

- [ ] **Step 7：运行 GREEN 检查**

```sh
npm run check
npm run photo:persistence-check
```

- [ ] **Step 8：同步 iOS Web 资产并提交**

```sh
npm run ios:check
git add script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "接入照片同步重试队列"
```

## 任务 3：阶段文档和完整验证

- [ ] **Step 1：更新 `docs/project/CURRENT_STATE.md`**

记录阶段 3B-1：照片同步重试队列已完成，默认 API base 为空时不发请求。

- [ ] **Step 2：运行完整验证**

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

- [ ] **Step 3：提交状态文档**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "记录照片同步重试阶段状态"
```
