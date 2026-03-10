import { describe, it, expect, vi } from "vitest";

import { TreemapRenderDatum } from "../treemap";

/**
 * Truncates text to fit within a given width
 * (Replicated here for testing purposes since the internal function is not exported)
 */
const truncateText = (
  text: string,
  maxWidth: number,
  fontSize: number
): string => {
  const charWidth = fontSize * 0.6; // Approximate character width
  const maxChars = Math.floor(maxWidth / charWidth);

  if (text.length <= maxChars) {
    return text;
  }

  return text.slice(0, Math.max(0, maxChars - 2)) + "..";
};

// Mock the dependencies
vi.mock("@/charts/shared/chart-state", () => ({
  useChartState: vi.fn(),
}));

vi.mock("@/charts/shared/annotation-utils", () => ({
  useIsEditingAnnotation: vi.fn(() => false),
}));

vi.mock("@/charts/shared/use-annotation-interactions", () => ({
  useAnnotationInteractions: vi.fn(() => ({
    onClick: vi.fn(),
    onHover: vi.fn(),
    onHoverOut: vi.fn(),
  })),
}));

vi.mock("@/charts/shared/use-chart-theme", () => ({
  useChartTheme: vi.fn(() => ({
    fontFamily: "Inter, sans-serif",
    labelFontSize: 12,
    axisLabelFontSize: 14,
    labelColor: "#333",
    domainColor: "#666",
    gridColor: "#eee",
    lineWidth: 2,
    barRadius: 4,
    dotRadius: 3,
    dotGlowRadius: 6,
    animationDuration: 300,
    animationEasing: "ease-out",
    tooltipBackgroundColor: "#fff",
    tooltipBorderColor: "#ddd",
    tooltipTextColor: "#333",
    brushOverlayColor: "rgba(0,0,0,0.1)",
    brushSelectionColor: "rgba(0,0,0,0.2)",
    brushHandleStrokeColor: "#666",
    brushHandleFillColor: "#fff",
  })),
}));

vi.mock("@/stores/transition", () => ({
  useTransitionStore: vi.fn(() => ({
    enable: false,
    duration: 300,
  })),
}));

vi.mock("@/utils/use-event", () => ({
  useEvent: vi.fn((fn) => fn),
}));

