# Feature Request

## Title
Chart configurator UI for visual chart creation and editing

## Problem
Users need a visual interface to create charts from datasets — selecting chart type, mapping dimensions to axes, choosing colors, and setting options. Currently there's a `ChartBuilder` component but it's basic. The Swiss tool has a full multi-step configurator (`app/configurator/`) with state machine, form fields, and live preview. We need an equivalent adapted for our stack and data sources.

## Proposed behavior

### Configurator flow (step-by-step)

**Step 1: Select dataset**
- Arrives from dataset browser (Feature 01) with dataset pre-selected, OR
- Opens dataset picker inline (search and select)
- Shows dataset metadata: title, description, organization, resource count
- User selects which resource (CSV/JSON) to visualize
- System loads and parses the resource (Feature 02 pipeline), shows preview table

**Step 2: Select chart type**
- Grid of available chart types with icons and labels
- Chart types that don't fit the data are disabled with explanation (e.g., "Pie chart requires exactly one measure" or "Scatterplot requires at least two measures")
- Selecting a type applies default dimension/measure mappings
- Live preview updates as user selects

**Step 3: Configure dimensions and measures**
- Drag-and-drop or dropdown-based mapping:
  - X axis → select dimension
  - Y axis → select measure(s)
  - Color → select dimension (optional)
  - Segment → select dimension (optional, for stacked charts)
- Each mapping shows the column's data type and sample values
- Invalid mappings show inline validation errors
- Live preview updates on every change

**Step 4: Customize appearance**
- Chart title (auto-filled from dataset title, editable)
- Chart description (optional, markdown)
- Color palette selector (from built-in palettes)
- Legend position (top, bottom, right, none)
- Axis labels and formatting
- Chart-type-specific options (per Feature 03 config schemas):
  - Line: dots, curve type, stroke width
  - Bar/Column: grouped vs. stacked
  - Pie: donut mode, label display
  - etc.
- Source attribution line (auto-filled: "Извор: data.gov.rs — {dataset title}")

**Step 5: Preview and save/export**
- Full-size chart preview
- Actions: Download PNG, Download data (CSV), Copy embed code, Copy share URL
- (If persistence is built — Feature 13: Save to database)

### Configurator state management
Use Zustand store (already in project) for configurator state:

```typescript
interface ConfiguratorState {
  step: 'dataset' | 'chartType' | 'mapping' | 'customize' | 'preview'
  datasetId: string | null
  resourceId: string | null
  parsedData: ParsedDataset | null
  chartType: ChartType | null
  config: Partial<ChartConfig>
  // Actions
  setDataset: (id: string, resourceId: string) => void
  setChartType: (type: ChartType) => void
  updateConfig: (partial: Partial<ChartConfig>) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}
```

### URL routing
- `/create` — start from scratch (step 1)
- `/create?dataset={id}&resource={rid}` — pre-selected dataset (start at step 2)
- `/create/{configId}` — edit existing saved config (Feature 13)
- Each step updates URL params so back button works

### Responsive layout
- Desktop: sidebar configurator panel (left) + live preview (right), 40/60 split
- Mobile: full-width steps, preview accessible via tab/toggle

## Affected areas
- `src/app/create/` (new route group: page.tsx, layout.tsx)
- `src/components/configurator/` (new directory)
  - `ConfiguratorShell.tsx` — step container, navigation, layout
  - `DatasetStep.tsx` — dataset/resource selection
  - `ChartTypeStep.tsx` — chart type grid
  - `MappingStep.tsx` — dimension/measure assignment
  - `CustomizeStep.tsx` — appearance options
  - `PreviewStep.tsx` — final preview with actions
  - `ConfiguratorSidebar.tsx` — step indicator
- `src/stores/configurator.ts` (new Zustand store)
- `src/components/charts/ChartRenderer.tsx` (must accept partial configs during configuration)
- `public/locales/*/common.json` (configurator labels, step names, validation messages)

## Constraints
- Must work with the data pipeline from Feature 02 (ParsedDataset type)
- Must use chart types from Feature 03 registry
- Live preview must not block the UI — debounce config changes, use React.memo aggressively
- Configurator state must survive page refresh (use URL params or sessionStorage)
- All form labels and validation messages translated in three locales
- The configurator must be usable without authentication (save/persist requires Feature 13)

## Out of scope
- Multi-chart dashboards (that's Feature 07)
- Interactive filter configuration (that's Feature 05)
- Database persistence (that's Feature 13)
- Annotation editing (that's Feature 16)

## Acceptance criteria
- [ ] 5-step configurator flow works end-to-end: select dataset → chart type → mapping → customize → preview
- [ ] Chart type grid disables types incompatible with the selected data
- [ ] Dimension/measure mapping validates and shows errors for invalid assignments
- [ ] Live preview updates within 200ms of config change
- [ ] URL params encode configurator state (back button works between steps)
- [ ] Desktop layout: sidebar + preview. Mobile: full-width steps.
- [ ] All UI text translated in three locales
- [ ] Configurator handles datasets with 1 dimension + 1 measure (minimum) up to 10+ columns
- [ ] Source attribution auto-populated from dataset metadata

## Prior art / references
- Swiss tool: `app/configurator/` — full configurator with state machine
- Swiss tool: `app/configurator/components/chart-configurator.tsx` — main configurator UI
- Swiss tool: `app/configurator/configurator-state/` — Zustand + useReducer state management
- Swiss tool: `app/configurator/components/block-options-selector.tsx` — chart type selector
