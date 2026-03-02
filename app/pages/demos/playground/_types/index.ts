// app/pages/demos/playground/_types/index.ts
import type { BaseChartConfig } from "@/exports/charts";

export type ChartType = "line" | "bar" | "area" | "pie" | "scatter";

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

export interface PlaygroundConfig extends BaseChartConfig {
  showArea?: boolean;
  showCrosshair?: boolean;
  donut?: boolean;
  stacked?: boolean;
}

export interface PlaygroundState {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  themeId: string;
  ui: {
    activeTab: "preview" | "code";
    showOnboarding: boolean;
    panelCollapsed: boolean;
  };
}

export interface Datum {
  [key: string]: string | number;
}
