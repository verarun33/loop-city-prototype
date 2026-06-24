# LOOP City iOS App Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the next stable Apple app foundation slice: data extraction guardrails, iOS asset sync for data files, native bridge registry, mobile profile smoke checks, and updated handoff state.

**Architecture:** Keep the current WebView-first architecture. Root web assets remain canonical; the iOS app bundles synced copies. The first implementation slice does not add camera, location, payment, account, or App Store submission features. It prepares the repo so those features can be added through explicit data and bridge boundaries.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Node.js verification scripts, SwiftUI, `WKWebView`, Xcode Simulator build.

## Global Constraints

- Use `superpowers:using-superpowers` and `karpathy-guidelines` at the start of every task.
- Preserve the WebView-first decision in `docs/project/DECISIONS.md`.
- Root web assets are canonical; iOS bundled web assets must be synced from root assets.
- Browser mode must keep working when `window.LoopNative` is absent.
- SwiftUI must remain a focused shell and must not recreate product screens.
- Keep Chinese-first user-facing product behavior.
- Do not mix unrelated data seeding, visual tuning, native bridge work, and documentation in one commit.
- Start every task with `git status --short` and keep unrelated files untouched.
- Run the verification commands listed in each task before committing.

---

## Scope Check

The design spec covers several independent phases. This plan covers only Phase 1: data foundation and UI/native safety. It intentionally does not implement:

- Camera capture.
- Photo library selection.
- Location permission.
- Share sheet.
- Apple sign-in.
- Payment or in-app purchase.
- TestFlight or App Store submission.

Those require separate implementation plans after Phase 1 is stable.

## File Structure

Create:

- `data/loop-data-v0.1.js`: browser-loadable data foundation container attached to `window.LOOP_DATA_V01`.
- `data/README.md`: data ownership and migration notes.
- `scripts/verify-loop-data.mjs`: validates the data foundation container.
- `scripts/verify-mobile-profile-ui.mjs`: checks critical profile/mobile WebView UI guardrails.
- `docs/architecture/native-bridge-registry.md`: source of truth for allowed bridge messages.

Modify:

- `index.html`: load `data/loop-data-v0.1.js` before `script.js`.
- `script.js`: read `window.LOOP_DATA_V01` without making it mandatory.
- `package.json`: add `data:check` and `ui:check`, and include them in `test`.
- `scripts/sync-ios-web-assets.mjs`: sync the `data/` directory into the iOS Web bundle.
- `scripts/verify-ios-webview-wrapper.mjs`: verify data asset sync and bridge registry markers.
- `docs/project/CURRENT_STATE.md`: update baseline and next task after each phase boundary.

Do not modify Swift files in this plan unless a verification check proves the current bridge foundation cannot support the registry.

---

### Task 1: Data Foundation Container And Validator

**Files:**
- Create: `data/loop-data-v0.1.js`
- Create: `data/README.md`
- Create: `scripts/verify-loop-data.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: no previous implementation task.
- Produces: `window.LOOP_DATA_V01` with shape:
  - `version: string`
  - `cities: Array<{ id: string, name: string, code: string, timezone: string, currency: string, status: string }>`
  - `sourceGroups: Array<{ id: string, cityId: string, label: string, sourceType: string, sourceUrl: string }>`

- [ ] **Step 1: Write the failing data verifier**

Create `scripts/verify-loop-data.mjs` with this exact content:

```js
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const dataUrl = new URL("../data/loop-data-v0.1.js", import.meta.url);

if (!existsSync(dataUrl)) {
  throw new Error("Missing data/loop-data-v0.1.js");
}

const source = readFileSync(dataUrl, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "data/loop-data-v0.1.js" });

const data = sandbox.window.LOOP_DATA_V01;
if (!data || typeof data !== "object") {
  throw new Error("window.LOOP_DATA_V01 must be defined");
}

if (data.version !== "20260624-phase1-v1") {
  throw new Error("LOOP_DATA_V01.version must be 20260624-phase1-v1");
}

const expectedCityIds = ["shanghai", "chengdu", "abudhabi"];
const cityIds = new Set((data.cities || []).map((city) => city.id));
for (const cityId of expectedCityIds) {
  if (!cityIds.has(cityId)) {
    throw new Error(`Missing city in LOOP_DATA_V01.cities: ${cityId}`);
  }
}

for (const city of data.cities || []) {
  for (const field of ["id", "name", "code", "timezone", "currency", "status"]) {
    if (!city[field]) {
      throw new Error(`City ${city.id || "(missing id)"} missing field: ${field}`);
    }
  }
}

