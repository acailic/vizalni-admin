/**
 * Chart Registry
 *
 * Central registry for chart plugins. This enables dynamic chart registration
 * without modifying the core bundle, supporting:
 *
 * - Zero bundle size impact for unused charts
 * - Tree-shaking of plugin code
 * - Third-party chart ecosystem
 * - Runtime plugin discovery and loading
 *
 * @example
 * ```tsx
 * import { chartRegistry } from '@acailic/vizualni-admin/charts';
 * import { myCustomChartPlugin } from 'my-custom-chart-plugin';
 *
 * // Register the plugin
 * chartRegistry.register(myCustomChartPlugin);
 *
 * // Use the registered plugin
 * const plugin = chartRegistry.get('my-custom-chart');
 * const Component = plugin.component;
 *
 * <Component data={data} config={config} />
 * ```
 *
 * @packageDocumentation
 */

import { createLogger } from "../../lib/logger";

import type {
  ChartRegistryEntry,
  IChartPlugin,
  IChartRegistry,
  PluginRegistrationResult,
  RegisterPluginOptions,
} from "./plugin-types";
import type { BaseChartConfig } from "./types";

/**
 * Core version for compatibility checking
 * This should match the version in app/package.json
 */
const CORE_VERSION = "0.1.0-beta.1";

/**
 * Logger for chart registry operations
 */
const logger = createLogger({ component: "ChartRegistry" });

/**
 * Semver utility for version comparison
 */
function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split(".").map(Number);
  const v2 = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

/**
 * Validate plugin metadata
 */
