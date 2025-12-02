import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

import type { BarChartProps } from "./BarChart";
import type { ColumnChartProps } from "./ColumnChart";
import type { LineChartProps } from "./LineChart";
import type { PieChartProps } from "./PieChart";
import type { PopulationPyramidProps } from "./PopulationPyramid";
import type { PopulationTrendsProps } from "./PopulationTrends";

const LoadingChart = () => (
  <Box
    sx={{
      minHeight: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      color: "text.secondary",
      typography: "body2",
    }}
  >
    <CircularProgress size={16} thickness={5} />
    <span>Loading chart…</span>
  </Box>
);

export const BarChart = dynamic<BarChartProps>(
  () => import("./BarChart").then((mod) => mod.BarChart),
  { ssr: false, loading: LoadingChart }
);

export const ColumnChart = dynamic<ColumnChartProps>(
  () => import("./ColumnChart").then((mod) => mod.ColumnChart),
  { ssr: false, loading: LoadingChart }
);

export const LineChart = dynamic<LineChartProps>(
  () => import("./LineChart").then((mod) => mod.LineChart),
  { ssr: false, loading: LoadingChart }
);

export const PieChart = dynamic<PieChartProps>(
  () => import("./PieChart").then((mod) => mod.PieChart),
  { ssr: false, loading: LoadingChart }
);

export const PopulationPyramid = dynamic<PopulationPyramidProps>(
  () => import("./PopulationPyramid").then((mod) => mod.PopulationPyramid),
  { ssr: false, loading: LoadingChart }
);

export const PopulationTrends = dynamic<PopulationTrendsProps>(
  () => import("./PopulationTrends").then((mod) => mod.PopulationTrends),
  { ssr: false, loading: LoadingChart }
);

export type {
  BarChartProps,
  ColumnChartProps,
  LineChartProps,
  PieChartProps,
  PopulationPyramidProps,
  PopulationTrendsProps,
};
