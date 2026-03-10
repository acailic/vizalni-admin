/**
 * Chart theme variants system for different visual styles.
 * Provides 4 variants: default, modern, minimal, and dark.
 */

import {
  chartColors,
  chartTypography,
  chartMotion,
  chartSpacing,
  chartStroke,
} from "./chart-theme-tokens";

export type ChartThemeVariant = "default" | "modern" | "minimal" | "dark";

export interface ChartThemeTokens {
  colors: typeof chartColors;
  typography: typeof chartTypography;
  motion: typeof chartMotion;
  spacing: typeof chartSpacing;
  stroke: typeof chartStroke;
}

/**
 * Default theme - balanced and professional
 */
const DEFAULT_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
  },
  typography: {
    ...chartTypography,
  },
  motion: {
    ...chartMotion,
  },
  spacing: {
    ...chartSpacing,
  },
  stroke: {
    ...chartStroke,
  },
};

/**
 * Modern theme - softer colors with rounded corners
 */
const MODERN_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
  },
  typography: {
    ...chartTypography,
  },
  motion: {
    ...chartMotion,
  },
  spacing: {
    ...chartSpacing,
    padding: 20,
  },
  stroke: {
    lineWidth: 2.5,
    dotRadius: 5,
    dotGlowRadius: 10,
    barRadius: 8, // More rounded than default
  },
};

/**
 * Minimal theme - thin strokes, clean appearance
 */
const MINIMAL_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
    grid: "rgba(156, 163, 175, 0.1)", // Lighter grid
  },
  typography: {
    ...chartTypography,
  },
  motion: {
    ...chartMotion,
    duration: 200, // Faster animations
  },
  spacing: {
    ...chartSpacing,
    padding: 12,
  },
  stroke: {
    lineWidth: 1, // Thinner lines
    dotRadius: 3,
    dotGlowRadius: 6,
    barRadius: 2,
  },
};

/**
 * Dark theme - optimized for dark backgrounds
 */
const DARK_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
    primary: "#60A5FA", // Lighter blue for dark bg
    accent: "#A78BFA", // Lighter purple
    positive: "#34D399", // Lighter green
    negative: "#F87171", // Lighter red
    neutral: "#9CA3AF", // Lighter gray
    grid: "rgba(156, 163, 175, 0.15)",
    axis: "#9CA3AF", // Lighter axis for dark bg
    tooltip: {
      background: "#111827", // Darker tooltip bg
      border: "#374151",
      text: "#F9FAFB",
    },
  },
  typography: {
    ...chartTypography,
  },
  motion: {
    ...chartMotion,
  },
  spacing: {
    ...chartSpacing,
  },
  stroke: {
    ...chartStroke,
  },
};

/**
 * All available theme variants
 */
export const CHART_THEME_VARIANTS: Record<ChartThemeVariant, ChartThemeTokens> =
  {
    default: DEFAULT_THEME,
    modern: MODERN_THEME,
    minimal: MINIMAL_THEME,
    dark: DARK_THEME,
  };

/**
 * Get a theme variant by name
 * @param variant - The variant name to retrieve
 * @returns The theme tokens for the requested variant
 * @throws Error if variant name is invalid
 */
export function getChartThemeVariant(
  variant: ChartThemeVariant
): ChartThemeTokens {
  const theme = CHART_THEME_VARIANTS[variant];
  if (!theme) {
    throw new Error(
      `Invalid chart theme variant: "${variant}". Valid variants are: ${Object.keys(
        CHART_THEME_VARIANTS
      ).join(", ")}`
    );
  }
  return theme;
}
