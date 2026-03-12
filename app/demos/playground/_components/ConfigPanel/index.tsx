// app/pages/demos/playground/_components/ConfigPanel/index.tsx
import { Paper, Stack, Divider } from "@mui/material";

import { ChartTypeSelector } from "./ChartTypeSelector";
import { DataEditor } from "./DataEditor";
import { ThemeSelector } from "./ThemeSelector";

import type { ChartType, Datum, PlaygroundConfig } from "../../_types";

interface ConfigPanelProps {
  chartType: ChartType;
  data: Datum[];
  config: PlaygroundConfig;
  themeId: string;
  onChartTypeChange: (type: ChartType) => void;
  onDataChange: (data: Datum[]) => void;
  onConfigChange: (config: PlaygroundConfig) => void;
  onThemeChange: (themeId: string) => void;
}

export function ConfigPanel({
  chartType,
  data,
  config: _config,
  themeId,
  onChartTypeChange,
  onDataChange,
  onConfigChange: _onConfigChange,
  onThemeChange,
}: ConfigPanelProps) {
  // Note: config and onConfigChange will be used for axis configuration in a future enhancement
  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Stack spacing={3}>
        <ChartTypeSelector value={chartType} onChange={onChartTypeChange} />

        <Divider />

        <DataEditor data={data} onChange={onDataChange} />

        <Divider />

        <ThemeSelector value={themeId} onChange={onThemeChange} />
      </Stack>
    </Paper>
  );
}

export { ChartTypeSelector } from "./ChartTypeSelector";
export { DataEditor } from "./DataEditor";
export { ThemeSelector } from "./ThemeSelector";
