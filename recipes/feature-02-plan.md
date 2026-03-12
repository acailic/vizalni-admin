# Feature 02: Data Transformation Pipeline - Implementation Plan

**Generated**: 2026-03-11  
**Feature Input**: `recipes/inputs/feature-02-data-pipeline.md`  
**Target Branch**: `feature/data-pipeline`

---

## Goal

Build a typed data transformation pipeline that can load CSV/JSON resources from data.gov.rs, parse them with Serbian-specific encoding and number formatting support, classify columns as dimensions or measures, and transform observations for chart consumption. This is the foundational data layer that Features 03 (chart rendering) and 04 (configurator) will depend on.

---

## Affected Files

| File Path | Action | Description |
|-----------|--------|-------------|
| `src/lib/data/loader.ts` | **Create** | CSV/JSON parsing with encoding detection, BOM handling, Serbian number format support |
| `src/lib/data/classifier.ts` | **Create** | Column classification (dimension/measure/metadata) with heuristics |
| `src/lib/data/transforms.ts` | **Create** | Data transformation utilities (filter, sort, aggregate, pivot, impute) |
| `src/lib/data/index.ts` | **Create** | Re-export all data utilities |
| `src/types/observation.ts` | **Create** | Observation, DimensionMeta, MeasureMeta, ParsedDataset types |
| `src/types/index.ts` | **Modify** | Add re-export for observation types |
| `src/lib/api/browse.ts` | **Modify** | Refactor `parsePreviewData` to use new `loader.ts`, add `fetchFullDataset` |
| `src/lib/api/datagov-client.ts` | **Modify** | Add `fetchResourceData()` method |
| `tests/unit/lib/data/loader.test.ts` | **Create** | Unit tests for loader (encoding, BOM, Serbian numbers) |
| `tests/unit/lib/data/classifier.test.ts` | **Create** | Unit tests for column classification heuristics |
| `tests/unit/lib/data/transforms.test.ts` | **Create** | Unit tests for all transform functions |
| `tests/unit/lib/api/browse.test.ts` | **Modify** | Update tests after refactor |
| `src/lib/i18n/locales/sr/common.json` | **Modify** | Add data pipeline error messages (Serbian Cyrillic) |
| `src/lib/i18n/locales/lat/common.json` | **Modify** | Add data pipeline error messages (Serbian Latin) |
| `src/lib/i18n/locales/en/common.json` | **Modify** | Add data pipeline error messages (English) |

---

## Implementation Steps

Each step represents one logical commit.

### Step 1: Add observation types
**Commit**: `feat(data): add Observation, Dimension, Measure types`

Create `src/types/observation.ts` with:
- `Observation` interface (flexible key-value pairs)
- `DimensionMeta` interface (key, label, type, values, cardinality)
- `MeasureMeta` interface (key, label, unit, min, max, hasNulls)
- `ParsedDataset` interface (observations, dimensions, measures, rowCount, source)
- `DataLoadError` custom error class
- Zod schemas for runtime validation

Update `src/types/index.ts` to re-export.

**Files**: `src/types/observation.ts`, `src/types/index.ts`

---

### Step 2: Create data loader with CSV parsing
**Commit**: `feat(data): add loader with CSV/JSON parsing and encoding support`

Create `src/lib/data/loader.ts`:
- `parseCsv(content: string, options?: ParseOptions)` — uses papaparse
- `parseJson(content: string)` — validates JSON structure
- `detectEncoding(content: Buffer)` — Windows-1250, UTF-8 with BOM detection
- `normalizeNumber(value: string)` — handle Serbian comma decimal (1.234,56 → 1234.56)
- `parseDate(value: string)` — handle DD.MM.YYYY, YYYY-MM-DD, MM/YYYY, YYYY patterns
- `loadResourceFromUrl(url: string, format: string)` — fetch and parse

