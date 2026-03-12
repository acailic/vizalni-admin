import { Paper, Box } from "@mui/material";

import { ChartRenderer } from "./ChartRenderer";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface PreviewPaneProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  height?: number;
}

export function PreviewPane({
  chartType,
  data,
  config,
  height = 400,
}: PreviewPaneProps) {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: height + 100,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={2}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChartRenderer
          chartType={chartType}
          data={data}
          config={config}
          height={height}
        />
      </Box>
    </Paper>
  );
}

export { ChartRenderer } from "./ChartRenderer";
