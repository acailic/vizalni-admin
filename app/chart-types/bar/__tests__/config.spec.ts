import { describe, it, expect } from "vitest";

import { barChartSchema } from "@/chart-types/bar/config";

describe("barChartSchema", () => {
  it("parses a valid bar chart config", () => {
    const input = {
      key: "abc123",
      chartType: "bar",
      cubeIri: "https://example.com/cube",
      fields: {
        x: { componentId: "dimension-1" },
        y: { componentId: "measure-1" },
      },
    };
    const result = barChartSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.chartType).toBe("bar");
    }
  });

  it("rejects config missing required fields", () => {
    const result = barChartSchema.safeParse({ chartType: "bar" });
    expect(result.success).toBe(false);
  });

  it("rejects config with wrong chart type", () => {
    const result = barChartSchema.safeParse({
      key: "abc",
      chartType: "line",
      cubeIri: "https://example.com/cube",
      fields: { x: { componentId: "d1" }, y: { componentId: "m1" } },
    });
    expect(result.success).toBe(false);
  });
});
