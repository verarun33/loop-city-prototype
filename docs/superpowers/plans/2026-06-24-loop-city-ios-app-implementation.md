# LOOP 城市回路 iOS App 阶段 1 实施计划

> **给 agentic worker 的要求：**执行本计划时必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`。任务步骤使用 checkbox（`- [ ]`）方便追踪。

**目标：**完成下一段稳定 app foundation：数据容器、iOS 数据资产同步、native bridge registry、移动个人页 smoke check、以及阶段接力状态更新。

**架构：**继续使用 WebView-first。根 Web 资产是事实来源，iOS app 使用同步后的打包副本。本阶段不实现相机、定位、支付、账号或 App Store 提交，只为这些功能建立数据和 bridge 边界。

**技术栈：**原生 HTML/CSS/JavaScript、Node.js 验证脚本、SwiftUI、`WKWebView`、Xcode Simulator build。

## 全局约束

- 每个任务开始前使用 `superpowers:using-superpowers` 和 `karpathy-guidelines`。
- 代码功能任务使用 TDD：先写失败检查，再最小实现，再验证通过。
- 保持 `docs/project/DECISIONS.md` 中的 WebView-first 决策。
- 根 Web 资产是 canonical，iOS 打包资产必须由根资产同步。
- 没有 `window.LoopNative` 时，浏览器模式必须可运行。
- SwiftUI 只做外壳，不重建产品页面。
- 用户可见产品文案中文优先。
- 不把无关数据、视觉、native bridge、文档混入同一个提交。
- 每个任务先运行 `git status --short`。
- 每个任务结束前运行该任务列出的验证命令。

## 范围说明

本计划只覆盖 阶段 1：数据基础与 UI/native 安全网。

本计划不实现：

- 相机拍照。
- 相册选择。
- 定位权限。
- 分享面板。
- Apple 登录。
- 支付或内购。
- TestFlight 或 App Store 提交。

这些需要后续单独计划。

## 文件结构

新增：

- `data/loop-data-v0.1.js`：浏览器可加载的数据基础容器，挂到 `window.LOOP_DATA_V01`。
- `data/README.md`：数据目录说明。
- `scripts/verify-loop-data.mjs`：验证数据基础容器。
- `scripts/verify-mobile-profile-ui.mjs`：验证移动个人页关键 UI 守门规则。
- `docs/architecture/native-bridge-registry.md`：native bridge message registry。

修改：

- `index.html`：在 `script.js` 前加载 `data/loop-data-v0.1.js`。
- `script.js`：可选读取 `window.LOOP_DATA_V01`，但不强依赖。
- `package.json`：新增 `data:check`、`ui:check`，并接入 `test`。
- `scripts/sync-ios-web-assets.mjs`：同步 `data/` 到 iOS Web bundle。
- `scripts/verify-ios-webview-wrapper.mjs`：验证数据资产同步和 bridge registry 标记。
- `docs/project/CURRENT_STATE.md`：阶段结束时更新当前状态。

除非验证证明当前 bridge foundation 不够，否则本计划不修改 Swift 文件。

---

## 任务 1：建立数据基础容器和验证器

**文件：**

- 新增：`data/loop-data-v0.1.js`
- 新增：`data/README.md`
- 新增：`scripts/verify-loop-data.mjs`
- 修改：`package.json`

**接口：**

产出 `window.LOOP_DATA_V01`，包含：

- `version: string`
- `cities: Array<{ id, name, code, timezone, currency, status }>`
- `sourceGroups: Array<{ id, cityId, label, sourceType, sourceUrl }>`

- [ ] **步骤 1：先写失败验证器**

创建 `scripts/verify-loop-data.mjs`：

```js
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const dataUrl = new URL("../data/loop-data-v0.1.js", import.meta.url);

if (!existsSync(dataUrl)) {
  throw new Error("缺少 data/loop-data-v0.1.js");
}

const source = readFileSync(dataUrl, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "data/loop-data-v0.1.js" });

const data = sandbox.window.LOOP_DATA_V01;
if (!data || typeof data !== "object") {
  throw new Error("必须定义 window.LOOP_DATA_V01");
}

if (data.version !== "20260624-phase1-v1") {
  throw new Error("LOOP_DATA_V01.version 必须是 20260624-phase1-v1");
}

