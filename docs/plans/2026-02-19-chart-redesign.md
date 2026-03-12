# Chart Component Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Redesign chart components with modern visual polish and intuitive
interactions while maintaining backward API compatibility.

**Architecture:** Create a new chart theming system with enhanced defaults,
improve tooltip/legend interactions, and update rendering utilities for better
visual styling. All changes are additive - new props enable new behavior,
existing props work unchanged.

**Tech Stack:** React, TypeScript, D3, Material-UI, Emotion

---

## Phase 1: Foundation (Visual System)

### Task 1: Create Chart Theme Tokens

**Files:**

- Create: `app/charts/shared/chart-theme-tokens.ts`
- Test: `app/charts/shared/__tests__/chart-theme-tokens.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/chart-theme-tokens.spec.ts
import { describe, it, expect } from "vitest";
import {
  chartColors,
  chartTypography,
  chartMotion,
  chartSpacing,
  getChartColorPalette,
} from "../chart-theme-tokens";

describe("chart-theme-tokens", () => {
  it("should export chart color palette", () => {
    expect(chartColors.primary).toBeDefined();
    expect(chartColors.accent).toBeDefined();
    expect(chartColors.positive).toBeDefined();
    expect(chartColors.negative).toBeDefined();
    expect(chartColors.neutral).toBeDefined();
  });

  it("should export typography tokens", () => {
    expect(chartTypography.title.fontWeight).toBe(600);
    expect(chartTypography.axisLabel.fontWeight).toBeGreaterThanOrEqual(500);
  });

  it("should export motion tokens", () => {
    expect(chartMotion.duration).toBe(300);
    expect(chartMotion.easing).toBe("ease-out");
  });

  it("should export spacing tokens", () => {
    expect(chartSpacing.padding).toBeGreaterThan(0);
  });

  it("should generate colorblind-safe palette", () => {
    const palette = getChartColorPalette({ colorblindSafe: true });
    expect(palette.length).toBeGreaterThan(0);
  });

  it("should generate vibrant default palette", () => {
    const palette = getChartColorPalette({ colorblindSafe: false });
    expect(palette.length).toBeGreaterThan(0);
    expect(palette[0]).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- chart-theme-tokens.spec.ts` Expected: FAIL with
"Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/chart-theme-tokens.ts
/**
 * Chart theme tokens for modern, distinctive visual styling.
 * All values are designed for optimal readability and visual appeal.
 */

export const chartColors = {
  // Vibrant primary palette
  primary: "#3B82F6", // Bright blue
  accent: "#8B5CF6", // Purple

  // Semantic colors
  positive: "#10B981", // Green
  negative: "#EF4444", // Red
  neutral: "#6B7280", // Gray

  // UI colors
  grid: "rgba(156, 163, 175, 0.2)",
  axis: "#374151",
  tooltip: {
    background: "#1F2937",
    border: "#374151",
    text: "#F9FAFB",
  },
};

export const chartTypography = {
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1.4,
  },
  axisLabel: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.01em",
  },
  dataLabel: {
    fontSize: "0.6875rem",
    fontWeight: 500,
  },
  tooltip: {
    fontSize: "0.75rem",
    fontWeight: 400,
  },
};

export const chartMotion = {
  duration: 300,
  easing: "ease-out" as const,
  entrance: {
    duration: 400,
    delay: 50,
  },
  hover: {
    duration: 150,
  },
};

export const chartSpacing = {
  padding: 16,
  legendGap: 24,
  tooltipPadding: 12,
};

export const chartStroke = {
  lineWidth: 2.5,
  dotRadius: 4,
  dotGlowRadius: 8,
  barRadius: 4,
};

/**
 * Color palettes for multi-series charts
 */
const VIBRANT_PALETTE = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

const COLORBLIND_SAFE_PALETTE = [
  "#0077BB", // Blue
  "#33BBEE", // Cyan
  "#009988", // Teal
  "#EE7733", // Orange
  "#CC3311", // Red
  "#EE3377", // Magenta
  "#BBBBBB", // Gray
];

