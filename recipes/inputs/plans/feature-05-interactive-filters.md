# Feature Request

## Title
Interactive filters: legend toggles, time range sliders, and data dimension filters

## Problem
Charts are currently static — users cannot filter data, toggle series visibility, or narrow time ranges interactively. The Swiss tool has a full interactive filter system (`app/stores/interactive-filters.tsx`) with legend toggles, time sliders, data filters, and calculation toggles. We need equivalent functionality for Serbian data.

## Proposed behavior

### Legend filter
- Click a legend item to hide/show that series
- Visual feedback: hidden series legend items are dimmed/struck-through
- All chart types that use color-coded series support this
- State: `{ [seriesKey: string]: boolean }`

### Time range filter
- When X axis is temporal, show a range selector below the chart
- Two modes:
  - **Brush**: drag handles on a miniature overview chart to select a range (D3 brush)
  - **Dropdown**: start date / end date pickers for simpler interaction
- Selected range filters all data in the chart
- State: `{ from: Date | null, to: Date | null }`

### Time slider (animation-ready)
- Single-value slider for stepping through time periods
- Shows current time value label
- Play/pause button for auto-advance (Feature 17 will build full animation on this)
- State: `{ currentValue: Date | string | null }`

### Data dimension filters
- For each categorical dimension not mapped to an axis, show a filter control:
  - Single-select dropdown for low-cardinality dimensions (<10 values)
  - Multi-select with search for high-cardinality dimensions (10+ values)
  - Checkbox group for 3-7 values
- Filtering applies to the observations before chart rendering
- State: `{ [dimensionKey: string]: string | string[] | null }`

### Calculation toggle
- Switch between absolute values and percentages
- Percentages calculated within the grouping dimension (e.g., % of total per year)
- Only available for chart types that support it (bar, column, area — not pie, scatterplot)
- State: `{ calculation: 'absolute' | 'percent' }`

### Filter bar component
A unified filter bar that sits above or below the chart:
```
[Time range: 2020-2024] [Region: Beograd ▾] [Sector: All ▾] [% ↔ #]
```

### Filter state management
New Zustand store: `src/stores/interactive-filters.ts`
```typescript
interface InteractiveFiltersState {
  legend: Record<string, boolean>
  timeRange: { from: Date | null; to: Date | null }
  timeSlider: Date | string | null
  dataFilters: Record<string, string | string[] | null>
  calculation: 'absolute' | 'percent'
  // Actions
  toggleLegendItem: (key: string) => void
  setTimeRange: (from: Date | null, to: Date | null) => void
  setTimeSliderValue: (value: Date | string | null) => void
  setDataFilter: (dimensionKey: string, value: string | string[] | null) => void
  setCalculation: (calc: 'absolute' | 'percent') => void
  resetAll: () => void
}
```

### Integration with charts
- Filters transform the `ParsedDataset` before passing to chart renderer
- Filter pipeline: raw data → apply data filters → apply time range → apply legend → apply calculation → chart
- Memoize filtered data to avoid re-computation on unrelated state changes

## Affected areas
- `src/stores/interactive-filters.ts` (new Zustand store)
- `src/components/filters/` (new directory)
  - `FilterBar.tsx` — container for all filter controls
  - `LegendFilter.tsx` — clickable legend with toggle
  - `TimeRangeFilter.tsx` — brush or dropdown range selector
  - `TimeSlider.tsx` — single-value slider
  - `DimensionFilter.tsx` — dropdown/multi-select for categorical dimensions
  - `CalculationToggle.tsx` — absolute/percent switch
- `src/lib/data/transforms.ts` (extend with filter application)
- `src/components/charts/ChartRenderer.tsx` (integrate filter state)
- `public/locales/*/common.json` (filter labels: "All", "Select...", "From", "To", "%", "#")

## Constraints
- Filter controls must work with Serbian Cyrillic dimension values (category labels in Cyrillic)
- Time range brush requires D3 brush — keep it isolated in a ref-based component (no D3/React DOM conflict)
- Filter state should be serializable to URL params (for Feature 09 shareable URLs)
- Filters must not cause chart flicker — use transition or debounce for rapid changes
- Multi-select search must be case-insensitive and work with Cyrillic characters

## Out of scope
- Filter synchronization across multiple charts (that's Feature 07)
- Configurator UI for setting up which filters are shown (can add in Feature 04 iteration)
- Animation playback (that's Feature 17)

## Acceptance criteria
- [ ] Legend items are clickable to hide/show series in line, bar, column, area charts
- [ ] Time range brush renders below temporal charts and filters data to selected range
- [ ] Dimension filter dropdowns show available values from data
- [ ] Multi-select filter works with Cyrillic text and supports search
- [ ] Calculation toggle switches between absolute and percentage display
- [ ] Filter state is managed in Zustand store, not component-local state
- [ ] Filtered data is memoized — changing a filter doesn't re-parse the dataset
- [ ] Filter bar layout is responsive (stacks vertically on mobile)
- [ ] All filter labels translated in three locales
- [ ] Resetting all filters restores original data view

## Prior art / references
- Swiss tool: `app/stores/interactive-filters.tsx` — full filter state store
- Swiss tool: `app/configurator/interactive-filters/` — filter configurator and components
- Swiss tool: `app/charts/shared/interaction/` — tooltip, hover, selection interactions
- Swiss tool: `app/charts/shared/brush/` — D3 brush for time range selection
