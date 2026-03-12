# Playground Deep Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Chart Playground into a full-featured chart builder with 5 chart types, live data editing, export capabilities, and URL sharing.

**Architecture:** Zustand store with URL sync for state persistence and sharing. Component-based layout with collapsible config panel (30%) and chart preview (70%). Dynamic chart rendering based on selected type.

**Tech Stack:** React, TypeScript, Zustand, MUI, lz-string, html-to-image, D3

---

## Phase 1: Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install new packages**

Run: `npm install lz-string html-to-image && npm install -D @types/lz-string`

Expected: Packages added to package.json

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lz-string and html-to-image for playground export"
```

---

### Task 2: Create Type Definitions

**Files:**
- Create: `app/pages/demos/playground/_types/index.ts`
- Test: `app/pages/demos/playground/__tests__/types.test.ts`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/types.test.ts
import { describe, it, expect } from "vitest";
import type { PlaygroundState, ChartType, ThemePreset } from "../_types";

describe("Playground Types", () => {
  it("should accept valid chart types", () => {
    const validTypes: ChartType[] = ["line", "bar", "area", "pie", "scatter"];
    expect(validTypes).toHaveLength(5);
  });

  it("should accept valid theme preset", () => {
    const theme: ThemePreset = {
      id: "indigo",
      name: "Indigo",
      primary: "#6366f1",
      secondary: "#818cf8",
    };
    expect(theme.primary).toBe("#6366f1");
  });

  it("should accept valid playground state", () => {
    const state: Partial<PlaygroundState> = {
      chartType: "bar",
      data: [{ label: "A", value: 10 }],
      config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
    };
    expect(state.chartType).toBe("bar");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/types.test.ts`

Expected: FAIL - module not found

**Step 3: Create types file**

```typescript
// app/pages/demos/playground/_types/index.ts
import type { BaseChartConfig } from "@/exports/charts";

export type ChartType = "line" | "bar" | "area" | "pie" | "scatter";

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

export interface PlaygroundConfig extends BaseChartConfig {
  showArea?: boolean;
  showCrosshair?: boolean;
  donut?: boolean;
  stacked?: boolean;
}

export interface PlaygroundState {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  themeId: string;
  ui: {
    activeTab: "preview" | "code";
    showOnboarding: boolean;
    panelCollapsed: boolean;
  };
}

export interface Datum {
  [key: string]: string | number;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/types.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_types app/pages/demos/playground/__tests__
git commit -m "feat(playground): add type definitions"
```

---

### Task 3: Create Constants (Themes & Sample Data)

**Files:**
- Create: `app/pages/demos/playground/_constants/themes.ts`
- Create: `app/pages/demos/playground/_constants/sampleDatasets.ts`
- Create: `app/pages/demos/playground/_constants/index.ts`
- Test: `app/pages/demos/playground/__tests__/constants.test.ts`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/constants.test.ts
import { describe, it, expect } from "vitest";
import { THEME_PRESETS, SAMPLE_DATASETS, getThemeById } from "../_constants";