if (!Array.isArray(data.sourceGroups) || data.sourceGroups.length < 6) {
  throw new Error("LOOP_DATA_V01.sourceGroups must include at least six source groups");
}

for (const group of data.sourceGroups) {
  for (const field of ["id", "cityId", "label", "sourceType", "sourceUrl"]) {
    if (!group[field]) {
      throw new Error(`Source group ${group.id || "(missing id)"} missing field: ${field}`);
    }
  }
  if (!cityIds.has(group.cityId)) {
    throw new Error(`Source group ${group.id} references unknown cityId: ${group.cityId}`);
  }
}

console.log("LOOP data foundation checks passed.");
```

- [ ] **Step 2: Run the verifier and confirm it fails**

Run:

```sh
node scripts/verify-loop-data.mjs
```

Expected: fail with `Missing data/loop-data-v0.1.js`.

- [ ] **Step 3: Add the data foundation file**

Create `data/loop-data-v0.1.js` with this exact content:

```js
(() => {
  const data = {
    version: "20260624-phase1-v1",
    cities: [
      {
        id: "shanghai",
        name: "上海",
        code: "SH",
        timezone: "Asia/Shanghai",
        currency: "CNY",
        status: "active"
      },
      {
        id: "chengdu",
        name: "成都",
        code: "CD",
        timezone: "Asia/Shanghai",
        currency: "CNY",
        status: "active"
      },
      {
        id: "abudhabi",
        name: "阿布扎比",
        code: "AD",
        timezone: "Asia/Dubai",
        currency: "AED",
        status: "active"
      }
    ],
    sourceGroups: [
      {
        id: "shanghai-official-culture",
        cityId: "shanghai",
        label: "Shanghai official culture and tourism anchors",
        sourceType: "open_data",
        sourceUrl: "https://www.meet-in-shanghai.net/"
      },
      {
        id: "shanghai-community-culture",
        cityId: "shanghai",
        label: "Shanghai community culture signals",
        sourceType: "community_signal",
        sourceUrl: "https://www.smartshanghai.com/"
      },
      {
        id: "chengdu-official-culture",
        cityId: "chengdu",
        label: "Chengdu official culture and museum anchors",
        sourceType: "open_data",
        sourceUrl: "https://www.chengdumuseum.com/"
      },
      {
        id: "chengdu-community-culture",
        cityId: "chengdu",
        label: "Chengdu music bookstore and social space signals",
        sourceType: "community_signal",
        sourceUrl: "https://www.tripadvisor.com/"
      },
      {
        id: "abudhabi-official-culture",
        cityId: "abudhabi",
        label: "Abu Dhabi official culture and tourism anchors",
        sourceType: "open_data",
        sourceUrl: "https://visitabudhabi.ae/"
      },
      {
        id: "abudhabi-community-culture",
        cityId: "abudhabi",
        label: "Abu Dhabi third-space and creative community signals",
        sourceType: "community_signal",
        sourceUrl: "https://www.timeoutabudhabi.com/"
      }
    ]
  };

  window.LOOP_DATA_V01 = Object.freeze({
    ...data,
    cities: Object.freeze(data.cities.map((city) => Object.freeze({ ...city }))),
    sourceGroups: Object.freeze(data.sourceGroups.map((group) => Object.freeze({ ...group })))
  });
})();
```

- [ ] **Step 4: Add the data README**

Create `data/README.md` with this exact content:

```markdown
# LOOP Data Foundation v0.1

This directory contains browser-loadable data files for the LOOP prototype and iOS WebView bundle.

## Source Of Truth

Root `data/` files are canonical. iOS receives synced copies through `npm run ios:sync`.

## Current Container

`loop-data-v0.1.js` attaches `window.LOOP_DATA_V01`.

Current fields:

- `version`
- `cities`
- `sourceGroups`

## Rules

- Keep data files browser-loadable without a build step.
- Keep browser mode working if the iOS native bridge is absent.
- Add verifier coverage in `scripts/verify-loop-data.mjs` before adding a required field.
- Do not move payment, order reconciliation, or merchant-managed benefit state into this file until those phases are planned.
```

- [ ] **Step 5: Add the package script**

Modify `package.json` scripts to include:

```json
"data:check": "node scripts/verify-loop-data.mjs"
```

Do not change the existing `test` script in this task.

- [ ] **Step 6: Verify and commit**

Run:

```sh
npm run data:check
npm run check
```

Expected:

- `npm run data:check` prints `LOOP data foundation checks passed.`
- `npm run check` exits 0.

Commit:

```sh
git add data/loop-data-v0.1.js data/README.md scripts/verify-loop-data.mjs package.json
git commit -m "Add LOOP data foundation container"
```

---

### Task 2: Web And iOS Data Asset Sync

**Files:**
- Modify: `index.html`
- Modify: `scripts/sync-ios-web-assets.mjs`
- Modify: `scripts/verify-ios-webview-wrapper.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `data/loop-data-v0.1.js` from Task 1.
- Produces: iOS bundled copy at `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/data/loop-data-v0.1.js`.

