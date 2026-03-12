# Chart Component Redesign

**Date:** 2026-02-19 **Status:** Approved **Target:** End-users viewing
visualizations

## Problem Statement

End-users find the current chart components:

1. **Generic looking** - Charts look like default D3, not distinctive or modern
2. **Confusing to use** - Controls are unclear, users don't understand how to
   interact

## Goals

- Improve visual polish and aesthetics
- Make interactions more intuitive and discoverable
- Maintain full backward API compatibility

## Approach: Smart Defaults + Interactive Polish

Redesign components from the inside out with:

- Better default styling (modern, distinctive)
- Smarter interactions (intuitive hover, clear tooltips, contextual legends)
- Progressive disclosure (advanced controls hidden until needed)
- Same API surface (new features via optional props)

---

## Visual Identity

### Typography

- Bolder axis labels (500-600 weight instead of 400)
- Larger chart titles (1.25rem with tight letter-spacing)
- Clear hierarchy: title → axis labels → data labels → tooltips

### Color System

- Vibrant primary palette (not pastel) with good contrast
- Semantic accent colors: positive (green), negative (red), neutral (blue)
- Auto colorblind-safe mode option

### Stroke & Fill

- Thicker lines (2-3px default instead of 1-1.5px)
- Soft shadows on data points for depth
- Gradient fills under area charts instead of flat colors
- Rounded corners on bars (4px radius)

### Motion

- Smooth entrance animations (data points fade/slide in)
- Eased transitions when data changes (300ms ease-out)
- Subtle pulse on hover to indicate interactivity

### Whitespace

- More padding around chart edges
- Clear separation between legend and chart area
- Breathing room for tooltips

---

## Interaction Patterns

### Progressive Disclosure

- Basic view shows clean chart with minimal chrome
- Hover reveals tooltips and highlights
- Click/tap expands: legend becomes interactive, filters appear
- Advanced options (export, full-screen) in a subtle "···" menu

### Smarter Tooltips

- Rich content: value + label + percentage + trend indicator
- Anchored to data point, not floating randomly
- Includes "Compare" button to select this series for comparison
- Keyboard accessible (Tab between data points)

### Guided Legend

- Legend items are clickable filters (not just labels)
- "Isolate" mode: click once to highlight only that series
- "Compare" mode: shift-click to add to comparison
- Visual feedback: dimmed series fade to 20% opacity

### Intuitive Zoom & Pan (for dense charts)

- Pinch/scroll to zoom on mobile
- Drag to pan
- "Reset view" button appears when zoomed
- Minimap for context on large datasets

### Clear Affordances

- Interactive elements have subtle glow on hover
- Cursors change: pointer for clickable, grab for pannable
- Animated hint on first load: "Hover for details"

---

## Component Changes

### LineChart

| Current                | Proposed                                     |
| ---------------------- | -------------------------------------------- |
| Thin lines, basic dots | Thicker lines (2.5px), filled dots with glow |
| No area option         | Optional gradient area fill                  |
| Basic tooltip          | Tooltip with trend arrow (↑↓→)               |
| Static legend          | Clickable legend to isolate/compare series   |
| No interaction         | Hover highlights single line, dims others    |

### ColumnChart / BarChart

| Current                  | Proposed                                                      |
| ------------------------ | ------------------------------------------------------------- |
| Flat colors              | Subtle gradient or shadow depth                               |
| Sharp corners            | 4px rounded corners                                           |
| Labels inside or outside | Smart positioning: inside if fits, outside + connector if not |
| No sorting               | Optional: sort by value (ascending/descending)                |
| Click does nothing       | Click column to highlight + show detail panel                 |

### PieChart

| Current                        | Proposed                                          |
| ------------------------------ | ------------------------------------------------- |
| Flat segments                  | Slight 3D depth or donut option as default        |
| Labels overlap on small slices | Leader lines to labels outside                    |
| No interaction                 | Hover explodes slice slightly, click isolates     |
| Basic legend                   | Integrated center label (total or selected value) |

