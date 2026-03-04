/**
 * Chart Components for @acailic/vizualni-admin/charts
 *
 * Standalone chart components that can be used in any React application.
 * These components are decoupled from Next.js and accept data as props.
 *
 * @example
 * ```tsx
 * import { LineChart } from '@acailic/vizualni-admin/charts';
 *
 * function MyChart() {
 *   const data = [{ year: 2020, value: 100 }, { year: 2021, value: 120 }];
 *   return <LineChart data={data} config={{ xAxis: 'year', yAxis: 'value' }} />;
 * }
 * ```
 */

// Export chart types
export * from "./types";

// Export chart components
export { LineChart } from "./LineChart";
export { BarChart } from "./BarChart";
export { ColumnChart } from "./ColumnChart";
export { PieChart } from "./PieChart";
export { AreaChart } from "./AreaChart";
export { MapChart } from "./MapChart";

// Export zero-config chart components (shorter names, smart defaults)
export { Line, LineChart as ZeroConfigLineChart } from "./Line";
export { Bar, BarChart as ZeroConfigBarChart } from "./Bar";
export { Column, ColumnChart as ZeroConfigColumnChart } from "./Column";
export { Pie, PieChart as ZeroConfigPieChart } from "./Pie";

// Export zero-config utilities
export * from "./utils";

// Export plugin system (tree-shakeable - only included when used)
export {
  // Plugin registry and functions
  chartRegistry,
  registerChartPlugin,
  unregisterChartPlugin,
  getChartPlugin,
  listChartPlugins,
  hasChartPlugin,
  clearChartPlugins,
  getChartPluginStats,
  ChartRegistry,
} from "./chart-registry";

// Export plugin types
export type {
  IChartPlugin,
  ChartPluginMetadata,
  ChartPluginHooks,
  ChartValidationResult,
  ChartRegistryEntry,
  PluginRegistrationResult,
  RegisterPluginOptions,
  IChartRegistry,
} from "./plugin-types";
