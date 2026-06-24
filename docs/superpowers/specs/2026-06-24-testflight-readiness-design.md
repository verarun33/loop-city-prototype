# LOOP TestFlight 准备审计设计

日期：2026-06-24

## 背景

LOOP / 城市回路已经采用 WebView-first 的 Apple app 方向。当前 iOS shell 可以在 Simulator 中构建，并已接入相机/相册、定位和分享 native bridge。下一步需要把“能构建”推进到“知道距离 TestFlight 还缺什么”。

本阶段不直接上架、不登录 App Store Connect、不写真实证书配置，也不把本机无法验证的事项伪装成通过。目标是把 TestFlight 准备状态沉淀到 repo：脚本负责检查可验证事实，中文文档负责记录人工待办。

## 目标

- 新增一个本地 `ios:release-check` 守门命令，用于审计 TestFlight 前的 repo 内准备项。
- 输出一份中文 TestFlight 准备清单，明确区分“已可自动检查”和“必须人工完成”。
- 继续保持 WebView-first：iOS shell 只补齐发布准备，不重写产品 UI。
- 阶段结束时更新 `docs/project/CURRENT_STATE.md`，让新窗口可以从 repo 恢复进度。

## 非目标

- 不配置 Apple Developer Team、签名证书、provisioning profile 或 App Store Connect。
- 不上传 TestFlight build。
- 不生成 App Store 截图、隐私标签最终答案、审核说明最终稿或营销文案终稿。
- 不修改 Bundle ID、版本号、权限文案或 app icon 视觉，除非检查暴露出硬性错误。
- 不引入第三方发布工具，如 fastlane、xcodegen 或 CI。

## 已比较方案

### 方案 A：只写人工清单

优点是最快，风险低。缺点是下一次很容易漏检查，也无法防止 repo 退化，例如 icon 丢失、权限文案缺失、版本号格式错误。

### 方案 B：加入本地 release check，并配中文清单

优点是可重复验证，能把“当前不能自动确认”的事项明确留给人工处理；也符合项目现有的 `scripts/verify-*.mjs` 守门风格。缺点是无法替代真实 Apple 账号和 App Store Connect 校验。

### 方案 C：直接做完整发布流水线

优点是最终自动化程度高。缺点是需要 Team ID、证书、profile、App Store Connect key、隐私标签和截图规范；当前信息不足，容易过度工程。

本阶段选择方案 B。

## 设计

### 1. `ios:release-check` 守门命令

在 `package.json` 增加：

```json
"ios:release-check": "npm run ios:check && node scripts/verify-ios-release-readiness.mjs"
```

这个命令先复用 `ios:check`，确保 Web 资产同步、native bridge、Info.plist 和 iOS wrapper 基线仍然成立；然后运行新的 release readiness 脚本。

### 2. 新增 `scripts/verify-ios-release-readiness.mjs`

脚本使用 Node.js 标准库读取以下文件：

- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp.xcodeproj/project.pbxproj`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Assets.xcassets/AppIcon.appiconset/Contents.json`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Assets.xcassets/AppIcon.appiconset/loop-city-app-icon-1024.png`
- `docs/release/ios-testflight-readiness.md`

脚本检查：

- Bundle display name 是 `LOOP 城市回路`。
- `CFBundleShortVersionString` 和 `CFBundleVersion` 存在，且符合简单版本格式。
- 当前 bundle id 是 `com.verarun.loopcity.webview`。
- deployment target 是 `17.0`。
- app icon JSON 引用 `loop-city-app-icon-1024.png`，且图片文件存在并带 PNG 签名。
- 相机、相册、定位权限文案存在且不是空字符串。
- Xcode project 保持自动签名字段，但 `DEVELOPMENT_TEAM` 为空时输出 warning，而不是失败。
- release 清单存在，并包含人工项关键词：Apple Developer Team、App Store Connect、隐私标签、截图、审核说明、TestFlight。

失败只用于 repo 内硬性问题。无法本地验证的外部事项输出 warning，并在文档中保留人工待办。

### 3. 新增 `docs/release/ios-testflight-readiness.md`

文档使用中文，分成三部分：

- 当前自动检查结果：说明本地能检查哪些项目，以及命令。
- 人工发布待办：Team ID、签名、App Store Connect app record、隐私标签、截图、审核说明、TestFlight 测试账号和生产后端状态。
- 不要误判：Simulator 构建通过不等于 TestFlight ready；`CODE_SIGNING_ALLOWED=NO` 构建通过不等于真机签名通过。

### 4. 当前状态更新

`docs/project/CURRENT_STATE.md` 追加阶段 2D：TestFlight 准备审计已建立。下一步可以继续做照片记录真实后端持久化、真实签名配置或 TestFlight 人工材料。

## 验证

本阶段完成前必须在 feature worktree 跑：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:release-check
npm run ios:build
```

合并到 `main` 后必须重新跑同一组命令，再推送。

## 风险和边界

- `ios:release-check` 不是 Apple 官方验证器，只是 repo 级守门。
- 当前 `DEVELOPMENT_TEAM` 为空是已知人工待办，不在本阶段失败。
- 当前 bundle id 是否作为正式上架 id，需要 Vera 在 Apple Developer / App Store Connect 中确认。
- 隐私标签和审核说明必须依据最终数据流填写，不能由脚本自动决定。
