// app/pages/demos/playground/__tests__/DataEditor.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { DataEditor } from "@/demos/playground/_components/ConfigPanel/DataEditor";
import { SAMPLE_DATASETS } from "@/demos/playground/_constants";

describe("DataEditor", () => {
  const defaultProps = {
    data: SAMPLE_DATASETS.sales.data,
    onChange: vi.fn(),
  };

  it("should render dataset selector", () => {
    render(<DataEditor {...defaultProps} />);
    expect(
      screen.getByRole("combobox", { name: /primer dataseta|sample dataset/i })
    ).toBeInTheDocument();
  });

  it("should show current data info", () => {
    render(<DataEditor {...defaultProps} />);
    expect(
      screen.getByText(/6 tačaka podataka|6 data points/i)
    ).toBeInTheDocument();
  });

  it("should call onChange when dataset selected", () => {
    const onChange = vi.fn();
    render(<DataEditor {...defaultProps} onChange={onChange} />);
    fireEvent.mouseDown(
      screen.getByRole("combobox", {
        name: /primer dataseta|sample dataset/i,
      })
    );
    fireEvent.click(screen.getByText("Age Distribution"));
    expect(onChange).toHaveBeenCalled();
  });
});
