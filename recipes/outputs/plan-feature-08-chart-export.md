# Feature 08: Chart Export (PNG, CSV, Excel) — Implementation Plan

---

## Current State

**Completed / Existing:**
- Dependencies already installed: `html-to-image`, `papaparse`, `xlsx`
- Export utilities implemented: `src/lib/export/export-png.ts`, `export-csv.ts`, `export-excel.ts`, `filename.ts`, `index.ts`
- `ExportMenu` component exists: `src/components/charts/shared/ExportMenu.tsx`
- `ChartFrame` accepts export props and conditionally renders `ExportMenu`
- `ChartRenderer` imports export UI elements
- Locale keys for export UI present in `src/lib/i18n/locales/*/common.json` and `public/locales/*/common.json`
- Uncommitted work in progress contains partial integration

**Gaps:**
- `PreviewStep` (`src/components/configurator/PreviewStep.tsx`) still has legacy ad hoc download/share logic that duplicates/conflicts with new export system
- Hardening needed for edge cases (empty data, large datasets, special characters in filenames)
- Excel lazy-loading may not be fully implemented
- CSV UTF-8 BOM and semicolon delimiter consistency not verified

---

## Remaining Workstreams

### 1. Clean Up Legacy Export Code in PreviewStep
**File:** `src/components/configurator/PreviewStep.tsx`

- Remove or deprecate ad hoc download/share actions
- Replace with `ExportMenu` or delegate to `ChartFrame` export handling
- Ensure preview mode uses same export pipeline as production charts

**Sequence:** First — eliminates confusion and duplicate code paths

---

### 2. Harden Export Utilities

**Files:**
- `src/lib/export/export-csv.ts`
- `src/lib/export/export-png.ts`
- `src/lib/export/export-excel.ts`

**Tasks:**
- **CSV:** Verify UTF-8 BOM (`\uFEFF`) is prepended; confirm semicolon delimiter (`;`) is applied consistently
- **PNG:** Add error handling for:
  - Charts not yet rendered (null ref)
  - Large chart dimensions (memory limits)
  - CORS-blocked resources (images/fonts)
- **Excel:** Implement/verify lazy-loading pattern (`import('xlsx')`) to avoid bundling overhead; add basic cell formatting (headers bold, column widths auto-fit if feasible)

**Sequence:** Second — foundation for reliable exports

---

### 3. Filename Transliteration Safety

**File:** `src/lib/export/filename.ts`

- Ensure all chart titles pass through transliteration (e.g., ć → c, š → s, ž → z)
- Strip or replace unsafe characters: `< > : " / \ | ? *`
- Fallback to generic name (e.g., `chart-export`) if title is empty or entirely unsafe
- Add unit tests for Serbian Latin/Cyrillic edge cases

**Sequence:** Third — prevents runtime errors and filesystem issues

---

### 4. Export Filtered/Transformed Data

**Files:**
- `src/components/charts/shared/ExportMenu.tsx`
- `src/components/charts/shared/ChartFrame.tsx`
- `src/lib/export/export-csv.ts`, `export-excel.ts`

**Tasks:**
- Ensure export utilities receive processed/filtered data, not raw dataset
- Verify data transformations (filters, aggregations, pivots) are applied before export
- Pass transformed data through `ChartFrame` props into `ExportMenu`

**Sequence:** Fourth — ensures exported data matches what user sees

---

### 5. Integration Testing & Edge Cases

**Files:**
- `src/components/charts/shared/ExportMenu.tsx`
- `src/components/charts/shared/ChartFrame.tsx`
- `src/components/configurator/PreviewStep.tsx`

**Tasks:**
- Test export when chart has no data (disable menu or show warning)
- Test export with very large datasets (consider pagination or chunking for Excel)
- Verify all three formats work from:
  - Preview mode in configurator
  - Dashboard/chart view
- Confirm toast/notification feedback on success/failure

**Sequence:** Fifth — final validation

---

### 6. Documentation & Locale Verification

**Files:**
- `src/lib/i18n/locales/*/common.json`
- `public/locales/*/common.json`

**Tasks:**
- Verify all export-related locale keys are present in Serbian (Latin/Cyrillic) and any other supported languages
- Keys to check: `export`, `exportPNG`, `exportCSV`, `exportExcel`, `exportSuccess`, `exportError`, `noDataToExport`

**Sequence:** Sixth — polish

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large dataset exports cause browser hang | High | Add size limits; show warning before export; consider server-side fallback |
| Memory leak in PNG export for complex SVG charts | Medium | Test with complex charts; add cleanup for object URLs |
| Excel library loaded eagerly | Medium | Verify dynamic `import('xlsx')` pattern; check bundle analyzer |
| Inconsistent data between chart and export | High | Single source of truth for transformed data; pass same data object |
| Filename encoding fails on Windows | Low | Test transliteration on reserved characters; use ASCII fallback |

---

## Verification

1. **Manual Tests:**
   - From configurator preview, export chart with Serbian Cyrillic title → PNG, CSV, Excel all download with safe filename
   - Apply filter to chart → exported data reflects filtered state
   - Export chart with no data → appropriate message, no broken file

2. **Automated Tests (if test infra exists):**
   - Unit test `filename.ts` for transliteration and sanitization
   - Unit test `export-csv.ts` for BOM and delimiter
   - Integration test: `ExportMenu` renders with correct props

3. **Bundle Check:**
   - Run bundle analyzer; confirm `xlsx` is not in initial bundle

4. **Cross-Browser:**
   - Test PNG download on Chrome, Firefox, Safari (different canvas implementations)

---

## Complexity

**Overall: Low-Medium**

- Most infrastructure exists; work is integration, hardening, and cleanup
- Estimated effort: 1–2 days for experienced developer familiar with codebase
- Primary complexity in ensuring transformed data flows correctly and edge cases handled
