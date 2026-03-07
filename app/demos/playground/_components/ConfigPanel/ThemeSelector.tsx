// app/pages/demos/playground/_components/ConfigPanel/ThemeSelector.tsx
import { Box, Typography, Tooltip } from "@mui/material";

import { useLocale } from "@/locales/use-locale";

import { THEME_PRESETS } from "../../_constants";

interface ThemeSelectorProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const locale = useLocale();
  const isSerbian = locale.startsWith("sr");

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        {isSerbian ? "Tema" : "Theme"}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {THEME_PRESETS.map((theme) => (
          <Tooltip key={theme.id} title={theme.name} arrow>
            <Box
              component="button"
              type="button"
              aria-label={theme.name}
              onClick={() => onChange(theme.id)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: theme.primary,
                cursor: "pointer",
                border:
                  value === theme.id
                    ? "3px solid black"
                    : "2px solid transparent",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
                "&:focus-visible": {
                  outline: "2px solid currentColor",
                  outlineOffset: 2,
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
