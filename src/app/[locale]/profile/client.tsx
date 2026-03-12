'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, LineChart, PieChart, Map, TrendingUp, Grid3X3, Eye, Edit, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { srLatn, enUS } from 'date-fns/locale'

interface SavedChartMeta {
  id: string
  title: string
  description?: string | null
  chartType: string
  status: string
  views: number
  thumbnail?: string | null
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

interface ProfileClientProps {
  locale: string
  labels: {
    title: string
    subtitle: string
    myCharts: string
    drafts: string
    published: string
    noCharts: string
    createFirst: string
    views: string
    edit: string
    delete: string
    deleteConfirm: string
    view: string
    draft: string
    published_label: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartTypeIcons: Record<string, React.ComponentType<any>> = {
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

export function ProfileClient({ locale, labels }: ProfileClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [charts, setCharts] = useState<SavedChartMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login?callbackUrl=/${locale}/profile`)
    }
  }, [status, router, locale])

  // Fetch user's charts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCharts()
    }
  }, [status])

  const fetchCharts = async () => {
    try {
      const response = await fetch('/api/charts/mine')
      if (!response.ok) throw new Error('Failed to fetch charts')
      const data = await response.json()
      setCharts(data.charts || [])
    } catch (err) {
      setError('Failed to load charts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (chartId: string) => {
    if (!confirm(labels.deleteConfirm)) return

    try {
      const response = await fetch(`/api/charts/${chartId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      setCharts(charts.filter(c => c.id !== chartId))
    } catch (err) {
      alert('Failed to delete chart')
    }
  }

  const dateLocale = locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined

  const filteredCharts = charts.filter(chart => {
    if (activeTab === 'draft') return chart.status === 'DRAFT'
    if (activeTab === 'published') return chart.status === 'PUBLISHED'
    return chart.status !== 'ARCHIVED'
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">
          {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {labels.myCharts}
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'draft'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {labels.drafts}
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'published'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {labels.published}
        </button>
      </div>

      {/* Charts grid */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {filteredCharts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg text-slate-600">{labels.noCharts}</p>
          <Link
            href={`/${locale}/create`}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {labels.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCharts.map(chart => {
            const Icon = chartTypeIcons[chart.chartType] || BarChart3
            const timeAgo = formatDistanceToNow(new Date(chart.createdAt), {
              addSuffix: true,
              ...(dateLocale && { locale: dateLocale }),
            })

            return (
              <div
                key={chart.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                {/* Thumbnail */}
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
                      <Icon className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 font-semibold text-slate-900">{chart.title}</h3>
                    <span
                      className={`ml-2 rounded px-2 py-0.5 text-xs font-medium ${
                        chart.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {chart.status === 'PUBLISHED' ? labels.published_label : labels.draft}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {chart.chartType}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {chart.views} {labels.views}
                    </span>
                  </div>

                  <p className="mb-3 text-xs text-slate-400">{timeAgo}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/v/${chart.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {labels.view}
                    </Link>
                    <Link
                      href={`/${locale}/create?chartId=${chart.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Edit className="h-3 w-3" />
                      {labels.edit}
                    </Link>
                    <button
                      onClick={() => handleDelete(chart.id)}
                      className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
