import { describe, it, expect } from "vitest";
import { computeLayout } from "../../src/layout";
import type { ChartConfig } from "../../src/config";

describe("computeLayout", () => {
  it("should compute chart dimensions with default margins", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const layout = computeLayout(config, { width: 600, height: 400 });

    expect(layout.width).toBe(600);
    expect(layout.height).toBe(400);
    expect(layout.margins.left).toBe(60);
    expect(layout.margins.bottom).toBe(50);
    expect(layout.chartArea.x).toBe(60);
    expect(layout.chartArea.width).toBe(600 - 60 - 30); // width - left - right
  });

  it("should compute chart area correctly", () => {
    const config: ChartConfig = {
      type: "line",
      x: { field: "date", type: "date" },
      y: { field: "value", type: "number" },
    };

    const layout = computeLayout(config, { width: 800, height: 500 });

    expect(layout.chartArea.x).toBe(layout.margins.left);
    expect(layout.chartArea.y).toBe(layout.margins.top);
    expect(layout.chartArea.width).toBe(
      800 - layout.margins.left - layout.margins.right
    );
    expect(layout.chartArea.height).toBe(
      500 - layout.margins.top - layout.margins.bottom
    );
  });
});