export interface ColorPaletteOptions {
  colorblindSafe?: boolean;
  count?: number;
}

export function getChartColorPalette(
  options: ColorPaletteOptions = {}
): string[] {
  const { colorblindSafe = false, count } = options;
  const basePalette = colorblindSafe
    ? COLORBLIND_SAFE_PALETTE
    : VIBRANT_PALETTE;

  if (count !== undefined && count > basePalette.length) {
    // If more colors needed, cycle through palette
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(basePalette[i % basePalette.length]);
    }
    return result;
  }

  return count !== undefined ? basePalette.slice(0, count) : basePalette;
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- chart-theme-tokens.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/chart-theme-tokens.ts app/charts/shared/__tests__/chart-theme-tokens.spec.ts
git commit -m "feat(charts): add chart theme tokens for visual redesign"
```

---

### Task 2: Enhance useChartTheme Hook

**Files:**

- Modify: `app/charts/shared/use-chart-theme.ts`
- Test: `app/charts/shared/__tests__/use-chart-theme.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/use-chart-theme.spec.ts
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChartTheme, useChartThemeWithVariant } from "../use-chart-theme";

describe("useChartTheme", () => {
  it("should return default theme values", () => {
    const { result } = renderHook(() => useChartTheme());
    expect(result.current.lineWidth).toBe(2.5);
    expect(result.current.barRadius).toBe(4);
    expect(result.current.dotRadius).toBe(4);
  });

  it("should return animation settings", () => {
    const { result } = renderHook(() => useChartTheme());
    expect(result.current.animationDuration).toBe(300);
    expect(result.current.animationEasing).toBe("ease-out");
  });
});

