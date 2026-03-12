import { useMediaQuery } from "@mui/material";
import { createContext, useContext, createElement, ReactNode } from "react";

import { useTheme } from "../../themes";

import { chartMotion, chartStroke, chartColors } from "./chart-theme-tokens";
import { ChartThemeVariant as ThemeVariant } from "./chart-theme-variants";

export const TICK_FONT_SIZE = 12;
const AXIS_LABEL_FONT_SIZE_XXS = 12;
const AXIS_LABEL_FONT_SIZE_XL = 14;

/**
 * Chart theme variant types - re-exported from chart-theme-variants
 */
export type ChartThemeVariant = ThemeVariant;

/**
 * Context for chart theme variant selection
 */
export const ChartThemeContext = createContext<ChartThemeVariant | undefined>(
  undefined
);

/**
 * Provider component for chart theme variant
 */
export function ChartThemeProvider({
  variant,
  children,
}: {
  variant: ChartThemeVariant;
  children: ReactNode;
}) {
  return createElement(
    ChartThemeContext.Provider,
    { value: variant },
    children
  );
}

/**
 * Chart theme interface with all visual styling properties
 */
export interface ChartTheme {
  // Typography
  axisLabelFontSize: number;
  labelFontSize: number;
  labelColor: string;
  fontFamily: string;

  // Colors
  domainColor: string;
  gridColor: string;

  // Stroke and shape
  lineWidth: number;
  barRadius: number;
  dotRadius: number;
  dotGlowRadius: number;

  // Animation
  animationDuration: number;
  animationEasing: string;

  // Tooltip
  tooltipBackgroundColor: string;
  tooltipBorderColor: string;
  tooltipTextColor: string;

  // Brush (for interactive charts)
  brushOverlayColor: string;
  brushSelectionColor: string;
  brushHandleStrokeColor: string;
  brushHandleFillColor: string;
}

/**
 * Variant-specific overrides for chart theming
 * Values derived from chart-theme-variants.ts stroke tokens
 */
const themeVariants: Record<ChartThemeVariant, Partial<ChartTheme>> = {
  default: {
    lineWidth: 2,
    barRadius: 0,
    dotRadius: 3,
    dotGlowRadius: 6,
  },
  modern: {
    lineWidth: 2.5,
    barRadius: 8, // More rounded than default
    dotRadius: 5,
    dotGlowRadius: 10,
  },
  minimal: {
    lineWidth: 1, // Thinner lines (from chart-theme-variants.ts)
    barRadius: 2,
    dotRadius: 3,
    dotGlowRadius: 6,
  },
  dark: {
    lineWidth: chartStroke.lineWidth,
    barRadius: chartStroke.barRadius,
    dotRadius: chartStroke.dotRadius,
    dotGlowRadius: chartStroke.dotGlowRadius,
  },
};

/**
 * Hook to get chart theme with a specific variant
 * @param variant - The theme variant to use
 * @returns ChartTheme object with all styling properties
 */
export const useChartThemeWithVariant = (
  variant: ChartThemeVariant = "modern"
): ChartTheme => {
  const theme = useTheme();
  const labelColor = theme.palette.text.primary;
  const domainColor = theme.palette.monochrome[800];
  const gridColor = theme.palette.cobalt[100];
  const fontFamily = theme.typography.fontFamily as string;
  const brushOverlayColor = theme.palette.monochrome[300];
  const brushSelectionColor = theme.palette.monochrome[500];
  const brushHandleStrokeColor = theme.palette.monochrome[500];
  const brushHandleFillColor = theme.palette.background.paper;

  const smallerTexts = useMediaQuery(theme.breakpoints.down("xl"));
  const axisLabelFontSize = smallerTexts
    ? AXIS_LABEL_FONT_SIZE_XXS
    : AXIS_LABEL_FONT_SIZE_XL;

  const variantOverrides = themeVariants[variant];

  return {
    // Typography
    axisLabelFontSize,
    labelFontSize: TICK_FONT_SIZE,
    labelColor,
    fontFamily,

    // Colors
    domainColor,
    gridColor,

    // Stroke and shape (from variant)
    lineWidth: variantOverrides?.lineWidth ?? chartStroke.lineWidth,
    barRadius: variantOverrides?.barRadius ?? chartStroke.barRadius,
    dotRadius: variantOverrides?.dotRadius ?? chartStroke.dotRadius,
    dotGlowRadius: variantOverrides?.dotGlowRadius ?? chartStroke.dotGlowRadius,

    // Animation
    animationDuration: chartMotion.duration,
    animationEasing: chartMotion.easing,

    // Tooltip
    tooltipBackgroundColor: chartColors.tooltip.background,
    tooltipBorderColor: chartColors.tooltip.border,
    tooltipTextColor: chartColors.tooltip.text,

    // Brush
    brushOverlayColor,
    brushSelectionColor,
    brushHandleStrokeColor,
    brushHandleFillColor,
  };
};

/**
 * Hook to get chart theme with default ("modern") variant
 * Uses context if available, falls back to "modern" if no provider
 * @returns ChartTheme object with all styling properties
 */
export const useChartTheme = (): ChartTheme => {
  const contextVariant = useContext(ChartThemeContext);
  const variant = contextVariant ?? "modern";
  return useChartThemeWithVariant(variant);
};
