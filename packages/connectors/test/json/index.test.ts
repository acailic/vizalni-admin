import { describe, it, expect, vi } from "vitest";
import { jsonConnector, type JsonConfig } from "../../src/json";
import {
  ConnectorFetchError,
  ConnectorParseError,
  ConnectorValidationError,
} from "../../src/types";

describe("jsonConnector", () => {
  it("should have type 'json'", () => {
    expect(jsonConnector.type).toBe("json");
  });

  it("should fetch JSON data from URL", async () => {
    const mockData = [
      { name: "Alice", age: 25, active: true },
      { name: "Bob", age: 30, active: false },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const config: JsonConfig = {
      url: "https://api.example.com/users",
    };

    const result = await jsonConnector.fetch(config);

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({ name: "Alice", age: 25, active: true });
    expect(result.schema.fields.map((f) => f.name)).toEqual([
      "name",
      "age",
      "active",
    ]);
  });

  it("should extract data from nested path", async () => {
    const mockResponse = {
      data: {
        items: [
          { id: 1, value: 100 },
          { id: 2, value: 200 },
        ],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const config: JsonConfig = {
      url: "https://api.example.com/data",
      dataPath: "data.items",
    };

    const result = await jsonConnector.fetch(config);

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({ id: 1, value: 100 });
  });

  it("should throw ConnectorFetchError on HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      jsonConnector.fetch({ url: "https://api.example.com/error" })
    ).rejects.toThrow(ConnectorFetchError);

    try {
      await jsonConnector.fetch({ url: "https://api.example.com/error" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorFetchError);
      const fetchError = error as ConnectorFetchError;
      expect(fetchError.statusCode).toBe(500);
      expect(fetchError.statusText).toBe("Internal Server Error");
      expect(fetchError.url).toBe("https://api.example.com/error");
    }
  });

  it("should throw ConnectorValidationError on empty URL", async () => {
    await expect(jsonConnector.fetch({ url: "" })).rejects.toThrow(
      ConnectorValidationError
    );

    try {
      await jsonConnector.fetch({ url: "" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorValidationError);
      const validationError = error as ConnectorValidationError;
      expect(validationError.field).toBe("url");
      expect(validationError.details).toBe("URL cannot be empty");
    }
  });

  it("should throw ConnectorValidationError on whitespace-only URL", async () => {
    await expect(jsonConnector.fetch({ url: "   " })).rejects.toThrow(
      ConnectorValidationError
    );
  });

  it("should throw ConnectorParseError on invalid JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    await expect(
      jsonConnector.fetch({ url: "https://api.example.com/invalid" })
    ).rejects.toThrow(ConnectorParseError);

    try {
      await jsonConnector.fetch({ url: "https://api.example.com/invalid" });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorParseError);
      const parseError = error as ConnectorParseError;
      expect(parseError.url).toBe("https://api.example.com/invalid");
      expect(parseError.reason).toBe("Response is not valid JSON");
    }
  });

  it("should throw ConnectorParseError when dataPath not found", async () => {
    const mockResponse = {
      data: {
        otherItems: [{ id: 1 }],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await expect(
      jsonConnector.fetch({
        url: "https://api.example.com/data",
        dataPath: "data.items",
      })
    ).rejects.toThrow(ConnectorParseError);

    try {
      await jsonConnector.fetch({
        url: "https://api.example.com/data",
        dataPath: "data.items",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConnectorParseError);
      const parseError = error as ConnectorParseError;
      expect(parseError.url).toBe("https://api.example.com/data");
      expect(parseError.reason).toContain('Data path "data.items" not found');
    }
  });

  it("should handle HTTP 401 unauthorized errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(
      jsonConnector.fetch({ url: "https://api.example.com/private" })
    ).rejects.toThrow(ConnectorFetchError);
  });

  it("should handle HTTP 404 not found errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(
      jsonConnector.fetch({ url: "https://api.example.com/missing" })
    ).rejects.toThrow(ConnectorFetchError);
  });
});

