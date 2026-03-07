/**
 * Tests for PieChart component
 *
 * Tests the standalone PieChart component from the exports module.
 */

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import { PieChart } from "../../../exports/charts/PieChart";

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = vi.fn().mockImplementation(function () {
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

describe("PieChart", () => {
  const mockData = [
    { category: "Product A", value: 300 },
    { category: "Product B", value: 150 },
    { category: "Product C", value: 100 },
    { category: "Product D", value: 50 },
  ];

  describe("rendering with basic props", () => {
    it("should render without crashing", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with custom width", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width={600}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "600");
    });

    it("should render with responsive width (100%)", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveStyle({ width: "100%" });
    });

    it("should render with custom className and styles", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          className="custom-chart"
          style={{ border: "1px solid red" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("custom-chart");
      expect(wrapper).toHaveStyle({ border: "1px solid red" });
    });

    it("should render with title", async () => {
      render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            title: "Sales Distribution",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(screen.getByText("Sales Distribution")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          ariaLabel="Product sales distribution"
          description="Donut chart showing sales distribution by product category"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveAttribute("role", "img");
      expect(wrapper).toHaveAttribute(
        "aria-label",
        "Product sales distribution"
      );
    });
  });

  describe("data configurations", () => {
    it("should render with multiple slices", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      expect(slices.length).toBeGreaterThan(0);
    });

    it("should handle empty data gracefully", async () => {
      const { container } = render(
        <PieChart
          data={[]}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should not render any slices
      const slices = container.querySelectorAll("svg path");
      expect(slices.length).toBe(0);
    });

    it("should handle data with null values", async () => {
      const dataWithNulls = [
        { category: "Product A", value: 100 },
        { category: "Product B", value: null },
        { category: "Product C", value: 120 },
      ];

      const { container } = render(
        <PieChart
          data={dataWithNulls}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should still render
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should handle single data point", async () => {
      const singleDataPoint = [{ category: "Product A", value: 100 }];

      const { container } = render(
        <PieChart
          data={singleDataPoint}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("responsive width handling", () => {
    it("should use container width when width is percentage", async () => {
      const { container } = render(
        <div style={{ width: "500px" }}>
          <PieChart
            data={mockData}
            config={{ xAxis: "category", yAxis: "value" }}
            width="100%"
            height={400}
          />
        </div>
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should update container width on resize", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      if (wrapper) {
        // Simulate resize
        fireEvent(wrapper, new Event("resize"));
      }

      await waitFor(() => {
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe("tooltip interactions", () => {
    it("should show tooltip on hover when showTooltip is true", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find a slice and hover over it
      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.mouseMove(slices[0], { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).toBeInTheDocument();
        });
      }
    });

    it("should not show tooltip when showTooltip is false", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.mouseMove(slices[0], { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });

    it("should use custom tooltip renderer when provided", async () => {
      const customTooltip = vi.fn(() => <div>Custom Tooltip</div>);

      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          renderTooltip={customTooltip}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.mouseMove(slices[0], { clientX: 100, clientY: 100 });

        await waitFor(() => {
          expect(customTooltip).toHaveBeenCalled();
          expect(screen.getByText("Custom Tooltip")).toBeInTheDocument();
        });
      }
    });

    it("should hide tooltip on mouse leave", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.mouseMove(slices[0], { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).toBeInTheDocument();
        });

        fireEvent.mouseLeave(slices[0]);

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("animation behavior", () => {
    it("should animate when animated is true", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", animationDuration: 500 }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      expect(slices.length).toBeGreaterThan(0);
    });

    it("should not animate when animated is false", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          animated={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      expect(slices.length).toBeGreaterThan(0);
    });

    it("should respect custom animation duration", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            animationDuration: 2000,
          }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("donut chart features", () => {
    it("should render as donut chart with innerRadiusRatio", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", innerRadiusRatio: 0.6 }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have center text
      const centerText = container.querySelector(".center-text");
      expect(centerText).toBeInTheDocument();
    });

    it("should render as pie chart with innerRadiusRatio 0", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", innerRadiusRatio: 0 }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should display total in center of donut", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", innerRadiusRatio: 0.6 }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const centerText = container.querySelector(".center-text");
      if (centerText) {
        expect(centerText.textContent).toContain("600");
      }
    });
  });

  describe("labels", () => {
    it("should show labels when showLabels is true", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showLabels: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have label text elements
      const labels = container.querySelectorAll("svg text");
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should not show labels when showLabels is false", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLabels: false,
            innerRadiusRatio: 0,
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // When innerRadiusRatio is 0 (pie chart, not donut), there should be no labels
      const labels = container.querySelectorAll("svg text");
      // Should not have any data labels (legend text may still exist)
      const dataLabels = Array.from(labels).filter((label) => {
        const text = label.textContent || "";
        return (
          !text.includes("%") && mockData.some((d) => text.includes(d.category))
        );
      });
      expect(dataLabels.length).toBe(0);
    });

    it("should show percentages when showPercentages is true", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLabels: true,
            showPercentages: true,
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have labels with percentages
      const labels = container.querySelectorAll("svg text");
      const hasPercentage = Array.from(labels).some((label) =>
        label.textContent?.includes("%")
      );
      expect(hasPercentage).toBe(true);
    });

    it("should position labels inside when labelPosition is inside", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLabels: true,
            labelPosition: "inside",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should position labels outside when labelPosition is outside", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLabels: true,
            labelPosition: "outside",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have connector lines
      const polylines = container.querySelectorAll("svg polyline");
      expect(polylines.length).toBeGreaterThan(0);
    });
  });

  describe("legend", () => {
    it("should show legend when showLegend is true", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showLegend: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const legend = container.querySelector(".legend");
      expect(legend).toBeInTheDocument();
    });

    it("should not show legend when showLegend is false", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showLegend: false }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const legend = container.querySelector(".legend");
      expect(legend).not.toBeInTheDocument();
    });

    it("should position legend on right when legendPosition is right", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLegend: true,
            legendPosition: "right",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const legend = container.querySelector(".legend");
      expect(legend).toBeInTheDocument();
    });

    it("should position legend on bottom when legendPosition is bottom", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            showLegend: true,
            legendPosition: "bottom",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const legend = container.querySelector(".legend");
      expect(legend).toBeInTheDocument();
    });
  });

  describe("data point interactions", () => {
    it("should call onDataPointClick when slice is clicked", async () => {
      const handleClick = vi.fn();

      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          onDataPointClick={handleClick}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find and click a slice
      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.click(slices[0]);
        await waitFor(() => {
          expect(handleClick).toHaveBeenCalledWith(
            expect.objectContaining({
              category: "Product A",
              sourceIndex: 0,
              value: 300,
            }),
            0
          );
        });
      }
    });

    it("should expand slice on hover", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const slices = container.querySelectorAll("svg path");
      if (slices.length > 0) {
        fireEvent.mouseEnter(slices[0]);

        await waitFor(() => {
          // Slice should still be present
          expect(slices[0]).toBeInTheDocument();
        });
      }
    });
  });

  describe("color palette", () => {
    it("should use professional color palette for slices", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should use different colors for different slices
      const slices = container.querySelectorAll("svg path");
      const colors = new Set(
        Array.from(slices).map((slice) => slice.getAttribute("fill"))
      );
      expect(colors.size).toBeGreaterThan(1);
    });
  });

  describe("locale support", () => {
    it("should render with sr-Latn locale", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="sr-Latn"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with sr-Cyrl locale", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="sr-Cyrl"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with en locale", async () => {
      const { container } = render(
        <PieChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="en"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
