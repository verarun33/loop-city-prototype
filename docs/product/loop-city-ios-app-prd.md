# LOOP 城市回路 iOS App PRD

日期：2026-06-24
状态：Vera 已同意进入 implementation plan，后续变更继续在本文维护

## 产品目标

把现有 LOOP / 城市回路移动网页原型转成 Apple app，同时保留当前视觉、交互和页面完整度，并在 WebView 不足的地方补上 iOS 原生能力。

## 产品定位

LOOP 是城市探索和城市通行证产品。它帮助用户发现策划路线、持有或购买城市通行证、记录自己的探索，并在“我的”里看到像城市记忆地图一样的个人记录。

第一版 Apple app 必须感觉像当前原型，而不是一个重新设计的新产品。

## 核心用户

- 想要策划路线和城市灵感的城市探索者。
- 会回到“我的”查看进行中通行证、兴趣地图和探索记录的用户。
- Vera 和早期测试用户，他们需要一个能在真机上测试的 app 形态原型。

## MVP 范围

MVP iOS app 必须包含：

- 当前 WebView UI，保留 LOOP 视觉设计。
- 本地打包 Web 资产，不依赖 GitHub Pages 启动。
- iPhone 顶部和底部安全区适配。
- App icon 和 launch screen。
- 原生 bridge 基础，供未来 iOS 能力接入。
- 轻触感 bridge。
- `Info.plist` 中的相机和相册权限声明。
- Web 资产同步脚本和验证脚本。
- Simulator 构建命令。
- 项目接力文档，保证新窗口可继续开发。

## 近期产品范围

MVP 外壳之后按这个顺序推进：

1. 相机和照片附件，用于探索记录。
2. 定位权限和当前城市辅助。
3. 探索记录和 active pass state 的本地持久化。
4. 城市通行证、路线卡、个人页快照的系统分享。
5. 后端方向清晰后再接 Apple 登录或账号 bridge。
6. TestFlight 签名和隐私文档。

## 当前阶段明确不做

当前阶段不包括：

- SwiftUI 全量重写产品 UI。
- 商家后台。
- 真实支付集成。
- 真实订单对账。
- 真实二维码核销。
- 完整英文本地化。
- 生产数据库迁移。
- App Store 提交。

这些都是未来阶段，但不能混进当前 app foundation 工作里。

## 必须保留的核心界面

iOS app 应保留当前网页原型的这些界面：

- 今日
- 地图
- 秘境
- 我的
- 进行中的城市通行证
- 进行中的兴趣地图
- 今日探索记录列表
- 城市切换
- 语言入口

“我的”页尤其敏感，因为最近已经调过：

- iPhone 灵动岛附近顶部布局。
- 底部 tab 间距。
- 进行中的城市通行证横向 rails。
- 进行中的兴趣地图横向 rails。
- “今日探索”记录表头 sticky。
- 通行证卡片价格位置。

## UX 要求

- Apple app 看起来应和移动网页原型一致，除非某个系统界面必须原生处理。
- WebView 不能出现浏览器 chrome。
- iPhone 安全区要被尊重，但不能浪费顶部空间。
- 底部导航必须避开 home indicator 且保持可点。
- 横向 rails 在触屏设备上必须可左右滑动。
- sticky 记录表头不能和顶部 logo bar 之间留空隙。
- App 启动后直接进入产品体验，不做营销 landing page。

## 原生能力要求

iOS 外壳通过窄 bridge 提供原生能力：

- `ready`：Web 告诉原生页面已加载。
- `haptic`：Web 请求轻触感。
- `camera.capture`：未来用于拍照记录。
- `photo.pick`：未来用于相册选择。
- `location.request`：未来用于城市/定位辅助。
- `share.open`：未来用于 iOS 分享面板。

bridge message 必须明确、可版本化。没有 bridge 时，Web 层必须仍可运行。

## 数据要求

当前原型很多产品数据还在 `script.js`。在加生产后端复杂度之前，应逐步把数据移入显式数据模块或数据文件。

数据域包括：

- 城市
- POI
- 路线
- 城市通行证
- 兴趣地图
- 订单或 active pass state
- 用户探索记录
- 推荐规则

已有数据底座设计仍然有效：

`docs/superpowers/specs/2026-06-18-loop-data-foundation-v0.1-design.md`

## 成功标准

iOS app foundation 成功的标准：

- `npm run ios:build` 成功。
- `npm run ios:sync` 后，iOS 打包 Web 资产和根 Web 资产一致。
- Simulator app 能启动并展示和网页原型一致的核心 UI。
- Web app 能识别 native bridge，同时不破坏浏览器模式。
- 项目状态能从 repo 文档恢复，不依赖长聊天记录。

## 风险

- `script.js` 很大，继续往里面堆行为会增加漂移风险。
- WebView native bridge 如果没有 message/payload 约束，会变乱。
- App Store 准备可能被签名、隐私标签、支付政策或生产后端决策阻塞。
- 如果只测浏览器不测 iOS bundle，移动 UI 容易回归。

## 待决策产品问题

进入相应阶段前需要决定：

- 城市通行证支付用 IAP、Apple Pay、外部 checkout，还是早期继续模拟购买。
- 早期账号使用 Apple 登录、手机号、邮箱验证码，还是匿名本地 profile。
- 第一个 TestFlight 版本里探索记录是 local-first 还是服务端同步。
- 第一个真机测试重点城市是上海、成都，还是阿布扎比。