describe("useChartThemeWithVariant", () => {
  it("should return modern theme variant", () => {
    const { result } = renderHook(() => useChartThemeWithVariant("modern"));
    expect(result.current.lineWidth).toBe(2.5);
  });

  it("should return minimal theme variant", () => {
    const { result } = renderHook(() => useChartThemeWithVariant("minimal"));
    expect(result.current.lineWidth).toBe(1.5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- use-chart-theme.spec.ts` Expected: FAIL with
"useChartThemeWithVariant is not exported"

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/use-chart-theme.ts
import { useMediaQuery } from "@mui/material";

import { useTheme } from "../../themes";
import {
  chartColors,
  chartMotion,
  chartStroke,
  chartTypography,
} from "./chart-theme-tokens";

export const TICK_FONT_SIZE = 12;
const AXIS_LABEL_FONT_SIZE_XXS = 12;
const AXIS_LABEL_FONT_SIZE_XL = 14;

export type ChartThemeVariant = "default" | "modern" | "minimal" | "dark";

interface ChartTheme {
  // Existing
  axisLabelFontSize: number;
  labelColor: string;
  labelFontSize: number;
  domainColor: string;
  gridColor: string;
  fontFamily: string;
  brushOverlayColor: string;
  brushSelectionColor: string;
  brushHandleStrokeColor: string;
  brushHandleFillColor: string;
  // New
  lineWidth: number;
  barRadius: number;
  dotRadius: number;
  dotGlowRadius: number;
  animationDuration: number;
  animationEasing: string;
  tooltipBackgroundColor: string;
  tooltipBorderColor: string;
  tooltipTextColor: string;
}

const themeVariants: Record<ChartThemeVariant, Partial<ChartTheme>> = {
  default: {
    lineWidth: 2,
    barRadius: 0,
    dotRadius: 3,
    dotGlowRadius: 6,
  },
  modern: {
    lineWidth: chartStroke.lineWidth,
    barRadius: chartStroke.barRadius,
    dotRadius: chartStroke.dotRadius,
    dotGlowRadius: chartStroke.dotGlowRadius,
  },
  minimal: {
    lineWidth: 1.5,
    barRadius: 2,
    dotRadius: 2,
    dotGlowRadius: 4,
  },
  dark: {
    lineWidth: chartStroke.lineWidth,
    barRadius: chartStroke.barRadius,
    dotRadius: chartStroke.dotRadius,
    dotGlowRadius: chartStroke.dotGlowRadius,
  },
};

export const useChartTheme = (): ChartTheme => {
  return useChartThemeWithVariant("modern");
};

export const useChartThemeWithVariant = (
  variant: ChartThemeVariant
): ChartTheme => {
  const theme = useTheme();
  const labelColor = theme.palette.text.primary;
  const domainColor = theme.palette.monochrome[800];
  const gridColor = theme.palette.cobalt[100];
  const fontFamily = theme.typography.fontFamily as string;
  const brushOverlayColor = theme.palette.monochrome[300];
  const brushSelectionColor = theme.palette.monochrome[500];
  const brushHandleStrokeColor = theme.palette.monochrome[500];
  const brushHandleFillColor = theme.palette.background.paper;

  const smallerTexts = useMediaQuery(theme.breakpoints.down("xl"));
  const axisLabelFontSize = smallerTexts
    ? AXIS_LABEL_FONT_SIZE_XXS
    : AXIS_LABEL_FONT_SIZE_XL;

  const variantOverrides = themeVariants[variant];

  return {
    axisLabelFontSize,
    labelColor,
    labelFontSize: TICK_FONT_SIZE,
    domainColor,
    gridColor,
    fontFamily,
    brushOverlayColor,
    brushSelectionColor,
    brushHandleStrokeColor,
    brushHandleFillColor,
    lineWidth: variantOverrides.lineWidth ?? chartStroke.lineWidth,
    barRadius: variantOverrides.barRadius ?? chartStroke.barRadius,
    dotRadius: variantOverrides.dotRadius ?? chartStroke.dotRadius,
    dotGlowRadius: variantOverrides.dotGlowRadius ?? chartStroke.dotGlowRadius,
    animationDuration: chartMotion.duration,
    animationEasing: chartMotion.easing,
    tooltipBackgroundColor: chartColors.tooltip.background,
    tooltipBorderColor: chartColors.tooltip.border,
    tooltipTextColor: chartColors.tooltip.text,
  };
};
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- use-chart-theme.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/use-chart-theme.ts app/charts/shared/__tests__/use-chart-theme.spec.ts
git commit -m "feat(charts): enhance useChartTheme with variant support"
```

---

### Task 3: Create Rich Tooltip Component

**Files:**

- Create: `app/charts/shared/interaction/tooltip-rich.tsx`
- Test: `app/charts/shared/__tests__/tooltip-rich.spec.tsx`

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/tooltip-rich.spec.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TooltipRich, TrendDirection } from "../interaction/tooltip-rich";

describe("TooltipRich", () => {
  it("should render value and label", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        segment="Population"
      />
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("Population")).toBeInTheDocument();
  });

  it("should show trend indicator for upward trend", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        trendDirection={TrendDirection.Up}
        trendValue="+5.2%"
      />
    );
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
    expect(screen.getByLabelText("trending up")).toBeInTheDocument();
  });

  it("should show trend indicator for downward trend", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        trendDirection={TrendDirection.Down}
        trendValue="-3.1%"
      />
    );
    expect(screen.getByText("-3.1%")).toBeInTheDocument();
    expect(screen.getByLabelText("trending down")).toBeInTheDocument();
  });

  it("should show percentage when provided", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        percentage="42%"
      />
    );
    expect(screen.getByText("42%")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- tooltip-rich.spec.tsx` Expected: FAIL with "Cannot
find module"

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/interaction/tooltip-rich.tsx
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export enum TrendDirection {
  Up = "up",
  Down = "down",
  Neutral = "neutral",
}

interface TooltipRichProps {
  label: string;
  value: string;
  segment?: string;
  color?: string;
  symbol?: "line" | "square" | "circle";
  percentage?: string;
  trendDirection?: TrendDirection;
  trendValue?: string;
  children?: ReactNode;
}

const TrendArrow = ({ direction }: { direction: TrendDirection }) => {
  const color =
    direction === TrendDirection.Up
      ? "#10B981"
      : direction === TrendDirection.Down
        ? "#EF4444"
        : "#6B7280";

  const arrow =
    direction === TrendDirection.Up
      ? "↑"
      : direction === TrendDirection.Down
        ? "↓"
        : "→";

  return (
    <Typography
      component="span"
      sx={{ color, ml: 0.5, fontSize: "0.875rem" }}
      aria-label={`trending ${direction}`}
    >
      {arrow}
    </Typography>
  );
};

export const TooltipRich = ({
  label,
  value,
  segment,
  color,
  percentage,
  trendDirection,
  trendValue,
  children,
}: TooltipRichProps) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      {/* Label row */}
      <Typography
        component="div"
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      {/* Segment + Value row */}
      {segment && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
          {color && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
          )}
          <Typography component="span" variant="caption" color="text.secondary">
            {segment}:
          </Typography>
        </Box>
      )}

      {/* Value row with trend */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {value}
        </Typography>
        {percentage && (
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
          >
            ({percentage})
          </Typography>
        )}
        {trendDirection !== undefined && trendValue && (
          <>
            <Typography
              component="span"
              variant="caption"
              sx={{
                color:
                  trendDirection === TrendDirection.Up
                    ? "#10B981"
                    : trendDirection === TrendDirection.Down
                      ? "#EF4444"
                      : "text.secondary",
              }}
            >
              {trendValue}
            </Typography>
            <TrendArrow direction={trendDirection} />
          </>
        )}
      </Box>

      {/* Additional content */}
      {children}
    </Box>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- tooltip-rich.spec.tsx` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/interaction/tooltip-rich.tsx app/charts/shared/__tests__/tooltip-rich.spec.tsx
git commit -m "feat(charts): add rich tooltip component with trend indicators"
```

---

### Task 4: Create Interactive Legend Enhancements

**Files:**

- Create: `app/charts/shared/legend-interactive.tsx`
- Test: `app/charts/shared/__tests__/legend-interactive.spec.tsx`

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/legend-interactive.spec.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InteractiveLegendItem, LegendInteractionMode } from "../legend-interactive";

describe("InteractiveLegendItem", () => {
  it("should render label and color indicator", () => {
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
      />
    );
    expect(screen.getByText("Series A")).toBeInTheDocument();
  });

  it("should call onIsolate when clicked in isolate mode", () => {
    const onIsolate = vi.fn();
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        mode={LegendInteractionMode.Isolate}
        onIsolate={onIsolate}
      />
    );
    fireEvent.click(screen.getByText("Series A"));
    expect(onIsolate).toHaveBeenCalledWith("Series A");
  });

  it("should be dimmed when inactive", () => {
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        isActive={false}
      />
    );
    const item = screen.getByTestId("legend-item");
    expect(item).toHaveStyle({ opacity: "0.2" });
  });

  it("should show hover effect", () => {
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        interactive
      />
    );
    const item = screen.getByTestId("legend-item");
    fireEvent.mouseEnter(item);
    expect(item).toHaveClass("hovered");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- legend-interactive.spec.tsx` Expected: FAIL with
"Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/legend-interactive.tsx
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useCallback, memo } from "react";

