## Feature: Chart Configurator UI for Visual Chart Creation

### Goal
Enhance the existing chart configurator with improved dataset selection UX, better mobile responsiveness, and complete E2E test coverage.

### Affected files

| File | Change type | Description |
|------|-------------|-------------|
| `src/components/configurator/DatasetStep.tsx` | modify | Add inline dataset search/browse if arriving without pre-selection |
| `src/components/configurator/ConfiguratorShell.tsx` | modify | Improve mobile responsive layout with preview toggle |
| `src/components/configurator/ChartTypeStep.tsx` | modify | Add chart type icons and improve disabled state messaging |
| `src/components/configurator/MappingStep.tsx` | modify | Add drag-and-drop field assignment (optional enhancement) |
| `src/components/configurator/CustomizeStep.tsx` | modify | Ensure all chart-type-specific options are complete |
| `src/components/configurator/PreviewStep.tsx` | modify | Add embed code copy and share URL generation |
| `src/lib/i18n/locales/sr/common.json` | modify | Add missing translation keys for configurator enhancements |
| `src/lib/i18n/locales/lat/common.json` | modify | Add missing translation keys for configurator enhancements |
| `src/lib/i18n/locales/en/common.json` | modify | Add missing translation keys for configurator enhancements |
| `tests/e2e/configurator.spec.ts` | new | E2E tests for complete configurator flow |
| `tests/integration/configurator-flow.test.ts` | new | Integration tests for URL state persistence |

### Implementation steps

1. **Add inline dataset selection to DatasetStep** — Modify `DatasetStep.tsx` to support dataset search when arriving at `/create` without pre-selection. Validate by testing navigation from `/create` (empty state) and `/create?dataset=X` (pre-selected).

2. **Improve mobile responsive layout** — Modify `ConfiguratorShell.tsx` to use a tab-based or collapsible preview panel on mobile instead of the current toggle button. Validate on viewport widths 375px, 768px, and 1024px.

3. **Enhance chart type grid with icons** — Update `ChartTypeStep.tsx` to use proper SVG icons from Lucide React instead of emoji icons. Add tooltips explaining why incompatible chart types are disabled. Validate all 8 chart types display correctly.

4. **Complete chart-type-specific customization options** — Audit `CustomizeStep.tsx` to ensure all options from Feature 03 config schemas are exposed:
   - Line: dots toggle, stroke width slider
   - Bar/Column: grouped/stacked/percent-stacked selector
   - Pie: label position, sort order
   - Scatter: symbol shape, opacity
   - Map: basemap style selector
   Validate by configuring each chart type end-to-end.

5. **Add embed code and share URL generation** — In `PreviewStep.tsx`, add UI for copying embed code (iframe) and shareable URL with full config state. Validate by copying embed code and rendering in a separate HTML file.

6. **Add missing translation keys** — Add translation keys to all three locale files in `src/lib/i18n/locales/`:
   - Dataset search placeholder
   - Chart type disabled reasons (detailed)
   - Embed size/theme options
   - Mobile preview toggle labels
   Validate by switching locales and viewing configurator.

7. **Add E2E tests for configurator flow** — Create `tests/e2e/configurator.spec.ts` with Playwright tests:
   - Empty start → search dataset → complete flow
   - Pre-selected dataset → complete flow
   - URL params survive browser back/forward
   - Mobile responsive layout works
   Validate by running `npx playwright test`.

8. **Add integration tests for URL state** — Create `tests/integration/configurator-flow.test.ts` to test URL hash encoding/decoding, state restoration, and sessionStorage fallback.

### New translation keys

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `charts.configurator.search_datasets` | Претражите скупове података... | Pretražite skupove podataka... | Search datasets... |
| `charts.configurator.select_chart_type` | Изаберите тип графика | Izaberite tip grafika | Select chart type |
| `charts.configurator.chart_type_disabled` | Недоступно: {{reason}} | Nedostupno: {{reason}} | Unavailable: {{reason}} |
| `charts.configurator.requires_dimensions` | Захтева {{count}} димензија | Zahteva {{count}} dimenzija | Requires {{count}} dimensions |
| `charts.configurator.requires_measures` | Захтева {{count}} мера | Zahteva {{count}} mera | Requires {{count}} measures |
| `charts.configurator.mobile.show_preview` | Прикажи преглед | Prikaži pregled | Show preview |
| `charts.configurator.mobile.hide_preview` | Сакриј преглед | Sakrij pregled | Hide preview |
| `charts.configurator.embed.title` | Код за уградњу | Kod za ugradnju | Embed code |
| `charts.configurator.embed.size_small` | Мала (600×400) | Mala (600×400) | Small (600×400) |
| `charts.configurator.embed.size_medium` | Средња (800×500) | Srednja (800×500) | Medium (800×500) |
| `charts.configurator.embed.size_large` | Велика (1000×600) | Velika (1000×600) | Large (1000×600) |
| `charts.configurator.share.title` | Подели график | Podeli grafik | Share chart |
| `charts.configurator.share.copied` | Линк копиран! | Link kopiran! | Link copied! |
| `charts.configurator.stroke_width` | Дебљина линије | Debljina linije | Stroke width |
| `charts.configurator.label_position` | Позиција ознаке | Pozicija oznake | Label position |
| `charts.configurator.sort_order` | Редослед сортирања | Redosled sortiranja | Sort order |
| `charts.configurator.symbol_shape` | Облик симбола | Oblik simbola | Symbol shape |
| `charts.configurator.basemap_style` | Стил подлоге | Stil podloge | Basemap style |

