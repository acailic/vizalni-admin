/**
 * TypeScript types for gauge chart configuration.
 * These types define the configuration schema for gauge charts.
 */

import { AnimationField } from "@/config-types";

/**
 * Field configuration for gauge chart value.
 * Determines the primary value to display on the gauge.
 */
export interface GaugeValueField {
  componentId: string;
  type: "quantitative";
}

/**
 * Threshold configuration for color zones on the gauge.
 * Each threshold defines a value at which the color changes.
 */
export interface GaugeThreshold {
  /** Value at which this threshold applies */
  value: number;
  /** Color for this threshold zone */
  color: string;
  /** Optional label for the threshold */
  label?: string;
}

/**
 * Complete field configuration for a gauge chart.
 */
export interface GaugeFields {
  /** Value field - the primary measurement to display */
  value: GaugeValueField;
  /** Animation configuration (optional) */
  animation?: AnimationField;
}

/**
 * Value display position options.
 */
export type GaugeValueDisplay = "inside" | "outside" | "none";

/**
 * Gauge layout options for displaying multiple gauges.
 */
export type GaugeLayout = "single" | "comparison";

/**
 * Visual configuration options for gauge charts.
 */
export interface GaugeVisualOptions {
  /** Minimum value for the gauge scale (default: 0) */
  min?: number;
  /** Maximum value for the gauge scale (default: 100) */
  max?: number;
  /** Threshold configurations for color zones */
  thresholds?: GaugeThreshold[];
  /** Show the current value on the gauge */
  showValue?: boolean;
  /** Position of value display */
  valueDisplay?: GaugeValueDisplay;
  /** Layout mode for multiple gauges */
  layout?: GaugeLayout;
  /** Enable animated needle transitions */
  enableAnimations?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Start angle in degrees (default: -135) */
  startAngle?: number;
  /** End angle in degrees (default: 135) */
  endAngle?: number;
  /** Corner radius for arc segments */
  cornerRadius?: number;
  /** Padding between arcs (for comparison layout) */
  arcPadding?: number;
}

/**
 * Runtime data structure for a gauge arc segment.
 * Used when rendering the chart with processed data.
 */
export interface GaugeArc {
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Inner radius of the arc */
  innerRadius: number;
  /** Outer radius of the arc */
  outerRadius: number;
  /** Color of the arc segment */
  color: string;
  /** Optional label for the arc */
  label?: string;
  /** Value this arc represents */
  value?: number;
}

/**
 * Runtime data structure for a gauge needle.
 * Represents the indicator pointing to the current value.
 */
export interface GaugeNeedle {
  /** Current value the needle points to */
  value: number;
  /** Angle in radians where the needle points */
  angle: number;
  /** Length of the needle as ratio of radius (0-1) */
  length: number;
  /** Width of the needle at base */
  baseWidth: number;
  /** Color of the needle */
  color?: string;
}

/**
 * Runtime data structure for gauge value display.
 */
export interface GaugeValueDisplayData {
  /** The formatted value to display */
  formattedValue: string;
  /** The raw numeric value */
  rawValue: number;
  /** X position for the value text */
  x: number;
  /** Y position for the value text */
  y: number;
  /** Font size for the value text */
  fontSize?: number;
  /** Color for the value text */
  color?: string;
}

/**
 * Complete configuration for a gauge chart.
 */
export interface GaugeConfig {
  /** Chart type identifier */
  chartType: "gauge";
  /** Field configuration */
  fields: GaugeFields;
  /** Visual options (optional) */
  visualOptions?: GaugeVisualOptions;
}

/**
 * Runtime data structure for rendering a gauge chart.
 * Contains all computed values needed for rendering.
 */
export interface GaugeRenderData {
  /** Current value to display */
  value: number;
  /** Minimum value of the scale */
  min: number;
  /** Maximum value of the scale */
  max: number;
  /** Percentage of the value within the scale (0-1) */
  percentage: number;
  /** Arc segments for background and thresholds */
  arcs: GaugeArc[];
  /** Needle configuration */
  needle: GaugeNeedle;
  /** Value display configuration */
  valueDisplay?: GaugeValueDisplayData;
  /** Threshold that the current value falls into */
  activeThreshold?: GaugeThreshold;
}

/**
 * Type guard to check if a chart configuration is a GaugeConfig.
 */
export function isGaugeConfig(config: {
  chartType: string;
}): config is GaugeConfig {
  return config.chartType === "gauge";
}
