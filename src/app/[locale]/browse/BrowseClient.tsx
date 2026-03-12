'use client'

import { useEffect } from 'react'

import { DatasetList } from '@/components/browse/DatasetList'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import { Pagination } from '@/components/browse/Pagination'
import { SearchBar } from '@/components/browse/SearchBar'
import { useErrorModal } from '@/components/ui/ErrorModal'
import { formatMessage, type Messages } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/config'
import type { BrowseDataset, BrowseFacets, BrowseSearchParams } from '@/types/browse'

interface BrowseClientProps {
  datasets: {
    data: BrowseDataset[]
    total: number
    page: number
    page_size: number
  }
  facets: BrowseFacets
  searchParams: BrowseSearchParams
  locale: Locale
  messages: Messages
  error?: { message: string; details?: string }
}

export function BrowseClient({
  datasets,
  facets,
  searchParams,
  locale,
  messages,
  error,
}: BrowseClientProps) {
  const { showError } = useErrorModal()

  // Show error modal if server passed an error
  useEffect(() => {
    if (error) {
      showError(error.message, error.details)
    }
  }, [error, showError])

  return (
    <main className="container-custom py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gov-secondary">
            {messages.browse.eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {messages.browse.title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-gray-600">{messages.browse.description}</p>
        </header>

        <SearchBar
          clearLabel={messages.browse.clear_search}
          initialQuery={searchParams.q}
          placeholder={messages.browse.search_placeholder}
        />

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterSidebar
            facets={facets}
            labels={{
              title: messages.browse.filters,
              organization: messages.browse.filter_organization,
              topic: messages.browse.filter_topic,
              format: messages.browse.filter_format,
              frequency: messages.browse.filter_frequency,
              clear: messages.browse.clear_filters,
              all: messages.browse.all_options,
            }}
            selected={searchParams}
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-sm text-gray-600">
                {formatMessage(messages.browse.results_count, { count: datasets.total })}
              </p>
            </div>
            <DatasetList
              datasets={datasets.data}
              emptyDescription={messages.browse.no_results_hint}
              emptyTitle={messages.browse.no_results}
              locale={locale}
              resourceLabel={messages.datasets.resources}
              updatedLabel={messages.browse.last_updated}
            />
            <Pagination
              locale={locale}
              nextLabel={messages.common.next}
              ofLabel={messages.browse.of}
              page={datasets.page}
              pageLabel={messages.browse.page}
              pageSize={datasets.page_size}
              previousLabel={messages.common.previous}
              searchParams={{
                q: searchParams.q,
                organization: searchParams.organization,
                topic: searchParams.topic,
                format: searchParams.format,
                frequency: searchParams.frequency,
                sort: searchParams.sort,
              }}
              total={datasets.total}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