const expectedCityIds = ["shanghai", "chengdu", "abudhabi"];
const cityIds = new Set((data.cities || []).map((city) => city.id));
for (const cityId of expectedCityIds) {
  if (!cityIds.has(cityId)) {
    throw new Error(`缺少城市：${cityId}`);
  }
}

for (const city of data.cities || []) {
  for (const field of ["id", "name", "code", "timezone", "currency", "status"]) {
    if (!city[field]) {
      throw new Error(`城市 ${city.id || "(缺少 id)"} 缺少字段：${field}`);
    }
  }
}

if (!Array.isArray(data.sourceGroups) || data.sourceGroups.length < 6) {
  throw new Error("LOOP_DATA_V01.sourceGroups 至少需要 6 个来源组");
}

for (const group of data.sourceGroups) {
  for (const field of ["id", "cityId", "label", "sourceType", "sourceUrl"]) {
    if (!group[field]) {
      throw new Error(`来源组 ${group.id || "(缺少 id)"} 缺少字段：${field}`);
    }
  }
  if (!cityIds.has(group.cityId)) {
    throw new Error(`来源组 ${group.id} 引用了未知 cityId：${group.cityId}`);
  }
}

console.log("LOOP 数据基础检查通过。");
```

- [ ] **步骤 2：确认 RED**

运行：

```sh
node scripts/verify-loop-data.mjs
```

预期：失败，提示缺少 `data/loop-data-v0.1.js`。

- [ ] **步骤 3：新增数据容器**

创建 `data/loop-data-v0.1.js`：

```js
(() => {
  const data = {
    version: "20260624-phase1-v1",
    cities: [
      { id: "shanghai", name: "上海", code: "SH", timezone: "Asia/Shanghai", currency: "CNY", status: "active" },
      { id: "chengdu", name: "成都", code: "CD", timezone: "Asia/Shanghai", currency: "CNY", status: "active" },
      { id: "abudhabi", name: "阿布扎比", code: "AD", timezone: "Asia/Dubai", currency: "AED", status: "active" }
    ],
    sourceGroups: [
      { id: "shanghai-official-culture", cityId: "shanghai", label: "上海官方文化与旅行来源", sourceType: "open_data", sourceUrl: "https://www.meet-in-shanghai.net/" },
      { id: "shanghai-community-culture", cityId: "shanghai", label: "上海社区文化信号", sourceType: "community_signal", sourceUrl: "https://www.smartshanghai.com/" },
      { id: "chengdu-official-culture", cityId: "chengdu", label: "成都官方文化与博物馆来源", sourceType: "open_data", sourceUrl: "https://www.chengdumuseum.com/" },
      { id: "chengdu-community-culture", cityId: "chengdu", label: "成都音乐、书店与社交空间信号", sourceType: "community_signal", sourceUrl: "https://www.tripadvisor.com/" },
      { id: "abudhabi-official-culture", cityId: "abudhabi", label: "阿布扎比官方文化与旅行来源", sourceType: "open_data", sourceUrl: "https://visitabudhabi.ae/" },
      { id: "abudhabi-community-culture", cityId: "abudhabi", label: "阿布扎比第三空间与创意社区信号", sourceType: "community_signal", sourceUrl: "https://www.timeoutabudhabi.com/" }
    ]
  };

  window.LOOP_DATA_V01 = Object.freeze({
    ...data,
    cities: Object.freeze(data.cities.map((city) => Object.freeze({ ...city }))),
    sourceGroups: Object.freeze(data.sourceGroups.map((group) => Object.freeze({ ...group })))
  });
})();
```

- [ ] **步骤 4：新增数据说明**

创建 `data/README.md`：

```markdown
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
```

- [ ] **步骤 5：新增 package script**

在 `package.json` 的 scripts 中加入：

```json
"data:check": "node scripts/verify-loop-data.mjs"
```

本任务不要修改现有 `test`。

- [ ] **步骤 6：验证并提交**

运行：

```sh
npm run data:check
npm run check
```

预期：

- `npm run data:check` 输出 `LOOP 数据基础检查通过。`
- `npm run check` 退出码为 0。

提交：

```sh
git add data/loop-data-v0.1.js data/README.md scripts/verify-loop-data.mjs package.json
git commit -m "新增 LOOP 数据基础容器"
```

---

## 任务 2：同步数据资产到 iOS WebView bundle

**文件：**

- 修改：`index.html`
- 修改：`scripts/sync-ios-web-assets.mjs`
- 修改：`scripts/verify-ios-webview-wrapper.mjs`
- 修改：`package.json`

**接口：**

- 输入：任务 1 的 `data/loop-data-v0.1.js`
- 输出：`ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/data/loop-data-v0.1.js`

- [ ] **步骤 1：先扩展 iOS wrapper 验证**

在 `scripts/verify-ios-webview-wrapper.mjs` 的 `requiredFiles` 中加入：

```js
"LoopCityWebViewApp/Web/data/loop-data-v0.1.js"
```

在根 Web 资产 equality loop 后加入：

```js
const rootData = readFileSync(join(root, "data", "loop-data-v0.1.js"), "utf8");
const bundledData = readFileSync(join(appRoot, "LoopCityWebViewApp", "Web", "data", "loop-data-v0.1.js"), "utf8");
if (rootData !== bundledData) {
  throw new Error("iOS 打包数据资产不同步：data/loop-data-v0.1.js");
}
```

- [ ] **步骤 2：确认 RED**

运行：

```sh
npm run ios:check
```

预期：失败，因为 iOS bundle 中还没有 `Web/data/loop-data-v0.1.js`。

- [ ] **步骤 3：同步 data 文件**

把 `scripts/sync-ios-web-assets.mjs` 改为：

```js
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const webRoot = join(root, "ios", "LoopCityWebViewApp", "LoopCityWebViewApp", "Web");
const webDataRoot = join(webRoot, "data");

