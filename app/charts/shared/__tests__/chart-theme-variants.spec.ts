import { describe, it, expect } from "vitest";

import { getChartThemeVariant } from "../chart-theme-variants";

describe("chart-theme-variants", () => {
  it("should return default variant when no variant specified", () => {
    const theme = getChartThemeVariant("default");
    expect(theme.colors.primary).toBe("#3B82F6");
  });

  it("should return modern variant with softer colors", () => {
    const theme = getChartThemeVariant("modern");
    expect(theme.stroke.barRadius).toBeGreaterThan(4);
  });

  it("should return minimal variant with thin strokes", () => {
    const theme = getChartThemeVariant("minimal");
    expect(theme.stroke.lineWidth).toBeLessThan(2);
  });

  it("should return dark variant with dark background", () => {
    const theme = getChartThemeVariant("dark");
    expect(theme.colors.tooltip.background).toBeDefined();
  });

  it("should throw for invalid variant", () => {
    expect(() => getChartThemeVariant("invalid" as any)).toThrow();
  });
});
