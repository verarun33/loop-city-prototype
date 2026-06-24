# LOOP 数据基础 v0.1 设计

日期：2026-06-18
状态：历史设计文档，阶段 1 仍参考

## 目标

在接入爬虫、真实 AI、商家后台或数据库前，先建立本地 LOOP 数据基础。

v0.1 要为这些对象提供稳定的数据容器：

- 城市 POI
- 路线
- 城市通行证
- 订单
- 核销
- 用户到访、照片和完成记录
- AI 推荐读取规则
- 人工运营字段

当前 app 是静态前端加本地 Node server。很多产品数据还直接写在 `script.js` 里。v0.1 的目标是把数据形状移到显式本地数据文件，让原型有一个可迁移的事实来源。

## 非目标

- 不接入爬虫。
- 不改真实 AI 推荐服务。
- 不迁移数据库。
- 不做商家登录或商家提交流程。
- 不接入支付 provider。
- 不做大规模 UI 重设计。

## 推荐方案

使用一个本地数据包：

- `data/loop-data-v0.1.js` 导出产品数据，并挂到 `window.LOOP_DATA_V01`。
- `data/README.md` 说明字段归属和来源策略。
- `scripts/verify-loop-data.mjs` 校验引用完整性。
- `index.html` 在 `script.js` 前加载数据文件。
- 第一阶段尽量保持现有 UI 行为不变。

这样 v0.1 离现有原型足够近，同时后面迁移到 API 或数据库也比较直。

## 数据模型

所有记录使用稳定字符串 ID。ID 应可读、可迁移，例如 `poi-sh-ops-cafe`、`route-sh-coffee-01`、`pass-sh-coffee-vol01`。

### 城市

用途：定义支持城市和城市级编辑上下文。

字段：

- `id`：稳定城市 key，例如 `shanghai`、`chengdu`、`abudhabi`
- `name`：展示名
- `code`：路线和订单中使用的短码
- `country`
- `timezone`
- `currency`
- `status`：`draft`、`active` 或 `archived`
- `districts`：编辑用街区列表
- `editorialLine`：城市定位一句话
- `manualFields`：给城市编辑的运营字段说明

### 城市 POI

用途：存储路线、通行证和推荐可引用的城市地点。

字段：

- `id`
- `cityId`
- `name`
- `categoryId`：匹配现有 LOOP layer，例如 `coffee`、`drink`、`art`
- `area`
- `address`
- `displayCoordinate`：原型地图位置，`{ x, y }`
- `geo`：未来真实经纬度，可选
- `summary`
- `tags`
- `openingHours`
- `priceHint`
- `source`：`manual`、`open_data`、`merchant` 或 `prototype_seed`
- `sourceUrl`
- `confidence`：`low`、`medium` 或 `high`
- `status`：`draft`、`active`、`hidden` 或 `archived`
- `adminNotes`

v0.1 可以在缺少真实 `geo` 时先使用 `displayCoordinate`。真实经纬度之后可由公开数据或商家提交补齐。

### 路线

用途：定义路线产品和推荐候选。

字段：

- `id`
- `cityId`
- `code`
- `categoryId`
- `title`
- `summary`
- `stopIds`：有序 POI ID
- `durationLabel`
- `budgetLabel`
- `distanceKm`
- `bestFor`
- `scoreHot`
- `recommendationTags`
- `status`：`draft`、`active`、`hidden` 或 `archived`
- `manualFields`：路线质量编辑备注

路线站点必须引用同一城市下已存在的 POI。临时自由文本站点只能作为迁移数据存在，并应被验证脚本标记。

### 城市通行证

用途：定义带商家权益的付费编辑地图。

字段：

- `id`
- `cityId`
- `routeId`
- `code`
- `title`
- `issue`
- `theme`
- `summary`
- `price`
- `originalPrice`
- `currency`
- `validDays`
- `benefits`
- `status`：`draft`、`active`、`paused` 或 `archived`

权益字段：

- `id`
- `poiId`
- `title`
- `benefitName`
- `description`
- `hours`
- `routeRole`
- `redemptionLimit`：通常为 `1`
- `merchantManaged`：未来商家后台路由
- `manualVerifyRequired`：早期人工运营核验

城市通行证应引用路线，每个权益应引用 POI。这样路线探索和权益核销有关联，但不混成一个对象。

### 订单

用途：描述城市通行证购买状态。

字段：

- `id`
- `orderNo`
- `userId`
- `cityPassId`
- `cityId`
- `status`：`paid`、`active`、`completed`、`expired`、`refunded`
- `amount`
- `currency`
- `createdAt`
- `paidAt`
- `validFrom`
- `validUntil`
- `source`：`prototype`、`manual` 或未来支付 provider

v0.1 不需要 unpaid/pending payment，因为当前原型只保留模拟已支付购买。

### 核销

用途：描述每个权益核销事件。

字段：

- `id`
- `orderId`
- `cityPassId`
- `benefitId`
- `poiId`
- `status`：`available`、`redeemed`、`expired` 或 `voided`
- `redemptionCode`
- `redeemedAt`
- `redeemedBy`：未来商家或后台操作员 ID
- `method`：`qr`、`manual_code` 或 `prototype_simulated_scan`
- `notes`

验证脚本应防止同一 `orderId + benefitId` 出现重复已核销事件。

### 用户记录

用途：描述用户去过、拍过、完成过的历史。

字段：

- `id`
- `userId`
- `cityId`
- `recordType`：`visited`、`photo`、`route_completed`、`pass_completed` 或 `note`
- `poiIds`
- `routeId`
- `cityPassId`
- `orderId`
- `dateISO`
- `timeLabel`
- `title`
- `mood`
- `photo`
- `photoSource`：`camera`、`upload`、`pass_completed` 或空
- `durationLabel`
- `budgetLabel`
- `note`
- `visibility`：v0.1 使用 `private`

这些记录驱动个人页历史和 AI 排除规则。完成通行证可以生成用户记录，但路线完成和权益完成保持分离。

## AI 推荐读取规则

用途：定义本地推荐逻辑和未来 AI 允许读取什么。

字段：

- `candidateCategoryIds`
- `includeStatuses`：通常为 `active`
- `excludeVisitedPoiIds`
- `excludeCompletedRouteIds`
- `preferUserInterestIds`
- `preferCurrentCity`
- `manualBoosts`
- `manualBlocks`
- `maxRoutes`
- `minStops`
- `maxStops`
- `promptRules`

v0.1 推荐规则应读取 POI、路线、用户记录和已完成路线 ID。它本身不调用外部 AI。

## 人工运营字段

用途：在真正做编辑后台和商家工具前，先定义可预期字段。

每类数据都需要字段清单：

- 必填字段
- 可选字段
- 来源类型
- 来源可信度
- 审核负责人
- 最近审核日期
- 发布状态
- 未来商家自助备注

归属拆分：

- LOOP 编辑人工维护城市、路线结构、主题、编辑文案和推荐规则。
- 公开数据未来补地址、坐标、营业时间、网站和来源 URL。
- 商家后台未来补权益详情、实时可用性、核销规则和商家备注。
