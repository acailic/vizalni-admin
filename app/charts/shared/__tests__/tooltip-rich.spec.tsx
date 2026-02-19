// @vitest-environment jsdom
// app/charts/shared/__tests__/tooltip-rich.spec.tsx
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";

import { TooltipRich, TrendDirection } from "../interaction/tooltip-rich";

describe("TooltipRich", () => {
  it("should render value and label", () => {
    render(<TooltipRich label="2024" value="1,234" segment="Population" />);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element?.tagName === "SPAN" && element?.textContent === "Population:"
      )
    ).toBeInTheDocument();
  });

  it("should show trend indicator for upward trend", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        trendDirection={TrendDirection.Up}
        trendValue="+5.2%"
      />
    );
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
    expect(screen.getByLabelText("trending up")).toBeInTheDocument();
  });

  it("should show trend indicator for downward trend", () => {
    render(
      <TooltipRich
        label="2024"
        value="1,234"
        trendDirection={TrendDirection.Down}
        trendValue="-3.1%"
      />
    );
    expect(screen.getByText("-3.1%")).toBeInTheDocument();
    expect(screen.getByLabelText("trending down")).toBeInTheDocument();
  });

  it("should show percentage when provided", () => {
    render(<TooltipRich label="2024" value="1,234" percentage="42%" />);
    expect(
      screen.getByText((content, element) => element?.textContent === "(42%)")
    ).toBeInTheDocument();
  });
});
