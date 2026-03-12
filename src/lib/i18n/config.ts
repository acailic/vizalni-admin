/**
 * Internationalization Configuration
 *
 * Configuration for bilingual support (Serbian Cyrillic, Serbian Latin, English)
 */

import { Pathnames, LocalePrefix } from 'next-intl/routing'

export const locales = ['sr-Cyrl', 'sr-Latn', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'sr-Cyrl'

export const localeNames: Record<Locale, { name: string; nativeName: string; script: string }> = {
  'sr-Cyrl': {
    name: 'Serbian (Cyrillic)',
    nativeName: 'Српски (ћирилица)',
    script: 'Cyrillic',
  },
  'sr-Latn': {
    name: 'Serbian (Latin)',
    nativeName: 'Srpski (latinski)',
    script: 'Latin',
  },
  en: {
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
  },
}

export const localePrefix: LocalePrefix<typeof locales> = 'always'

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/datasets': {
    'sr-Cyrl': '/skupovi-podataka',
    'sr-Latn': '/skupovi-podataka',
    en: '/datasets',
  },
  '/datasets/[id]': {
    'sr-Cyrl': '/skupovi-podataka/[id]',
    'sr-Latn': '/skupovi-podataka/[id]',
    en: '/datasets/[id]',
  },
  '/organizations': {
    'sr-Cyrl': '/organizacije',
    'sr-Latn': '/organizacije',
    en: '/organizations',
  },
  '/organizations/[id]': {
    'sr-Cyrl': '/organizacije/[id]',
    'sr-Latn': '/organizacije/[id]',
    en: '/organizations/[id]',
  },
  '/topics': {
    'sr-Cyrl': '/teme',
    'sr-Latn': '/teme',
    en: '/topics',
  },
  '/topics/[slug]': {
    'sr-Cyrl': '/teme/[slug]',
    'sr-Latn': '/teme/[slug]',
    en: '/topics/[slug]',
  },
  '/search': {
    'sr-Cyrl': '/pretraga',
    'sr-Latn': '/pretraga',
    en: '/search',
  },
  '/browse': {
    'sr-Cyrl': '/pregledaj',
    'sr-Latn': '/pregledaj',
    en: '/browse',
  },
  '/browse/[id]': {
    'sr-Cyrl': '/pregledaj/[id]',
    'sr-Latn': '/pregledaj/[id]',
    en: '/browse/[id]',
  },
  '/about': {
    'sr-Cyrl': '/o-nama',
    'sr-Latn': '/o-nama',
    en: '/about',
  },
  '/api': {
    'sr-Cyrl': '/api-dokumentacija',
    'sr-Latn': '/api-dokumentacija',
    en: '/api',
  },
  '/contact': {
    'sr-Cyrl': '/kontakt',
    'sr-Latn': '/kontakt',
    en: '/contact',
  },
}

/**
 * Get locale from Accept-Language header
 */
export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';')
    return (code ?? '').toLowerCase()
  })

  // Check for Serbian Cyrillic
  if (languages.some(lang => lang.startsWith('sr') && lang.includes('cyr'))) {
    return 'sr-Cyrl'
  }

  // Check for Serbian Latin
  if (languages.some(lang => lang.startsWith('sr') && lang.includes('lat'))) {
    return 'sr-Latn'
  }

  // Check for Serbian (default to Cyrillic)
  if (languages.some(lang => lang.startsWith('sr'))) {
    return 'sr-Cyrl'
  }

  // Check for English
  if (languages.some(lang => lang.startsWith('en'))) {
    return 'en'
  }

  return defaultLocale
}

/**
 * Get language direction (for RTL support in future)
 */
export function getDirection(_locale: Locale): 'ltr' | 'rtl' {
  // All currently supported locales are LTR
  return 'ltr'
}

/**
 * Get font configuration for locale
 */
export function getFontConfig(locale: Locale) {
  const fonts = {
    'sr-Cyrl': {
      family: 'Roboto',
      subsets: ['cyrillic', 'cyrillic-ext'] as const,
    },
    'sr-Latn': {
      family: 'Roboto',
      subsets: ['latin', 'latin-ext'] as const,
    },
    en: {
      family: 'Roboto',
      subsets: ['latin'] as const,
    },
  }

  return fonts[locale]
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    'sr-Cyrl': 'sr-Cyrl-RS',
    'sr-Latn': 'sr-Latn-RS',
    en: 'en-US',
  }

  return new Intl.NumberFormat(localeMap[locale]).format(value)
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }

  const localeMap: Record<Locale, string> = {
    'sr-Cyrl': 'sr-Cyrl-RS',
    'sr-Latn': 'sr-Latn-RS',
    en: 'en-US',
  }

  return new Intl.DateTimeFormat(localeMap[locale], defaultOptions).format(d)
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const localeMap: Record<Locale, string> = {
    'sr-Cyrl': 'sr-Cyrl-RS',
    'sr-Latn': 'sr-Latn-RS',
    en: 'en-US',
  }

  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], { numeric: 'auto' })

  if (years > 0) return rtf.format(-years, 'year')
  if (months > 0) return rtf.format(-months, 'month')
  if (days > 0) return rtf.format(-days, 'day')
  if (hours > 0) return rtf.format(-hours, 'hour')
  if (minutes > 0) return rtf.format(-minutes, 'minute')
  return rtf.format(-seconds, 'second')
}
