import { SimpleMeshLayer as DeckSimpleMeshLayer } from "@deck.gl/mesh-layers";
import { color, RGBColor } from "d3-color";

import { GeoPoint, Observation } from "@/domain/data";

/**
 * Mesh data structure for 3D meshes.
 */
export interface MeshData {
  /** Position of the mesh [longitude, latitude, elevation] */
  position: [number, number, number?];
  /** Optional orientation as [yaw, pitch, roll] in radians */
  orientation?: [number, number, number];
  /** Optional scale as [x, y, z] */
  scale?: [number, number, number];
}

/**
 * Configuration for the mesh layer.
 * Based on the design document specification.
 */
export interface MeshLayerConfig {
  type: "mesh";
  /** URL to mesh data or array of mesh data points */
  data: string | MeshData[];
  /** URL to texture image for the mesh */
  texture?: string;
  /** Scale factor for elevation (0-100) */
  elevationScale?: number;
  /** Optional opacity (0-1) */
  opacity?: number;
  /** Optional wireframe mode */
  wireframe?: boolean;
  /** Optional base color for the mesh */
  color?: string;
}

/**
 * Default elevation scale factor.
 */
export const DEFAULT_MESH_ELEVATION_SCALE = 1;

/**
 * Default opacity for the mesh layer.
 */
export const DEFAULT_MESH_OPACITY = 1;

/**
 * Default color for meshes.
 */
export const DEFAULT_MESH_COLOR = "#ffffff";

/**
 * Props for creating a mesh layer.
 */
export interface MeshLayerProps<D = MeshData> {
  /** Unique identifier for the layer */
  id?: string;
  /** Data points or URL to mesh data */
  data: D[] | string;
  /** Position accessor for the mesh */
  getPosition: (d: D) => [number, number, number?];
  /** Optional orientation accessor */
  getOrientation?: (d: D) => [number, number, number];
  /** Optional scale accessor */
  getScale?: (d: D) => [number, number, number];
  /** Optional translation accessor */
  getTranslation?: (d: D) => [number, number, number];
  /** Optional transform matrix accessor */
  getTransformMatrix?: (d: D) => number[];
  /** Optional color or color accessor */
  getColor?: string | ((d: D) => [number, number, number, number]);
  /** Texture URL or image data */
  texture?: string | ImageData | HTMLImageElement;
  /** Optional opacity override */
  opacity?: number;
  /** Optional wireframe mode */
  wireframe?: boolean;
  /** Enable picking for interactivity */
  pickable?: boolean;
  /** Mesh geometry (optional - can be loaded from URL) */
  mesh?: string | object;
}

/**
 * Parses a CSS color string to an RGB array.
 * Uses d3-color for reliable parsing in both browser and Node.js environments.
 */
function parseColorToRgb(colorStr: string): [number, number, number] {
  const c = color(colorStr);
  if (!c) {
    return [255, 255, 255];
  }
  // d3-color returns RGBColor for RGB parseable colors
  const rgb = c as RGBColor;
  return [rgb.r, rgb.g, rgb.b];
}

/**
 * Creates a Deck.gl SimpleMeshLayer for 3D terrain/building mesh visualization.
 *
 * The mesh layer renders 3D meshes at specified geographic positions.
 * It's useful for visualizing terrain data, buildings, or other 3D objects
 * on the map with optional textures.
 *
 * @example
 * ```typescript
 * const layer = createMeshLayer({
 *   id: "terrain-mesh",
 *   data: meshData,
 *   getPosition: (d) => d.position,
 *   texture: "/textures/terrain.png",
 *   elevationScale: 1.5,
 * });
 * ```
 */
export function createMeshLayer<D = MeshData>(
  props: MeshLayerProps<D>
): DeckSimpleMeshLayer<D> {
  const {
    id = "meshLayer",
    data,
    getPosition,
    opacity = DEFAULT_MESH_OPACITY,
    wireframe = false,
    pickable = false,
    mesh,
    texture,
  } = props;

  // Handle color - can be a string or accessor function
  let getColorValue:
    | [number, number, number, number]
    | ((d: D) => [number, number, number, number]);
  if (props.getColor === undefined) {
    const defaultColor = parseColorToRgb(DEFAULT_MESH_COLOR);
    getColorValue = [...defaultColor, 255] as [number, number, number, number];
  } else if (typeof props.getColor === "string") {
    const parsedColor = parseColorToRgb(props.getColor);
    getColorValue = [...parsedColor, 255] as [number, number, number, number];
  } else {
    getColorValue = props.getColor;
  }

  const layerProps: Record<string, unknown> = {
    id,
    data,
    getPosition,
    getColor: getColorValue,
    opacity,
    wireframe,
    pickable,
  };

  // Add optional mesh geometry if provided
  if (mesh !== undefined) {
    layerProps.mesh = mesh;
  }

  // Add optional texture if provided
  if (texture !== undefined) {
    layerProps.texture = texture;
  }

  // Add optional accessors if provided
  if (props.getOrientation !== undefined) {
    layerProps.getOrientation = props.getOrientation;
  }

  if (props.getScale !== undefined) {
    layerProps.getScale = props.getScale;
  }

  if (props.getTranslation !== undefined) {
    layerProps.getTranslation = props.getTranslation;
  }

  if (props.getTransformMatrix !== undefined) {
    layerProps.getTransformMatrix = props.getTransformMatrix;
  }

  return new DeckSimpleMeshLayer<D>(
    layerProps as Parameters<typeof DeckSimpleMeshLayer>[0]
  );
}

