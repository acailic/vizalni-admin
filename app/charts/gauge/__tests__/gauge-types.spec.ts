import { describe, expect, it } from "vitest";

import {
  GaugeArc,
  GaugeConfig,
  GaugeFields,
  GaugeNeedle,
  GaugeRenderData,
  GaugeThreshold,
  GaugeValueDisplayData,
  GaugeVisualOptions,
  isGaugeConfig,
} from "../gauge-types";

describe("Gauge Types", () => {
  describe("GaugeConfig", () => {
    it("should define a valid gauge config", () => {
      const config: GaugeConfig = {
        chartType: "gauge",
        fields: {
          value: {
            componentId: "valueField",
            type: "quantitative",
          },
        },
      };

      expect(config.chartType).toBe("gauge");
      expect(config.fields.value.componentId).toBe("valueField");
      expect(config.fields.value.type).toBe("quantitative");
    });

    it("should support optional visual options", () => {
      const config: GaugeConfig = {
        chartType: "gauge",
        fields: {
          value: {
            componentId: "valueField",
            type: "quantitative",
          },
        },
        visualOptions: {
          min: 0,
          max: 100,
          thresholds: [
            { value: 0, color: "#22c55e" },
            { value: 50, color: "#eab308" },
            { value: 80, color: "#ef4444" },
          ],
          showValue: true,
          valueDisplay: "inside",
          layout: "single",
          enableAnimations: true,
          animationDuration: 500,
          startAngle: -135,
          endAngle: 135,
          cornerRadius: 4,
          arcPadding: 2,
        },
      };

      expect(config.visualOptions?.min).toBe(0);
      expect(config.visualOptions?.max).toBe(100);
      expect(config.visualOptions?.thresholds).toHaveLength(3);
      expect(config.visualOptions?.showValue).toBe(true);
      expect(config.visualOptions?.valueDisplay).toBe("inside");
      expect(config.visualOptions?.layout).toBe("single");
      expect(config.visualOptions?.enableAnimations).toBe(true);
      expect(config.visualOptions?.animationDuration).toBe(500);
      expect(config.visualOptions?.startAngle).toBe(-135);
      expect(config.visualOptions?.endAngle).toBe(135);
      expect(config.visualOptions?.cornerRadius).toBe(4);
      expect(config.visualOptions?.arcPadding).toBe(2);
    });

    it("should support comparison layout", () => {
      const config: GaugeConfig = {
        chartType: "gauge",
        fields: {
          value: {
            componentId: "valueField",
            type: "quantitative",
          },
        },
        visualOptions: {
          layout: "comparison",
        },
      };

      expect(config.visualOptions?.layout).toBe("comparison");
    });

    it("should support outside value display", () => {
      const config: GaugeConfig = {
        chartType: "gauge",
        fields: {
          value: {
            componentId: "valueField",
            type: "quantitative",
          },
        },
        visualOptions: {
          valueDisplay: "outside",
        },
      };

      expect(config.visualOptions?.valueDisplay).toBe("outside");
    });
  });

  describe("isGaugeConfig", () => {
    it("should return true for gauge config", () => {
      const config = {
        chartType: "gauge",
        fields: {
          value: {
            componentId: "valueField",
            type: "quantitative" as const,
          },
        },
      };

      expect(isGaugeConfig(config)).toBe(true);
    });

    it("should return false for non-gauge config", () => {
      const config = {
        chartType: "bar",
        fields: {},
      };

      expect(isGaugeConfig(config)).toBe(false);
    });

    it("should return false for pie config", () => {
      const config = {
        chartType: "pie",
        fields: {},
      };

      expect(isGaugeConfig(config)).toBe(false);
    });

    it("should return false for treemap config", () => {
      const config = {
        chartType: "treemap",
        fields: {},
      };

      expect(isGaugeConfig(config)).toBe(false);
    });

    it("should return false for sankey config", () => {
      const config = {
        chartType: "sankey",
        fields: {},
      };

      expect(isGaugeConfig(config)).toBe(false);
    });

    it("should return false for sunburst config", () => {
      const config = {
        chartType: "sunburst",
        fields: {},
      };

      expect(isGaugeConfig(config)).toBe(false);
    });
  });

  describe("GaugeThreshold", () => {
    it("should define a valid threshold", () => {
      const threshold: GaugeThreshold = {
        value: 50,
        color: "#eab308",
        label: "Warning",
      };

      expect(threshold.value).toBe(50);
      expect(threshold.color).toBe("#eab308");
      expect(threshold.label).toBe("Warning");
    });

    it("should support minimal threshold definition", () => {
      const threshold: GaugeThreshold = {
        value: 80,
        color: "#ef4444",
      };

      expect(threshold.value).toBe(80);
      expect(threshold.color).toBe("#ef4444");
      expect(threshold.label).toBeUndefined();
    });
  });

  describe("GaugeFields", () => {
    it("should define valid gauge fields", () => {
      const fields: GaugeFields = {
        value: {
          componentId: "temperature",
          type: "quantitative",
        },
      };

      expect(fields.value.componentId).toBe("temperature");
      expect(fields.value.type).toBe("quantitative");
    });
  });

  describe("GaugeVisualOptions", () => {
    it("should define valid visual options", () => {
      const visualOptions: GaugeVisualOptions = {
        min: 0,
        max: 100,
        thresholds: [
          { value: 25, color: "#22c55e" },
          { value: 50, color: "#eab308" },
          { value: 75, color: "#ef4444" },
        ],
        showValue: true,
        valueDisplay: "inside",
        layout: "single",
        enableAnimations: true,
        animationDuration: 300,
        startAngle: -90,
        endAngle: 90,
        cornerRadius: 2,
        arcPadding: 1,
      };

      expect(visualOptions.min).toBe(0);
      expect(visualOptions.max).toBe(100);
      expect(visualOptions.thresholds).toHaveLength(3);
      expect(visualOptions.showValue).toBe(true);
      expect(visualOptions.valueDisplay).toBe("inside");
      expect(visualOptions.layout).toBe("single");
      expect(visualOptions.enableAnimations).toBe(true);
      expect(visualOptions.animationDuration).toBe(300);
      expect(visualOptions.startAngle).toBe(-90);
      expect(visualOptions.endAngle).toBe(90);
      expect(visualOptions.cornerRadius).toBe(2);
      expect(visualOptions.arcPadding).toBe(1);
    });

    it("should allow partial visual options", () => {
      const visualOptions: GaugeVisualOptions = {
        min: 0,
        max: 100,
        showValue: false,
      };

      expect(visualOptions.min).toBe(0);
      expect(visualOptions.max).toBe(100);
      expect(visualOptions.showValue).toBe(false);
      expect(visualOptions.thresholds).toBeUndefined();
      expect(visualOptions.valueDisplay).toBeUndefined();
    });
  });

  describe("GaugeArc", () => {
    it("should define a valid gauge arc", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 40,
        outerRadius: 60,
        color: "#22c55e",
        label: "Good",
        value: 25,
      };

      expect(arc.startAngle).toBe(0);
      expect(arc.endAngle).toBe(Math.PI / 2);
      expect(arc.innerRadius).toBe(40);
      expect(arc.outerRadius).toBe(60);
      expect(arc.color).toBe("#22c55e");
      expect(arc.label).toBe("Good");
      expect(arc.value).toBe(25);
    });

    it("should support minimal arc definition", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI,
        innerRadius: 50,
        outerRadius: 70,
        color: "#3b82f6",
      };

      expect(arc.startAngle).toBe(0);
      expect(arc.endAngle).toBe(Math.PI);
      expect(arc.color).toBe("#3b82f6");
      expect(arc.label).toBeUndefined();
    });
  });

  describe("GaugeNeedle", () => {
    it("should define a valid gauge needle", () => {
      const needle: GaugeNeedle = {
        value: 65,
        angle: Math.PI * 0.65,
        length: 0.85,
        baseWidth: 8,
        color: "#1f2937",
      };

      expect(needle.value).toBe(65);
      expect(needle.angle).toBeCloseTo(Math.PI * 0.65);
      expect(needle.length).toBe(0.85);
      expect(needle.baseWidth).toBe(8);
      expect(needle.color).toBe("#1f2937");
    });

    it("should support minimal needle definition", () => {
      const needle: GaugeNeedle = {
        value: 50,
        angle: Math.PI / 2,
        length: 0.9,
        baseWidth: 6,
      };

      expect(needle.value).toBe(50);
      expect(needle.angle).toBeCloseTo(Math.PI / 2);
      expect(needle.color).toBeUndefined();
    });
  });

  describe("GaugeValueDisplayData", () => {
    it("should define valid value display data", () => {
      const valueDisplay: GaugeValueDisplayData = {
        formattedValue: "65%",
        rawValue: 65,
        x: 100,
        y: 80,
        fontSize: 24,
        color: "#1f2937",
      };

      expect(valueDisplay.formattedValue).toBe("65%");
      expect(valueDisplay.rawValue).toBe(65);
      expect(valueDisplay.x).toBe(100);
      expect(valueDisplay.y).toBe(80);
      expect(valueDisplay.fontSize).toBe(24);
      expect(valueDisplay.color).toBe("#1f2937");
    });

    it("should support minimal value display definition", () => {
      const valueDisplay: GaugeValueDisplayData = {
        formattedValue: "75",
        rawValue: 75,
        x: 50,
        y: 60,
      };

      expect(valueDisplay.formattedValue).toBe("75");
      expect(valueDisplay.rawValue).toBe(75);
      expect(valueDisplay.fontSize).toBeUndefined();
      expect(valueDisplay.color).toBeUndefined();
    });
  });

  describe("GaugeRenderData", () => {
    it("should define valid render data", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI,
        innerRadius: 40,
        outerRadius: 60,
        color: "#22c55e",
      };

      const needle: GaugeNeedle = {
        value: 50,
        angle: Math.PI / 2,
        length: 0.85,
        baseWidth: 8,
      };

      const valueDisplay: GaugeValueDisplayData = {
        formattedValue: "50",
        rawValue: 50,
        x: 100,
        y: 80,
      };

      const renderData: GaugeRenderData = {
        value: 50,
        min: 0,
        max: 100,
        percentage: 0.5,
        arcs: [arc],
        needle,
        valueDisplay,
        activeThreshold: {
          value: 50,
          color: "#eab308",
        },
      };

      expect(renderData.value).toBe(50);
      expect(renderData.min).toBe(0);
      expect(renderData.max).toBe(100);
      expect(renderData.percentage).toBe(0.5);
      expect(renderData.arcs).toHaveLength(1);
      expect(renderData.needle.value).toBe(50);
      expect(renderData.valueDisplay?.formattedValue).toBe("50");
      expect(renderData.activeThreshold?.value).toBe(50);
    });

    it("should support minimal render data", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI * 2,
        innerRadius: 40,
        outerRadius: 60,
        color: "#3b82f6",
      };

      const needle: GaugeNeedle = {
        value: 25,
        angle: Math.PI,
        length: 0.9,
        baseWidth: 6,
      };

      const renderData: GaugeRenderData = {
        value: 25,
        min: 0,
        max: 100,
        percentage: 0.25,
        arcs: [arc],
        needle,
      };

      expect(renderData.value).toBe(25);
      expect(renderData.percentage).toBe(0.25);
      expect(renderData.valueDisplay).toBeUndefined();
      expect(renderData.activeThreshold).toBeUndefined();
    });
  });
});
