import { describe, it, expect } from "vitest";
import { computeChart } from "../../src/chart";
import type { ChartConfig, Datum } from "../../src/types";

describe("computeChart", () => {
  const data: Datum[] = [
    { date: new Date("2024-01-01"), value: 10, category: "A" },
    { date: new Date("2024-02-01"), value: 20, category: "B" },
    { date: new Date("2024-03-01"), value: 30, category: "A" },
  ];

  describe("line chart", () => {
    it("should compute scales, layout, and shapes for line chart", () => {
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const result = computeChart(data, config, { width: 600, height: 400 });

      expect(result.scales).toBeDefined();
      expect(result.scales.x).toBeDefined();
      expect(result.scales.y).toBeDefined();
      expect(result.layout).toBeDefined();
      expect(result.layout.width).toBe(600);
      expect(result.layout.height).toBe(400);
      expect(result.shapes).toBeDefined();
      expect(result.shapes.length).toBeGreaterThan(0);
    });

    it("should generate line shapes with path data", () => {
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };

      const result = computeChart(data, config, { width: 600, height: 400 });

      const lineShape = result.shapes.find((s) => s.type === "line");
      expect(lineShape).toBeDefined();
      expect(lineShape?.type).toBe("line");
      if (lineShape?.type === "line") {
        expect(lineShape.path).toBeDefined();
        expect(lineShape.path.length).toBeGreaterThan(0);
        expect(lineShape.stroke).toBeDefined();
      }
    });

    it("should compute multiple lines when segment is present", () => {
      const config: ChartConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        segment: { field: "category", type: "string" },
      };

      const result = computeChart(data, config, { width: 600, height: 400 });

      const lineShapes = result.shapes.filter((s) => s.type === "line");
      expect(lineShapes.length).toBe(2); // A and B segments
    });
  });

  describe("bar chart", () => {
    it("should compute bar shapes with correct dimensions", () => {
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const result = computeChart(data, config, { width: 600, height: 400 });

      expect(result.shapes.length).toBe(3); // 3 data points

      const barShape = result.shapes.find((s) => s.type === "bar");
      expect(barShape).toBeDefined();
      if (barShape?.type === "bar") {
        expect(barShape.x).toBeGreaterThanOrEqual(0);
        expect(barShape.y).toBeGreaterThanOrEqual(0);
        expect(barShape.width).toBeGreaterThan(0);
        expect(barShape.height).toBeGreaterThan(0);
        expect(barShape.fill).toBeDefined();
      }
    });
  });

  describe("pie chart", () => {
    it("should compute arc shapes with path data", () => {
      const config: ChartConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
      };

      const result = computeChart(data, config, { width: 400, height: 400 });

      expect(result.shapes.length).toBe(3); // 3 slices

      const arcShape = result.shapes.find((s) => s.type === "arc");
      expect(arcShape).toBeDefined();
      if (arcShape?.type === "arc") {
        expect(arcShape.path).toBeDefined();
        expect(arcShape.path.length).toBeGreaterThan(0);
        expect(arcShape.category).toBeDefined();
        expect(arcShape.value).toBeGreaterThan(0);
        expect(arcShape.fill).toBeDefined();
      }
    });

    it("should handle innerRadius for donut charts", () => {
      const config: ChartConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 0.5,
      };

      const result = computeChart(data, config, { width: 400, height: 400 });

      expect(result.shapes.length).toBe(3);
    });
  });
});
