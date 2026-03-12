import { describe, it, expect } from "vitest";
import { createLinearScale } from "../../src/scales/linear";

describe("createLinearScale", () => {
  it("should create a linear scale with domain and range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(250);
    expect(scale(100)).toBe(500);
  });

  it("should handle inverted range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [400, 0],
    });

    expect(scale(0)).toBe(400);
    expect(scale(50)).toBe(200);
    expect(scale(100)).toBe(0);
  });

  it("should handle negative domain values", () => {
    const scale = createLinearScale({
      domain: [-50, 50],
      range: [0, 100],
    });

    expect(scale(-50)).toBe(0);
    expect(scale(0)).toBe(50);
    expect(scale(50)).toBe(100);
  });

  it("should clamp values when clamp is true", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
      clamp: true,
    });

    expect(scale(-10)).toBe(0);
    expect(scale(110)).toBe(500);
  });

  it("should return nice values for nice option", () => {
    const scale = createLinearScale({
      domain: [3, 97],
      range: [0, 500],
      nice: true,
    });

    // Nice should round to clean values
    const domain = scale.domain();
    expect(domain[0]).toBeLessThanOrEqual(3);
    expect(domain[1]).toBeGreaterThanOrEqual(97);
  });

  it("should accept nice as a number for tick count", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
      nice: 5,
    });

    // Should work without error and produce a valid scale
    expect(scale(50)).toBe(250);
    const domain = scale.domain();
    expect(domain.length).toBe(2);
  });

  it("should handle very small domains", () => {
    const scale = createLinearScale({
      domain: [0.0001, 0.0002],
      range: [0, 100],
    });

    expect(scale(0.0001)).toBe(0);
    expect(scale(0.00015)).toBeCloseTo(50, 10);
    expect(scale(0.0002)).toBe(100);
  });

  it("should handle very large domains", () => {
    const scale = createLinearScale({
      domain: [0, 1000000000],
      range: [0, 100],
    });

    expect(scale(0)).toBe(0);
    expect(scale(500000000)).toBe(50);
    expect(scale(1000000000)).toBe(100);
  });

  it("should handle same domain values", () => {
    const scale = createLinearScale({
      domain: [50, 50],
      range: [0, 100],
    });

    // When domain min === max, d3-scale handles this
    expect(typeof scale(50)).toBe("number");
  });

  it("should not clamp by default", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    // Values outside domain should extrapolate
    expect(scale(-10)).toBe(-50);
    expect(scale(110)).toBe(550);
  });

  it("should support invert function", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    expect(scale.invert(0)).toBe(0);
    expect(scale.invert(250)).toBe(50);
    expect(scale.invert(500)).toBe(100);
  });

  it("should support ticks function", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    const ticks = scale.ticks(5);
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks[0]).toBe(0);
  });
});
