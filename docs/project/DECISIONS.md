# LOOP 城市回路 Apple App 决策记录

日期：2026-06-24

这个文件记录项目的长期决策。如果未来任务要推翻这里的决定，必须在同一个提交里更新本文件，并说明原因。

## 决策 1：使用 WebView-first，不做 SwiftUI 全量重写

状态：已接受

Apple app 会把现有网页原型作为 `WKWebView` 里的主要 UI。SwiftUI 只提供原生外壳，不重新实现完整产品界面。

原因：

- 现有网页原型已经承载 LOOP 的视觉语言。
- 快速 SwiftUI 复刻不够像，也删掉了很多页面细节。
- WebView 能保持产品迭代速度，同时 iOS 仍可提供系统能力。

影响：

- 产品 UI 通常先改 Web 资产。
- SwiftUI 保持小而聚焦，只处理外壳行为。
- 原生 UI 只用于 Apple 系统必须接管的界面。

## 决策 2：保持窄 native bridge

状态：已接受

Web 和 iOS 通过 `window.LoopNative` 通信，这个对象由原生外壳注入。

当前 bridge 基础：

- 原生在 document start 注入 `window.LoopNative`。
- Web 用 `document.documentElement.dataset.nativeShell` 标记运行在原生外壳内。
- Web 可向原生发送简单命名消息。
- 原生目前处理轻触感消息，并忽略不支持的消息。

影响：

- 每个原生能力都必须作为明确 bridge message 增加。
- payload 要小、可序列化、可版本化。
- 不暴露宽泛的原生对象，也不提供任意 JavaScript 控制口。

## 决策 3：Repo 文件是事实来源，不是聊天记录

状态：已接受

项目状态必须能从 repo 文件、git 状态、提交记录和验证脚本恢复。

必要接力文件：

- `docs/project/CURRENT_STATE.md`
- `docs/project/DECISIONS.md`
- 产品文档和架构文档
- Superpowers spec 和 implementation plan

影响：

- 阶段边界必须更新 `CURRENT_STATE.md`。
- 新 Codex 窗口不应该需要阅读完整历史聊天。
- 每个实现阶段都要以验证证据和提交收尾。

## 决策 4：使用小而清晰的提交

状态：已接受

每个提交应有一个清楚目的和对应验证路径。

影响：

- 不把文档、数据种子、UI 调整和原生 bridge 混成一个提交。
- staging 前必须检查已有脏文件。
- 只有当文件归属能分开时，才使用 worktree 或子任务并行。

## 决策 5：文档默认使用中文

状态：已接受

项目文档默认使用中文。包括状态文件、决策文件、PRD、架构说明、spec、implementation plan 和 handoff 说明。

影响：

- 之后新增文档先写中文。
- 如果引用代码、命令、文件名或外部 source label，可以保留必要英文原文。
- 如果某个文档必须英文，需要 Vera 明确确认。

## 决策 6：中文优先产品体验

状态：已接受

App 是中文优先。右上角 `EN` 入口保持轻量，直到英文内容和本地化规则被正式规划。

影响：

- 不随手扩展本地化工作。
- 用户可见产品文案保持当前中文体验。

## 决策 7：App Store 准备作为独立阶段

状态：已接受

签名、TestFlight、App Store 截图、隐私标签、审核说明和生产后端准备作为后续独立阶段处理。

影响：

- 早期 iOS 构建可继续使用 `CODE_SIGNING_ALLOWED=NO` 的 Simulator 构建。
- 未验证 bundle ID、签名、capabilities、隐私和生产数据流前，不声明 App Store ready。
