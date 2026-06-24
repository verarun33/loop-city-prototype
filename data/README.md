# LOOP 数据基础 v0.1

这个目录保存 LOOP 原型和 iOS WebView bundle 可直接加载的数据文件。

## 事实来源

根目录 `data/` 是事实来源。iOS 通过 `npm run ios:sync` 获得同步副本。

## 当前容器

`loop-data-v0.1.js` 会挂载 `window.LOOP_DATA_V01`。

当前字段：

- `version`
- `cities`
- `sourceGroups`

## 规则

- 数据文件必须无需构建即可被浏览器加载。
- iOS native bridge 不存在时，浏览器模式仍要工作。
- 新增必填字段前，先在 `scripts/verify-loop-data.mjs` 增加验证。
- 支付、订单对账和商家管理权益不要放进本文件，除非对应阶段已经规划。
