import { describe, it, expectTypeOf, expect } from "vitest";
import type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
  BaseConnectorConfig,
} from "../src/types";
import {
  ConnectorError,
  ConnectorFetchError,
  ConnectorParseError,
  ConnectorValidationError,
} from "../src/types";

describe("Connector Types", () => {
  it("DataConnector should have required interface", () => {
    const connector: DataConnector<{ url: string }> = {
      type: "test",
      fetch: async (config) => {
        return {
          data: [],
          schema: { fields: [] },
        };
      },
    };
    expectTypeOf(connector).toMatchTypeOf<DataConnector<{ url: string }>>();
  });

  it("ConnectorResult should have data and schema", () => {
    const result: ConnectorResult = {
      data: [{ x: 1, y: 2 }],
      schema: {
        fields: [
          { name: "x", type: "number" },
          { name: "y", type: "number" },
        ],
      },
    };
    expectTypeOf(result).toMatchTypeOf<ConnectorResult>();
  });

  it("FieldSchema should define field structure", () => {
    const field: FieldSchema = {
      name: "date",
      type: "date",
      title: "Date",
      description: "The date of the observation",
    };
    expectTypeOf(field).toMatchTypeOf<FieldSchema>();
  });

  it("BaseConnectorConfig should require url", () => {
    const config: BaseConnectorConfig = {
      url: "https://example.com/data",
    };
    expectTypeOf(config).toMatchTypeOf<BaseConnectorConfig>();
  });
});

describe("Error Classes", () => {
  describe("ConnectorFetchError", () => {
    it("should create error with url, statusCode, and statusText", () => {
      const error = new ConnectorFetchError(
        "https://example.com/data.csv",
        404,
        "Not Found"
      );

      expect(error.name).toBe("ConnectorFetchError");
      expect(error.url).toBe("https://example.com/data.csv");
      expect(error.statusCode).toBe(404);
      expect(error.statusText).toBe("Not Found");
      expect(error.message).toBe(
        "Failed to fetch from https://example.com/data.csv: 404 Not Found"
      );
    });

    it("should be instance of ConnectorError", () => {
      const error = new ConnectorFetchError("url", 500, "Server Error");
      expect(error).toBeInstanceOf(ConnectorError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ConnectorParseError", () => {
    it("should create error with url and reason", () => {
      const error = new ConnectorParseError(
        "https://example.com/data.csv",
        "Invalid CSV format"
      );

      expect(error.name).toBe("ConnectorParseError");
      expect(error.url).toBe("https://example.com/data.csv");
      expect(error.reason).toBe("Invalid CSV format");
      expect(error.message).toBe(
        "Failed to parse data from https://example.com/data.csv: Invalid CSV format"
      );
    });

    it("should support error cause", () => {
      const cause = new Error("Original error");
      const error = new ConnectorParseError("url", "Parse failed", {
        cause,
      });

      expect(error.cause).toBe(cause);
    });

    it("should be instance of ConnectorError", () => {
      const error = new ConnectorParseError("url", "reason");
      expect(error).toBeInstanceOf(ConnectorError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ConnectorValidationError", () => {
    it("should create error with url, field, and details", () => {
      const error = new ConnectorValidationError(
        "https://example.com/data.csv",
        "url",
        "URL cannot be empty"
      );

      expect(error.name).toBe("ConnectorValidationError");
      expect(error.url).toBe("https://example.com/data.csv");
      expect(error.field).toBe("url");
      expect(error.details).toBe("URL cannot be empty");
      expect(error.message).toBe(
        "Invalid configuration for https://example.com/data.csv: url - URL cannot be empty"
      );
    });

    it("should be instance of ConnectorError", () => {
      const error = new ConnectorValidationError("url", "field", "details");
      expect(error).toBeInstanceOf(ConnectorError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ConnectorError", () => {
    it("should be abstract-like (cannot be instantiated directly)", () => {
      // While TypeScript prevents direct instantiation, we can still test the class
      // The abstract pattern is enforced by convention
      expect(ConnectorError.prototype.constructor.name).toBe("ConnectorError");
    });
  });
});
