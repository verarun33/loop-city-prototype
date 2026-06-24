# LOOP City Apple App Current State

Date: 2026-06-24
Owner: Vera / Codex
Project path: `/Users/veraxian/Documents/城市回路`
Canonical local path resolved by git: `/Users/veraxian/Documents/city loop`
Live prototype: `https://verarun33.github.io/loop-city-prototype/`

## Purpose

This file is the handoff surface for future Codex windows. Do not rely on a long chat transcript as the source of truth. A new session should read this file, inspect `git status`, inspect recent commits, then continue from the "Next Task" section.

## Current Product Direction

LOOP / 城市回路 is moving from a mobile web prototype into an Apple app while preserving the existing WebView UI and interaction design.

The current direction is WebView-first:

- Web owns the product UI, content surfaces, city passes, interest maps, profile, records, and prototype interaction design.
- iOS owns native shell responsibilities: app packaging, permissions, camera/photo access, location, haptics, sharing, push notifications, Apple sign-in, payment hooks, and App Store readiness.
- Web and iOS communicate through a narrow `window.LoopNative` bridge.

## Last Known Good Commit

`1a314e5 Add iOS native bridge foundation`

Recent useful commits:

- `1a314e5 Add iOS native bridge foundation`
- `376169d Add iOS WebView app foundation`
- `c680d1d Keep profile record header sticky`
- `8ce8fd4 Show city pass price on profile cards`
- `78927d3 Enhance mobile profile rails`

## Current Working Tree Notes

At the time this file was created, the repo already had unrelated unstaged web data/cache-key changes:

- `index.html`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/index.html`
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/script.js`
- `script.js`
- `scripts/verify-featured-pass.mjs`

Treat these as existing work in progress. Do not revert or commit them as part of documentation, architecture, or native bridge work unless their purpose has been inspected and explicitly included in a scoped change.

## Verified Commands

The current project has these verification commands:

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

`npm run ios:build` runs `ios:check` first and builds the Xcode project for a generic iOS Simulator destination with code signing disabled.

## Development Discipline

Every future task should start with:

1. Read this file.
2. Read `docs/project/DECISIONS.md`.
3. Run `git status --short`.
4. Inspect recent commits with `git log --oneline -10`.
5. Define the task boundary and verification commands before editing.
6. Keep unrelated dirty files untouched.
7. Use small commits that can be explained and verified.
8. Update this file at phase boundaries.

The user explicitly wants disciplined work and prefers the assistant to use `superpowers:using-superpowers` and `karpathy-guidelines` for every task.

## Next Task

Ask Vera to review these documents before writing the detailed implementation plan:

- `docs/product/loop-city-ios-app-prd.md`
- `docs/architecture/ios-webview-app-architecture.md`
- `docs/superpowers/specs/2026-06-24-loop-city-ios-app-design.md`

After review, write the implementation plan at:

`docs/superpowers/plans/2026-06-24-loop-city-ios-app-implementation.md`

## Restart Prompt For A New Codex Window

```text
Continue LOOP / 城市回路 Apple app development.
First read /Users/veraxian/Documents/城市回路/docs/project/CURRENT_STATE.md
and /Users/veraxian/Documents/城市回路/docs/project/DECISIONS.md.
Then run git status --short and git log --oneline -10.
Use superpowers:using-superpowers and karpathy-guidelines.
Continue only from the Next Task in CURRENT_STATE.md.
```
