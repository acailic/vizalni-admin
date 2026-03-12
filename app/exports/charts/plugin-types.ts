/**
 * Chart Plugin System Types
 *
 * This file defines the plugin interface that allows external chart types
 * to be registered without modifying the core bundle. This enables:
 *
 * - Zero bundle size impact for users who don't use custom charts
 * - Tree-shaking of plugin code
 * - Third-party chart ecosystem
 * - Clear separation between core and optional features
 *
 * @packageDocumentation
 */

import type { BaseChartConfig, ChartData, ChartLocale } from "./types";
import type React from "react";

/**
 * Plugin metadata for discovery and documentation
 */
export interface ChartPluginMetadata {
  /** Unique identifier for the plugin (e.g., 'vendor-radar-chart') */
  id: string;

  /** Human-readable plugin name */
  name: string;

  /** Plugin version (semver) */
  version: string;

  /** Plugin author/maintainer */
  author: string;

  /** Plugin description */
  description: string;

  /** Chart category for organization (e.g., 'scientific', 'financial', 'geospatial') */
  category: string;

  /** List of tags for discoverability */
  tags: string[];

  /** Homepage URL */
  homepage?: string;

  /** Repository URL */
  repository?: string;

  /** License (SPDX identifier) */
  license: string;

  /** Minimum compatible version of @acailic/vizualni-admin */
  minCoreVersion: string;

  /** List of external dependencies (for consumers to install) */
  externalDependencies?: string[];
}

/**
 * Validation result for plugin configuration
 */
export interface ChartValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Validation errors (if any) */
  errors: Array<{
    path: string;
    message: string;
  }>;

  /** Validation warnings (non-blocking) */
  warnings: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Plugin lifecycle hooks
 *
 * Plugins can optionally implement these hooks to integrate
 * with the chart system.
 */
export interface ChartPluginHooks {
  /**
   * Called when plugin is registered
   * Use for initialization, side effects, or validation
   */
  onRegister?: () => void | Promise<void>;

  /**
   * Called when plugin is unregistered
   * Use for cleanup (event listeners, timers, etc.)
   */
  onUnregister?: () => void | Promise<void>;

  /**
   * Validate data before rendering
   * Return validation result to show errors/warnings to users
   */
  validateData?: (
    data: ChartData[],
    config: BaseChartConfig
  ) => ChartValidationResult;

  /**
   * Transform data before rendering
   * Useful for data normalization or preprocessing
   */
  transformData?: (data: ChartData[], config: BaseChartConfig) => ChartData[];

  /**
   * Transform config before rendering
   * Useful for applying defaults or normalizing config
   */
  transformConfig?: (config: BaseChartConfig) => BaseChartConfig;
}

/**
 * Chart plugin definition
 *
 * A plugin is a self-contained chart component that can be
 * dynamically registered with the chart registry.
 */
export interface IChartPlugin<
  TConfig extends BaseChartConfig = BaseChartConfig,
> extends ChartPluginMetadata {
  /**
   * React component that renders the chart
   *
   * The component will receive all standard chart props:
   * - data: ChartData[]
   * - config: TConfig
   * - height?: number
   * - width?: number | "100%"
   * - locale?: ChartLocale
   * - className?: string
   * - style?: React.CSSProperties
   * - onDataPointClick?: (data: ChartData, index: number) => void
   * - renderTooltip?: (data: ChartData) => React.ReactNode
   * - showTooltip?: boolean
   * - animated?: boolean
   * - isLoading?: boolean
   * - loadingMessage?: string
   * - error?: Error | null
   * - id?: string
   * - ariaLabel?: string
   * - description?: string
   */
  component: React.ComponentType<
    {
      data: ChartData[];
      config: TConfig;
      height?: number;
      width?: number | "100%";
      locale?: ChartLocale;
      className?: string;
      style?: React.CSSProperties;
      onDataPointClick?: (data: ChartData, index: number) => void;
      renderTooltip?: (data: ChartData) => React.ReactNode;
      showTooltip?: boolean;
      animated?: boolean;
      isLoading?: boolean;
      loadingMessage?: string;
      error?: Error | null;
      id?: string;
      ariaLabel?: string;
      description?: string;
    } & Record<string, unknown>
  >;

  /**
   * Default configuration for the chart
   * Merged with user-provided config
   */
  defaultConfig?: Partial<TConfig>;

  /**
   * Optional lifecycle hooks
   */
  hooks?: ChartPluginHooks;

  /**
   * Configuration schema for validation
   * (Optional - can use JSON Schema, Zod, io-ts, etc.)
   */
  configSchema?: unknown;

  /**
   * Example data for documentation/demos
   */
  exampleData?: ChartData[];

  /**
   * Example configuration for documentation/demos
   */
  exampleConfig?: TConfig;
}

/**
 * Chart registry entry
 *
 * Internal representation of a registered plugin
 */
export interface ChartRegistryEntry<
  TConfig extends BaseChartConfig = BaseChartConfig,
> extends IChartPlugin<TConfig> {
  /** Registration timestamp */
  registeredAt: Date;

  /** Whether plugin is built-in or external */
  type: "builtin" | "external";
}

/**
 * Plugin registration options
 */
export interface RegisterPluginOptions {
  /**
   * Skip validation and install plugin even if incompatible
   * Use with caution - may cause runtime errors
   */
  force?: boolean;

  /**
   * Override existing plugin with same ID
   */
  override?: boolean;
}

/**
 * Plugin registration result
 */
export interface PluginRegistrationResult {
  /** Whether registration was successful */
  success: boolean;

  /** Plugin ID */
  pluginId: string;

  /** Error message (if registration failed) */
  error?: string;

  /** Warnings (non-blocking issues) */
  warnings?: string[];
}

/**
 * Chart registry public API
 */
export interface IChartRegistry {
  /**
   * Register a new chart plugin
   */
  register<TConfig extends BaseChartConfig = BaseChartConfig>(
    plugin: IChartPlugin<TConfig>,
    options?: RegisterPluginOptions
  ): PluginRegistrationResult;

  /**
   * Unregister a chart plugin
   */
  unregister(pluginId: string): boolean;

  /**
   * Get a registered plugin by ID
   */
  get<TConfig extends BaseChartConfig = BaseChartConfig>(
    pluginId: string
  ): ChartRegistryEntry<TConfig> | undefined;

  /**
   * Check if a plugin is registered
   */
  has(pluginId: string): boolean;

  /**
   * List all registered plugins
   */
  list(): ChartRegistryEntry[];

  /**
   * List plugins by category
   */
  listByCategory(category: string): ChartRegistryEntry[];

  /**
   * Clear all external plugins (keeps built-in plugins)
   */
  clear(): void;

  /**
   * Get plugin statistics
   */
  stats(): {
    total: number;
    builtin: number;
    external: number;
    byCategory: Record<string, number>;
  };
}
