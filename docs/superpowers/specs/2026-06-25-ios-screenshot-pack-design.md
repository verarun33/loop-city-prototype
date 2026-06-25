# iOS App Store 截图包设计

日期：2026-06-25
阶段：3D-1
范围：LOOP 城市回路 WebView-first Apple app

## 背景

阶段 3D-0 已经建立 `npm run ios:smoke`，可以在 iPhone Simulator 中构建、安装、启动 app，并通过 PNG 像素分布确认最终截图不是白屏或系统启动过渡黑屏。

下一步上架准备需要稳定的截图产物位置和可复跑命令。当前不应该直接声明 App Store 截图完成，因为正式截图还需要最终产品流程、登录态、城市内容选择、文案审阅和 Apple Connect 尺寸策略。本阶段只做截图包自动化底座。

## 目标

新增 `npm run ios:screenshots`：

- 复用 `scripts/ios-simulator-smoke.mjs` 的构建、安装、启动和渲染判定能力。
- 针对当前本机可用 iPhone Simulator 生成登录首屏截图基线。
- 默认生成 `iPhone 17 Pro Max` 和 `iPhone 17 Pro` 两张截图。
- 输出到 `.loop-artifacts/ios-screenshots/`。
- 生成一份 `manifest.json`，记录设备名、输出路径、PNG 宽高和文件大小。
- 让 `ios:release-check` 静态检查截图包入口存在，防止后续遗漏。

## 非目标

- 不引入 Fastlane。
- 不上传 App Store Connect。
- 不配置 Apple Developer Team。
- 不生成最终营销文案覆盖层。
- 不自动登录或遍历所有产品页面。
- 不声明这些截图就是最终 App Store 提交版本。

## 方案比较

推荐方案：新增 Node 脚本 `scripts/ios-screenshot-pack.mjs`，它逐个设置 `LOOP_IOS_SMOKE_DEVICE` 和 `LOOP_IOS_SMOKE_SCREENSHOT_PATH`，调用现有 `ios-simulator-smoke.mjs`。

优点是复用已经验证过的 smoke 逻辑，改动少；截图路径可控；后续要扩展页面时可以继续沿用 manifest 结构。

备选方案：直接在 `ios-simulator-smoke.mjs` 中支持多个设备。

这会让 smoke 脚本职责变宽。smoke 的职责应该保持“单设备启动验证”，截图包脚本负责批量产物。

备选方案：引入 Fastlane snapshot 或 XCTest UI tests。

长期可能有价值，但当前项目还没有签名、TestFlight 上传链路，也没有稳定的登录后截图脚本；此阶段引入过重。

## 设计

### `ios-simulator-smoke.mjs` 输出路径

新增环境变量 `LOOP_IOS_SMOKE_SCREENSHOT_PATH`。如果设置，smoke 的最终截图写入该路径；如果不设置，继续使用现有 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`。

现有 `LOOP_IOS_SMOKE_DEVICE` 继续用于选择设备。

### `ios-screenshot-pack.mjs`

新增脚本读取设备列表：

- 默认：`iPhone 17 Pro Max,iPhone 17 Pro`
- 可用 `LOOP_IOS_SCREENSHOT_DEVICES` 覆盖，逗号分隔。

每个设备输出：

```text
.loop-artifacts/ios-screenshots/<slug>/login.png
```

其中 `<slug>` 是设备名的小写 kebab case，例如 `iphone-17-pro-max`。

脚本逐个调用：

```sh
LOOP_IOS_SMOKE_DEVICE="<device>" \
LOOP_IOS_SMOKE_SCREENSHOT_PATH="<output>" \
node scripts/ios-simulator-smoke.mjs
```

每张截图完成后，脚本读取 PNG header，记录：

- `device`
- `slug`
- `screen`
- `path`
- `width`
- `height`
- `bytes`

最后写入：

```text
.loop-artifacts/ios-screenshots/manifest.json
```

## 验证

新增失败检查先要求：

- `package.json` 包含 `ios:screenshots`。
- `scripts/ios-screenshot-pack.mjs` 存在。
- `ios-simulator-smoke.mjs` 包含 `LOOP_IOS_SMOKE_SCREENSHOT_PATH`。
- `ios-testflight-readiness.md` 记录 `npm run ios:screenshots`。
- `ios-app-store-materials.md` 记录截图包输出目录。

实现后运行：

```sh
npm run ios:release-check
npm run ios:screenshots
```

阶段结束前继续跑完整验证：

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
npm run ios:screenshots
```

## 风险

- 默认设备名随 Xcode runtime 变化。脚本允许 `LOOP_IOS_SCREENSHOT_DEVICES` 覆盖。
- 截图包第一版只有登录首屏，不覆盖完整产品叙事；后续阶段需要补登录后首页、地图、通行证、我的等页面。
- 多设备截图会启动更多 simulator，耗时比单次 smoke 更长。