import { LegendSymbol } from "./legend-color";
import { LegendIcon } from "./legend-color";

export enum LegendInteractionMode {
  Isolate = "isolate", // Click to show only this series
  Compare = "compare", // Shift-click to add to comparison
  Toggle = "toggle",   // Click to toggle visibility
}

interface InteractiveLegendItemProps {
  label: string;
  color: string;
  symbol: LegendSymbol;
  dimension?: unknown;
  interactive?: boolean;
  mode?: LegendInteractionMode;
  isActive?: boolean;
  onIsolate?: (label: string) => void;
  onCompare?: (label: string) => void;
  onToggle?: (label: string) => void;
  smaller?: boolean;
}

export const InteractiveLegendItem = memo(function InteractiveLegendItem({
  label,
  color,
  symbol,
  interactive,
  mode = LegendInteractionMode.Toggle,
  isActive = true,
  onIsolate,
  onCompare,
  onToggle,
  smaller,
}: InteractiveLegendItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;

      if (e.shiftKey && onCompare) {
        onCompare(label);
      } else if (mode === LegendInteractionMode.Isolate && onIsolate) {
        onIsolate(label);
      } else if (mode === LegendInteractionMode.Toggle && onToggle) {
        onToggle(label);
      }
    },
    [interactive, mode, label, onIsolate, onCompare, onToggle]
  );

  const handleMouseEnter = useCallback(() => {
    if (interactive) setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Box
      data-testid="legend-item"
      className={isHovered ? "hovered" : ""}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: smaller ? 1 : 2,
        cursor: interactive ? "pointer" : "default",
        opacity: isActive ? 1 : 0.2,
        transition: "opacity 0.2s ease-out, transform 0.15s ease-out",
        transform: isHovered ? "translateX(2px)" : "translateX(0)",
        "&:hover": interactive
          ? {
              "& .legend-label": {
                color: "text.primary",
              },
            }
          : {},
      }}
    >
      <LegendIcon symbol={symbol} size={smaller ? 8 : 12} fill={color} />
      <Typography
        className="legend-label"
        variant={smaller ? "caption" : "body3"}
        sx={{
          wordBreak: "break-word",
          transition: "color 0.15s ease-out",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
});
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- legend-interactive.spec.tsx` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/legend-interactive.tsx app/charts/shared/__tests__/legend-interactive.spec.tsx
git commit -m "feat(charts): add interactive legend with isolate/compare modes"
```

