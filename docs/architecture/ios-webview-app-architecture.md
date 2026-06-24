# LOOP City iOS WebView App Architecture

Date: 2026-06-24
Status: Draft for Vera review

## Summary

The LOOP Apple app uses a WebView-first architecture. The existing web prototype remains the canonical UI. SwiftUI hosts a focused native shell that bundles the web assets, manages the `WKWebView`, and exposes selected iOS capabilities through a small bridge.

## Repository Layout

Important files:

- `index.html`: root web app entry.
- `styles.css`: root web app styling.
- `script.js`: root web app behavior and prototype data.
- `server.mjs`: local development server.
- `scripts/sync-ios-web-assets.mjs`: copies root web assets into the iOS bundle.
- `scripts/verify-ios-webview-wrapper.mjs`: verifies iOS wrapper and asset sync.
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/WebViewScreen.swift`: SwiftUI `WKWebView` host and bridge injection.
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Web/`: bundled web assets used by the iOS app.
- `ios/LoopCityWebViewApp/LoopCityWebViewApp/Info.plist`: iOS permissions and app metadata.

## Runtime Model

The app runs in two modes:

1. Browser mode: root web assets run in a normal browser or local server.
2. iOS shell mode: the same root assets are copied into the app bundle and loaded by `WKWebView`.

The web app must work in both modes. Native-only enhancements must be progressive.

## Asset Sync Flow

Root assets are canonical:

- `index.html`
- `styles.css`
- `script.js`
- `favicon.svg`

The sync command copies them into the iOS bundle:

```sh
npm run ios:sync
```

The iOS check command verifies required files, asset equality, app icon references, `Info.plist` permissions, and native bridge markers:

```sh
npm run ios:check
```

## Native Shell

`WebViewScreen.swift` creates the `WKWebView` with:

- Inline media playback enabled.
- JavaScript enabled.
- Transparent background.
- Back/forward navigation gestures.
- No automatic safe-area inset adjustment inside the scroll view.
- Local file loading from the bundled `Web` directory.

External URL handling:

- `file`, `about`, `data`, and `blob` URLs are allowed.
- `http` and `https` URLs are allowed.
- Other schemes are opened through `UIApplication.shared.open`.

## Native Bridge

The shell injects `window.LoopNative` at document start:

- `platform`: currently `"ios"`.
- `shellVersion`: currently `"0.1"`.
- `post(name, payload)`: sends a named message to native.

The web app listens for `loopnative:ready`, marks `document.documentElement.dataset.nativeShell`, and posts a `ready` event.

Current native message:

- `haptic`: triggers `UIImpactFeedbackGenerator(style: .light)`.

Future native messages should follow this shape:

```js
window.LoopNative.post("camera.capture", {
  requestId: "record-photo-001",
  source: "profile-record"
});
```

Response messages should be added through a deliberate callback/event pattern before any feature depends on them.

## Boundary Rules

Web owns:

- Product navigation.
- Screen layout.
- City content.
- Card and rail interactions.
- Prototype records.
- User-facing copy.

iOS owns:

- App packaging.
- Permissions.
- Native capability requests.
- Hardware-backed UX such as haptics.
- Future camera/photo/location/share APIs.
- App Store and TestFlight readiness.

Shared contract:

- Bridge message names.
- Bridge payload shape.
- Asset sync behavior.
- Verification commands.

## Error Handling

If bundled web assets are missing, the iOS app shows a plain fallback message instead of crashing.

If `window.LoopNative` is absent, browser mode continues without native features.

If native receives an unsupported bridge message, it ignores it. Future bridge work can add structured acknowledgements only when a feature needs them.

## Testing Strategy

Use these checks before claiming app foundation work is complete:

```sh
npm run check
npm test
npm run ios:check
npm run ios:build
```

When a feature changes WebView UI, also launch the Simulator app or inspect the local browser and iOS bundled files.

For bridge features, add checks in `scripts/verify-ios-webview-wrapper.mjs` before implementation so missing native or web pieces fail quickly.

## Near-Term Architecture Work

Recommended next architecture tasks:

1. Split product data out of `script.js` into explicit data files.
2. Add a bridge message registry document before adding camera/location/share messages.
3. Add a browser-safe native bridge adapter in web code if bridge features grow beyond one or two messages.
4. Add a lightweight UI smoke test for critical mobile profile sections.
5. Define TestFlight build settings after signing and bundle ID are confirmed.

## Constraints

- Do not introduce a large app framework unless a concrete need appears.
- Do not duplicate UI in SwiftUI unless it is a native system surface.
- Do not make native features mandatory for browser mode.
- Do not commit generated iOS web assets without syncing from the root source.
- Do not mix unrelated data seeding, visual tuning, and native shell work in one commit.
