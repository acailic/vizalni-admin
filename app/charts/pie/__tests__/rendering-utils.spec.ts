import { describe, it, expect } from "vitest";

import {
  calculateDonutInnerRadius,
  shouldUseLeaderLines,
} from "../rendering-utils";

describe("PieChart rendering utils", () => {
  describe("calculateDonutInnerRadius", () => {
    it("should return 0 for pie variant", () => {
      expect(calculateDonutInnerRadius("pie", 100)).toBe(0);
    });

    it("should return 50% of outer radius for donut variant", () => {
      expect(calculateDonutInnerRadius("donut", 100)).toBe(50);
    });

    it("should return 60% for thin donut", () => {
      expect(calculateDonutInnerRadius("donut-thin", 100)).toBe(60);
    });
  });

  describe("shouldUseLeaderLines", () => {
    it("should return true for small slices", () => {
      expect(shouldUseLeaderLines(5, 10)).toBe(true);
    });

    it("should return false for large slices", () => {
      expect(shouldUseLeaderLines(45, 10)).toBe(false);
    });
  });
});
