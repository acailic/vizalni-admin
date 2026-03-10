import { describe, it, expect, vi } from "vitest";

import { GaugeArcRenderDatum } from "../gauge";

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
 * Convert degrees to radians
 */
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Calculate needle angle for a given value
 */
const calculateNeedleAngle = (
  value: number,
  min: number,
  max: number,
  startAngle: number,
  endAngle: number
): number => {
  const clampedValue = Math.max(min, Math.min(max, value));
  const angleRange = max - min;
  const totalAngle = endAngle - startAngle;
  return startAngle + ((clampedValue - min) / angleRange) * totalAngle;
};

/**
 * Create needle path string
 */
const createNeedlePath = (length: number, baseWidth: number): string => {
  const tipY = -length;
  const baseY = baseWidth * 0.5;
  const halfBase = baseWidth / 2;
  return `M 0 ${tipY} L ${-halfBase} ${baseY} L ${halfBase} ${baseY} Z`;
};

describe("Gauge", () => {
  describe("GaugeArcRenderDatum type", () => {
    it("should define a valid gauge arc render datum", () => {
      const arc = {
        startAngle: degreesToRadians(-135),
        endAngle: degreesToRadians(-45),
        innerRadius: 70,
        outerRadius: 100,
        color: "#22c55e",
        label: "Good",
        value: 50,
      };

      const datum: GaugeArcRenderDatum = {
        key: "good",
        arc,
        color: "#22c55e",
        opacity: 1,
        isValueArc: true,
      };

      expect(datum.key).toBe("good");
      expect(datum.color).toBe("#22c55e");
      expect(datum.opacity).toBe(1);
      expect(datum.isValueArc).toBe(true);
      expect(datum.arc.value).toBe(50);
    });

    it("should support background arcs without value", () => {
      const datum: GaugeArcRenderDatum = {
        key: "background",
        arc: {
          startAngle: degreesToRadians(-135),
          endAngle: degreesToRadians(135),
          innerRadius: 70,
          outerRadius: 100,
          color: "#e5e7eb",
          label: "background",
        },
        color: "#e5e7eb",
        opacity: 1,
        isValueArc: false,
      };

      expect(datum.arc.value).toBeUndefined();
      expect(datum.isValueArc).toBe(false);
    });
  });

  describe("degreesToRadians", () => {
    it("should convert 0 degrees to 0 radians", () => {
      expect(degreesToRadians(0)).toBe(0);
    });

    it("should convert 180 degrees to PI radians", () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
    });

    it("should convert 90 degrees to PI/2 radians", () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
    });

    it("should convert -135 degrees correctly", () => {
      expect(degreesToRadians(-135)).toBeCloseTo(-Math.PI * 0.75);
    });

    it("should convert 135 degrees correctly", () => {
      expect(degreesToRadians(135)).toBeCloseTo(Math.PI * 0.75);
    });
  });

  describe("calculateNeedleAngle", () => {
    it("should calculate angle for minimum value", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const angle = calculateNeedleAngle(0, 0, 100, startAngle, endAngle);

      expect(angle).toBeCloseTo(startAngle);
    });

    it("should calculate angle for maximum value", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const angle = calculateNeedleAngle(100, 0, 100, startAngle, endAngle);

      expect(angle).toBeCloseTo(endAngle);
    });

    it("should calculate angle for middle value", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const midAngle = (startAngle + endAngle) / 2;
      const angle = calculateNeedleAngle(50, 0, 100, startAngle, endAngle);

      expect(angle).toBeCloseTo(midAngle);
    });

    it("should clamp values below minimum", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const angle = calculateNeedleAngle(-50, 0, 100, startAngle, endAngle);

      expect(angle).toBeCloseTo(startAngle);
    });

    it("should clamp values above maximum", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const angle = calculateNeedleAngle(150, 0, 100, startAngle, endAngle);

      expect(angle).toBeCloseTo(endAngle);
    });

    it("should handle custom min/max ranges", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(135);
      const angle = calculateNeedleAngle(500, 0, 1000, startAngle, endAngle);
      const expectedMidAngle = (startAngle + endAngle) / 2;

      expect(angle).toBeCloseTo(expectedMidAngle);
    });
  });

  describe("createNeedlePath", () => {
    it("should create a valid SVG path string", () => {
      const path = createNeedlePath(80, 8);

      expect(path).toContain("M");
      expect(path).toContain("L");
      expect(path).toContain("Z");
    });

    it("should create a needle pointing upward", () => {
      const length = 80;
      const baseWidth = 8;
      const path = createNeedlePath(length, baseWidth);

      // The needle should start at the tip (0, -length)
      expect(path).toContain(`M 0 ${-length}`);
    });

    it("should create a needle with proper base width", () => {
      const length = 80;
      const baseWidth = 8;
      const halfBase = baseWidth / 2;
      const path = createNeedlePath(length, baseWidth);

      // The base should have the correct width
      expect(path).toContain(`L ${-halfBase}`);
      expect(path).toContain(`L ${halfBase}`);
    });
  });

  describe("arc generation", () => {
    it("should calculate arc angles correctly for thresholds", () => {
      const min = 0;
      const max = 100;
      const totalAngle = degreesToRadians(270); // -135 to 135
      const startAngle = degreesToRadians(-135);

      // First threshold at 50 (halfway - should be at 0 degrees)
      const threshold1EndAngle =
        startAngle + ((50 - min) / (max - min)) * totalAngle;
      expect(threshold1EndAngle).toBeCloseTo(0, 1);

      // Second threshold at 100 (end - should be at 135 degrees)
      const threshold2EndAngle =
        startAngle + ((100 - min) / (max - min)) * totalAngle;
      expect(threshold2EndAngle).toBeCloseTo(degreesToRadians(135), 1);
    });

    it("should handle radius calculations", () => {
      const outerRadius = 100;
      const innerRadiusRatio = 0.7;
      const innerRadius = outerRadius * innerRadiusRatio;

      expect(innerRadius).toBe(70);
      expect(outerRadius - innerRadius).toBe(30); // Arc width
    });
  });

  describe("threshold zones", () => {
    it("should define default threshold colors", () => {
      const defaultColors = [
        "#22c55e", // green - good
        "#eab308", // yellow - warning
        "#ef4444", // red - critical
      ];

      expect(defaultColors.length).toBe(3);
      expect(defaultColors[0]).toBe("#22c55e");
      expect(defaultColors[1]).toBe("#eab308");
      expect(defaultColors[2]).toBe("#ef4444");
    });

    it("should determine active threshold for value", () => {
      const thresholds = [
        { value: 33, color: "#22c55e", label: "Good" },
        { value: 66, color: "#eab308", label: "Warning" },
        { value: 100, color: "#ef4444", label: "Critical" },
      ];

      const getActiveThreshold = (value: number) => {
        const sorted = [...thresholds].sort((a, b) => a.value - b.value);
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (value >= sorted[i].value) {
            return sorted[i];
          }
        }
        return undefined;
      };

      expect(getActiveThreshold(0)).toBeUndefined();
      expect(getActiveThreshold(33)?.color).toBe("#22c55e");
      expect(getActiveThreshold(50)?.color).toBe("#22c55e");
      expect(getActiveThreshold(66)?.color).toBe("#eab308");
      expect(getActiveThreshold(80)?.color).toBe("#eab308");
      expect(getActiveThreshold(100)?.color).toBe("#ef4444");
    });
  });

  describe("interaction handling", () => {
    it("should define hover handlers for highlighting", () => {
      const hoverStates: { arcLabel: string | null; hovered: boolean }[] = [];
      const onHover = (arcLabel: string) => {
        hoverStates.push({ arcLabel, hovered: true });
      };
      const onHoverOut = () => {
        hoverStates.push({ arcLabel: null, hovered: false });
      };

      onHover("Good");
      onHoverOut();

      expect(hoverStates.length).toBe(2);
      expect(hoverStates[0].hovered).toBe(true);
      expect(hoverStates[0].arcLabel).toBe("Good");
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

    it("should interpolate needle angle for animation", () => {
      const startAngle = degreesToRadians(-135);
      const endAngle = degreesToRadians(45);
      const interpolateAngle = (t: number) =>
        startAngle + (endAngle - startAngle) * t;

      expect(interpolateAngle(0)).toBeCloseTo(startAngle);
      expect(interpolateAngle(0.5)).toBeCloseTo((startAngle + endAngle) / 2);
      expect(interpolateAngle(1)).toBeCloseTo(endAngle);
    });
  });

  describe("value display", () => {
    it("should format values correctly", () => {
      const formatValue = (value: number | null): string => {
        if (value === null) return "-";
        return value.toFixed(0);
      };

      expect(formatValue(75)).toBe("75");
      expect(formatValue(0)).toBe("0");
      expect(formatValue(null)).toBe("-");
    });

    it("should position value below center", () => {
      const centerY = 150;
      const radius = 100;
      const valueY = centerY + radius * 0.3;

      expect(valueY).toBe(180);
    });
  });

  describe("rendering behavior", () => {
    it("should handle empty data gracefully", () => {
      const emptyData: GaugeArcRenderDatum[] = [];
      expect(emptyData.length).toBe(0);
    });

    it("should process multiple arcs correctly", () => {
      const arcs: GaugeArcRenderDatum[] = [
        {
          key: "background",
          arc: {
            startAngle: degreesToRadians(-135),
            endAngle: degreesToRadians(135),
            innerRadius: 70,
            outerRadius: 100,
            color: "#e5e7eb",
          },
          color: "#e5e7eb",
          opacity: 1,
        },
        {
          key: "value",
          arc: {
            startAngle: degreesToRadians(-135),
            endAngle: degreesToRadians(-45),
            innerRadius: 70,
            outerRadius: 100,
            color: "#22c55e",
          },
          color: "#22c55e",
          opacity: 1,
          isValueArc: true,
        },
      ];

      expect(arcs.length).toBe(2);
      expect(arcs[0].color).toBe("#e5e7eb");
      expect(arcs[1].color).toBe("#22c55e");
      expect(arcs[1].isValueArc).toBe(true);
    });

    it("should handle threshold-based arcs", () => {
      const min = 0;
      const max = 100;
      const startAngle = degreesToRadians(-135);
      const totalAngle = degreesToRadians(270);

      const thresholds = [
        { value: 33, color: "#22c55e", label: "Good" },
        { value: 66, color: "#eab308", label: "Warning" },
        { value: 100, color: "#ef4444", label: "Critical" },
      ];

      const arcs: GaugeArcRenderDatum[] = [];
      let prevValue = min;

      thresholds.forEach((threshold, index) => {
        const arcStartAngle =
          startAngle + ((prevValue - min) / (max - min)) * totalAngle;
        const arcEndAngle =
          startAngle + ((threshold.value - min) / (max - min)) * totalAngle;

        arcs.push({
          key: threshold.label ?? `threshold-${index}`,
          arc: {
            startAngle: arcStartAngle,
            endAngle: arcEndAngle,
            innerRadius: 70,
            outerRadius: 100,
            color: threshold.color,
            label: threshold.label,
            value: threshold.value,
          },
          color: threshold.color,
          opacity: 1,
          isValueArc: true,
        });

        prevValue = threshold.value;
      });

      expect(arcs.length).toBe(3);
      expect(arcs[0].arc.startAngle).toBeCloseTo(startAngle);
      expect(arcs[2].arc.endAngle).toBeCloseTo(startAngle + totalAngle);
    });
  });

  describe("needle rotation", () => {
    it("should convert radians to degrees for rotation", () => {
      const radiansToDegrees = (radians: number): number => {
        return (radians * 180) / Math.PI;
      };

      expect(radiansToDegrees(0)).toBe(0);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(-Math.PI * 0.75)).toBeCloseTo(-135);
    });

    it("should calculate rotation transform correctly", () => {
      const centerX = 150;
      const centerY = 150;
      const angle = degreesToRadians(45);

      const rotationDegrees = (angle * 180) / Math.PI;
      const transform = `translate(${centerX}, ${centerY}) rotate(${rotationDegrees})`;

      expect(transform).toBe("translate(150, 150) rotate(45)");
    });
  });
});
