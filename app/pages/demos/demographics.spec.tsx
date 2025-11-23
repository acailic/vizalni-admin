import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

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
    ).toBeInTheDocument();
    expect(screen.getByText(/DEMOGRAFSKO UPOZORENJE/i)).toBeInTheDocument();
    // Total population number cards (uses calculated totals)
    expect(screen.getByText(/M/)).toBeInTheDocument();
    expect(screen.getByTestId("pyramid")).toBeInTheDocument();
    expect(screen.getByTestId("trends")).toBeInTheDocument();
  });

  it("renders English strings when locale is en", async () => {
    vi.doMock("next/router", () => ({
      useRouter: () => ({ locale: "en" }),
    }));
    const { default: Page } = await import("./demographics");
    render(<Page />);

    expect(
      screen.getByText(/Serbia Demographics/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DEMOGRAPHIC WARNING/i)).toBeInTheDocument();
  });
});