mkdirSync(webRoot, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg"]) {
  copyFileSync(join(root, file), join(webRoot, file));
}

rmSync(webDataRoot, { force: true, recursive: true });
mkdirSync(webDataRoot, { recursive: true });
copyFileSync(join(root, "data", "loop-data-v0.1.js"), join(webDataRoot, "loop-data-v0.1.js"));

console.log("Synced web prototype assets into iOS WebView app.");
```

- [ ] **步骤 4：浏览器模式加载数据**

在 `index.html` 现有 `script.js` 标签前加入：

```html
<script src="data/loop-data-v0.1.js?v=20260624-phase1"></script>
```

- [ ] **步骤 5：把 data check 接入 test**

修改 `package.json`：

```json
"test": "npm run data:check && node scripts/verify-featured-pass.mjs"
```

- [ ] **步骤 6：验证并提交**

运行：

```sh
npm run data:check
npm run ios:check
npm test
```

提交：

```sh
git add index.html package.json scripts/sync-ios-web-assets.mjs scripts/verify-ios-webview-wrapper.mjs ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/data/loop-data-v0.1.js
git commit -m "Sync LOOP data into iOS WebView bundle"
```

---

## 任务 3：Web 端安全读取数据容器

**文件：**

- 修改：`script.js`
- 修改：`scripts/verify-featured-pass.mjs`

**接口：**

产出：

- `LOOP_EXTERNAL_DATA`
- `LOOP_EXTERNAL_CITIES`
- `LOOP_EXTERNAL_SOURCE_GROUPS`

- [ ] **步骤 1：先加失败检查**

在 `scripts/verify-featured-pass.mjs` 的数据版本检查附近加入：

```js
["web app 可选读取 LOOP 外部数据容器", /const LOOP_EXTERNAL_DATA[\s\S]*window\.LOOP_DATA_V01[\s\S]*LOOP_EXTERNAL_CITIES[\s\S]*LOOP_EXTERNAL_SOURCE_GROUPS/],
```

- [ ] **步骤 2：确认 RED**

运行：

```sh
npm test
```

预期：失败，提示缺少 `web app 可选读取 LOOP 外部数据容器`。

- [ ] **步骤 3：加入可选读取 hook**

在 `script.js` 的 `LOOP_DATA_VERSION` 后加入：

```js
const LOOP_EXTERNAL_DATA = window.LOOP_DATA_V01 && typeof window.LOOP_DATA_V01 === "object"
  ? window.LOOP_DATA_V01
  : null;
