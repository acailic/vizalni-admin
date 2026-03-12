export {
  BarChart,
  ColumnChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  PopulationTrends,
} from "./lazy";

export type {
  BarChartProps,
  ColumnChartProps,
  LineChartProps,
  PieChartProps,
  PopulationPyramidProps,
  PopulationTrendsProps,
} from "./lazy";

export type StoryConfig = {
  id: string;
  theme: string;
  difficulty: string;
  estimatedTime: string;
  title: { sr: string; en: string };
  description: { sr: string; en: string };
  steps: Array<{
    id: string;
    title: { sr: string; en: string };
    narrative: { sr: string; en: string };
    chart: React.ComponentType<any>;
    chartProps: any;
    insights: any; // Flexible to accommodate different structures
    callout: { sr: string; en: string };
  }>;
};
