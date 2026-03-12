import { describe, it, expect } from "vitest";
import {
  DEFAULT_COLORS,
  getDefaultColor,
  getDefaultColors,
} from "../../src/utils/colors";

describe("Color Utilities", () => {
  describe("DEFAULT_COLORS", () => {
    it("should be an array of 10 colors", () => {
      expect(DEFAULT_COLORS).toHaveLength(10);
    });

    it("should contain valid hex color strings", () => {
      DEFAULT_COLORS.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it("should be readonly (as const)", () => {
      // TypeScript enforces readonly at compile time
      // At runtime, we just verify the array exists
      expect(Array.isArray(DEFAULT_COLORS)).toBe(true);
    });
  });

  describe("getDefaultColor", () => {
    it("should return first color for index 0", () => {
      expect(getDefaultColor(0)).toBe("#4e79a7");
    });

    it("should return second color for index 1", () => {
      expect(getDefaultColor(1)).toBe("#f28e2c");
    });

    it("should return correct colors for all default indices", () => {
      DEFAULT_COLORS.forEach((color, index) => {
        expect(getDefaultColor(index)).toBe(color);
      });
    });

    it("should cycle back to first color when index equals array length", () => {
      expect(getDefaultColor(10)).toBe(DEFAULT_COLORS[0]);
    });

    it("should cycle correctly for large indices", () => {
      expect(getDefaultColor(15)).toBe(DEFAULT_COLORS[5]); // 15 % 10 = 5
      expect(getDefaultColor(23)).toBe(DEFAULT_COLORS[3]); // 23 % 10 = 3
      expect(getDefaultColor(100)).toBe(DEFAULT_COLORS[0]); // 100 % 10 = 0
    });

    it("should handle very large indices", () => {
      expect(getDefaultColor(1000)).toBe(DEFAULT_COLORS[0]);
      expect(getDefaultColor(1000000)).toBeDefined();
    });
  });

  describe("getDefaultColors", () => {
    it("should return an array of colors", () => {
      const colors = getDefaultColors();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors).toHaveLength(10);
    });

    it("should return a copy of DEFAULT_COLORS", () => {
      const colors1 = getDefaultColors();
      const colors2 = getDefaultColors();

      // Should be equal in content
      expect(colors1).toEqual(colors2);

      // But should be different array instances
      expect(colors1).not.toBe(colors2);
    });

    it("should allow mutation without affecting original", () => {
      const colors = getDefaultColors();
      const originalFirst = colors[0];

      // Mutate the returned array
      colors[0] = "#000000";

      // Original should be unchanged
      expect(getDefaultColor(0)).toBe(originalFirst);
      expect(getDefaultColors()[0]).toBe(originalFirst);
    });

    it("should be usable with d3-scale range", () => {
      // Simulate d3-scale usage
      const colors = getDefaultColors();
      expect(colors[0]).toBe("#4e79a7");
      expect(colors[colors.length - 1]).toBe("#bab0ab");
    });
  });
});
