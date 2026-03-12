# Feature 03: Expanded Chart Type System - Implementation Plan

Generated on 2026-03-11 from `recipes/inputs/plans/feature-03-chart-types.md`.

## 1. Goal

Replace the current Plotly-centric `ChartRenderer` with a typed chart registry and per-chart renderer architecture that supports eight planned chart types for Feature 03: line, bar, column, area, pie, scatterplot, table, and combo. The implementation should preserve the project rule that `ChartRenderer` remains the dispatch layer, reuse the existing chart libraries already in the repo, and prepare the codebase for Feature 04 configurator work and the Feature 02 parsed-dataset pipeline.

## 2. Affected Files

| File | Action | Purpose |
|------|--------|---------|
| `src/types/chart-config.ts` | Create | Define the new chart-type union, shared config model, per-chart Zod schemas, and validation helpers |
| `src/types/index.ts` | Modify | Re-export chart config types from a dedicated module instead of keeping them inline |
| `src/lib/charts/registry.ts` | Create | Central registry mapping chart types to renderer modules, labels, default config, and capabilities |
| `src/components/charts/ChartRenderer.tsx` | Refactor | Validate config, dispatch through the registry, lazy-load heavy renderers, and render shared empty/error states |
| `src/components/charts/ChartBuilder.tsx` | Modify | Source chart-type options from the registry and align the UI with the new chart-type names |
| `src/components/charts/shared/ChartFrame.tsx` | Create | Shared title, description, empty-state, print-safe wrapper, and locale-aware formatting shell |
| `src/components/charts/shared/chart-formatters.ts` | Create | Locale-aware number/date formatting helpers for Serbian Cyrillic, Serbian Latin, and English |
| `src/components/charts/line/LineChart.tsx` | Create | Recharts line renderer with line-specific config support |
| `src/components/charts/bar/BarChart.tsx` | Create | Recharts horizontal bar renderer |
| `src/components/charts/column/ColumnChart.tsx` | Create | Recharts vertical bar/column renderer |
| `src/components/charts/area/AreaChart.tsx` | Create | Recharts area renderer with null-safe data handling |
| `src/components/charts/pie/PieChart.tsx` | Create | Recharts pie/donut renderer |
| `src/components/charts/scatterplot/ScatterplotChart.tsx` | Create | D3-based scatterplot with React-owned container and D3-owned SVG internals |
| `src/components/charts/table/TableChart.tsx` | Create | Native table renderer for tabular inspection and print-safe fallback |
| `src/components/charts/combo/ComboChart.tsx` | Create | Recharts composed chart for bar + line combinations |
| `src/lib/i18n/locales/sr/common.json` | Modify | Add chart type labels, chart-state messages, and formatting-related UI strings |
| `src/lib/i18n/locales/lat/common.json` | Modify | Keep Serbian Latin translations in sync |
| `src/lib/i18n/locales/en/common.json` | Modify | Keep English translations in sync |
| `tests/unit/charts/chart-config.test.ts` | Create | Validate schema acceptance and rejection cases |
| `tests/unit/charts/ChartRenderer.test.tsx` | Create | Verify registry dispatch, empty-data handling, and validation failures |
| `tests/unit/charts/line/LineChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/bar/BarChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/column/ColumnChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/area/AreaChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/pie/PieChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/scatterplot/ScatterplotChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/table/TableChart.test.tsx` | Create | Per-chart valid-data smoke test |
| `tests/unit/charts/combo/ComboChart.test.tsx` | Create | Per-chart valid-data smoke test |

## 3. Implementation Steps

