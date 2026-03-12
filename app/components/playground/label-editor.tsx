import { Box, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";

interface LabelEditorProps {
  title: string;
  subtitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  onChange: (labels: {
    title?: string;
    subtitle?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  }) => void;
}

/**
 * LabelEditor component for the interactive playground.
 * Allows users to edit chart labels including title, subtitle, and axis labels.
 */
export const LabelEditor = ({
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  onChange,
}: LabelEditorProps) => {
  const theme = useTheme();

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ title: e.target.value });
    },
    [onChange]
  );

  const handleSubtitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ subtitle: e.target.value });
    },
    [onChange]
  );

  const handleXAxisLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ xAxisLabel: e.target.value });
    },
    [onChange]
  );

  const handleYAxisLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ yAxisLabel: e.target.value });
    },
    [onChange]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Section Label */}
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        Chart Labels
      </Typography>

      {/* Title Field */}
      <TextField
        size="small"
        fullWidth
        label="Title"
        placeholder="Enter chart title"
        value={title}
        onChange={handleTitleChange}
        inputProps={{
          "aria-label": "Chart title",
        }}
      />

      {/* Subtitle Field */}
      <TextField
        size="small"
        fullWidth
        label="Subtitle"
        placeholder="Enter chart subtitle (optional)"
        value={subtitle}
        onChange={handleSubtitleChange}
        inputProps={{
          "aria-label": "Chart subtitle",
        }}
      />

      {/* X-Axis Label Field */}
      <TextField
        size="small"
        fullWidth
        label="X-Axis Label"
        placeholder="Enter x-axis label"
        value={xAxisLabel}
        onChange={handleXAxisLabelChange}
        inputProps={{
          "aria-label": "X-axis label",
        }}
      />

      {/* Y-Axis Label Field */}
      <TextField
        size="small"
        fullWidth
        label="Y-Axis Label"
        placeholder="Enter y-axis label"
        value={yAxisLabel}
        onChange={handleYAxisLabelChange}
        inputProps={{
          "aria-label": "Y-axis label",
        }}
      />
    </Box>
  );
};

export default LabelEditor;
