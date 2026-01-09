/**
 * CSV URL Connector Unit Tests
 *
 * Tests for CSV URL connector functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { CsvUrlConnector } from "../../../exports/connectors/CsvUrlConnector";
import { ConnectorError } from "../../../exports/connectors/types";

// Mock fetch globally
const mockFetch = vi.fn();
(global as any).fetch = mockFetch;

describe("CsvUrlConnector", () => {
  let connector: CsvUrlConnector;

  beforeEach(() => {
    connector = new CsvUrlConnector({
      id: "test-csv",
      name: "Test CSV",
      url: "https://example.com/data.csv",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Construction", () => {
    it("should create connector with required config", () => {
      expect(connector.id).toBe("test-csv");
      expect(connector.name).toBe("Test CSV");
    });

    it("should use default delimiter", () => {
      expect(connector["delimiter"]).toBe(",");
    });

    it("should use default quote character", () => {
      expect(connector["quoteChar"]).toBe('"');
    });

    it("should allow custom delimiter", () => {
      const tsvConnector = new CsvUrlConnector({
        id: "test-tsv",
        name: "Test TSV",
        url: "https://example.com/data.tsv",
        delimiter: "\t",
      });

      expect(tsvConnector["delimiter"]).toBe("\t");
    });

    it("should allow custom quote character", () => {
      const customConnector = new CsvUrlConnector({
        id: "test-custom",
        name: "Test Custom",
        url: "https://example.com/data.csv",
        quoteChar: "'",
      });

      expect(customConnector["quoteChar"]).toBe("'");
    });

    it("should allow disabling header row", () => {
      const noHeaderConnector = new CsvUrlConnector({
        id: "test-no-header",
        name: "Test No Header",
        url: "https://example.com/data.csv",
        hasHeader: false,
      });

      expect(noHeaderConnector["hasHeader"]).toBe(false);
    });
  });

  describe("fetch", () => {
    it("should fetch and parse CSV data", async () => {
      const csvData = "name,value\nAlice,100\nBob,200";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === "content-length") return "25";
            return null;
          },
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({ name: "Alice", value: 100 });
      expect(result.data[1]).toEqual({ name: "Bob", value: 200 });
    });

    it("should infer schema from CSV headers", async () => {
      const csvData = "id,name,active\n1,Alice,true\n2,Bob,false";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "45",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.schema.fields).toHaveLength(3);
      expect(result.schema.fields[0]).toEqual({
        name: "id",
        type: "number",
        required: true,
      });
      expect(result.schema.fields[1]).toEqual({
        name: "name",
        type: "string",
        required: true,
      });
      expect(result.schema.fields[2]).toEqual({
        name: "active",
        type: "boolean",
        required: true,
      });
    });

    it("should include metadata in result", async () => {
      const csvData = "name\nAlice";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "10",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.metadata.source).toBe("https://example.com/data.csv");
      expect(result.metadata.rowCount).toBe(1);
      expect(result.metadata.fetchedAt).toBeDefined();
    });

    it("should handle quoted values", async () => {
      const csvData = 'name,description\n"Product A","A product with, comma"';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "50",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.data[0].description).toBe("A product with, comma");
    });

    it("should skip empty lines by default", async () => {
      const csvData = "name,value\nAlice,100\n\nBob,200";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "30",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.data).toHaveLength(2);
    });

    it("should throw ConnectorError on network failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(connector.fetch()).rejects.toThrow(ConnectorError);
      await expect(connector.fetch()).rejects.toThrow("NETWORK_ERROR");
    });

    it("should throw ConnectorError on timeout", async () => {
      const timeoutConnector = new CsvUrlConnector({
        id: "test-timeout",
        name: "Test Timeout",
        url: "https://example.com/data.csv",
        timeout: 1, // 1ms timeout
      });

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  headers: { get: () => "0" },
                  text: async () => "data",
                } as unknown as Response),
              10
            )
          )
      );

      await expect(timeoutConnector.fetch()).rejects.toThrow(ConnectorError);
      await expect(timeoutConnector.fetch()).rejects.toThrow("TIMEOUT");
    });

    it("should throw ConnectorError on HTTP error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as unknown as Response);

      await expect(connector.fetch()).rejects.toThrow(ConnectorError);
      await expect(connector.fetch()).rejects.toThrow("NOT_FOUND");
    });

    it("should enforce file size limit", async () => {
      const largeConnector = new CsvUrlConnector({
        id: "test-large",
        name: "Test Large",
        url: "https://example.com/large.csv",
        maxSize: 100, // 100 bytes
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === "content-length") return "1000"; // Larger than limit
            return null;
          },
        },
        text: async () => "data",
      } as unknown as Response);

      await expect(largeConnector.fetch()).rejects.toThrow(ConnectorError);
    });
  });

  describe("getSchema", () => {
    it("should return schema from last fetch", async () => {
      const csvData = "name,age\nAlice,30";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "15",
        },
        text: async () => csvData,
      } as unknown as Response);

      await connector.fetch();
      const schema = await connector.getSchema();

      expect(schema.fields).toHaveLength(2);
      expect(schema.fields[0].name).toBe("name");
      expect(schema.fields[1].name).toBe("age");
    });

    it("should cache schema", async () => {
      const csvData = "name\nAlice";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "10",
        },
        text: async () => csvData,
      } as unknown as Response);

      await connector.fetch();
      const schema1 = await connector.getSchema();
      const schema2 = await connector.getSchema();

      expect(schema1).toBe(schema2);
    });
  });

  describe("getCapabilities", () => {
    it("should return connector capabilities", () => {
      const capabilities = connector.getCapabilities();

      expect(capabilities.pagination).toBe(false);
      expect(capabilities.filtering).toBe(false);
      expect(capabilities.sorting).toBe(false);
      expect(capabilities.realtime).toBe(false);
    });
  });

  describe("healthCheck", () => {
    it("should return healthy status when URL is accessible", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "10",
        },
        text: async () => "name\nAlice",
      } as unknown as Response);

      const health = await connector.healthCheck();

      expect(health.status).toBe("healthy");
      expect(health.timestamp).toBeDefined();
      expect(health.latency).toBeGreaterThanOrEqual(0);
    });

    it("should return unhealthy status on fetch failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const health = await connector.healthCheck();

      expect(health.status).toBe("unhealthy");
      expect(health.error).toBeDefined();
    });
  });

  describe("destroy", () => {
    it("should clear cached data and schema", async () => {
      const csvData = "name\nAlice";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "10",
        },
        text: async () => csvData,
      } as unknown as Response);

      await connector.fetch();
      expect(await connector.getSchema()).toBeDefined();

      await connector.destroy();

      // After destroy, schema should be cleared
      expect(Object.keys(connector)).not.toContain("cachedSchema");
    });
  });

  describe("Type Detection", () => {
    it("should detect numbers", async () => {
      const csvData = "value\n123\n45.67\n0";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "20",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.schema.fields[0].type).toBe("number");
    });

    it("should detect booleans", async () => {
      const csvData = "active\ntrue\nfalse\nTRUE\nFALSE";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "30",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.schema.fields[0].type).toBe("boolean");
    });

    it("should detect dates", async () => {
      const csvData = "date\n2024-01-01\n2024-12-31";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "25",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.schema.fields[0].type).toBe("date");
    });

    it("should detect null values", async () => {
      const csvData = "value\n\nnull\n123";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "15",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.data[0].value).toBeNull();
      expect(result.data[1].value).toBeNull();
      expect(result.data[2].value).toBe(123);
    });

    it("should default to string for unknown types", async () => {
      const csvData = "text\nhello\nworld";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => "15",
        },
        text: async () => csvData,
      } as unknown as Response);

      const result = await connector.fetch();

      expect(result.schema.fields[0].type).toBe("string");
    });
  });
});
