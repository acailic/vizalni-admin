import { useRouter } from "next/router";
import { useMemo } from "react";

import {
  DEFAULT_DEMO_LOCALE,
  DemoLocale,
  LocaleContent,
  isDemoLocale,
} from "@/types/demos";
import { resolveAppLocale } from "@/utils/app-locale";

interface LocaleOptions {
  fallback?: DemoLocale;
}

export function useDemoLocale(options?: LocaleOptions) {
  const { locale: routerLocale, query } = useRouter();
  const { fallback = DEFAULT_DEMO_LOCALE } = options ?? {};

  return useMemo<DemoLocale>(() => {
    // Use resolveAppLocale to handle both router locale and query param uiLocale
    const resolvedLocale = resolveAppLocale(routerLocale, query);
    if (isDemoLocale(resolvedLocale)) {
      return resolvedLocale;
    }
    return fallback;
  }, [routerLocale, query, fallback]);
}

type TranslationResult<T extends Record<string, LocaleContent<unknown>>> = {
  [K in keyof T]: T[K][DemoLocale];
};

export function useDemoTranslations<
  T extends Record<string, LocaleContent<unknown>>,
>(translations: T, options?: { locale?: DemoLocale }): TranslationResult<T> {
  const contextLocale = useDemoLocale();
  const targetLocale = options?.locale ?? contextLocale;

  return useMemo(() => {
    return Object.keys(translations).reduce((acc, key) => {
      const typedKey = key as keyof T;
      acc[typedKey] = translations[typedKey][
        targetLocale
      ] as TranslationResult<T>[typeof typedKey];
      return acc;
    }, {} as TranslationResult<T>);
  }, [targetLocale, translations]);
}

export function useLocaleValue<T>(
  content: LocaleContent<T>,
  options?: { locale?: DemoLocale }
): T {
  const contextLocale = useDemoLocale();
  const targetLocale = options?.locale ?? contextLocale;
  return content[targetLocale];
}
