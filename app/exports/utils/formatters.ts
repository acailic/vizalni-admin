/**
 * Formatting Utilities
 *
 * Functions for formatting numbers, dates, and other values
 * for Serbian locale and other supported locales.
 */

import { getD3FormatLocale, type Locale } from "../core";

// Cache for format locales
const formatLocaleCache = new Map<
  Locale,
  ReturnType<typeof getD3FormatLocale>
>();

/**
 * Format a number with thousand separators and decimal places
 */
export function formatNumber(
  value: number,
  locale: Locale = "sr-Latn",
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;

  // Get or create format locale
  let fmt = formatLocaleCache.get(locale);
  if (!fmt) {
    fmt = getD3FormatLocale();
    formatLocaleCache.set(locale, fmt);
  }

  const format = fmt.format(`,.${maximumFractionDigits}f`);
  return format(value);
}

/**
 * Format a number as currency (RSD - Serbian Dinar)
 */
export function formatCurrency(
  value: number,
  locale: Locale = "sr-Latn",
  options: {
    symbol?: string;
    decimals?: number;
  } = {}
): string {
  const { symbol = "RSD", decimals = 2 } = options;

  const formatted = formatNumber(value, locale, {
    maximumFractionDigits: decimals,
  });

  // Serbian format: RSD 1.234,56
  return `${symbol} ${formatted}`;
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  locale: Locale = "sr-Latn",
  options: {
    decimals?: number;
    multiply?: boolean;
  } = {}
): string {
  const { decimals = 1, multiply = true } = options;

  const displayValue = multiply ? value * 100 : value;
  const formatted = formatNumber(displayValue, locale, {
    maximumFractionDigits: decimals,
  });

  return `${formatted}%`;
}

/**
 * Format a date using Intl.DateTimeFormat
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale = "sr-Latn",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
): string {
  const dateObj = typeof date === "object" ? date : new Date(date);

  // Map locale to Intl locale
  const intlLocale =
    locale === "sr-Cyrl"
      ? "sr-Cyrl-RS"
      : locale === "sr-Latn"
      ? "sr-Latn-RS"
      : "en-US";

  return new Intl.DateTimeFormat(intlLocale, options).format(dateObj);
}

/**
 * Format a date and time
 */
export function formatDateTime(
  date: Date | string | number,
  locale: Locale = "sr-Latn"
): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a file size
 */
export function formatFileSize(
  bytes: number,
  locale: Locale = "sr-Latn"
): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, locale, { maximumFractionDigits: 1 })} ${
    units[unitIndex]
  }`;
}

/**
 * Format a duration in milliseconds to human-readable format
 */
export function formatDuration(
  milliseconds: number,
  locale: Locale = "sr-Latn"
): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix = "..."
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}
