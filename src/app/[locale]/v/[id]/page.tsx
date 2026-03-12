import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDistanceToNow } from 'date-fns'
import { srLatn, enUS } from 'date-fns/locale'
import { ArrowLeft, ExternalLink, Calendar, Eye } from 'lucide-react'
import type { Metadata } from 'next'

import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { getDatasetDetailData, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'
import { loadDatasetFromUrl } from '@/lib/data/loader'
import { getChartById, incrementViews } from '@/lib/db'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

interface SavedChartPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function SavedChartPage({ params }: SavedChartPageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)
  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Fetch the saved chart
  const chart = await getChartById(resolvedParams.id)

  if (!chart) {
    return (
      <ErrorView
        title={messages.errors?.['404_title'] || 'Chart Not Found'}
        message={
          locale === 'sr-Cyrl'
            ? 'Визуелизација коју тражите не постоји или је уклоњена.'
            : locale === 'sr-Latn'
              ? 'Vizuelizacija koju tražite ne postoji ili je uklonjena.'
              : 'The visualization you are looking for does not exist or has been removed.'
        }
        backLabel={messages.common?.back || 'Back'}
        backHref={`/${locale}`}
      />
    )
  }

  // Increment views (fire-and-forget on client, but we can do it server-side too)
  incrementViews(chart.id).catch(err => console.error('Failed to increment views:', err))

  // Load dataset data
  let chartData: Record<string, unknown>[] = []
  let datasetTitle = chart.config.title || 'Dataset'
  let organizationName: string | undefined

  if (chart.datasetIds.length > 0) {
    try {
      const datasetId = chart.datasetIds[0]!
      const { dataset: datasetInfo, previewResource } = await getDatasetDetailData(datasetId)
      datasetTitle = datasetInfo.title || datasetTitle
      organizationName = datasetInfo.organization?.name

      if (previewResource && isPreviewableFormat(previewResource.format)) {
        const previewUrl = new URL(previewResource.url)

        if (isAllowedPreviewHost(previewUrl.hostname)) {
          const parsedDataset = await loadDatasetFromUrl(previewResource.url, {
            datasetId,
            resourceId: previewResource.id,
            resourceUrl: previewResource.url,
            format: previewResource.format,
            rowLimit: 1000,
          })

          chartData = parsedDataset.observations as Record<string, unknown>[]
        }
      }
    } catch (error) {
      console.error('Failed to load dataset:', error)
    }
  }

  // Format dates
  const dateLocale = locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined
  const createdAtLabel = formatDistanceToNow(new Date(chart.createdAt), {
    addSuffix: true,
    ...(dateLocale && { locale: dateLocale }),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <Link
          href={`/${locale}/create`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ExternalLink className="h-4 w-4" />
          {locale === 'sr-Cyrl'
            ? 'Направите свој график'
            : locale === 'sr-Latn'
              ? 'Napravite svoj grafik'
              : 'Create your own chart'}
        </Link>
      </header>

      {/* Chart Title & Description */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{chart.title}</h1>
        {chart.description && <p className="mt-2 text-lg text-slate-600">{chart.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {createdAtLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {chart.views.toLocaleString()}{' '}
            {locale === 'sr-Cyrl' ? 'прегледа' : locale === 'sr-Latn' ? 'pregleda' : 'views'}
          </span>
        </div>
      </div>

      {/* Chart */}
      <ChartRenderer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config={chart.config as any}
        data={chartData}
        height={500}
        locale={locale}
        sourceDataset={datasetTitle}
      />

      {/* Footer attribution */}
      <footer className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">
              {messages.common?.export?.source || 'Source'}:
            </span>{' '}
            {chart.datasetIds.length > 0 ? (
              <Link
                href={`/${locale}/browse/${chart.datasetIds[0]}`}
                className="text-blue-600 hover:underline"
              >
                {datasetTitle}
              </Link>
            ) : (
              <span>{datasetTitle}</span>
            )}
            {organizationName && (
              <>
                {' '}
                <span className="text-slate-400">•</span> {organizationName}
              </>
            )}
          </div>
          <Link
            href="https://data.gov.rs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
          >
            data.gov.rs
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </footer>
    </div>
  )
}

// Simple error view component
function ErrorView({
  title,
  message,
  backLabel,
  backHref,
}: {
  title: string
  message: string
  backLabel: string
  backHref: string
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-slate-600">{message}</p>
        <Link
          href={backHref}
          className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: SavedChartPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)
  const messages = getMessages(locale)

  const chart = await getChartById(resolvedParams.id)

  if (!chart) {
    return {
      title: messages.errors?.['404_title'] || 'Chart Not Found',
      description: messages.common?.description,
    }
  }

  return {
    title: chart.title,
    description: chart.description || messages.common?.description,
    openGraph: {
      title: chart.title,
      ...(chart.description && { description: chart.description }),
      type: 'article',
      ...(chart.thumbnail && { images: [{ url: `data:image/png;base64,${chart.thumbnail}` }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: chart.title,
      ...(chart.description && { description: chart.description }),
    },
  }
}
