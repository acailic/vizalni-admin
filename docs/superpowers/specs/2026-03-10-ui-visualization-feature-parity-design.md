# UI & Visualization Feature Parity Design

**Date**: 2026-03-10 **Status**: Approved **Reference**:
visualize-admin/visualization-tool

## Overview

This design documents the implementation of all missing UI and visualization
features from the reference repository (visualize-admin/visualization-tool) to
achieve full feature parity.

## Goals

1. Implement 4 complete theme variants (default, modern, minimal, dark)
2. Add 4 new chart types (Treemap, Sankey, Sunburst, Gauge)
3. Implement 3D map visualizations and heatmap layers
4. Enhance interactive features (guidance hints, ruler, callouts)
5. Add Excel export functionality
6. Complete show-values system for all chart types

## Non-Goals

- Authentication system (separate effort)
- Performance testing infrastructure (separate effort)
- Translation workflow changes (separate effort)

## Architecture

### Phase 1: Theme System & Styling Foundation

#### 1.1 Theme Variants System

Create `chart-theme-variants.ts` with 4 variants:

```typescript
type ChartThemeVariant = "default" | "modern" | "minimal" | "dark";

interface ChartThemeTokens {
  colors: {
    primary: string;
    accent: string;
    positive: string;
    negative: string;
    neutral: string;
    grid: string;
    axis: string;
    background: string;
    tooltip: { background: string; border: string; text: string };
  };
  typography: {
    title: TypographyTokens;
    axisLabel: TypographyTokens;
    dataLabel: TypographyTokens;
    tooltip: TypographyTokens;
  };
  motion: {
    duration: number;
    easing: string;
    entrance: { duration: number; delay: number };
    hover: { duration: number };
  };
  spacing: {
    padding: number;
    legendGap: number;
    tooltipPadding: number;
  };
  stroke: {
    lineWidth: number;
    dotRadius: number;
    barRadius: number;
  };
}
```

Each variant will have distinct visual characteristics:

- **default**: Current vibrant blue primary, balanced spacing
- **modern**: Rounded corners, softer colors, larger typography
- **minimal**: Thin strokes, muted colors, minimal padding
- **dark**: Dark background, high contrast, glowing accents

#### 1.2 Extended Legend Symbols

Add to `legend-color.tsx`:

- `cross` symbol
- `triangle` symbol
- `diamond` symbol

Update symbol rendering in:

- `legend-interactive.tsx`
- All chart type legends

#### 1.3 Show Values System (Complete)

Enhance `show-values-utils.ts`:

- Value positioning: `inside`, `outside`, `center`
- Formatting: `absolute`, `percentage`, `both`
- Collision detection for overlapping labels
- Smart positioning for stacked/grouped charts

### Phase 2: Advanced Chart Interactions

#### 2.1 Guidance Hints System

Create `guidance-hint.tsx`:

- Sequential hint display
- Dismissible tooltips
- Highlighted elements with arrows
- Progress indicator for multi-step hints

Configuration in chart options:

```typescript
interface GuidanceHintConfig {
  enabled: boolean;
  hints: Array<{
    target: string; // CSS selector or component ref
    content: string;
    position: "top" | "bottom" | "left" | "right";
    dismissText?: string;
  }>;
}
```

#### 2.2 Enhanced Ruler Tool

Expand `ruler.tsx`:

- Snap-to-data functionality
- Multi-point measurement
- Measurement display panel
- Copy values to clipboard

#### 2.3 Observation Callouts

Create `observation-callout.tsx`:

- Leader lines from callout to data point
- Smart positioning to avoid overlaps
- Rich formatting (title, value, segment, trend)
- Draggable positioning

#### 2.4 Imputation Handling

Complete imputation visualization:

- Visual indicators for interpolated values (dashed lines, different opacity)
- Configurable imputation methods: `linear`, `step`, `none`
- Legend indicator for imputed data

### Phase 3: New Chart Types

#### 3.1 Treemap Chart

Directory: `charts/treemap/`

```typescript
interface TreemapConfig {
  type: "treemap";
  x: { field: string; type: "nominal" };
  y: { field: string; type: "quantitative" };
  tile?: "squarify" | "slice" | "dice" | "sliceDice";
}
```

Features:

- Hierarchical drill-down
- Zoom and pan
- Interactive highlighting
- Color scale by value

#### 3.2 Sankey Diagram

Directory: `charts/sankey/`

```typescript
interface SankeyConfig {
  type: "sankey";
  nodes: { field: string };
  links: { source: string; target: string; value: string };
  nodeWidth?: number;
  nodePadding?: number;
}
```

Features:

- Flow highlighting on hover
- Animated transitions
- Node reordering
- Value tooltips

#### 3.3 Sunburst Chart

Directory: `charts/sunburst/`

```typescript
interface SunburstConfig {
  type: "sunburst";
  hierarchy: { field: string }[];
  size: { field: string };
  color: { field: string };
}
```

