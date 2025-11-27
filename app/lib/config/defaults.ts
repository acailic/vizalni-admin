import { VizualniAdminConfig } from "./types";

export const DEFAULT_CONFIG: VizualniAdminConfig = {
  project: {
    name: "Vizualni Admin",
    language: "sr",
    theme: "light",
  },
  categories: {
    enabled: ["air-quality", "budget", "education"],
    featured: ["air-quality"],
  },
  datasets: {
    autoDiscovery: true,
    manualIds: {},
  },
  visualization: {
    defaultChartType: "bar",
    colorPalette: "default",
    customColors: [],
  },
  features: {
    embedding: false,
    export: true,
    sharing: true,
    tutorials: true,
  },
  deployment: {
    basePath: "/",
    customDomain: "",
    target: "local",
  },
};
