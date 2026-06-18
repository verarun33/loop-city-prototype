# LOOP Data Foundation v0.1 Design

Date: 2026-06-18
Status: Draft for review

## Goal

Build a local LOOP data foundation before connecting crawlers, real AI, merchant back office, or a database.

v0.1 should create a stable local data container for:

- City POIs
- Routes
- City passes
- Orders
- Redemptions
- User visit/photo/completion records
- AI recommendation read rules
- Manual admin input fields

The current app is a static frontend plus a local Node server. Most product data currently lives directly in `script.js`. v0.1 will move the shape of that data into explicit local data files so the prototype has a single source of truth for future content.

## Non-Goals

- No crawler integration.
- No real AI recommendation service change.
- No database migration.
- No merchant login or merchant submission flow.
- No payment provider integration.
- No large UI redesign.

## Recommended Approach

Use a local data package:

- `data/loop-data-v0.1.js` exports the product data and attaches it to `window.LOOP_DATA_V01` for the browser.
- `data/README.md` documents field ownership and source strategy.
- `scripts/verify-loop-data.mjs` validates referential integrity.
- `index.html` loads the data file before `script.js`.
- Existing UI behavior stays mostly unchanged in the first implementation step.

This keeps v0.1 close to the existing prototype while making later API or database migration straightforward.

## Data Model

All records use stable string IDs. IDs should be readable and migration-safe, for example `poi-sh-ops-cafe`, `route-sh-coffee-01`, `pass-sh-coffee-vol01`.

### Cities

Purpose: define supported cities and city-level editorial context.

Fields:

- `id`: stable city key, such as `shanghai`, `chengdu`, `abudhabi`
- `name`: display name
- `code`: short code used in routes and orders
- `country`
- `timezone`
- `currency`
- `status`: `draft`, `active`, or `archived`
- `districts`: editorial district list
- `editorialLine`: one-line product positioning for the city
- `manualFields`: admin guidance for city editors

### City POIs

Purpose: store city points that routes, passes, and recommendations can reference.

Fields:

- `id`
- `cityId`
- `name`
- `categoryId`: matches existing LOOP layer IDs, such as `coffee`, `drink`, `art`
- `area`
- `address`
- `displayCoordinate`: prototype map position, `{ x, y }`
- `geo`: optional real latitude/longitude for future use
- `summary`
- `tags`
- `openingHours`
- `priceHint`
- `source`: `manual`, `open_data`, `merchant`, or `prototype_seed`
- `sourceUrl`
- `confidence`: `low`, `medium`, or `high`
- `status`: `draft`, `active`, `hidden`, or `archived`
- `adminNotes`

v0.1 can use `displayCoordinate` even when real geo data is missing. Real `geo` can be filled later from open data or merchant submission.

### Routes

Purpose: define route products and recommendation candidates.

Fields:

- `id`
- `cityId`
- `code`
- `categoryId`
- `title`
- `summary`
- `stopIds`: ordered POI IDs
- `durationLabel`
- `budgetLabel`
- `distanceKm`
- `bestFor`
- `scoreHot`
- `recommendationTags`
- `status`: `draft`, `active`, `hidden`, or `archived`
- `manualFields`: editor notes for route quality

Route stops must reference existing POIs in the same city. Free-text stops can exist only as temporary migration data and should be flagged by validation.

### City Passes

Purpose: define paid editorial maps with redeemable merchant benefits.

Fields:

- `id`
- `cityId`
- `routeId`
- `code`
- `title`
- `issue`
- `theme`
- `summary`
- `price`
- `originalPrice`
- `currency`
- `validDays`
- `benefits`
- `status`: `draft`, `active`, `paused`, or `archived`

Benefit fields:

- `id`
- `poiId`
- `title`
- `benefitName`
- `description`
- `hours`
- `routeRole`
- `redemptionLimit`: usually `1`
- `merchantManaged`: boolean for future merchant backend routing
- `manualVerifyRequired`: boolean for early manual operation

The city pass should reference a route, and each benefit should reference a POI. This keeps route exploration and benefit redemption connected but not identical.

### Orders

Purpose: model purchase state for city passes.

Fields:

- `id`
- `orderNo`
- `userId`
- `cityPassId`
- `cityId`
- `status`: `paid`, `active`, `completed`, `expired`, `refunded`
- `amount`
- `currency`
- `createdAt`
- `paidAt`
- `validFrom`
- `validUntil`
- `source`: `prototype`, `manual`, or future payment provider

