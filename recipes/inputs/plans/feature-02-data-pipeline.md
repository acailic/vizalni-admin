# Feature Request

## Title
Data transformation pipeline with typed observations and dimension/measure extraction

## Problem
The current codebase fetches raw dataset metadata from data.gov.rs but has no system for loading actual data (CSV/JSON resources), parsing it into typed observations, identifying dimensions vs. measures, and transforming it for chart consumption. The Swiss tool has a full pipeline: SPARQL → parse → GraphQL resolvers → Apollo hooks → D3 scales. We need an equivalent for REST/CSV data.

## Proposed behavior

### Data loading layer (`src/lib/data/`)
- `loader.ts`: Fetch a resource URL (CSV or JSON), parse it, return typed rows
  - CSV parsing via papaparse (already a dependency) with type inference
  - JSON parsing with schema detection
  - Handle encoding issues (Serbian data often uses Windows-1250 or UTF-8 with BOM)
  - Cache parsed data in memory (React `cache()` for server, SWR for client)

### Column classification
- `classifier.ts`: Given parsed rows, classify each column as:
  - **Dimension** (categorical): strings, dates, geographic identifiers, codes
  - **Measure** (numeric): numbers, percentages, currency values
  - **Metadata** (skip): IDs, URLs, notes, empty columns
- Heuristics: >80% numeric values → measure; date patterns → temporal dimension; <50 unique values → categorical dimension
- User can override classification in the configurator (Feature 04)

### Observation model (`src/types/observation.ts`)
```typescript
interface Observation {
  [dimensionKey: string]: string | number | Date | null
}

interface DimensionMeta {
  key: string
  label: string
  type: 'categorical' | 'temporal' | 'geographic'
  values: (string | Date)[]
  cardinality: number
}

interface MeasureMeta {
  key: string
  label: string
  unit?: string
  min: number
  max: number
  hasNulls: boolean
}

interface ParsedDataset {
  observations: Observation[]
  dimensions: DimensionMeta[]
  measures: MeasureMeta[]
  rowCount: number
  source: { datasetId: string; resourceId: string; format: string }
}
```

### Data transformation utilities (`src/lib/data/transforms.ts`)
- `filterObservations(data, filters)` — apply dimension filters
- `sortObservations(data, sortKey, direction)` — sort by any column
- `aggregateObservations(data, groupBy, measureKey, aggregation)` — group and aggregate (sum, avg, count, min, max)
- `pivotObservations(data, rowDim, colDim, measure)` — pivot table transform
- `computePercentages(data, measureKey, groupBy?)` — calculate percentages within groups
- `imputeMissing(data, strategy)` — handle missing values (zero, interpolate, skip)

### Integration with existing API client
- Extend `datagov-client.ts` with `fetchResourceData(resourceUrl, format)` method
- Return `ParsedDataset` ready for chart consumption

## Affected areas
- `src/lib/data/` (new directory: loader.ts, classifier.ts, transforms.ts)
- `src/types/observation.ts` (new file)
- `src/types/index.ts` (re-export new types)
- `src/lib/api/datagov-client.ts` (add resource data fetching)
- `tests/unit/data/` (new test files for each module)

## Constraints
- CSV files from data.gov.rs vary wildly in quality: inconsistent delimiters, mixed encodings, missing headers, merged cells from Excel exports
- Must handle datasets up to 100k rows without freezing the UI (process in chunks if needed, or use Web Workers for large files)
- Serbian number formatting uses comma as decimal separator (1.234,56) — parser must handle this
- Date formats vary: DD.MM.YYYY, YYYY-MM-DD, MM/YYYY, just YYYY
- Column headers are usually in Serbian Cyrillic — preserve as-is for labels

## Out of scope
- Real-time data streaming
- Database storage of parsed data (that's Feature 13)
- Multi-dataset joining (that's Feature 06)
- Chart rendering (that's Feature 03)

## Acceptance criteria
- [ ] `loader.ts` can parse a CSV from a data.gov.rs resource URL into typed rows
- [ ] `loader.ts` handles Windows-1250 encoding, BOM, and comma-as-decimal
- [ ] `classifier.ts` correctly identifies dimensions vs. measures on 5 real data.gov.rs datasets
- [ ] `transforms.ts` can filter, sort, aggregate, and compute percentages
- [ ] `ParsedDataset` type is complete and used by the loader
- [ ] Parsing a 50k-row CSV completes in under 2 seconds
- [ ] Unit tests cover each transform function with edge cases (empty data, all nulls, single row)
- [ ] Error handling: malformed CSV returns a useful error, not a crash

## Prior art / references
- Swiss tool: `app/rdf/parse.ts` — observation parsing from SPARQL results
- Swiss tool: `app/domain/data.ts` — Observation, Dimension, Measure types
- Swiss tool: `app/charts/shared/imputation.tsx` — missing data handling
- Swiss tool: `app/utils/sorting-values.ts` — multi-key sorting with hierarchy awareness
- papaparse docs: streaming parser, encoding detection, type inference