- [ ] **Step 1: Extend iOS wrapper verification first**

Modify `scripts/verify-ios-webview-wrapper.mjs`:

Add `LoopCityWebViewApp/Web/data/loop-data-v0.1.js` to `requiredFiles`.

After the root asset equality loop, add:

```js
const rootData = readFileSync(join(root, "data", "loop-data-v0.1.js"), "utf8");
const bundledData = readFileSync(join(appRoot, "LoopCityWebViewApp", "Web", "data", "loop-data-v0.1.js"), "utf8");
if (rootData !== bundledData) {
  throw new Error("Bundled iOS data asset is out of sync: data/loop-data-v0.1.js");
}
```

- [ ] **Step 2: Run the check and confirm it fails**

Run:

```sh
npm run ios:check
```

Expected: fail because `LoopCityWebViewApp/Web/data/loop-data-v0.1.js` is missing.

- [ ] **Step 3: Sync the data file into the iOS bundle**

Modify `scripts/sync-ios-web-assets.mjs` to this exact content:

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

- [ ] **Step 4: Load data before app script in browser mode**

Modify `index.html` before the existing `script.js` tag:

```html
<script src="data/loop-data-v0.1.js?v=20260624-phase1"></script>
```

Keep the existing `script.js` tag after the data script.

- [ ] **Step 5: Include data check in test**

Modify `package.json`:

```json
"test": "npm run data:check && node scripts/verify-featured-pass.mjs"
```

Keep `data:check` from Task 1.

- [ ] **Step 6: Verify and commit**

Run:

```sh
npm run data:check
npm run ios:check
npm test
```

Expected:

- `npm run data:check` prints `LOOP data foundation checks passed.`
- `npm run ios:check` prints `iOS WebView wrapper checks passed.`
- `npm test` prints `Featured pass prototype checks passed.`

Commit:

```sh
git add index.html package.json scripts/sync-ios-web-assets.mjs scripts/verify-ios-webview-wrapper.mjs ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/data/loop-data-v0.1.js
git commit -m "Sync LOOP data into iOS WebView bundle"
```

---

### Task 3: Browser-Safe Data Read Hook

**Files:**
- Modify: `script.js`
- Modify: `scripts/verify-featured-pass.mjs`

**Interfaces:**
- Consumes: `window.LOOP_DATA_V01` from Task 1 and Task 2.
- Produces:
  - `LOOP_EXTERNAL_DATA`
  - `LOOP_EXTERNAL_CITIES`
  - `LOOP_EXTERNAL_SOURCE_GROUPS`

- [ ] **Step 1: Add a failing verifier check**

In `scripts/verify-featured-pass.mjs`, add this check near the existing data version checks:

```js
["web app reads optional LOOP external data container", /const LOOP_EXTERNAL_DATA[\s\S]*window\.LOOP_DATA_V01[\s\S]*LOOP_EXTERNAL_CITIES[\s\S]*LOOP_EXTERNAL_SOURCE_GROUPS/],
```

- [ ] **Step 2: Run and confirm failure**

Run:

```sh
npm test
```

Expected: fail with `web app reads optional LOOP external data container`.

- [ ] **Step 3: Add the optional data hook**

In `script.js`, directly after the `LOOP_DATA_VERSION` declaration, add:

```js
const LOOP_EXTERNAL_DATA = window.LOOP_DATA_V01 && typeof window.LOOP_DATA_V01 === "object"
  ? window.LOOP_DATA_V01
  : null;
const LOOP_EXTERNAL_CITIES = Array.isArray(LOOP_EXTERNAL_DATA?.cities) ? LOOP_EXTERNAL_DATA.cities : [];
const LOOP_EXTERNAL_SOURCE_GROUPS = Array.isArray(LOOP_EXTERNAL_DATA?.sourceGroups) ? LOOP_EXTERNAL_DATA.sourceGroups : [];
```

Do not use this data to replace existing product arrays in this task. This task only establishes a safe read boundary.

- [ ] **Step 4: Verify and commit**

Run:

```sh
npm test
npm run check
npm run ios:check
```

