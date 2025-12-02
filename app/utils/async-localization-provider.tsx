import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { PropsWithChildren, useEffect, useState } from "react";

import { Locale } from "@/locales/locales";

const localeImportMap: Record<Locale, string> = {
  en: "en-GB",
  "sr-Latn": "sr-Latn",
  "sr-Cyrl": "sr",
};

type AsyncLocalizationProviderProps = {
  locale: Locale;
};

export const AsyncLocalizationProvider = (
  props: PropsWithChildren<AsyncLocalizationProviderProps>
) => {
  const { locale, children } = props;
  const [dateFnsLocale, setDateFnsLocale] = useState<object>();

  useEffect(() => {
    const run = async () => {
      const importKey = localeImportMap[locale];

      if (!importKey) {
        console.warn(`Missing date-fns locale for "${locale}", falling back to en-GB.`);
        const { enGB } = await import("date-fns/locale");
        setDateFnsLocale(enGB);
        return;
      }

      // Import locale from date-fns v3
      const locales = await import("date-fns/locale");
      const localeKey = importKey.replace(/-/g, "");
      const localeData = (locales as any)[localeKey] || (locales as any).enGB;
      setDateFnsLocale(localeData);
    };

    run();
  }, [locale]);

  if (!dateFnsLocale) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter} locale={dateFnsLocale}>
      {children}
    </LocalizationProvider>
  );
};
