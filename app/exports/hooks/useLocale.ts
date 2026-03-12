/**
 * useLocale Hook
 *
 * React hook for managing application locale.
 *
 * @example
 * ```tsx
 * import { useLocale } from '@acailic/vizualni-admin/hooks';
 *
 * function MyComponent() {
 *   const { locale, setLocale, locales, isRtl } = useLocale();
 *
 *   return (
 *     <div>
 *       <select value={locale} onChange={(e) => setLocale(e.target.value)}>
 *         {locales.map((l) => <option key={l} value={l}>{l}</option>)}
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useEffect } from "react";

import {
  i18n,
  locales,
  defaultLocale,
  parseLocaleString,
  type Locale,
  getD3TimeFormatLocale,
  getD3FormatLocale as getD3FormatLocaleUtil,
} from "../core";

export interface UseLocaleResult {
  /** Current locale */
  locale: Locale;
  /** All available locales */
  locales: Locale[];
  /** Default locale */
  defaultLocale: Locale;
  /** Set locale */
  setLocale: (locale: Locale) => void;
  /** Parse locale string */
  parseLocale: (localeString: string) => Locale;
  /** Whether current locale is RTL */
  isRtl: boolean;
  /** Get D3 time format locale */
  getD3TimeLocale: () => any;
  /** Get D3 format locale */
  getD3FormatLocale: () => any;
}

export function useLocale(initialLocale?: Locale): UseLocaleResult {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || defaultLocale
  );

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    i18n.activate(newLocale);
  }, []);

  const parseLocale = useCallback((localeString: string): Locale => {
    return parseLocaleString(localeString);
  }, []);

  const isRtl = useCallback(() => {
    // Currently none of the supported locales are RTL
    // This is prepared for future RTL support (e.g., Arabic)
    return false;
  }, [locale]);

  const getD3TimeLocale = useCallback(() => {
    return getD3TimeFormatLocale(locale);
  }, [locale]);

  const getD3FormatLocale = useCallback(() => {
    return getD3FormatLocaleUtil();
  }, []);

  // Activate locale on mount
  useEffect(() => {
    i18n.activate(locale);
  }, [locale]);

  return {
    locale,
    locales: locales as any,
    defaultLocale,
    setLocale,
    parseLocale,
    isRtl: isRtl(),
    getD3TimeLocale,
    getD3FormatLocale,
  };
}
