// app/pages/demos/playground/__tests__/ThemeSelector.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ThemeSelector } from "@/demos/playground/_components/ConfigPanel/ThemeSelector";

describe("ThemeSelector", () => {
  it("should render all theme options", () => {
    render(<ThemeSelector value="indigo" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Indigo")).toBeInTheDocument();
    expect(screen.getByLabelText("Emerald")).toBeInTheDocument();
    expect(screen.getByLabelText("Amber")).toBeInTheDocument();
  });

  it("should call onChange when theme clicked", () => {
    const onChange = vi.fn();
    render(<ThemeSelector value="indigo" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Emerald"));
    expect(onChange).toHaveBeenCalledWith("emerald");
  });
});
