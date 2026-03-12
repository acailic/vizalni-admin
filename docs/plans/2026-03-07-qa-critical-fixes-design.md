# QA Critical Fixes Design

**Date:** 2026-03-07 **Priority:** Critical + High (10 bugs) **Approach:**
Centralized URL/path module fixes + targeted i18n patches + misc bug fixes

---

## Overview

This design addresses the 10 Critical and High priority bugs identified in the
QA report for Vizualni Admin (https://acailic.github.io/vizualni-admin/).

### Bug Summary

| Bug ID | Severity | Description                                                          |
| ------ | -------- | -------------------------------------------------------------------- |
| BUG-01 | Critical | Embed link generates wrong URL - missing `/vizualni-admin` base path |
| BUG-02 | Critical | Embed demo/preview page broken - "Something went wrong" error        |
| BUG-03 | Critical | `/browse/` page fully non-functional - shows demo limit message      |
| BUG-04 | Critical | next-auth CLIENT_FETCH_ERROR on every page load                      |
| BUG-05 | High     | Language switcher does not work                                      |
| BUG-06 | High     | Modal buttons on Showcase page show raw i18n keys                    |
| BUG-07 | High     | Chart previews not loading in Showcase modal and homepage cards      |
| BUG-08 | High     | "Share" button navigates to topic page instead of sharing            |
| BUG-09 | High     | Playground default chart renders broken data                         |
| BUG-10 | High     | "Категорије" and "Произвођачи" stats do not update on filter         |

---

## Section 1: Embed URL Fixes (BUG-01, BUG-02)

### BUG-01: Missing `/vizualni-admin` base path

**Root Cause:** The `PUBLIC_URL` environment variable may not be correctly
populated during static builds, or `buildPublicPath` is not being called
consistently.

**Fix:**

1. Verify `buildPublicPath` in `app/utils/public-paths.ts` correctly uses
   `BASE_PATH` fallback
2. Ensure `PUBLIC_URL` is derived from `NEXT_PUBLIC_BASE_PATH` during build
3. Update `app/pages/index.tsx` to use `buildPublicPath` consistently for embed
   URLs

**Files:**

- `app/utils/public-paths.ts` — Ensure `buildPublicPath` uses `BASE_PATH` as
  fallback
- `app/domain/env.ts` — Verify PUBLIC_URL derivation
- `app/pages/index.tsx` — Verify embed URL construction

### BUG-02: Embed demo "Something went wrong"

**Root Cause:** Chart components may not be correctly bundled for static export,
or there's a runtime error in the demo page.

**Fix:**

1. Verify chart component exports from `@/components/demos/charts`
2. Add error boundary around chart rendering in `demo.tsx`
3. Check for any runtime dependencies that fail in static mode

**Files:**

- `app/pages/embed/demo.tsx` — Add error handling
- `app/components/demos/charts/index.ts` — Verify exports

---

## Section 2: Core Functionality Fixes (BUG-03, BUG-04)

### BUG-03: Browse page shows demo limit message

**Root Cause:** `/browse/` requires runtime API calls unavailable in static
GitHub Pages builds.

**Fix:**

1. Add a user-friendly redirect or info banner on homepage
2. Change homepage CTAs to point to `/demos/showcase` instead of `/browse`
3. Consider removing `/browse` link entirely in static mode

**Files:**

- `app/pages/browse/index.tsx` — Improve messaging
- `app/pages/index.tsx` — Update CTA targets for static mode
- `app/utils/public-paths.ts` — Use `getDatasetBrowserPath()` for routing

### BUG-04: next-auth CLIENT_FETCH_ERROR

**Root Cause:** The authentication API endpoint returns HTML 404 instead of JSON
in static builds.

**Fix:**

1. Wrap session provider with error handling
2. Gracefully handle missing auth in static mode
3. Consider disabling next-auth entirely for static exports

**Files:**

- `app/pages/_app.tsx` — Add error handling around SessionProvider
- `app/pages/api/auth/[...nextauth].ts` — Ensure proper JSON responses

---

## Section 3: Language/i18n Fixes (BUG-05, BUG-06, BUG-07, BUG-08)

### BUG-05: Language switcher doesn't work

**Root Cause:** In static build mode, Next.js i18n routing is disabled
(`next.config.js:49`). The `LanguagePicker` tries to use `router.push` with
locale which doesn't work without Next.js i18n routing.

**Fix:**

1. Detect static mode in `LanguagePicker`
2. Use URL query params (`?uiLocale=en`) when i18n routing is unavailable
3. Persist locale via localStorage + URL params combo
4. Force page reload or use `shallow: false` to ensure translations load

**Files:**

- `app/components/language-picker.tsx` — Add static mode handling
- `app/utils/app-locale.ts` — Ensure locale persistence works
- `app/pages/_app.tsx` — Ensure locale activation on query param change

### BUG-06: Modal buttons show raw i18n keys

**Root Cause:** Translation keys `demos.showcase.modal.close` and
`demos.showcase.modal.viewDemo` are not defined in message catalogs.

**Fix:**

1. Add missing translation keys to all locale catalogs:
   - `app/locales/en/messages.po`
   - `app/locales/sr-Latn/messages.po`
   - `app/locales/sr-Cyrl/messages.po`
2. Run `lingui compile` to update compiled catalogs

**Files:**

- `app/locales/*/messages.po` — Add missing keys
- `app/components/demos/showcase-card.tsx` — Verify key usage

### BUG-07: Chart previews not loading

**Root Cause:** Similar to BUG-02 — chart components failing to render in
preview contexts.

**Fix:**

1. Verify chart component exports
2. Add error boundary around preview components
3. Check for missing data/props in preview contexts

**Files:**

- `app/components/demos/charts/index.ts` — Verify exports
- `app/pages/demos/showcase/index.tsx` — Add error boundaries

### BUG-08: Share button navigates instead of sharing

**Root Cause:** The share functionality may be falling through to the
`window.open` fallback instead of using clipboard or Web Share API.

**Fix:**

1. Verify `handleShare` in `showcase-card.tsx` correctly uses clipboard API
2. Ensure the share URL is correct (not same as demoUrl)
3. Add better error handling for clipboard operations

**Files:**

- `app/components/demos/showcase-card.tsx` — Fix share implementation

---

## Section 4: Data/State Fixes (BUG-09, BUG-10)

### BUG-09: Playground default chart broken data

**Root Cause:** Initial data not properly initialized in playground state,
showing `undefined` labels.

**Fix:**

1. Verify sample dataset is properly initialized in playground state
2. Ensure `xKey` and `yKey` match the data structure
3. Check that default chart type has valid data

**Files:**

- `app/pages/demos/playground/index.tsx` — Fix initial state
- `app/demos/playground/_components/` — Verify data loading

### BUG-10: Filter stats don't update on `/cene/` page

**Root Cause:** "Категорије" and "Произвођачи" are calculated from full dataset
instead of filtered results.

**Fix:**

1. Update `app/pages/cene.tsx` to derive all stats from filtered data
2. Use `useMemo` to calculate derived stats from filtered results
3. Ensure unique category/manufacturer counts update when filters change

**Files:**

- `app/pages/cene.tsx` — Fix stats calculation

---

## Implementation Order

1. **Embed fixes** (BUG-01, BUG-02) — Highest impact on core functionality
2. **Browse/Auth** (BUG-03, BUG-04) — Fix dead-end pages
3. **i18n fixes** (BUG-05, BUG-06) — Language switching is fundamental
4. **Chart previews** (BUG-07, BUG-08) — Visual polish
5. **Data fixes** (BUG-09, BUG-10) — Ensure data integrity

---

## Testing Plan

1. Build static site with `yarn build:gh-pages`
2. Serve locally with `yarn serve:gh-pages`
3. Verify each bug fix:
   - Embed URLs include `/vizualni-admin` prefix
   - Embed demo page renders charts
   - Browse page redirects gracefully
   - No auth errors in console
   - Language switcher updates content
   - Modal buttons show translated text
   - Chart previews render
   - Share button copies URL
   - Playground shows valid data
   - Filter stats update correctly
