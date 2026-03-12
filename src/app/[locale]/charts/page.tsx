import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDistanceToNow } from 'date-fns'
import { srLatn, enUS } from 'date-fns/locale'
import { BarChart3, LineChart, PieChart, Map, TrendingUp, Grid3X3, ArrowUpDown } from 'lucide-react'
import type { Metadata } from 'next'

import { listCharts } from '@/lib/db'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { ChartStatus, type SortByField } from '@/types/persistence'

interface GalleryPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; sortBy?: string; sortOrder?: string }>
}

// Chart type icons
const chartTypeIcons: Record<string, React.ComponentType<{ className?: string | undefined }>> = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: TrendingUp,
  pie: PieChart,
  scatterplot: TrendingUp,
  combo: BarChart3,
  table: Grid3X3,
  map: Map,
}

const validSortByFields: Set<string> = new Set(['createdAt', 'views', 'updatedAt'])

function parseSortBy(value: string | undefined): SortByField {
  if (value && validSortByFields.has(value)) {
    return value as SortByField
  }
  return 'createdAt'
}

export default async function GalleryPage({ params, searchParams }: GalleryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const locale = resolveLocale(resolvedParams.locale)
  if (locale !== resolvedParams.locale) {
    notFound()
  }

  // Preload messages for SSR (used in metadata generation)
  void getMessages(locale)

  const pageStr = resolvedSearchParams.page
  const page = pageStr ? parseInt(pageStr, 10) : 1
  const sortBy = parseSortBy(resolvedSearchParams.sortBy)
  const sortOrder = resolvedSearchParams.sortOrder === 'asc' ? 'asc' as const : 'desc' as const

  // Fetch published charts
  const result = await listCharts(
    { status: ChartStatus.PUBLISHED },
    { page, pageSize: 12, sortBy, sortOrder }
  )

  const dateLocale = locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {locale === 'sr-Cyrl'
            ? 'Галерија визуелизација'
            : locale === 'sr-Latn'
              ? 'Galerija vizuelizacija'
              : 'Visualization Gallery'}
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          {locale === 'sr-Cyrl'
            ? 'Истражите објављене визуелизације података из Србије'
            : locale === 'sr-Latn'
              ? 'Istražite objavljene vizuelizacije podataka iz Srbije'
              : 'Explore published data visualizations from Serbia'}
        </p>
      </header>

      {/* Sort controls */}
      <div className="mb-6 flex items-center gap-4">
        <span className="flex items-center gap-2 text-sm text-slate-600">
          <ArrowUpDown className="h-4 w-4" />
          {locale === 'sr-Cyrl' ? 'Сортирај:' : locale === 'sr-Latn' ? 'Sortiraj:' : 'Sort:'}
        </span>
        <SortLink
          locale={locale}
          sortBy="createdAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          label={locale === 'sr-Cyrl' ? 'Најновије' : locale === 'sr-Latn' ? 'Najnovije' : 'Newest'}
        />
        <SortLink
          locale={locale}
          sortBy="views"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          label={locale === 'sr-Cyrl' ? 'Најгледаније' : locale === 'sr-Latn' ? 'Najgledanije' : 'Most viewed'}
        />
      </div>

      {/* Charts grid */}
      {result.charts.length === 0 ? (
        <EmptyState locale={locale} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.charts.map(chart => {
            const Icon = chartTypeIcons[chart.chartType] || BarChart3
            const timeAgo = formatDistanceToNow(new Date(chart.createdAt), {
              addSuffix: true,
              ...(dateLocale && { locale: dateLocale }),
            })

            return (
              <Link
                key={chart.id}
                href={`/${locale}/v/${chart.id}`}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                {/* Thumbnail or placeholder */}
                <div className="aspect-video bg-slate-100">
                  {chart.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`data:image/png;base64,${chart.thumbnail}`}
                      alt={chart.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Icon className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="line-clamp-1 font-semibold text-slate-900 group-hover:text-blue-600">
                    {chart.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Icon className="h-3.5 w-3.5" />
                      {chart.chartType}
                    </span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                    <span>•</span>
                    <span>{chart.views.toLocaleString()} {locale === 'sr-Cyrl' ? 'прегледа' : locale === 'sr-Latn' ? 'pregleda' : 'views'}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/${locale}/charts?page=${page - 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              {locale === 'sr-Cyrl' ? '← Претходна' : locale === 'sr-Latn' ? '← Prethodna' : '← Previous'}
            </Link>
          )}
          <span className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium">
            {page} / {result.totalPages}
          </span>
          {page < result.totalPages && (
            <Link
              href={`/${locale}/charts?page=${page + 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              {locale === 'sr-Cyrl' ? 'Следећа →' : locale === 'sr-Latn' ? 'Sledeća →' : 'Next →'}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function SortLink({
  locale,
  sortBy,
  currentSortBy,
  currentSortOrder,
  label,
}: {
  locale: string
  sortBy: 'createdAt' | 'views'
  currentSortBy: string
  currentSortOrder: string
  label: string
}) {
  const isActive = currentSortBy === sortBy
  const newOrder = isActive && currentSortOrder === 'desc' ? 'asc' : 'desc'

  return (
    <Link
      href={`/${locale}/charts?sortBy=${sortBy}&sortOrder=${newOrder}`}
      className={`text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
    >
      {label}
    </Link>
  )
}

function EmptyState({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BarChart3 className="h-16 w-16 text-slate-300" />
      <h2 className="mt-4 text-xl font-semibold text-slate-900">
        {locale === 'sr-Cyrl'
          ? 'Нема објављених визуелизација'
          : locale === 'sr-Latn'
            ? 'Nema objavljenih vizuelizacija'
            : 'No published visualizations yet'}
      </h2>
      <p className="mt-2 text-slate-600">
        {locale === 'sr-Cyrl'
          ? 'Будите први који ће објавити визуелизацију!'
          : locale === 'sr-Latn'
            ? 'Budite prvi koji će objaviti vizuelizaciju!'
            : 'Be the first to publish a visualization!'}
      </p>
      <Link
        href={`/${locale}/create`}
        className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {locale === 'sr-Cyrl'
          ? 'Направите визуелизацију'
          : locale === 'sr-Latn'
            ? 'Napravite vizuelizaciju'
            : 'Create a visualization'}
      </Link>
    </div>
  )
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)
  const messages = getMessages(locale)

  const title =
    locale === 'sr-Cyrl'
      ? 'Галерија визуелизација'
      : locale === 'sr-Latn'
        ? 'Galerija vizuelizacija'
        : 'Visualization Gallery'

  return {
    title,
    description: messages.common?.description,
  }
}
