import { describe, it, expect } from "vitest";
import { computeScales } from "../../src/scales/index";
import type { ChartConfig } from "../../src/config";
import type { Datum } from "../../src/types";

describe("computeScales", () => {
  const data: Datum[] = [
    { date: new Date("2024-01-01"), value: 10, category: "A" },
    { date: new Date("2024-02-01"), value: 20, category: "B" },
    { date: new Date("2024-03-01"), value: 30, category: "A" },
  ];

  it("should compute scales for line chart", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const scales = computeScales(data, config, { width: 600, height: 400 });

    expect(scales.x).toBeDefined();
    expect(scales.y).toBeDefined();
    expect(scales.x.domain().length).toBe(2);
    expect(scales.y.domain()[0]).toBe(0);
    expect(scales.y.domain()[1]).toBeGreaterThanOrEqual(30);
  });

  it("should compute color scale when segment is present", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
      segment: { field: "category", type: "string" },
    };

    const scales = computeScales(data, config, { width: 600, height: 400 });

    expect(scales.color).toBeDefined();
    expect(scales.color?.domain()).toEqual(["A", "B"]);
  });
});
