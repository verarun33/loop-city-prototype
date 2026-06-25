# LOOP 照片同步重试设计

日期：2026-06-25

## 背景

Phase 3A 已经接入照片记录 dev backend 和 Web sync adapter。当前保存链路是：

1. `savePhotoRecord()` 先把照片写入 `state.records`。
2. `syncPhotoRecord()` 在 API base 存在且照片是 `data:image/...` 时异步 POST 到 `/api/photo-records`。
3. 同步失败时照片对象会保留 `syncStatus: "pending"` 和 `syncError`。

缺口是 `pending` 目前只是一个状态字段：如果用户当时离线、API 失败、或请求超时，之后即使 API base 恢复也不会自动补发。

## 目标

- 增加一个轻量 Web 层重试队列，补发本地 `state.records` 里仍可同步的 pending 照片。
- 继续保持本地乐观保存：重试不影响当前记录 UI，也不阻塞用户拍照。
- 只在 API base 存在时运行；默认空 API base 时不做任何网络请求。
- 支持新老照片记录：新记录保存 `routeId`，旧记录从 `rec-photo-日期-routeId` 兼容反推。
- 避免重复并发上传同一张照片。

## 非目标

- 不实现生产后台任务、推送、后台上传或 iOS 原生上传。
- 不新增 native bridge message。
- 不改变照片记录列表 UI。
- 不解决真实账号、对象存储、删除/导出、隐私标签最终版。

## 方案

### 数据兼容

新建照片记录时写入 `routeId: routeItem.id`。对于旧记录，新增 `routeIdForPhotoRecord(record)`：

- 优先读 `record.routeId`。
- 如果没有，尝试从 `record.id` 的 `rec-photo-<day>-<routeId>` 形状里解析。
- 仍解析不到时返回空字符串，不进入重试。

### 重试队列

新增函数：

- `collectPendingPhotoSyncs()`：扫描 `state.records` 的 raw `photos`，收集 `syncStatus === "pending"` 且 `photo.url` 是 `data:image/...` 的照片。
- `retryPendingPhotoSync()`：逐个调用现有 `buildPhotoRecordPayload()` 和 `syncPhotoRecord()`。
- `schedulePhotoSyncRetry()`：用短延迟合并多次触发，避免连续事件造成重复扫描。

并发控制：

- 用 `photoSyncInFlight` 保存 `clientPhotoId`。
- 同一张照片正在同步时，后续重试跳过。

### 触发点

- `syncPhotoRecord()` 失败后安排一次延迟重试。
- `installNativeShellBridge()` 标记 native ready 后安排一次重试。
- 初始化完成后安排一次重试。
- 浏览器 `online` 事件触发重试。

### 重复上传处理

如果服务端返回 `409 DUPLICATE_PHOTO`，说明远端已有同一 `clientPhotoId`。Web 可以把本地照片标记为 `synced`，避免永久 pending。

## 验证

扩展 `npm run photo:persistence-check`：

- 检查 `script.js` 包含 `collectPendingPhotoSyncs`、`retryPendingPhotoSync`、`schedulePhotoSyncRetry`、`photoSyncInFlight`、`routeIdForPhotoRecord`。
- 检查脚本包含 `window.addEventListener("online"`。

完整阶段验证：

- `npm run check`
- `npm run photo:persistence-check`
- `npm test`
- `npm run ios:check`
- `npm run ios:release-check`
- `npm run ios:build`

## 风险

- 当前仍是 WebView-first 原型，没有真实账号权限模型；重试只对当前本地用户状态负责。
- 只要 API base 为空，重试不会发请求，因此不会影响 GitHub Pages 线上原型。
