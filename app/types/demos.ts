/**
 * Shared demo types and locale helpers.
 */

export const DEMO_LOCALES = ['sr', 'en'] as const;

export type DemoLocale = typeof DEMO_LOCALES[number];

export const DEFAULT_DEMO_LOCALE: DemoLocale = 'sr';

export type LocaleContent<T> = {
  [Locale in DemoLocale]: T;
};

export const isDemoLocale = (value: unknown): value is DemoLocale =>
  typeof value === 'string' && (DEMO_LOCALES as readonly string[]).includes(value);

export type DemoChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'area'
  | 'pie'
  | 'map'
  | 'scatterplot';

export interface DemoDatasetInfo {
  title?: string;
  organization?: string;
  updatedAt?: string;
}

export interface DemoConfig {
  id: string;
  title: LocaleContent<string>;
  description: LocaleContent<string>;
  searchQuery: string;
  chartType: DemoChartType;
  defaultDatasetId?: string;
  tags?: string[];
  icon: string;
}

export type DemoTranslationMap<T extends Record<string, LocaleContent<unknown>>> = T;
