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
