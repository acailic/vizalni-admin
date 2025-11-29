// Basic configuration types for the visualization tool

export interface ChartConfig {
  id: string;
  type: string;
  title?: string;
  cube: string;
  dimensions: Record<string, any>;
  measures: Record<string, any>;
  filters?: Record<string, any>;
  visualization?: Record<string, any>;
  [key: string]: any;
}

export interface ConfiguratorState {
  chart: ChartConfig;
  selectedDimensions: string[];
  selectedMeasures: string[];
  filters: Record<string, any>;
  step: number;
  isValid: boolean;
  [key: string]: any;
}

export interface LineConfig extends ChartConfig {
  type: 'line';
  xAxis: string;
  yAxis: string;
  color?: string;
  strokeWidth?: number;
}

export type PaletteType = 'sequential' | 'diverging' | 'categorical';
export type SequentialPaletteType = 'blues' | 'reds' | 'greens' | 'purples' | 'oranges';
export type DivergingPaletteType = 'rdbu' | 'rdylgn' | 'spectral';
export type AnimationType = 'none' | 'fade' | 'slide' | 'bounce' | 'scale';

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning' | 'info';
}

export type Language = "sr" | "en";
export type ThemeMode = "light" | "dark" | "custom";
export type ChartType = "bar" | "line" | "area" | "pie" | "map" | "table";
export type DeploymentTarget = "local" | "github-pages" | "custom";

export interface ProjectConfig {
  name: string;
  language: Language;
  theme: ThemeMode;
}

export interface CategoriesConfig {
  enabled: string[];
  featured: string[];
}

export interface DatasetsConfig {
  autoDiscovery: boolean;
  manualIds: Record<string, string[]>;
}

export interface VisualizationConfig {
  defaultChartType: ChartType;
  colorPalette: string;
  customColors: string[];
}

export interface FeaturesConfig {
  embedding: boolean;
  export: boolean;
  sharing: boolean;
  tutorials: boolean;
}

export interface DeploymentConfig {
  basePath: string;
  customDomain: string;
  target: DeploymentTarget;
}

export interface VizualniAdminConfig {
  project: ProjectConfig;
  categories: CategoriesConfig;
  datasets: DatasetsConfig;
  visualization: VisualizationConfig;
  features: FeaturesConfig;
  deployment: DeploymentConfig;
}

// Validation functions
export const decodeChartConfig = (config: unknown): ChartConfig => {
  if (typeof config === 'object' && config !== null && 'id' in config) {
    return config as ChartConfig;
  }
  throw new Error('Invalid ChartConfig');
};

export const decodeConfiguratorState = (state: unknown): ConfiguratorState => {
  if (typeof state === 'object' && state !== null && 'chart' in state) {
    return state as ConfiguratorState;
  }
  throw new Error('Invalid ConfiguratorState');
};