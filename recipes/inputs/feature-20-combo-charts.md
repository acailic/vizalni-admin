# Feature Request

## Title
Combo Charts - Line + Bar with Dual Y-Axis

## Problem
Users cannot visualize two metrics with different scales on the same chart. For example, showing revenue (millions) alongside growth rate (percentage) requires two separate charts. The Swiss visualization tool supports combo charts that combine line and bar series with independent left and right Y-axes.

## Proposed behavior

### Combo Chart Types
1. **Line + Column** - Bar series on left axis, line series on right axis
2. **Dual Line** - Two line series with separate Y-axes
3. **Multi-Line Combo** - Multiple line series on one axis + bar on the other

### Configuration Options
- Select which series use left vs right Y-axis
- Independent axis titles and formatting
- Color assignment per series
- Legend shows axis association

### UI Requirements
- New "combo" chart type in chart type selector
- Additional "Y Axis (Right)" field selector in configurator
- Toggle to assign series to left/right axis
- Synced tooltips across both chart types

---

## Detailed Implementation

### File 1: Update `src/types/chart-config.ts`

Add combo chart type and fields:

```typescript
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'map' | 'table' | 'combo';

export interface ComboChartConfig extends BaseChartConfig {
  type: 'combo';
  fields: {
    x: ChartField;
    y: ChartField; // Left axis (bar by default)
    yRight?: ChartField; // Right axis (line by default)
    series?: ChartField; // For multiple series
    seriesRight?: ChartField; // Series for right axis
  };
  comboType: 'bar-line' | 'line-line' | 'multi-line';
  axes: {
    left: AxisConfig;
    right: AxisConfig;
  };
}
```

### File 2: `src/components/charts/combo/ComboChart.tsx` (new)

```typescript
'use client'

import { memo, useMemo } from 'react'
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale'
import { max, min } from 'd3-array'
import { Bars } from './Bars'
import { Lines } from './Lines'
import { AxisLeft, AxisRight, AxisBottom } from '../shared/Axis'
import { ChartContainer } from '../shared/ChartContainer'
import type { ChartRendererDataRow } from '@/types'

interface ComboChartProps {
  data: ChartRendererDataRow[]
  config: ComboChartConfig
  dimensions: { width: number; height: number }
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
}

function ComboChartComponent({ data, config, dimensions, locale }: ComboChartProps) {
  const { width, height } = dimensions
  const margins = { top: 30, right: 60, bottom: 40, left: 50 }
  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  // Create scales
  const xScale = useMemo(() => {
    // Implementation depends on x field type
    return scaleBand()
      .domain(data.map(d => d[config.fields.x.field] as string))
      .range([0, innerWidth])
      .padding(0.1)
  }, [data, config.fields.x.field, innerWidth])

  const yLeftScale = useMemo(() => {
    const values = data.map(d => d[config.fields.y.field] as number)
    return scaleLinear()
      .domain([0, max(values) ?? 0])
      .range([innerHeight, 0])
      .nice()
  }, [data, config.fields.y.field, innerHeight])

  const yRightScale = useMemo(() => {
    if (!config.fields.yRight) return null
    const values = data.map(d => d[config.fields.yRight!.field] as number)
    return scaleLinear()
      .domain([0, max(values) ?? 0])
      .range([innerHeight, 0])
      .nice()
  }, [data, config.fields.yRight, innerHeight])

  return (
    <ChartContainer>
      <svg width={width} height={height}>
        <g transform={`translate(${margins.left},${margins.top})`}>
          {/* Bars (left axis) */}
          <Bars
            data={data}
            xScale={xScale}
            yScale={yLeftScale}
            yField={config.fields.y.field}
            xField={config.fields.x.field}
            height={innerHeight}
          />

          {/* Lines (right axis) */}
          {yRightScale && config.fields.yRight && (
            <Lines
              data={data}
              xScale={xScale}
              yScale={yRightScale}
              yField={config.fields.yRight.field}
              xField={config.fields.x.field}
            />
          )}

          {/* Axes */}
          <AxisBottom scale={xScale} transform={`translate(0,${innerHeight})`} />
          <AxisLeft scale={yLeftScale} />
          {yRightScale && <AxisRight scale={yRightScale} transform={`translate(${innerWidth},0)`} />}
        </g>
      </svg>
    </ChartContainer>
  )
}

export const ComboChart = memo(ComboChartComponent)
```

### File 3: Update `src/components/configurator/ChartTypeSelector.tsx`

Add combo chart option:

```typescript
const chartTypes = [
  // ... existing types
  {
    type: 'combo',
    label: 'Combo Chart',
    icon: 'bar_chart',
    description: 'Combine bars and lines with dual Y-axes',
  },
]
```

### File 4: Update `src/components/configurator/ConfigureStep.tsx`

Add combo-specific field selectors:

```typescript
{config.type === 'combo' && (
  <>
    <FieldSelector
      label="Y Axis (Left - Bar)"
      field="y"
      options={numericFields}
    />
    <FieldSelector
      label="Y Axis (Right - Line)"
      field="yRight"
      options={numericFields}
      optional
    />
    <ComboTypeSelector
      value={config.comboType}
      options={[
        { value: 'bar-line', label: 'Bar + Line' },
        { value: 'line-line', label: 'Dual Line' },
      ]}
    />
  </>
)}
```

### File 5: Add translations to locale files

**`src/locales/en.json`**:
```json
{
  "chartTypes": {
    "combo": "Combo Chart",
    "comboBarLine": "Bar + Line",
    "comboLineLine": "Dual Line"
  },
  "configurator": {
    "yAxisLeft": "Y Axis (Left)",
    "yAxisRight": "Y Axis (Right)"
  }
}
```

---

## Affected areas
- `src/types/chart-config.ts` - Add combo chart types
- `src/components/charts/combo/` (new directory) - Combo chart components
- `src/components/configurator/ChartTypeSelector.tsx` - Add combo option
- `src/components/configurator/ConfigureStep.tsx` - Combo-specific fields
- `src/lib/i18n/locales/*.json` - Translations
- `src/stores/configurator.ts` - Handle combo config state

## Constraints
- Must sync tooltips between bar and line series
- Brush selection should affect both chart types
- Legend must show axis association (left/right)
- Responsive scaling for both Y-axes
- Support animation for both series types

## Out of scope
- Three or more Y-axes
- Stacked combo charts
- Area + bar combos (can be added later)

## Acceptance criteria
- [ ] Combo chart type appears in chart type selector
- [ ] Can configure left Y-axis field
- [ ] Can configure right Y-axis field (optional)
- [ ] Bars render on left Y-axis scale
- [ ] Lines render on right Y-axis scale
- [ ] Both Y-axes show independent tick formatting
- [ ] Legend shows which series belong to which axis
- [ ] Tooltip shows values from both series
- [ ] Responsive layout adjusts margins based on axis visibility
- [ ] All three locales have combo chart translations
