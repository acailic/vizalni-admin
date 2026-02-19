import { describe, it, expect } from "vitest";

import {
  chartRegistry,
  getChartDefinition,
  isRegisteredChartType,
} from "@/chart-registry";

describe("chartRegistry", () => {
  it("contains the bar chart", () => {
    const types = chartRegistry.map((c) => c.type);
    expect(types).toContain("bar");
  });

  it("getChartDefinition returns the correct definition", () => {
    const def = getChartDefinition("bar");
    expect(def.type).toBe("bar");
    expect(typeof def.schema.parse).toBe("function");
    expect(typeof def.getInitialConfig).toBe("function");
  });

  it("isRegisteredChartType returns true for bar", () => {
    expect(isRegisteredChartType("bar")).toBe(true);
  });

  it("isRegisteredChartType returns false for unknown type", () => {
    expect(isRegisteredChartType("unknown-type")).toBe(false);
  });
});