describe("Playground Constants", () => {
  it("should have 5 theme presets", () => {
    expect(THEME_PRESETS).toHaveLength(5);
  });

  it("should find theme by id", () => {
    const theme = getThemeById("indigo");
    expect(theme?.primary).toBe("#6366f1");
  });

  it("should have sample datasets", () => {
    expect(Object.keys(SAMPLE_DATASETS).length).toBeGreaterThanOrEqual(3);
  });

  it("should have valid data in sales dataset", () => {
    expect(SAMPLE_DATASETS.sales.data).toHaveLength(6);
    expect(SAMPLE_DATASETS.sales.data[0]).toHaveProperty("label");
    expect(SAMPLE_DATASETS.sales.data[0]).toHaveProperty("value");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/constants.test.ts`

Expected: FAIL - module not found

**Step 3: Create themes constant**

```typescript
// app/pages/demos/playground/_constants/themes.ts
import type { ThemePreset } from "../_types";

export const THEME_PRESETS: ThemePreset[] = [
  { id: "indigo", name: "Indigo", primary: "#6366f1", secondary: "#818cf8" },
  { id: "emerald", name: "Emerald", primary: "#10b981", secondary: "#34d399" },
  { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#fbbf24" },
  { id: "rose", name: "Rose", primary: "#f43f5e", secondary: "#fb7185" },
  { id: "cyan", name: "Cyan", primary: "#06b6d4", secondary: "#22d3ee" },
];

export const getThemeById = (id: string): ThemePreset | undefined =>
  THEME_PRESETS.find((t) => t.id === id);
```

**Step 4: Create sample datasets constant**

```typescript
// app/pages/demos/playground/_constants/sampleDatasets.ts
import type { Datum } from "../_types";

interface DatasetInfo {
  name: string;
  description: string;
  data: Datum[];
}

export const SAMPLE_DATASETS: Record<string, DatasetInfo> = {
  sales: {
    name: "Monthly Sales",
    description: "Monthly sales data for 2024",
    data: [
      { label: "Jan", value: 4000 },
      { label: "Feb", value: 3000 },
      { label: "Mar", value: 5000 },
      { label: "Apr", value: 4500 },
      { label: "May", value: 6000 },
      { label: "Jun", value: 5500 },
    ],
  },
  population: {
    name: "Age Distribution",
    description: "Population by age group",
    data: [
      { label: "0-14", value: 15 },
      { label: "15-24", value: 12 },
      { label: "25-44", value: 28 },
      { label: "45-64", value: 25 },
      { label: "65+", value: 20 },
    ],
  },
  revenue: {
    name: "Quarterly Revenue",
    description: "Revenue by quarter",
    data: [
      { label: "Q1", value: 125000 },
      { label: "Q2", value: 180000 },
      { label: "Q3", value: 165000 },
      { label: "Q4", value: 210000 },
    ],
  },
  temperature: {
    name: "Monthly Temperature",
    description: "Average temperature in Belgrade",
    data: [
      { label: "Jan", value: 1 },
      { label: "Feb", value: 3 },
      { label: "Mar", value: 8 },
      { label: "Apr", value: 14 },
      { label: "May", value: 19 },
      { label: "Jun", value: 23 },
      { label: "Jul", value: 25 },
      { label: "Aug", value: 25 },
      { label: "Sep", value: 20 },
      { label: "Oct", value: 14 },
      { label: "Nov", value: 8 },
      { label: "Dec", value: 3 },
    ],
  },
};
```

**Step 5: Create index export**

```typescript
// app/pages/demos/playground/_constants/index.ts
export { THEME_PRESETS, getThemeById } from "./themes";
export { SAMPLE_DATASETS } from "./sampleDatasets";
```

**Step 6: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/constants.test.ts`

Expected: PASS

**Step 7: Commit**

```bash
git add app/pages/demos/playground/_constants app/pages/demos/playground/__tests__
git commit -m "feat(playground): add theme presets and sample datasets"
```

---

### Task 4: Create Zustand Store

**Files:**
- Create: `app/pages/demos/playground/_hooks/usePlaygroundStore.ts`
- Test: `app/pages/demos/playground/__tests__/usePlaygroundStore.test.ts`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/usePlaygroundStore.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { usePlaygroundStore } from "../_hooks/usePlaygroundStore";

describe("Playground Store", () => {
  beforeEach(() => {
    // Reset store state
    usePlaygroundStore.setState({
      chartType: "line",
      data: [],
      config: { xAxis: "", yAxis: "", color: "#6366f1" },
      themeId: "indigo",
      ui: { activeTab: "preview", showOnboarding: true, panelCollapsed: false },
    });
  });

  it("should have initial state", () => {
    const state = usePlaygroundStore.getState();
    expect(state.chartType).toBe("line");
    expect(state.themeId).toBe("indigo");
  });

  it("should set chart type", () => {
    act(() => {
      usePlaygroundStore.getState().setChartType("bar");
    });
    expect(usePlaygroundStore.getState().chartType).toBe("bar");
  });

  it("should set data", () => {
    const newData = [{ label: "A", value: 10 }];
    act(() => {
      usePlaygroundStore.getState().setData(newData);
    });
    expect(usePlaygroundStore.getState().data).toEqual(newData);
  });

  it("should set config", () => {
    act(() => {
      usePlaygroundStore.getState().setConfig({ xAxis: "x", yAxis: "y", color: "#10b981" });
    });
    expect(usePlaygroundStore.getState().config.color).toBe("#10b981");
  });

  it("should toggle panel", () => {
    const initial = usePlaygroundStore.getState().ui.panelCollapsed;
    act(() => {
      usePlaygroundStore.getState().togglePanel();
    });
    expect(usePlaygroundStore.getState().ui.panelCollapsed).toBe(!initial);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/usePlaygroundStore.test.ts`

Expected: FAIL - module not found

**Step 3: Create the store**

```typescript
// app/pages/demos/playground/_hooks/usePlaygroundStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlaygroundState, PlaygroundConfig, ChartType, Datum } from "../_types";

interface PlaygroundActions {
  setChartType: (type: ChartType) => void;
  setData: (data: Datum[]) => void;
  setConfig: (config: PlaygroundConfig) => void;
  updateConfig: (partial: Partial<PlaygroundConfig>) => void;
  setThemeId: (id: string) => void;
  setActiveTab: (tab: "preview" | "code") => void;
  togglePanel: () => void;
  dismissOnboarding: () => void;
  reset: () => void;
}

const initialState: PlaygroundState = {
  chartType: "line",
  data: [],
  config: { xAxis: "", yAxis: "", color: "#6366f1" },
  themeId: "indigo",
  ui: {
    activeTab: "preview",
    showOnboarding: true,
    panelCollapsed: false,
  },
};

export const usePlaygroundStore = create<PlaygroundState & PlaygroundActions>()(
  persist(
    (set) => ({
      ...initialState,

      setChartType: (chartType) => set({ chartType }),
      setData: (data) => set({ data }),
      setConfig: (config) => set({ config }),
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      setThemeId: (themeId) => set({ themeId }),
      setActiveTab: (activeTab) =>
        set((state) => ({ ui: { ...state.ui, activeTab } })),
      togglePanel: () =>
        set((state) => ({
          ui: { ...state.ui, panelCollapsed: !state.ui.panelCollapsed },
        })),
      dismissOnboarding: () =>
        set((state) => ({
          ui: { ...state.ui, showOnboarding: false },
        })),
      reset: () => set(initialState),
    }),
    {
      name: "playground-state",
      partialize: (state) => ({
        chartType: state.chartType,
        data: state.data,
        config: state.config,
        themeId: state.themeId,
        ui: { ...state.ui, showOnboarding: state.ui.showOnboarding },
      }),
    }
  )
);
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/usePlaygroundStore.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_hooks app/pages/demos/playground/__tests__
git commit -m "feat(playground): add Zustand store with persistence"
```

---

### Task 5: Create URL State Sync Hook

**Files:**
- Create: `app/pages/demos/playground/_hooks/useUrlState.ts`
- Test: `app/pages/demos/playground/__tests__/useUrlState.test.ts`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/useUrlState.test.ts
import { describe, it, expect } from "vitest";
import { compressState, decompressState } from "../_hooks/useUrlState";
import type { PlaygroundState } from "../_types";

describe("URL State", () => {
  const sampleState: Partial<PlaygroundState> = {
    chartType: "bar",
    data: [{ label: "A", value: 10 }],
    config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
  };

  it("should compress state to string", () => {
    const compressed = compressState(sampleState as PlaygroundState);
    expect(typeof compressed).toBe("string");
    expect(compressed.length).toBeGreaterThan(0);
  });

  it("should decompress to original state", () => {
    const compressed = compressState(sampleState as PlaygroundState);
    const decompressed = decompressState(compressed);
    expect(decompressed?.chartType).toBe("bar");
    expect(decompressed?.data).toEqual([{ label: "A", value: 10 }]);
  });

  it("should handle invalid compressed data", () => {
    const result = decompressState("invalid-base64!");
    expect(result).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/useUrlState.test.ts`

Expected: FAIL - module not found

**Step 3: Create the URL state hook**

```typescript
// app/pages/demos/playground/_hooks/useUrlState.ts
import { useCallback } from "react";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

import type { PlaygroundState } from "../_types";

interface ShareableState {
  t: PlaygroundState["chartType"];
  d: PlaygroundState["data"];
  c: {
    x: string;
    y: string;
    color: string;
  };
  th: string;
}

export function compressState(state: PlaygroundState): string {
  const shareable: ShareableState = {
    t: state.chartType,
    d: state.data,
    c: {
      x: state.config.xAxis,
      y: state.config.yAxis,
      color: state.config.color,
    },
    th: state.themeId,
  };
  return compressToEncodedURIComponent(JSON.stringify(shareable));
}

export function decompressState(compressed: string): Partial<PlaygroundState> | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;

    const shareable: ShareableState = JSON.parse(decompressed);
    return {
      chartType: shareable.t,
      data: shareable.d,
      config: {
        xAxis: shareable.c.x,
        yAxis: shareable.c.y,
        color: shareable.c.color,
      },
      themeId: shareable.th,
    };
  } catch {
    return null;
  }
}

export function useUrlState() {
  const getShareUrl = useCallback((state: PlaygroundState): string => {
    const compressed = compressState(state);
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("s", compressed);
    return url.toString();
  }, []);

  const getStateFromUrl = useCallback((): Partial<PlaygroundState> | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get("s");
    if (!compressed) return null;
    return decompressState(compressed);
  }, []);

  return { getShareUrl, getStateFromUrl };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/useUrlState.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_hooks app/pages/demos/playground/__tests__
git commit -m "feat(playground): add URL state sync with lz-string compression"
```

---

### Task 6: Create Chart Type Selector Component

**Files:**
- Create: `app/pages/demos/playground/_components/ConfigPanel/ChartTypeSelector.tsx`
- Test: `app/pages/demos/playground/__tests__/ChartTypeSelector.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/ChartTypeSelector.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChartTypeSelector } from "../_components/ConfigPanel/ChartTypeSelector";

describe("ChartTypeSelector", () => {
  it("should render all chart types", () => {
    render(<ChartTypeSelector value="line" onChange={vi.fn()} />);
    expect(screen.getByText("Line")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("Pie")).toBeInTheDocument();
    expect(screen.getByText("Scatter")).toBeInTheDocument();
  });

  it("should highlight selected type", () => {
    render(<ChartTypeSelector value="bar" onChange={vi.fn()} />);
    const barButton = screen.getByRole("button", { name: /bar/i });
    expect(barButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange when clicked", () => {
    const onChange = vi.fn();
    render(<ChartTypeSelector value="line" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /pie/i }));
    expect(onChange).toHaveBeenCalledWith("pie");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/ChartTypeSelector.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/ConfigPanel/ChartTypeSelector.tsx
import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";

import type { ChartType } from "../../_types";

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: "line", label: "Line", icon: "📈" },
  { value: "bar", label: "Bar", icon: "📊" },
  { value: "area", label: "Area", icon: "📉" },
  { value: "pie", label: "Pie", icon: "🥧" },
  { value: "scatter", label: "Scatter", icon: "⦿" },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Chart Type
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newType) => newType && onChange(newType)}
        aria-label="chart type"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {CHART_TYPES.map((type) => (
          <ToggleButton
            key={type.value}
            value={type.value}
            aria-label={type.label}
            aria-pressed={value === type.value}
            sx={{
              px: 2,
              py: 1,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <span>{type.icon}</span>
              <Typography variant="body2">{type.label}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/ChartTypeSelector.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add ChartTypeSelector component"
```

---

### Task 7: Create Data Editor Component

**Files:**
- Create: `app/pages/demos/playground/_components/ConfigPanel/DataEditor.tsx`
- Test: `app/pages/demos/playground/__tests__/DataEditor.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/DataEditor.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataEditor } from "../_components/ConfigPanel/DataEditor";
import { SAMPLE_DATASETS } from "../_constants";

describe("DataEditor", () => {
  const defaultProps = {
    data: SAMPLE_DATASETS.sales.data,
    onChange: vi.fn(),
  };

  it("should render dataset selector", () => {
    render(<DataEditor {...defaultProps} />);
    expect(screen.getByLabelText(/sample dataset/i)).toBeInTheDocument();
  });

  it("should show current data info", () => {
    render(<DataEditor {...defaultProps} />);
    expect(screen.getByText(/6 points/i)).toBeInTheDocument();
  });

  it("should call onChange when dataset selected", () => {
    const onChange = vi.fn();
    render(<DataEditor {...defaultProps} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText(/sample dataset/i));
    fireEvent.click(screen.getByText("Age Distribution"));
    expect(onChange).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/DataEditor.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/ConfigPanel/DataEditor.tsx
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";

import { SAMPLE_DATASETS } from "../../_constants";
import type { Datum } from "../../_types";

interface DataEditorProps {
  data: Datum[];
  onChange: (data: Datum[]) => void;
}

export function DataEditor({ data, onChange }: DataEditorProps) {
  const [customJson, setCustomJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleDatasetSelect = (datasetKey: string) => {
    const dataset = SAMPLE_DATASETS[datasetKey];
    if (dataset) {
      onChange(dataset.data);
      setCustomJson("");
      setJsonError(null);
    }
  };

  const handleJsonChange = (value: string) => {
    setCustomJson(value);
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        onChange(parsed);
        setJsonError(null);
      } else {
        setJsonError("Data must be an array");
      }
    } catch {
      setJsonError("Invalid JSON");
    }
  };

  const currentDatasetKey = Object.entries(SAMPLE_DATASETS).find(
    ([, ds]) => JSON.stringify(ds.data) === JSON.stringify(data)
  )?.[0];

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Data Source
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sample Dataset</InputLabel>
        <Select
          value={currentDatasetKey || ""}
          label="Sample Dataset"
          onChange={(e) => handleDatasetSelect(e.target.value)}
        >
          {Object.entries(SAMPLE_DATASETS).map(([key, dataset]) => (
            <MenuItem key={key} value={key}>
              {dataset.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`${data.length} data points`}
          size="small"
          color="primary"
          variant="outlined"
        />
        {data[0] && (
          <Chip
            label={`${Object.keys(data[0]).length} fields`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Custom JSON"
        placeholder='[{"label": "A", "value": 10}]'
        value={customJson}
        onChange={(e) => handleJsonChange(e.target.value)}
        error={!!jsonError}
        sx={{ fontFamily: "monospace", mb: 1 }}
      />

      {jsonError && <Alert severity="error">{jsonError}</Alert>}
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/DataEditor.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add DataEditor with JSON support"
```

---

### Task 8: Create Theme Selector Component

**Files:**
- Create: `app/pages/demos/playground/_components/ConfigPanel/ThemeSelector.tsx`
- Test: `app/pages/demos/playground/__tests__/ThemeSelector.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/ThemeSelector.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSelector } from "../_components/ConfigPanel/ThemeSelector";

describe("ThemeSelector", () => {
  it("should render all theme options", () => {
    render(<ThemeSelector value="indigo" onChange={vi.fn()} />);
    expect(screen.getByText("Indigo")).toBeInTheDocument();
    expect(screen.getByText("Emerald")).toBeInTheDocument();
    expect(screen.getByText("Amber")).toBeInTheDocument();
  });

  it("should call onChange when theme clicked", () => {
    const onChange = vi.fn();
    render(<ThemeSelector value="indigo" onChange={onChange} />);
    fireEvent.click(screen.getByText("Emerald"));
    expect(onChange).toHaveBeenCalledWith("emerald");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/ThemeSelector.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/ConfigPanel/ThemeSelector.tsx
import { Box, Typography, Tooltip } from "@mui/material";

import { THEME_PRESETS } from "../../_constants";

interface ThemeSelectorProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Theme
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {THEME_PRESETS.map((theme) => (
          <Tooltip key={theme.id} title={theme.name} arrow>
            <Box
              onClick={() => onChange(theme.id)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: theme.primary,
                cursor: "pointer",
                border: value === theme.id ? "3px solid black" : "2px solid transparent",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/ThemeSelector.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add ThemeSelector component"
```

---

### Task 9: Create Config Panel Index

**Files:**
- Create: `app/pages/demos/playground/_components/ConfigPanel/index.tsx`
- Test: `app/pages/demos/playground/__tests__/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/ConfigPanel.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfigPanel } from "../_components/ConfigPanel";
import { SAMPLE_DATASETS } from "../_constants";

describe("ConfigPanel", () => {
  it("should render all config sections", () => {
    render(
      <ConfigPanel
        chartType="line"
        data={SAMPLE_DATASETS.sales.data}
        config={{ xAxis: "label", yAxis: "value", color: "#6366f1" }}
        themeId="indigo"
        onChartTypeChange={() => {}}
        onDataChange={() => {}}
        onConfigChange={() => {}}
        onThemeChange={() => {}}
      />
    );
    expect(screen.getByText(/chart type/i)).toBeInTheDocument();
    expect(screen.getByText(/data source/i)).toBeInTheDocument();
    expect(screen.getByText(/theme/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/ConfigPanel.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/ConfigPanel/index.tsx
import { Paper, Stack, Divider } from "@mui/material";

import { ChartTypeSelector } from "./ChartTypeSelector";
import { DataEditor } from "./DataEditor";
import { ThemeSelector } from "./ThemeSelector";
import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface ConfigPanelProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  themeId: string;
  onChartTypeChange: (type: ChartType) => void;
  onDataChange: (data: Datum[]) => void;
  onConfigChange: (config: PlaygroundConfig) => void;
  onThemeChange: (themeId: string) => void;
}

export function ConfigPanel({
  chartType,
  data,
  config,
  themeId,
  onChartTypeChange,
  onDataChange,
  onConfigChange,
  onThemeChange,
}: ConfigPanelProps) {
  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Stack spacing={3}>
        <ChartTypeSelector value={chartType} onChange={onChartTypeChange} />

        <Divider />

        <DataEditor data={data} onChange={onDataChange} />

        <Divider />

        <ThemeSelector value={themeId} onChange={onThemeChange} />
      </Stack>
    </Paper>
  );
}

export { ChartTypeSelector } from "./ChartTypeSelector";
export { DataEditor } from "./DataEditor";
export { ThemeSelector } from "./ThemeSelector";
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/ConfigPanel.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add ConfigPanel composite component"
```

---

### Task 10: Create Chart Renderer Component

**Files:**
- Create: `app/pages/demos/playground/_components/PreviewPane/ChartRenderer.tsx`
- Test: `app/pages/demos/playground/__tests__/ChartRenderer.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/ChartRenderer.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartRenderer } from "../_components/PreviewPane/ChartRenderer";
import { SAMPLE_DATASETS } from "../_constants";

describe("ChartRenderer", () => {
  const defaultProps = {
    chartType: "line" as const,
    data: SAMPLE_DATASETS.sales.data,
    config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
  };

  it("should render a chart container", () => {
    render(<ChartRenderer {...defaultProps} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  it("should show empty state when no data", () => {
    render(<ChartRenderer {...defaultProps} data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/ChartRenderer.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/PreviewPane/ChartRenderer.tsx
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

// Dynamic imports for code splitting
const LineChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.LineChart),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.BarChart),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.PieChart),
  { ssr: false }
);

interface ChartRendererProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  height?: number;
}

export function ChartRenderer({
  chartType,
  data,
  config,
  height = 400,
}: ChartRendererProps) {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey.50",
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  const commonProps = {
    data,
    config: {
      xAxis: config.xAxis,
      yAxis: config.yAxis,
      color: config.color,
      showCrosshair: config.showCrosshair ?? true,
    },
    height,
    animated: true,
  };

  switch (chartType) {
    case "line":
      return (
        <LineChart
          {...commonProps}
          config={{ ...commonProps.config, showArea: config.showArea }}
        />
      );
    case "bar":
      return <BarChart {...commonProps} />;
    case "area":
      return <AreaChart {...commonProps} />;
    case "pie":
      return (
        <PieChart
          data={data}
          config={{
            value: { field: config.yAxis, type: "number" },
            category: { field: config.xAxis, type: "string" },
            color: config.color,
          }}
          height={height}
        />
      );
    case "scatter":
      // Fallback to line for now
      return <LineChart {...commonProps} />;
    default:
      return null;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/ChartRenderer.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add ChartRenderer with dynamic imports"
```

---

### Task 11: Create Preview Pane Component

**Files:**
- Create: `app/pages/demos/playground/_components/PreviewPane/index.tsx`

**Step 1: Create the component**

```typescript
// app/pages/demos/playground/_components/PreviewPane/index.tsx
import { Paper, Box } from "@mui/material";

import { ChartRenderer } from "./ChartRenderer";
import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface PreviewPaneProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  height?: number;
}

export function PreviewPane({ chartType, data, config, height = 400 }: PreviewPaneProps) {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: height + 100,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={2}
    >
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ChartRenderer
          chartType={chartType}
          data={data}
          config={config}
          height={height}
        />
      </Box>
    </Paper>
  );
}

export { ChartRenderer } from "./ChartRenderer";
```

**Step 2: Commit**

```bash
git add app/pages/demos/playground/_components
git commit -m "feat(playground): add PreviewPane component"
```

---

### Task 12: Create Code Output Component

**Files:**
- Create: `app/pages/demos/playground/_components/CodeOutput/index.tsx`
- Test: `app/pages/demos/playground/__tests__/CodeOutput.test.tsx`

**Step 1: Write the failing test**

```typescript
// app/pages/demos/playground/__tests__/CodeOutput.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeOutput, generateCode } from "../_components/CodeOutput";
import { SAMPLE_DATASETS } from "../_constants";

describe("CodeOutput", () => {
  it("should render generated code", () => {
    render(
      <CodeOutput
        chartType="line"
        data={SAMPLE_DATASETS.sales.data}
        config={{ xAxis: "label", yAxis: "value", color: "#6366f1" }}
      />
    );
    expect(screen.getByText(/LineChart/)).toBeInTheDocument();
  });

  it("should generate valid React code", () => {
    const code = generateCode({
      chartType: "bar",
      data: [{ label: "A", value: 10 }],
      config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
    });
    expect(code).toContain("BarChart");
    expect(code).toContain("@vizualni/react");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test app/pages/demos/playground/__tests__/CodeOutput.test.tsx`

Expected: FAIL - module not found

**Step 3: Create the component**

```typescript
// app/pages/demos/playground/_components/CodeOutput/index.tsx
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface GenerateCodeOptions {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
}

export function generateCode({ chartType, data, config }: GenerateCodeOptions): string {
  const chartComponent =
    chartType === "line"
      ? "LineChart"
      : chartType === "bar"
        ? "BarChart"
        : chartType === "area"
          ? "AreaChart"
          : chartType === "pie"
            ? "PieChart"
            : "ScatterChart";

  const dataStr = JSON.stringify(data.slice(0, 4), null, 2);
  const truncated = data.length > 4 ? "\n  // ..." : "";

  const configStr =
    chartType === "pie"
      ? `{
    value: { field: "${config.yAxis}", type: "number" },
    category: { field: "${config.xAxis}", type: "string" },
    color: "${config.color}",
  }`
      : `{
    xAxis: "${config.xAxis}",
    yAxis: "${config.yAxis}",
    color: "${config.color}",
  }`;

  return `import { ${chartComponent} } from '@vizualni/react';

function MyChart() {
  const data = ${dataStr}${truncated};

  return (
    <${chartComponent}
      data={data}
      config={${configStr}}
      height={400}
    />
  );
}

export default MyChart;`;
}

interface CodeOutputProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
}

export function CodeOutput({ chartType, data, config }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const code = generateCode({ chartType, data, config });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Generated Code
        </Typography>
        <Tooltip title={copied ? "Copied!" : "Copy code"}>
          <IconButton onClick={handleCopy} size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          borderRadius: 2,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          overflow: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </Box>
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/pages/demos/playground/__tests__/CodeOutput.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/pages/demos/playground/_components app/pages/demos/playground/__tests__
git commit -m "feat(playground): add CodeOutput with copy functionality"
```

---

### Task 13: Integrate New Playground Page

**Files:**
- Modify: `app/pages/demos/playground/index.tsx`

**Step 1: Replace existing playground with new implementation**

```typescript
// app/pages/demos/playground/index.tsx
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Container, Grid, Box, Typography, Tabs, Tab } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";

import { ConfigPanel } from "./_components/ConfigPanel";
import { PreviewPane } from "./_components/PreviewPane";
import { CodeOutput } from "./_components/CodeOutput";
import { usePlaygroundStore } from "./_hooks/usePlaygroundStore";
import { useUrlState } from "./_hooks/useUrlState";
import { SAMPLE_DATASETS, getThemeById } from "./_constants";

export default function PlaygroundPage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const {
    chartType,
    data,
    config,
    themeId,
    ui,
    setChartType,
    setData,
    setConfig,
    setThemeId,
    setActiveTab,
  } = usePlaygroundStore();

  const { getStateFromUrl } = useUrlState();

  // Load state from URL on mount
  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState) {
      if (urlState.chartType) setChartType(urlState.chartType);
      if (urlState.data) setData(urlState.data);
      if (urlState.config) setConfig(urlState.config);
      if (urlState.themeId) setThemeId(urlState.themeId);
    } else if (data.length === 0) {
      // Load default dataset
      setData(SAMPLE_DATASETS.sales.data);
      setConfig({ xAxis: "label", yAxis: "value", color: "#6366f1" });
    }
  }, []);

  // Update color when theme changes
  useEffect(() => {
    const theme = getThemeById(themeId);
    if (theme) {
      setConfig({ ...config, color: theme.primary });
    }
  }, [themeId]);

  const title =
    locale === "sr" ? "🎮 Igralište za grafikone" : "🎮 Chart Playground";

  const description =
    locale === "sr"
      ? "Eksperimentišite sa konfiguracijom grafikona u realnom vremenu"
      : "Experiment with chart configurations in real-time";

  return (
    <>
      <Head>
        <title>{`Playground - Vizualni Admin`}</title>
        <meta name="description" content={description} />
      </Head>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ConfigPanel
              chartType={chartType}
              data={data}
              config={config}
              themeId={themeId}
              onChartTypeChange={setChartType}
              onDataChange={setData}
              onConfigChange={setConfig}
              onThemeChange={setThemeId}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Tabs
                value={ui.activeTab}
                onChange={(_, v) => setActiveTab(v)}
              >
                <Tab label={<Trans>Preview</Trans>} value="preview" />
                <Tab label={<Trans>Code</Trans>} value="code" />
              </Tabs>
            </Box>

            {ui.activeTab === "preview" ? (
              <PreviewPane
                chartType={chartType}
                data={data}
                config={config}
                height={450}
              />
            ) : (
              <CodeOutput
                chartType={chartType}
                data={data}
                config={config}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
```

**Step 2: Test the integration**

Run: `npm run build`

Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add app/pages/demos/playground/index.tsx
git commit -m "feat(playground): integrate new component architecture"
```

---

### Task 14: Run Full Test Suite

**Step 1: Run all playground tests**

Run: `npm test app/pages/demos/playground`

Expected: All tests pass

**Step 2: Run linting**

Run: `npm run lint`

Expected: No errors

**Step 3: Build check**

Run: `npm run build`

Expected: Build succeeds

---

## Phase 2: Export & Sharing (Future Tasks)

Tasks for Phase 2 (Data & Export) are deferred and include:
- Task 15: Export Panel with PNG/SVG/Code/URL options
- Task 16: html-to-image integration for PNG export
- Task 17: Share URL generation with clipboard copy
- Task 18: CSV paste support in DataEditor

## Phase 3: UX Polish (Future Tasks)

Tasks for Phase 3 (UX Polish) are deferred and include:
- Task 19: Guided tour component with joyride/react-joyride
- Task 20: Keyboard shortcuts with useKeyboard hook
- Task 21: Responsive layout improvements
- Task 22: Dark mode toggle
- Task 23: Loading states and animations

## Phase 4: Advanced (Future Tasks)

Tasks for Phase 4 (Advanced) are deferred and include:
- Task 24: Multi-framework code output (Vue, Vanilla JS)
- Task 25: Custom theme builder
- Task 26: Chart annotations
- Task 27: Performance metrics display
- Task 28: Embed code generator

---

## Notes for Implementation

1. **Test Location**: All tests go in `app/pages/demos/playground/__tests__/`
2. **Import Path**: Use `@/exports/charts` for chart components
3. **State Pattern**: Follow existing Zustand pattern in `app/stores/`
4. **i18n**: Use `@lingui` for translations, support `sr` and `en`
5. **Commit Often**: After each task, commit with descriptive message
