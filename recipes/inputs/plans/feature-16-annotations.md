# Feature Request

## Title
Chart annotations and reference lines

## Problem
Charts show data but lack the ability to highlight notable values, add context, or mark thresholds. Analysts need annotations ("This spike is due to COVID lockdown") and reference lines ("National average: 45%") to make charts tell a story. The Swiss tool has full annotation support (`app/charts/shared/annotations.tsx`) with text labels and configurable styling.

## Proposed behavior

### Reference lines (limits)
Horizontal or vertical lines at fixed values with labels:

```typescript
interface ReferenceLine {
  id: string
  axis: 'x' | 'y'
  value: number | string | Date
  label: string
  style: 'solid' | 'dashed' | 'dotted'
  color: string
  labelPosition: 'above' | 'below' | 'left' | 'right'
}
```

Use cases:
- "National average" line on a bar chart
- "EU target" threshold on a time series
- "Policy change date" vertical line on a time axis
- "Zero line" for deviation charts

### Text annotations
Labels anchored to specific data points or regions:

```typescript
interface Annotation {
  id: string
  type: 'point' | 'range'
  // For point annotations:
  x?: number | string | Date
  y?: number
  // For range annotations:
  xStart?: number | string | Date
  xEnd?: number | string | Date
  yStart?: number
  yEnd?: number
  // Display:
  text: string
  style: 'callout' | 'badge' | 'highlight'
  color?: string
}
```

Use cases:
- "COVID-19 lockdown" annotation on a time range
- "Highest: Belgrade 1.2M" callout on a peak value
- Highlighted region showing a period of interest

### Rendering
- Reference lines: rendered as SVG lines with text labels
- Point annotations: rendered as circles with text callouts (connected by a line)
- Range annotations: rendered as shaded rectangles with text labels
- All annotations respect chart zoom/pan (move with the data, not fixed on screen)

### Annotation editor (in configurator)
Add an "Annotations" section to the customize step (Feature 04):
- "Add reference line" button:
  - Select axis (X or Y)
  - Enter value (with validation against data range)
  - Enter label text
  - Select style and color
- "Add annotation" button:
  - Select type (point or range)
  - Enter position values
  - Enter text
  - Select style
- List of current annotations with edit/delete buttons
- Live preview updates as annotations are added

### Annotation storage
Annotations are part of the ChartConfig (Feature 03):
```typescript
// In chart-config.ts
interface ChartConfig {
  // ... existing fields
  referenceLines: ReferenceLine[]
  annotations: Annotation[]
}
```

### Chart type support
| Chart type | Reference lines | Point annotations | Range annotations |
|-----------|----------------|-------------------|-------------------|
| Line | Y and X | Yes | Yes (time ranges) |
| Bar/Column | Y | Yes | No |
| Area | Y and X | Yes | Yes |
| Scatterplot | Y and X | Yes | Yes |
| Pie | No | No | No |
| Table | No | No | No |
| Map | No | No (use tooltips) | No |
| Combo | Y and X | Yes | Yes |

## Affected areas
- `src/components/charts/shared/` (new files)
  - `ReferenceLine.tsx` — SVG reference line with label
  - `Annotation.tsx` — point and range annotation rendering
  - `AnnotationLayer.tsx` — container that positions annotations relative to chart area
- `src/components/configurator/AnnotationEditor.tsx` (new)
- `src/types/chart-config.ts` (extend with referenceLines and annotations arrays)
- `src/components/charts/line/`, `bar/`, `column/`, `area/`, `scatterplot/`, `combo/` (integrate annotation layer)
- `public/locales/*/common.json` (labels: "Add reference line", "Add annotation", "Value", "Label", "Style")

## Constraints
- Annotations must not obscure data — use semi-transparent backgrounds for range highlights
- Text labels must handle Serbian Cyrillic (font sizing, text width calculation)
- Annotation positions must be valid within the data range — validate on input
- Maximum 10 reference lines and 10 annotations per chart (UX limit)
- Annotations must survive chart resize (positioned by data coordinates, not pixel coordinates)
- Annotations must be included in PNG export (Feature 08)

## Out of scope
- Interactive annotation creation by clicking on the chart (drag to annotate)
- Annotation collaboration (comments from multiple users)
- Conditional annotations (show only when filter matches)

## Acceptance criteria
- [ ] Horizontal reference line renders at correct Y value with label
- [ ] Vertical reference line renders at correct X value with label
- [ ] Reference line styles work: solid, dashed, dotted
- [ ] Point annotation renders callout at correct data point
- [ ] Range annotation renders shaded region over correct data range
- [ ] Annotation editor allows adding/editing/removing reference lines and annotations
- [ ] Annotations render correctly after chart resize
- [ ] Annotations appear in PNG export
- [ ] Cyrillic text in annotation labels renders correctly
- [ ] All annotation editor labels translated in three locales

## Prior art / references
- Swiss tool: `app/charts/shared/annotations.tsx` — annotation rendering
- Swiss tool: `app/charts/shared/annotation-*.tsx` — annotation sub-components
- Swiss tool: `app/charts/shared/limits/` — reference line implementation
- Swiss tool: `app/configurator/components/annotator-options.tsx` — annotation editor UI
