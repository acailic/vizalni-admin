import { describe, it, expect } from "vitest";

import { getChartThemeVariant } from "../chart-theme-variants";

describe("chart-theme-variants", () => {
  it("should return default variant when no variant specified", () => {
    const theme = getChartThemeVariant("default");
    expect(theme.colors.primary).toBe("#3B82F6");
  });

  it("should return modern variant with softer colors", () => {
    const theme = getChartThemeVariant("modern");
    expect(theme.stroke.barRadius).toBe(8);
  });

  it("should return minimal variant with thin strokes", () => {
    const theme = getChartThemeVariant("minimal");
    expect(theme.stroke.lineWidth).toBe(1);
  });

  it("should return dark variant with dark-optimized colors", () => {
    const theme = getChartThemeVariant("dark");
    expect(theme.colors.primary).toBe("#60A5FA"); // Lighter blue for dark mode
    expect(theme.colors.tooltip.background).toBe("#111827");
  });

  it("should throw for invalid variant", () => {
    // @ts-expect-error - Testing runtime error for invalid variant
    expect(() => getChartThemeVariant("invalid")).toThrow();
  });
});