### AreaChart

| Current                        | Proposed                                       |
| ------------------------------ | ---------------------------------------------- |
| Flat fill                      | Gradient fill (top color → transparent bottom) |
| Overlapping areas hard to read | Stacked option with clear boundaries           |
| No baseline option             | Optional baseline (zero, min, custom)          |

### MapChart

| Current         | Proposed                                    |
| --------------- | ------------------------------------------- |
| Basic hover     | Rich tooltip with region name + key metrics |
| Static zoom     | Smooth zoom with minimap                    |
| Uniform styling | Choropleth with auto-binned color scale     |
| No selection    | Click region to filter other charts         |

---

## API Additions

All new features are **opt-in** via new props. Existing code works identically.

### Common Props (all charts)

```tsx
// Visual enhancements
theme?: 'default' | 'modern' | 'minimal' | 'dark'
animated?: boolean           // default: true
roundedCorners?: boolean     // default: true for bars

// Interaction enhancements
interactiveLegend?: boolean  // click to filter/isolate
tooltipVariant?: 'basic' | 'rich' | 'none'
guidance?: boolean           // show first-time hints

// Layout
padding?: ChartPadding
legendPosition?: 'right' | 'bottom' | 'none'
```

### Line/AreaChart Props

```tsx
areaFill?: boolean
areaGradient?: string[]
pointStyle?: 'dot' | 'ring' | 'glow'
```

### Column/BarChart Props

```tsx
sortOrder?: 'none' | 'asc' | 'desc'
labelPosition?: 'auto' | 'inside' | 'outside'
grouped?: boolean
```

### PieChart Props

```tsx
variant?: 'pie' | 'donut'
innerLabel?: string | ((total) => string)
explodeOnHover?: boolean
leaderLines?: boolean
```

### MapChart Props

```tsx
minimap?: boolean
zoomable?: boolean
colorScale?: 'quantize' | 'quantile' | 'linear'
```

### Migration Example

```tsx
// Before (still works exactly the same)
<LineChart data={data} xKey="year" yKey="value" />

// After (opt-in to new look)
<LineChart
  data={data}
  xKey="year"
  yKey="value"
  theme="modern"
  interactiveLegend
  tooltipVariant="rich"
/>
```

---

## Implementation Plan

### Phase 1: Foundation

- Define color palette and typography tokens
- Create shared chart styles (rounded corners, shadows, gradients)
- Build animation primitives (fade, slide, ease transitions)
- Add theme prop with "modern" as new default

### Phase 2: Core Charts (LineChart, ColumnChart)

- Redesign LineChart with new defaults + areaFill option
- Redesign ColumnChart with rounded corners + smart labels
- Implement rich tooltips with trend indicators
- Add interactive legend (click to isolate/compare)

### Phase 3: Secondary Charts (PieChart, AreaChart, MapChart)

- Apply visual refresh to remaining charts
- Add chart-specific enhancements
- Implement MapChart zoom + minimap

### Phase 4: Polish

- Add first-time guidance hints
- Improve keyboard navigation
- Fine-tune animations and micro-interactions
- Performance optimization

### Priorities

| Priority | Component              |
| -------- | ---------------------- |
| P0       | LineChart, ColumnChart |
| P1       | PieChart, AreaChart    |
| P2       | MapChart               |
| P3       | Guidance, keyboard nav |

### Testing

- Visual regression tests for new styling
- Unit tests for new props (existing tests unchanged)
- Manual QA on mobile + desktop
- Accessibility audit (WCAG 2.1 AA)

---

## Success Criteria

- [ ] Charts look modern and distinctive out of the box
- [ ] Users can discover interactions without documentation
- [ ] Existing integrations work without code changes
- [ ] All new props have TypeScript types
- [ ] Accessibility maintained (WCAG 2.1 AA)
