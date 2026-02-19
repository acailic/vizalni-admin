// @vitest-environment jsdom
// app/charts/shared/__tests__/use-chart-theme.spec.ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useChartTheme, useChartThemeWithVariant } from "../use-chart-theme";

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
