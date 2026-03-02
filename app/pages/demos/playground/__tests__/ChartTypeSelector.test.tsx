// app/pages/demos/playground/__tests__/ChartTypeSelector.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ChartTypeSelector } from "../_components/ConfigPanel/ChartTypeSelector";

describe("ChartTypeSelector", () => {
  it("should render all chart types", () => {
    render(<ChartTypeSelector value="line" onChange={vi.fn()} />);
    expect(screen.getByText("Line")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByText("Pie")).toBeInTheDocument();
    expect(screen.getByText("Scatter")).toBeInTheDocument();
  });

  it("should highlight selected type", () => {
    render(<ChartTypeSelector value="bar" onChange={vi.fn()} />);
    const barButton = screen.getByRole("button", { name: /bar/i });
    expect(barButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange when clicked", () => {
    const onChange = vi.fn();
    render(<ChartTypeSelector value="line" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /pie/i }));
    expect(onChange).toHaveBeenCalledWith("pie");
  });
});
