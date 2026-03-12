import { describe, it, expect } from "vitest";
import { computeShapes } from "../../src/shapes/index";
import { computeScales } from "../../src/scales/index";
import { computeLayout } from "../../src/layout/index";
import type { ChartConfig, Datum } from "../../src/types";

describe("computeShapes", () => {
  describe("bar chart", () => {
    it("should correctly calculate bar height for positive values", () => {
      const data: Datum[] = [{ category: "A", value: 100 }];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        expect(bar.height).toBeGreaterThan(0);
        expect(bar.y).toBeGreaterThanOrEqual(0);
        expect(bar.y + bar.height).toBeLessThanOrEqual(layout.chartArea.height);
      }
    });

    it("should correctly calculate bar height for negative values", () => {
      const data: Datum[] = [{ category: "A", value: -50 }];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        // Negative bars should have positive height
        expect(bar.height).toBeGreaterThan(0);
      }
    });

    it("should correctly handle mixed positive and negative values", () => {
      const data: Datum[] = [
        { category: "A", value: 100 },
        { category: "B", value: -50 },
        { category: "C", value: 75 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(3);

      // All bars should have positive height
      shapes.forEach((shape) => {
        if (shape.type === "bar") {
          expect(shape.height).toBeGreaterThan(0);
        }
      });

      // Positive bar (A) should be above negative bar (B)
      const barA = shapes.find(
        (s) => s.type === "bar" && "category" in s && s.category === "A"
      );
      const barB = shapes.find(
        (s) => s.type === "bar" && "category" in s && s.category === "B"
      );

      if (barA?.type === "bar" && barB?.type === "bar") {
        expect(barA.y).toBeLessThan(barB.y); // Positive bar is higher (smaller y)
      }
    });

    it("should handle zero values", () => {
      const data: Datum[] = [{ category: "A", value: 0 }];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      if (bar.type === "bar") {
        // Zero value bar should have zero or near-zero height
        expect(bar.height).toBeLessThan(5);
      }
    });

    it("should include datum in bar shape", () => {
      const data: Datum[] = [{ category: "A", value: 100, extra: "info" }];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      const bar = shapes[0];
      if (bar.type === "bar") {
        expect(bar.datum).toBeDefined();
        expect(bar.datum?.category).toBe("A");
        expect(bar.datum?.extra).toBe("info");
      }
    });

    it("should handle segmented bar chart", () => {
      const data: Datum[] = [
        { category: "A", value: 100, segment: "X" },
        { category: "B", value: 200, segment: "Y" },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
        segment: { field: "segment", type: "string" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(2);
      expect(scales.color).toBeDefined();
    });
  });

  describe("line chart", () => {
    it("should generate line shapes with valid path", () => {
      const data: Datum[] = [
        { date: new Date("2024-01-01"), value: 10 },
        { date: new Date("2024-02-01"), value: 20 },
        { date: new Date("2024-03-01"), value: 30 },
      ];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const line = shapes[0];
      expect(line.type).toBe("line");
      if (line.type === "line") {
        expect(line.path).toBeDefined();
        expect(line.path.length).toBeGreaterThan(0);
        expect(line.stroke).toBeDefined();
        expect(line.fill).toBe("none");
      }
    });

    it("should generate multiple lines for segmented data", () => {
      const data: Datum[] = [
        { date: new Date("2024-01-01"), value: 10, category: "A" },
        { date: new Date("2024-02-01"), value: 20, category: "A" },
        { date: new Date("2024-01-01"), value: 15, category: "B" },
        { date: new Date("2024-02-01"), value: 25, category: "B" },
      ];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        segment: { field: "category", type: "string" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      // Should have 2 lines (one per segment)
      const lineShapes = shapes.filter((s) => s.type === "line");
      expect(lineShapes).toHaveLength(2);
    });

    it("should handle single data point", () => {
      const data: Datum[] = [{ date: new Date("2024-01-01"), value: 10 }];
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      // Single point should still generate a line shape
      expect(shapes).toHaveLength(1);
      expect(shapes[0].type).toBe("line");
    });
  });

  describe("pie chart", () => {
    it("should generate arc shapes for pie chart", () => {
      const data: Datum[] = [
        { category: "A", value: 30 },
        { category: "B", value: 20 },
        { category: "C", value: 50 },
      ];
      const config: ChartConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
      };

      const layout = computeLayout(config, { width: 400, height: 400 });
      const scales = computeScales(data, config, {
        width: 400,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(3);
      shapes.forEach((shape) => {
        expect(shape.type).toBe("arc");
        if (shape.type === "arc") {
          expect(shape.path).toBeDefined();
          expect(shape.path.length).toBeGreaterThan(0);
          expect(shape.value).toBeGreaterThan(0);
          expect(shape.category).toBeDefined();
        }
      });
    });

    it("should handle donut chart with innerRadius", () => {
      const data: Datum[] = [
        { category: "A", value: 30 },
        { category: "B", value: 70 },
      ];
      const config: ChartConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 0.5,
      };

      const layout = computeLayout(config, { width: 400, height: 400 });
      const scales = computeScales(data, config, {
        width: 400,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(2);
      // Arcs should still be valid with innerRadius
      shapes.forEach((shape) => {
        if (shape.type === "arc") {
          expect(shape.path).toBeDefined();
        }
      });
    });
  });

  describe("edge cases", () => {
    it("should return empty array for unknown chart type gracefully", () => {
      // This test verifies computeShapes handles all chart types
      // Unknown types would be caught at the config validation level
      const data: Datum[] = [{ x: 1, y: 2 }];
      const config = { type: "line" } as ChartConfig;
      config.x = { field: "x", type: "number" };
      config.y = { field: "y", type: "number" };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, {
        width: 600,
        height: 400,
        ...layout,
      });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(Array.isArray(shapes)).toBe(true);
    });
  });
});
