# LOOP 城市回路 Apple App 当前状态

日期：2026-06-24
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

阶段 1 已完成。当前接力提交请用 `git log -1 --oneline` 查看。

最新功能基线：

`f500312 新增移动个人页 UI smoke checks`

近期关键提交：

- `f500312 新增移动个人页 UI smoke checks`
- `110844e 记录 native bridge message registry`
- `5e9c45f 读取 LOOP 数据基础容器`
- `4793079 同步 LOOP 数据到 iOS WebView bundle`
- `beffe8f 新增 LOOP 数据基础容器`
- `1d8ef3b 中文化项目文档`
- `e92c9d8 Expand public cultural discovery data`

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
npm run ios:check
npm run ios:build
```

`npm run ios:build` 会先跑 `ios:check`，然后用关闭签名的 iOS Simulator 目标构建 Xcode 工程。

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

最近完整验证时间：2026-06-24。

已通过：

- `npm run data:check`
- `npm run ui:check`
- `npm run check`
- `npm test`
- `npm run ios:check`
- `npm run ios:build`

如果 Vera 确认优先做照片记录，下一阶段编写并执行 camera/photo native bridge 计划。

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
