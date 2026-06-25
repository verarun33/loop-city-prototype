# LOOP iOS TestFlight 准备清单

日期：2026-06-24
状态：Repo 级审计已建立，真实 TestFlight 发布尚未开始。

## 当前自动检查

运行：

```sh
npm run ios:release-check
```

这个命令会先运行 `npm run ios:check`，再检查：

- iOS WebView 包内 Web 资产和根目录资产同步。
- `Info.plist` 包含 app 显示名、版本号、build 号、相机/相册/定位权限文案。
- Xcode project 使用 `com.verarun.loopcity.webview` 作为当前 Bundle ID。
- iOS deployment target 是 `17.0`。
- app icon asset 引用 `loop-city-app-icon-1024.png`，且文件是 PNG。
- 本文档包含 TestFlight 前的人工待办。
- TestFlight / App Store Connect 人工材料草稿存在，并包含核心栏目。

## 当前本地状态

- Simulator 构建命令：`npm run ios:build`
- Simulator 启动 smoke：`npm run ios:smoke`
- 当前构建方式：`CODE_SIGNING_ALLOWED=NO`
- 当前显示名：`LOOP 城市回路`
- 当前版本号：`0.1`
- 当前 build 号：`1`
- 当前 Bundle ID：`com.verarun.loopcity.webview`
- 当前 Apple Developer Team：尚未配置，`DEVELOPMENT_TEAM` 为空。

### iOS Simulator smoke

`npm run ios:smoke` 会在本机 simulator 中构建、安装并启动 WebView app，截图输出到 `.loop-artifacts/ios-smoke/loop-city-ios-smoke.png`。

这个命令用于 repo 级启动 smoke，不代表 TestFlight 上传、真实签名或真机权限验证完成。

## TestFlight 前人工待办

- Apple Developer Team：确认团队、Team ID、付费开发者账号状态。
- 签名配置：为 `com.verarun.loopcity.webview` 或正式 Bundle ID 配置 Automatic Signing / provisioning profile。
- App Store Connect：创建 app record，确认 SKU、Bundle ID、名称、主语言和类别。
- 隐私标签：根据最终数据流填写相机、相册、定位、分析、账号和后端数据使用情况。
- 截图：准备 iPhone 尺寸截图，至少覆盖首页、地图/通行证、我的、记录或打卡流程。
- 审核说明：解释 WebView-first 架构、城市路线原型状态、需要的权限用途。
- 人工材料草稿：先维护 `docs/release/ios-app-store-materials.md`，再把确认后的内容填入 App Store Connect。
- TestFlight：准备内部测试成员、测试说明和首个 build 的变更说明。
- 生产后端：确认照片记录、用户账号、支付或核销相关数据是否仍是原型本地状态。

## 不要误判

- `npm run ios:build` 通过只说明 Simulator 无签名构建通过，不等于 TestFlight ready。
- `DEVELOPMENT_TEAM` 为空是当前已知人工待办，不能视为发布完成。
- 当前权限文案可用于原型阶段；正式审核前需要按最终功能再读一遍。
- 当前 Bundle ID 是否用于正式上架，需要 Vera 在 Apple Developer 和 App Store Connect 中确认。
