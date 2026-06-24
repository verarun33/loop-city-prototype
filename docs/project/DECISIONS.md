# LOOP City Apple App Decisions

Date: 2026-06-24

This file records durable project decisions. If a future task disagrees with a decision here, update this file in the same commit as the change and explain why.

## Decision 1: Use WebView-first instead of SwiftUI rewrite

Status: Accepted

The Apple app will use the existing web prototype as the primary UI inside a `WKWebView`. SwiftUI will provide the native shell, not a full visual rewrite.

Reasoning:

- The existing web prototype already carries the intended LOOP visual language.
- A quick SwiftUI visual replication was not faithful enough and removed too much page detail.
- WebView preserves design velocity while native iOS can still provide system capabilities.

Implications:

- Product UI changes should usually happen in web assets first.
- SwiftUI should stay small and focused on shell behavior.
- Native-only UI should be reserved for unavoidable Apple system surfaces.

## Decision 2: Keep a narrow native bridge

Status: Accepted

Web and iOS communicate through `window.LoopNative`, injected by the native shell.

Current bridge foundation:

- Native injects `window.LoopNative` at document start.
- Web marks the page with `document.documentElement.dataset.nativeShell`.
- Web can post simple named messages to the native shell.
- Native currently handles light haptics and ignores unsupported messages.

Implications:

- Add native capabilities as explicit bridge messages.
- Keep bridge payloads small, serializable, and versioned.
- Do not expose broad native objects or arbitrary JavaScript execution APIs.

## Decision 3: Repo files are the source of truth, not chat history

Status: Accepted

Project state must be recoverable from repo files, git status, commits, and verification scripts.

Required handoff files:

- `docs/project/CURRENT_STATE.md`
- `docs/project/DECISIONS.md`
- Product and architecture docs
- Superpowers specs and implementation plans

Implications:

- Update `CURRENT_STATE.md` at phase boundaries.
- A new Codex window should not need to read an entire previous chat.
- Every implementation phase should end with verification evidence and a commit.

## Decision 4: Use small scoped commits

Status: Accepted

Prefer small commits that each have a clear purpose and a matching verification path.

Implications:

- Do not mix documentation, data seeding, UI changes, and native bridge changes in one commit.
- Existing dirty files must be inspected before they are staged.
- If a task needs parallelism, use worktrees or subagents only when file ownership is separable.

## Decision 5: Do not write the implementation plan before spec review

Status: Accepted

The iOS app implementation plan should be written after Vera reviews the PRD, architecture document, and design spec.

Reasoning:

- The plan should encode product scope, not invent it.
- The next major phase has several possible paths: data foundation, native capabilities, backend readiness, and App Store readiness.
- Reviewing the spec first reduces rework.

## Decision 6: Preserve Chinese-first product behavior

Status: Accepted

The app is Chinese-first. The `EN` entry remains lightweight until English content and localization rules are deliberately scoped.

Implications:

- Do not expand localization work casually.
- User-facing product copy should preserve the current Chinese UI unless a feature explicitly requires bilingual behavior.

## Decision 7: Treat App Store readiness as its own phase

Status: Accepted

Signing, TestFlight, App Store screenshots, privacy labels, review notes, and production backend readiness should be handled as a later explicit phase.

Implications:

- Early iOS builds can use Simulator builds with `CODE_SIGNING_ALLOWED=NO`.
- Do not claim App Store readiness until signing, bundle ID, capabilities, privacy, and production data flows have been verified.
