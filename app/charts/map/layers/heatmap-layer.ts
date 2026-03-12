import { HeatmapLayer as DeckHeatmapLayer } from "@deck.gl/aggregation-layers";
import { color, RGBColor } from "d3-color";

import { GeoPoint, Observation } from "@/domain/data";

/**
 * Configuration for the heatmap layer.
 * Based on the design document specification.
 */
export interface HeatmapLayerConfig {
  type: "heatmap";
  /** Field to use for intensity/weight */
  intensity: { field: string };
  /** Radius of the heatmap influence area in pixels */
  radius?: number;
  /** Custom color scale (array of colors from low to high intensity) */
  colorScale?: string[];
  /** Opacity of the heatmap layer (0-1) */
  opacity?: number;
}

/**
 * Default color scale for heatmap visualization.
 * Goes from transparent/blue (low) to red (high intensity).
 */
export const DEFAULT_HEATMAP_COLOR_SCALE: string[] = [
  "rgba(0, 0, 255, 0)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(0, 255, 255, 0.75)",
  "rgba(0, 255, 0, 0.875)",
  "rgba(255, 255, 0, 0.9375)",
  "rgba(255, 0, 0, 1)",
];

/**
 * Default radius for the heatmap in pixels.
 */
export const DEFAULT_HEATMAP_RADIUS = 30;

/**
 * Default opacity for the heatmap layer.
 */
export const DEFAULT_HEATMAP_OPACITY = 0.8;

/**
 * Props for creating a heatmap layer.
 */
export interface HeatmapLayerProps {
  /** Unique identifier for the layer */
  id?: string;
  /** Data points to render on the heatmap */
  data: GeoPoint[];
  /** Field accessor for the intensity/weight value */
  getWeight: (d: GeoPoint) => number;
  /** Optional custom color scale */
  colorScale?: string[];
  /** Optional radius override */
  radius?: number;
  /** Optional opacity override */
  opacity?: number;
  /** Optional position accessor (defaults to GeoPoint coordinates) */
  getPosition?: (d: GeoPoint) => [number, number];
  /** Optional zoom level for zoom-dependent radius adjustment */
  zoom?: number;
  /** Flag to enable/disable intensity zoom sensitivity */
  zoomSensitivity?: boolean;
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
 * Creates a Deck.gl HeatmapLayer for visualizing density/intensity data.
 *
 * The heatmap layer visualizes the density of points weighted by a value field.
 * It uses GPU-accelerated rendering for smooth performance with large datasets.
 *
 * @example
 * ```typescript
 * const layer = createHeatmapLayer({
 *   id: "my-heatmap",
 *   data: points,
 *   getWeight: (d) => d.properties.observation?.value ?? 1,
 *   radius: 25,
 * });
 * ```
 */
export function createHeatmapLayer(
  props: HeatmapLayerProps
): DeckHeatmapLayer<GeoPoint> {
  const {
    id = "heatmapLayer",
    data,
    getWeight,
    colorScale = DEFAULT_HEATMAP_COLOR_SCALE,
    radius = DEFAULT_HEATMAP_RADIUS,
    opacity = DEFAULT_HEATMAP_OPACITY,
    zoom,
    zoomSensitivity = true,
  } = props;

  // Get position from GeoPoint coordinates by default
  const getPosition = props.getPosition ?? ((d: GeoPoint) => d.coordinates);

  // Adjust radius based on zoom level for consistent appearance
  const adjustedRadius =
    zoomSensitivity && zoom !== undefined
      ? radius * Math.pow(2, Math.max(0, zoom - 10))
      : radius;

  return new DeckHeatmapLayer<GeoPoint>({
    id,
    data,
    getPosition,
    getWeight,
    radiusPixels: Math.min(adjustedRadius, 100), // Cap max radius
    intensity: 1,
    threshold: 0.05,
    colorRange: colorScale.map(parseColorToRgb),
    opacity,
    // Enable aggregation for better performance with large datasets
    aggregation: "SUM",
  });
}

/**
 * Creates a weight accessor function for the heatmap layer.
 *
 * @param config - The heatmap layer configuration
 * @param getValue - Function to get the intensity value from an observation
 * @returns A function that returns the weight for a GeoPoint
 */
export function createHeatmapWeightAccessor(
  _config: HeatmapLayerConfig,
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
 * Creates a position accessor for GeoPoints.
 * Extracts longitude and latitude from the GeoPoint coordinates.
 */
export function getGeoPointPosition(d: GeoPoint): [number, number] {
  return [d.coordinates[0], d.coordinates[1]];
}

/**
 * Validates a heatmap layer configuration.
 */
export function validateHeatmapConfig(config: HeatmapLayerConfig): boolean {
  if (!config.intensity?.field) {
    return false;
  }

  if (
    config.radius !== undefined &&
    (config.radius <= 0 || config.radius > 200)
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