const LOOP_EXTERNAL_CITIES = Array.isArray(LOOP_EXTERNAL_DATA?.cities) ? LOOP_EXTERNAL_DATA.cities : [];
const LOOP_EXTERNAL_SOURCE_GROUPS = Array.isArray(LOOP_EXTERNAL_DATA?.sourceGroups) ? LOOP_EXTERNAL_DATA.sourceGroups : [];
```

本任务不替换现有产品数组，只建立安全读取边界。

- [ ] **步骤 4：验证并提交**

运行：

```sh
npm test
npm run check
npm run ios:check
```

提交：

```sh
git add script.js scripts/verify-featured-pass.mjs ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "Read LOOP data foundation in web app"
```

---

## 任务 4：建立 native bridge registry

**文件：**

- 新增：`docs/architecture/native-bridge-registry.md`
- 修改：`scripts/verify-ios-webview-wrapper.mjs`
- 修改：`script.js`

**接口：**

- 输入：现有 `window.LoopNative`
- 输出：`LOOP_NATIVE_BRIDGE_MESSAGES`

- [ ] **步骤 1：先加失败检查**

在 `scripts/verify-ios-webview-wrapper.mjs` 中加入：

```js
const bridgeRegistry = readFileSync(join(root, "docs", "architecture", "native-bridge-registry.md"), "utf8");
for (const expected of ["ready", "haptic", "camera.capture", "photo.pick", "location.request", "share.open"]) {
  if (!bridgeRegistry.includes(`\`${expected}\``)) {
    throw new Error(`native-bridge-registry.md 必须记录 bridge message：${expected}`);
  }
}

