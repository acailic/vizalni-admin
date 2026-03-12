# Playground Deep Polish Design

**Date**: 2026-03-02
**Status**: Approved
**Owner**: Vizualni Admin Team

## Overview

Transform the Chart Playground into a comprehensive, full-featured chart builder
that serves as the flagship demo for the vizualni package. The polished playground
will support multiple chart types, live data editing, export capabilities, and
shareable configurations.

## Vision

Create a **professional-grade chart configuration tool** that:
- Demonstrates all chart types in the vizualni package
- Enables rapid prototyping with live preview
- Generates production-ready code
- Supports sharing and collaboration

## Architecture

### Component Structure

```
app/pages/demos/playground/
├── index.tsx                 # Main entry, layout
├── _components/
│   ├── ChartBuilder.tsx      # Main orchestrator
│   ├── ConfigPanel/
│   │   ├── index.tsx         # Collapsible config sidebar
│   │   ├── ChartTypeSelector.tsx
│   │   ├── DataEditor.tsx    # JSON/CSV editor with validation
│   │   ├── AxisConfig.tsx    # X/Y field mapping
│   │   ├── ThemeSelector.tsx # Preset + custom colors
│   │   └── ExportPanel.tsx   # PNG/SVG/Code/Share
│   ├── PreviewPane/
│   │   ├── index.tsx         # Chart preview area
│   │   └── ChartRenderer.tsx # Dynamic chart component
│   ├── CodeOutput/
│   │   └── index.tsx         # Generated code with copy
│   └── Onboarding/
│       ├── GuidedTour.tsx    # First-time user tour
│       └── KeyboardShortcuts.tsx
├── _hooks/
│   ├── usePlaygroundState.ts # State management (Zustand)
│   ├── useUrlState.ts        # URL sync for sharing
│   └── useExport.ts          # Export functionality
└── _constants/
    ├── sampleDatasets.ts     # Pre-loaded examples
    ├── themes.ts             # Color themes
    └── chartDefaults.ts
```

### State Shape

```typescript
interface PlaygroundState {
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
  data: Datum[];
  config: ChartConfig;
  theme: ThemePreset | CustomTheme;
  ui: {
    activeTab: 'preview' | 'code';
    showOnboarding: boolean;
    panelCollapsed: boolean;
  };
}
```

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Zustand | Already in project, simple API |
| URL serialization | lz-string | Compressed, shareable links |
| Persistence | localStorage | Survive page refresh |
| Export | html-to-image | Reliable PNG generation |

## UI/UX Layout

### Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Chart Playground                    [? Help] [⌨️]  │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│  CONFIG       │              PREVIEW                        │
│  PANEL        │         (takes 70% width)                   │
│  (30%)        │                                             │
│               │                                             │
│  ┌─────────┐  │   ┌─────────────────────────────────────┐   │
│  │ Chart   │  │   │                                     │   │
│  │ Type    │  │   │      [Rendered Chart]               │   │
│  │ ▼       │  │   │                                     │   │
│  └─────────┘  │   │                                     │   │
│               │   │                                     │   │
│  ┌─────────┐  │   └─────────────────────────────────────┘   │
│  │ Data    │  │                                             │
│  │ Editor  │  │   [Preview] [Code]      [Export ▼] [Share]  │
│  └─────────┘  │                                             │
│               │                                             │
│  ┌─────────┐  │                                             │
│  │ Theme   │  │                                             │
│  └─────────┘  │                                             │
│               │                                             │
│  [Collapse ◀] │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (1024px+) | Side-by-side, config left |
| Tablet (768-1023px) | Collapsible panel, tabbed view |
| Mobile (<768px) | Stacked, full-width preview |

### Visual Design

- Dark mode default (chart-focused, reduces eye strain)
- Subtle gradient background for preview area
- Color-coded chart type icons
- Real-time validation feedback in data editor
- Smooth transitions (300ms ease-out)

### Accessibility

- Full keyboard navigation
- Screen reader announcements for state changes
- High contrast mode support
- Focus indicators on all interactive elements

## Chart Types

### Supported Types

| Type | Icon | Use Case | Config Fields |
|------|------|----------|---------------|
| Line | 📈 | Trends over time | x, y, smooth, area |
| Bar | 📊 | Comparisons | x, y, horizontal, stacked |
| Area | 📉 | Cumulative trends | x, y, stacked |
| Pie | 🥧 | Proportions | value, category, donut |
| Scatter | ⦿ | Correlations | x, y, size |

### Sample Datasets

```typescript
const sampleDatasets = {
  sales: { name: "Monthly Sales", data: [...] },
  population: { name: "Age Distribution", data: [...] },
  temperature: { name: "Weather Data", data: [...] },
  budget: { name: "Budget Allocation", data: [...] },
};
```

## Data Handling

### Input Methods

