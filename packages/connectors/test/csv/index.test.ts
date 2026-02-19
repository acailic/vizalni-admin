import { describe, it, expect, vi } from "vitest";
import { csvConnector, type CsvConfig } from "../../src/csv";

describe("csvConnector", () => {
  it("should have type 'csv'", () => {
    expect(csvConnector.type).toBe("csv");
  });

  it("should fetch and parse CSV data", async () => {
    // Mock fetch
    const mockCsv = `name,value,category
Alice,100,A
Bob,200,B
Charlie,150,A`;

    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockCsv),
    });

    const config: CsvConfig = {
      url: "https://example.com/data.csv",
    };

    const result = await csvConnector.fetch(config);

    expect(result.data).toHaveLength(3);
    expect(result.data[0]).toEqual({
      name: "Alice",
      value: 100,
      category: "A",
    });
    expect(result.schema.fields).toHaveLength(3);
    expect(result.schema.fields.map((f) => f.name)).toEqual([
      "name",
      "value",
      "category",
    ]);
  });

  it("should infer numeric types", async () => {
    const mockCsv = `name,age,score
Alice,25,95.5
Bob,30,87.0`;

    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
    });

    const ageField = result.schema.fields.find((f) => f.name === "age");
    const scoreField = result.schema.fields.find((f) => f.name === "score");

    expect(ageField?.type).toBe("number");
    expect(scoreField?.type).toBe("number");
  });
});
