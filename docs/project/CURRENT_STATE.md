# LOOP 城市回路 Apple App 当前状态

日期：2026-06-25
负责人：Vera / Codex
项目路径：`/Users/veraxian/Documents/城市回路`
Git 解析后的路径：`/Users/veraxian/Documents/city loop`
线上原型：`https://verarun33.github.io/loop-city-prototype/`

## 用途

这个文件是后续 Codex 窗口的接力入口。不要把长聊天记录当作项目事实来源。新窗口应该先读这个文件，再看 `git status`、最近提交和 `docs/project/DECISIONS.md`，然后只从“下一步任务”继续。

## 当前产品方向

LOOP / 城市回路正在从移动网页原型转成 Apple app，同时保留当前 WebView 里的 UI、交互和视觉气质。

当前方向是 WebView-first：

- Web 层负责产品 UI、城市内容、城市通行证、兴趣地图、个人页、记录列表和原型交互。
- iOS 层负责 app 外壳、权限、相机/照片、定位、触感、分享、推送、Apple 登录、支付入口和上架准备。
- Web 与 iOS 通过很窄的 `window.LoopNative` bridge 通信。

## 当前已知可用基线

阶段 1、阶段 2A、阶段 2B、阶段 2C、阶段 2D、阶段 2E、阶段 3A、阶段 3B-0、阶段 3B-1、阶段 3C-0、阶段 3D-0 已完成。当前接力提交请用 `git log -1 --oneline` 查看。

最新功能基线：

照片记录 Phase 3A 已落地：项目现在有本地 dev backend、Web photo sync adapter 和 `npm run photo:persistence-check` 守门脚本。阶段 3B-0 已新增 iOS API base 注入入口；阶段 3B-1 已新增 Web 照片同步重试队列；阶段 3C-0 已新增 iOS 本地通知 bridge；阶段 3D-0 已新增 iOS Simulator smoke，能构建、安装、启动 WebView app，并保存经过像素分布检查的首屏截图。`Info.plist` 的 `LoopAPIBaseURL` 默认空值，不会改变线上原型或 iOS 离线包行为；未来配置生产/staging API base 后，原生会在 document start 注入给 Web adapter，并由 Web 层补发可同步的本地照片。

近期关键提交：

- `10a1ab1 接入 iOS Simulator smoke`
- `0ce704f 新增 iOS Simulator smoke 失败检查`
- `9734090 规划 iOS Simulator smoke 实施`
- `ef5cc60 规划 iOS Simulator smoke`
- `b79b405 接入本地通知 native bridge`
- `b3fafe8 新增通知 bridge 失败检查`
- `16fab32 规划本地通知 native bridge`
- `6ad18fd 接入照片同步重试队列`
- `42c76b2 新增照片同步重试失败检查`
- `0ea0838 规划照片同步重试队列`
- `c0d4c12 实现 iOS API base 注入`
- `6080e81 新增 iOS API base 注入失败检查`
- `ddefe1a 规划 iOS API base 注入`
- `0e4869b 接入照片记录 Web 同步 adapter`
- `dc97b3d 实现照片记录 dev API`
- `53563c3 新增照片记录持久化失败检查`
- `6b01b4b 规划照片记录持久化实施`
- `85f8a02 规划照片记录后端持久化`
- `4eafbc3 记录 TestFlight 人工材料草稿`
- `a7e20c3 新增 TestFlight 材料失败检查`
- `ec2c419 规划 TestFlight 人工材料实施`
- `0e65517 规划 TestFlight 人工材料`
- `266c124 完成 TestFlight 准备审计阶段状态`
- `740413f 记录 TestFlight 准备清单`
- `95d347c 新增 TestFlight readiness 失败检查`
- `137e670 规划 TestFlight 准备审计实施`
- `37b40bb 规划 TestFlight 准备审计`
- `8740549 完成分享 bridge 阶段状态`
- `fffdb1b 实现 iOS 分享 bridge handler`
- `e484302 接入 Web 原生分享 bridge adapter`
- `aa44fd4 记录分享 native bridge 协议`
- `86e69a9 新增分享 bridge 失败检查`
- `d1122f7 规划分享 native bridge`
- `bbfb06e 完成定位 bridge 阶段状态`
- `d7216a8 实现 iOS 定位 bridge handler`
- `53c2468 接入 Web 原生定位 bridge adapter`
- `e658744 记录定位 native bridge 协议`
- `f857359 新增定位 bridge 失败检查`
- `15cada0 规划定位 native bridge`
- `340fdb4 完成相机相册 bridge 阶段状态`
- `f500312 新增移动个人页 UI smoke checks`
- `110844e 记录 native bridge message registry`
- `5e9c45f 读取 LOOP 数据基础容器`

## 当前工作区说明

上一次检查时，`main` 与 `origin/main` 对齐，工作区干净。

之前那批网页数据和缓存键改动已经作为正式提交进入主线：

`e92c9d8 Expand public cultural discovery data`

把它当作当前产品数据基线。除非 Vera 明确要求回滚，不要撤销这个提交。

## 验证命令

