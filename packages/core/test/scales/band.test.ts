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

  it("should apply paddingInner and paddingOuter separately", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 300],
      paddingInner: 0.2,
      paddingOuter: 0.1,
    });

    expect(scale.bandwidth()).toBeLessThan(100);
    expect(scale("A")).toBeGreaterThanOrEqual(0);
  });

  it("should round output values when round is true", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 100],
      round: true,
      padding: 0.1,
    });

    // Positions should be integers
    expect(Number.isInteger(scale("A"))).toBe(true);
    expect(Number.isInteger(scale("B"))).toBe(true);
  });

  it("should handle empty domain", () => {
    const scale = createBandScale({
      domain: [],
      range: [0, 100],
    });

    expect(scale.bandwidth()).toBeGreaterThan(0);
    expect(scale("A")).toBeUndefined();
  });

  it("should handle single item domain", () => {
    const scale = createBandScale({
      domain: ["A"],
      range: [0, 100],
    });

    // With default padding, position won't be exactly 0
    expect(scale("A")).toBeGreaterThanOrEqual(0);
    expect(scale.bandwidth()).toBeGreaterThan(0);
  });

  it("should handle large number of categories", () => {
    const categories = Array.from({ length: 100 }, (_, i) => `Cat${i}`);
    const scale = createBandScale({
      domain: categories,
      range: [0, 1000],
    });

    // First category position with padding
    expect(scale("Cat0")).toBeGreaterThanOrEqual(0);
    expect(scale("Cat99")).toBeGreaterThan(0);
    expect(scale.bandwidth()).toBeLessThan(20);
  });

  it("should support step function", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 300],
      padding: 0,
    });

    expect(scale.step()).toBe(100);
  });

  it("should support domain function", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [0, 300],
    });

    expect(scale.domain()).toEqual(["A", "B", "C"]);
  });

  it("should handle inverted range", () => {
    const scale = createBandScale({
      domain: ["A", "B", "C"],
      range: [300, 0],
      padding: 0,
    });

    // Inverted range - bands start from right
    expect(scale("A")).toBe(200);
    expect(scale("C")).toBe(0);
  });
});