### Test plan

- **Unit tests** (Jest):
  - `lib/charts/configurator.ts`: Test chart type availability logic with edge case datasets (0 dimensions, 10 measures, etc.)
  - `stores/configurator.ts`: Test step navigation guards, URL state sync, multi-dataset join logic
  - Add tests for new embed code generation utility

- **Component tests** (@testing-library/react):
  - `DatasetStep`: Test dataset search and selection, loading states, error states
  - `ChartTypeStep`: Test disabled state rendering, keyboard navigation
  - `MappingStep`: Test field assignment validation errors
  - `PreviewStep`: Test embed code copy, URL copy

- **E2E tests** (Playwright):
  - Full flow: `/create` → search dataset → select → choose chart type → map fields → customize → preview
  - Pre-selected flow: `/create?dataset=X&resource=Y` → start at chart type step
  - URL persistence: Navigate steps, use back button, verify state restored
  - Mobile: Test preview toggle, step navigation on 375px viewport
  - Accessibility: Keyboard navigation through all steps

### Risks and edge cases

- **Risk: Large datasets slow down preview** — Mitigation: Limit preview to first 100 rows, add virtualization if needed. Debounce config updates with 200ms delay.

- **Risk: URL hash too long for some browsers** — Mitigation: Implement size check and warn user if URL exceeds 2000 characters. Consider server-side persistence (Feature 13) for complex configs.

- **Risk: Mobile preview toggle loses context** — Mitigation: Use CSS visibility toggle instead of unmounting to preserve scroll position and React state.

- **Edge case: Dataset with 0 dimensions or 0 measures** — Already handled by `getChartTypeAvailability()`. Shows all chart types as disabled with reason. Add a helpful message suggesting the user select a different resource.

- **Edge case: User navigates away with unsaved changes** — Add `beforeunload` event listener when `isDirty` is true. Show browser confirmation dialog.

- **Assumption: Feature 02 (data pipeline) returns `ParsedDataset` with correctly typed dimensions/measures** — If the pipeline misclassifies columns, chart type availability will be wrong. Add validation logging.

### Open questions

1. **Should drag-and-drop field mapping be implemented?** The feature request mentions it, but dropdown selects are already functional. Drag-and-drop adds complexity and accessibility concerns. **Recommendation**: Keep dropdown selects for now, add drag-and-drop as a future enhancement.

2. **Should sessionStorage be used as a fallback for URL state?** This would help with very large configs but adds sync complexity. **Recommendation**: Yes, implement sessionStorage fallback with a "Restore previous session" prompt on `/create` page load.

3. **What chart types should be supported for the initial release?** The registry has 8 types (line, bar, column, area, pie, scatterplot, table, combo). Maps are listed but require geo data. **Recommendation**: Ship all 8 types, but show map as disabled unless dataset has geo fields.

4. **Should the configurator support multi-dataset joins immediately?** The store has `addDataset`, `removeDataset`, and join config logic, but the UI for this is complex. **Recommendation**: Implement single-dataset flow first. Add multi-dataset UI as a separate PR.

### Estimated complexity

**Medium** — The configurator already exists with most core functionality. The work involves:
- Enhancing existing components (not building from scratch)
- Adding E2E test coverage (no Playwright setup exists yet)
- Completing translation keys (already have good coverage, just missing edge cases)
- Mobile responsive improvements (minor CSS/layout changes)

The heavy lifting (store, step logic, preview integration, URL state) is already done. This is primarily a polish and test coverage effort.

---

## Summary

**This feature is 70% complete.** The codebase already contains:
- ✅ Zustand store with full state management (`src/stores/configurator.ts`)
- ✅ All 5 step components (`src/components/configurator/`)
- ✅ ConfiguratorShell with URL state sync and preview panel
- ✅ Chart type availability logic (`src/lib/charts/configurator.ts`)
- ✅ Translation keys for core configurator UI
- ✅ Route at `/create` with dataset pre-selection support
- ✅ Unit tests for store and configurator logic

**What's missing:**
- ❌ Inline dataset search in DatasetStep (currently requires arriving from browse)
- ❌ Mobile-optimized layout (basic toggle exists, but not great UX)
- ❌ E2E test coverage (no Playwright tests exist)
- ❌ Embed code and share URL generation in PreviewStep
- ❌ Complete chart-type-specific customization options
- ❌ Some translation keys (mobile, embed, detailed disabled reasons)

The implementation plan focuses on these gaps rather than rebuilding what already works.