Expected:

- `npm test` prints `Featured pass prototype checks passed.`
- `npm run check` exits 0.
- `npm run ios:check` prints `iOS WebView wrapper checks passed.`

Commit:

```sh
git add script.js scripts/verify-featured-pass.mjs ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "Read LOOP data foundation in web app"
```

---

### Task 4: Native Bridge Registry

**Files:**
- Create: `docs/architecture/native-bridge-registry.md`
- Modify: `scripts/verify-ios-webview-wrapper.mjs`
- Modify: `script.js`

**Interfaces:**
- Consumes: existing `window.LoopNative` bridge foundation.
- Produces:
  - Bridge registry document.
  - `LOOP_NATIVE_BRIDGE_MESSAGES`.

- [ ] **Step 1: Add failing bridge registry checks**

Modify `scripts/verify-ios-webview-wrapper.mjs`.

Add:

```js
const bridgeRegistry = readFileSync(join(root, "docs", "architecture", "native-bridge-registry.md"), "utf8");
for (const expected of ["ready", "haptic", "camera.capture", "photo.pick", "location.request", "share.open"]) {
  if (!bridgeRegistry.includes(`\`${expected}\``)) {
    throw new Error(`native-bridge-registry.md must document bridge message: ${expected}`);
  }
}

for (const expected of ["LOOP_NATIVE_BRIDGE_MESSAGES", "ready", "haptic"]) {
  if (!script.includes(expected)) {
    throw new Error(`script.js must define bridge registry marker: ${expected}`);
  }
}
```

- [ ] **Step 2: Run and confirm failure**

Run:

```sh
npm run ios:check
```

Expected: fail because `docs/architecture/native-bridge-registry.md` does not exist.

- [ ] **Step 3: Create the bridge registry document**

Create `docs/architecture/native-bridge-registry.md` with this exact content:

````markdown
# LOOP Native Bridge Registry

Date: 2026-06-24

The native bridge is exposed to the web app as `window.LoopNative`.

## Current Messages

### `ready`

Direction: web to native

Purpose: tells the native shell that the web app loaded and identified the shell.

Payload:

```json
{
  "href": "file:///app/Web/index.html",
  "dataVersion": "20260624-deep-culture-v1"
}
```

Native behavior: may ignore.

### `haptic`

Direction: web to native

Purpose: asks iOS for light tactile feedback.

Payload:

```json
{}
```

Native behavior: triggers `UIImpactFeedbackGenerator(style: .light)`.

## Reserved Messages

The following messages are reserved but not implemented in Phase 1:

- `camera.capture`
- `photo.pick`
- `location.request`
- `share.open`

Do not use a reserved message from product code until its implementation plan defines payload, response event, permission behavior, failure behavior, and verification checks.
````

- [ ] **Step 4: Add bridge markers in web code**

In `script.js`, directly above `installNativeShellBridge()`, add:

```js
const LOOP_NATIVE_BRIDGE_MESSAGES = Object.freeze(["ready", "haptic"]);
```

Inside `installNativeShellBridge()`, replace:

```js
native.post("ready", { href: window.location.href, dataVersion: LOOP_DATA_VERSION });
```

with:

```js
if (LOOP_NATIVE_BRIDGE_MESSAGES.includes("ready")) {
  native.post("ready", { href: window.location.href, dataVersion: LOOP_DATA_VERSION });
}
```

- [ ] **Step 5: Verify and commit**

Run:

```sh
npm run ios:check
npm test
npm run check
```

Expected:

- `npm run ios:check` prints `iOS WebView wrapper checks passed.`
- `npm test` prints `Featured pass prototype checks passed.`
- `npm run check` exits 0.

Commit:

```sh
git add docs/architecture/native-bridge-registry.md scripts/verify-ios-webview-wrapper.mjs script.js ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js
git commit -m "Document native bridge message registry"
```

---

### Task 5: Mobile Profile UI Smoke Checks

**Files:**
- Create: `scripts/verify-mobile-profile-ui.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `index.html`, `styles.css`, and `script.js`.
- Produces: `npm run ui:check`.

- [ ] **Step 1: Create the smoke check script**

Create `scripts/verify-mobile-profile-ui.mjs` with this exact content:

