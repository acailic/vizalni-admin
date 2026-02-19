/**
 * A single data point - a record of arbitrary values
 */
export type Datum = Record<string, unknown>;

/**
 * Field type enumeration
 */
export type FieldType = "string" | "number" | "date" | "boolean";

/**
 * Schema for a single field/column
 */
export interface Field {
  /** Field name/key in data */
  name: string;
  /** Data type */
  type: FieldType;
  /** Human-readable title */
  title?: string;
  /** Description */
  description?: string;
}

/**
 * Schema describing data structure
 */
export interface DataSchema {
  fields: Field[];
}

/**
 * Chart data with schema
 */
export interface ChartData {
  /** Array of data records */
  data: Datum[];
  /** Schema describing the data */
  schema: DataSchema;
}

/**
 * Margin dimensions
 */
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Rectangle dimensions
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Chart dimensions
 */
export interface Dimensions {
  /** Total width */
  width: number;
  /** Total height */
  height: number;
  /** Margins */
  margins: Margins;
  /** Chart area (excluding margins) */
  chartArea: Rect;
}

// =============================================================================
// Shape Types - Rendering instructions for different chart elements
// =============================================================================

/**
 * Base properties for all shapes
 */
export interface BaseShape {
  /** Shape type identifier */
  type: string;
  /** Original data point (for interactivity) */
  datum?: Datum;
  /** Index in data array */
  index: number;
  /** Fill color */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Line shape for line charts
 */
export interface LineShape extends BaseShape {
  type: "line";
  /** SVG path definition */
  path: string;
  /** Segment/category this line represents */
  segment?: string;
}

/**
 * Bar shape for bar charts
 */
export interface BarShape extends BaseShape {
  type: "bar";
  /** Bar position and dimensions */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Category this bar represents */
  category?: string;
}

/**
 * Arc shape for pie/donut charts
 */
export interface ArcShape extends BaseShape {
  type: "arc";
  /** SVG path definition */
  path: string;
  /** Center x position */
  cx: number;
  /** Center y position */
  cy: number;
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Category this arc represents */
  category?: string;
  /** Value this arc represents */
  value: number;
}

/**
 * Dot shape for scatter plots and line chart markers
 */
export interface DotShape extends BaseShape {
  type: "dot";
  /** Center x position */
  cx: number;
  /** Center y position */
  cy: number;
  /** Radius */
  r: number;
}

/**
 * Union of all shape types
 */
export type Shape = LineShape | BarShape | ArcShape | DotShape;
