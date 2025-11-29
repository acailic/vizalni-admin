// Basic type definitions to satisfy TypeScript migration
export interface Observation {
  value: ObservationValue;
  dimensions: Record<string, DimensionValue>;
}

export type ObservationValue = string | number | boolean | null;

export interface DimensionValue {
  value: string;
  label?: string;
  hierarchy?: HierarchyValue[];
}

export interface HierarchyValue {
  value: string;
  label: string;
  identifier: string;
  position: number;
}

export interface RawObservation {
  [key: string]: any;
}

export interface SearchCube {
  identifier: string;
  label: string;
  description?: string;
}

export interface DataCubeComponents {
  dimensions: DimensionValue[];
  measures: Measure[];
}

export interface DataCubeMetadata {
  identifier: string;
  label: string;
  description?: string;
  components: DataCubeComponents;
  publisher?: string;
  issued?: string;
  modified?: string;
}

export interface DataCubeObservations {
  data: Observation[];
  totalCount: number;
}

export interface DataCubePreview {
  metadata: DataCubeMetadata;
  observations: DataCubeObservations;
}

export interface Termset {
  identifier: string;
  label: string;
  terms: HierarchyValue[];
}

export interface ComponentTermsets {
  dimensions: Record<string, Termset>;
  measures: Record<string, Termset>;
}

export interface GeoShapes {
  type: string;
  features: any[];
}

export interface Measure {
  identifier: string;
  label: string;
  dataType: string;
}

// Helper functions
export const isMeasure = (value: any): value is Measure => {
  return value && typeof value === 'object' && 'identifier' in value && 'label' in value;
};