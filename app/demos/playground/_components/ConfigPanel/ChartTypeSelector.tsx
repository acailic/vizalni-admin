// app/pages/demos/playground/_components/ConfigPanel/ChartTypeSelector.tsx
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";

import { Icon, type IconName } from "@/icons";
import { useLocale } from "@/locales/use-locale";

import type { ChartType } from "../../_types";

const CHART_TYPES: { value: ChartType; label: string; icon: IconName }[] = [
  { value: "line", label: "Line", icon: "lineChart" },
  { value: "bar", label: "Bar", icon: "chartBar" },
  { value: "area", label: "Area", icon: "areasChart" },
  { value: "pie", label: "Pie", icon: "pieChart" },
  { value: "scatter", label: "Scatter", icon: "scatterplotChart" },
];

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  const locale = useLocale();
  const isSerbian = locale.startsWith("sr");
  const labels: Record<ChartType, string> = {
    line: isSerbian ? "Linijski" : "Line",
    bar: isSerbian ? "Stubičasti" : "Bar",
    area: isSerbian ? "Površinski" : "Area",
    pie: isSerbian ? "Kružni" : "Pie",
    scatter: isSerbian ? "Rasuti" : "Scatter",
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        {isSerbian ? "Tip grafikona" : "Chart Type"}
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
            aria-label={labels[type.value]}
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
              <Icon name={type.icon} size={18} />
              <Typography variant="body2">{labels[type.value]}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
