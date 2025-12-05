import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { PropsWithChildren, useEffect, useState } from "react";

import { Locale } from "@/locales/locales";

const localeImportMap: Record<Locale, string> = {
  en: "enGB",
  "sr-Latn": "srLatn",
  "sr-Cyrl": "sr",
};

type AsyncLocalizationProviderProps = {
  locale: Locale;
};

// Simple fallback locale object that works during SSR
const fallbackLocale = {
  code: "en-GB",
};

export const AsyncLocalizationProvider = (
  props: PropsWithChildren<AsyncLocalizationProviderProps>
) => {
  const { locale, children } = props;
  const [dateFnsLocale, setDateFnsLocale] = useState<object | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const run = async () => {
      try {
        const importKey = localeImportMap[locale];
        const locales = await import("date-fns/locale");
        const localeData = importKey
          ? (locales as any)[importKey] || (locales as any).enGB
          : (locales as any).enGB;
        setDateFnsLocale(localeData);
      } catch (error) {
        console.error("Failed to load date-fns locale:", error);
      }
    };

    run();
  }, [locale, isClient]);

  // During SSR, render children without LocalizationProvider
  // This avoids hydration mismatches
  if (!isClient) {
    return <>{children}</>;
  }

  // On client, wrap with LocalizationProvider if locale is loaded
  if (dateFnsLocale) {
    return (
      <LocalizationProvider dateAdapter={DateAdapter} locale={dateFnsLocale}>
        {children}
      </LocalizationProvider>
    );
  }

  // Loading state - just render children
  return <>{children}</>;
};
