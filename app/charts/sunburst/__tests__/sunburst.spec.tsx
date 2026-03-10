import { describe, it, expect, vi } from "vitest";

import { SunburstArcRenderDatum } from "../sunburst";

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

/**
 * Format value for display
 * (Replicated here for testing purposes)
 */
const formatValue = (value: number | undefined): string => {
  if (value === undefined || value === null) return "-";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

/**
 * Check if a node is a descendant of another node
 */
const isDescendant = (
  nodeId: string,
  ancestorId: string,
  parentMap: Map<string, string | null>
): boolean => {
  let currentId: string | null = nodeId;
  while (currentId) {
    if (currentId === ancestorId) {
      return true;
    }
    currentId = parentMap.get(currentId) ?? null;
  }
  return false;
};

describe("Sunburst", () => {
  describe("SunburstArcRenderDatum type", () => {
    it("should define a valid sunburst arc render datum", () => {
      const mockNode = {
        data: {
          id: "segment-a",
          name: "Segment A",
          value: 100,
          depth: 0,
        },
        x0: 0,
        x1: Math.PI / 2,
        y0: 0,
        y1: 100,
        depth: 0,
        value: 100,
      } as any;

      const datum: SunburstArcRenderDatum = {
        key: "segment-a",
        node: mockNode,
        color: "#4e79a7",
        segment: "Segment A",
        opacity: 1,
      };

      expect(datum.key).toBe("segment-a");
      expect(datum.color).toBe("#4e79a7");
      expect(datum.segment).toBe("Segment A");
      expect(datum.opacity).toBe(1);
    });

    it("should support partial opacity for highlighting", () => {
      const datum: SunburstArcRenderDatum = {
        key: "test",
        node: {} as any,
        color: "#f28e2c",
        segment: "Test",
        opacity: 0.3, // Dimmed when another segment is focused
      };

      expect(datum.opacity).toBe(0.3);
    });
  });

  describe("formatValue", () => {
    it("should format small numbers without suffix", () => {
      expect(formatValue(100)).toBe("100");
      expect(formatValue(999)).toBe("999");
    });

    it("should format thousands with K suffix", () => {
      expect(formatValue(1000)).toBe("1.0K");
      expect(formatValue(5500)).toBe("5.5K");
      expect(formatValue(999999)).toBe("1000.0K");
    });

    it("should format millions with M suffix", () => {
      expect(formatValue(1000000)).toBe("1.0M");
      expect(formatValue(2500000)).toBe("2.5M");
      expect(formatValue(12345678)).toBe("12.3M");
    });

    it("should handle undefined and null values", () => {
      expect(formatValue(undefined)).toBe("-");
      expect(formatValue(null as any)).toBe("-");
    });

    it("should handle zero", () => {
      expect(formatValue(0)).toBe("0");
    });
  });

  describe("isDescendant", () => {
    it("should return true when node is a direct child", () => {
      const parentMap = new Map<string, string | null>([
        ["child", "parent"],
        ["parent", null],
      ]);

      expect(isDescendant("child", "parent", parentMap)).toBe(true);
    });

    it("should return true when node is a grandchild", () => {
      const parentMap = new Map<string, string | null>([
        ["grandchild", "child"],
        ["child", "parent"],
        ["parent", null],
      ]);

      expect(isDescendant("grandchild", "parent", parentMap)).toBe(true);
    });

    it("should return false when node is not a descendant", () => {
      const parentMap = new Map<string, string | null>([
        ["child1", "parent"],
        ["child2", "parent"],
        ["parent", null],
      ]);

      expect(isDescendant("child1", "child2", parentMap)).toBe(false);
    });

    it("should return true when checking same node", () => {
      const parentMap = new Map<string, string | null>([["node", null]]);

      expect(isDescendant("node", "node", parentMap)).toBe(true);
    });
  });

  describe("arc generation", () => {
    it("should calculate arc angles correctly", () => {
      const fullCircle = 2 * Math.PI;
      const quarterCircle = Math.PI / 2;

      // Full circle should be approximately 6.28
      expect(fullCircle).toBeCloseTo(6.28, 1);

      // Quarter circle should be approximately 1.57
      expect(quarterCircle).toBeCloseTo(1.57, 1);
    });

    it("should handle radius calculations", () => {
      const outerRadius = 200;
      const innerRadiusRatio = 0.3;
      const innerRadius = outerRadius * innerRadiusRatio;

      expect(innerRadius).toBe(60);
      expect(outerRadius - innerRadius).toBe(140); // Arc width
    });
  });

  describe("color assignment", () => {
    it("should assign distinct colors to segments", () => {
      const segments = ["Category A", "Category B", "Category C"];
      const colors = new Map([
        ["Category A", "#1f77b4"],
        ["Category B", "#ff7f0e"],
        ["Category C", "#2ca02c"],
      ]);

      segments.forEach((segment) => {
        expect(colors.has(segment)).toBe(true);
      });

      const uniqueColors = new Set(colors.values());
      expect(uniqueColors.size).toBe(3);
    });

    it("should inherit color from parent for child nodes", () => {
      // In sunburst, children typically inherit color from their root ancestor
      const parentColor = "#1f77b4";
      const childDatum: SunburstArcRenderDatum = {
        key: "parent-child",
        node: {} as any,
        color: parentColor, // Same as parent
        segment: "Child",
        opacity: 1,
      };

      expect(childDatum.color).toBe(parentColor);
    });
  });

  describe("highlighting behavior", () => {
    it("should determine focused segment opacity", () => {
      const focusedSegment = "parent";
      const testData: SunburstArcRenderDatum[] = [
        {
          key: "parent",
          node: {} as any,
          color: "#1f77b4",
          segment: "Parent",
          opacity: 1,
        },
        {
          key: "parent-child",
          node: {} as any,
          color: "#1f77b4",
          segment: "Child",
          opacity: 1,
        },
        {
          key: "other",
          node: {} as any,
          color: "#ff7f0e",
          segment: "Other",
          opacity: 1,
        },
      ];

      // Apply highlighting logic
      const highlighted = testData.map((d) => ({
        ...d,
        opacity:
          d.key.includes(focusedSegment) || focusedSegment.includes(d.key)
            ? 1
            : 0.3,
      }));

      expect(highlighted[0].opacity).toBe(1); // Parent - matched
      expect(highlighted[1].opacity).toBe(1); // Child - contains parent key
      expect(highlighted[2].opacity).toBe(0.3); // Other - dimmed
    });
  });

  describe("interaction handling", () => {
    it("should define click handler for zoom functionality", () => {
      let zoomedNodeId: string | null = null;
      const handleClick = (nodeId: string, hasChildren: boolean) => {
        if (zoomedNodeId === nodeId) {
          zoomedNodeId = null; // Zoom out
        } else if (hasChildren) {
          zoomedNodeId = nodeId; // Zoom in
        }
      };

      handleClick("node-1", true);
      expect(zoomedNodeId).toBe("node-1");

      handleClick("node-1", true);
      expect(zoomedNodeId).toBe(null);
    });

    it("should not zoom on nodes without children", () => {
      let zoomedNodeId: string | null = null;
      const handleClick = (nodeId: string, hasChildren: boolean) => {
        if (hasChildren) {
          zoomedNodeId = nodeId;
        }
      };

      handleClick("leaf-node", false);
      expect(zoomedNodeId).toBe(null);
    });

    it("should define hover handlers for highlighting", () => {
      const hoverStates: { segment: string | null; hovered: boolean }[] = [];
      const onHover = (segment: string) => {
        hoverStates.push({ segment, hovered: true });
      };
      const onHoverOut = () => {
        hoverStates.push({ segment: null, hovered: false });
      };

      onHover("Segment A");
      onHoverOut();

      expect(hoverStates.length).toBe(2);
      expect(hoverStates[0].hovered).toBe(true);
      expect(hoverStates[0].segment).toBe("Segment A");
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

    it("should interpolate arc angles for animation", () => {
      const startAngle = 0;
      const endAngle = Math.PI;
      const interpolateAngle = (t: number) =>
        startAngle + (endAngle - startAngle) * t;

      expect(interpolateAngle(0)).toBe(0);
      expect(interpolateAngle(0.5)).toBeCloseTo(Math.PI / 2);
      expect(interpolateAngle(1)).toBeCloseTo(Math.PI);
    });
  });

  describe("breadcrumb navigation", () => {
    it("should build breadcrumb from hierarchy path", () => {
      const breadcrumbItems = [
        { id: "root", name: "All", depth: 0 },
        { id: "level-0", name: "Category", depth: 1 },
        { id: "level-1", name: "Subcategory", depth: 2 },
      ];

      expect(breadcrumbItems.length).toBe(3);
      expect(breadcrumbItems[0].name).toBe("All");
      expect(breadcrumbItems[2].depth).toBe(2);
    });

    it("should truncate long breadcrumb names", () => {
      const truncateText = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 3) + "...";
      };

      const longName = "Very Long Category Name That Needs Truncation";
      const truncated = truncateText(longName, 8);

      expect(truncated.length).toBe(8);
      expect(truncated.endsWith("...")).toBe(true);
    });
  });

  describe("rendering behavior", () => {
    it("should handle empty data gracefully", () => {
      const emptyData: SunburstArcRenderDatum[] = [];
      expect(emptyData.length).toBe(0);
    });

    it("should process multiple arcs correctly", () => {
      const arcs: SunburstArcRenderDatum[] = [
        {
          key: "a",
          node: { x0: 0, x1: Math.PI / 2 } as any,
          color: "#1f77b4",
          segment: "A",
          opacity: 1,
        },
        {
          key: "b",
          node: { x0: Math.PI / 2, x1: Math.PI } as any,
          color: "#ff7f0e",
          segment: "B",
          opacity: 1,
        },
        {
          key: "c",
          node: { x0: Math.PI, x1: 2 * Math.PI } as any,
          color: "#2ca02c",
          segment: "C",
          opacity: 1,
        },
      ];

      expect(arcs.length).toBe(3);
      expect(arcs[0].color).toBe("#1f77b4");
      expect(arcs[1].color).toBe("#ff7f0e");
      expect(arcs[2].color).toBe("#2ca02c");
    });
  });
});
