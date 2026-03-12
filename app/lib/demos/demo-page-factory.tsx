/**
 * Factory utility for creating consistent demo pages
 * Reduces boilerplate across demo category pages
 */

import { useRouter } from "next/router";
import { ReactNode } from "react";

import type { DemoConfig, DemoLocale } from "@/types/demos";
import { resolveAppLocale } from "@/utils/app-locale";

export interface DemoPageConfig {
  demoId: string;
  customContent?: ReactNode;
  showStats?: boolean;
  showLivePanel?: boolean;
}

export interface DemoPageText {
  title: string;
  description: string;
}

/**
 * Hook to get locale-aware text for demo pages
 */
export function useDemoPageText(
  _demoId: string,
  config: DemoConfig
): DemoPageText {
  const locale = useDemoLocale();

  return {
    title: config.title[locale],
    description: config.description[locale],
  };
}

/**
 * Hook to get current demo locale
 */
export function useDemoLocale(): DemoLocale {
  const { locale: routerLocale, query } = useRouter();
  const resolvedLocale = resolveAppLocale(routerLocale, query);
  return resolvedLocale?.startsWith("sr") ? "sr" : "en";
}

/**
 * Format a number for display in demo cards
 */
export function formatDemoNumber(
  value: number,
  locale: DemoLocale,
  options?: Intl.NumberFormatOptions
): string {
  return value.toLocaleString(locale === "sr" ? "sr-RS" : "en-US", options);
}

/**
 * Get locale-aware label from a record
 */
export function getLocaleLabel<T>(
  record: Record<string, T>,
  locale: DemoLocale,
  fallbackKey: string = "en"
): T | undefined {
  return record[locale] ?? record[fallbackKey];
}
