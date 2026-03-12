import Link from 'next/link'

import { ArrowRight, Search } from 'lucide-react'

import { getBrowsePath } from '@/lib/api/browse'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

export default function LocaleHomePage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale)
  const messages = getMessages(locale)

  return (
    <main className="container-custom py-16">
      <section className="rounded-[2rem] bg-gradient-to-br from-gov-primary via-gov-accent to-gov-secondary px-8 py-12 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          {messages.common.title}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight">{messages.browse.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
          {messages.browse.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gov-primary transition hover:bg-gray-100"
            href={getBrowsePath(locale)}
          >
            <Search className="h-4 w-4" />
            {messages.browse.title}
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            href={`/${locale}/create`}
          >
            {messages.browse.visualize}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
