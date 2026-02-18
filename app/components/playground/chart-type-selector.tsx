import {
  BarChart,
  PieChart,
  ScatterPlot,
  ShowChart,
} from "@mui/icons-material";
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";

import { ChartType } from "@/hooks/use-playground-state";

/**
 * Chart type configuration with icon and label
 */
const CHART_TYPE_CONFIG: {
  type: ChartType;
  icon: React.ReactElement;
  label: string;
}[] = [
  { type: "line", icon: <ShowChart />, label: "Line" },
  { type: "bar", icon: <BarChart />, label: "Bar" },
  { type: "column", icon: <BarChart />, label: "Column" },
  { type: "pie", icon: <PieChart />, label: "Pie" },
  { type: "area", icon: <ShowChart />, label: "Area" },
  { type: "scatter", icon: <ScatterPlot />, label: "Scatter" },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

/**
 * ChartTypeSelector component for the interactive playground.
 * Allows users to select the chart type for their visualization.
 */
export const ChartTypeSelector = ({
  value,
  onChange,
}: ChartTypeSelectorProps) => {
  const theme = useTheme();

  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
      if (newType !== null) {
        onChange(newType);
      }
    },
    [onChange]
  );

  return (
    <Box>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="Chart type selection"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          "& .MuiToggleButtonGroup-grouped": {
            margin: 0,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.shape.borderRadius}px !important`,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
            "&:not(:first-of-type)": {
              borderRadius: `${theme.shape.borderRadius}px !important`,
            },
            "&:first-of-type": {
              borderRadius: `${theme.shape.borderRadius}px !important`,
            },
          },
        }}
      >
        {CHART_TYPE_CONFIG.map(({ type, icon, label }) => (
          <Tooltip key={type} title={label} arrow>
            <ToggleButton
              value={type}
              aria-label={`Select ${label} chart`}
              sx={{
                padding: 1,
                minWidth: 40,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {icon}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ChartTypeSelector;