v0.1 does not need unpaid or pending payment states because the current prototype intentionally uses simulated paid purchases.

### Redemptions

Purpose: model each benefit redemption event.

Fields:

- `id`
- `orderId`
- `cityPassId`
- `benefitId`
- `poiId`
- `status`: `available`, `redeemed`, `expired`, or `voided`
- `redemptionCode`
- `redeemedAt`
- `redeemedBy`: future merchant/admin operator ID
- `method`: `qr`, `manual_code`, or `prototype_simulated_scan`
- `notes`

The validation script should prevent duplicate redeemed events for the same `orderId + benefitId`.

### User Records

Purpose: model a user's went/photo/completion history.

Fields:

- `id`
- `userId`
- `cityId`
- `recordType`: `visited`, `photo`, `route_completed`, `pass_completed`, or `note`
- `poiIds`
- `routeId`
- `cityPassId`
- `orderId`
- `dateISO`
- `timeLabel`
- `title`
- `mood`
- `photo`
- `photoSource`: `camera`, `upload`, `pass_completed`, or empty
- `durationLabel`
- `budgetLabel`
- `note`
- `visibility`: `private` for v0.1

These records drive profile history and AI exclusion rules. A completed pass can create a user record, but route completion and benefit completion stay separate.

## AI Recommendation Read Rules

Purpose: define what local recommendation logic and future AI are allowed to read.

Fields:

- `candidateCategoryIds`
- `includeStatuses`: usually `active`
- `excludeVisitedPoiIds`: boolean
- `excludeCompletedRouteIds`: boolean
- `preferUserInterestIds`: boolean
- `preferCurrentCity`: boolean
- `manualBoosts`: route or POI IDs to lift
- `manualBlocks`: route or POI IDs to suppress
- `maxRoutes`
- `minStops`
- `maxStops`
- `promptRules`: text constraints used only by AI payload generation

v0.1 recommendation rules should read from POIs, routes, user records, and completed route IDs. They should not call external AI by themselves.

## Manual Admin Input Fields

Purpose: make future editor and merchant tooling predictable before building it.

Each data type gets a field checklist:

- Required fields
- Optional fields
- Source type
- Source confidence
- Review owner
- Last reviewed date
- Publish status
- Notes for future merchant self-service

Ownership split:

- LOOP editor manually seeds cities, route structure, themes, editorial copy, recommendation rules.
- Open data can later fill address, coordinates, opening hours, website, and source URLs.
- Merchant backend can later fill benefit details, live availability, redemption rules, and merchant-managed notes.

## Initial Seed Strategy

Seed enough local data to prove the container:

- 3 cities: Shanghai, Chengdu, Abu Dhabi
- 6 to 10 active POIs per city
- 3 to 5 active routes per city
- 1 to 2 city passes per city
- 1 demo paid order
- 2 to 4 redemption states
- 6 to 10 user records
- 1 recommendation ruleset

The seed does not need to be complete. It must be internally consistent.

## Validation Rules

`scripts/verify-loop-data.mjs` should fail if:

- A route references a missing POI.
- A route references a POI in a different city.
- A city pass references a missing route.
- A city pass benefit references a missing POI.
- An order references a missing city pass.
- A redemption references a missing order, pass, benefit, or POI.
- Duplicate IDs exist within a table.
- Active routes have fewer than 2 stops.
- Active city passes have no benefits.
- AI recommendation rules reference unknown categories, routes, or POIs.

## Frontend Integration

v0.1 integration should be shallow:

- Load `data/loop-data-v0.1.js` in `index.html`.
- Add adapter helpers in `script.js` that can map local data records into the current UI shape.
- Keep existing fallback data during the first migration so the app still opens if the data file fails to load.
- Do not rewrite all state management in the first pass.

The first implementation can migrate only a small slice of display data, then validation protects the rest of the container.

## Testing

Minimum verification:

- `npm run check`
- `npm test`
- `node scripts/verify-loop-data.mjs`

If frontend behavior is changed, run a browser smoke check against the local server.

## Acceptance Criteria

- Local data files exist and are readable by the browser.
- The data package includes all eight requested data areas.
- Validation script catches broken references and duplicate IDs.
- Existing app still passes current checks.
- No crawler, real AI, database, merchant login, or payment provider is introduced.
