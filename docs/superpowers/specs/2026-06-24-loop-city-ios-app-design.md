# LOOP City iOS App Foundation Design

Date: 2026-06-24
Status: Draft for Vera review

## Goal

Create a stable Apple app development foundation for LOOP / 城市回路 without losing the visual and interaction quality of the current mobile web prototype.

## Context

The project currently has:

- A deployed GitHub Pages prototype.
- A local Node development server.
- Root web assets for the prototype.
- An iOS `WKWebView` shell.
- An app icon.
- A native bridge foundation.
- Verification scripts for web syntax, featured pass behavior, iOS asset sync, and iOS Simulator build.

The project also has existing unstaged web data/cache-key changes. Those should remain separate from this documentation and planning work.

## Recommended Approach

Use a WebView-first iOS app foundation.

SwiftUI should host a focused `WKWebView` shell and expose native features through a narrow `window.LoopNative` bridge. The web app remains the canonical UI. Product behavior should be progressively enhanced by native capabilities only when the browser cannot provide the required Apple app experience.

## Alternatives Considered

### Full SwiftUI rewrite

Rejected for now.

It would create a cleaner native codebase eventually, but the first replication attempt showed that the web design loses too much detail when recreated quickly in SwiftUI. It would slow product iteration and create two UI sources of truth.

### WebView-only wrapper with no native bridge

Rejected as the long-term direction.

It preserves the UI, but it cannot become a serious Apple app because camera, photo library, location, sharing, haptics, authentication, and payment flows need native integration.

### WebView-first with narrow native bridge

Accepted.

It preserves the prototype while giving the app a controlled path toward native capabilities.

## Architecture

The system has three layers:

1. Web product layer
   - Owns screens, visual design, product copy, city content, pass cards, interest maps, and record lists.
2. iOS shell layer
   - Owns `WKWebView`, bundled assets, native permissions, app icon, launch screen, and bridge handlers.
3. Project control layer
   - Owns handoff docs, decisions, specs, plans, scripts, and verification commands.

## Data Flow

Current launch flow:

1. `npm run ios:sync` copies root web assets into the iOS app bundle.
2. The iOS app loads `Web/index.html` through `WKWebView.loadFileURL`.
3. Native injects `window.LoopNative`.
4. Web detects the bridge and marks native shell state.
5. Web renders the same product UI as browser mode.

Future native capability flow:

1. Web calls `window.LoopNative.post("capability.name", payload)`.
2. Native validates the message name and payload.
3. Native performs the system action.
4. Native returns the result through a documented response event if the feature needs a response.

## Boundaries

The web layer must not assume the bridge exists.

The iOS layer must not recreate product screens in SwiftUI unless a native system surface requires it.

The bridge must not become a general-purpose remote control API. Each message needs a product reason, a payload shape, and a verification check.

## Documentation System

The repo should contain enough state for a fresh Codex window to continue safely:

- `docs/project/CURRENT_STATE.md`
- `docs/project/DECISIONS.md`
- `docs/product/loop-city-ios-app-prd.md`
- `docs/architecture/ios-webview-app-architecture.md`
- `docs/superpowers/specs/2026-06-24-loop-city-ios-app-design.md`
- Future implementation plans in `docs/superpowers/plans/`

## Implementation Phases

### Phase 0: App shell and project control

Status: in progress.

Deliverables:

- WebView shell.
- App icon and launch screen.
- Asset sync.
- Native bridge foundation.
- Handoff docs.
- PRD and architecture docs.

### Phase 1: Data foundation and UI safety

Deliverables:

- Move product data out of the largest web behavior file into explicit data modules.
- Keep browser mode and iOS shell mode equivalent.
- Add checks for critical profile sections and active rails.

### Phase 2: Native capability bridge

Deliverables:

- Camera/photo capture path.
- Location permission and city assistance path.
- Share sheet path.
- Haptic interaction hooks where useful.

### Phase 3: Account and business state

Deliverables:

- Account decision.
- Active pass state.
- Record persistence.
- Order or pass simulation boundary.

### Phase 4: TestFlight and App Store readiness

Deliverables:

- Bundle ID and signing.
- Privacy strings and privacy labels.
- TestFlight build flow.
- App Store screenshots and review notes.

## Verification

Before claiming a phase is complete, run the relevant subset of:

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

For documentation-only changes, still run the project checks when the working tree contains code changes or when scripts may be affected by sync behavior.

## Review Gate

Vera should review this design, the PRD, and the architecture document before the detailed implementation plan is written.

After review, create:

`docs/superpowers/plans/2026-06-24-loop-city-ios-app-implementation.md`
