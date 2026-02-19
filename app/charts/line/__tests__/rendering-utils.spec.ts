// app/charts/line/__tests__/rendering-utils.spec.ts
import { describe, it, expect } from "vitest";

import { calculateTrendDirection } from "../rendering-utils";

describe("LineChart rendering utils", () => {
  describe("calculateTrendDirection", () => {
    it("should return up for increasing value", () => {
      const result = calculateTrendDirection(100, 110);
      expect(result).toBe("up");
    });

    it("should return down for decreasing value", () => {
      const result = calculateTrendDirection(100, 90);
      expect(result).toBe("down");
    });

    it("should return neutral for same value", () => {
      const result = calculateTrendDirection(100, 100);
      expect(result).toBe("neutral");
    });
  });
});
