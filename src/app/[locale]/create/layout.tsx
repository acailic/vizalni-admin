import { notFound } from 'next/navigation'

import { resolveLocale } from '@/lib/i18n/messages'

export default function CreateLayout({
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

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
}
