# Feature Request

## Title
Multi-dataset support with join-by-dimension capability

## Problem
Many useful visualizations compare data across multiple datasets (e.g., population vs. GDP per municipality, or education spending vs. employment rate by region). Currently the system only supports one dataset per chart. The Swiss tool supports multi-dataset joining (`app/graphql/join.ts`) with auto-detected join dimensions. We need this for Serbian data.

## Proposed behavior

### Add dataset flow
From the chart configurator (Feature 04), user can:
1. Click "Add dataset" to open a dataset drawer/modal
2. Search and select a second (or third) dataset from data.gov.rs
3. System auto-detects joinable dimensions between datasets:
   - Match by column name similarity (fuzzy string matching)
   - Match by value overlap (if >70% of values in one column exist in another)
   - Common join dimensions in Serbian data: municipality code, region name, year, administrative unit ID
4. User confirms or overrides the join dimension
5. System produces a merged `ParsedDataset` with observations joined on the selected dimension

### Join logic (`src/lib/data/join.ts`)
```typescript
interface JoinConfig {
  primary: { datasetId: string; resourceId: string; joinKey: string }
  secondary: { datasetId: string; resourceId: string; joinKey: string }
  joinType: 'inner' | 'left'  // inner = only matching rows, left = keep all primary
}

function joinDatasets(
  primary: ParsedDataset,
  secondary: ParsedDataset,
  config: JoinConfig
): ParsedDataset
```

Join rules:
- Inner join by default (only rows present in both datasets)
- Columns from secondary dataset are prefixed with dataset name to avoid collisions
- If join key values need normalization (e.g., "Beograd" vs "BEOGRAD" vs "Београд"), apply case-insensitive + Cyrillic-Latin normalization
- Preserve dimension/measure metadata from both datasets

### Join dimension detection (`src/lib/data/infer-join.ts`)
```typescript
function inferJoinDimensions(
  primary: ParsedDataset,
  secondary: ParsedDataset
): JoinSuggestion[]

interface JoinSuggestion {
  primaryKey: string
  secondaryKey: string
  confidence: number  // 0-1
  matchType: 'exact-name' | 'fuzzy-name' | 'value-overlap'
  overlapPercent: number
}
```

### UI components
- `AddDatasetDrawer.tsx` — slide-out panel with dataset search (reuse browse components)
- `JoinPreview.tsx` — shows matched columns, overlap stats, and sample joined rows
- `DatasetBadges.tsx` — shows which datasets are active in the configurator

### Configurator integration
- Configurator state (Feature 04) extends to support `datasets: DatasetReference[]`
- Dimension/measure mapping step shows columns from all joined datasets
- Color coding or badges indicate which dataset each column comes from

## Affected areas
- `src/lib/data/join.ts` (new)
- `src/lib/data/infer-join.ts` (new)
- `src/components/configurator/AddDatasetDrawer.tsx` (new)
- `src/components/configurator/JoinPreview.tsx` (new)
- `src/components/configurator/DatasetBadges.tsx` (new)
- `src/stores/configurator.ts` (extend for multi-dataset)
- `src/types/chart-config.ts` (extend config schema for multiple datasets)
- `src/types/observation.ts` (extend ParsedDataset with source tracking)
- `public/locales/*/common.json` (labels: "Add dataset", "Join by", "No matching columns", etc.)

## Constraints
- Maximum 3 datasets per chart (performance and UX complexity bound)
- Join operation must complete in under 1 second for 50k combined rows
- Serbian administrative data uses inconsistent identifiers across agencies — the Cyrillic/Latin normalization is critical
- Some data.gov.rs datasets use different granularity for the same concept (municipality vs. district vs. region) — warn the user if join produces low overlap (<20%)
- Joined data must preserve the source dataset for each measure (for attribution)

## Out of scope
- Database-level joins (all joins happen client-side or in API routes on parsed data)
- More than 3 datasets
- Cross-format joins (e.g., CSV + API endpoint) — only resource files for now

## Acceptance criteria
- [ ] User can add a second dataset from the configurator
- [ ] System suggests join dimensions with confidence scores
- [ ] Join preview shows sample rows and overlap percentage
- [ ] Inner join produces correct merged observations
- [ ] Cyrillic-Latin normalization matches "Београд" to "Beograd"
- [ ] Case-insensitive join matching works
- [ ] Joined dataset's measures are prefixed to avoid name collisions
- [ ] Configurator mapping step shows columns from all datasets with source indicators
- [ ] Warning shown when join overlap is below 20%
- [ ] Performance: join of two 10k-row datasets completes in under 500ms
- [ ] All UI text translated in three locales

## Prior art / references
- Swiss tool: `app/graphql/join.ts` — multi-dataset joining logic
- Swiss tool: `app/configurator/components/add-dataset-drawer/` — UI for adding datasets
- Swiss tool: `app/configurator/components/add-dataset-drawer/infer-join-by.tsx` — auto-detect joinable dimensions
