import { describe, it, expect } from "vitest";
import { createOrdinalScale, createColorScale } from "../../src/scales/ordinal";

describe("createOrdinalScale", () => {
  it("should map domain values to range", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: [10, 20, 30],
    });

    expect(scale("A")).toBe(10);
    expect(scale("B")).toBe(20);
    expect(scale("C")).toBe(30);
  });

  it("should handle unknown values by cycling", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B"],
      range: [10, 20],
    });

    expect(scale("A")).toBe(10);
    expect(scale("D")).toBe(10); // Cycles back
  });

  it("should handle empty domain", () => {
    const scale = createOrdinalScale({
      domain: [],
      range: [10, 20, 30],
    });

    // Should still return values from range by cycling
    expect(typeof scale("A")).toBe("number");
  });

  it("should handle empty range", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: [],
    });

    // D3 ordinal scale with empty range returns undefined
    expect(scale("A")).toBeUndefined();
  });

  it("should support string range values", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: ["red", "green", "blue"],
    });

    expect(scale("A")).toBe("red");
    expect(scale("B")).toBe("green");
    expect(scale("C")).toBe("blue");
  });

  it("should support domain function", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: [10, 20, 30],
    });

    expect(scale.domain()).toEqual(["A", "B", "C"]);
  });

  it("should support range function", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C"],
      range: [10, 20, 30],
    });

    expect(scale.range()).toEqual([10, 20, 30]);
  });

  it("should handle more domain values than range values", () => {
    const scale = createOrdinalScale({
      domain: ["A", "B", "C", "D", "E"],
      range: [10, 20],
    });

    // Should cycle through range
    expect(scale("A")).toBe(10);
    expect(scale("B")).toBe(20);
    expect(scale("C")).toBe(10); // Cycles back
    expect(scale("D")).toBe(20);
    expect(scale("E")).toBe(10);
  });
});

describe("createColorScale", () => {
  it("should create a color scale from domain", () => {
    const scale = createColorScale({
      domain: ["A", "B", "C"],
      range: ["#4e79a7", "#f28e2c", "#e15759"],
    });

    expect(scale("A")).toBe("#4e79a7");
    expect(scale("B")).toBe("#f28e2c");
    expect(scale("C")).toBe("#e15759");
  });

  it("should infer domain from data when not provided", () => {
    const scale = createColorScale({
      data: [{ cat: "A" }, { cat: "B" }, { cat: "A" }, { cat: "C" }],
      field: "cat",
      range: ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2"],
    });

    expect(scale.domain()).toEqual(["A", "B", "C"]);
  });

  it("should handle empty data with provided domain", () => {
    const scale = createColorScale({
      domain: ["A", "B"],
      data: [],
      field: "cat",
      range: ["#4e79a7", "#f28e2c"],
    });

    // Domain should use provided domain
    expect(scale.domain()).toEqual(["A", "B"]);
    expect(scale("A")).toBe("#4e79a7");
  });

  it("should handle missing field gracefully", () => {
    const scale = createColorScale({
      data: [{ cat: "A" }, { cat: "B" }],
      field: "nonexistent",
      range: ["#4e79a7", "#f28e2c"],
    });

    // Should create scale with empty/undefined domain values
    expect(typeof scale).toBe("function");
  });

  it("should handle data without field when domain is provided", () => {
    const scale = createColorScale({
      domain: ["A", "B", "C"],
      range: ["#4e79a7", "#f28e2c", "#e15759"],
    });

    expect(scale("A")).toBe("#4e79a7");
    expect(scale.domain()).toEqual(["A", "B", "C"]);
  });

  it("should return empty domain when no data or domain provided", () => {
    const scale = createColorScale({
      range: ["#4e79a7", "#f28e2c"],
    });

    expect(scale.domain()).toEqual([]);
  });

  it("should handle null values in data", () => {
    const scale = createColorScale({
      data: [{ cat: "A" }, { cat: null }, { cat: "B" }],
      field: "cat",
      range: ["#4e79a7", "#f28e2c", "#e15759"],
    });

    // Should include "null" as a category (converted to string)
    const domain = scale.domain();
    expect(domain).toContain("A");
    expect(domain).toContain("B");
  });

  it("should handle numeric values in field", () => {
    const scale = createColorScale({
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
      field: "id",
      range: ["#4e79a7", "#f28e2c", "#e15759"],
    });

    expect(scale("1")).toBe("#4e79a7");
    expect(scale("2")).toBe("#f28e2c");
    expect(scale("3")).toBe("#e15759");
  });
});
