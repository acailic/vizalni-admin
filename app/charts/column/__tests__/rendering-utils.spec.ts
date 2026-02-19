import { describe, it, expect } from "vitest";

import {
  calculateBarRadius,
  shouldShowRoundedCorners,
} from "../rendering-utils";

describe("ColumnChart rendering utils", () => {
  describe("shouldShowRoundedCorners", () => {
    it("should return true for modern theme", () => {
      expect(shouldShowRoundedCorners("modern")).toBe(true);
    });

    it("should return true when explicitly enabled", () => {
      expect(shouldShowRoundedCorners("default", true)).toBe(true);
    });

    it("should return false for default theme without override", () => {
      expect(shouldShowRoundedCorners("default")).toBe(false);
    });
  });

  describe("calculateBarRadius", () => {
    it("should return 4 for modern theme", () => {
      expect(calculateBarRadius("modern", 20)).toBe(4);
    });

    it("should cap radius at half of bar height", () => {
      expect(calculateBarRadius("modern", 6)).toBe(3);
    });

    it("should return 2 for minimal theme", () => {
      expect(calculateBarRadius("minimal", 20)).toBe(2);
    });
  });
});
