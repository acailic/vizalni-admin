import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

import { defaultLocale, locales, type Locale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/messages'

export { locales, type Locale }

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = (locale ?? defaultLocale) as Locale

  if (!locales.includes(resolvedLocale)) notFound()

  return {
    locale: resolvedLocale,
    messages: getMessages(resolvedLocale),
  }
})
