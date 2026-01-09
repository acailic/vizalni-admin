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