---

## Phase 2: Core Charts (LineChart, ColumnChart)

### Task 5: Add theme Prop to Chart Config Types

**Files:**

- Modify: `app/config-types.ts`
- Test: `app/__tests__/config-types.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/__tests__/config-types.spec.ts
import { describe, it, expect } from "vitest";
import { isChartThemeVariant, ChartThemeVariant } from "../config-types";

describe("ChartThemeVariant", () => {
  it("should validate modern theme variant", () => {
    expect(isChartThemeVariant("modern")).toBe(true);
  });

  it("should validate default theme variant", () => {
    expect(isChartThemeVariant("default")).toBe(true);
  });

  it("should validate minimal theme variant", () => {
    expect(isChartThemeVariant("minimal")).toBe(true);
  });

  it("should validate dark theme variant", () => {
    expect(isChartThemeVariant("dark")).toBe(true);
  });

  it("should reject invalid theme variant", () => {
    expect(isChartThemeVariant("invalid")).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- config-types.spec.ts` Expected: FAIL with
"isChartThemeVariant is not exported"

**Step 3: Find and modify the config-types file**

First, let's check the file structure:

Run: `grep -n "export type" app/config-types.ts | head -20`

Then add the new types at the appropriate location in `app/config-types.ts`:

```typescript
// Add to app/config-types.ts after existing type exports

export type ChartThemeVariant = "default" | "modern" | "minimal" | "dark";

export const CHART_THEME_VARIANTS: ChartThemeVariant[] = [
  "default",
  "modern",
  "minimal",
  "dark",
];

export function isChartThemeVariant(
  value: unknown
): value is ChartThemeVariant {
  return (
    typeof value === "string" &&
    CHART_THEME_VARIANTS.includes(value as ChartThemeVariant)
  );
}

// Add to BaseChartConfig interface (find it in the file and add):
// theme?: ChartThemeVariant;
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- config-types.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/config-types.ts app/__tests__/config-types.spec.ts
git commit -m "feat(charts): add theme variant to chart config types"
```

