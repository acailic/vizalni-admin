import { notFound } from 'next/navigation'

import { getBrowsePageData, normalizeBrowseSearchParams } from '@/lib/api/browse'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { BrowseClient } from './BrowseClient'

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: { locale: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)
  const normalizedSearchParams = normalizeBrowseSearchParams(searchParams)

  // Initialize default values
  let datasets: Awaited<ReturnType<typeof getBrowsePageData>>['datasets'] = {
    data: [],
    total: 0,
    page: 1,
    page_size: 12,
  }
  let facets: Awaited<ReturnType<typeof getBrowsePageData>>['facets'] = {
    organizations: [],
    topics: [],
    formats: [],
    frequencies: [],
  }
  let error: { message: string; details?: string } | undefined

  // Try to fetch data, catch errors for client-side handling
  try {
    const result = await getBrowsePageData(normalizedSearchParams)
    datasets = result.datasets
    facets = result.facets
  } catch (err) {
    error = {
      message: messages.errors.modal.failedToLoad,
      details: err instanceof Error ? err.message : 'Unknown error',
    }
  }

  return (
    <BrowseClient
      datasets={datasets}
      facets={facets}
      searchParams={normalizedSearchParams}
      locale={locale}
      messages={messages}
      error={error}
    />
  )
}
