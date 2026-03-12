import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../../src/charts/LineChart";
import type { Datum } from "@vizualni/core";

// Mock the console.warn to capture warnings
vi.spyOn(console, "warn").mockImplementation(() => {});

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

  it("should render with aria-label", () => {
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
    expect(svg.getAttribute("aria-label")).toBe("Line chart");
  });

  it("should handle empty data gracefully", () => {
    const { container } = render(
      <LineChart
        data={[]}
        config={{
          type: "line",
          x: { field: "date", type: "date" },
          y: { field: "value", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    // Should still render SVG structure even with empty data
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("should use continuous scale accessor for x values", () => {
    // This test ensures the component doesn't crash with valid config
    const { container } = render(
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

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
  });

  it("should work with numeric x-axis values", () => {
    const numericData: Datum[] = [
      { x: 1, y: 10 },
      { x: 2, y: 20 },
      { x: 3, y: 30 },
    ];

    const { container } = render(
      <LineChart
        data={numericData}
        config={{
          type: "line",
          x: { field: "x", type: "number" },
          y: { field: "y", type: "number" },
        }}
        width={600}
        height={400}
      />
    );

    // Should render without crashing with numeric x values
    const svg = container.querySelector("svg");
    const path = container.querySelector("path");
    expect(svg).not.toBeNull();
    expect(path).not.toBeNull();
  });
});