for (const expected of ["LOOP_NATIVE_BRIDGE_MESSAGES", "ready", "haptic"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js 必须定义 bridge registry 标记：${expected}`);
  }
}
```

- [ ] **步骤 2：确认 RED**

运行：

```sh
npm run ios:check
```

预期：失败，因为 `docs/architecture/native-bridge-registry.md` 还不存在。

- [ ] **步骤 3：新增 registry 文档**

创建 `docs/architecture/native-bridge-registry.md`：

````markdown
# LOOP Native Bridge Registry

日期：2026-06-24

native bridge 通过 `window.LoopNative` 暴露给 Web app。

## 当前消息

### `ready`

方向：Web 到原生

用途：通知原生外壳 Web app 已加载并识别 native shell。

Payload：

```json
{
  "href": "file:///app/Web/index.html",
  "dataVersion": "20260624-deep-culture-v1"
}
```

原生行为：可以忽略。

### `haptic`

方向：Web 到原生

用途：请求 iOS 轻触感反馈。

Payload：

```json
{}
```

原生行为：触发 `UIImpactFeedbackGenerator(style: .light)`。

## 预留消息

以下消息在 阶段 1 只预留，不实现：

- `camera.capture`
- `photo.pick`
- `location.request`
- `share.open`

产品代码不要调用预留消息，直到对应实施计划定义 payload、response event、权限行为、失败行为和验证检查。
````

- [ ] **步骤 4：Web 端增加 bridge message 标记**

在 `script.js` 的 `installNativeShellBridge()` 上方加入：

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic"]);
```

把：

```js
native.post("ready", { href: window.location.href, dataVersion: LOOP_DATA_VERSION });
```

替换为：

```js
if (LOOP_NATIVE_BRIDGE_MESSAGES.includes("ready")) {
  native.post("ready", { href: window.location.href, dataVersion: LOOP_DATA_VERSION });
}
```

- [ ] **步骤 5：验证并提交**

运行：

```sh
npm run ios:check
npm test
npm run check
```

提交：

```sh
git add docs/architecture/native-bridge-registry.md scripts/verify-ios-webview-wrapper.mjs script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "Document native bridge message registry"
```

---

## 任务 5：移动个人页 UI smoke check

**文件：**

- 新增：`scripts/verify-mobile-profile-ui.mjs`
- 修改：`package.json`

**接口：**

产出：`npm run ui:check`

- [ ] **步骤 1：新增 smoke check 脚本**

创建 `scripts/verify-mobile-profile-ui.mjs`：

```js
import { readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const combined = `${index}\n${styles}\n${script}`;

const checks = [
  ["个人页有进行中的城市通行证 section", /featuredPassSection[\s\S]*进行中的城市通行证[\s\S]*featuredPassList/],
  ["个人页有进行中的兴趣地图 section", /interestMapSection[\s\S]*进行中的兴趣地图[\s\S]*interestMapList/],
  ["今日探索表头是 section 内 sticky", /profile-record-section[\s\S]*profile-record-sticky-head[\s\S]*recordListTitle[\s\S]*periodOverview/],
  ["sticky 表头有顶部偏移", /\.profile-record-sticky-head[\s\S]*position:\s*sticky[\s\S]*top:\s*calc\(var\(--header-safe-top\)\s*\+\s*32px\)/],
  ["进行中 rails 支持横向触摸滑动", /\.profile-pass-list\.is-compact\.has-tilted-covers[\s\S]*touch-action:\s*pan-x/],
  ["demo 城市通行证 rail 有足够卡片测试横滑", /DEMO_PREVIEW_PASS_TARGET\s*=\s*3[\s\S]*demoPreviewFeaturedPassItems/],
  ["demo 兴趣地图 rail 有足够卡片测试横滑", /DEMO_PREVIEW_INTEREST_MAP_TARGET\s*=\s*3[\s\S]*demoPreviewInterestMapItems/],
  ["城市通行证价格在顶部行对齐", /profile-pass-topline[\s\S]*profile-pass-price[\s\S]*justify-content:\s*space-between/],
  ["浮动回顶部避开 ongoing bar", /\.app-frame\.has-ongoing\s+\.record-scroll-float[\s\S]*bottom:\s*calc/]
];

const failures = checks
  .filter(([, pattern]) => !pattern.test(combined))
  .map(([label]) => label);

if (failures.length) {
  console.error(`缺少移动个人页 UI 守门规则：\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("移动个人页 UI 检查通过。");
```

- [ ] **步骤 2：确认脚本通过当前基线**

运行：

```sh
node scripts/verify-mobile-profile-ui.mjs
```

预期：输出 `移动个人页 UI 检查通过。`

- [ ] **步骤 3：接入 package script**

修改 `package.json`：

```json
"ui:check": "node scripts/verify-mobile-profile-ui.mjs",
"test": "npm run data:check && npm run ui:check && node scripts/verify-featured-pass.mjs"
```

- [ ] **步骤 4：验证并提交**

运行：

```sh
npm run ui:check
npm test
npm run ios:check
```

提交：

```sh
git add package.json scripts/verify-mobile-profile-ui.mjs
git commit -m "新增移动个人页 UI smoke checks"
```

---

## 任务 6：阶段 1 接力状态和完整验证

**文件：**

- 修改：`docs/project/CURRENT_STATE.md`

- [ ] **步骤 1：更新当前状态**

在 `docs/project/CURRENT_STATE.md` 中更新：

- 当前已知可用基线为 任务 5 最新 commit。
- 当前工作区是否干净，或列出剩余脏文件。
- 验证命令包括：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

- 下一步任务改为：

```markdown
如果 Vera 确认优先做照片记录，下一阶段编写并执行 camera/photo native bridge 计划。
```

- [ ] **步骤 2：完整验证**

运行：

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

预期：

- 数据检查输出 `LOOP 数据基础检查通过。`
- UI 检查输出 `移动个人页 UI 检查通过。`
- 语法检查退出码 0。
- 原型检查输出 `Featured pass prototype checks passed.`
- iOS 检查输出 `iOS WebView wrapper checks passed.`
- iOS 构建输出 `** BUILD SUCCEEDED **`。

- [ ] **步骤 3：提交**

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "更新阶段 1 接力状态"
```

## 自检清单

执行本计划前确认：

- 每个任务只有一个清楚提交。
- 每个任务先有失败检查或有意义的验证命令。
- 浏览器模式不依赖 native bridge。
- iOS 打包资产来自根文件同步。
- 本计划不实现支付、账号、相机、定位、分享或上架。
- `script.js` 在单独数据迁移任务前仍是 Web 行为来源。

## 执行建议

因为这些任务会连续碰 `package.json`、`script.js` 和同步脚本，本 repo 这次适合 内联执行：在当前线程按 任务 1 到 任务 6 顺序执行，每个任务一个提交和验证 检查点。
