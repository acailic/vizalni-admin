/**
 * Connector Registry
 *
 * Central registry for managing data connectors.
 * Allows registering, retrieving, and listing connectors.
 *
 * @packageDocumentation
 */

import type {
  IDataConnector,
  BaseConnectorConfig,
  ConnectorFactory,
} from "./types";

/**
 * Registry entry containing connector factory and metadata
 */
interface RegistryEntry {
  /**
   * Connector factory function
   */
  factory: ConnectorFactory<BaseConnectorConfig>;

  /**
   * Connector type identifier
   */
  type: string;

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Schema URL for configuration validation
   */
  schema?: string;
}

/**
 * Singleton registry instance
 */
class ConnectorRegistryClass {
  private registry = new Map<string, RegistryEntry>();
  private instances = new Map<string, IDataConnector>();
  private instanceTypes = new Map<string, string>(); // Track which type each instance was created from

  /**
   * Register a connector factory
   *
   * @param type - Unique type identifier for the connector
   * @param factory - Factory function to create connector instances
   * @param metadata - Optional metadata about the connector
   */
  register<TConfig extends BaseConnectorConfig>(
    type: string,
    factory: ConnectorFactory<TConfig>,
    metadata?: {
      description?: string;
      schema?: string;
    }
  ): void {
    if (this.registry.has(type)) {
      throw new Error(`Connector type "${type}" is already registered`);
    }

    this.registry.set(type, {
      factory: factory as unknown as ConnectorFactory<BaseConnectorConfig>,
      type,
      ...metadata,
    });
  }

  /**
   * Unregister a connector type
   *
   * @param type - Type identifier to unregister
   * @returns true if the type was unregistered, false if it didn't exist
   */
  unregister(type: string): boolean {
    // Clean up any instances of this type
    for (const [id, instanceType] of this.instanceTypes.entries()) {
      if (instanceType === type) {
        const instance = this.instances.get(id);
        if (instance && instance.destroy) {
          instance.destroy();
        }
        this.instances.delete(id);
        this.instanceTypes.delete(id);
      }
    }

    return this.registry.delete(type);
  }

  /**
   * Get a connector factory by type
   *
   * @param type - Type identifier
   * @returns Factory function or undefined if not found
   */
  getFactory(type: string): ConnectorFactory<BaseConnectorConfig> | undefined {
    const entry = this.registry.get(type);
    return entry?.factory;
  }

  /**
   * Create a connector instance from a registered type
   *
   * @param type - Type identifier
   * @param config - Connector configuration
   * @returns Connector instance
   * @throws Error if type is not registered
   */
  create<TConfig extends BaseConnectorConfig>(
    type: string,
    config: TConfig
  ): IDataConnector<TConfig> {
    const entry = this.registry.get(type);

    if (!entry) {
      throw new Error(`Connector type "${type}" is not registered`);
    }

    // Check for duplicate instance
    if (this.instances.has(config.id)) {
      throw new Error(
        `Connector instance with id "${config.id}" already exists`
      );
    }

    // Handle both factory functions and class constructors
    let instance: IDataConnector<TConfig>;
    try {
      // Try as a factory function first
      instance = entry.factory(config) as IDataConnector<TConfig>;
    } catch {
      // If that fails, try as a class constructor
      const FactoryClass = entry.factory as unknown as new (
        config: TConfig
      ) => IDataConnector<TConfig>;
      instance = new FactoryClass(config);
    }

    // Store instance for cleanup and track its type
    this.instances.set(config.id, instance);
    this.instanceTypes.set(config.id, type);

    return instance;
  }

  /**
   * Get an existing connector instance by ID
   *
   * @param id - Connector instance ID
   * @returns Connector instance or undefined if not found
   */
  getInstance(id: string): IDataConnector<BaseConnectorConfig> | undefined {
    return this.instances.get(id);
  }

