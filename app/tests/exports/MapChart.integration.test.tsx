/**
 * MapChart Integration Test
 *
 * Basic smoke test to verify MapChart component renders without errors
 */

import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import { MapChart } from "../../exports/charts/MapChart";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe("MapChart Integration", () => {
  beforeEach(() => {
    cleanup();
  });
  it("renders MapChart component", () => {
    const mockData = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            name: "Test Region",
            value: 1000,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [20.0, 44.0],
                [21.0, 44.0],
                [21.0, 45.0],
                [20.0, 45.0],
                [20.0, 44.0],
              ],
            ],
          },
        },
      ],
    };

    const { container } = render(
      <MapChart
        data={mockData}
        config={{
          xAxis: "name",
          yAxis: "value",
          title: "Test Map",
        }}
        height={400}
        width={600}
      />
    );

    // Verify SVG is rendered
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "600");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("renders with point data", () => {
    const mockPoints = [
      {
        id: "1",
        name: "Test Point",
        value: 500,
        coordinates: [20.5, 44.5] as [number, number],
      },
    ];

    const { container } = render(
      <MapChart
        data={[]}
        config={{
          xAxis: "name",
          yAxis: "value",
          showPoints: true,
          pointData: mockPoints,
        }}
      />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders with custom color scale", () => {
    const mockData = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { name: "Region 1", value: 100 },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [20, 44],
                [21, 44],
                [21, 45],
                [20, 45],
                [20, 44],
              ],
            ],
          },
        },
      ],
    };

    const { container } = render(
      <MapChart
        data={mockData}
        config={{
          xAxis: "name",
          yAxis: "value",
          colorScale: ["#f0f9ff", "#0ea5e9", "#0369a1"],
        }}
      />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("exports MapChart types", () => {
    // Type checking test - this should compile without errors
    const data: import("../../exports/charts/MapChart").MapData = {
      type: "FeatureCollection",
      features: [],
    };

    const config: import("../../exports/charts/MapChart").MapChartConfig = {
      xAxis: "name",
      yAxis: "value",
    };

    expect(data).toBeDefined();
    expect(config).toBeDefined();
  });
});
