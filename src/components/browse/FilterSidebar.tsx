'use client'

import { useSearch } from '@/lib/hooks/useSearch'
import type { BrowseFacets, BrowseSearchParams } from '@/types/browse'

interface FilterSidebarLabels {
  title: string
  organization: string
  topic: string
  format: string
  frequency: string
  clear: string
  all: string
}

interface FilterSidebarProps {
  facets: BrowseFacets
  labels: FilterSidebarLabels
  selected: BrowseSearchParams
}

export function FilterSidebar({ facets, labels, selected }: FilterSidebarProps) {
  const { setSearchParams } = useSearch()

  const handleSelect = (key: keyof BrowseSearchParams, value: string) => {
    setSearchParams({ [key]: value || undefined }, true)
  }

  const clearFilters = () => {
    setSearchParams(
      {
        organization: undefined,
        topic: undefined,
        format: undefined,
        frequency: undefined,
      },
      true
    )
  }

  const renderSelect = (
    id: string,
    label: string,
    value: string | undefined,
    options: BrowseFacets[keyof BrowseFacets],
    key: keyof BrowseSearchParams
  ) => (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
      <select
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gov-secondary focus:ring-2 focus:ring-gov-secondary/20"
        id={id}
        onChange={event => handleSelect(key, event.target.value)}
        value={value ?? ''}
      >
        <option value="">{labels.all}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
          {labels.title}
        </h2>
        <button
          className="text-sm font-medium text-gov-primary transition hover:text-gov-accent"
          onClick={clearFilters}
          type="button"
        >
          {labels.clear}
        </button>
      </div>
      <div className="space-y-4">
        {renderSelect(
          'browse-organization',
          labels.organization,
          selected.organization,
          facets.organizations,
          'organization'
        )}
        {renderSelect('browse-topic', labels.topic, selected.topic, facets.topics, 'topic')}
        {renderSelect('browse-format', labels.format, selected.format, facets.formats, 'format')}
        {renderSelect(
          'browse-frequency',
          labels.frequency,
          selected.frequency,
          facets.frequencies,
          'frequency'
        )}
      </div>
    </aside>
  )
}
