/**
 * Tests for data transformation utilities
 *
 * Tests utility functions for transforming and processing chart data.
 */

import { describe, expect, it } from "vitest";

import {
  sortByKey,
  filterData,
  groupByKey,
  aggregateByKey,
  uniqueValues,
  normalizeData,
} from "../../../exports/utils/transforms";

describe("transforms", () => {
  const mockData = [
    { year: "2020", value: 100, category: "A", region: "North" },
    { year: "2021", value: 120, category: "B", region: "South" },
    { year: "2022", value: 115, category: "A", region: "North" },
    { year: "2023", value: 140, category: "C", region: "East" },
    { year: "2020", value: 90, category: "B", region: "West" },
  ];

  describe("sortByKey", () => {
    it("should sort data by key in ascending order", () => {
      const result = sortByKey(mockData, "value", "asc");

      expect(result[0].value).toBe(90);
      expect(result[4].value).toBe(140);
    });

    it("should sort data by key in descending order", () => {
      const result = sortByKey(mockData, "value", "desc");

      expect(result[0].value).toBe(140);
      expect(result[4].value).toBe(90);
    });

    it("should sort string keys alphabetically", () => {
      const result = sortByKey(mockData, "category", "asc");

      expect(result[0].category).toBe("A");
      expect(result[1].category).toBe("A");
      expect(result[2].category).toBe("B");
      expect(result[3].category).toBe("B");
      expect(result[4].category).toBe("C");
    });

    it("should handle null values by pushing them to the end", () => {
      const dataWithNulls = [
        { id: 1, value: 100 },
        { id: 2, value: null },
        { id: 3, value: 50 },
      ];

      const result = sortByKey(dataWithNulls, "value", "asc");

      expect(result[0].value).toBe(50);
      expect(result[1].value).toBe(100);
      expect(result[2].value).toBeNull();
    });

    it("should handle undefined values by pushing them to the end", () => {
      const dataWithUndefined = [
        { id: 1, value: 100 },
        { id: 2, value: undefined },
        { id: 3, value: 50 },
      ];

      const result = sortByKey(dataWithUndefined, "value", "asc");

      expect(result[0].value).toBe(50);
      expect(result[1].value).toBe(100);
      expect(result[2].value).toBeUndefined();
    });

    it("should not mutate original data", () => {
      const originalOrder = [...mockData];
      sortByKey(mockData, "value", "asc");

      expect(mockData).toEqual(originalOrder);
    });

    it("should default to ascending order", () => {
      const result = sortByKey(mockData, "value");

      expect(result[0].value).toBeLessThan(result[result.length - 1].value);
    });

    it("should handle numeric string values correctly", () => {
      const numericStrings = [
        { id: 1, value: "100" },
        { id: 2, value: "20" },
        { id: 3, value: "50" },
      ];

      const result = sortByKey(numericStrings, "value", "asc");

      expect(result[0].value).toBe("100"); // String comparison
    });
  });

  describe("filterData", () => {
    it("should filter data based on predicate", () => {
      const result = filterData(mockData, (item) => item.value > 100);

      expect(result).toHaveLength(3);
      expect(result.every((item) => item.value > 100)).toBe(true);
    });

    it("should filter by string equality", () => {
      const result = filterData(mockData, (item) => item.category === "A");

      expect(result).toHaveLength(2);
      expect(result.every((item) => item.category === "A")).toBe(true);
    });

    it("should filter by complex conditions", () => {
      const result = filterData(
        mockData,
        (item) => item.category === "A" && item.year === "2022"
      );

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("A");
      expect(result[0].year).toBe("2022");
    });

    it("should filter using index parameter", () => {
      const result = filterData(mockData, (item, index) => index < 2);

      expect(result).toHaveLength(2);
      expect(result[0].year).toBe("2020");
      expect(result[1].year).toBe("2021");
    });

    it("should return empty array when nothing matches", () => {
      const result = filterData(mockData, (item) => item.value > 1000);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should return all data when predicate always returns true", () => {
      const result = filterData(mockData, () => true);

      expect(result).toHaveLength(mockData.length);
      expect(result).toEqual(mockData);
    });

    it("should handle null and undefined values in predicate", () => {
      const dataWithNulls = [
        { id: 1, value: null },
        { id: 2, value: 100 },
        { id: 3, value: undefined },
      ];

      const result = filterData(dataWithNulls, (item) => item.value != null);

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(100);
    });
  });

  describe("groupByKey", () => {
    it("should group data by key", () => {
      const result = groupByKey(mockData, "category");

      expect(Object.keys(result)).toEqual(["A", "B", "C"]);
      expect(result["A"]).toHaveLength(2);
      expect(result["B"]).toHaveLength(2);
      expect(result["C"]).toHaveLength(1);
    });

    it("should group by numeric keys", () => {
      const result = groupByKey(mockData, "value");

      expect(result["100"]).toHaveLength(1);
      expect(result["120"]).toHaveLength(1);
    });

    it('should handle null/undefined keys as "null"', () => {
      const dataWithNullKey = [
        { category: "A", value: 10 },
        { category: null, value: 20 },
        { category: undefined, value: 30 },
      ];

      const result = groupByKey(dataWithNullKey, "category");

      expect(result["A"]).toHaveLength(1);
      expect(result["null"]).toHaveLength(2);
    });

    it("should preserve all properties in grouped items", () => {
      const result = groupByKey(mockData, "category");

      const itemA = result["A"][0];
      expect(itemA).toHaveProperty("year");
      expect(itemA).toHaveProperty("value");
      expect(itemA).toHaveProperty("category");
      expect(itemA).toHaveProperty("region");
    });

    it("should handle empty data array", () => {
      const result = groupByKey([], "category");

      expect(result).toEqual({});
    });

    it("should create correct number of groups", () => {
      const result = groupByKey(mockData, "region");

      expect(Object.keys(result)).toHaveLength(4);
      expect(result["North"]).toHaveLength(2);
      expect(result["South"]).toHaveLength(1);
      expect(result["East"]).toHaveLength(1);
      expect(result["West"]).toHaveLength(1);
    });
  });

  describe("aggregateByKey", () => {
    it("should aggregate by sum", () => {
      const result = aggregateByKey(mockData, "category", "value", "sum");

      expect(result["A"]).toBe(215); // 100 + 115
      expect(result["B"]).toBe(210); // 120 + 90
      expect(result["C"]).toBe(140); // 140
    });

    it("should aggregate by average", () => {
      const result = aggregateByKey(mockData, "category", "value", "avg");

      expect(result["A"]).toBe(107.5); // (100 + 115) / 2
      expect(result["B"]).toBe(105); // (120 + 90) / 2
      expect(result["C"]).toBe(140); // 140 / 1
    });

    it("should aggregate by count", () => {
      const result = aggregateByKey(mockData, "category", "value", "count");

      expect(result["A"]).toBe(2);
      expect(result["B"]).toBe(2);
      expect(result["C"]).toBe(1);
    });

    it("should aggregate by min", () => {
      const result = aggregateByKey(mockData, "category", "value", "min");

      expect(result["A"]).toBe(100);
      expect(result["B"]).toBe(90);
      expect(result["C"]).toBe(140);
    });

    it("should aggregate by max", () => {
      const result = aggregateByKey(mockData, "category", "value", "max");

      expect(result["A"]).toBe(115);
      expect(result["B"]).toBe(120);
      expect(result["C"]).toBe(140);
    });

    it("should ignore non-numeric values", () => {
      const dataWithNonNumeric = [
        { category: "A", value: 100 },
        { category: "A", value: "invalid" as any },
        { category: "A", value: null },
        { category: "A", value: 200 },
      ];

      const result = aggregateByKey(
        dataWithNonNumeric,
        "category",
        "value",
        "sum"
      );

      expect(result["A"]).toBe(300); // Only 100 + 200
    });

    it("should handle empty groups", () => {
      const result = aggregateByKey([], "category", "value", "sum");

      expect(result).toEqual({});
    });

    it("should return 0 for empty groups with count", () => {
      const result = aggregateByKey([], "category", "value", "count");

      expect(result).toEqual({});
    });

    it("should handle NaN values correctly", () => {
      const dataWithNaN = [
        { category: "A", value: 100 },
        { category: "A", value: NaN },
        { category: "A", value: 200 },
      ];

      const result = aggregateByKey(dataWithNaN, "category", "value", "sum");

      expect(result["A"]).toBe(300); // NaN values are filtered out
    });

    it("should return 0 for empty values array", () => {
      const dataWithNullValues = [
        { category: "A", value: null },
        { category: "A", value: null },
      ];

      const result = aggregateByKey(
        dataWithNullValues,
        "category",
        "value",
        "sum"
      );

      expect(result["A"]).toBe(0);
    });
  });

  describe("uniqueValues", () => {
    it("should return unique values for a key", () => {
      const result = uniqueValues(mockData, "category");

      expect(result).toHaveLength(3);
      expect(result).toContain("A");
      expect(result).toContain("B");
      expect(result).toContain("C");
    });

    it("should return unique numeric values", () => {
      const result = uniqueValues(mockData, "value");

      expect(result).toHaveLength(5);
      expect(result).toContain(100);
      expect(result).toContain(120);
      expect(result).toContain(115);
      expect(result).toContain(140);
      expect(result).toContain(90);
    });

    it("should filter out null values", () => {
      const dataWithNulls = [
        { category: "A" },
        { category: "B" },
        { category: null },
        { category: "A" },
      ];

      const result = uniqueValues(dataWithNulls, "category");

      expect(result).toHaveLength(2);
      expect(result).toContain("A");
      expect(result).toContain("B");
      expect(result).not.toContain(null);
    });

    it("should filter out undefined values", () => {
      const dataWithUndefined = [
        { category: "A" },
        { category: "B" },
        { category: undefined },
        { category: "A" },
      ];

      const result = uniqueValues(dataWithUndefined, "category");

      expect(result).toHaveLength(2);
      expect(result).toContain("A");
      expect(result).toContain("B");
      expect(result).not.toContain(undefined);
    });

    it("should return empty array for empty data", () => {
      const result = uniqueValues([], "category");

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should preserve number and string types", () => {
      const mixedData = [{ value: 100 }, { value: "200" }, { value: 100 }];

      const result = uniqueValues(mixedData, "value");

      expect(result).toHaveLength(2);
      expect(result).toContain(100);
      expect(result).toContain("200");
    });

    it("should return unique values in order of appearance", () => {
      const result = uniqueValues(mockData, "category");

      expect(result.indexOf("A")).toBeLessThan(result.indexOf("B"));
      expect(result.indexOf("B")).toBeLessThan(result.indexOf("C"));
    });
  });

  describe("normalizeData", () => {
    const rawData = [
      { year: "2020", value: "100", category: "A", extra: "ignore" },
      { year: "2021", value: "120", category: "B", extra: "ignore" },
      { year: "2022", value: "115", category: "A", extra: "ignore" },
    ];

    it("should normalize data by default", () => {
      const result = normalizeData(rawData);

      expect(result).toHaveLength(3);
      expect(result[0].value).toBe(100); // String number converted to number
    });

    it("should parse string numbers to numbers by default", () => {
      const result = normalizeData(rawData);

      expect(typeof result[0].value).toBe("number");
      expect(result[0].value).toBe(100);
    });

    it("should clean null/undefined values by default", () => {
      const dataWithNulls = [
        { year: "2020", value: 100, category: "A", extra: null },
        { year: "2021", value: undefined, category: "B", extra: "test" },
      ];

      const result = normalizeData(dataWithNulls);

      expect(result[0].extra).toBeUndefined(); // null removed
      expect(result[1].value).toBeUndefined(); // undefined removed
    });

    it("should only include specified keys when keys are provided", () => {
      const result = normalizeData(rawData, {
        keys: ["year", "value", "category"],
      });

      expect(result[0]).toHaveProperty("year");
      expect(result[0]).toHaveProperty("value");
      expect(result[0]).toHaveProperty("category");
      expect(result[0]).not.toHaveProperty("extra");
    });

    it("should include all keys when keys is null", () => {
      const result = normalizeData(rawData, {
        keys: null,
      });

      expect(result[0]).toHaveProperty("year");
      expect(result[0]).toHaveProperty("value");
      expect(result[0]).toHaveProperty("category");
      expect(result[0]).toHaveProperty("extra");
    });

    it("should not clean when clean option is false", () => {
      const dataWithNulls = [
        { year: "2020", value: 100, category: "A", extra: null },
      ];

      const result = normalizeData(dataWithNulls, {
        clean: false,
      });

      expect(result[0].extra).toBeNull();
    });

    it("should not parse numbers when parseNumbers option is false", () => {
      const result = normalizeData(rawData, {
        parseNumbers: false,
      });

      expect(typeof result[0].value).toBe("string");
      expect(result[0].value).toBe("100");
    });

    it("should handle invalid number strings gracefully", () => {
      const dataWithInvalidNumbers = [
        { year: "2020", value: "not a number", category: "A" },
      ];

      const result = normalizeData(dataWithInvalidNumbers, {
        parseNumbers: true,
      });

      expect(typeof result[0].value).toBe("string");
      expect(result[0].value).toBe("not a number");
    });

    it("should preserve valid number strings", () => {
      const dataWithNumbers = [
        { value: "123.45" },
        { value: "-100" },
        { value: "0.001" },
      ];

      const result = normalizeData(dataWithNumbers, {
        parseNumbers: true,
      });

      expect(result[0].value).toBe(123.45);
      expect(result[1].value).toBe(-100);
      expect(result[2].value).toBe(0.001);
    });

    it("should handle empty data array", () => {
      const result = normalizeData([]);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should work with all options combined", () => {
      const complexData = [
        { year: "2020", value: "100", category: "A", extra: "test" },
        { year: "2021", value: null, category: "B", extra: "ignore" },
      ];

      const result = normalizeData(complexData, {
        keys: ["year", "value", "category"],
        clean: true,
        parseNumbers: true,
      });

      // Note: 'year' gets parsed to a number because parseNumbers is true
      expect(result[0]).toEqual({
        year: 2020,
        value: 100,
        category: "A",
      });

      // Second item should not have value (null cleaned)
      expect(result[1]).toEqual({
        year: 2021,
        category: "B",
      });
    });

    it("should handle objects with missing keys", () => {
      const incompleteData = [
        { year: "2020", value: 100 },
        { year: "2021", category: "B" }, // Missing value
      ];

      const result = normalizeData(incompleteData, {
        clean: false,
      });

      expect(result[0]).toHaveProperty("year");
      expect(result[0]).toHaveProperty("value");
      expect(result[1]).toHaveProperty("year");
      expect(result[1]).toHaveProperty("category");
    });
  });
});
