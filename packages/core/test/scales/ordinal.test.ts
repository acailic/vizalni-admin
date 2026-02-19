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
});
