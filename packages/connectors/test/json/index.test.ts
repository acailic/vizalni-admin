import { describe, it, expect, vi } from "vitest";
import { jsonConnector, type JsonConfig } from "../../src/json";

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

  it("should throw on HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      jsonConnector.fetch({ url: "https://api.example.com/error" })
    ).rejects.toThrow("Failed to fetch JSON: 500 Internal Server Error");
  });
});
