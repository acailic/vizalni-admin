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