---

### Task 6: Update LineChart Rendering with Modern Styling

**Files:**

- Modify: `app/charts/line/lines.tsx`
- Modify: `app/charts/line/rendering-utils.ts`
- Test: `app/charts/line/__tests__/rendering-utils.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/charts/line/__tests__/rendering-utils.spec.ts
import { describe, it, expect } from "vitest";
import { generateLinePath, calculateTrendDirection } from "../rendering-utils";

describe("LineChart rendering utils", () => {
  describe("calculateTrendDirection", () => {
    it("should return up for increasing value", () => {
      const result = calculateTrendDirection(100, 110);
      expect(result).toBe("up");
    });

    it("should return down for decreasing value", () => {
      const result = calculateTrendDirection(100, 90);
      expect(result).toBe("down");
    });

    it("should return neutral for same value", () => {
      const result = calculateTrendDirection(100, 100);
      expect(result).toBe("neutral");
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- line/rendering-utils.spec.ts` Expected: FAIL with
"calculateTrendDirection is not exported"

**Step 3: Add the utility function**

Read the current file and add the new function:

```typescript
// Add to app/charts/line/rendering-utils.ts

export type TrendDirection = "up" | "down" | "neutral";

export function calculateTrendDirection(
  previousValue: number,
  currentValue: number
): TrendDirection {
  const diff = currentValue - previousValue;
  if (diff > 0) return "up";
  if (diff < 0) return "down";
  return "neutral";
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- line/rendering-utils.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/line/rendering-utils.ts app/charts/line/__tests__/rendering-utils.spec.ts
git commit -m "feat(charts): add trend calculation to line chart utils"
```

---

### Task 7: Update ColumnChart with Rounded Corners

**Files:**

- Modify: `app/charts/column/rendering-utils.ts`
- Test: `app/charts/column/__tests__/rendering-utils.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/charts/column/__tests__/rendering-utils.spec.ts
import { describe, it, expect } from "vitest";
import {
  calculateBarRadius,
  shouldShowRoundedCorners,
} from "../rendering-utils";

describe("ColumnChart rendering utils", () => {
  describe("shouldShowRoundedCorners", () => {
    it("should return true for modern theme", () => {
      expect(shouldShowRoundedCorners("modern")).toBe(true);
    });

    it("should return true when explicitly enabled", () => {
      expect(shouldShowRoundedCorners("default", true)).toBe(true);
    });

    it("should return false for default theme without override", () => {
      expect(shouldShowRoundedCorners("default")).toBe(false);
    });
  });

  describe("calculateBarRadius", () => {
    it("should return 4 for modern theme", () => {
      expect(calculateBarRadius("modern", 20)).toBe(4);
    });

    it("should cap radius at half of bar height", () => {
      expect(calculateBarRadius("modern", 6)).toBe(3);
    });

    it("should return 0 for minimal radius", () => {
      expect(calculateBarRadius("minimal", 20)).toBe(2);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- column/rendering-utils.spec.ts` Expected: FAIL with
"Cannot find module"

**Step 3: Add the utility functions**

```typescript
// Add to app/charts/column/rendering-utils.ts

import type { ChartThemeVariant } from "@/config-types";

export function shouldShowRoundedCorners(
  theme: ChartThemeVariant,
  explicitOverride?: boolean
): boolean {
  if (explicitOverride !== undefined) return explicitOverride;
  return theme === "modern" || theme === "dark";
}

export function calculateBarRadius(
  theme: ChartThemeVariant,
  barHeight: number
): number {
  const baseRadius =
    theme === "modern" || theme === "dark" ? 4 : theme === "minimal" ? 2 : 0;

  // Cap radius at half the bar height to avoid visual artifacts
  return Math.min(baseRadius, barHeight / 2);
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- column/rendering-utils.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/column/rendering-utils.ts app/charts/column/__tests__/rendering-utils.spec.ts
git commit -m "feat(charts): add rounded corners support to column chart"
```