当前项目已有这些验证命令：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run photo:persistence-check
npm run ios:check
npm run ios:release-check
npm run ios:build
npm run ios:smoke
```

`npm run ios:build` 会先跑 `ios:check`，然后用关闭签名的 iOS Simulator 目标构建 Xcode 工程。
`npm run ios:release-check` 是 repo 级 TestFlight 准备审计，会提示当前 `DEVELOPMENT_TEAM` 仍为空；这个 warning 是人工签名待办，不是脚本失败。
`npm run ios:smoke` 会在可用 iPhone Simulator 中构建、安装并启动 app，截图输出到 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`，并通过 PNG 像素分布避免白屏或启动过渡黑屏误判。

## 开发纪律

每个后续任务都要先做这些事：

1. 读这个文件。
2. 读 `docs/project/DECISIONS.md`。
3. 运行 `git status --short`。
4. 用 `git log --oneline -10` 看最近提交。
5. 编辑前明确任务边界和验证命令。
6. 不碰无关脏文件。
7. 使用小提交，每个提交都能解释和验证。
8. 阶段结束时更新这个文件。

Vera 明确要求每次任务默认使用 `superpowers:using-superpowers` 和 `karpathy-guidelines`。

## 文档语言

项目文档默认使用中文。PRD、架构文档、状态文件、决策文件、spec 和 implementation plan 都应使用中文，除非 Vera 明确要求英文。

## 下一步任务

阶段 1 已完成：数据基础容器、iOS 数据同步、Web 安全读取 hook、native bridge registry、移动个人页 UI smoke check 均已落地。

阶段 2A 已完成：相机/相册 native bridge 已接入。Web 浏览器模式保留原模拟照片流程，iOS app 模式可通过 `camera.capture` 和 `photo.pick` 打开系统入口，并通过 `loopnative:photo-result` 写回现有照片记录。

阶段 2B 已完成：定位 native bridge 已接入。Web 浏览器模式保留原模拟确认流程，iOS app 模式可通过 `location.request` 请求一次系统定位，并通过 `loopnative:location-result` 写回现有定位打卡流程。

阶段 2C 已完成：分享 native bridge 已接入。路线详情和城市通行证详情可以通过轻量分享入口触发 `share.open`，iOS app 模式打开系统分享面板，并通过 `loopnative:share-result` 回传完成、取消或失败；浏览器模式保留 `navigator.share` 和复制 fallback。

阶段 2D 已完成：TestFlight 准备审计已建立。项目现在有 `npm run ios:release-check` 用于 repo 级发布前检查，并有 `docs/release/ios-testflight-readiness.md` 明确区分自动检查项和人工发布待办。当前仍未配置 Apple Developer Team，也未上传 TestFlight build。

阶段 2E 已完成：TestFlight / App Store 人工材料草稿已建立。`docs/release/ios-app-store-materials.md` 记录 App Store Connect 基础信息、TestFlight Beta 信息、App Review notes、截图清单、隐私标签草稿和人工确认项；`npm run ios:release-check` 会检查材料文档存在和关键栏目。

阶段 3A 已完成：照片记录 dev backend 与 Web sync adapter 已接入。

- `server.mjs` 提供 `POST /api/photo-records`、`GET /api/photo-records?userId=...` 和 `GET /api/photo-records/photos/<file>`。
- dev 存储路径是 `.loop-data/photo-records.json` 和 `.loop-data/photos/`，并已被 `.gitignore` 忽略。
- Web 层新增 `photoRecordApiBase()`、`buildPhotoRecordPayload()` 和 `syncPhotoRecord()`；默认 API base 为空，不影响线上原型。
- 本地保存仍是乐观路径：即使同步失败，用户当前照片记录不会丢失，照片对象会保留 `syncStatus` / `syncError`。
- 这仍不是生产云端。生产 API base、真实账号、对象存储、删除/导出和隐私标签最终版仍属于后续阶段。

阶段 3B-0 已完成：iOS API base 注入入口已建立。

- `Info.plist` 新增 `LoopAPIBaseURL`，默认空字符串。
- `WebViewScreen.swift` 会在 document start 注入 `window.LOOP_API_BASE_URL` 和 `document.documentElement.dataset.apiBase`。
- `npm run ios:check` 会检查 `LoopAPIBaseURL`、`loopApiBaseURL`、`LOOP_API_BASE_URL` 和 `dataset.apiBase`，防止配置入口丢失。
- 当前仍未配置真实生产 API 域名，也未接真实账号系统。

阶段 3B-1 已完成：照片同步重试队列已建立。

- Web 层新增 `collectPendingPhotoSyncs()`、`retryPendingPhotoSync()` 和 `schedulePhotoSyncRetry()`。
- API base 为空时不发请求；API base 存在时会补发 `syncStatus !== "synced"` 且仍保留 `data:image/...` 的本地照片。
- 新照片记录会保存 `routeId`；旧照片记录会从 `rec-photo-<day>-<routeId>` 兼容解析 routeId。
- 同一张照片用 `photoSyncInFlight` 避免并发重复上传；服务端返回 `409 DUPLICATE_PHOTO` 时本地视为已同步。
- 同一浏览器会话里失败后最多自动短重试 3 次，避免 API 长时间不可用时形成过密请求循环。

