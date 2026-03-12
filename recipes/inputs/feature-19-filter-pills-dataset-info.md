# Feature Request

## Title
Filter Pills and Dataset Info Footer - Visual filter state and data transparency

## Problem
Charts currently don't show the active filter state at a glance. Users cannot quickly see what filters are applied or when the dataset was last updated. The Swiss visualization tool (visualize.admin.ch) displays filter pills below charts and shows dataset metadata (name, last update timestamp) in the preview, improving transparency and user awareness.

## Proposed behavior

### Filter Pills Component
- Display active filters as clickable "pills" below the chart preview
- Format: `"FilterName: Value"` for each active filter
- Pills should be styled as rounded badges with muted colors
- Clicking a pill (future enhancement) could open a filter modification modal
- When no filters are active, either hide the component or show "No filters applied"

Example display:
```
Filters: Answer: a) Every day, Sex: All, Age group: 10–13-year-olds, Linguistic region: All
```

### Dataset Info Footer Component
- Display dataset name with optional link to dataset details
- Display last update timestamp formatted according to locale
- Muted styling to not distract from chart content
- Position at bottom of preview area

Example display:
```
Dataset: MenuCH-Kids: Questionnaire, Latest data update: 12.03.2026 14:30
```

---

## Detailed Implementation

### File 1: `src/components/charts/shared/FilterPills.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

export interface FilterPill {
  key: string
  label: string
  value: string
}

export interface FilterPillsProps {
  pills: FilterPill[]
  onPillClick?: (key: string) => void
  labels?: {
    filters?: string
    noFilters?: string
  }
  className?: string
}

function FilterPillsComponent({ pills, onPillClick, labels, className }: FilterPillsProps) {
  const l = {
    filters: 'Filters',
    noFilters: 'No filters applied',
    ...labels,
  }

  if (pills.length === 0) {
    return (
      <div className={cn('text-sm text-slate-500', className)}>
        {l.noFilters}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-slate-700">{l.filters}:</span>
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => onPillClick?.(pill.key)}
          className={cn(
            'inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700',
            'transition hover:bg-slate-200',
            onPillClick && 'cursor-pointer'
          )}
        >
          <span className="font-medium">{pill.label}:</span>
          <span>{pill.value}</span>
        </button>
      ))}
    </div>
  )
}

export const FilterPills = memo(FilterPillsComponent)
```

### File 2: `src/components/charts/shared/DatasetInfoFooter.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { format, parseISO } from 'date-fns'
import { sr, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils/cn'

export interface DatasetInfoFooterProps {
  datasetName: string
  datasetUrl?: string
  lastUpdated?: Date | string | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    dataset?: string
    latestUpdate?: string
  }
  className?: string
}

function DatasetInfoFooterComponent({
  datasetName,
  datasetUrl,
  lastUpdated,
  locale,
  labels,
  className,
}: DatasetInfoFooterProps) {
  const l = {
    dataset: 'Dataset',
    latestUpdate: 'Latest data update',
    ...labels,
  }

  // Get date-fns locale
  const dateLocale = locale === 'en' ? enUS : sr

  // Format date
  const formattedDate = (() => {
    if (!lastUpdated) return null
    const date = typeof lastUpdated === 'string' ? parseISO(lastUpdated) : lastUpdated
    return format(date, 'dd.MM.yyyy HH:mm', { locale: dateLocale })
  })()

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500', className)}>
      <span>
        {l.dataset}:{' '}
        {datasetUrl ? (
          <a
            href={datasetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gov-primary hover:underline"
          >
            {datasetName}
          </a>
        ) : (
          <span className="font-medium">{datasetName}</span>
        )}
      </span>
      {formattedDate && (
        <span>
          {l.latestUpdate}: {formattedDate}
        </span>
      )}
    </div>
  )
}

export const DatasetInfoFooter = memo(DatasetInfoFooterComponent)
```

### File 3: `src/components/charts/shared/FilterPillsFromState.tsx` (new)

Utility component that extracts filter pills from the interactive filters state:

```typescript
'use client'

import { useMemo } from 'react'
import { FilterPills, type FilterPill } from './FilterPills'
import type { InteractiveFiltersState } from '@/types'

export interface FilterPillsFromStateProps {
  filterState: InteractiveFiltersState | undefined
  dimensionLabels?: Record<string, string>
  valueLabels?: Record<string, Record<string, string>>
  onPillClick?: (key: string) => void
  labels?: {
    filters?: string
    noFilters?: string
    timeRange?: string
    calculation?: string
    absolute?: string
    percent?: string
  }
  className?: string
}

export function FilterPillsFromState({
  filterState,
  dimensionLabels = {},
  valueLabels = {},
  onPillClick,
  labels,
  className,
}: FilterPillsFromStateProps) {
  const pills = useMemo((): FilterPill[] => {
    if (!filterState) return []

    const result: FilterPill[] = []

    // Add time range filter
    if (filterState.timeRange.from || filterState.timeRange.to) {
      const from = filterState.timeRange.from || '...'
      const to = filterState.timeRange.to || '...'
      result.push({
        key: 'timeRange',
        label: labels?.timeRange || 'Time',
        value: `${from} – ${to}`,
      })
    }

    // Add data filters
    for (const [key, value] of Object.entries(filterState.dataFilters)) {
      if (value !== null && value !== undefined) {
        const dimensionLabel = dimensionLabels[key] || key
        const displayValue = Array.isArray(value)
          ? value.map(v => valueLabels[key]?.[v] || v).join(', ')
          : valueLabels[key]?.[value] || value

        result.push({
          key,
          label: dimensionLabel,
          value: displayValue,
        })
      }
    }

    // Add calculation if not default
    if (filterState.calculation === 'percent') {
      result.push({
        key: 'calculation',
        label: labels?.calculation || 'Calculation',
        value: labels?.percent || 'Percent',
      })
    }

    return result
  }, [filterState, dimensionLabels, valueLabels, labels])

  return (
    <FilterPills
      pills={pills}
      onPillClick={onPillClick}
      labels={labels}
      className={className}
    />
  )
}
```

### File 4: Modify `src/components/configurator/PreviewStep.tsx`

Add imports and components to the preview step:

```typescript
// Add to imports
import { FilterPillsFromState } from '@/components/charts/shared/FilterPillsFromState'
import { DatasetInfoFooter } from '@/components/charts/shared/DatasetInfoFooter'
import { useInteractiveFiltersStore } from '@/stores/interactive-filters'

