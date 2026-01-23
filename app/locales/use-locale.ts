import { createContext, useContext } from "react";

import { defaultLocale, Locale, locales } from "./locales";

const LocaleContext = createContext<Locale | null>(null);

export const LocaleProvider = LocaleContext.Provider;

export const useLocale = () => {
  const locale = useContext(LocaleContext);
  // Provide fallback to defaultLocale during SSR/static generation
  return locale ?? defaultLocale;
};

/** Returns ordered locales, with the current locale being first. */
export const useOrderedLocales = () => {
  const locale = useLocale();
  return [locale, ...locales.filter((l) => l !== locale)];
};
