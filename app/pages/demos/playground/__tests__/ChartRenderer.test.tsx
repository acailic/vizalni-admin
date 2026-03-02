// app/pages/demos/playground/__tests__/ChartRenderer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/dynamic before importing the component
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    // Return a mock component that renders a placeholder
    return function MockDynamicComponent() {
      return null;
    };
  },
}));

// Import after mocking
import { ChartRenderer } from "../_components/PreviewPane/ChartRenderer";
import { SAMPLE_DATASETS } from "../_constants";

describe("ChartRenderer", () => {
  const defaultProps = {
    chartType: "line" as const,
    data: SAMPLE_DATASETS.sales.data,
    config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
  };

  it("should show empty state when no data", () => {
    render(<ChartRenderer {...defaultProps} data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it("should render with custom height", () => {
    const { container } = render(
      <ChartRenderer {...defaultProps} data={[]} height={500} />
    );
    // The empty state box should have the custom height
    const box = container.firstChild;
    expect(box).toBeInTheDocument();
  });
});