describe("jsonConnector edge cases", () => {
  it("should handle single object response", async () => {
    const mockData = { id: 1, name: "Single" };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/single",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({ id: 1, name: "Single" });
  });

  it("should send custom headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    global.fetch = mockFetch;

    await jsonConnector.fetch({
      url: "https://api.example.com/data",
      headers: {
        Authorization: "Bearer token",
        "X-Custom-Header": "value",
      },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/data",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer token",
          "X-Custom-Header": "value",
        }),
      })
    );
  });

  it("should infer types correctly", async () => {
    const mockData = [
      { name: "Alice", age: 25, active: true, date: "2024-01-15" },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/data",
    });

    const nameField = result.schema.fields.find((f) => f.name === "name");
    const ageField = result.schema.fields.find((f) => f.name === "age");
    const activeField = result.schema.fields.find((f) => f.name === "active");
    const dateField = result.schema.fields.find((f) => f.name === "date");

    expect(nameField?.type).toBe("string");
    expect(ageField?.type).toBe("number");
    expect(activeField?.type).toBe("boolean");
    expect(dateField?.type).toBe("date");
  });

  it("should handle empty array response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/empty",
    });

    expect(result.data).toHaveLength(0);
    expect(result.schema.fields).toHaveLength(0);
  });

  it("should handle deeply nested dataPath", async () => {
    const mockResponse = {
      level1: {
        level2: {
          level3: {
            items: [{ id: 1 }, { id: 2 }],
          },
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/deep",
      dataPath: "level1.level2.level3.items",
    });

    expect(result.data).toHaveLength(2);
  });

  it("should handle null values in data", async () => {
    const mockData = [
      { name: "Alice", age: null },
      { name: null, age: 30 },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/nulls",
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].age).toBeNull();
    expect(result.data[1].name).toBeNull();
  });

  it("should handle Date objects in data", async () => {
    const date1 = new Date("2024-01-15");
    const mockData = [{ name: "Event", date: date1 }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/dates",
    });

    const dateField = result.schema.fields.find((f) => f.name === "date");
    expect(dateField?.type).toBe("date");
  });

  it("should handle numeric strings that look like numbers", async () => {
    const mockData = [
      { id: "123", name: "Test" }, // string number
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/data",
    });

    const idField = result.schema.fields.find((f) => f.name === "id");
    expect(idField?.type).toBe("number"); // Should infer as number
  });

  it("should handle dataPath through null value", async () => {
    const mockResponse = {
      data: null,
      items: [{ id: 1 }],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await expect(
      jsonConnector.fetch({
        url: "https://api.example.com/data",
        dataPath: "data.items",
      })
    ).rejects.toThrow(ConnectorParseError);
  });

  it("should handle dataPath through non-object value", async () => {
    const mockResponse = {
      data: "string value",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await expect(
      jsonConnector.fetch({
        url: "https://api.example.com/data",
        dataPath: "data.items",
      })
    ).rejects.toThrow(ConnectorParseError);
  });

  it("should always include Accept: application/json header", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    global.fetch = mockFetch;

    await jsonConnector.fetch({
      url: "https://api.example.com/data",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/data",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
      })
    );
  });

  it("should handle missing fields in some records", async () => {
    const mockData = [
      { name: "Alice", age: 25 },
      { name: "Bob" }, // missing age
      { name: "Charlie", age: 35, extra: "field" },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/partial",
    });

    // Should include all field names found
    const fieldNames = result.schema.fields.map((f) => f.name);
    expect(fieldNames).toContain("name");
    expect(fieldNames).toContain("age");
    expect(fieldNames).toContain("extra");
  });

  it("should handle boolean values", async () => {
    const mockData = [{ active: true, verified: false }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await jsonConnector.fetch({
      url: "https://api.example.com/bools",
    });

    const activeField = result.schema.fields.find((f) => f.name === "active");
    const verifiedField = result.schema.fields.find(
      (f) => f.name === "verified"
    );

    expect(activeField?.type).toBe("boolean");
    expect(verifiedField?.type).toBe("boolean");
  });
});
