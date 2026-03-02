// app/pages/demos/playground/_components/PreviewPane/ChartRenderer.tsx
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

// Dynamic imports for code splitting
const LineChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.LineChart),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.BarChart),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("@/exports/charts").then((mod) => mod.PieChart),
  { ssr: false }
);

interface ChartRendererProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  height?: number;
}

export function ChartRenderer({
  chartType,
  data,
  config,
  height = 400,
}: ChartRendererProps) {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey.50",
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  const commonProps = {
    data,
    config: {
      xAxis: config.xAxis,
      yAxis: config.yAxis,
      color: config.color,
      showCrosshair: config.showCrosshair ?? true,
    },
    height,
    animated: true,
  };

  switch (chartType) {
    case "line":
      return (
        <LineChart
          {...commonProps}
          config={{ ...commonProps.config, showArea: config.showArea }}
        />
      );
    case "bar":
      return <BarChart {...commonProps} />;
    case "area":
      return <AreaChart {...commonProps} />;
    case "pie":
      return (
        <PieChart
          data={data}
          config={{
            xAxis: config.xAxis,
            yAxis: config.yAxis,
            color: config.color,
          }}
          height={height}
        />
      );
    case "scatter":
      // Fallback to line for now
      return <LineChart {...commonProps} />;
    default:
      return null;
  }
}
