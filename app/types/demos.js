/**
 * Shared demo types and locale helpers.
 */
export const DEMO_LOCALES = ['sr', 'en'];
export const DEFAULT_DEMO_LOCALE = 'sr';
export const isDemoLocale = (value) => typeof value === 'string' && DEMO_LOCALES.includes(value);
