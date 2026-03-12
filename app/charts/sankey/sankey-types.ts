/**
 * TypeScript types for sankey chart configuration.
 * These types define the configuration schema for sankey charts.
 */

import { AnimationField } from "@/config-types";

/**
 * Field configuration for sankey chart nodes.
 * Each node represents an entity in the flow diagram.
 */
export interface SankeyNodeField {
  componentId: string;
  type: "nominal";
}

/**
 * Field configuration for sankey chart links.
 * Links define the flow between source and target nodes with a value.
 */
export interface SankeyLinkFields {
  /** Source node field - where the flow originates */
  source: {
    componentId: string;
  };
  /** Target node field - where the flow ends */
  target: {
    componentId: string;
  };
  /** Value field - the magnitude of the flow */
  value: {
    componentId: string;
    type: "quantitative";
  };
}

/**
 * Complete field configuration for a sankey chart.
 */
export interface SankeyFields {
  /** Node identification field */
  nodes: SankeyNodeField;
  /** Link fields (source, target, value) */
  links: SankeyLinkFields;
  /** Animation configuration (optional) */
  animation?: AnimationField;
}

/**
 * Visual configuration options for sankey charts.
 */
export interface SankeyVisualOptions {
  /** Width of each node in pixels */
  nodeWidth?: number;
  /** Padding between nodes in pixels */
  nodePadding?: number;
  /** Node alignment strategy */
  nodeAlignment?: "justify" | "left" | "right" | "center";
  /** Enable flow highlighting on hover */
  enableFlowHighlight?: boolean;
  /** Enable animated transitions */
  enableAnimations?: boolean;
}

/**
 * Runtime data structure for a sankey node.
 * Used when rendering the chart with processed data.
 */
export interface SankeyNode {
  /** Unique identifier for the node */
  id: string;
  /** Display name for the node */
  name: string;
  /** Optional color for the node */
  color?: string;
  /** Total incoming flow value */
  incomingValue?: number;
  /** Total outgoing flow value */
  outgoingValue?: number;
  /** Depth/level in the sankey layout */
  depth?: number;
  /** X position in the layout */
  x0?: number;
  /** X position (right edge) in the layout */
  x1?: number;
  /** Y position (top edge) in the layout */
  y0?: number;
  /** Y position (bottom edge) in the layout */
  y1?: number;
}

/**
 * Runtime data structure for a sankey link.
 * Represents a flow between two nodes.
 */
export interface SankeyLink {
  /** Source node */
  source: SankeyNode;
  /** Target node */
  target: SankeyNode;
  /** Flow value/magnitude */
  value: number;
  /** Optional color for the link */
  color?: string;
  /** Width of the link (derived from value) */
  width?: number;
  /** Y position at source */
  y0?: number;
  /** Y position at target */
  y1?: number;
}

/**
 * Complete configuration for a sankey chart.
 */
export interface SankeyConfig {
  /** Chart type identifier */
  chartType: "sankey";
  /** Field configuration */
  fields: SankeyFields;
  /** Visual options (optional) */
  visualOptions?: SankeyVisualOptions;
}

/**
 * Type guard to check if a chart configuration is a SankeyConfig.
 */
export function isSankeyConfig(config: {
  chartType: string;
}): config is SankeyConfig {
  return config.chartType === "sankey";
}
