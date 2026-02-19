import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../src/charts/LineChart";
import { BarChart } from "../src/charts/BarChart";
import { PieChart } from "../src/charts/PieChart";
import type { Datum } from "@vizualni/core";

describe("Accessibility", () => {
  const lineData: Datum[] = [
    { date: new Date("2024-01-01"), value: 10 },
    { date: new Date("2024-02-01"), value: 20 },
    { date: new Date("2024-03-01"), value: 30 },
  ];

  const barData: Datum[] = [
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "C", value: 30 },
  ];

  const pieData: Datum[] = [
    { category: "A", value: 30 },
    { category: "B", value: 20 },
    { category: "C", value: 50 },
  ];

  describe("LineChart", () => {
    it("should have role='img'", () => {
      render(
        <LineChart
          data={lineData}
          config={{
            type: "line",
            x: { field: "date", type: "date" },
            y: { field: "value", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByRole("img")).toBeDefined();
    });

    it("should have aria-label", () => {
      render(
        <LineChart
          data={lineData}
          config={{
            type: "line",
            x: { field: "date", type: "date" },
            y: { field: "value", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByLabelText("Line chart")).toBeDefined();
    });

    it("should support custom className", () => {
      const { container } = render(
        <LineChart
          data={lineData}
          config={{
            type: "line",
            x: { field: "date", type: "date" },
            y: { field: "value", type: "number" },
          }}
          width={600}
          height={400}
          className="custom-chart"
        />
      );

      expect(container.querySelector(".custom-chart")).toBeDefined();
    });
  });

  describe("BarChart", () => {
    it("should have role='img'", () => {
      render(
        <BarChart
          data={barData}
          config={{
            type: "bar",
            x: { field: "category", type: "string" },
            y: { field: "value", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByRole("img")).toBeDefined();
    });

    it("should have aria-label", () => {
      render(
        <BarChart
          data={barData}
          config={{
            type: "bar",
            x: { field: "category", type: "string" },
            y: { field: "value", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByLabelText("Bar chart")).toBeDefined();
    });

    it("should have aria-label with error for invalid data", () => {
      render(
        <BarChart
          data={[]}
          config={{
            type: "bar",
            x: { field: "x", type: "string" },
            y: { field: "y", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByLabelText("Bar chart - error")).toBeDefined();
    });
  });

  describe("PieChart", () => {
    it("should have role='img'", () => {
      render(
        <PieChart
          data={pieData}
          config={{
            type: "pie",
            value: { field: "value", type: "number" },
            category: { field: "category", type: "string" },
          }}
          width={400}
          height={400}
        />
      );

      expect(screen.getByRole("img")).toBeDefined();
    });

    it("should have aria-label", () => {
      render(
        <PieChart
          data={pieData}
          config={{
            type: "pie",
            value: { field: "value", type: "number" },
            category: { field: "category", type: "string" },
          }}
          width={400}
          height={400}
        />
      );

      expect(screen.getByLabelText("Pie chart")).toBeDefined();
    });

    it("should render donut chart with innerRadius", () => {
      const { container } = render(
        <PieChart
          data={pieData}
          config={{
            type: "pie",
            value: { field: "value", type: "number" },
            category: { field: "category", type: "string" },
            innerRadius: 0.5,
          }}
          width={400}
          height={400}
        />
      );

      // Should render paths for pie slices
      const paths = container.querySelectorAll("path");
      expect(paths.length).toBe(3);
    });
  });

  describe("SVG structure", () => {
    it("should set width and height attributes", () => {
      const { container } = render(
        <BarChart
          data={barData}
          config={{
            type: "bar",
            x: { field: "category", type: "string" },
            y: { field: "value", type: "number" },
          }}
          width={800}
          height={500}
        />
      );

      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("800");
      expect(svg?.getAttribute("height")).toBe("500");
    });
  });
});
