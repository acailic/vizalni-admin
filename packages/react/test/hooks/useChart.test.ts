import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChart } from "../../src/hooks/useChart";
import type { ChartConfig, Datum } from "@vizualni/core";

describe("useChart", () => {
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

  it("should compute scales from data and config", () => {
    const { result } = renderHook(() =>
      useChart(data, config, { width: 600, height: 400 })
    );

    expect(result.current.scales).toBeDefined();
    expect(result.current.scales.x).toBeDefined();
    expect(result.current.scales.y).toBeDefined();
  });

  it("should compute layout from dimensions", () => {
    const { result } = renderHook(() =>
      useChart(data, config, { width: 600, height: 400 })
    );

    expect(result.current.layout).toBeDefined();
    expect(result.current.layout.width).toBe(600);
    expect(result.current.layout.height).toBe(400);
    expect(result.current.layout.chartArea).toBeDefined();
  });

  it("should memoize results for same inputs", () => {
    const { result, rerender } = renderHook(
      ({ data, config, options }) => useChart(data, config, options),
      {
        initialProps: {
          data,
          config,
          options: { width: 600, height: 400 },
        },
      }
    );

    const firstResult = result.current;
    rerender({ data, config, options: { width: 600, height: 400 } });
    expect(result.current).toBe(firstResult);
  });
});
