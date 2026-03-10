/**
 * TypeScript types for sunburst chart configuration.
 * These types define the configuration schema for sunburst charts.
 */

import { AnimationField } from "@/config-types";

/**
 * Field configuration for a single hierarchy level in a sunburst chart.
 * Each level represents a ring in the sunburst visualization.
 */
export interface SunburstHierarchyField {
  componentId: string;
  type: "nominal";
}

/**
 * Field configuration for the sunburst chart size (value) field.
 * Determines the size/area of each arc segment.
 */
export interface SunburstSizeField {
  componentId: string;
  type: "quantitative";
}

/**
 * Field configuration for the sunburst chart color field.
 * Determines the color of each arc segment.
 */
export interface SunburstColorField {
  componentId: string;
}

/**
 * Complete field configuration for a sunburst chart.
 */
export interface SunburstFields {
  /** Hierarchy levels - each level creates a ring in the sunburst */
  hierarchy: SunburstHierarchyField[];
  /** Size field - determines the area of each arc segment */
  size: SunburstSizeField;
  /** Color field - determines the color of each arc segment */
  color: SunburstColorField;
  /** Animation configuration (optional) */
  animation?: AnimationField;
}

/**
 * Visual configuration options for sunburst charts.
 */
export interface SunburstVisualOptions {
  /** Enable zoom on click to drill down into hierarchy */
  enableZoomOnClick?: boolean;
  /** Show breadcrumb navigation for current path */
  showBreadcrumb?: boolean;
  /** Enable arc highlighting on hover */
  enableArcHighlight?: boolean;
  /** Enable animated transitions */
  enableAnimations?: boolean;
  /** Inner radius as percentage (0-1) for creating a donut-style sunburst */
  innerRadiusRatio?: number;
  /** Corner radius for arc segments */
  cornerRadius?: number;
  /** Padding between arc segments in pixels */
  padAngle?: number;
}

/**
 * Runtime data structure for a sunburst node.
 * Used when rendering the chart with processed data.
 */
export interface SunburstNode {
  /** Unique identifier for the node */
  id: string;
  /** Display name for the node */
  name: string;
  /** Depth/level in the hierarchy (0 = center) */
  depth: number;
  /** Value/size of the node */
  value: number;
  /** Optional color for the node */
  color?: string;
  /** Parent node reference (undefined for root) */
  parent?: SunburstNode;
  /** Children nodes */
  children?: SunburstNode[];
  /** Start angle in radians */
  x0?: number;
  /** End angle in radians */
  x1?: number;
  /** Inner radius (y0) */
  y0?: number;
  /** Outer radius (y1) */
  y1?: number;
  /** Percentage of parent value */
  percentage?: number;
}

/**
 * Complete configuration for a sunburst chart.
 */
export interface SunburstConfig {
  /** Chart type identifier */
  chartType: "sunburst";
  /** Field configuration */
  fields: SunburstFields;
  /** Visual options (optional) */
  visualOptions?: SunburstVisualOptions;
}

/**
 * Type guard to check if a chart configuration is a SunburstConfig.
 */
export function isSunburstConfig(config: {
  chartType: string;
}): config is SunburstConfig {
  return config.chartType === "sunburst";
}
