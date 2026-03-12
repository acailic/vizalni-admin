import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

import { Flex } from "@/components/flex";

/**
 * Preset color palettes for quick selection
 */
const PRESET_PALETTES: { name: string; colors: string[] }[] = [
  {
    name: "Blue/Purple",
    colors: ["#0ea5e9", "#2563eb", "#7c3aed", "#db2777"],
  },
  {
    name: "Warm",
    colors: ["#f97316", "#ef4444", "#ec4899", "#f59e0b"],
  },
  {
    name: "Green/Teal",
    colors: ["#10b981", "#14b8a6", "#06b6d4", "#84cc16"],
  },
  {
    name: "Monochrome",
    colors: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af"],
  },
];

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
}

/**
 * ColorPicker component for the interactive playground.
 * Allows users to select from preset color palettes or add custom colors.
 */
export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const theme = useTheme();
  const [customColor, setCustomColor] = useState("#0ea5e9");

  /**
   * Apply a preset palette to the current colors
   */
  const handlePaletteSelect = useCallback(
    (colors: string[]) => {
      onChange(colors);
    },
    [onChange]
  );

  /**
   * Add a custom color to the current palette
   */
  const handleAddColor = useCallback(() => {
    // Prevent duplicate colors
    if (!value.includes(customColor)) {
      onChange([...value, customColor]);
    }
  }, [customColor, onChange, value]);

  /**
   * Remove a color from the current palette
   */
  const handleRemoveColor = useCallback(
    (colorToRemove: string) => {
      // Prevent removing the last color
      if (value.length > 1) {
        onChange(value.filter((color) => color !== colorToRemove));
      }
    },
    [onChange, value]
  );

  /**
   * Handle color input change
   */
  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomColor(e.target.value);
    },
    []
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Preset Palettes Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Preset Palettes
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
          }}
        >
          {PRESET_PALETTES.map((palette) => (
            <Tooltip key={palette.name} title={palette.name} arrow>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePaletteSelect(palette.colors)}
                sx={{
                  display: "flex",
                  gap: 0.5,
                  padding: 1,
                  minWidth: "auto",
                  borderColor: theme.palette.divider,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                {palette.colors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: color,
                      borderRadius: 0.5,
                    }}
                  />
                ))}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Custom Color Input Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Custom Color
        </Typography>
        <Flex sx={{ alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              position: "relative",
              width: 40,
              height: 40,
              borderRadius: 1,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
              "& input[type='color']": {
                width: 60,
                height: 60,
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: -10,
                left: -10,
              },
            }}
          >
            <input
              type="color"
              value={customColor}
              onChange={handleColorInputChange}
              aria-label="Select custom color"
            />
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddColor}
            disabled={value.includes(customColor)}
            sx={{
              textTransform: "none",
            }}
          >
            Add
          </Button>
        </Flex>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Current Colors Preview Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Current Colors ({value.length})
        </Typography>
        <Flex sx={{ flexWrap: "wrap", gap: 1 }}>
          {value.map((color, index) => (
            <Box
              key={`${color}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                padding: 0.5,
                borderRadius: 1,
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                }}
              >
                {color.toUpperCase()}
              </Typography>
              {value.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveColor(color)}
                  aria-label={`Remove color ${color}`}
                  sx={{
                    padding: 0.25,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ColorPicker;
