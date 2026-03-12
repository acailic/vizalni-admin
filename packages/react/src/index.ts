/**
 * @vizualni/react - React bindings for @vizualni/core
 *
 * This package provides React components and hooks for building
 * data visualizations using the vizualni ecosystem.
 *
 * @packageDocumentation
 *
 * @example
 * ```tsx
 * import { LineChart, useChart, useConnector } from "@vizualni/react";
 * import { CsvConnector } from "@vizualni/connectors";
 *
 * // Using pre-built chart components
 * function MyChart() {
 *   const { data, loading } = useConnector(
 *     new CsvConnector(),
 *     { url: "/data/sales.csv" }
 *   );
 *
 *   if (loading || !data) return <div>Loading...</div>;
 *
 *   return (
 *     <LineChart
 *       data={data}
 *       config={{
 *         type: "line",
 *         x: { field: "date", type: "date" },
 *         y: { field: "value", type: "number" },
 *       }}
 *       width={600}
 *       height={400}
 *     />
 *   );
 * }
 *
 * // Using headless hook for custom rendering
 * function CustomChart({ data }) {
 *   const { scales, layout } = useChart(data, config, { width: 600, height: 400 });
 *
 *   return (
 *     <svg width={600} height={400}>
 *       {/* Custom rendering using scales and layout *\/}
 *     </svg>
 *   );
 * }
 * ```
 */

// ============================================================================
// Hooks
// ============================================================================

export {
  useChart,
  type UseChartOptions,
  type ChartResult,
} from "./hooks/useChart";

export {
  useConnector,
  type ConnectorState,
  type UseConnectorReturn,
} from "./hooks/useConnector";

// ============================================================================
// Chart Components
// ============================================================================

export { LineChart, type LineChartProps } from "./charts/LineChart";
export { BarChart, type BarChartProps } from "./charts/BarChart";
export { PieChart, type PieChartProps } from "./charts/PieChart";

// Base types for extending chart components
export {
  type BaseChartProps,
  type XYChartProps,
  type RadialChartProps,
} from "./charts/types";

// ============================================================================
// SVG Components (Low-level primitives)
// ============================================================================

export { XAxis, YAxis, type XAxisProps, type YAxisProps } from "./svg/Axes";
export { LinePath, type LinePathProps } from "./svg/LinePath";
export { Bar, type BarProps } from "./svg/Bar";

// ============================================================================
// Re-exported Types from @vizualni/core
// ============================================================================

/**
 * Core types re-exported from @vizualni/core for convenience.
 *
 * These types define the structure of data and configuration
 * objects used throughout the vizualni ecosystem.
 */
export type {
  /** A single data point (row) in a dataset */
  Datum,
  /** Base configuration for all chart types */
  ChartConfig,
  /** Configuration specific to line charts */
  LineChartConfig,
  /** Configuration specific to bar charts */
  BarChartConfig,
  /** Configuration specific to pie/donut charts */
  PieConfig,
} from "@vizualni/core";