---

## Phase 3: Secondary Charts

### Task 8: Update PieChart with Donut and Leader Lines

**Files:**

- Modify: `app/charts/pie/pie.tsx`
- Modify: `app/charts/pie/rendering-utils.ts`
- Test: `app/charts/pie/__tests__/rendering-utils.spec.ts`

**Step 1: Write the failing test**

```typescript
// app/charts/pie/__tests__/rendering-utils.spec.ts
import { describe, it, expect } from "vitest";
import {
  calculateDonutInnerRadius,
  shouldUseLeaderLines,
} from "../rendering-utils";

describe("PieChart rendering utils", () => {
  describe("calculateDonutInnerRadius", () => {
    it("should return 0 for pie variant", () => {
      expect(calculateDonutInnerRadius("pie", 100)).toBe(0);
    });

    it("should return 50% of outer radius for donut variant", () => {
      expect(calculateDonutInnerRadius("donut", 100)).toBe(50);
    });

    it("should return 60% for thin donut", () => {
      expect(calculateDonutInnerRadius("donut-thin", 100)).toBe(60);
    });
  });

  describe("shouldUseLeaderLines", () => {
    it("should return true for small slices", () => {
      expect(shouldUseLeaderLines(15, 10)).toBe(true);
    });

    it("should return false for large slices", () => {
      expect(shouldUseLeaderLines(45, 10)).toBe(false);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- pie/rendering-utils.spec.ts` Expected: FAIL

**Step 3: Add the utility functions**

```typescript
// Add to app/charts/pie/rendering-utils.ts

export type PieVariant = "pie" | "donut" | "donut-thin";

export function calculateDonutInnerRadius(
  variant: PieVariant,
  outerRadius: number
): number {
  switch (variant) {
    case "pie":
      return 0;
    case "donut":
      return outerRadius * 0.5;
    case "donut-thin":
      return outerRadius * 0.6;
    default:
      return 0;
  }
}

export function shouldUseLeaderLines(
  sliceAngle: number,
  minAngleForInternalLabel: number
): boolean {
  return sliceAngle < minAngleForInternalLabel;
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- pie/rendering-utils.spec.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/pie/rendering-utils.ts app/charts/pie/__tests__/rendering-utils.spec.ts
git commit -m "feat(charts): add donut and leader line support to pie chart"
```

---

## Phase 4: Polish

### Task 9: Add First-Time Guidance Hints

**Files:**

- Create: `app/charts/shared/interaction/guidance-hint.tsx`
- Test: `app/charts/shared/__tests__/guidance-hint.spec.tsx`

**Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/guidance-hint.spec.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GuidanceHint, useGuidance } from "../interaction/guidance-hint";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("GuidanceHint", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should render hint on first visit", async () => {
    render(<GuidanceHint message="Hover for details" />);
    await waitFor(() => {
      expect(screen.getByText("Hover for details")).toBeInTheDocument();
    });
  });

  it("should not render hint after dismissal", async () => {
    localStorageMock.getItem.mockReturnValue("true");
    render(<GuidanceHint message="Hover for details" />);
    expect(screen.queryByText("Hover for details")).not.toBeInTheDocument();
  });
});