Key considerations:
- Use `TextDecoder` for encoding detection (browser-compatible)
- Strip BOM if present
- Serbian number format: comma as decimal, dot as thousands separator
- Date parsing with fallback to string

**Files**: `src/lib/data/loader.ts`

---

### Step 3: Create column classifier
**Commit**: `feat(data): add column classifier for dimensions and measures`

Create `src/lib/data/classifier.ts`:
- `classifyColumn(values: unknown[]): ColumnClassification`
- `classifyDataset(observations: Observation[]): { dimensions: DimensionMeta[], measures: MeasureMeta[] }`

Heuristics:
- **Measure**: >80% of values are numeric (after normalization)
- **Temporal dimension**: matches date patterns (DD.MM.YYYY, YYYY-MM-DD, etc.)
- **Geographic dimension**: contains Serbian municipality/region names
- **Categorical dimension**: <50 unique non-null values, strings
- **Metadata/skip**: column name contains "id", "url", "link", "note", >90% nulls

Export helper `getColumnStats(values: unknown[])` for testing.

**Files**: `src/lib/data/classifier.ts`

---

### Step 4: Create transform utilities
**Commit**: `feat(data): add transform utilities (filter, sort, aggregate, pivot)`

Create `src/lib/data/transforms.ts`:
- `filterObservations(data: Observation[], filters: Record<string, unknown>)` — equality filter
- `sortObservations(data: Observation[], key: string, direction: 'asc' | 'desc')`
- `aggregateObservations(data: Observation[], groupBy: string, measure: string, agg: 'sum' | 'avg' | 'count' | 'min' | 'max')`
- `pivotObservations(data: Observation[], rowDim: string, colDim: string, measure: string)`
- `computePercentages(data: Observation[], measureKey: string, groupBy?: string)`
- `imputeMissing(data: Observation[], strategy: 'zero' | 'interpolate' | 'skip')`

All functions should be pure (no side effects) and return new arrays.

**Files**: `src/lib/data/transforms.ts`

---

### Step 5: Create data module index
**Commit**: `feat(data): add data module index with public API`

Create `src/lib/data/index.ts`:
```typescript
export { loadResourceFromUrl, parseCsv, parseJson } from './loader'
export { classifyDataset, classifyColumn, getColumnStats } from './classifier'
export {
  filterObservations,
  sortObservations,
  aggregateObservations,
  pivotObservations,
  computePercentages,
  imputeMissing,
} from './transforms'
```

**Files**: `src/lib/data/index.ts`

---

### Step 6: Refactor browse.ts to use new loader
**Commit**: `refactor(api): migrate browse preview to use data loader`

Modify `src/lib/api/browse.ts`:
- Remove inline `parsePreviewData` implementation
- Import `parseCsv`, `parseJson` from `@/lib/data`
- Add `fetchFullDataset(resourceUrl: string, format: string): Promise<ParsedDataset>` that uses the full pipeline (load → classify)
- Keep `parsePreviewData` as a thin wrapper for backward compatibility with existing preview API
- Update `fetchPreviewPayload` to use new loader

**Files**: `src/lib/api/browse.ts`

---

### Step 7: Add fetchResourceData to datagov-client
**Commit**: `feat(api): add resource data fetching to datagov-client`

Modify `src/lib/api/datagov-client.ts`:
- Add `fetchResourceData(resourceUrl: string, format: string): Promise<ParsedDataset>` method
- This method fetches the full dataset (not preview limit), parses, and classifies
- Reuse the loader from `@/lib/data`

**Files**: `src/lib/api/datagov-client.ts`

---

### Step 8: Add translation keys for data pipeline
**Commit**: `feat(i18n): add data pipeline error messages`

Add new `dataPipeline` section to all three locale files with error messages and classifier labels.

**Files**: `src/lib/i18n/locales/sr/common.json`, `src/lib/i18n/locales/lat/common.json`, `src/lib/i18n/locales/en/common.json`

---

