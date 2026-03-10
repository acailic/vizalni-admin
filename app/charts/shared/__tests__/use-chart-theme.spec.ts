// @vitest-environment jsdom
// app/charts/shared/__tests__/use-chart-theme.spec.ts
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, it, expect, vi } from "vitest";

import {
  useChartTheme,
  useChartThemeWithVariant,
  ChartThemeProvider,
} from "../use-chart-theme";

// Mock the theme and MUI hooks
vi.mock("../../../themes", () => ({
  useTheme: () => ({
    palette: {
      text: { primary: "#1F2937" },
      monochrome: {
        800: "#374151",
        500: "#6B7280",
        300: "#D1D5DB",
      },
      cobalt: { 100: "#E0E7FF" },
      background: { paper: "#FFFFFF" },
    },
    typography: { fontFamily: "Inter, sans-serif" },
    breakpoints: { down: () => () => false },
  }),
}));

vi.mock("@mui/material", () => ({
  useMediaQuery: () => false,
}));

describe("useChartTheme", () => {
  it("should return default theme values (modern variant by default)", () => {
    const { result } = renderHook(() => useChartTheme());
    expect(result.current.lineWidth).toBe(2.5);
    expect(result.current.barRadius).toBe(8); // Modern variant has barRadius 8
    expect(result.current.dotRadius).toBe(5); // Modern variant has dotRadius 5
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
    expect(result.current.barRadius).toBe(8);
  });

  it("should return minimal theme variant", () => {
    const { result } = renderHook(() => useChartThemeWithVariant("minimal"));
    expect(result.current.lineWidth).toBe(1); // Minimal has thin lineWidth 1
    expect(result.current.barRadius).toBe(2);
  });
});

describe("useChartTheme with variants via context", () => {
  it("should return default theme when no provider", () => {
    const { result } = renderHook(() => useChartTheme());
    expect(result.current.labelFontSize).toBeDefined();
  });

  it("should return modern theme when wrapped in provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ChartThemeProvider, { variant: "modern" }, children);

    const { result } = renderHook(() => useChartTheme(), { wrapper });
    expect(result.current.barRadius).toBe(8); // Modern has barRadius 8
  });

  it("should return minimal theme with thin strokes", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ChartThemeProvider, { variant: "minimal" }, children);

    const { result } = renderHook(() => useChartTheme(), { wrapper });
    expect(result.current.lineWidth).toBe(1); // Minimal has lineWidth 1
  });
});