1. Extract chart typing out of `src/types/index.ts` into `src/types/chart-config.ts`, expand the chart-type union to Feature 03 names, and keep a compatibility layer only where current callers still depend on the old `scatter` naming.
2. Define shared config primitives and Zod-backed validation for common chart fields, then add per-chart schema extensions for line, bar/column, area, pie, scatterplot, table, and combo options.
3. Create `src/lib/charts/registry.ts` with one definition per chart type, including label keys, default config, capability flags, and lazy renderer imports for heavy chart implementations.
4. Build shared chart infrastructure under `src/components/charts/shared/`, including locale-aware number/date formatters, a print-safe frame component, and reusable empty/error rendering.
5. Refactor `src/components/charts/ChartRenderer.tsx` to validate incoming config, select the chart definition from the registry, normalize data for the selected renderer, and show clear fallback UI when data or config is invalid.
6. Implement the Recharts-based renderers first: `line`, `bar`, `column`, `area`, `pie`, and `combo`, since those cover the highest-value chart set and map cleanly to the architecture notes.
7. Implement `table` as a native React renderer that accepts the same validated config model and doubles as the print-friendly fallback for unsupported visual cases.
8. Implement `scatterplot` with D3 using a ref-owned container and effect-driven rendering so React and D3 do not compete for DOM ownership.
9. Update `src/components/charts/ChartBuilder.tsx` to read available types from the registry, remove unsupported legacy options like `histogram`, and align displayed labels with translation keys instead of hard-coded English strings.
10. Add translation keys in all three locale files for chart type names, empty/invalid chart states, legend labels, and axis/tooltip helper text.
11. Add unit coverage for config validation, registry dispatch, and one valid-render smoke test per chart type, with explicit cases for empty datasets, single-row datasets, null values, and Serbian locale formatting.
12. Run `npm run type-check`, targeted Jest chart tests, and `npm run build`, then record any remaining dependency on the Feature 02 `ParsedDataset` work as the follow-up integration task if Feature 03 lands before that pipeline exists.

## 4. Translation Impact

This feature needs synchronized locale updates in `sr`, `sr-Latn`, and `en` for:

- chart type labels and short descriptions
- empty, invalid, and unsupported chart-state messages
- legend and axis helper text
- table and combo-specific UI strings
- tooltip/date/number formatting helper labels where surfaced in shared UI

Estimated addition: 20 to 30 keys per locale, all required in the same commit to avoid translation drift.

## 5. Test Plan

| Test type | Scope | Target |
|-----------|-------|--------|
| Unit | `chart-config.ts` schema validation and error messages | Reject malformed configs with useful failures |
| Unit | `registry.ts` definitions | Every supported chart type resolves to a renderer and default config |
| Unit | `ChartRenderer.tsx` | Empty data, unknown type, invalid config, and successful dispatch paths |
| Unit | Each chart renderer | One render-smoke test with valid data and locale-aware labels |
| Unit | Shared formatters | Serbian number/date formatting and null-safe output |
| Responsive/manual | 320px, 768px, 1280px layouts | Tick density, legend behavior, and overflow control |
| Build verification | `npm run type-check` and `npm run build` | Ensure lazy imports and client boundaries stay valid |

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Feature 03 assumes the Feature 02 parsed-dataset model, but the repo still mostly passes raw row arrays into `ChartRenderer` | Add a short-term adapter in `ChartRenderer` and keep the long-term `ParsedDataset` integration explicit |
| Current `ChartType` names do not match the requested taxonomy (`scatter` vs `scatterplot`, `histogram` exists but is out of scope) | Centralize names in `chart-config.ts` and migrate callers through the registry |
| D3 scatterplot can introduce hydration and DOM ownership issues | Keep D3 inside a client component with a ref container and isolate SVG mutations to effects |
| Plotly and D3 can inflate bundle size if left eagerly loaded | Use lazy imports and keep Recharts as the default path for standard charts |
| Translation and locale formatting drift can make Serbian output look broken | Reuse shared formatters and add explicit locale tests for Cyrillic strings |
| Table and combo charts can expand config complexity quickly | Keep Feature 03 scoped to rendering and validation only; defer advanced configurator UX to Feature 04 |

## 7. Open Questions

1. Should Feature 03 include a temporary adapter from `Record<string, unknown>[]` to the future `ParsedDataset`, or should it wait until Feature 02 is implemented first?
2. Do we want to preserve Plotly for any current chart path in Feature 03, or fully move standard charts to Recharts and reserve Plotly for later scientific/statistical views?
3. Should `ChartBuilder.tsx` remain as the lightweight internal test harness for now, or should it already start converging toward the Feature 04 configurator data model?
4. For the table renderer, is simple client-side paging enough in Feature 03, or do we want virtualization immediately?

## 8. Estimated Complexity

| Aspect | Rating | Justification |
|--------|--------|---------------|
| Code volume | High | New registry, schemas, shared components, and eight renderer modules |
| Integration risk | Medium | The current config and data model are still simpler than the planned architecture |
| UI complexity | Medium | Rendering is manageable, but responsive and print-safe behavior add edge cases |
| Testing effort | High | Acceptance requires one test per chart type plus shared validation coverage |
| Overall | High | This is a substantial architecture refactor even with map support deferred |

Estimated effort: 4 to 6 developer-days after Feature 02 data types are available, or 5 to 7 developer-days if Feature 03 also has to bridge the current raw-row data shape.