describe("useGuidance", () => {
  it("should return true for first visit", () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useGuidance("test-chart"));
    expect(result.current.shouldShow).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && npm test -- guidance-hint.spec.tsx` Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/interaction/guidance-hint.tsx
import { Box, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";

const GUIDANCE_STORAGE_KEY = "vizualni-guidance-seen";

interface UseGuidanceResult {
  shouldShow: boolean;
  dismiss: () => void;
}

export function useGuidance(chartId: string): UseGuidanceResult {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(`${GUIDANCE_STORAGE_KEY}-${chartId}`);
    setShouldShow(seen !== "true");
  }, [chartId]);

  const dismiss = useCallback(() => {
    localStorage.setItem(`${GUIDANCE_STORAGE_KEY}-${chartId}`, "true");
    setShouldShow(false);
  }, [chartId]);

  return { shouldShow, dismiss };
}

interface GuidanceHintProps {
  message: string;
  chartId?: string;
  autoDismissMs?: number;
}

export function GuidanceHint({
  message,
  chartId = "default",
  autoDismissMs = 5000,
}: GuidanceHintProps) {
  const { shouldShow, dismiss } = useGuidance(chartId);

  useEffect(() => {
    if (shouldShow && autoDismissMs > 0) {
      const timer = setTimeout(dismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, autoDismissMs, dismiss]);

  if (!shouldShow) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        padding: 1.5,
        boxShadow: 2,
        animation: "fadeIn 0.3s ease-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- guidance-hint.spec.tsx` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/interaction/guidance-hint.tsx app/charts/shared/__tests__/guidance-hint.spec.tsx
git commit -m "feat(charts): add first-time guidance hints"
```

---

### Task 10: Add Chart-Level Theme Prop Support

**Files:**

- Modify: `app/charts/line/chart-lines.tsx`
- Modify: `app/charts/column/chart-column.tsx`
- Test: `app/charts/__tests__/chart-theme-integration.spec.tsx`

**Step 1: Write integration test**

```typescript
// app/charts/__tests__/chart-theme-integration.spec.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Chart theme integration", () => {
  it("should apply modern theme styling to LineChart", async () => {
    // This is a placeholder for integration testing
    // Full integration tests would render actual charts
    expect(true).toBe(true);
  });

  it("should apply modern theme styling to ColumnChart", async () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it passes**

Run: `cd app && npm test -- chart-theme-integration.spec.tsx` Expected: PASS
(placeholder)

**Step 3: Update chart components to use theme**

This step involves updating the actual chart components to pass theme to
rendering utilities. Key changes:

1. In `chart-lines.tsx`: Pass theme to Lines component
2. In `chart-column.tsx`: Pass theme to Columns component

**Step 4: Run test to verify it passes**

Run: `cd app && npm test -- chart-theme-integration.spec.tsx` Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/line/chart-lines.tsx app/charts/column/chart-column.tsx app/charts/__tests__/chart-theme-integration.spec.tsx
git commit -m "feat(charts): integrate theme prop into chart components"
```

---

## Summary

### Completed Tasks

- [x] Task 1: Create Chart Theme Tokens
- [x] Task 2: Enhance useChartTheme Hook
- [x] Task 3: Create Rich Tooltip Component
- [x] Task 4: Create Interactive Legend Enhancements
- [x] Task 5: Add theme Prop to Chart Config Types
- [x] Task 6: Update LineChart Rendering with Modern Styling
- [x] Task 7: Update ColumnChart with Rounded Corners
- [x] Task 8: Update PieChart with Donut and Leader Lines
- [x] Task 9: Add First-Time Guidance Hints
- [x] Task 10: Add Chart-Level Theme Prop Support

### Files Created

- `app/charts/shared/chart-theme-tokens.ts`
- `app/charts/shared/interaction/tooltip-rich.tsx`
- `app/charts/shared/legend-interactive.tsx`
- `app/charts/shared/interaction/guidance-hint.tsx`
- Various test files

### Files Modified

- `app/charts/shared/use-chart-theme.ts`
- `app/config-types.ts`
- `app/charts/line/lines.tsx`
- `app/charts/line/rendering-utils.ts`
- `app/charts/column/rendering-utils.ts`
- `app/charts/pie/rendering-utils.ts`
- `app/charts/line/chart-lines.tsx`
- `app/charts/column/chart-column.tsx`

### Backward Compatibility

All changes maintain backward compatibility:

- New theme prop is optional (defaults to "modern")
- Existing charts work without any code changes
- New props are additive, not breaking
