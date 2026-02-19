// @vizualni/react - React bindings for @vizualni/core

// Hooks
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

// Charts
export { LineChart, type LineChartProps } from "./charts/LineChart";
export { BarChart, type BarChartProps } from "./charts/BarChart";
export { PieChart, type PieChartProps } from "./charts/PieChart";

// SVG Components
export { XAxis, YAxis, type XAxisProps, type YAxisProps } from "./svg/Axes";
export { LinePath, type LinePathProps } from "./svg/LinePath";
export { Bar, type BarProps } from "./svg/Bar";

// Re-export types from core for convenience
export type {
  Datum,
  ChartConfig,
  LineChartConfig,
  BarChartConfig,
  PieConfig,
} from "@vizualni/core";
