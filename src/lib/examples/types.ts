import type { ChartConfig } from '@/types/chart-config'
import type { ParsedDataset } from '@/types/observation'

/**
 * Localized text structure matching project's locale keys
 * - sr: Serbian Cyrillic
 * - lat: Serbian Latin
 * - en: English
 */
export interface LocalizedText {
  sr: string
  lat: string
  en: string
}

/**
 * Configuration for a single featured example chart
 */
export interface FeaturedExampleConfig {
  /** Unique identifier for the example */
  id: string
  /** Localized title */
  title: LocalizedText
  /** Localized description */
  description: LocalizedText
  /** data.gov.rs dataset ID (for reference/links) */
  datasetId: string
  /** Direct URL to CSV/JSON resource */
  resourceUrl: string
  /** Chart configuration using existing ChartConfig type */
  chartConfig: ChartConfig
}

/**
 * Loading status for example data
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * State for a single example
 */
export interface ExampleState {
  config: FeaturedExampleConfig
  dataset: ParsedDataset | null
  status: LoadingStatus
  error: Error | null
}

/**
 * Helper to get localized text
 */
export function getLocalizedText(text: LocalizedText, locale: 'sr' | 'lat' | 'en'): string {
  return text[locale] ?? text.en
}
