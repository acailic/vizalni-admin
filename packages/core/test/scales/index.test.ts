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

  describe("edge cases", () => {
    it("should handle single data point", () => {
      const singleData: Datum[] = [
        { date: new Date("2024-01-01"), value: 50, category: "A" },
      ];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(singleData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.x).toBeDefined();
      expect(scales.y).toBeDefined();
      // Single point should still have valid domain
      expect(scales.x.domain().length).toBe(2);
    });

    it("should handle zero values", () => {
      const zeroData: Datum[] = [
        { category: "A", value: 0 },
        { category: "B", value: 0 },
        { category: "C", value: 0 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(zeroData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.y).toBeDefined();
      expect(scales.y.domain()[0]).toBe(0);
      expect(scales.y.domain()[1]).toBeGreaterThanOrEqual(0);
    });

    it("should handle negative values", () => {
      const negativeData: Datum[] = [
        { category: "A", value: -10 },
        { category: "B", value: 20 },
        { category: "C", value: -5 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(negativeData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.y).toBeDefined();
      // Should handle negative values gracefully
      const [yMin, yMax] = scales.y.domain();
      expect(yMin).toBeLessThanOrEqual(-10);
      expect(yMax).toBeGreaterThanOrEqual(20);
    });

    it("should handle same date values", () => {
      const sameDateData: Datum[] = [
        { date: new Date("2024-01-01"), value: 10 },
        { date: new Date("2024-01-01"), value: 20 },
        { date: new Date("2024-01-01"), value: 30 },
      ];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(sameDateData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.x).toBeDefined();
      // Should still produce a valid domain
      expect(scales.x.domain().length).toBe(2);
    });

    it("should handle large number of categories in bar chart", () => {
      const manyCategories: Datum[] = Array.from({ length: 50 }, (_, i) => ({
        category: `Cat${i}`,
        value: i * 10,
      }));
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(manyCategories, config, {
        width: 1000,
        height: 400,
      });

      expect(scales.x).toBeDefined();
      // Band scale should handle many categories
      expect(typeof scales.x("Cat0")).toBe("number");
    });

    it("should handle pie chart with zero values", () => {
      const zeroPieData: Datum[] = [
        { category: "A", value: 0 },
        { category: "B", value: 0 },
      ];
      const config: ChartConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
      };

      const scales = computeScales(zeroPieData, config, {
        width: 400,
        height: 400,
      });

      expect(scales.color).toBeDefined();
    });

    it("should handle very small values", () => {
      const smallData: Datum[] = [
        { category: "A", value: 0.0001 },
        { category: "B", value: 0.0002 },
        { category: "C", value: 0.0003 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(smallData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.y).toBeDefined();
      const [yMin, yMax] = scales.y.domain();
      expect(yMax).toBeGreaterThanOrEqual(0.0003);
    });

    it("should handle very large values", () => {
      const largeData: Datum[] = [
        { category: "A", value: 1000000000 },
        { category: "B", value: 2000000000 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(largeData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.y).toBeDefined();
      expect(scales.y.domain()[1]).toBeGreaterThanOrEqual(2000000000);
    });

    it("should handle empty data array for line chart without crashing", () => {
      const emptyData: Datum[] = [];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      // Should not throw and return valid scales
      const scales = computeScales(emptyData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.x).toBeDefined();
      expect(scales.y).toBeDefined();
      expect(typeof scales.x).toBe("function");
      expect(typeof scales.y).toBe("function");

      // Domain should contain valid dates, not Invalid Date
      const xDomain = scales.x.domain();
      expect(xDomain.length).toBe(2);
      expect(xDomain[0] instanceof Date).toBe(true);
      expect(xDomain[1] instanceof Date).toBe(true);
      expect(isNaN(xDomain[0].getTime())).toBe(false);
      expect(isNaN(xDomain[1].getTime())).toBe(false);

      // Y domain should be valid numbers
      const yDomain = scales.y.domain();
      expect(yDomain.length).toBe(2);
      expect(typeof yDomain[0]).toBe("number");
      expect(typeof yDomain[1]).toBe("number");
    });

    it("should handle empty data array for bar chart without crashing", () => {
      const emptyData: Datum[] = [];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const scales = computeScales(emptyData, config, {
        width: 600,
        height: 400,
      });

      expect(scales.x).toBeDefined();
      expect(scales.y).toBeDefined();
      expect(typeof scales.x).toBe("function");
      expect(typeof scales.y).toBe("function");
    });
  });
});
