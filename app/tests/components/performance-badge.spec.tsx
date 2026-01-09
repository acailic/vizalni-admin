/**
 * PerformanceBadge Component Tests
 *
 * Tests for the PerformanceBadge component which displays performance metrics
 * for demo visualizations with color coding.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { PerformanceBadge } from "@/components/demos/performance-badge";

describe("PerformanceBadge", () => {
  const mockMetrics = {
    dataLoadTime: 1000,
    renderTime: 500,
    dataPoints: 1000,
  };

  const fastMetrics = {
    dataLoadTime: 300,
    renderTime: 200,
    dataPoints: 500,
  };

  const slowMetrics = {
    dataLoadTime: 2000,
    renderTime: 2500,
    dataPoints: 10000,
  };

  describe("Basic Rendering", () => {
    it("renders with basic metrics", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      expect(container.textContent).toContain("1,000");
      expect(container.textContent).toContain("points");
    });

    it("renders without crashing when metrics are zero", () => {
      const zeroMetrics = {
        dataLoadTime: 0,
        renderTime: 0,
        dataPoints: 0,
      };

      expect(() =>
        render(<PerformanceBadge metrics={zeroMetrics} />)
      ).not.toThrow();
    });

    it("renders with custom className", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} className="custom-class" />
      );

      const badge = container.querySelector(".performance-badge");
      expect(badge).toHaveClass("custom-class");
    });

    it("renders all metric badges in compact mode", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} compact={true} />
      );

      expect(container.textContent).toContain("1,000");
    });
  });

  describe("Data Points Display", () => {
    it("displays data points with proper formatting", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      expect(container.textContent).toContain("1,000");
      expect(container.textContent).toContain("points");
    });

    it("formats large numbers with locale string", () => {
      const largeMetrics = {
        dataLoadTime: 100,
        renderTime: 50,
        dataPoints: 1000000,
      };

      const { container } = render(<PerformanceBadge metrics={largeMetrics} />);

      expect(container.textContent).toContain("1,000,000");
    });

    it('displays without "points" suffix in compact mode', () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} compact={true} />
      );

      expect(container.textContent).toContain("1,000");
      expect(container.textContent).not.toContain("1,000 points");
    });

    it("displays data points icon", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const icon = container.querySelector("span");
      expect(icon).toHaveTextContent("📊");
    });
  });

  describe("Color Coding", () => {
    it("shows green color for fast load time (< 500ms)", () => {
      render(<PerformanceBadge metrics={fastMetrics} showDetails={true} />);

      const { container } = render(
        <PerformanceBadge metrics={fastMetrics} showDetails={true} />
      );
      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );

      expect(loadTimeBadge).toHaveStyle({
        borderColor: "#10b981",
      });
    });

    it("shows amber color for medium load time (500-1500ms)", () => {
      const mediumMetrics = {
        dataLoadTime: 1000,
        renderTime: 1000,
        dataPoints: 1000,
      };

      const { container } = render(
        <PerformanceBadge metrics={mediumMetrics} showDetails={true} />
      );
      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );

      expect(loadTimeBadge).toHaveStyle({
        borderColor: "#f59e0b",
      });
    });

    it("shows red color for slow load time (> 1500ms)", () => {
      render(<PerformanceBadge metrics={slowMetrics} showDetails={true} />);

      const { container } = render(
        <PerformanceBadge metrics={slowMetrics} showDetails={true} />
      );
      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );

      expect(loadTimeBadge).toHaveStyle({
        borderColor: "#ef4444",
      });
    });

    it("applies same color coding to render time", () => {
      const { container: fastContainer } = render(
        <PerformanceBadge metrics={fastMetrics} showDetails={true} />
      );
      const { container: slowContainer } = render(
        <PerformanceBadge metrics={slowMetrics} showDetails={true} />
      );

      const fastRenderBadge = fastContainer.querySelector(
        '[title="Time to render the chart"]'
      );
      const slowRenderBadge = slowContainer.querySelector(
        '[title="Time to render the chart"]'
      );

      expect(fastRenderBadge).toHaveStyle({
        borderColor: "#10b981",
      });
      expect(slowRenderBadge).toHaveStyle({
        borderColor: "#ef4444",
      });
    });

    it("handles boundary values correctly", () => {
      const boundaryMetrics = {
        dataLoadTime: 500,
        renderTime: 1500,
        dataPoints: 1000,
      };

      const { container } = render(
        <PerformanceBadge metrics={boundaryMetrics} showDetails={true} />
      );
      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      const renderTimeBadge = container.querySelector(
        '[title="Time to render the chart"]'
      );

      // 500ms should be amber
      expect(loadTimeBadge).toHaveStyle({
        borderColor: "#f59e0b",
      });

      // 1500ms should be red
      expect(renderTimeBadge).toHaveStyle({
        borderColor: "#ef4444",
      });
    });
  });

  describe("Compact Mode", () => {
    it("applies compact padding", () => {
      const { container: compactContainer } = render(
        <PerformanceBadge metrics={mockMetrics} compact={true} />
      );
      const { container: normalContainer } = render(
        <PerformanceBadge metrics={mockMetrics} compact={false} />
      );

      const compactBadge = compactContainer.querySelector(".performance-badge");
      const normalBadge = normalContainer.querySelector(".performance-badge");

      expect(compactBadge).toHaveStyle({
        padding: "4px 8px",
        fontSize: "12px",
      });

      expect(normalBadge).toHaveStyle({
        padding: "8px 12px",
        fontSize: "13px",
      });
    });

    it("formats metrics without spaces in compact mode", () => {
      const { container } = render(
        <PerformanceBadge
          metrics={mockMetrics}
          compact={true}
          showDetails={true}
        />
      );

      expect(container.textContent).toContain("1,000");
      expect(container.textContent).toContain("500");
    });

    it("shows all badges in compact mode", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} compact={true} />
      );

      const badges = container.querySelectorAll(".performance-badge > div");
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe("Show Details Mode", () => {
    it("does not show load time when showDetails is false", () => {
      render(<PerformanceBadge metrics={mockMetrics} showDetails={false} />);

      expect(
        screen.queryByText(/Time to load data from API/)
      ).not.toBeInTheDocument();
    });

    it("does not show render time when showDetails is false", () => {
      render(<PerformanceBadge metrics={mockMetrics} showDetails={false} />);

      expect(
        screen.queryByText(/Time to render the chart/)
      ).not.toBeInTheDocument();
    });

    it("shows load time when showDetails is true", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      expect(loadTimeBadge).toBeInTheDocument();
      expect(loadTimeBadge).toHaveTextContent(/1000 ms/);
    });

    it("shows render time when showDetails is true", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const renderTimeBadge = container.querySelector(
        '[title="Time to render the chart"]'
      );
      expect(renderTimeBadge).toBeInTheDocument();
      expect(renderTimeBadge).toHaveTextContent(/500 ms/);
    });

    it("shows both metrics when showDetails is true", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const badges = container.querySelectorAll(".performance-badge > div");
      expect(badges.length).toBeGreaterThanOrEqual(2);
    });

    it("displays timer icon for load time", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      expect(loadTimeBadge?.querySelector("span")).toHaveTextContent("⏱");
    });

    it("displays lightning icon for render time", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const renderTimeBadge = container.querySelector(
        '[title="Time to render the chart"]'
      );
      expect(renderTimeBadge?.querySelector("span")).toHaveTextContent("⚡");
    });
  });

  describe("Cache Indicator", () => {
    it("shows cache indicator when fromCache is true", () => {
      const cachedMetrics = {
        ...mockMetrics,
        fromCache: true,
      };

      const { container } = render(
        <PerformanceBadge metrics={cachedMetrics} />
      );

      const cacheBadge = container.querySelector('[title="Loaded from cache"]');
      expect(cacheBadge).toBeInTheDocument();
      expect(cacheBadge?.querySelector("span")).toHaveTextContent("💾");
    });

    it("shows web icon when fromCache is false", () => {
      const uncachedMetrics = {
        ...mockMetrics,
        fromCache: false,
      };

      const { container } = render(
        <PerformanceBadge metrics={uncachedMetrics} />
      );

      const cacheBadge = container.querySelector('[title="Fresh data fetch"]');
      expect(cacheBadge).toBeInTheDocument();
      expect(cacheBadge?.querySelector("span")).toHaveTextContent("🌐");
    });

    it("does not show cache indicator when fromCache is undefined", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const cacheBadge = container.querySelector('[title*="cache" i]');
      expect(cacheBadge).not.toBeInTheDocument();
    });

    it("shows correct title attribute for cached data", () => {
      const cachedMetrics = {
        ...mockMetrics,
        fromCache: true,
      };

      const { container } = render(
        <PerformanceBadge metrics={cachedMetrics} />
      );

      const cacheBadge = container.querySelector('[title="Loaded from cache"]');
      expect(cacheBadge).toHaveAttribute("title", "Loaded from cache");
    });

    it("shows correct title attribute for fresh data", () => {
      const uncachedMetrics = {
        ...mockMetrics,
        fromCache: false,
      };

      const { container } = render(
        <PerformanceBadge metrics={uncachedMetrics} />
      );

      const cacheBadge = container.querySelector('[title="Fresh data fetch"]');
      expect(cacheBadge).toHaveAttribute("title", "Fresh data fetch");
    });
  });

  describe("Layout and Styling", () => {
    it("applies flex layout with gap", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const badge = container.querySelector(".performance-badge");
      expect(badge).toHaveStyle({
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      });
    });

    it("applies background color", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const badge = container.querySelector(".performance-badge");
      expect(badge).toHaveStyle({
        backgroundColor: "#f9fafb",
      });
    });

    it("applies border radius", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const badge = container.querySelector(".performance-badge");
      expect(badge).toHaveStyle({
        borderRadius: "6px",
      });
    });

    it("applies border to metric badges", () => {
      const { container } = render(<PerformanceBadge metrics={mockMetrics} />);

      const badges = container.querySelectorAll(".performance-badge > div");
      badges.forEach((badge) => {
        expect(badge).toHaveStyle({
          padding: "2px 8px",
          borderRadius: "4px",
        });
      });
    });
  });

  describe("Metric Formatting", () => {
    it("formats load time correctly in showDetails mode", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      expect(loadTimeBadge).toHaveTextContent("1000 ms");
    });

    it("formats render time correctly in showDetails mode", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const renderTimeBadge = container.querySelector(
        '[title="Time to render the chart"]'
      );
      expect(renderTimeBadge).toHaveTextContent("500 ms");
    });

    it("formats metrics without spaces in compact mode", () => {
      const { container } = render(
        <PerformanceBadge
          metrics={mockMetrics}
          showDetails={true}
          compact={true}
        />
      );

      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      expect(loadTimeBadge?.textContent).toContain("1000ms");
    });

    it("handles single digit values", () => {
      const singleDigitMetrics = {
        dataLoadTime: 5,
        renderTime: 3,
        dataPoints: 7,
      };

      render(
        <PerformanceBadge metrics={singleDigitMetrics} showDetails={true} />
      );

      expect(screen.getByText(/5 ms/)).toBeInTheDocument();
      expect(screen.getByText(/3 ms/)).toBeInTheDocument();
      expect(screen.getByText(/7 points/)).toBeInTheDocument();
    });

    it("handles very large values", () => {
      const largeMetrics = {
        dataLoadTime: 999999,
        renderTime: 888888,
        dataPoints: 999999999,
      };

      render(<PerformanceBadge metrics={largeMetrics} showDetails={true} />);

      expect(screen.getByText(/999999 ms/)).toBeInTheDocument();
      expect(screen.getByText(/888888 ms/)).toBeInTheDocument();
      expect(screen.getByText(/999,999,999 points/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has title attributes for all metric badges", () => {
      const { container } = render(
        <PerformanceBadge metrics={mockMetrics} showDetails={true} />
      );

      const loadTimeBadge = container.querySelector(
        '[title="Time to load data from API"]'
      );
      const renderTimeBadge = container.querySelector(
        '[title="Time to render the chart"]'
      );
      const dataPointsBadge = container.querySelector(
        '[title="Number of data points in visualization"]'
      );

      expect(loadTimeBadge).toBeInTheDocument();
      expect(renderTimeBadge).toBeInTheDocument();
      expect(dataPointsBadge).toBeInTheDocument();
    });

    it("provides descriptive titles for screen readers", () => {
      const cachedMetrics = {
        ...mockMetrics,
        fromCache: true,
      };

      const { container } = render(
        <PerformanceBadge metrics={cachedMetrics} showDetails={true} />
      );

      expect(
        container.querySelector('[title="Time to load data from API"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[title="Time to render the chart"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[title="Number of data points in visualization"]'
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector('[title="Loaded from cache"]')
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles all zero metrics", () => {
      const zeroMetrics = {
        dataLoadTime: 0,
        renderTime: 0,
        dataPoints: 0,
      };

      expect(() =>
        render(<PerformanceBadge metrics={zeroMetrics} />)
      ).not.toThrow();
    });

    it("handles negative metrics gracefully", () => {
      const negativeMetrics = {
        dataLoadTime: -100,
        renderTime: -50,
        dataPoints: -10,
      };

      expect(() =>
        render(<PerformanceBadge metrics={negativeMetrics} />)
      ).not.toThrow();
    });

    it("handles decimal values", () => {
      const decimalMetrics = {
        dataLoadTime: 100.5,
        renderTime: 50.7,
        dataPoints: 100.25,
      };

      const { container } = render(
        <PerformanceBadge metrics={decimalMetrics} showDetails={true} />
      );

      // The component doesn't round, it passes through the values
      expect(container.textContent).toContain("100.5");
      expect(container.textContent).toContain("50.7");
    });

    it("handles very small data points values", () => {
      const smallMetrics = {
        dataLoadTime: 10,
        renderTime: 5,
        dataPoints: 1,
      };

      render(<PerformanceBadge metrics={smallMetrics} />);

      expect(screen.getByText(/1 points/)).toBeInTheDocument();
    });
  });

  describe("Combined Features", () => {
    it("works with all features enabled", () => {
      const fullMetrics = {
        ...mockMetrics,
        fromCache: true,
      };

      const { container } = render(
        <PerformanceBadge
          metrics={fullMetrics}
          compact={true}
          showDetails={true}
        />
      );

      expect(
        container.querySelector('[title="Time to load data from API"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[title="Time to render the chart"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[title="Number of data points in visualization"]'
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector('[title="Loaded from cache"]')
      ).toBeInTheDocument();
    });

    it("maintains proper spacing with multiple badges", () => {
      const fullMetrics = {
        ...mockMetrics,
        fromCache: true,
      };

      const { container } = render(
        <PerformanceBadge metrics={fullMetrics} showDetails={true} />
      );

      const badge = container.querySelector(".performance-badge");
      const badges = container.querySelectorAll(".performance-badge > div");

      expect(badge).toHaveStyle({ gap: "8px" });
      expect(badges.length).toBeGreaterThan(1);
    });
  });
});
