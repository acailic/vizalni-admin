import type { Locale } from '@/lib/i18n/config'
import type { ChartConfig } from '@/types/chart-config'
import type { ParsedDataset } from '@/types/observation'

/**
 * Localized text structure with shorthand locale keys
 * Used for storing localized strings in configuration files
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
 * Mapping from canonical Locale to LocalizedText shorthand keys
 */
const LOCALE_TO_KEY: Record<Locale, keyof LocalizedText> = {
  'sr-Cyrl': 'sr',
  'sr-Latn': 'lat',
  en: 'en',
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
 * Helper to get localized text from canonical Locale
 * Falls back to English if the localized value is empty
 */
export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  const key = LOCALE_TO_KEY[locale]
  const value = text[key]
  // Fall back to English if the value is empty or undefined
  return value || text.en
}
