/**
 * Chart Component Types
 *
 * Common types and interfaces for chart components.
 */

import type React from "react";

/**
 * Chart data point - can be any object with string/number properties
 */
export type ChartData = Record<string, string | number | null | undefined>;

/**
 * Base chart configuration
 */
export interface BaseChartConfig {
  /** Key for X axis/data labels */
  xAxis: string;
  /** Key for Y axis/values */
  yAxis: string | string[];
  /** Chart color (hex format) */
  color?: string;
  /** Chart title */
  title?: string;
  /** Series keys for multi-series charts */
  seriesKeys?: string[];
}

/**
 * Chart color palette
 */
export type ColorPalette =
  | "default"
  | "categorical"
  | "sequential"
  | "diverging";

/**
 * Chart locale for formatting
 */
export type ChartLocale = "sr-Latn" | "sr-Cyrl" | "en";

/**
 * Base chart props
 */
export interface BaseChartProps {
  /** Chart data array */
  data: ChartData[];
  /** Chart configuration */
  config: BaseChartConfig;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (responsive by default) */
  width?: number | "100%";
  /** Locale for formatting */
  locale?: ChartLocale;
  /** CSS class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * Tooltip renderer function
 */
export type TooltipRenderer = (data: ChartData) => React.ReactNode;

/**
 * Data point click handler
 */
export type DataPointClickHandler = (data: ChartData, index: number) => void;

/**
 * Interactive chart props (extends base with interactivity)
 */
export interface InteractiveChartProps extends BaseChartProps {
  /** Callback when data point is clicked */
  onDataPointClick?: DataPointClickHandler;
  /** Custom tooltip renderer */
  renderTooltip?: TooltipRenderer;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Enable animations */
  animated?: boolean;
}

/**
 * Loading state props
 */
export interface ChartLoadingProps {
  /** Show loading skeleton */
  isLoading?: boolean;
  /** Loading message */
  loadingMessage?: string;
  /** Error state */
  error?: Error | null;
}

/**
 * Complete chart props (combines all features)
 */
export interface ChartProps extends InteractiveChartProps, ChartLoadingProps {
  /** Unique identifier for the chart */
  id?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Description for screen readers */
  description?: string;
}
