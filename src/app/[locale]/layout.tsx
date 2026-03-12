import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  return (
    <div data-locale={locale} data-title={messages.common.title}>
      <Header
        locale={locale}
        messages={{
          siteName: messages.header?.siteName || messages.common.title,
          government: messages.header?.government || '',
          republic: messages.header?.republic || '',
          governmentBody: messages.header?.governmentBody || '',
          home: messages.header?.home || messages.common.home,
          datasets: messages.header?.datasets || messages.common.datasets,
          about: messages.header?.about || messages.common.about,
          contact: messages.header?.contact || messages.common.contact,
          toggleMenu: messages.header?.toggleMenu || 'Toggle menu',
        }}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        locale={locale}
        messages={{
          siteName: messages.header?.siteName || messages.common.title,
          government: messages.header?.government || '',
          aboutGov: messages.footer?.aboutGov || messages.footer?.about || '',
          privacy: messages.footer?.privacy || '',
          terms: messages.footer?.terms || '',
          accessibility: messages.footer?.accessibility || '',
          contact: messages.header?.contact || messages.common.contact,
          dataSources: messages.footer?.dataSources || '',
          lastUpdated: messages.footer?.lastUpdated || '',
          version: messages.footer?.version || '',
          allRightsReserved: messages.footer?.allRightsReserved || '',
          officialSite: messages.footer?.officialSite || '',
          usefulLinks: messages.header?.usefulLinks || messages.footer?.useful_links || '',
          institutions: messages.header?.institutions || '',
          about: messages.footer?.about || '',
          follow_us: messages.footer?.follow_us || '',
        }}
      />
    </div>
  )
}