  /**
   * Destroy a connector instance
   *
   * @param id - Connector instance ID
   * @returns true if the instance was destroyed, false if not found
   */
  destroyInstance(id: string): boolean {
    const instance = this.instances.get(id);

    if (!instance) {
      return false;
    }

    if (instance.destroy) {
      instance.destroy();
    }

    this.instanceTypes.delete(id);
    return this.instances.delete(id);
  }

  /**
   * Check if a connector type is registered
   *
   * @param type - Type identifier
   * @returns true if registered, false otherwise
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * List all registered connector types
   *
   * @returns Array of registered type identifiers
   */
  list(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get metadata for all registered connectors
   *
   * @returns Array of registry entries
   */
  listMetadata(): Array<{
    type: string;
    description?: string;
    schema?: string;
  }> {
    return Array.from(this.registry.values()).map((entry) => ({
      type: entry.type,
      description: entry.description,
      schema: entry.schema,
    }));
  }

  /**
   * Clear all registered connectors and instances
   *
   * Warning: This will destroy all active instances
   */
  clear(): void {
    // Destroy all instances
    for (const [_id, instance] of this.instances.entries()) {
      if (instance.destroy) {
        instance.destroy();
      }
    }

    this.instances.clear();
    this.instanceTypes.clear();
    this.registry.clear();
  }
}

/**
 * Global connector registry instance
 */
export const ConnectorRegistry = new ConnectorRegistryClass();

/**
 * Connector Registry class
 *
 * Exported for testing purposes to allow creating isolated instances
 */
export { ConnectorRegistryClass as ConnectorRegistryClass_ };

/**
 * Register a connector type
 *
 * Convenience function for registering connectors
 *
 * @example
 * ```ts
 * import { ConnectorRegistry, createCsvUrlConnector } from '@acailic/vizualni-admin/connectors';
 *
 * ConnectorRegistry.register('csv-url', createCsvUrlConnector, {
 *   description: 'Fetch and parse CSV data from a URL',
 * });
 * ```
 */
export function registerConnector<TConfig extends BaseConnectorConfig>(
  type: string,
  factory: ConnectorFactory<TConfig>,
  metadata?: {
    description?: string;
    schema?: string;
  }
): void {
  ConnectorRegistry.register(type, factory, metadata);
}

/**
 * Unregister a connector type
 *
 * @example
 * ```ts
 * import { ConnectorRegistry } from '@acailic/vizualni-admin/connectors';
 *
 * ConnectorRegistry.unregister('csv-url');
 * ```
 */
export function unregisterConnector(type: string): boolean {
  return ConnectorRegistry.unregister(type);
}

/**
 * Create a connector instance
 *
 * @example
 * ```ts
 * import { ConnectorRegistry } from '@acailic/vizualni-admin/connectors';
 *
 * const connector = ConnectorRegistry.create('csv-url', {
 *   id: 'my-csv',
 *   name: 'My CSV Data',
 *   url: 'https://example.com/data.csv',
 * });
 * ```
 */
export function createConnector<TConfig extends BaseConnectorConfig>(
  type: string,
  config: TConfig
): IDataConnector<TConfig> {
  return ConnectorRegistry.create(type, config);
}

/**
 * Get a connector instance by ID
 *
 * @example
 * ```ts
 * import { ConnectorRegistry } from '@acailic/vizualni-admin/connectors';
 *
 * const connector = ConnectorRegistry.getInstance('my-csv');
 * ```
 */
export function getConnector(id: string): IDataConnector | undefined {
  return ConnectorRegistry.getInstance(id);
}

/**
 * List all registered connector types
 *
 * @example
 * ```ts
 * import { listConnectors } from '@acailic/vizualni-admin/connectors';
 *
 * const types = listConnectors();
 * console.log('Available connectors:', types);
 * ```
 */
export function listConnectors(): string[] {
  return ConnectorRegistry.list();
}

/**
 * Destroy a connector instance
 *
 * @example
 * ```ts
 * import { destroyConnector } from '@acailic/vizualni-admin/connectors';
 *
 * destroyConnector('my-csv');
 * ```
 */
export function destroyConnector(id: string): boolean {
  return ConnectorRegistry.destroyInstance(id);
}
