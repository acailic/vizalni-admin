import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ChartThemeVariant } from "@/charts/shared/chart-theme-variants";
import { ConfiguratorStateConfiguringChart } from "@/config-types";
import { ThemeVariantSelector } from "@/configurator/components/theme-variant-selector";

// Mock the configurator module
const mockDispatch = vi.fn();
let mockState: Partial<ConfiguratorStateConfiguringChart>;

vi.mock("@/configurator", () => ({
  useConfiguratorState: vi.fn((predicate) => {
    if (predicate && !predicate(mockState)) {
      throw new Error("State does not respect type guard");
    }
    return [mockState, mockDispatch];
  }),
  isConfiguring: (s: { state: string }) => s.state === "CONFIGURING_CHART",
}));

const createMockState = (
  themeVariant?: ChartThemeVariant
): ConfiguratorStateConfiguringChart => {
  return {
    state: "CONFIGURING_CHART",
    dataSource: { type: "sql", url: "test" },
    chartConfigs: [],
    activeChartKey: "test-chart",
    chartConfig: {
      key: "test-chart",
      chartType: "bar",
      fields: {},
      filters: {},
      themeVariant,
    },
    layout: {
      type: "tab",
      meta: {},
      blocks: [],
    },
  } as unknown as ConfiguratorStateConfiguringChart;
};

describe("ThemeVariantSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with the current variant selected", () => {
    mockState = createMockState("modern");

    render(<ThemeVariantSelector />);

    // Check that the label is displayed
    expect(screen.getByText("Theme Style")).toBeInTheDocument();

    // Check that the select shows the current value
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("modern");
  });

  it("should default to 'default' variant when no themeVariant is set", () => {
    mockState = createMockState(undefined);

    render(<ThemeVariantSelector />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("default");
  });

  it("should dispatch CHART_THEME_VARIANT_CHANGED action when selecting a new variant", async () => {
    mockState = createMockState("default");

    render(<ThemeVariantSelector />);

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    // Click on the "Dark" option
    const darkOption = await screen.findByRole("option", { name: "Dark" });
    fireEvent.click(darkOption);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "CHART_THEME_VARIANT_CHANGED",
      payload: { variant: "dark" },
    });
  });

  it("should display all theme variant options", async () => {
    mockState = createMockState("default");

    render(<ThemeVariantSelector />);

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    // Check all options are available
    expect(
      await screen.findByRole("option", { name: "Default" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Modern" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Minimal" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dark" })).toBeInTheDocument();
  });
});
