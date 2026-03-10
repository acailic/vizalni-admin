import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { StatsCounter } from "./StatsCounter";

describe("StatsCounter", () => {
  it("renders statistics with labels", () => {
    render(
      <StatsCounter
        stats={[
          { value: 150, label: "Charts created" },
          { value: 45, label: "Datasets" },
        ]}
      />
    );
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("Charts created")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Datasets")).toBeInTheDocument();
  });

  it("formats large numbers with commas", () => {
    render(<StatsCounter stats={[{ value: 1234, label: "Views" }]} />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("supports localized labels", () => {
    render(
      <StatsCounter stats={[{ value: 10, label: "Grafikoni" }]} locale="sr" />
    );
    expect(screen.getByText("Grafikoni")).toBeInTheDocument();
  });
});
