import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemographicsDemo from "./demographics";

vi.mock("next/router", () => ({
  useRouter: () => ({ locale: "sr" }),
}));

vi.mock("@/components/demos/charts/PopulationPyramid", () => ({
  PopulationPyramid: () => <div data-testid="pyramid" />,
}));

vi.mock("@/components/demos/charts/PopulationTrends", () => ({
  PopulationTrends: () => <div data-testid="trends" />,
}));

describe("DemographicsDemo", () => {
  it("renders key computed metrics and warning", () => {
    render(<DemographicsDemo />);

    expect(
      screen.getByText(/Demografija Srbije/i)
    ).toBeTruthy();
    expect(screen.getByText(/DEMOGRAFSKO UPOZORENJE/i)).toBeTruthy();
    // Total population number cards (uses calculated totals)
    expect(screen.getByText(/M/)).toBeInTheDocument();
    expect(screen.getByTestId("pyramid")).toBeTruthy();
    expect(screen.getByTestId("trends")).toBeTruthy();
  });

  it("renders English strings when locale is en", async () => {
    vi.doMock("next/router", () => ({
      useRouter: () => ({ locale: "en" }),
    }));
    const { default: Page } = await import("./demographics");
    render(<Page />);

    expect(
      screen.getByText(/Serbia Demographics/i)
    ).toBeTruthy();
    expect(screen.getByText(/DEMOGRAPHIC WARNING/i)).toBeTruthy();
  });
});
