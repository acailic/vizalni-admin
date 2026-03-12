import { ChartDefinition } from "@/chart-registry";
import {
  BarChartConfig,
  barChartSchema,
  getInitialBarConfig,
} from "@/chart-types/bar/config";

export const barChart = {
  type: "bar",
  label: { en: "Bar chart", sr: "Trakasti grafikon" },
  schema: barChartSchema,
  getInitialConfig: getInitialBarConfig,
} satisfies ChartDefinition<BarChartConfig>;
