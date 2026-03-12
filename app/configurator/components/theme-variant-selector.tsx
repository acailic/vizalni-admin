import { t } from "@lingui/macro";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

import { ChartThemeVariant } from "@/charts/shared/chart-theme-variants";
import { useConfiguratorState, isConfiguring } from "@/configurator";

const THEME_VARIANT_LABELS: Record<ChartThemeVariant, string> = {
  default: "Default",
  modern: "Modern",
  minimal: "Minimal",
  dark: "Dark",
};

export const ThemeVariantSelector = () => {
  const [state, dispatch] = useConfiguratorState(isConfiguring);

  const currentVariant = state.chartConfig.themeVariant ?? "default";
  const label = t({ id: "chart.themeVariant.label", message: "Theme Style" });

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch({
        type: "CHART_THEME_VARIANT_CHANGED",
        payload: { variant: event.target.value as ChartThemeVariant },
      });
    },
    [dispatch]
  );

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={currentVariant} label={label} onChange={handleChange}>
        {(Object.keys(THEME_VARIANT_LABELS) as ChartThemeVariant[]).map(
          (variant) => (
            <MenuItem key={variant} value={variant}>
              {THEME_VARIANT_LABELS[variant]}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};
