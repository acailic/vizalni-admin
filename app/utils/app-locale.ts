import {
  defaultLocale,
  type Locale,
  parseLocaleString,
} from "@/locales/locales";

import type { ParsedUrlQuery } from "querystring";

const STORAGE_KEY = "vizualni-admin.ui-locale";

const getQueryLocale = (
  value: string | string[] | undefined
): Locale | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ? parseLocaleString(raw) : undefined;
};

export const resolveAppLocale = (
  routerLocale?: string | null,
  query?: ParsedUrlQuery
): Locale => {
  if (routerLocale) {
    return parseLocaleString(routerLocale);
  }

  const queryLocale = getQueryLocale(query?.uiLocale);
  if (queryLocale) {
    return queryLocale;
  }

  if (typeof window !== "undefined") {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (storedLocale) {
      return parseLocaleString(storedLocale);
    }
  }

  return defaultLocale;
};

export const persistAppLocale = (locale: Locale) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
};