1. **Sample Selector** - Dropdown with pre-loaded datasets
2. **JSON Editor** - Live editing with schema validation
3. **CSV Paste** - Paste from spreadsheet, auto-convert
4. **Random Generator** - Generate test data with configurable size

### Validation

- Real-time JSON schema checking
- Required field detection (auto-maps first string column to label)
- Type coercion (strings to numbers where possible)
- Error messages with line numbers for JSON

### Auto-Mapping

```typescript
function autoMapFields(data: Datum[]): Partial<ChartConfig> {
  const keys = Object.keys(data[0] || {});
  const numericKeys = keys.filter(k => typeof data[0][k] === 'number');
  const stringKeys = keys.filter(k => typeof data[0][k] === 'string');

  return {
    x: stringKeys[0] || keys[0],
    y: numericKeys[0] || keys[1],
  };
}
```

## Export & Sharing

### Export Formats

| Format | Use Case | Implementation |
|--------|----------|----------------|
| PNG | Reports, presentations | html-to-image library |
| SVG | Editable graphics | Native chart export |
| Code | Copy to project | Template generation |
| URL | Share with others | State serialization |

### URL Sharing

```typescript
interface ShareableState {
  t: 'line' | 'bar' | ...;  // chart type (1 char)
  d: Datum[];               // compressed data
  c: ChartConfig;           // config (abbreviated keys)
  th: string;               // theme id or hex
}

// URL: /demos/playground?s=eyJ0IjoiYmFyIiwiZCI6W3sibCI6IkEiLCJ2IjoxMH1dfQ
```

### Code Output Options

- Framework: React / Vanilla JS / Vue
- Language: TypeScript / JavaScript
- Styling: Inline / CSS Modules / Tailwind

### Generated Code Template

```tsx
import { BarChart } from '@vizualni/react';

export function MyChart() {
  const data = [
    { label: "Jan", value: 4000 },
    { label: "Feb", value: 3000 },
  ];

  return (
    <BarChart
      data={data}
      config={{
        x: { field: "label", type: "string" },
        y: { field: "value", type: "number" },
      }}
      width={600}
      height={400}
    />
  );
}
```

## Onboarding & Help

### Guided Tour Steps

1. **Welcome** - "Build charts in seconds" with quick demo
2. **Chart Types** - Hover over each type, see mini-preview
3. **Data Panel** - Click to edit, see real-time updates
4. **Themes** - Click a theme, watch colors change
5. **Export** - Show all export options, copy code

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Copy share link |
| `Ctrl/Cmd + C` | Copy code (when code tab active) |
| `Ctrl/Cmd + E` | Export PNG |
| `1-5` | Switch chart type |
| `Tab` | Navigate config fields |
| `Escape` | Close modals / collapse panel |
| `?` | Open help |

### Progressive Disclosure

- Basic options visible by default (chart type, data, color)
- Advanced options collapsed (animations, tooltips, legend)
- "Show advanced" toggle for power users

## Implementation Phases

### Phase 1: Foundation (Core)

- [ ] Restructure playground folder layout
- [ ] Implement Zustand store with URL sync
- [ ] Add all 5 chart types with type selector
- [ ] Basic theme support (5 presets)
- [ ] Code generation for React/TypeScript

### Phase 2: Data & Export

- [ ] JSON editor with validation
- [ ] CSV paste support
- [ ] Random data generator
- [ ] PNG/SVG export
- [ ] URL sharing with compression

### Phase 3: UX Polish

- [ ] Guided tour component
- [ ] Keyboard shortcuts
- [ ] Responsive layout
- [ ] Dark/light mode toggle
- [ ] Loading states & animations

### Phase 4: Advanced

- [ ] Multi-code format output (Vue, Vanilla JS)
- [ ] Custom theme builder
- [ ] Chart annotations
- [ ] Performance metrics display
- [ ] Embed code generator

## Testing Strategy

| Type | Coverage | Tools |
|------|----------|-------|
| Unit | Store logic, validation, generators | Vitest |
| Component | UI interactions, rendering | React Testing Library |
| E2E | Full user flows | Playwright |
| Visual | Chart rendering | Optional: Percy/Chromatic |

### Key Test Scenarios

1. Chart type switching preserves data
2. Invalid JSON shows helpful error
3. URL share restores exact state
4. Export generates valid files
5. Keyboard navigation works
6. Mobile layout is usable

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 2s |
| Chart render | < 500ms |
| State update | < 100ms |
| Export generation | < 1s |
| Bundle size increase | < 50KB gzip |

## Dependencies

**New packages to install:**

```bash
npm install lz-string html-to-image
```

**Already in project:**
- @lingui/react (i18n)
- zustand (state)
- @mui/material (UI)
- Existing chart components

## Success Metrics

- Users spend 3+ minutes on average in playground
- Export feature used by 40%+ of visitors
- Share links created by 15%+ of users
- < 5% error rate in data validation
- 90%+ task completion in user testing
