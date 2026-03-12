/**
 * Internationalization Configuration
 *
 * Supports Serbian Cyrillic, Serbian Latin, and English
 */

import { getRequestConfig } from 'next-intl/server';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const supportedLocales = Object.values(LANGUAGES)
  const validLocale =
    locale && supportedLocales.includes(locale as (typeof supportedLocales)[number])
      ? locale
      : DEFAULT_LANGUAGE

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}.json`)).default,
    timeZone: 'Europe/Belgrade',
    now: new Date(),
  };
});
