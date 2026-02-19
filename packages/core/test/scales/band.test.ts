import { describe, it, expect } from "vitest";
import { createBandScale } from "../../src/scales/band";

describe("createBandScale", () => {
  it("should create a band scale with domain and range", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 300],
      padding: 0,
    });

    expect(scale("A")).toBe(0);
    expect(scale("B")).toBe(100);
    expect(scale("C")).toBe(200);
    expect(scale.bandwidth()).toBe(100);
  });

  it("should apply padding", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 300],
      padding: 0.5,
    });

    // With padding, bandwidth should be smaller
    expect(scale.bandwidth()).toBeLessThan(100);
  });

  it("should return undefined for unknown category", () => {
    const scale = createBandScale({
      domain: ["A", "B"],
      range: [0, 100],
    });

    expect(scale("Z")).toBeUndefined();
  });
});
