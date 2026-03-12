## Feature: Multi-dataset support with join-by-dimension capability

### Goal
Enable users to combine data from multiple datasets (up to 3) within a single chart by auto-detecting joinable dimensions, allowing visualizations that compare related metrics across Serbian government datasets.

### Affected files
| File | Change type | Description |
|------|-------------|-------------|
| `src/lib/data/join.ts` | modify | Add performance optimization for large datasets (>10k rows), add join type selection support |
| `src/lib/data/infer-join.ts` | modify | Add common Serbian administrative patterns to pattern matching, improve confidence scoring |
| `src/components/configurator/AddDatasetDrawer.tsx` | modify | Add API integration for real dataset loading, add join type toggle (inner/left), improve accessibility |
| `src/components/configurator/JoinPreview.tsx` | modify | Add join type indicator, fix normalization in preview matching, add sample row count display |
| `src/components/configurator/DatasetBadges.tsx` | modify | Add dataset name display (not just "secondary 1"), add tooltip with join info |
| `src/stores/configurator.ts` | modify | Implement `getJoinedDataset()` to return actual joined data, add `joinType` per dataset |
| `src/types/chart-config.ts` | modify | Add `datasets: DatasetReference[]` and `joinConfigs` to ChartConfig schema |
| `src/types/observation.ts` | modify | Add `joinType` to `JoinConfig` interface (already exists), add `JoinType` export |
| `src/components/configurator/MappingStep.tsx` | modify | Show columns from all joined datasets with source indicators/badges |
| `src/components/configurator/ConfiguratorShell.tsx` | modify | Wire up AddDatasetDrawer with real API calls, pass joined dataset to preview |
| `src/locales/en.json` | modify | Add `configurator.multiDataset` translation namespace |
| `src/locales/sr-cyr.json` | modify | Add `configurator.multiDataset` translation namespace (Cyrillic) |
| `src/locales/sr-lat.json` | modify | Add `configurator.multiDataset` translation namespace (Latin) |
| `src/lib/api/browse.ts` | modify | Add `searchDatasets()` function for dataset search in drawer |
| `tests/unit/data/join.test.ts` | modify | Add performance tests, edge case tests for large datasets |
| `tests/unit/data/infer-join.test.ts` | modify | Add tests for Serbian administrative patterns |
| `tests/unit/stores/configurator.test.ts` | modify | Add tests for multi-dataset actions and getJoinedDataset |
| `tests/e2e/multi-dataset.spec.ts` | new | E2E test for full multi-dataset join flow |

### Implementation steps

1. **Extend ChartConfig schema for multi-dataset** — Add `datasets: DatasetReference[]` and join config fields to `src/types/chart-config.ts`. Update Zod schemas. Validate with existing unit tests.
   - **Validate**: `npm run test -- --testPathPattern=chart-config`

2. **Enhance join utilities performance** — Optimize `joinDatasets()` in `src/lib/data/join.ts` for datasets up to 50k combined rows. Add indexed lookup, consider chunked processing. Add `JoinType` selection support (inner/left).
   - **Validate**: Join of 2x10k row datasets completes <500ms in benchmark test

3. **Improve join dimension inference** — Add Serbian administrative patterns (opština, okrug, oblast, šifra) to `infer-join.ts`. Tune confidence scoring thresholds.
   - **Validate**: `npm run test -- --testPathPattern=infer-join`

4. **Add dataset search API function** — Create `searchDatasets(query)` in `src/lib/api/browse.ts` that calls data.gov.rs API. Handle pagination, rate limiting.
   - **Validate**: Manual API call test, add unit test with MSW mock

5. **Extend configurator store for real joins** — Implement `getJoinedDataset()` in `src/stores/configurator.ts` to perform actual join using stored join configs. Add `joinType` per secondary dataset.
   - **Validate**: `npm run test -- --testPathPattern=configurator.store`

6. **Update MappingStep for multi-dataset columns** — Modify `MappingStep.tsx` to show columns from all joined datasets. Add color-coded badges showing source dataset. Handle prefixed column names.
   - **Validate**: Manual UI review, component test for column grouping

7. **Wire AddDatasetDrawer with real API** — Replace mock data in `AddDatasetDrawer.tsx` with calls to `searchDatasets()` and dataset loading via `loader.ts`. Add loading states, error handling, accessibility improvements.
   - **Validate**: Manual test in dev environment

8. **Enhance JoinPreview component** — Add join type indicator (inner/left), display sample row count, show normalization preview. Fix preview matching to use `normalizeJoinValue`.
   - **Validate**: Component test, visual review

9. **Enhance DatasetBadges component** — Display actual dataset names (not "secondary 1"), add tooltip with join key info, improve styling for 3-dataset case.
   - **Validate**: Component test, visual review

10. **Wire ConfiguratorShell integration** — Connect AddDatasetDrawer to ConfiguratorShell, pass joined dataset to ConfiguratorPreview, handle URL state for multi-dataset charts.
   - **Validate**: Full flow manual test

11. **Add translation keys** — Add `configurator.multiDataset` namespace to all three locale files with labels for add/remove dataset, join type, overlap warnings, source indicators.
   - **Validate**: `npm run build` succeeds, no missing key warnings

12. **Write unit tests for new functionality** — Add tests to `join.test.ts` (performance, edge cases), `infer-join.test.ts` (Serbian patterns), `configurator.test.ts` (multi-dataset actions).
   - **Validate**: `npm run test` passes, coverage maintained

13. **Write E2E test for multi-dataset flow** — Create `tests/e2e/multi-dataset.spec.ts` covering: add second dataset, confirm join suggestion, verify preview shows joined data, save chart.
   - **Validate**: `npm run test:e2e -- --grep "multi-dataset"`

