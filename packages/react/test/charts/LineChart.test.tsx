import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../../src/charts/LineChart";
import type { Datum } from "@vizualni/core";

describe("LineChart", () => {
  const data: Datum[] = [
    { date: new Date("2024-01-01"), value: 10 },
    { date: new Date("2024-02-01"), value: 20 },
    { date: new Date("2024-03-01"), value: 30 },
  ];

  it("should render an SVG element", () => {
    render(
      <LineChart
        data={data}
        config={{
          type: "line",
          x: { field: "date", type: "date" },
          y: { field: "value", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("should apply width and height to SVG", () => {
    render(
      <LineChart
        data={data}
        config={{
          type: "line",
          x: { field: "date", type: "date" },
          y: { field: "value", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg.getAttribute("width")).toBe("600");
    expect(svg.getAttribute("height")).toBe("400");
  });
});
