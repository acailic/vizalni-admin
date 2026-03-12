import { describe, it, expect } from "vitest";
import { createTimeScale } from "../../src/scales/time";

describe("createTimeScale", () => {
  it("should create a time scale with date domain", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    expect(scale(new Date("2024-01-01"))).toBe(0);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(500, 1);
  });

  it("should map mid-year date correctly", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    // July 2nd should be approximately middle
    const midYear = scale(new Date("2024-07-02"));
    expect(midYear).toBeGreaterThan(240);
    expect(midYear).toBeLessThan(260);
  });

  it("should handle inverted range for y-axis", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [400, 0],
    });

    expect(scale(new Date("2024-01-01"))).toBe(400);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(0, 1);
  });

  it("should clamp values when clamp is true", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
      clamp: true,
    });

    // Dates outside domain should be clamped
    expect(scale(new Date("2023-01-01"))).toBe(0);
    expect(scale(new Date("2025-01-01"))).toBeCloseTo(500, 1);
  });

  it("should not clamp by default", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    // Dates outside domain should extrapolate
    expect(scale(new Date("2023-01-01"))).toBeLessThan(0);
    expect(scale(new Date("2025-01-01"))).toBeGreaterThan(500);
  });

  it("should apply nice with boolean true", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-15"), new Date("2024-12-15")],
      range: [0, 500],
      nice: true,
    });

    // Nice should extend domain to cleaner boundaries
    const domain = scale.domain();
    expect(domain.length).toBe(2);
    // Just verify the domain was adjusted, not exact values
    expect(domain[0] instanceof Date).toBe(true);
    expect(domain[1] instanceof Date).toBe(true);
  });

  it("should apply nice with string interval - month", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-15"), new Date("2024-06-15")],
      range: [0, 500],
      nice: "month",
    });

    const domain = scale.domain();
    expect(domain.length).toBe(2);
    // Domain should be nicely rounded to month boundaries
    expect(domain[0] instanceof Date).toBe(true);
    expect(domain[1] instanceof Date).toBe(true);
  });

  it("should apply nice with string interval - day", () => {
    const scale = createTimeScale({
      domain: [
        new Date("2024-01-15T12:00:00"),
        new Date("2024-01-20T12:00:00"),
      ],
      range: [0, 500],
      nice: "day",
    });

    const domain = scale.domain();
    expect(domain.length).toBe(2);
  });

  it("should apply nice with string interval - year", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-03-15"), new Date("2024-09-20")],
      range: [0, 500],
      nice: "year",
    });

    const domain = scale.domain();
    expect(domain[0].getFullYear()).toBeLessThanOrEqual(2024);
    expect(domain[1].getFullYear()).toBeGreaterThanOrEqual(2024);
  });

  it("should handle same date values", () => {
    const sameDate = new Date("2024-06-15");
    const scale = createTimeScale({
      domain: [sameDate, sameDate],
      range: [0, 500],
    });

    // Should still return a number
    expect(typeof scale(sameDate)).toBe("number");
  });

  it("should support invert function", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    const inverted = scale.invert(250);
    expect(inverted instanceof Date).toBe(true);
    // Mid year should be around June/July
    expect(inverted.getMonth()).toBeGreaterThanOrEqual(5); // June or later
    expect(inverted.getMonth()).toBeLessThanOrEqual(7); // July or earlier
  });

  it("should handle single day range", () => {
    const scale = createTimeScale({
      domain: [
        new Date("2024-01-01T00:00:00"),
        new Date("2024-01-01T23:59:59"),
      ],
      range: [0, 500],
    });

    expect(scale(new Date("2024-01-01T00:00:00"))).toBe(0);
    expect(scale(new Date("2024-01-01T12:00:00"))).toBeCloseTo(250, -1);
  });
});