function validatePluginMetadata(plugin: IChartPlugin): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!plugin.id) {
    errors.push("Plugin ID is required");
  } else if (!/^[a-z0-9-]+$/.test(plugin.id)) {
    errors.push(
      "Plugin ID must contain only lowercase letters, numbers, and hyphens"
    );
  }

  if (!plugin.name) {
    errors.push("Plugin name is required");
  }

  if (!plugin.version) {
    errors.push("Plugin version is required");
  }

  if (!plugin.author) {
    errors.push("Plugin author is required");
  }

  if (!plugin.description) {
    errors.push("Plugin description is required");
  }

  if (!plugin.category) {
    errors.push("Plugin category is required");
  }

  if (!plugin.license) {
    errors.push("Plugin license is required");
  }

  if (!plugin.minCoreVersion) {
    errors.push("Plugin minCoreVersion is required");
  }

  // Check version compatibility
  if (plugin.minCoreVersion) {
    if (compareVersions(CORE_VERSION, plugin.minCoreVersion) < 0) {
      errors.push(
        `Plugin requires core version ${plugin.minCoreVersion} or higher, but current version is ${CORE_VERSION}`
      );
    }
  }

  // Validate component
  if (!plugin.component) {
    errors.push("Plugin component is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Chart registry implementation
 */
class ChartRegistry implements IChartRegistry {
  private plugins: Map<string, ChartRegistryEntry> = new Map();

  /**
   * Register a new chart plugin
   */
  register<TConfig extends BaseChartConfig = BaseChartConfig>(
    plugin: IChartPlugin<TConfig>,
    options: RegisterPluginOptions = {}
  ): PluginRegistrationResult {
    const warnings: string[] = [];

    // Validate metadata
    const validation = validatePluginMetadata(plugin as any);

    if (!validation.valid && !options.force) {
      return {
        success: false,
        pluginId: plugin.id || "unknown",
        error: `Plugin validation failed: ${validation.errors.join(", ")}`,
      };
    }

    if (validation.errors.length > 0) {
      warnings.push(...validation.errors);
    }

    // Check for existing plugin
    if (this.plugins.has(plugin.id) && !options.override) {
      return {
        success: false,
        pluginId: plugin.id,
        error: `Plugin '${plugin.id}' is already registered. Use override: true to replace it.`,
      };
    }

    // Create registry entry
    const entry: ChartRegistryEntry<TConfig> = {
      ...plugin,
      registeredAt: new Date(),
      type: "external", // All dynamically registered plugins are external
    };

    // Store the plugin
    this.plugins.set(plugin.id, entry as any);

    // Call onRegister hook if provided
    if (plugin.hooks?.onRegister) {
      try {
        plugin.hooks.onRegister();
      } catch (error) {
        logger.warn(`Plugin '${plugin.id}' onRegister hook failed`, { error });
      }
    }

    return {
      success: true,
      pluginId: plugin.id,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Unregister a chart plugin
   */
  unregister(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);

    if (!plugin) {
      return false;
    }

    // Prevent unregistering built-in plugins
    if (plugin.type === "builtin") {
      logger.warn(
        `Cannot unregister built-in plugin '${pluginId}'. Use clear() to remove all external plugins.`
      );
      return false;
    }

    // Call onUnregister hook if provided
    if (plugin.hooks?.onUnregister) {
      try {
        plugin.hooks.onUnregister();
      } catch (error) {
        logger.warn(`Plugin '${pluginId}' onUnregister hook failed`, { error });
      }
    }

    return this.plugins.delete(pluginId);
  }

  /**
   * Get a registered plugin by ID
   */
  get<TConfig extends BaseChartConfig = BaseChartConfig>(
    pluginId: string
  ): ChartRegistryEntry<TConfig> | undefined {
    return this.plugins.get(pluginId) as
      | ChartRegistryEntry<TConfig>
      | undefined;
  }

  /**
   * Check if a plugin is registered
   */
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * List all registered plugins
   */
  list(): ChartRegistryEntry[] {
    return Array.from(this.plugins.values());
  }

  /**
   * List plugins by category
   */
  listByCategory(category: string): ChartRegistryEntry[] {
    return this.list().filter(
      (plugin) => plugin.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Clear all external plugins (keeps built-in plugins)
   */
  clear(): void {
    for (const [id, plugin] of this.plugins.entries()) {
      if (plugin.type === "external") {
        // Call onUnregister hook if provided
        if (plugin.hooks?.onUnregister) {
          try {
            plugin.hooks.onUnregister();
          } catch (error) {
            logger.warn(`Plugin '${id}' onUnregister hook failed`, { error });
          }
        }

        this.plugins.delete(id);
      }
    }
  }

  /**
   * Get plugin statistics
   */
  stats(): {
    total: number;
    builtin: number;
    external: number;
    byCategory: Record<string, number>;
  } {
    const plugins = this.list();
    const byCategory: Record<string, number> = {};

    for (const plugin of plugins) {
      const category = plugin.category.toLowerCase();
      byCategory[category] = (byCategory[category] || 0) + 1;
    }

    return {
      total: plugins.length,
      builtin: plugins.filter((p) => p.type === "builtin").length,
      external: plugins.filter((p) => p.type === "external").length,
      byCategory,
    };
  }

  /**
   * Register multiple plugins at once
   */
  registerBatch<TConfig extends BaseChartConfig = BaseChartConfig>(
    plugins: IChartPlugin<TConfig>[],
    options?: RegisterPluginOptions
  ): PluginRegistrationResult[] {
    return plugins.map((plugin) => this.register(plugin, options));
  }

  /**
   * Get plugin by component
   * Useful for reverse lookup when you have a component but need metadata
   */
  findByComponent(component: unknown): ChartRegistryEntry | undefined {
    return this.list().find((plugin) => plugin.component === component);
  }
}

/**
 * Global chart registry instance
 */
export const chartRegistry = new ChartRegistry();

/**
 * Register a chart plugin with the global registry
 *
 * @example
 * ```tsx
 * import { registerChartPlugin } from '@acailic/vizualni-admin/charts';
 * import { myRadarChartPlugin } from './my-radar-chart-plugin';
 *
 * registerChartPlugin(myRadarChartPlugin);
 * ```
 */
export function registerChartPlugin<
  TConfig extends BaseChartConfig = BaseChartConfig,
>(
  plugin: IChartPlugin<TConfig>,
  options?: RegisterPluginOptions
): PluginRegistrationResult {
  return chartRegistry.register(plugin, options);
}

/**
 * Unregister a chart plugin from the global registry
 */
export function unregisterChartPlugin(pluginId: string): boolean {
  return chartRegistry.unregister(pluginId);
}

/**
 * Get a chart plugin from the global registry
 */
export function getChartPlugin<
  TConfig extends BaseChartConfig = BaseChartConfig,
>(pluginId: string): ChartRegistryEntry<TConfig> | undefined {
  return chartRegistry.get<TConfig>(pluginId);
}

/**
 * List all registered chart plugins
 */
export function listChartPlugins(): ChartRegistryEntry[] {
  return chartRegistry.list();
}

/**
 * Check if a chart plugin is registered
 */
export function hasChartPlugin(pluginId: string): boolean {
  return chartRegistry.has(pluginId);
}

/**
 * Clear all external chart plugins
 */
export function clearChartPlugins(): void {
  chartRegistry.clear();
}

/**
 * Get chart plugin statistics
 */
export function getChartPluginStats(): ReturnType<typeof chartRegistry.stats> {
  return chartRegistry.stats();
}

/**
 * Export the registry class for advanced use cases
 */
export { ChartRegistry };

/**
 * Re-export types
 */
export type {
  IChartPlugin,
  ChartRegistryEntry,
  PluginRegistrationResult,
  RegisterPluginOptions,
};
