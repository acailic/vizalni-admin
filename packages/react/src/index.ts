// @vizualni/react - React bindings for @vizualni/core

// Hooks
export {
  useChart,
  type UseChartOptions,
  type ChartResult,
} from "./hooks/useChart";

// Charts
export { LineChart, type LineChartProps } from "./charts/LineChart";
export { BarChart, type BarChartProps } from "./charts/BarChart";
export { PieChart, type PieChartProps } from "./charts/PieChart";

// SVG Components
export { XAxis, YAxis, type XAxisProps, type YAxisProps } from "./svg/Axes";
export { LinePath, type LinePathProps } from "./svg/LinePath";

// Re-export types from core for convenience
export type {
  Datum,
  ChartConfig,
  LineChartConfig,
  BarChartConfig,
  PieConfig,
} from "@vizualni/core";
