/**
 * Serbian Data Visualization Components
 *
 * This module exports all Serbian data visualization components
 * for use in vizualni-admin application.
 */

// Main chart components
export { default as SerbianBudgetChart } from "./serbian-budget-chart";
export { default as SerbianAirQualityChart } from "./serbian-air-quality-chart";
export { default as SerbianDemographicsChart } from "./serbian-demographics-chart";
export { default as SerbianEnergyChart } from "./serbian-energy-chart";

// Dashboard component
export { default as SerbianDashboard } from "./serbian-dashboard";

// Language utilities
export {
  getSerbianTranslation,
  getDatasetLabels,
  latinToCyrillic,
  formatSerbianNumber,
  formatSerbianDate,
  formatSerbianCurrency,
  isCyrillic,
  detectSerbianScript,
  serbianTranslations,
} from "./serbian-language-utils";

// Types
export type { SerbianLanguageVariant } from "./serbian-language-utils";

// Re-export dataset interfaces for convenience
export type { BudgetDataset } from "@/data/serbian-budget";
export type { Air_QualityDataset } from "@/data/serbian-air_quality";
export type { DemographicsDataset } from "@/data/serbian-demographics";
export type { EnergyDataset } from "@/data/serbian-energy";

/**
 * Usage examples:
 *
 * ```tsx
 * import { SerbianDashboard, SerbianLanguageVariant } from "@/components/serbian";
 *
 * function App() {
 *   return (
 *     <SerbianDashboard
 *       initialLanguage="sr-Latn"
 *       showInteractiveFeatures={true}
 *       height={400}
 *     />
 *   );
 * }
 * ```
 *
 * ```tsx
 * import { SerbianBudgetChart, getSerbianTranslation } from "@/components/serbian";
 *
 * function BudgetVisualization() {
 *   return (
 *     <SerbianBudgetChart
 *       language="sr-Latn"
 *       showInteractiveFeatures={true}
 *     />
 *   );
 * }
 * ```
 */
