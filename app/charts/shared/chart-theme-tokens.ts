/**
 * Chart theme tokens for modern, distinctive visual styling.
 * All values are designed for optimal readability and visual appeal.
 */

export const chartColors = {
  // Vibrant primary palette
  primary: "#3B82F6", // Bright blue
  accent: "#8B5CF6", // Purple

  // Semantic colors
  positive: "#10B981", // Green
  negative: "#EF4444", // Red
  neutral: "#6B7280", // Gray

  // UI colors
  grid: "rgba(156, 163, 175, 0.2)",
  axis: "#374151",
  tooltip: {
    background: "#1F2937",
    border: "#374151",
    text: "#F9FAFB",
  },
};

export const chartTypography = {
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1.4,
  },
  axisLabel: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.01em",
  },
  dataLabel: {
    fontSize: "0.6875rem",
    fontWeight: 500,
  },
  tooltip: {
    fontSize: "0.75rem",
    fontWeight: 400,
  },
};

export const chartMotion = {
  duration: 300,
  easing: "ease-out" as const,
  entrance: {
    duration: 400,
    delay: 50,
  },
  hover: {
    duration: 150,
  },
};

export const chartSpacing = {
  padding: 16,
  legendGap: 24,
  tooltipPadding: 12,
};

export const chartStroke = {
  lineWidth: 2.5,
  dotRadius: 4,
  dotGlowRadius: 8,
  barRadius: 4,
};

/**
 * Color palettes for multi-series charts
 */
const VIBRANT_PALETTE = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

const COLORBLIND_SAFE_PALETTE = [
  "#0077BB", // Blue
  "#33BBEE", // Cyan
  "#009988", // Teal
  "#EE7733", // Orange
  "#CC3311", // Red
  "#EE3377", // Magenta
  "#BBBBBB", // Gray
];

export interface ColorPaletteOptions {
  colorblindSafe?: boolean;
  count?: number;
}

export function getChartColorPalette(
  options: ColorPaletteOptions = {}
): string[] {
  const { colorblindSafe = false, count } = options;
  const basePalette = colorblindSafe
    ? COLORBLIND_SAFE_PALETTE
    : VIBRANT_PALETTE;

  if (count !== undefined && count > basePalette.length) {
    // If more colors needed, cycle through palette
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(basePalette[i % basePalette.length]);
    }
    return result;
  }

  return count !== undefined ? basePalette.slice(0, count) : basePalette;
}
