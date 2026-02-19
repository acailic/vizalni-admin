import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "../../src/charts/BarChart";
import type { Datum } from "@vizualni/core";

describe("BarChart", () => {
  const data: Datum[] = [
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "C", value: 15 },
  ];

  it("should render an SVG element", () => {
    render(
      <BarChart
        data={data}
        config={{
          type: "bar",
          x: { field: "category", type: "string" },
          y: { field: "value", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("should render bars for each data point", () => {
    render(
      <BarChart
        data={data}
        config={{
          type: "bar",
          x: { field: "category", type: "string" },
          y: { field: "value", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    const rects = document.querySelectorAll("rect");
    // Should have at least 3 bars (may have more from axes)
    const bars = Array.from(rects).filter(
      (r) => r.getAttribute("height") !== "0"
    );
    expect(bars.length).toBeGreaterThanOrEqual(3);
  });
});
