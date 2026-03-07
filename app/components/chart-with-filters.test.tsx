import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React, { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseQueryFilters = vi.fn(() => []);
const mockUseSyncInteractiveFilters = vi.fn();

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    return function MockVisualization(props: any) {
      return (
        <div data-testid="chart">
          <div data-testid="chart-type">{props.chartConfig.chartType}</div>
          <div data-testid="data-source-type">{props.dataSource.type}</div>
          <div data-testid="filters-count">
            {props.observationQueryFilters.length}
          </div>
        </div>
      );
    };
  },
}));

vi.mock("@/charts/shared/chart-helpers", () => ({
  useQueryFilters: (...args: any[]) => mockUseQueryFilters(...args),
}));

vi.mock("@/charts/shared/use-sync-interactive-filters", () => ({
  useSyncInteractiveFilters: (...args: any[]) =>
    mockUseSyncInteractiveFilters(...args),
}));

vi.mock("@/charts/shared/use-size", () => ({
  Observer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="observer">{children}</div>
  ),
}));

import { ChartWithFilters } from "./chart-with-filters";

const baseChartConfig = {
  chartType: "bar",
  annotations: [],
  interactiveFiltersConfig: {
    legend: { active: false, componentId: "" },
    timeRange: {
      active: false,
      componentId: "",
      presets: { type: "range", from: "", to: "" },
    },
    dataFilters: {
      active: false,
      componentIds: [],
      defaultValueOverrides: {},
      filterTypes: {},
    },
    calculation: { active: false, type: "identity" },
  },
  cubes: [],
  fields: {},
} as any;

const baseDataSource = {
  type: "sparql",
  url: "https://example.test/query",
} as any;

describe("ChartWithFilters", () => {
  it("renders the selected chart visualization", () => {
    render(
      <ChartWithFilters
        chartConfig={baseChartConfig}
        dataSource={baseDataSource}
      />
    );

    expect(screen.getByTestId("observer")).toBeInTheDocument();
    expect(screen.getByTestId("chart")).toBeInTheDocument();
    expect(screen.getByTestId("chart-type")).toHaveTextContent("bar");
    expect(screen.getByTestId("data-source-type")).toHaveTextContent("sparql");
  });

  it("passes computed observation filters to the visualization", () => {
    mockUseQueryFilters.mockReturnValueOnce([{ iri: "foo" }, { iri: "bar" }]);

    render(
      <ChartWithFilters
        chartConfig={baseChartConfig}
        dataSource={baseDataSource}
        componentIds={["dimension-1"]}
      />
    );

    expect(mockUseQueryFilters).toHaveBeenCalledWith({
      chartConfig: baseChartConfig,
      dashboardFilters: undefined,
      componentIds: ["dimension-1"],
    });
    expect(screen.getByTestId("filters-count")).toHaveTextContent("2");
  });

  it("syncs interactive filters with the provided dashboard filters", () => {
    const dashboardFilters = {
      dataFilters: {
        componentIds: [],
        filters: {},
      },
    } as any;

    render(
      <ChartWithFilters
        chartConfig={baseChartConfig}
        dataSource={baseDataSource}
        dashboardFilters={dashboardFilters}
      />
    );

    expect(mockUseSyncInteractiveFilters).toHaveBeenCalledWith(
      baseChartConfig,
      dashboardFilters
    );
  });

  it("forwards refs to the wrapper element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ChartWithFilters
        ref={ref}
        chartConfig={baseChartConfig}
        dataSource={baseDataSource}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders different chart types using the same wrapper contract", () => {
    render(
      <ChartWithFilters
        chartConfig={{ ...baseChartConfig, chartType: "pie" }}
        dataSource={baseDataSource}
      />
    );

    expect(screen.getByTestId("chart-type")).toHaveTextContent("pie");
  });
});
