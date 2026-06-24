# LOOP Photo Record Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 3A of photo record persistence: a local dev backend, a Web sync adapter, and verification checks, without changing production signing or requiring a real cloud API.

**Architecture:** Keep `savePhotoRecord()` as the local optimistic write path. Add a `syncPhotoRecord()` adapter that only runs when an API base is configured. Extend `server.mjs` with dev API endpoints that persist photo metadata to `.loop-data/photo-records.json` and image files under `.loop-data/photos/`.

**Tech Stack:** Node.js ES modules, native `http`, filesystem JSON/file storage, browser `fetch`, existing WebView-first JavaScript.

---

## 文件结构

修改：

- `.gitignore`：忽略 `.loop-data/`。
- `package.json`：新增 `photo:persistence-check`。
- `server.mjs`：新增 photo record dev API。
- `script.js`：新增 Web sync adapter，默认 API base 为空时不发送请求。
- `docs/project/CURRENT_STATE.md`：阶段完成后更新。

新增：

- `scripts/verify-photo-record-persistence.mjs`：静态和轻量运行时守门。

不修改：

- iOS Swift bridge：Swift 仍只负责相机/相册，不直接上传。
- `Info.plist` 和 Xcode project：本阶段不改权限、签名或 Bundle ID。
- 现有记录 UI：只增加后台同步字段，不重排页面。

## 任务 1：新增失败检查和忽略本地数据目录

**文件：**
- 修改：`.gitignore`
- 修改：`package.json`
- 新增：`scripts/verify-photo-record-persistence.mjs`

**接口：**
- 产出：`npm run photo:persistence-check`，在实现前因为缺少 server/web hooks 失败。

- [ ] **步骤 1：忽略 dev storage**

在 `.gitignore` 增加：

```gitignore
.loop-data/
```

- [ ] **步骤 2：新增 npm 命令**

在 `package.json` scripts 中加入：

```json
"photo:persistence-check": "node scripts/verify-photo-record-persistence.mjs"
```

- [ ] **步骤 3：新增失败检查脚本**

创建 `scripts/verify-photo-record-persistence.mjs`：

```js
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const server = readFileSync(join(root, "server.mjs"), "utf8");
const script = readFileSync(join(root, "script.js"), "utf8");
const gitignore = readFileSync(join(root, ".gitignore"), "utf8");

function requireIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} 必须包含：${expected}`);
}

requireIncludes(gitignore, ".loop-data/", ".gitignore");

for (const expected of [
  "/api/photo-records",
  "handlePhotoRecords",
  "savePhotoRecordPayload",
  "PHOTO_TOO_LARGE",
  "DUPLICATE_PHOTO"
]) {
  requireIncludes(server, expected, "server.mjs");
}

for (const expected of [
  "photoRecordApiBase",
  "buildPhotoRecordPayload",
  "syncPhotoRecord",
  "syncStatus",
  "remotePhotoUrl"
]) {
  requireIncludes(script, expected, "script.js");
}

console.log("Photo record persistence checks passed.");
```

- [ ] **步骤 4：运行 RED 验证**

```sh
npm run photo:persistence-check
```

预期失败：

```text
server.mjs 必须包含：/api/photo-records
```

- [ ] **步骤 5：提交失败检查**

```sh
git add .gitignore package.json scripts/verify-photo-record-persistence.mjs
git commit -m "新增照片记录持久化失败检查"
```

## 任务 2：实现 dev photo record API

**文件：**
- 修改：`server.mjs`

**接口：**
- `POST /api/photo-records`
- `GET /api/photo-records?userId=...`
- `GET /api/photo-records/photos/<file>`

- [ ] **步骤 1：新增 fs/path imports**

把 import 改为：

```js
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
```

- [ ] **步骤 2：新增 storage 常量**

在 `SITE_URL` 后加入：

```js
const LOOP_DATA_DIR = resolve(root, ".loop-data");
const PHOTO_RECORDS_PATH = join(LOOP_DATA_DIR, "photo-records.json");
const PHOTO_DIR = join(LOOP_DATA_DIR, "photos");
const MAX_PHOTO_DATA_URL_BYTES = 900_000;
```

- [ ] **步骤 3：在 router 中加入 photo API**

在 `/api/chat` 分支后、`serveStatic` 前加入：

```js
    if (url.pathname === "/api/photo-records" || url.pathname.startsWith("/api/photo-records/photos/")) {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }
      await handlePhotoRecords(request, response, url);
      return;
    }