阶段 3C-0 已完成：iOS 本地通知 native bridge 已接入。

- Web bridge registry 新增 `notification.schedule`，原生到 Web 新增 `loopnative:notification-result`。
- “我的 -> 设置 -> 通知”在 iOS app 模式会请求系统通知授权并安排一条本地路线提醒；浏览器模式保留轻量说明 toast。
- iOS 使用 `UNUserNotificationCenter` 和本地 `UNTimeIntervalNotificationTrigger`，不接 APNs 远程推送，也不增加 Push Notifications capability。
- `scripts/verify-ios-webview-wrapper.mjs` 会检查 Web adapter、Swift handler 和 bridge registry，防止通知 bridge 漏同步。
- Simulator build 能验证编译和 bridge 契约；真机通知弹窗和实际提醒仍需要后续 TestFlight/真机 smoke。

阶段 3D-0 已完成：iOS Simulator smoke 已建立。

- `npm run ios:smoke` 会构建 Debug simulator app、安装、启动并保存截图。
- 默认 simulator 是 `iPhone 17 Pro`；可以用 `LOOP_IOS_SMOKE_DEVICE` 指定其他可用 iPhone Simulator。
- 输出目录是 `.loop-artifacts/ios-smoke/`，构建缓存是 `.loop-build/ios-smoke/`，均不进入 git。
- 脚本会轮询截图并解析 PNG 像素分布，避免把白屏或系统启动过渡黑屏误判为通过。
- 这只证明 simulator 可启动和首屏可截图；TestFlight 上传、真实签名和真机权限 smoke 仍是后续人工/阶段任务。

相关文档：

- `docs/superpowers/specs/2026-06-24-camera-photo-native-bridge-design.md`
- `docs/superpowers/plans/2026-06-24-camera-photo-native-bridge-implementation.md`
- `docs/superpowers/specs/2026-06-24-location-native-bridge-design.md`
- `docs/superpowers/plans/2026-06-24-location-native-bridge-implementation.md`
- `docs/superpowers/specs/2026-06-24-share-native-bridge-design.md`
- `docs/superpowers/plans/2026-06-24-share-native-bridge-implementation.md`
- `docs/superpowers/specs/2026-06-24-testflight-readiness-design.md`
- `docs/superpowers/plans/2026-06-24-testflight-readiness-implementation.md`
- `docs/release/ios-testflight-readiness.md`
- `docs/superpowers/specs/2026-06-24-testflight-materials-design.md`
- `docs/superpowers/plans/2026-06-24-testflight-materials-implementation.md`
- `docs/release/ios-app-store-materials.md`
- `docs/superpowers/specs/2026-06-24-photo-record-persistence-design.md`
- `docs/superpowers/plans/2026-06-24-photo-record-persistence-implementation.md`
- `docs/superpowers/specs/2026-06-25-ios-api-base-injection-design.md`
- `docs/superpowers/plans/2026-06-25-ios-api-base-injection-implementation.md`
- `docs/superpowers/specs/2026-06-25-photo-sync-retry-design.md`
- `docs/superpowers/plans/2026-06-25-photo-sync-retry-implementation.md`
- `docs/superpowers/specs/2026-06-25-local-notification-bridge-design.md`
- `docs/superpowers/plans/2026-06-25-local-notification-bridge-implementation.md`
- `docs/superpowers/specs/2026-06-25-ios-simulator-smoke-design.md`
- `docs/superpowers/plans/2026-06-25-ios-simulator-smoke-implementation.md`

最近完整验证时间：2026-06-25。

已通过：

- `npm run data:check`
- `npm run ui:check`
- `npm run check`
- `npm test`
- `npm run photo:persistence-check`
- `npm run ios:check`
- `npm run ios:release-check`
- `npm run ios:build`
- `npm run ios:smoke`

额外手动 smoke：

- 启动本地 dev server 后，HTTP 验证 `POST /api/photo-records`、重复 `clientPhotoId` 返回 `409 DUPLICATE_PHOTO`、`GET /api/photo-records?userId=...` 和照片文件读取均通过。
- `npm run ios:smoke` 已在本机 `iPhone 17 Pro` Simulator 上构建、安装并启动 app，最终截图为 LOOP 登录首屏；脚本曾捕获白屏和启动过渡黑屏，并通过像素分布轮询等到真实 WebView 首屏后才通过。

下一步可继续规划真实账号 / 生产照片 API、真实签名配置、App Store 截图整理、真机通知 smoke 或远程推送策略。

## 新窗口启动提示

```text
继续 LOOP / 城市回路 Apple app 开发。
请先读取 /Users/veraxian/Documents/城市回路/docs/project/CURRENT_STATE.md
和 /Users/veraxian/Documents/城市回路/docs/project/DECISIONS.md。
然后运行 git status --short 和 git log --oneline -10。
必须使用 superpowers:using-superpowers 和 karpathy-guidelines。
只从 CURRENT_STATE.md 的“下一步任务”继续。
项目文档默认使用中文。
```
