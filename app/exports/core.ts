/**
 * Core Exports for @acailic/vizualni-admin/core
 *
 * Exports locale utilities, configuration types, and validation.
 * These are pure JavaScript/TypeScript utilities with no React dependencies.
 */

// Locale utilities
export {
  defaultLocale,
  locales,
  parseLocaleString,
  i18n,
} from "../locales/locales";
export { getD3TimeFormatLocale, getD3FormatLocale } from "../locales/locales";
export type { Locale } from "../locales/locales";

// Configuration types and validation
export { validateConfig } from "../lib/config/validator";
export { DEFAULT_CONFIG } from "../lib/config/defaults";
export type { VizualniAdminConfig } from "../lib/config/types";
export type { ValidationIssue } from "../lib/config/validator";

// Re-export all config-types for convenience
export * from "../config-types";