```

- [ ] **步骤 4：新增 handler 和 helpers**

在 `handleChat` 后加入：

```js
async function handlePhotoRecords(request, response, url) {
  if (url.pathname.startsWith("/api/photo-records/photos/")) {
    servePhotoRecordFile(url.pathname, response);
    return;
  }
  if (request.method === "GET") {
    const userId = String(url.searchParams.get("userId") || "").trim();
    if (!userId) {
      sendJson(response, 400, { error: "USER_ID_REQUIRED" });
      return;
    }
    const records = readPhotoRecords().filter((record) => record.userId === userId);
    sendJson(response, 200, { ok: true, records });
    return;
  }
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "METHOD_NOT_ALLOWED" });
    return;
  }
  const body = await readJson(request);
  const result = savePhotoRecordPayload(body);
  sendJson(response, result.status, result.body);
}

function ensurePhotoStorage() {
  mkdirSync(PHOTO_DIR, { recursive: true });
  if (!existsSync(PHOTO_RECORDS_PATH)) writeFileSync(PHOTO_RECORDS_PATH, "[]");
}

function readPhotoRecords() {
  ensurePhotoStorage();
  try {
    const value = JSON.parse(readFileSync(PHOTO_RECORDS_PATH, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writePhotoRecords(records) {
  ensurePhotoStorage();
  writeFileSync(PHOTO_RECORDS_PATH, `${JSON.stringify(records, null, 2)}\n`);
}

function safeId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function parseImageDataUrl(value) {
  const text = String(value || "");
  if (Buffer.byteLength(text, "utf8") > MAX_PHOTO_DATA_URL_BYTES) return { error: "PHOTO_TOO_LARGE" };
  const match = text.match(/^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return { error: "UNSUPPORTED_IMAGE_TYPE" };
  return {
    mimeType: match[1],
    extension: match[1] === "image/png" ? "png" : "jpg",
    buffer: Buffer.from(match[2], "base64")
  };
}

function savePhotoRecordPayload(payload) {
  const required = ["clientRecordId", "clientPhotoId", "userId", "routeId", "routeTitle", "station", "imageDataUrl"];
  const missing = required.filter((key) => !String(payload?.[key] || "").trim());
  if (missing.length) return { status: 400, body: { error: "INVALID_PAYLOAD", missing } };

  const image = parseImageDataUrl(payload.imageDataUrl);
  if (image.error) return { status: image.error === "PHOTO_TOO_LARGE" ? 413 : 415, body: { error: image.error } };

  const records = readPhotoRecords();
  if (records.some((record) => record.clientPhotoId === payload.clientPhotoId)) {
    return { status: 409, body: { error: "DUPLICATE_PHOTO" } };
  }

  const now = new Date().toISOString();
  const photoId = `photo-${Date.now()}-${safeId(payload.clientPhotoId)}`;
  const filename = `${photoId}.${image.extension}`;
  writeFileSync(join(PHOTO_DIR, filename), image.buffer);

  const record = {
    id: `srv-${Date.now()}-${safeId(payload.clientRecordId)}`,
    clientRecordId: payload.clientRecordId,
    clientPhotoId: payload.clientPhotoId,
    userId: payload.userId,
    city: payload.city || "",
    routeId: payload.routeId,
    routeTitle: payload.routeTitle,
    layer: payload.layer || "",
    station: payload.station,
    stopIndex: Number(payload.stopIndex) || 0,
    source: payload.source || "",
    capturedAt: payload.capturedAt || now,
    mimeType: image.mimeType,
    width: Number(payload.width) || 0,
    height: Number(payload.height) || 0,
    photoUrl: `/api/photo-records/photos/${filename}`,
    syncedAt: now
  };
  records.unshift(record);
  writePhotoRecords(records);
  return { status: 200, body: { ok: true, record } };
}

function servePhotoRecordFile(pathname, response) {
  const filename = safeId(pathname.split("/").pop()).replace(/-(jpg|png)$/i, ".$1");
  const filePath = resolve(PHOTO_DIR, filename);
  if (!filePath.startsWith(resolve(PHOTO_DIR)) || !existsSync(filePath)) {
    sendText(response, 404, "Not found");
    return;
  }
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
}
```

- [ ] **步骤 5：运行 server 语法和检查**

```sh
npm run check
npm run photo:persistence-check
```

`photo:persistence-check` 仍会因为 Web adapter 缺失失败。

- [ ] **步骤 6：提交 server API**

```sh
git add server.mjs
git commit -m "实现照片记录 dev API"
```

## 任务 3：接入 Web sync adapter

**文件：**
- 修改：`script.js`

**接口：**
- 默认 API base 为空，不发送同步请求。
- 配置 API base 后，照片本地保存成功后后台同步。

- [ ] **步骤 1：新增 API base 和 payload helpers**

在 native bridge 常量附近加入：

```js
function photoRecordApiBase() {
  const configured = window.LOOP_API_BASE_URL || document.documentElement.dataset.apiBase || localStorage.getItem("loop.apiBase") || "";
  return String(configured || "").replace(/\/+$/, "");
}

function buildPhotoRecordPayload(routeItem, source, photoAsset, record, photo) {
  return {
    clientRecordId: record.id,
    clientPhotoId: `${record.id}-${photo.stopIndex}-${stableHash(photo.station)}`,
    userId: state.currentUser?.id || "prototype-user",
    city: record.city || routeItem.city || state.city,
    routeId: routeItem.id,
    routeTitle: routeItem.title,
    layer: record.layer || routeItem.layer || "",
    station: photo.station,
    stopIndex: photo.stopIndex,
    source: photo.source || source,
    capturedAt: photoAsset?.capturedAt || new Date().toISOString(),
    mimeType: photo.mimeType || photoAsset?.mimeType || "image/jpeg",
    width: photo.width || photoAsset?.width || 0,
    height: photo.height || photoAsset?.height || 0,
    imageDataUrl: photo.url || photoAsset?.imageDataUrl || ""
  };
}
```

- [ ] **步骤 2：新增 sync function**

加入：

```js
async function syncPhotoRecord(payload, record, photo) {
  const apiBase = photoRecordApiBase();
  if (!apiBase || !payload.imageDataUrl.startsWith("data:image/")) return;
  photo.syncStatus = "pending";
  try {
    const response = await fetch(`${apiBase}/api/photo-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || "PHOTO_SYNC_FAILED");
    photo.syncStatus = "synced";
    photo.remotePhotoUrl = data.record?.photoUrl || "";
    record.updatedAt = new Date().toISOString();
    persistUserState();
  } catch (error) {
    photo.syncStatus = "pending";
    photo.syncError = error?.message || "PHOTO_SYNC_FAILED";
    persistUserState();
  }
}
```

- [ ] **步骤 3：让 savePhotoRecord 返回 record/photo**

把 `savePhotoRecord()` 的返回值从 boolean 调整为：

```js
return { saved: true, record, photo };
```

重复照片返回：

```js
return { saved: false, record: existing, photo: null };
```

调用处把 `const saved = savePhotoRecord(...)` 改为：

```js
const result = savePhotoRecord(...);
const saved = Boolean(result.saved);
if (saved && result.record && result.photo) {
  void syncPhotoRecord(buildPhotoRecordPayload(routeItem, source, photoAsset, result.record, result.photo), result.record, result.photo);
}
```

- [ ] **步骤 4：运行检查**

```sh
npm run check
npm run photo:persistence-check
```

预期全部 exit 0。

- [ ] **步骤 5：提交 Web adapter**

```sh
git add script.js
git commit -m "接入照片记录 Web 同步 adapter"
```

## 任务 4：阶段状态和完整验证

**文件：**
- 修改：`docs/project/CURRENT_STATE.md`

- [ ] **步骤 1：更新 CURRENT_STATE**

追加阶段 3A：照片记录 dev backend 与 Web sync adapter 已完成，并说明默认 API base 为空，不影响线上原型。

- [ ] **步骤 2：运行完整验证**

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

- [ ] **步骤 3：提交阶段状态**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "完成照片记录持久化阶段状态"
```

## 是否继续实现

这份计划可以执行，但实现前必须接受两个假设：

- 这是 dev backend，不是生产云端。
- iOS 本地包默认不会同步，只有配置 API base 后才同步。

如果 Vera 要先确认生产域名、账号系统或对象存储，请停在 spec/plan，不进入任务 1。
