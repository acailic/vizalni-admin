import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, ExternalLink } from 'lucide-react'

import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { getDatasetDetailData, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'
import { loadDatasetFromUrl } from '@/lib/data/loader'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { decodeFullUrlState, type UrlState } from '@/lib/url'

interface ChartViewPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ChartViewPage({ params, searchParams }: ChartViewPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const locale = resolveLocale(resolvedParams.locale)
  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Extract encoded state from URL params
  const encoded = Array.isArray(resolvedSearchParams.s)
    ? resolvedSearchParams.s[0]
    : resolvedSearchParams.s

  // Decode URL state
  if (!encoded) {
    return (
      <ErrorView
        title={messages.errors?.['404_title'] || 'Chart Not Found'}
        message="No chart state was provided in the URL."
        backLabel={messages.common?.back || 'Back'}
        backHref={`/${locale}`}
      />
    )
  }

  const decodeResult = decodeFullUrlState(encoded)

  if (!decodeResult.success || !decodeResult.state) {
    return (
      <ErrorView
        title={messages.errors?.['404_title'] || 'Chart Not Found'}
        message={decodeResult.error || 'The shared chart could not be loaded. The link may be corrupted or expired.'}
        backLabel={messages.common?.back || 'Back'}
        backHref={`/${locale}`}
      />
    )
  }

  const state = decodeResult.state as UrlState
  const { dataset, config } = state

  // Validate required fields
  if (!dataset.datasetId || !dataset.resourceId) {
    return (
      <ErrorView
        title={messages.errors?.['404_title'] || 'Invalid Chart'}
        message="The shared chart is missing required information."
        backLabel={messages.common?.back || 'Back'}
        backHref={`/${locale}`}
      />
    )
  }

  // Try to load the dataset
  let chartData: Record<string, unknown>[] = []
  let loadError: string | null = null
  let datasetTitle = dataset.datasetTitle || 'Dataset'

  try {
    // First, get dataset metadata from API
    const { dataset: datasetInfo, previewResource } = await getDatasetDetailData(dataset.datasetId)
    datasetTitle = datasetInfo.title || datasetTitle

    // Check if resource is previewable
    if (previewResource && isPreviewableFormat(previewResource.format)) {
      const previewUrl = new URL(previewResource.url)
      
      if (isAllowedPreviewHost(previewUrl.hostname)) {
        const parsedDataset = await loadDatasetFromUrl(previewResource.url, {
          datasetId: dataset.datasetId,
          resourceId: dataset.resourceId,
          resourceUrl: previewResource.url,
          format: previewResource.format,
          rowLimit: 1000,
        })

        chartData = parsedDataset.observations as Record<string, unknown>[]
      } else {
        loadError = 'Cannot load data from this source'
      }
    } else {
      loadError = 'Dataset resource is not in a previewable format'
    }
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Failed to load dataset'
  }

  // Handle dataset load error
  if (loadError) {
    return (
      <ErrorView
        title={messages.errors?.['500_title'] || 'Error Loading Chart'}
        message={
          loadError === 'Dataset not found'
            ? 'The dataset for this chart no longer exists.'
            : 'There was an error loading the chart data. Please try again later.'
        }
        backLabel={messages.browse?.title || 'Browse Datasets'}
        backHref={`/${locale}/browse`}
      />
    )
  }

  // Build chart config from URL state
  const chartConfig = {
    ...config,
    dataset_id: dataset.datasetId,
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <Link
          href={`/${locale}/create?dataset=${dataset.datasetId}&resource=${dataset.resourceId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ExternalLink className="h-4 w-4" />
          {locale === 'sr-Cyrl' ? 'Направите свој график' : locale === 'sr-Latn' ? 'Napravite svoj grafik' : 'Create your own chart'}
        </Link>
      </header>

      {/* Chart */}
      <ChartRenderer
        config={chartConfig}
        data={chartData}
        height={500}
        locale={locale}
        sourceDataset={datasetTitle}
      />

      {/* Footer attribution */}
      <footer className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">{messages.common?.export?.source || 'Source'}:</span>{' '}
            <Link
              href={`/${locale}/browse/${dataset.datasetId}`}
              className="text-blue-600 hover:underline"
            >
              {datasetTitle}
            </Link>
            {dataset.organizationName && (
              <>
                {' '}
                <span className="text-slate-400">•</span>{' '}
                {dataset.organizationName}
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
export async function generateMetadata({ params, searchParams }: ChartViewPageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)
  const messages = getMessages(locale)

  // Try to get chart title from URL state
  let title = messages.common?.title || 'Chart'
  
  const resolvedSearchParams = await searchParams
  const encoded = Array.isArray(resolvedSearchParams.s)
    ? resolvedSearchParams.s[0]
    : resolvedSearchParams.s

  if (encoded) {
    const decodeResult = decodeFullUrlState(encoded)
    if (decodeResult.success && decodeResult.state) {
      const state = decodeResult.state as UrlState
      if (state.config?.title) {
        title = state.config.title
      }
    }
  }

  return {
    title,
    description: messages.common?.description,
  }
}