Features:

- Zoom on click
- Breadcrumb navigation
- Arc highlighting
- Animated transitions

#### 3.4 Gauge Chart

Directory: `charts/gauge/`

```typescript
interface GaugeConfig {
  type: "gauge";
  value: { field: string };
  min?: number;
  max?: number;
  thresholds?: Array<{ value: number; color: string }>;
  showValue?: boolean;
}
```

Features:

- Configurable thresholds with color zones
- Needle animation
- Value display (inside, outside)
- Multiple gauge layouts (single, comparison)

### Phase 4: Advanced Map Features

#### 4.1 3D Map Layers

Create in `charts/map/layers/`:

- `mesh-layer.ts` - 3D terrain/building meshes
- `3d-column-layer.ts` - 3D extruded columns

Uses Deck.gl extensions:

- `@deck.gl/mesh-layers`
- `@deck.gl/geo-layers`

Configuration:

```typescript
interface Map3DConfig {
  enable3D: boolean;
  elevationScale: number;
  terrainSource?: string;
}
```

#### 4.2 Heatmap Layer

Create `map-heatmap-layer.ts`:

- Intensity-based coloring
- Radius configuration
- Weight field mapping
- Zoom-level sensitivity

```typescript
interface HeatmapLayerConfig {
  type: "heatmap";
  intensity: { field: string };
  radius?: number;
  colorScale?: string[];
}
```

#### 4.3 Enhanced Map Symbols

- Dashed scatterplot layer
- Custom symbol shapes
- Clustering for dense points
- Size scaling by value

### Phase 5: Export Enhancements

#### 5.1 Excel Export

Add XLSX export:

- Multi-sheet support
- Formatting preservation
- Column headers with units
- Date/number formatting

Dependencies:

- `xlsx` or `exceljs`

```typescript
interface ExcelExportOptions {
  filename: string;
  sheets: Array<{
    name: string;
    data: DataSource;
    formatting?: CellFormatting;
  }>;
}
```

#### 5.2 Enhanced Image Export

- Watermark options
- Metadata embedding (EXIF-like for PNGs)
- Custom resolutions
- Background options (transparent, colored)

## File Structure

### New Files

```
app/charts/
├── treemap/
│   ├── chart-treemap.tsx
│   ├── treemap-state.tsx
│   ├── treemap-state-props.ts
│   └── treemap.tsx
├── sankey/
│   ├── chart-sankey.tsx
│   ├── sankey-state.tsx
│   ├── sankey-state-props.ts
│   └── sankey.tsx
├── sunburst/
│   ├── chart-sunburst.tsx
│   ├── sunburst-state.tsx
│   ├── sunburst-state-props.ts
│   └── sunburst.tsx
├── gauge/
│   ├── chart-gauge.tsx
│   ├── gauge-state.tsx
│   ├── gauge-state-props.ts
│   └── gauge.tsx
├── map/layers/
│   ├── heatmap-layer.ts
│   ├── mesh-layer.ts
│   └── 3d-column-layer.ts
├── shared/
│   ├── chart-theme-variants.ts
│   ├── observation-callout.tsx
│   ├── excel-export.ts
│   └── enhanced-image-export.ts
```

### Modified Files

```
app/charts/
├── shared/
│   ├── chart-theme-tokens.ts (enhance)
│   ├── show-values-utils.ts (enhance)
│   ├── guidance-hint.tsx (enhance)
│   ├── ruler.tsx (enhance)
│   ├── legend-color.tsx (add symbols)
│   ├── legend-interactive.tsx (add symbols)
│   └── imputation.spec.tsx (complete)
├── index.ts (register new chart types)
└── chart-config-spec.ts (add new configs)

app/config-types.ts (add new chart type types)
app/configurator/chart-chart-options.tsx (add theme selector)
```

## Dependencies

```json
{
  "xlsx": "^0.18.5",
  "d3-hierarchy": "^3.1.2",
  "d3-sankey": "^0.12.3"
}
```

Note: `d3-hierarchy` may already be included via `d3` package.

## Migration Path

1. **Phase 1** - No breaking changes, additive only
2. **Phase 2** - No breaking changes, additive only
3. **Phase 3** - New chart types registered, no impact on existing
4. **Phase 4** - Optional 3D features, fallback to 2D
5. **Phase 5** - New export formats, existing unchanged

## Testing Strategy

- Unit tests for each new chart type
- Visual regression tests via Playwright
- Accessibility tests for new components
- Integration tests for export functionality

## Success Criteria

- All 4 theme variants working with theme switcher
- All 4 new chart types rendering correctly
- 3D map layers working with fallback to 2D
- Heatmap layer rendering on maps
- Excel export producing valid XLSX files
- Show values working on all applicable chart types
- Guidance hints displaying correctly
- Observation callouts with leader lines working
