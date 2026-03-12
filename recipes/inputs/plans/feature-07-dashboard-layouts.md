# Feature Request

## Title
Multi-chart dashboard layouts with shared filters and grid positioning

## Problem
Individual charts are useful, but real analytical value comes from dashboards — multiple charts showing different facets of the same data with synchronized filters. The Swiss tool supports multi-chart layouts with shared interactive filters. We need dashboard capability for Serbian data analysis.

## Proposed behavior

### Dashboard structure
A dashboard is a collection of charts arranged in a grid layout:

```typescript
interface DashboardConfig {
  id: string
  title: string
  description?: string
  layout: LayoutItem[]
  charts: Record<string, ChartConfig>  // keyed by chart ID
  sharedFilters: SharedFilterConfig
}

interface LayoutItem {
  chartId: string
  x: number    // grid column (0-11)
  y: number    // grid row
  w: number    // width in grid columns (1-12)
  h: number    // height in grid rows
}

interface SharedFilterConfig {
  enabled: boolean
  syncDimensions: string[]  // dimension keys shared across charts
  syncTimeRange: boolean
}
```

### Grid layout
- 12-column grid system (matches Tailwind's grid)
- Charts can be positioned and resized by dragging (react-grid-layout — needs to be added as dependency)
- Minimum chart size: 4 columns wide, 2 rows tall
- Default layouts: single (1 chart), side-by-side (2 charts), 2x2 grid, 1+2 (hero + two small)
- Responsive: on mobile, all charts stack vertically at full width

### Dashboard editor mode
- Toggle "Edit layout" button
- In edit mode: charts show drag handles and resize handles
- Add chart button opens a simplified configurator (reuse Feature 04 components)
- Remove chart button (with confirmation)
- Reorder by dragging
- Save layout (configuration state, persisted via Feature 13 or URL/sessionStorage)

### Shared filter synchronization
When shared filters are enabled:
- A single filter bar appears at dashboard level (not per chart)
- Changing a shared dimension filter updates all charts that use that dimension
- Time range filter applies to all charts with temporal X axes
- Legend toggles are per-chart (not shared)
- Charts that don't have the shared dimension are unaffected

### Dashboard page routing
- `/dashboard/new` — create new dashboard
- `/dashboard/[id]` — view/edit saved dashboard (Feature 13)
- `/dashboard/[id]/view` — read-only view (for sharing)

### Predefined dashboard templates
Provide starter templates for common Serbian data analysis:
- **Regional comparison**: Map + bar chart + table, filtered by region
- **Time series analysis**: Line chart + area chart, shared time range
- **Demographic overview**: Population pyramid + pie chart + table
- **Economic indicators**: Combo chart + scatterplot, dual datasets

## Affected areas
- `src/app/dashboard/` (new route group)
- `src/components/dashboard/` (new directory)
  - `DashboardShell.tsx` — grid container, edit mode toggle
  - `DashboardGrid.tsx` — react-grid-layout wrapper
  - `DashboardFilterBar.tsx` — shared filter controls
  - `DashboardChartCard.tsx` — individual chart within grid
  - `DashboardTemplates.tsx` — template selector
  - `AddChartDialog.tsx` — simplified chart creation within dashboard
- `src/stores/dashboard.ts` (new Zustand store)
- `src/types/dashboard.ts` (new: DashboardConfig, LayoutItem types)
- `package.json` (add react-grid-layout dependency)
- `public/locales/*/common.json` (dashboard labels, template names)

## Constraints
- Maximum 6 charts per dashboard (performance and usability)
- react-grid-layout requires specific CSS — must integrate with Tailwind without conflicts
- Shared filters only work on dimensions with identical keys across charts
- Dashboard state can get large — careful with URL encoding (may need server persistence earlier)
- Must handle the case where one chart's data is loading while others are ready
- Mobile: grid layout collapses to single column, shared filters remain at top

## Out of scope
- Dashboard persistence to database (that's Feature 13)
- Real-time data refresh
- Dashboard export as PDF
- Collaborative editing

## Acceptance criteria
- [ ] Dashboard page renders a 12-column grid with placeable chart cards
- [ ] Charts can be dragged and resized in edit mode
- [ ] "Add chart" opens a chart creation flow and places the new chart in the grid
- [ ] Shared dimension filter updates all applicable charts simultaneously
- [ ] Shared time range filter works across temporal charts
- [ ] At least 2 predefined templates are available (regional comparison, time series)
- [ ] Dashboard collapses to single column on mobile
- [ ] Dashboard state (layout + chart configs) is serializable
- [ ] All dashboard UI translated in three locales
- [ ] Loading states are handled per-chart (one slow chart doesn't block the dashboard)

## Prior art / references
- Swiss tool: `app/configurator/components/layout-configurator.tsx` — grid layout editing
- Swiss tool: `app/configurator/configurator-state/` — multi-chart state management (chartConfigs array, activeChartKey)
- Swiss tool: `app/stores/interactive-filters.tsx` — filter synchronization across charts
- react-grid-layout: draggable/resizable grid layout library
