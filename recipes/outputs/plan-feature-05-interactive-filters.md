## Feature: Interactive Filters (Legend, Time Range, Dimension Filters, Calculation Toggle)

### Goal

Enable users to interactively filter chart data by toggling legend series, selecting time ranges, filtering categorical dimensions, and switching between absolute/percent calculations.

---

### Discovery Summary

**The feature is largely already implemented.** The codebase contains:

| Component | File | Status |
|-----------|------|--------|
| Zustand store | `src/stores/interactive-filters.ts` | ✅ Complete |
| Filter types | `src/types/interactive-filters.ts` | ✅ Complete |
| FilterBar | `src/components/filters/FilterBar.tsx` | ✅ Complete |
| LegendFilter | `src/components/filters/LegendFilter.tsx` | ✅ Complete |
| TimeRangeFilter (with D3 brush) | `src/components/filters/TimeRangeFilter.tsx` | ✅ Complete |
| TimeSlider | `src/components/filters/TimeSlider.tsx` | ✅ Complete |
| DimensionFilter | `src/components/filters/DimensionFilter.tsx` | ✅ Complete |
| CalculationToggle | `src/components/filters/CalculationToggle.tsx` | ✅ Complete |
| Filter utilities | `src/lib/charts/interactive-filters.ts` | ✅ Complete |
| Filter data transforms | `src/lib/data/transforms.ts` | ✅ Complete |
| ChartRenderer integration | `src/components/charts/ChartRenderer.tsx` | ✅ Complete |
| Translations (all 3 locales) | `src/lib/i18n/locales/*/common.json` | ✅ Complete |
| Unit tests for store | `tests/unit/stores/interactive-filters.test.ts` | ✅ Complete |
| Unit tests for transforms | `tests/unit/data/interactive-filters.test.ts` | ✅ Complete |
| Unit tests for DimensionFilter | `tests/unit/components/filters/DimensionFilter.test.tsx` | ✅ Complete |

---

### Gaps Identified

After thorough inspection, **no implementation gaps exist**. The feature specification acceptance criteria are all satisfied:

| Acceptance Criterion | Implementation |
|---------------------|----------------|
| Legend items clickable to hide/show series | `LegendFilter.tsx` + `hiddenSeriesKeys` prop |
| Time range brush filters data | `TimeRangeFilter.tsx` with D3 brush |
| Dimension filter dropdowns | `DimensionFilter.tsx` with single/multi/checkbox modes |
| Multi-select with Cyrillic search | `matchesFilterSearch()` uses `'sr'` locale |
| Calculation toggle | `CalculationToggle.tsx` + `computePercentages()` |
| Zustand store | `useInteractiveFiltersStore` + `useChartInteractiveFilters` hook |
| Memoized filtered data | `ChartRenderer.tsx` uses `useMemo` for `filteredData` |
| Responsive filter bar | Tailwind classes: `flex-col xl:flex-row` |
| Three-locale translations | All keys present in `en`, `sr`, `lat` locale files |
| Reset all filters | `resetAll` action + reset button in FilterBar |

---

### Affected files

| File | Change type | Description |
|------|-------------|-------------|
| — | — | **No changes required** |

---

### Implementation steps

**None required** — the feature is fully implemented.

However, if the feature request was intended to identify what **additional** enhancements could be made, here are optional improvements:

#### Optional Enhancements (not in scope)

1. **E2E tests** — Add Playwright tests for filter interactions
2. **URL serialization** — Persist filter state to URL params (mentioned for Feature 09)
3. **Debounce time range changes** — Prevent rapid re-renders during brush drag
4. **Chart flicker prevention** — Add transition animations when filters change

---

### New translation keys

**None required** — all keys are already present:

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `charts.filters.legend_show_all` | Прикажи све | Prikaži sve | Show all |
| `charts.filters.legend_hide_all` | Сакриј све | Sakrij sve | Hide all |
| `charts.filters.all` | Све | Sve | All |
| `charts.filters.search` | Претрага... | Pretraga... | Search... |
| `charts.filters.no_results` | Нема резултата | Nema rezultata | No results |
| `charts.filters.from` | Од | Od | From |
| `charts.filters.to` | До | Do | To |
| `charts.filters.absolute` | Апсолутно | Apsolutno | Absolute |
| `charts.filters.percent` | Процентуално | Procentualno | Percent |
| `charts.filters.reset_all` | Поништи све | Poništi sve | Reset all |
| `charts.filters.play` | Покрени | Pokreni | Play |
| `charts.filters.pause` | Паузирај | Pauziraj | Pause |

---

### Test plan

**Existing tests cover the feature:**

- **Unit (store)**: `tests/unit/stores/interactive-filters.test.ts` — store actions, reset, initialization
- **Unit (transforms)**: `tests/unit/data/interactive-filters.test.ts` — `applyInteractiveFilters` logic
- **Unit (components)**: `tests/unit/components/filters/DimensionFilter.test.tsx` — multi-select, checkbox, search

**Missing test coverage (optional):**

- **Component tests**: LegendFilter, TimeRangeFilter, TimeSlider, CalculationToggle, FilterBar
- **E2E tests**: Playwright tests for full filter workflow (currently empty `tests/e2e/` directory)

---

### Risks and edge cases

Since the feature is implemented, the remaining risks are maintenance-related:

- **D3/React DOM conflict** — Already mitigated in `TimeRangeFilter.tsx` by using refs and `useEffect` with proper cleanup
- **Cyrillic search** — Already handled by `matchesFilterSearch()` using `'sr'` locale
- **Hydration mismatch** — Store state initializes client-side via `useEffect`, avoiding SSR issues

---

### Open questions

1. **Was this feature request created before the implementation was complete?** The codebase shows the feature is fully implemented.

2. **Should E2E tests be added?** The `tests/e2e/` directory is empty. Playwright tests would validate the complete user flow.

3. **Should URL serialization be implemented now?** The feature spec mentions this is for Feature 09 (shareable URLs), but the groundwork could be laid.

---

### Estimated complexity

**None / Maintenance only** — The feature is complete. Any work would be:
- Adding E2E tests: **small**
- Adding URL param serialization: **small** (URL utilities already exist in `src/lib/url/`)
- Performance optimizations (debounce): **small**
