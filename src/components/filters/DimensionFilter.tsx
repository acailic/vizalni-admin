'use client'

import { useState } from 'react'

import { matchesFilterSearch, type FilterableDimension } from '@/lib/charts/interactive-filters'
import type { InteractiveFilterValue } from '@/types'

interface DimensionFilterProps {
  dimension: FilterableDimension
  value: InteractiveFilterValue
  allLabel: string
  searchLabel: string
  noResultsLabel: string
  onChange: (value: InteractiveFilterValue) => void
}

function asArray(value: InteractiveFilterValue) {
  if (Array.isArray(value)) {
    return value
  }

  return value ? [value] : []
}

export function DimensionFilter({
  dimension,
  value,
  allLabel,
  searchLabel,
  noResultsLabel,
  onChange,
}: DimensionFilterProps) {
  const [query, setQuery] = useState('')
  const selectedValues = asArray(value)
  const filteredOptions = query
    ? dimension.options.filter(option => matchesFilterSearch(option.label, query))
    : dimension.options

  if (dimension.mode === 'single') {
    return (
      <label className="flex min-w-[180px] flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {dimension.label}
        </span>
        <select
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          onChange={event => onChange(event.target.value || null)}
          value={typeof value === 'string' ? value : ''}
        >
          <option value="">{allLabel}</option>
          {dimension.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <div className="min-w-[220px] space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {dimension.label}
      </p>
      {dimension.mode === 'multi' ? (
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
          onChange={event => setQuery(event.target.value)}
          placeholder={searchLabel}
          type="search"
          value={query}
        />
      ) : null}
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          checked={selectedValues.length === 0}
          onChange={() => onChange(null)}
          type="checkbox"
        />
        <span>{allLabel}</span>
      </label>
      <div className="max-h-36 space-y-2 overflow-auto pr-1">
        {filteredOptions.map(option => {
          const checked = selectedValues.includes(option.value)

          return (
            <label className="flex items-center gap-2 text-sm text-slate-600" key={option.value}>
              <input
                checked={checked}
                onChange={event => {
                  if (event.target.checked) {
                    onChange([...new Set([...selectedValues, option.value])])
                    return
                  }

                  const nextValues = selectedValues.filter(entry => entry !== option.value)
                  onChange(nextValues.length > 0 ? nextValues : null)
                }}
                type="checkbox"
              />
              <span>{option.label}</span>
            </label>
          )
        })}
        {filteredOptions.length === 0 ? (
          <p className="text-sm text-slate-400">{noResultsLabel}</p>
        ) : null}
      </div>
    </div>
  )
}
