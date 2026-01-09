# Implementation Gap Analysis

> Review of IMPLEMENTATION_ROADMAP.md against actual implementation Generated:
> 2026-01-08 **Last Recheck: 2026-01-08**

---

## Executive Summary

| Phase                    | Planned Items | Completed | Gaps            |
| ------------------------ | ------------- | --------- | --------------- |
| Phase 1: Testing         | 5             | **5**     | 0               |
| Phase 2: Library Exports | 12            | **11**    | 1 (deferred)    |
| Phase 3: Demo Components | 4             | **3**     | 1 (alternative) |
| **Total**                | **21**        | **19**    | **2**           |

**Completion Rate: 90%** _(previously 63%)_

---

## Phase 1: Testing ✅ COMPLETE

### All Items Implemented

- [x] `app/tests/exports/library-exports.spec.ts` - All public API exports
      verified
- [x] `app/tests/demos/smoke.spec.ts` - All demo configurations tested
      (currently 18)
- [x] `app/tests/config/validation.spec.ts` - Configuration validation tests
- [x] `app/tests/integration/` - Data pipeline and user journey tests
- [x] `app/tests/client/data-gov-rs.spec.ts` - **RESOLVED** _(was Gap #1)_

### Dependencies

- [x] MSW installed (`msw@^2.7.0` in devDependencies)

---

## Phase 2: Library Exports ✅ MOSTLY COMPLETE

### All Core Items Implemented

- [x] `app/exports/` directory structure
- [x] `app/exports/core.ts` - Locale, config, validation
- [x] `app/exports/client.ts` - DataGovRs client
- [x] `app/exports/charts/LineChart.tsx` - Standalone line chart
- [x] `app/exports/charts/BarChart.tsx` - **RESOLVED** _(was Gap #2)_
- [x] `app/exports/charts/ColumnChart.tsx` - **RESOLVED** _(was Gap #3)_
- [x] `app/exports/charts/PieChart.tsx` - **RESOLVED** _(was Gap #4)_
- [x] `app/exports/charts/AreaChart.tsx` - **RESOLVED** _(was Gap #5)_
- [x] `app/exports/hooks/useDataGovRs.ts` - Data fetching hook
- [x] `app/exports/hooks/useChartConfig.ts` - Config management hook
- [x] `app/exports/hooks/useLocale.ts` - Locale utilities

### Intentionally Deferred

#### `exports/charts/MapChart.tsx`

**Status:** DEFERRED

**Reason:** Complex geospatial dependencies (deck.gl/mapbox-gl) require separate
planning and potential optional peer dependency structure.

**Note in code:** The export is commented out in `app/exports/charts/index.ts`
with explanation.

**Future Action:** Consider as separate package or optional feature in future
release.

---

## Phase 3: Demo Components ✅ MOSTLY COMPLETE

### All Core Items Implemented

- [x] `DemoCodeBlock` component (`app/components/demos/demo-code-block.tsx`)
- [x] `PerformanceBadge` component
      (`app/components/demos/performance-badge.tsx`)
- [x] `/demos/playground` page (`app/pages/demos/playground/index.tsx`) -
      Interactive chart configuration

### Alternative Implementation

#### `/demos/getting-started` page

**Status:** ALTERNATIVE PATH

**What Was Planned:** `app/pages/demos/getting-started/index.tsx`

**What Exists:** `/docs/getting-started` (documentation page at
`app/docs/catalog/getting-started.mdx`)

**Decision:** Keep current docs-based approach. It's discoverable and maintains
separation between documentation and demos.

---

## Resolved Gaps Summary

| Gap # | Item                                   | Resolution Date | Notes                        |
| ----- | -------------------------------------- | --------------- | ---------------------------- |
| 1     | `app/tests/client/data-gov-rs.spec.ts` | 2026-01-08      | Full MSW mocking implemented |
| 2     | `app/exports/charts/BarChart.tsx`      | 2026-01-08      | Following LineChart pattern  |
| 3     | `app/exports/charts/ColumnChart.tsx`   | 2026-01-08      | Vertical bar variant         |
| 4     | `app/exports/charts/PieChart.tsx`      | 2026-01-08      | With Cell coloring           |
| 5     | `app/exports/charts/AreaChart.tsx`     | 2026-01-08      | Line with fill               |

---

## Remaining Items (Intentionally Deferred)

| Item                      | Status      | Reason                                 |
| ------------------------- | ----------- | -------------------------------------- |
| MapChart component        | DEFERRED    | Complex deck.gl/mapbox-gl dependencies |
| Getting-started demo page | ALTERNATIVE | Exists as documentation page           |

---

## Additional Implementation Gaps

- Extract a standalone MapChart export from `app/charts/map/` that does not
  depend on app-specific GraphQL/configurator logic.
- Define how MapChart consumers should load required CSS (MapLibre) and document
  the integration steps.
- Decide whether `@deck.gl/*`, `maplibre-gl`, and `react-map-gl` remain
  dependencies or move to peer/optional dependencies before exporting MapChart.

---

## Testing Coverage Gaps

- Add unit tests for `BarChart`, `ColumnChart`, `PieChart`, and `AreaChart` in
  `app/tests/exports/charts/` (only `LineChart` is covered today).
- Add tests for `useLocale` in `app/tests/exports/hooks/` (current coverage is
  `useDataGovRs` and `useChartConfig` only).
- Add a packaging/export test that validates the `@acailic/vizualni-admin/*`
  subpath exports against built `dist` artifacts, not just source imports.

---

## Skipped Parts For Other Agents

- Implement `app/exports/charts/MapChart.tsx` and wire the export in
  `app/exports/charts/index.ts` after deciding how to package deck.gl/maplibre
  dependencies.
- Build `/demos/getting-started` at `app/pages/demos/getting-started/index.tsx`
  or replace the alternative docs-only approach with a real demo page.

---

## Current Chart Exports

From `app/exports/charts/index.ts`:

```typescript
export { LineChart } from "./LineChart";
export { BarChart } from "./BarChart";
export { ColumnChart } from "./ColumnChart";
export { PieChart } from "./PieChart";
export { AreaChart } from "./AreaChart";
// MapChart - deferred due to complex geospatial dependencies
```

---

## Verification Commands

```bash
# Verify all tests pass
cd app && yarn test

# Run specific test suites
yarn test tests/exports
yarn test tests/demos
yarn test tests/config
yarn test tests/client

# Check exports structure
ls -la app/exports/charts/

# Verify chart exports
grep "export" app/exports/charts/index.ts
```

---

## Reference Documents

- **Original Roadmap:** `docs/IMPLEMENTATION_ROADMAP.md`
- **Testing Guidelines:** `docs/TESTING_GUIDELINES.md`
- **Demo Guide:** `docs/DEMOS_GUIDE.md`

---

## Change Log

| Date       | Change                                   |
| ---------- | ---------------------------------------- |
| 2026-01-08 | Initial gap analysis (63% complete)      |
| 2026-01-08 | Recheck - 5 gaps resolved (89% complete) |

---

_Generated from review of implementation phases_ _Last Updated: 2026-01-08_
