/**
 * Connector Registry Unit Tests
 *
 * Tests for the connector registry functionality.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  ConnectorRegistry,
  registerConnector,
  unregisterConnector,
  createConnector,
  getConnector,
  listConnectors,
  destroyConnector,
} from "../../../exports/connectors/registry";

import type {
  IDataConnector,
  BaseConnectorConfig,
} from "../../../exports/connectors";

// Mock connector for testing
class MockConnector implements IDataConnector<Record<string, unknown>> {
  readonly id: string;
  readonly name: string;
  readonly version = "1.0.0";

  constructor(config: BaseConnectorConfig) {
    this.id = config.id;
    this.name = config.name;
  }

  async fetch() {
    return {
      data: [],
      schema: { fields: [] },
      metadata: { source: "mock", fetchedAt: "", rowCount: 0 },
    };
  }

  async getSchema() {
    return { fields: [] };
  }

  getCapabilities() {
    return {
      pagination: false,
      filtering: false,
      sorting: false,
      realtime: false,
    };
  }

  async healthCheck() {
    return { status: "healthy", timestamp: new Date().toISOString() };
  }

  async destroy() {
    // Cleanup
  }
}

describe("ConnectorRegistry", () => {
  let registry: ConnectorRegistry;

  beforeEach(() => {
    registry = new ConnectorRegistry();
  });

  afterEach(() => {
    registry.clear();
  });

  describe("register", () => {
    it("should register a new connector type", () => {
      registry.register("mock", MockConnector, {
        name: "Mock Connector",
        description: "A mock connector for testing",
        version: "1.0.0",
        capabilities: {
          pagination: false,
          filtering: false,
          sorting: false,
          realtime: false,
        },
      });

      expect(registry.has("mock")).toBe(true);
    });

    it("should throw when registering duplicate type", () => {
      registry.register("mock", MockConnector, {
        name: "Mock",
      });

      expect(() => {
        registry.register("mock", MockConnector, { name: "Duplicate" });
      }).toThrow();
    });

    it("should return metadata for registered type", () => {
      const metadata = registry.register("mock", MockConnector, {
        name: "Mock Connector",
        version: "2.0.0",
      });

      expect(metadata.name).toBe("Mock Connector");
      expect(metadata.version).toBe("2.0.0");
    });

    it("should store connector factory", () => {
      registry.register("mock", MockConnector, { name: "Mock" });

      const factory = registry.getFactory("mock");
      expect(factory).toBe(MockConnector);
    });
  });

  describe("unregister", () => {
    it("should unregister a connector type", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      expect(registry.has("mock")).toBe(true);

      registry.unregister("mock");
      expect(registry.has("mock")).toBe(false);
    });

    it("should destroy existing instances when unregistering", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      registry.create("mock", { id: "test-1", name: "Test" });
      registry.create("mock", { id: "test-2", name: "Test" });

      expect(registry.getInstance("test-1")).toBeDefined();

      registry.unregister("mock");

      expect(registry.getInstance("test-1")).toBeUndefined();
      expect(registry.getInstance("test-2")).toBeUndefined();
    });

    it("should not throw when unregistering non-existent type", () => {
      expect(() => {
        registry.unregister("non-existent");
      }).not.toThrow();
    });
  });

  describe("create", () => {
    beforeEach(() => {
      registry.register("mock", MockConnector, {
        name: "Mock Connector",
      });
    });

    it("should create a connector instance", () => {
      const connector = registry.create("mock", {
        id: "test-connector",
        name: "Test Connector",
      });

      expect(connector).toBeInstanceOf(MockConnector);
      expect(connector.id).toBe("test-connector");
      expect(connector.name).toBe("Test Connector");
    });

    it("should throw when creating unregistered type", () => {
      expect(() => {
        registry.create("non-existent", { id: "test", name: "Test" });
      }).toThrow();
    });

    it("should store instance for later retrieval", () => {
      const connector = registry.create("mock", {
        id: "my-connector",
        name: "My Connector",
      });

      expect(registry.getInstance("my-connector")).toBe(connector);
    });

    it("should throw when creating duplicate instance", () => {
      registry.create("mock", { id: "duplicate", name: "Duplicate" });

      expect(() => {
        registry.create("mock", { id: "duplicate", name: "Duplicate" });
      }).toThrow();
    });
  });

  describe("getInstance", () => {
    it("should return existing instance", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      const connector = registry.create("mock", { id: "test", name: "Test" });

      const retrieved = registry.getInstance("test");
      expect(retrieved).toBe(connector);
    });

    it("should return undefined for non-existent instance", () => {
      const retrieved = registry.getInstance("non-existent");
      expect(retrieved).toBeUndefined();
    });
  });

  describe("destroyInstance", () => {
    it("should destroy connector instance", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      registry.create("mock", { id: "test", name: "Test" });

      expect(registry.getInstance("test")).toBeDefined();

      registry.destroyInstance("test");

      expect(registry.getInstance("test")).toBeUndefined();
    });

    it("should call destroy on connector", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      const connector = registry.create("mock", { id: "test", name: "Test" });

      const destroySpy = vi.spyOn(connector, "destroy");

      registry.destroyInstance("test");

      expect(destroySpy).toHaveBeenCalled();
    });

    it("should not throw when destroying non-existent instance", () => {
      expect(() => {
        registry.destroyInstance("non-existent");
      }).not.toThrow();
    });
  });

  describe("has", () => {
    it("should return true for registered type", () => {
      registry.register("mock", MockConnector, { name: "Mock" });
      expect(registry.has("mock")).toBe(true);
    });

    it("should return false for unregistered type", () => {
      expect(registry.has("non-existent")).toBe(false);
    });
  });

  describe("list", () => {
    it("should return empty list when no types registered", () => {
      const types = registry.list();
      expect(types).toEqual([]);
    });

    it("should return all registered types", () => {
      registry.register("mock1", MockConnector, { name: "Mock 1" });
      registry.register("mock2", MockConnector, { name: "Mock 2" });

      const types = registry.list();
      expect(types).toEqual(["mock1", "mock2"]);
    });
  });

  describe("listMetadata", () => {
    it("should return metadata for all registered types", () => {
      registry.register("mock1", MockConnector, {
        name: "Mock 1",
        version: "1.0.0",
      });
      registry.register("mock2", MockConnector, {
        name: "Mock 2",
        version: "2.0.0",
      });

      const metadata = registry.listMetadata();

      expect(metadata).toHaveLength(2);
      expect(metadata[0].name).toBe("Mock 1");
      expect(metadata[1].name).toBe("Mock 2");
    });
  });

  describe("clear", () => {
    it("should remove all registered types and instances", () => {
      registry.register("mock1", MockConnector, { name: "Mock 1" });
      registry.register("mock2", MockConnector, { name: "Mock 2" });
      registry.create("mock1", { id: "test-1", name: "Test" });

      expect(registry.list()).toHaveLength(2);

      registry.clear();

      expect(registry.list()).toHaveLength(0);
      expect(registry.getInstance("test-1")).toBeUndefined();
    });
  });
});

describe("Convenience Functions", () => {
  afterEach(() => {
    // Clear the default registry after each test
    const registry = new ConnectorRegistry();
    registry.clear();
  });

  describe("registerConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { name: "Mock" });

      const types = listConnectors();
      expect(types).toContain("mock");
    });
  });

  describe("unregisterConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { name: "Mock" });
      expect(listConnectors()).toContain("mock");

      unregisterConnector("mock");

      expect(listConnectors()).not.toContain("mock");
    });
  });

  describe("createConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { name: "Mock" });

      const connector = createConnector("mock", {
        id: "test",
        name: "Test",
      });

      expect(connector).toBeInstanceOf(MockConnector);
    });
  });

  describe("getConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { name: "Mock" });
      createConnector("mock", { id: "test", name: "Test" });

      const connector = getConnector("test");
      expect(connector).toBeDefined();
      expect(connector?.id).toBe("test");
    });
  });

  describe("destroyConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { name: "Mock" });
      createConnector("mock", { id: "test", name: "Test" });

      expect(getConnector("test")).toBeDefined();

      destroyConnector("test");

      expect(getConnector("test")).toBeUndefined();
    });
  });
});