// Add inside the component, after existing hooks
const interactiveFilters = useInteractiveFiltersStore(
  state => state.charts['configurator-preview']
)

// Add before the "Source attribution" section at the bottom:
{/* Filter Pills */}
{interactiveFilters && (
  <FilterPillsFromState
    filterState={interactiveFilters}
    dimensionLabels={parsedDataset?.dimensionLabels}
    valueLabels={parsedDataset?.valueLabels}
    labels={{
      filters: l.filters,
      noFilters: l.noFilters,
      timeRange: l.timeRange,
    }}
    className="py-2"
  />
)}

{/* Dataset Info Footer */}
{datasetTitle && (
  <DatasetInfoFooter
    datasetName={datasetTitle}
    datasetUrl={datasetId ? `/browse/${datasetId}` : undefined}
    lastUpdated={parsedDataset?.lastModified}
    locale={_locale}
    labels={{
      dataset: l.dataset,
      latestUpdate: l.latestUpdate,
    }}
    className="pt-2 border-t border-slate-100"
  />
)}
```

### File 5: Add translations to locale files

**`src/lib/i18n/locales/en.json`** (add these keys):
```json
{
  "filters": "Filters",
  "noFilters": "No filters applied",
  "timeRange": "Time range",
  "calculation": "Calculation",
  "absolute": "Absolute",
  "percent": "Percent",
  "dataset": "Dataset",
  "latestUpdate": "Latest data update"
}
```

**`src/lib/i18n/locales/sr-Cyrl.json`**:
```json
{
  "filters": "Филтери",
  "noFilters": "Нема примењених филтера",
  "timeRange": "Временски опсег",
  "calculation": "Прорачун",
  "absolute": "Апсолутно",
  "percent": "Проценат",
  "dataset": "Скуп података",
  "latestUpdate": "Последње ажурирање"
}
```

**`src/lib/i18n/locales/sr-Latn.json`**:
```json
{
  "filters": "Filteri",
  "noFilters": "Nema primenjenih filtera",
  "timeRange": "Vremenski opseg",
  "calculation": "Proračun",
  "absolute": "Apsolutno",
  "percent": "Procenat",
  "dataset": "Skup podataka",
  "latestUpdate": "Poslednje ažuriranje"
}
```

### File 6: Update `src/types/observation.ts` or `ParsedDataset` type

Ensure `ParsedDataset` includes optional metadata fields:

```typescript
export interface ParsedDataset {
  // ... existing fields
  dimensionLabels?: Record<string, string>
  valueLabels?: Record<string, Record<string, string>>
  lastModified?: string | null
}
```

---

## Affected areas
- `src/components/charts/shared/FilterPills.tsx` (new)
- `src/components/charts/shared/DatasetInfoFooter.tsx` (new)
- `src/components/charts/shared/FilterPillsFromState.tsx` (new)
- `src/components/configurator/PreviewStep.tsx` (modify)
- `src/lib/i18n/locales/en.json` (add translations)
- `src/lib/i18n/locales/sr-Cyrl.json` (add translations)
- `src/lib/i18n/locales/sr-Latn.json` (add translations)
- `src/types/observation.ts` or relevant types file (ensure metadata types)

## Constraints
- Must support all three locales (sr-Cyrl, sr-Latn, en)
- Date formatting must respect locale conventions (use date-fns with sr locale)
- Pills must wrap responsively on mobile (flex-wrap)
- Click handlers should be prepared for future modal integration
- Use existing Tailwind gov-* color classes for styling
- Use `memo` for performance on re-renders

## Out of scope
- Click-to-modify filter functionality (future enhancement)
- Filter pill removal via X button (future enhancement)
- Multiple charts per visualization (separate feature)
- Legend filter pills (hidden series) - can be added later

## Acceptance criteria
- [ ] FilterPills component renders active filters as pills
- [ ] FilterPills shows format "FilterName: Value" for each filter
- [ ] FilterPills handles empty filter state gracefully
- [ ] FilterPillsFromState extracts filters from InteractiveFiltersState
- [ ] DatasetInfoFooter shows dataset name below chart
- [ ] DatasetInfoFooter shows formatted last update timestamp
- [ ] Dataset name links to dataset details (if URL provided)
- [ ] All new text is translated in all three locales
- [ ] Date formatting respects locale (e.g., 12.03.2026 for sr, 3/12/2026 for en)
- [ ] Components are responsive and wrap on mobile
- [ ] Styling uses existing slate-* and gov-* color palette
- [ ] Components are memoized for performance

## Prior art / references
- Swiss tool: Chart editor preview panel - filter pills display
- Swiss tool: Dataset info footer with timestamp
- visualize.admin.ch chart editor: `Filters: Answer: a) Every day, Sex: All...`
- visualize.admin.ch: `Dataset: MenuCH-Kids: Questionnaire, Latest data update: 12.11.2025 16:40`
- Existing store: `src/stores/interactive-filters.ts` - InteractiveFiltersState
- Existing types: `src/types/interactive-filters.ts`