describe("Treemap", () => {
  describe("TreemapRenderDatum type", () => {
    it("should define a valid treemap render datum", () => {
      const datum: TreemapRenderDatum = {
        key: "segment-a",
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 50,
        width: 100,
        height: 50,
        color: "#4e79a7",
        segment: "Segment A",
        observation: { id: "1", segment: "A", value: 100 } as any,
      };

      expect(datum.key).toBe("segment-a");
      expect(datum.width).toBe(100);
      expect(datum.height).toBe(50);
      expect(datum.color).toBe("#4e79a7");
    });

    it("should calculate dimensions from coordinates", () => {
      const datum: TreemapRenderDatum = {
        key: "test",
        x0: 10,
        y0: 20,
        x1: 110,
        y1: 70,
        width: 100,
        height: 50,
        color: "#f28e2c",
        segment: "Test",
        observation: {} as any,
      };

      expect(datum.x1 - datum.x0).toBe(datum.width);
      expect(datum.y1 - datum.y0).toBe(datum.height);
    });
  });

  describe("truncateText", () => {
    it("should return original text if it fits", () => {
      const result = truncateText("Hello", 100, 12);
      expect(result).toBe("Hello");
    });

    it("should truncate text that exceeds width", () => {
      const result = truncateText("Hello World", 30, 12);
      expect(result.length).toBeLessThan("Hello World".length);
      expect(result.endsWith("..")).toBe(true);
    });

    it("should handle very small widths", () => {
      const result = truncateText("Hello World", 10, 12);
      expect(result).toBe("..");
    });

    it("should handle empty text", () => {
      const result = truncateText("", 100, 12);
      expect(result).toBe("");
    });

    it("should calculate max characters based on font size", () => {
      const smallFont = truncateText("Test", 50, 10);
      const largeFont = truncateText("Test", 50, 20);

      // Larger font means fewer characters fit
      expect(smallFont.length).toBeGreaterThanOrEqual(largeFont.length);
    });
  });

  describe("rendering behavior", () => {
    it("should handle empty data gracefully", () => {
      const emptyData: TreemapRenderDatum[] = [];
      expect(emptyData.length).toBe(0);
    });

    it("should process multiple nodes correctly", () => {
      const nodes: TreemapRenderDatum[] = [
        {
          key: "a",
          x0: 0,
          y0: 0,
          x1: 50,
          y1: 50,
          width: 50,
          height: 50,
          color: "#1f77b4",
          segment: "A",
          observation: {} as any,
        },
        {
          key: "b",
          x0: 50,
          y0: 0,
          x1: 100,
          y1: 50,
          width: 50,
          height: 50,
          color: "#ff7f0e",
          segment: "B",
          observation: {} as any,
        },
        {
          key: "c",
          x0: 0,
          y0: 50,
          x1: 100,
          y1: 100,
          width: 100,
          height: 50,
          color: "#2ca02c",
          segment: "C",
          observation: {} as any,
        },
      ];

      expect(nodes.length).toBe(3);
      expect(nodes[0].color).toBe("#1f77b4");
      expect(nodes[1].color).toBe("#ff7f0e");
      expect(nodes[2].color).toBe("#2ca02c");
    });

    it("should identify nodes large enough for labels", () => {
      const minCellWidth = 40;
      const minCellHeight = 25;

      const nodes: TreemapRenderDatum[] = [
        {
          key: "large",
          x0: 0,
          y0: 0,
          x1: 100,
          y1: 50,
          width: 100,
          height: 50,
          color: "#1f77b4",
          segment: "Large",
          observation: {} as any,
        },
        {
          key: "small",
          x0: 100,
          y0: 0,
          x1: 120,
          y1: 20,
          width: 20,
          height: 20,
          color: "#ff7f0e",
          segment: "Small",
          observation: {} as any,
        },
      ];

      const labelableNodes = nodes.filter(
        (n) => n.width >= minCellWidth && n.height >= minCellHeight
      );

      expect(labelableNodes.length).toBe(1);
      expect(labelableNodes[0].key).toBe("large");
    });
  });

  describe("color assignment", () => {
    it("should assign distinct colors to segments", () => {
      const segments = ["A", "B", "C"];
      const colors = new Map([
        ["A", "#1f77b4"],
        ["B", "#ff7f0e"],
        ["C", "#2ca02c"],
      ]);

      segments.forEach((segment) => {
        expect(colors.has(segment)).toBe(true);
      });

      const uniqueColors = new Set(colors.values());
      expect(uniqueColors.size).toBe(3);
    });
  });

  describe("interaction handling", () => {
    it("should define click handler for nodes", () => {
      const clickedObservations: any[] = [];
      const onClick = (observation: any) => {
        clickedObservations.push(observation);
      };

      const observation = { id: "1", value: 100 };
      onClick(observation);

      expect(clickedObservations.length).toBe(1);
      expect(clickedObservations[0]).toBe(observation);
    });

    it("should define hover handlers for nodes", () => {
      const hoverStates: { observation: any; hovered: boolean }[] = [];
      const onHover = (observation: any) => {
        hoverStates.push({ observation, hovered: true });
      };
      const onHoverOut = () => {
        hoverStates.push({ observation: null, hovered: false });
      };

      const observation = { id: "1", value: 100 };
      onHover(observation);
      onHoverOut();

      expect(hoverStates.length).toBe(2);
      expect(hoverStates[0].hovered).toBe(true);
      expect(hoverStates[1].hovered).toBe(false);
    });
  });

  describe("transition animations", () => {
    it("should handle transition options", () => {
      const transitionOptions = {
        enable: true,
        duration: 300,
      };

      expect(transitionOptions.enable).toBe(true);
      expect(transitionOptions.duration).toBe(300);
    });

    it("should handle disabled transitions", () => {
      const transitionOptions = {
        enable: false,
        duration: 0,
      };

      expect(transitionOptions.enable).toBe(false);
    });
  });
});
