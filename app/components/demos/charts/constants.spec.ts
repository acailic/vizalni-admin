import { describe, expect, it } from "vitest";

import {
  CHART_ANIMATION,
  CHART_COLORS,
  CHART_DATA_LIMITS,
  CHART_DIMENSIONS,
} from "./constants";

describe("Chart Constants", () => {
  describe("CHART_DIMENSIONS", () => {
    it("should have default width", () => {
      expect(CHART_DIMENSIONS.DEFAULT_WIDTH).toBe(800);
    });

    it("should have default height", () => {
      expect(CHART_DIMENSIONS.DEFAULT_HEIGHT).toBe(400);
    });

    it("should have valid margins", () => {
      expect(CHART_DIMENSIONS.DEFAULT_MARGIN).toEqual({
        top: 20,
        right: 30,
        bottom: 60,
        left: 80,
      });
    });
  });

  describe("CHART_DATA_LIMITS", () => {
    it("should limit visible rows to 20", () => {
      expect(CHART_DATA_LIMITS.MAX_VISIBLE_ROWS).toBe(20);
    });

    it("should limit pie slices to 10", () => {
      expect(CHART_DATA_LIMITS.MAX_PIE_SLICES).toBe(10);
    });

    it("should set visualizer max to 25", () => {
      expect(CHART_DATA_LIMITS.VISUALIZER_MAX_ROWS).toBe(25);
    });
  });

  describe("CHART_COLORS", () => {
    it("should have primary color", () => {
      expect(CHART_COLORS.PRIMARY).toBe("#6366f1");
    });

    it("should have 8 colors in palette", () => {
      expect(CHART_COLORS.PROFESSIONAL_PALETTE).toHaveLength(8);
    });

    it("should have valid hex colors in palette", () => {
      CHART_COLORS.PROFESSIONAL_PALETTE.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe("CHART_ANIMATION", () => {
    it("should have default duration of 1200ms", () => {
      expect(CHART_ANIMATION.DEFAULT_DURATION).toBe(1200);
    });
  });
});
