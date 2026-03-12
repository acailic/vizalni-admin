import { describe, it, expect } from "vitest";
import {
  ChartConfigSchema,
  LineChartConfigSchema,
  BarChartConfigSchema,
  PieConfigSchema,
} from "../src/config";

describe("Chart Config Schema", () => {
  describe("LineChartConfigSchema", () => {
    it("should validate a minimal line chart config", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should require x and y fields", () => {
      const config = {
        type: "line",
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should accept optional segment field", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        segment: { field: "category", type: "string" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should accept optional showDots", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        showDots: true,
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should accept optional curve types", () => {
      const curveTypes = ["linear", "step", "cardinal", "monotone"] as const;
      curveTypes.forEach((curve) => {
        const config = {
          type: "line",
          x: { field: "date", type: "date" },
          y: { field: "value", type: "number" },
          curve,
        };
        const result = LineChartConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });
    });

    it("should accept optional label and format on fields", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date", label: "Date", format: "%Y-%m-%d" },
        y: { field: "value", type: "number", label: "Value", format: ".2f" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should reject invalid field types", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "invalid" },
        y: { field: "value", type: "number" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });

  describe("BarChartConfigSchema", () => {
    it("should validate a minimal bar chart config", () => {
      const config = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };
      const result = BarChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should default orientation to vertical", () => {
      const config = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };
      const result = BarChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.orientation).toBe("vertical");
      }
    });

    it("should accept horizontal orientation", () => {
      const config = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
        orientation: "horizontal",
      };
      const result = BarChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should default stack to none", () => {
      const config = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };
      const result = BarChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stack).toBe("none");
      }
    });

    it("should accept stacked and grouped modes", () => {
      const stackModes = ["none", "stacked", "grouped"] as const;
      stackModes.forEach((stack) => {
        const config = {
          type: "bar",
          x: { field: "category", type: "string" },
          y: { field: "value", type: "number" },
          stack,
        };
        const result = BarChartConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });
    });

    it("should accept optional segment field", () => {
      const config = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
        segment: { field: "region", type: "string" },
      };
      const result = BarChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe("PieConfigSchema", () => {
    it("should validate a minimal pie chart config", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should require value and category fields", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should accept optional innerRadius for donut charts", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 0.5,
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should reject innerRadius greater than 1", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 1.5,
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should reject negative innerRadius", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: -0.5,
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should accept innerRadius of 0", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 0,
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should accept innerRadius of 1", () => {
      const config = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
        innerRadius: 1,
      };
      const result = PieConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe("ChartConfigSchema", () => {
    it("should discriminate between chart types", () => {
      const lineConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = ChartConfigSchema.safeParse(lineConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("line");
      }
    });

    it("should validate bar chart config", () => {
      const barConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };
      const result = ChartConfigSchema.safeParse(barConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("bar");
      }
    });

    it("should validate pie chart config", () => {
      const pieConfig = {
        type: "pie",
        value: { field: "value", type: "number" },
        category: { field: "category", type: "string" },
      };
      const result = ChartConfigSchema.safeParse(pieConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("pie");
      }
    });

    it("should reject unknown chart type", () => {
      const invalidConfig = {
        type: "scatter",
        x: { field: "x", type: "number" },
        y: { field: "y", type: "number" },
      };
      const result = ChartConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });
});