/**
 * Creates a position accessor function for the mesh layer.
 *
 * @param config - The mesh layer configuration
 * @returns A function that returns the position for mesh data
 */
export function createMeshPositionAccessor(
  config: MeshLayerConfig
): (d: MeshData) => [number, number, number?] {
  return (d: MeshData): [number, number, number?] => {
    if (typeof config.data === "string") {
      // For URL-based data, return the position from the data
      return d.position;
    }
    return d.position;
  };
}

/**
 * Creates an orientation accessor function for the mesh layer.
 *
 * @returns A function that returns the orientation for mesh data
 */
export function createMeshOrientationAccessor(): (
  d: MeshData
) => [number, number, number] {
  return (d: MeshData): [number, number, number] => {
    return d.orientation ?? [0, 0, 0];
  };
}

/**
 * Creates a scale accessor function for the mesh layer.
 *
 * @param elevationScale - Scale factor for elevation
 * @returns A function that returns the scale for mesh data
 */
export function createMeshScaleAccessor(
  elevationScale: number = DEFAULT_MESH_ELEVATION_SCALE
): (d: MeshData) => [number, number, number] {
  return (d: MeshData): [number, number, number] => {
    const baseScale = d.scale ?? [1, 1, 1];
    return [baseScale[0], baseScale[1], baseScale[2] * elevationScale];
  };
}

/**
 * Creates a color accessor function for the mesh layer.
 *
 * @param config - The mesh layer configuration
 * @returns A function that returns the color for mesh data
 */
export function createMeshColorAccessor(
  config: MeshLayerConfig
): (d: MeshData) => [number, number, number, number] {
  const baseColor = config.color ?? DEFAULT_MESH_COLOR;
  const parsedColor = parseColorToRgb(baseColor);

  return (): [number, number, number, number] => {
    return [...parsedColor, 255] as [number, number, number, number];
  };
}

/**
 * Creates mesh data from GeoPoints with elevation values.
 *
 * @param points - Array of GeoPoints with elevation data
 * @param getElevation - Function to extract elevation from a GeoPoint
 * @returns Array of MeshData objects
 */
export function createMeshDataFromGeoPoints(
  points: GeoPoint[],
  getElevation: (d: GeoPoint) => number
): MeshData[] {
  return points.map((point) => ({
    position: [
      point.coordinates[0],
      point.coordinates[1],
      getElevation(point),
    ] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    orientation: [0, 0, 0] as [number, number, number],
  }));
}

/**
 * Creates an elevation accessor for GeoPoints to use with mesh layer.
 *
 * @param getValue - Function to get the elevation value from an observation
 * @returns A function that returns the elevation for a GeoPoint
 */
export function createMeshElevationAccessor(
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
 * Extracts position from GeoPoint for mesh rendering.
 */
export function getGeoPointMeshPosition(
  d: GeoPoint
): [number, number, number?] {
  return [d.coordinates[0], d.coordinates[1], 0];
}

/**
 * Validates a mesh layer configuration.
 */
export function validateMeshConfig(config: MeshLayerConfig): boolean {
  // Data must be defined (either URL or array)
  if (!config.data) {
    return false;
  }

  // If data is an array, it must not be empty
  if (Array.isArray(config.data) && config.data.length === 0) {
    return false;
  }

  // Elevation scale must be positive and reasonable
  if (
    config.elevationScale !== undefined &&
    (config.elevationScale <= 0 || config.elevationScale > 100)
  ) {
    return false;
  }

  // Opacity must be between 0 and 1
  if (
    config.opacity !== undefined &&
    (config.opacity < 0 || config.opacity > 1)
  ) {
    return false;
  }

  // Color must be a valid CSS color if provided
  if (config.color !== undefined) {
    const parsedColor = color(config.color);
    if (!parsedColor) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a default mesh layer configuration with sensible defaults.
 */
export function createDefaultMeshConfig(): MeshLayerConfig {
  return {
    type: "mesh",
    data: [],
    elevationScale: DEFAULT_MESH_ELEVATION_SCALE,
    opacity: DEFAULT_MESH_OPACITY,
    color: DEFAULT_MESH_COLOR,
  };
}
