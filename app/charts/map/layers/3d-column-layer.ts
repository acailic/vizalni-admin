import { ColumnLayer as DeckColumnLayer } from "@deck.gl/layers";
import { color, RGBColor } from "d3-color";

import { GeoPoint, Observation } from "@/domain/data";

/**
 * Configuration for the 3D column layer.
 * Based on the design document specification.
 */
export interface Map3DConfig {
  /** Enable 3D rendering */
  enable3D: boolean;
  /** Scale factor for elevation */
  elevationScale: number;
  /** Optional terrain source URL */
  terrainSource?: string;
}

/**
 * Configuration for the 3D column layer.
 */
export interface Column3DLayerConfig {
  type: "3d-column";
  /** Field to use for elevation/height */
  height: { field: string };
  /** Scale factor for column height (0-100) */
  elevationScale?: number;
  /** Radius of each column in meters */
  radius?: number;
  /** Color for columns (CSS color string) */
  color?: string;
  /** Opacity of the columns (0-1) */
  opacity?: number;
}

/**
 * Default radius for columns in meters.
 */
export const DEFAULT_COLUMN_RADIUS = 1000;

/**
 * Default elevation scale factor.
 */
export const DEFAULT_ELEVATION_SCALE = 1;

/**
 * Default color for columns.
 */
export const DEFAULT_COLUMN_COLOR = "#4a90d9";

/**
 * Default opacity for the column layer.
 */
export const DEFAULT_COLUMN_OPACITY = 0.8;

/**
 * Default disk resolution (number of sides for the column).
 */
export const DEFAULT_DISK_RESOLUTION = 20;

/**
 * Props for creating a 3D column layer.
 */
export interface Column3DLayerProps {
  /** Unique identifier for the layer */
  id?: string;
  /** Data points to render as columns */
  data: GeoPoint[];
  /** Field accessor for the elevation/height value */
  getElevation: (d: GeoPoint) => number;
  /** Optional custom color or color accessor */
  getColor?: string | ((d: GeoPoint) => [number, number, number]);
  /** Optional radius in meters */
  radius?: number;
  /** Optional elevation scale override */
  elevationScale?: number;
  /** Optional opacity override */
  opacity?: number;
  /** Optional position accessor (defaults to GeoPoint coordinates) */
  getPosition?: (d: GeoPoint) => [number, number];
  /** Number of sides for the column disk */
  diskResolution?: number;
  /** Enable extrusion for 3D effect */
  extruded?: boolean;
  /** Enable picking for interactivity */
  pickable?: boolean;
  /** Wireframe rendering */
  wireframe?: boolean;
}

/**
 * Parses a CSS color string to an RGB array.
 * Uses d3-color for reliable parsing in both browser and Node.js environments.
 */
function parseColorToRgb(colorStr: string): [number, number, number] {
  const c = color(colorStr);
  if (!c) {
    return [0, 0, 0];
  }
  // d3-color returns RGBColor for RGB parseable colors
  const rgb = c as RGBColor;
  return [rgb.r, rgb.g, rgb.b];
}

/**
 * Creates a Deck.gl ColumnLayer for 3D extruded column visualization.
 *
 * The column layer renders cylinders/columns at specified geographic positions
 * with height based on data values. It's useful for visualizing quantitative
 * data at point locations, such as population, sales, or measurements.
 *
 * @example
 * ```typescript
 * const layer = create3DColumnLayer({
 *   id: "my-3d-columns",
 *   data: points,
 *   getElevation: (d) => d.properties.observation?.value ?? 0,
 *   elevationScale: 1000,
 *   radius: 500,
 * });
 * ```
 */
export function create3DColumnLayer(
  props: Column3DLayerProps
): DeckColumnLayer<GeoPoint> {
  const {
    id = "column3DLayer",
    data,
    getElevation,
    radius = DEFAULT_COLUMN_RADIUS,
    elevationScale = DEFAULT_ELEVATION_SCALE,
    opacity = DEFAULT_COLUMN_OPACITY,
    diskResolution = DEFAULT_DISK_RESOLUTION,
    extruded = true,
    pickable = true,
    wireframe = false,
  } = props;

  // Get position from GeoPoint coordinates by default
  const getPosition = props.getPosition ?? ((d: GeoPoint) => d.coordinates);

  // Handle color - can be a string or accessor function
  let getColorAccessor: (d: GeoPoint) => [number, number, number, number];
  if (props.getColor === undefined) {
    const defaultColor = parseColorToRgb(DEFAULT_COLUMN_COLOR);
    getColorAccessor = () =>
      [...defaultColor, 255] as [number, number, number, number];
  } else if (typeof props.getColor === "string") {
    const parsedColor = parseColorToRgb(props.getColor);
    getColorAccessor = () =>
      [...parsedColor, 255] as [number, number, number, number];
  } else {
    getColorAccessor = (d: GeoPoint) => {
      const rgb = props.getColor!(d);
      return [...rgb, 255] as [number, number, number, number];
    };
  }

  return new DeckColumnLayer<GeoPoint>({
    id,
    data,
    getPosition,
    getElevation,
    getFillColor: getColorAccessor,
    radius,
    elevationScale,
    opacity,
    diskResolution,
    extruded,
    pickable,
    wireframe,
  });
}

/**
 * Creates an elevation accessor function for the column layer.
 *
 * @param config - The column layer configuration
 * @param getValue - Function to get the height value from an observation
 * @returns A function that returns the elevation for a GeoPoint
 */
export function createColumnElevationAccessor(
  _config: Column3DLayerConfig,
  getValue: (d: Observation) => number | null
): (d: GeoPoint) => number {
  return (d: GeoPoint): number => {
    const { observation } = d.properties;
    if (!observation) {
      return 0;
    }
    const value = getValue(observation);
    return value ?? 0;
  };
}

/**
 * Creates a color accessor function for the column layer.
 *
 * @param colorScale - Function to map values to colors
 * @param getValue - Function to get the value from an observation
 * @returns A function that returns the color for a GeoPoint
 */
export function createColumnColorAccessor(
  colorScale: (value: number) => string,
  getValue: (d: Observation) => number | null
): (d: GeoPoint) => [number, number, number] {
  return (d: GeoPoint): [number, number, number] => {
    const { observation } = d.properties;
    if (!observation) {
      return parseColorToRgb("#cccccc");
    }
    const value = getValue(observation);
    if (value === null) {
      return parseColorToRgb("#cccccc");
    }
    return parseColorToRgb(colorScale(value));
  };
}

/**
 * Creates a position accessor for GeoPoints.
 * Extracts longitude and latitude from the GeoPoint coordinates.
 */
export function getGeoPointPosition3D(d: GeoPoint): [number, number] {
  return [d.coordinates[0], d.coordinates[1]];
}

/**
 * Validates a 3D column layer configuration.
 */
export function validateColumn3DConfig(config: Column3DLayerConfig): boolean {
  if (!config.height?.field) {
    return false;
  }

  if (
    config.elevationScale !== undefined &&
    (config.elevationScale <= 0 || config.elevationScale > 10000)
  ) {
    return false;
  }

  if (
    config.radius !== undefined &&
    (config.radius <= 0 || config.radius > 100000)
  ) {
    return false;
  }

  if (
    config.opacity !== undefined &&
    (config.opacity < 0 || config.opacity > 1)
  ) {
    return false;
  }

  return true;
}

/**
 * Creates a default 3D configuration with sensible defaults.
 */
export function createDefaultMap3DConfig(): Map3DConfig {
  return {
    enable3D: true,
    elevationScale: DEFAULT_ELEVATION_SCALE,
  };
}
