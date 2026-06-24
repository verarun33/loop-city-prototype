# LOOP 城市回路 iOS App Foundation 设计

日期：2026-06-24
状态：阶段 1 执行依据

## 目标

为 LOOP / 城市回路建立稳定的 Apple app 开发底座，同时不丢失当前移动网页原型的视觉和交互质量。

## 当前上下文

项目现在已有：

- 已部署的 GitHub Pages 原型。
- 本地 Node 开发服务。
- 根目录 Web 资产。
- iOS `WKWebView` 外壳。
- App icon。
- native bridge 基础。
- Web 语法、城市通行证行为、iOS 资产同步和 iOS Simulator build 验证脚本。

`e92c9d8 Expand public cultural discovery data` 已成为当前公开文化数据基线。

## 推荐方案

采用 WebView-first iOS app foundation。

SwiftUI 只承载聚焦的 `WKWebView` 外壳，并通过很窄的 `window.LoopNative` bridge 暴露原生能力。Web app 仍是 canonical UI。只有浏览器能力不足时，才用原生能力渐进增强产品体验。

## 比较过的方案

### SwiftUI 全量重写

当前拒绝。

它最终可能得到更纯的原生代码，但第一次快速复刻证明 Web 设计细节很容易丢。这样会拖慢产品迭代，并制造两个 UI 事实来源。

### 只套 WebView，不做 native bridge

长期拒绝。

它能保留 UI，但无法成为严肃 Apple app，因为相机、相册、定位、分享、触感、认证和支付都需要原生集成。

### WebView-first 加窄 native bridge

已接受。

它保留原型，同时给原生能力留出受控成长路径。

## 架构

系统分三层：

1. Web 产品层
   - 负责页面、视觉、产品文案、城市内容、通行证卡片、兴趣地图和记录列表。
2. iOS 外壳层
   - 负责 `WKWebView`、打包资产、原生权限、app icon、launch screen 和 bridge handler。
3. 项目控制层
   - 负责 handoff 文档、决策、spec、plan、脚本和验证命令。

## 数据流

当前启动流程：

1. `npm run ios:sync` 把根 Web 资产复制进 iOS app bundle。
2. iOS app 通过 `WKWebView.loadFileURL` 加载 `Web/index.html`。
3. 原生注入 `window.LoopNative`。
4. Web 检测 bridge 并标记 native shell 状态。
5. Web 渲染与浏览器模式一致的产品 UI。

未来原生能力流程：

1. Web 调用 `window.LoopNative.post("capability.name", payload)`。
2. 原生验证 message name 和 payload。
3. 原生执行系统动作。
4. 如果功能需要结果，原生通过文档化的 response event 返回。

## 边界

Web 层不能假设 bridge 一定存在。

iOS 层不能在 SwiftUI 里重建产品页面，除非是系统界面必须原生处理。

bridge 不能变成泛用远程控制 API。每个 message 都必须有产品理由、payload 形状和验证检查。

## 文档系统

repo 必须包含足够状态，让新 Codex 窗口可安全继续：

- `docs/project/CURRENT_STATE.md`
- `docs/project/DECISIONS.md`
- `docs/product/loop-city-ios-app-prd.md`
- `docs/architecture/ios-webview-app-architecture.md`
- `docs/superpowers/specs/2026-06-24-loop-city-ios-app-design.md`
- `docs/superpowers/plans/`

所有项目文档默认使用中文。

## 实施阶段

### 阶段 0：App 外壳与项目控制

状态：基本完成。

交付物：

- WebView 外壳。
- App icon 和 launch screen。
- 资产同步。
- native bridge foundation。
- 接力文档。
- PRD 和架构文档。

### 阶段 1：数据基础与 UI 安全网

交付物：

- 把数据基础从巨大 Web 行为文件里拆出第一层显式数据容器。
- 保持浏览器模式和 iOS 外壳模式等价。
- 给个人页关键 section 和横向 rails 加检查。

### 阶段 2：原生能力 bridge

交付物：

- 相机/照片路径。
- 定位权限和城市辅助路径。
- 分享面板路径。
- 必要触感 hook。

### 阶段 3：账号和业务状态

交付物：

- 账号方案决策。
- active pass state。
- 记录持久化。
- 订单或通行证模拟边界。

### 阶段 4：TestFlight 和 App Store 准备

交付物：

- Bundle ID 和签名。
- 隐私文案和 privacy labels。
- TestFlight build 流程。
- App Store 截图和审核说明。

## 验证

阶段完成前，根据改动运行：

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

文档改动如果发生在有代码改动的工作区，也要跑项目检查，避免在坏状态下收尾。

## 当前执行入口

阶段 1 详细计划：

`docs/superpowers/plans/2026-06-24-loop-city-ios-app-implementation.md`