### Step 9: Add unit tests for loader
**Commit**: `test(data): add loader unit tests`

Create `tests/unit/lib/data/loader.test.ts`:
- Test CSV parsing with headers
- Test JSON parsing (array and object)
- Test Windows-1250 encoding detection
- Test UTF-8 with BOM handling
- Test Serbian number normalization (1.234,56 → 1234.56)
- Test date parsing for various formats
- Test error handling (malformed CSV, invalid JSON)

**Files**: `tests/unit/lib/data/loader.test.ts`

---

### Step 10: Add unit tests for classifier
**Commit**: `test(data): add classifier unit tests`

Create `tests/unit/lib/data/classifier.test.ts`:
- Test numeric column detection (>80% numeric)
- Test date pattern recognition
- Test categorical vs geographic detection
- Test metadata column detection (id, url, >90% nulls)
- Test with real-world-like dataset with mixed types
- Test edge cases: empty columns, single value, all nulls

**Files**: `tests/unit/lib/data/classifier.test.ts`

---

### Step 11: Add unit tests for transforms
**Commit**: `test(data): add transform unit tests`

Create `tests/unit/lib/data/transforms.test.ts`:
- Test filter with multiple conditions
- Test sort ascending/descending with nulls
- Test all aggregation types (sum, avg, count, min, max)
- Test pivot table transform
- Test percentage computation with/without grouping
- Test imputation strategies (zero, interpolate, skip)
- Test edge cases: empty data, single row, all nulls

**Files**: `tests/unit/lib/data/transforms.test.ts`

---

### Step 12: Update browse tests after refactor
**Commit**: `test(api): update browse tests for loader refactor`

Modify `tests/unit/lib/api/browse.test.ts`:
- Update mocks to use new loader
- Ensure preview functionality still works
- Add test for new `fetchFullDataset` function (mocked)

**Files**: `tests/unit/lib/api/browse.test.ts`

---

## Translation Keys

### Serbian Cyrillic (sr-Cyrl) - `src/lib/i18n/locales/sr/common.json`

```json
"dataPipeline": {
  "errors": {
    "encoding_failed": "Не можете да декодирате енкодирање фајла",
    "parse_failed": "Грешка при парсирању података",
    "empty_dataset": "Скуп података је празан",
    "invalid_format": "Неподржан формат података",
    "too_large": "Скуп података је превелик за обраду"
  },
  "classifier": {
    "dimensions": "Димензије",
    "measures": "Мере",
    "rows": "редова",
    "categorical": "Категоријска",
    "temporal": "Временска",
    "geographic": "Географска"
  }
}
```

### Serbian Latin (sr-Latn) - `src/lib/i18n/locales/lat/common.json`

```json
"dataPipeline": {
  "errors": {
    "encoding_failed": "Ne možete da dekodirate enkoding fajla",
    "parse_failed": "Greška pri parsiranju podataka",
    "empty_dataset": "Skup podataka je prazan",
    "invalid_format": "Nepodržan format podataka",
    "too_large": "Skup podataka je prevelik za obradu"
  },
  "classifier": {
    "dimensions": "Dimenzije",
    "measures": "Mere",
    "rows": "redova",
    "categorical": "Kategorijska",
    "temporal": "Vremenska",
    "geographic": "Geografska"
  }
}
```

### English (en) - `src/lib/i18n/locales/en/common.json`

```json
"dataPipeline": {
  "errors": {
    "encoding_failed": "Unable to decode file encoding",
    "parse_failed": "Failed to parse data",
    "empty_dataset": "Dataset is empty",
    "invalid_format": "Unsupported data format",
    "too_large": "Dataset is too large to process"
  },
  "classifier": {
    "dimensions": "Dimensions",
    "measures": "Measures",
    "rows": "rows",
    "categorical": "Categorical",
    "temporal": "Temporal",
    "geographic": "Geographic"
  }
}
```
