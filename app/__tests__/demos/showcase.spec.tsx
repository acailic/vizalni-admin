import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemoShowcasePage from "@/pages/demos/showcase";

vi.mock("next/router", () => ({
  useRouter: () => ({ locale: "sr" }),
}));

vi.mock("@/components/demos/charts", () => ({
  ColumnChart: (props: any) => (
    <div data-testid="column-chart">{JSON.stringify(props)}</div>
  ),
  LineChart: (props: any) => (
    <div data-testid="line-chart">{JSON.stringify(props)}</div>
  ),
  PieChart: (props: any) => (
    <div data-testid="pie-chart">{JSON.stringify(props)}</div>
  ),
}));

describe("DemoShowcasePage", () => {
  it("renders hero content and charts with Serbian locale", () => {
    render(<DemoShowcasePage />);

    expect(screen.getByText(/Demo Showcase vizualizacija/i)).toBeTruthy();
    expect(
      screen.getByText(/Snop najtrazenijih pokazatelja/i)
    ).toBeTruthy();

    expect(screen.getByTestId("column-chart")).toBeTruthy();
    expect(screen.getByTestId("line-chart")).toBeTruthy();
    expect(screen.getByTestId("pie-chart")).toBeTruthy();
  });

  it("switches copy when locale is English", async () => {
    vi.doMock("next/router", () => ({
      useRouter: () => ({ locale: "en" }),
    }));
    const { default: Page } = await import("@/pages/demos/showcase");
    render(<Page />);
    expect(
      screen.getByText(/Demo Showcase Visualizations/i)
    ).toBeTruthy();
    expect(screen.getByText(/Browse all demo pages/i)).toBeTruthy();
  });
});
