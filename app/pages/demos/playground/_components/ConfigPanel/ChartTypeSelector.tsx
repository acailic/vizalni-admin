// app/pages/demos/playground/_components/ConfigPanel/ChartTypeSelector.tsx
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";

import type { ChartType } from "../../_types";

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: "line", label: "Line", icon: "📈" },
  { value: "bar", label: "Bar", icon: "📊" },
  { value: "area", label: "Area", icon: "📉" },
  { value: "pie", label: "Pie", icon: "🥧" },
  { value: "scatter", label: "Scatter", icon: "⦿" },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Chart Type
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newType) => newType && onChange(newType)}
        aria-label="chart type"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {CHART_TYPES.map((type) => (
          <ToggleButton
            key={type.value}
            value={type.value}
            aria-label={type.label}
            aria-pressed={value === type.value}
            sx={{
              px: 2,
              py: 1,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <span>{type.icon}</span>
              <Typography variant="body2">{type.label}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
