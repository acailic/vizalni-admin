/**
 * TypeScript types for treemap chart configuration.
 * These types define the configuration schema for treemap charts.
 */

export type TreemapTileType = "squarify" | "slice" | "dice" | "sliceDice";

export interface TreemapFields {
  x: {
    componentId: string;
    type: "nominal";
  };
  y: {
    componentId: string;
    type: "quantitative";
  };
  segment?: {
    componentId: string;
  };
  tile?: TreemapTileType;
}

export interface TreemapConfig {
  chartType: "treemap";
  fields: TreemapFields;
}