```js
import { readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const combined = `${index}\n${styles}\n${script}`;

const checks = [
  ["profile has ongoing city pass section", /featuredPassSection[\s\S]*进行中的城市通行证[\s\S]*featuredPassList/],
  ["profile has ongoing interest map section", /interestMapSection[\s\S]*进行中的兴趣地图[\s\S]*interestMapList/],
  ["profile record header is section-local sticky", /profile-record-section[\s\S]*profile-record-sticky-head[\s\S]*recordListTitle[\s\S]*periodOverview/],
  ["profile record sticky header has top offset", /\.profile-record-sticky-head[\s\S]*position:\s*sticky[\s\S]*top:\s*calc\(var\(--header-safe-top\)\s*\+\s*32px\)/],
  ["ongoing rails support horizontal touch panning", /\.profile-pass-list\.is-compact\.has-tilted-covers[\s\S]*touch-action:\s*pan-x/],
  ["demo city pass rail has enough cards for scroll testing", /DEMO_PREVIEW_PASS_TARGET\s*=\s*3[\s\S]*demoPreviewFeaturedPassItems/],
  ["demo interest map rail has enough cards for scroll testing", /DEMO_PREVIEW_INTEREST_MAP_TARGET\s*=\s*3[\s\S]*demoPreviewInterestMapItems/],
  ["city pass price aligns in top row", /profile-pass-topline[\s\S]*profile-pass-price[\s\S]*justify-content:\s*space-between/],
  ["record floating shortcut avoids ongoing bar", /\.app-frame\.has-ongoing\s+\.record-scroll-float[\s\S]*bottom:\s*calc/]
];

const failures = checks
  .filter(([, pattern]) => !pattern.test(combined))
  .map(([label]) => label);

if (failures.length) {
  console.error(`Missing mobile profile UI guardrails:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Mobile profile UI checks passed.");
```

- [ ] **Step 2: Run and confirm pass**

Run:

```sh
node scripts/verify-mobile-profile-ui.mjs
```

Expected: prints `Mobile profile UI checks passed.`

- [ ] **Step 3: Add package script and test integration**

Modify `package.json` scripts:

```json
"ui:check": "node scripts/verify-mobile-profile-ui.mjs",
"test": "npm run data:check && npm run ui:check && node scripts/verify-featured-pass.mjs"
```

- [ ] **Step 4: Verify and commit**

Run:

```sh
npm run ui:check
npm test
npm run ios:check
```

Expected:

- `npm run ui:check` prints `Mobile profile UI checks passed.`
- `npm test` prints `Featured pass prototype checks passed.`
- `npm run ios:check` prints `iOS WebView wrapper checks passed.`

Commit:

```sh
git add package.json scripts/verify-mobile-profile-ui.mjs
git commit -m "Add mobile profile UI smoke checks"
```

---

### Task 6: Phase 1 Handoff Update And Full Verification

**Files:**
- Modify: `docs/project/CURRENT_STATE.md`

**Interfaces:**
- Consumes: commits from Tasks 1-5.
- Produces: updated handoff state for the next phase.

- [ ] **Step 1: Update current state**

In `docs/project/CURRENT_STATE.md`, update:

- `Last Known Good Commit` to the latest Task 5 commit hash.
- `Current Working Tree Notes` to state whether the tree is clean or list exact remaining dirty files.
- `Verified Commands` to include:

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

- `Next Task` to:

```markdown
Implement the native capability bridge plan for camera/photo capture after Vera confirms the app should prioritize photo records next.
```

- [ ] **Step 2: Run full verification**

Run:

```sh
npm run data:check
npm run ui:check
npm run check
npm test
npm run ios:check
npm run ios:build
```

Expected:

- Data check prints `LOOP data foundation checks passed.`
- UI check prints `Mobile profile UI checks passed.`
- Syntax check exits 0.
- Prototype test prints `Featured pass prototype checks passed.`
- iOS check prints `iOS WebView wrapper checks passed.`
- iOS build prints `** BUILD SUCCEEDED **`.

- [ ] **Step 3: Commit**

Commit:

```sh
git add docs/project/CURRENT_STATE.md
git commit -m "Update Phase 1 handoff state"
```

## Self-Review Checklist

Before executing this plan, confirm:

- Each task has one clear commit.
- Each task starts with a failing or meaningful verification command.
- Browser mode remains optional-native.
- iOS bundled assets are synced from root files.
- No task introduces payment, account, camera, location, share, or App Store submission work.
- `script.js` remains the web behavior source until a separate data migration task deliberately moves product arrays.

## Execution Options

Recommended execution mode:

1. Subagent-Driven: dispatch one fresh worker per task, review diff and verification output after each task.
2. Inline Execution: execute tasks in this session with a checkpoint after each commit.

For this repo, Inline Execution is acceptable because the tasks are sequential and touch overlapping files. Use Subagent-Driven only if the work is moved into a clean isolated worktree.