### New translation keys
| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `configurator.multiDataset.addDataset` | Додај скуп података | Dodaj skup podataka | Add dataset |
| `configurator.multiDataset.removeDataset` | Уклони скуп података | Ukloni skup podataka | Remove dataset |
| `configurator.multiDataset.searchPlaceholder` | Претражи скупове података... | Pretraži skupove podataka... | Search datasets... |
| `configurator.multiDataset.joinBy` | Споји по | Spoji po | Join by |
| `configurator.multiDataset.joinType.inner` | Унутрашње спајање | Unutrašnje spajanje | Inner join |
| `configurator.multiDataset.joinType.left` | Лево спајање | Levo spajanje | Left join |
| `configurator.multiDataset.joinPreview` | Преглед спојених података | Pregled spojenih podataka | Join preview |
| `configurator.multiDataset.noMatchingColumns` | Нема подударних колона за спајање | Nema podudarnih kolona za spajanje | No matching columns found |
| `configurator.multiDataset.lowOverlap` | Низак преклапање ({{percent}}%). Проверите да ли су нивои грануларности исти. | Nisko preklapanje ({{percent}}%). Proverite da li su nivoi granularnosti isti. | Low overlap ({{percent}}%). Check if granularity levels match. |
| `configurator.multiDataset.selectJoinKey` | Изаберите колону за спајање | Izaberite kolonu za spajanje | Select join column |
| `configurator.multiDataset.overlapPercent` | {{percent}}% преклапање | {{percent}}% preklapanje | {{percent}}% overlap |
| `configurator.multiDataset.matchedColumns` | подударност | podudarnost | match |
| `configurator.multiDataset.primaryDataset` | Примарни скуп података | Primarni skup podataka | Primary dataset |
| `configurator.multiDataset.secondaryDataset` | Секундарни скуп података | Sekundarni skup podataka | Secondary dataset |
| `configurator.multiDataset.maxDatasetsReached` | Максимално 3 скупа података | Maksimalno 3 skupa podataka | Maximum 3 datasets |
| `configurator.multiDataset.sourceIndicator` | извор | izvor | source |
| `configurator.multiDataset.loading` | Учитавање скупа података... | Učitavanje skupa podataka... | Loading dataset... |
| `configurator.multiDataset.confirm` | Потврди спајање | Potvrdi spajanje | Confirm join |
| `configurator.multiDataset.columnsFrom` | Колоне из {{datasetName}} | Kolone iz {{datasetName}} | Columns from {{datasetName}} |

### Test plan
- **Unit**:
  - `join.test.ts`: Performance test with 10k/50k row datasets, edge cases (empty datasets, single row, all nulls), Cyrillic-Latin normalization edge cases
  - `infer-join.test.ts`: Serbian administrative pattern detection (opština/opstina, okrug, godina), confidence scoring thresholds
  - `configurator.test.ts`: `addDataset`, `removeDataset`, `setJoinConfig`, `getJoinedDataset` with mock data
- **Component**:
  - `AddDatasetDrawer.test.tsx`: Renders dataset list, handles selection, shows join preview, calls onAddDataset
  - `JoinPreview.test.tsx`: Displays suggestions, shows low overlap warning, updates on selection change
  - `DatasetBadges.test.tsx`: Shows correct dataset names, remove button works, max limit message
  - `MappingStep.test.tsx`: Shows columns grouped by source dataset, badges display correctly
- **E2E**:
  - Navigate to configurator with a dataset
  - Click "Add dataset", search for second dataset
  - Verify join suggestions appear, select one
  - Confirm join preview shows merged data
  - Proceed to mapping, verify columns from both datasets appear with source badges
  - Complete chart and save
  - Reload saved chart, verify multi-dataset config persists

### Risks and edge cases
- **Performance regression on large joins** — Mitigation: Add indexed lookup in `joinDatasets()`, benchmark at 50k rows, add loading indicator for >5s operations
- **Cyrillic-Latin normalization edge cases** — Mitigation: Expand `normalizeJoinValue()` to handle diacritics (đ/dj, ž/z), test with real Serbian municipality names
- **Low overlap false positives** — Mitigation: Tune overlap threshold (currently 70% for value-overlap), add user override option
- **Granularity mismatch warning unclear** — Mitigation: Add specific message explaining municipality vs. district vs. region mismatch
- **URL state bloat with multiple datasets** — Mitigation: Store only dataset IDs and join keys in URL, compress if >200 chars
- **API rate limiting during dataset search** — Mitigation: Debounce search input, cache recent searches, show loading state
- **Existing single-dataset charts break** — Mitigation: Default `datasets: []` in config, backward compatibility in `getJoinedDataset()`
- **Prefixed column names in saved charts** — Mitigation: Validate prefix format on load, handle legacy charts without prefixes

### Open questions
- Should we persist the joined dataset in the database or re-join on load? (Re-join is more flexible but requires source datasets to remain available)
- What happens if a source dataset is deleted or modified after a multi-dataset chart is created? (Need error handling UI)
- Should users be able to manually override join column suggestions? (Currently yes via dropdown, but may need explicit "manual mode")
- Do we need to support right join or full outer join? (Currently only inner and left — feature spec doesn't mention them)

### Estimated complexity
**Medium** — The core join logic and UI components already exist. The work is primarily integration (wiring real API calls), enhancement (performance optimization, better UX), and translation. No new architectural patterns needed. The main risk is performance on large datasets, which requires careful optimization but is scoped to one file.
