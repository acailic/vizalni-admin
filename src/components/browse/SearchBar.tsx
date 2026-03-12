'use client'

import { useEffect, useState } from 'react'

import { Search, X } from 'lucide-react'

import { useDebounce } from '@/lib/hooks/useDebounce'
import { useSearch } from '@/lib/hooks/useSearch'

interface SearchBarProps {
  initialQuery?: string | undefined
  placeholder: string
  clearLabel: string
}

export function SearchBar({ initialQuery = '', placeholder, clearLabel }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 300)
  const { setSearchParams } = useSearch()

  useEffect(() => {
    setSearchParams({ q: debouncedQuery || undefined }, true)
  }, [debouncedQuery, setSearchParams])

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      />
      <input
        aria-label={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm shadow-sm outline-none transition focus:border-gov-secondary focus:ring-2 focus:ring-gov-secondary/20"
        onChange={event => setQuery(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={query}
      />
      {query ? (
        <button
          aria-label={clearLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setQuery('')}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
