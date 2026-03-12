import { ZodTypeAny } from "zod";

import { barChart } from "@/chart-types/bar";

export type ChartDefinition<TConfig = unknown> = {
  type: string;
  label: { en: string; sr: string };
  schema: ZodTypeAny;
  getInitialConfig: (cubeIri: string) => TConfig;
};

export const chartRegistry = [barChart] satisfies ChartDefinition[];

// Returns ChartDefinition<unknown>. Callers that need the concrete TConfig
// must narrow via the chart-specific module directly.
export const getChartDefinition = (type: string): ChartDefinition => {
  const def = chartRegistry.find((c) => c.type === type);
  if (!def) throw new Error(`No chart definition registered for type: ${type}`);
  return def;
};

export const isRegisteredChartType = (type: string): boolean =>
  chartRegistry.some((c) => c.type === type);

export type RegisteredChartType = (typeof chartRegistry)[number]["type"];
