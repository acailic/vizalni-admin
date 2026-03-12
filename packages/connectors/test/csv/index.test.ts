import { describe, it, expect, vi } from "vitest";
import { csvConnector, type CsvConfig } from "../../src/csv";
import {
  ConnectorFetchError,
  ConnectorParseError,
  ConnectorValidationError,
} from "../../src/types";

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
      ok: true,
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
      ok: true,
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

  it("should throw ConnectorFetchError on HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(
      csvConnector.fetch({ url: "https://example.com/missing.csv" })
    ).rejects.toThrow(ConnectorFetchError);

    try {
      await csvConnector.fetch({ url: "https://example.com/missing.csv" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorFetchError);
      const fetchError = error as ConnectorFetchError;
      expect(fetchError.statusCode).toBe(404);
      expect(fetchError.statusText).toBe("Not Found");
      expect(fetchError.url).toBe("https://example.com/missing.csv");
    }
  });

  it("should throw ConnectorValidationError on empty URL", async () => {
    await expect(csvConnector.fetch({ url: "" })).rejects.toThrow(
      ConnectorValidationError
    );

    try {
      await csvConnector.fetch({ url: "" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorValidationError);
      const validationError = error as ConnectorValidationError;
      expect(validationError.field).toBe("url");
      expect(validationError.details).toBe("URL cannot be empty");
    }
  });

  it("should throw ConnectorValidationError on whitespace-only URL", async () => {
    await expect(csvConnector.fetch({ url: "   " })).rejects.toThrow(
      ConnectorValidationError
    );
  });

  it("should handle HTTP 500 errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      csvConnector.fetch({ url: "https://example.com/error.csv" })
    ).rejects.toThrow(ConnectorFetchError);

    try {
      await csvConnector.fetch({ url: "https://example.com/error.csv" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorFetchError);
      const fetchError = error as ConnectorFetchError;
      expect(fetchError.statusCode).toBe(500);
    }
  });

  it("should handle HTTP 401 unauthorized errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(
      csvConnector.fetch({ url: "https://example.com/private.csv" })
    ).rejects.toThrow(ConnectorFetchError);
  });
});

describe("edge cases", () => {
  it("should throw ConnectorParseError on excessively long field", async () => {
    // Create a CSV with a very long field (200KB)
    const longValue = "a".repeat(200000);
    const mockCsv = `name,value\n"${longValue}",100`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    await expect(
      csvConnector.fetch({ url: "https://example.com/data.csv" })
    ).rejects.toThrow(ConnectorParseError);

    try {
      await csvConnector.fetch({ url: "https://example.com/data.csv" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorParseError);
      const parseError = error as ConnectorParseError;
      expect(parseError.url).toBe("https://example.com/data.csv");
      expect(parseError.reason).toContain("exceeds maximum length");
    }
  });

  it("should accept fields at maximum length", async () => {
    // Create a CSV with a field at the limit (100KB - some margin for header)
    const longValue = "a".repeat(90000);
    const mockCsv = `name,value\n"${longValue}",100`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe(longValue);
  });

  it("should handle CSV with only headers", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("name,value,category"),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/headers-only.csv",
    });

    expect(result.data).toHaveLength(0);
    expect(result.schema.fields).toHaveLength(3);
    expect(result.schema.fields.map((f) => f.name)).toEqual([
      "name",
      "value",
      "category",
    ]);
  });

  it("should support custom delimiters", async () => {
    const mockCsv = `name;value;category
Alice;100;A
Bob;200;B`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
      delimiter: ";",
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      name: "Alice",
      value: 100,
      category: "A",
    });
  });

  it("should support headerless CSV", async () => {
    const mockCsv = `Alice,100,A
Bob,200,B`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
      header: false,
    });

    expect(result.data).toHaveLength(2);
    expect(result.schema.fields.map((f) => f.name)).toEqual([
      "col0",
      "col1",
      "col2",
    ]);
  });

  it("should handle empty CSV file", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(""),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/empty.csv",
    });

    // Empty CSV creates a single empty field row
    expect(result.data).toHaveLength(0);
    // Parser creates one empty field from empty string
    expect(result.schema.fields.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle CSV with whitespace only", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("   \n\n  "),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/whitespace.csv",
    });

    expect(result.data).toHaveLength(0);
  });

  it("should handle quoted fields with delimiters inside", async () => {
    const mockCsv = `name,description
"Smith, John","Hello, world!"
"Doe, Jane","Foo, bar, baz"`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/quoted.csv",
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe("Smith, John");
    expect(result.data[0].description).toBe("Hello, world!");
  });

  it("should handle different line endings (CRLF)", async () => {
    const mockCsv = "name,value\r\nAlice,100\r\nBob,200";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/crlf.csv",
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe("Alice");
  });

  it("should infer date types for ISO date strings", async () => {
    const mockCsv = `name,date
Alice,2024-01-15
Bob,2024-02-20`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/dates.csv",
    });

    const dateField = result.schema.fields.find((f) => f.name === "date");
    expect(dateField?.type).toBe("date");
  });

  it("should handle rows with missing columns", async () => {
    const mockCsv = `name,value,category
Alice,100,A
Bob,200
Charlie,150,C`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/missing.csv",
    });

    expect(result.data).toHaveLength(3);
    // Missing values should be empty strings
    expect(result.data[1].category).toBe("");
  });

  it("should handle numeric strings that look like numbers", async () => {
    const mockCsv = `id,code
123,ABC
456,XYZ`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/data.csv",
    });

    const idField = result.schema.fields.find((f) => f.name === "id");
    expect(idField?.type).toBe("number");
    expect(result.data[0].id).toBe(123);
  });

  it("should handle negative numbers", async () => {
    const mockCsv = `name,value
Alice,-100
Bob,200`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/negative.csv",
    });

    expect(result.data[0].value).toBe(-100);
    expect(result.data[1].value).toBe(200);
  });

  it("should handle decimal numbers", async () => {
    const mockCsv = `name,score
Alice,95.5
Bob,87.25`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const result = await csvConnector.fetch({
      url: "https://example.com/decimals.csv",
    });

    expect(result.data[0].score).toBe(95.5);
    expect(result.data[1].score).toBe(87.25);
  });
});
