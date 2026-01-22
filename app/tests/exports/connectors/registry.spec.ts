/**
 * Connector Registry Unit Tests
 *
 * Tests for the connector registry functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import {
  ConnectorRegistry,
  ConnectorRegistryClass_,
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
class MockConnector implements IDataConnector<BaseConnectorConfig> {
  readonly config: BaseConnectorConfig;
  readonly capabilities = {
    pagination: false,
    filtering: false,
    sorting: false,
    realtime: false,
  };

  constructor(config: BaseConnectorConfig) {
    this.config = config;
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
    return this.capabilities;
  }

  async healthCheck() {
    return { status: "healthy", timestamp: new Date().toISOString() };
  }

  async destroy() {
    // Cleanup
  }
}

describe("ConnectorRegistry", () => {
  let registry: InstanceType<typeof ConnectorRegistryClass_>;

  beforeEach(() => {
    registry = new ConnectorRegistryClass_();
  });

  afterEach(() => {
    registry.clear();
  });

  describe("register", () => {
    it("should register a new connector type", () => {
      registry.register("mock", MockConnector, {
        description: "A mock connector for testing",
      });

      expect(registry.has("mock")).toBe(true);
    });

    it("should throw when registering duplicate type", () => {
      registry.register("mock", MockConnector, {
        description: "Mock",
      });

      expect(() => {
        registry.register("mock", MockConnector, { description: "Duplicate" });
      }).toThrow();
    });

    it("should return metadata for registered type", () => {
      registry.register("mock", MockConnector, {
        description: "Mock Connector",
      });

      const metadata = registry.listMetadata();
      const mockMetadata = metadata.find((m) => m.type === "mock");
      expect(mockMetadata?.description).toBe("Mock Connector");
    });

    it("should store connector factory", () => {
      registry.register("mock", MockConnector, { description: "Mock" });

      const factory = registry.getFactory("mock");
      expect(factory).toBe(MockConnector);
    });
  });

  describe("unregister", () => {
    it("should unregister a connector type", () => {
      registry.register("mock", MockConnector, { description: "Mock" });
      expect(registry.has("mock")).toBe(true);

      registry.unregister("mock");
      expect(registry.has("mock")).toBe(false);
    });

    it("should destroy existing instances when unregistering", () => {
      registry.register("mock", MockConnector, { description: "Mock" });
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
        description: "Mock Connector",
      });
    });

    it("should create a connector instance", () => {
      const connector = registry.create("mock", {
        id: "test-connector",
        name: "Test Connector",
      });

      expect(connector).toBeInstanceOf(MockConnector);
      expect(connector.config.id).toBe("test-connector");
      expect(connector.config.name).toBe("Test Connector");
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
      registry.register("mock", MockConnector, { description: "Mock" });
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
      registry.register("mock", MockConnector, { description: "Mock" });
      registry.create("mock", { id: "test", name: "Test" });

      expect(registry.getInstance("test")).toBeDefined();

      registry.destroyInstance("test");

      expect(registry.getInstance("test")).toBeUndefined();
    });

    it("should call destroy on connector", () => {
      registry.register("mock", MockConnector, { description: "Mock" });
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
      registry.register("mock", MockConnector, { description: "Mock" });
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
      registry.register("mock1", MockConnector, { description: "Mock 1" });
      registry.register("mock2", MockConnector, { description: "Mock 2" });

      const types = registry.list();
      expect(types).toEqual(["mock1", "mock2"]);
    });
  });

  describe("listMetadata", () => {
    it("should return metadata for all registered types", () => {
      registry.register("mock1", MockConnector, {
        description: "Mock 1",
      });
      registry.register("mock2", MockConnector, {
        description: "Mock 2",
      });

      const metadata = registry.listMetadata();

      expect(metadata).toHaveLength(2);
      expect(metadata[0].description).toBe("Mock 1");
      expect(metadata[1].description).toBe("Mock 2");
    });
  });

  describe("clear", () => {
    it("should remove all registered types and instances", () => {
      registry.register("mock1", MockConnector, { description: "Mock 1" });
      registry.register("mock2", MockConnector, { description: "Mock 2" });
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
    ConnectorRegistry.clear();
  });

  describe("registerConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { description: "Mock" });

      const types = listConnectors();
      expect(types).toContain("mock");
    });
  });

  describe("unregisterConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { description: "Mock" });
      expect(listConnectors()).toContain("mock");

      unregisterConnector("mock");

      expect(listConnectors()).not.toContain("mock");
    });
  });

  describe("createConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { description: "Mock" });

      const connector = createConnector("mock", {
        id: "test",
        name: "Test",
      });

      expect(connector).toBeInstanceOf(MockConnector);
    });
  });

  describe("getConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { description: "Mock" });
      createConnector("mock", { id: "test", name: "Test" });

      const connector = getConnector("test");
      expect(connector).toBeDefined();
      expect(connector?.config.id).toBe("test");
    });
  });

  describe("destroyConnector", () => {
    it("should use default registry", () => {
      registerConnector("mock", MockConnector, { description: "Mock" });
      createConnector("mock", { id: "test", name: "Test" });

      expect(getConnector("test")).toBeDefined();

      destroyConnector("test");

      expect(getConnector("test")).toBeUndefined();
    });
  });
});
