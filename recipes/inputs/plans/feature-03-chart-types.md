# Feature Request

## Title
Expanded chart type system with 9 chart types and consistent rendering architecture

## Problem
The current `ChartRenderer` dispatches to chart libraries but lacks the structured chart type system needed for a real visualization tool. The Swiss tool implements 9 distinct chart types (area, bar, column, line, pie, scatterplot, table, map, combo) each with consistent state management, rendering, and configuration interfaces. We need to build an equivalent system that uses our existing libraries (Recharts, Chart.js, D3, Plotly) strategically.

## Proposed behavior

### Chart type registry (`src/lib/charts/registry.ts`)
A central registry mapping chart types to their renderers, default configs, and capabilities:

```typescript
type ChartType = 'line' | 'bar' | 'column' | 'area' | 'pie' | 'scatterplot' | 'table' | 'map' | 'combo'

interface ChartTypeDefinition {
  type: ChartType
  label: TranslationKey  // e.g., 'charts.types.line'
  icon: ComponentType
  renderer: ComponentType<ChartProps>
  defaultConfig: Partial<ChartConfig>
  capabilities: {
    supportsStacking: boolean
    supportsGrouping: boolean
    supportsAnimation: boolean
    requiresGeo: boolean
    minDimensions: number
    minMeasures: number
    maxMeasures: number
  }
}
```

### Library allocation (per architecture-notes.md)
| Chart type | Primary library | Reason |
|-----------|----------------|--------|
| Line | Recharts | Best responsive line charts, built-in tooltip/legend |
| Bar (horizontal) | Recharts | Consistent with line, good grouped/stacked support |
| Column (vertical) | Recharts | Same as bar, vertical orientation |
| Area | Recharts | Good area/stacked area, consistent with line |
| Pie | Recharts | Simple, responsive, good animations |
| Scatterplot | D3 | Custom interactions, brush selection, density |
| Table | Native (react-table pattern) | Virtualized rows, sorting, custom cells |
| Map | Mapbox GL / Leaflet + D3-geo | Existing map stack (Feature 11-12 detail) |
| Combo | Recharts (ComposedChart) | Line + bar on same axes |

### Per-chart architecture
Each chart type gets a folder under `src/components/charts/[type]/`:
```
src/components/charts/line/
  LineChart.tsx          # Rendering component
  LineChartConfig.ts     # Default config and Zod schema
  index.ts              # Re-exports
```

### Common chart props interface
```typescript
interface ChartProps {
  data: ParsedDataset
  config: ChartConfig
  dimensions: { x: string; color?: string; segment?: string }
  measures: { y: string; y2?: string }
  interactive?: boolean
  width?: number
  height?: number
  locale: Locale
}
```

### Chart configuration schema (`src/types/chart-config.ts`)
Zod schemas for each chart type's configuration:
- Common fields: title, description, dimensions mapping, measures mapping, color palette, legend position
- Line-specific: showDots, strokeWidth, curveType (linear, monotone, step)
- Bar/Column-specific: orientation, grouping (grouped, stacked, percent-stacked)
- Area-specific: fillOpacity, stacking, imputation strategy
- Pie-specific: innerRadius (donut), showLabels, showPercentages
- Scatterplot-specific: dotSize mapping, opacity, jitter
- Table-specific: columns visible, sort column, page size
- Combo-specific: which measures are lines vs. columns, dual Y-axis

### Updated ChartRenderer
Refactor existing `ChartRenderer.tsx` to:
1. Look up chart type in registry
2. Validate config against Zod schema
3. Transform `ParsedDataset` into chart-specific data format
4. Render the appropriate chart component
5. Render shared elements: title, legend, source attribution

### Responsive behavior
- Charts must resize with container (use `ResponsiveContainer` for Recharts, ResizeObserver for D3)
- Below 480px width: simplified mobile rendering (fewer ticks, rotated labels, collapsible legend)
- Aspect ratio maintained unless explicitly overridden

## Affected areas
- `src/components/charts/` (refactor: new subdirectories per chart type)
- `src/components/charts/ChartRenderer.tsx` (refactor: use registry)
- `src/lib/charts/registry.ts` (new)
- `src/types/chart-config.ts` (new: Zod schemas per chart type)
- `src/components/charts/shared/` (new: ChartTitle, ChartLegend, ChartTooltip, SourceAttribution)
- `public/locales/*/common.json` (chart type labels, axis labels, tooltip text)

## Constraints
- Do NOT add new chart libraries. Use Recharts, Chart.js, D3, Plotly as allocated above.
- Each chart component must render correctly with Serbian Cyrillic text (axis labels, tooltips, legends)
- Number formatting must use locale-aware formatters (Serbian uses comma for decimals)
- Date formatting on time axes must respect locale (Serbian date format: DD.MM.YYYY.)
- Charts must be printable (no interactive-only elements in print view)

## Out of scope
- Chart configurator UI (that's Feature 04)
- Interactive filters (that's Feature 05)
- Map charts (that's Features 11-12)
- Animation (that's Feature 17)
- Color palette customization (that's Feature 15)

## Acceptance criteria
- [ ] 8 chart types implemented (line, bar, column, area, pie, scatterplot, table, combo — map deferred)
- [ ] Each chart type has its own folder with renderer, config schema, and re-exports
- [ ] `ChartRenderer` dispatches to correct chart type from config
- [ ] All charts render Serbian Cyrillic text correctly in labels and tooltips
- [ ] All charts are responsive (test at 320px, 768px, 1280px widths)
- [ ] Zod schemas validate and reject malformed configs with useful error messages
- [ ] Charts handle empty data, single-row data, and null values without crashing
- [ ] Locale-aware number and date formatting on all axes and tooltips
- [ ] At least one unit test per chart type verifying it renders with valid data

## Prior art / references
- Swiss tool: `app/charts/` — each chart type in its own directory
- Swiss tool: `app/charts/shared/` — shared axis, legend, tooltip, interaction components
- Swiss tool: `app/config-types.ts` — 1536-line io-ts schema for all chart configs
- Swiss tool: `app/charts/shared/chart-state.ts` — common chart state interface
