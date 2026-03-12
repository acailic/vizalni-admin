import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getBrowsePath } from '@/lib/api/browse'

interface PaginationProps {
  locale: string
  page: number
  pageSize: number
  total: number
  previousLabel: string
  nextLabel: string
  pageLabel: string
  ofLabel: string
  searchParams: Record<string, string | undefined>
}

function buildHref(locale: string, page: number, searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value)
    }
  }

  params.set('page', String(page))
  const query = params.toString()
  return `${getBrowsePath(locale)}?${query}`
}

export function Pagination({
  locale,
  page,
  pageSize,
  total,
  previousLabel,
  nextLabel,
  pageLabel,
  ofLabel,
  searchParams,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      <Link
        aria-disabled={page <= 1}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
          page <= 1
            ? 'pointer-events-none text-gray-300'
            : 'text-gov-primary hover:bg-gov-primary/5'
        }`}
        href={buildHref(locale, Math.max(1, page - 1), searchParams)}
      >
        <ChevronLeft className="h-4 w-4" />
        {previousLabel}
      </Link>
      <span className="text-sm text-gray-600">
        {pageLabel} {page} {ofLabel} {totalPages}
      </span>
      <Link
        aria-disabled={page >= totalPages}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
          page >= totalPages
            ? 'pointer-events-none text-gray-300'
            : 'text-gov-primary hover:bg-gov-primary/5'
        }`}
        href={buildHref(locale, Math.min(totalPages, page + 1), searchParams)}
      >
        {nextLabel}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
