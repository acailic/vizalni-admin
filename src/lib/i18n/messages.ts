import { defaultLocale, locales, type Locale } from '@/lib/i18n/config'
import enMessages from '@/lib/i18n/locales/en/common.json'
import latMessages from '@/lib/i18n/locales/lat/common.json'
import srMessages from '@/lib/i18n/locales/sr/common.json'

export type Messages = typeof enMessages

const localeMessages: Record<Locale, Messages> = {
  'sr-Cyrl': srMessages,
  'sr-Latn': latMessages,
  en: enMessages,
}

export function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function resolveLocale(value?: string): Locale {
  return value && isSupportedLocale(value) ? value : defaultLocale
}

export function getMessages(locale: Locale): Messages {
  return localeMessages[locale]
}

export function formatMessage(
  template: string,
  variables: Record<string, string | number | undefined> = {}
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key]
    return value === undefined ? '' : String(value)
  })
}
