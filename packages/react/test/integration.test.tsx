import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../src/charts/LineChart";
import { BarChart } from "../src/charts/BarChart";
import { PieChart } from "../src/charts/PieChart";
import { csvConnector, jsonConnector } from "@vizualni/connectors";

// Mock fetch for connectors
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Integration: Connectors + Charts", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("CSV data flow", () => {
    it("should render line chart from CSV data", async () => {
      const csvData = `date,value
2024-01-01,10
2024-02-01,20
2024-03-01,30`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(csvData),
      });

      // Test the data flow: CSV -> Parse -> Chart
      const result = await csvConnector.fetch({ url: "test.csv" });
      const data = result.data.map((d) => ({
        ...d,
        date: new Date(d.date as string),
      }));

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

      expect(screen.getByRole("img")).toBeDefined();
      expect(screen.getByLabelText("Line chart")).toBeDefined();
    });

    it("should render bar chart from CSV data", async () => {
      const csvData = `category,value
A,10
B,20
C,30`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(csvData),
      });

      const result = await csvConnector.fetch({ url: "test.csv" });

      render(
        <BarChart
          data={result.data}
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
      expect(screen.getByLabelText("Bar chart")).toBeDefined();
    });
  });

  describe("JSON data flow", () => {
    it("should render pie chart from JSON data", async () => {
      const jsonData = [
        { category: "A", value: 30 },
        { category: "B", value: 20 },
        { category: "C", value: 50 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(jsonData),
      });

      const result = await jsonConnector.fetch({ url: "test.json" });

      render(
        <PieChart
          data={result.data}
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
      expect(screen.getByLabelText("Pie chart")).toBeDefined();
    });

    it("should render chart from nested JSON data", async () => {
      const jsonData = {
        results: [
          { name: "Product A", sales: 100 },
          { name: "Product B", sales: 200 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(jsonData),
      });

      const result = await jsonConnector.fetch({
        url: "test.json",
        path: "results",
      });

      render(
        <BarChart
          data={result.data}
          config={{
            type: "bar",
            x: { field: "name", type: "string" },
            y: { field: "sales", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      expect(screen.getByRole("img")).toBeDefined();
    });
  });

  describe("Error handling integration", () => {
    it("should display error message in chart for empty data", () => {
      const emptyData: unknown[] = [];

      render(
        <BarChart
          data={emptyData}
          config={{
            type: "bar",
            x: { field: "x", type: "string" },
            y: { field: "y", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      // Should render SVG with error message
      expect(screen.getByRole("img")).toBeDefined();
      expect(screen.getByText("Data array is empty")).toBeDefined();
    });

    it("should display error for missing field", () => {
      const data = [{ x: "A" }]; // missing 'y' field

      render(
        <BarChart
          data={data}
          config={{
            type: "bar",
            x: { field: "x", type: "string" },
            y: { field: "y", type: "number" },
          }}
          width={600}
          height={400}
        />
      );

      // Should render SVG with error message
      expect(screen.getByRole("img")).toBeDefined();
      expect(screen.getByText(/not found in data/)).toBeDefined();
    });
  });
});
