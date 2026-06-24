# LOOP City iOS App PRD

Date: 2026-06-24
Status: Draft for Vera review

## Product Goal

Turn the existing LOOP / 城市回路 mobile web prototype into an Apple app that preserves the current visual and interaction design while adding native iOS capabilities where the web shell is not enough.

## Product Positioning

LOOP is a city exploration and pass product. It helps a user discover curated city routes, buy or hold city passes, track personal exploration records, and return to an expressive profile that feels like a city memory map.

The first Apple app should feel like the existing prototype, not a new visual product.

## Primary Users

- A city explorer who wants curated routes and a more playful record of where they went.
- A returning user who checks active city passes and interest maps from "我的".
- Vera and early testers who need a stable app-shaped prototype for real phone testing.

## MVP Scope

The MVP iOS app must include:

- Existing WebView UI with current LOOP visual design preserved.
- Local bundled web assets so the app can launch without GitHub Pages.
- iOS-safe top and bottom layout behavior.
- App icon and launch screen.
- Native bridge foundation for future iOS capabilities.
- Haptic bridge support for light feedback.
- Camera/photo permission declarations in `Info.plist`.
- Asset sync and verification scripts.
- Simulator build command.
- Project handoff docs so future windows can continue safely.

## Near-Term Product Scope

After the MVP shell, build these capabilities in order:

1. Camera and photo attachment for exploration records.
2. Location permission and current-city assistance.
3. Local persistence for records and active pass state.
4. Share sheet for city passes, route cards, and profile snapshots.
5. Apple sign-in or account bridge once backend direction is clear.
6. TestFlight-ready signing and privacy documentation.

## Explicit Non-Goals For The Current Phase

The current phase does not include:

- Full SwiftUI rewrite of the product UI.
- Merchant backend.
- Real payment integration.
- Real order reconciliation.
- Real QR redemption.
- Full English localization.
- Production database migration.
- App Store submission.

These are valid future phases, but they should not be mixed into the current app foundation work.

## Core Screens To Preserve

The iOS app should preserve the current web prototype screens:

- Today / 今日
- Map exploration / 地图
- Secrets / 秘境
- Profile / 我的
- Active city passes
- Active interest maps
- Today exploration record list
- City selector
- Language entry

The profile page is especially sensitive because recent design work tuned:

- Top safe-area layout around the iPhone island.
- Bottom tab spacing.
- Active city pass rails.
- Active interest map rails.
- Sticky "今日探索" record header.
- Price placement on pass cards.

## UX Requirements

- The Apple app should look like the mobile web prototype unless a native system surface is required.
- The WebView must not add visible browser chrome.
- iPhone safe areas must be respected without wasting top space.
- Bottom navigation must stay usable above the home indicator.
- Horizontal rails must remain scrollable on touch devices.
- Sticky record headers must not leave a gap below the top bar.
- The app should launch directly into the product experience, not a marketing page.

## Native Capability Requirements

The iOS shell should provide native capabilities through a narrow bridge:

- `ready`: web tells native it loaded.
- `haptic`: web requests light native feedback.
- `camera.capture`: future task for camera record capture.
- `photo.pick`: future task for photo library selection.
- `location.request`: future task for city/location assistance.
- `share.open`: future task for iOS share sheet.

Bridge messages must be explicit and versioned. The web layer must remain functional when the bridge is absent.

## Data Requirements

The current prototype stores much of its product data in `script.js`. Future work should move data into explicit modules or files before adding production backend complexity.

Data domains:

- Cities
- POIs
- Routes
- City passes
- Interest maps
- Orders or active pass state
- User exploration records
- Recommendation rules

The existing data foundation design remains relevant:

`docs/superpowers/specs/2026-06-18-loop-data-foundation-v0.1-design.md`

## Success Criteria

The iOS app foundation is successful when:

- `npm run ios:build` succeeds.
- Bundled iOS web assets match root web assets after `npm run ios:sync`.
- The app launches in Simulator and shows the same core UI as the web prototype.
- The native bridge is detected by the web app without breaking browser mode.
- Project state can be resumed from repo docs without relying on a long chat.

## Risks

- The web prototype currently has a large `script.js`; adding more behavior there will increase drift risk.
- WebView native bridges can become messy if message names and payloads are not controlled.
- App Store readiness may be blocked by signing, privacy labels, payment policy, or incomplete production backend decisions.
- UI regressions can happen if mobile web changes are not verified inside the iOS bundle.

## Open Product Decisions

These should be decided before the corresponding phase starts:

- Whether city pass payment will use Apple in-app purchase, Apple Pay, external checkout, or simulated purchase for early testing.
- Whether early accounts use Apple sign-in, phone number, email code, or anonymous local profiles.
- Whether exploration records are local-first or server-synced in the first TestFlight build.
- Which city is the first real phone testing focus: Shanghai, Chengdu, or Abu Dhabi.
