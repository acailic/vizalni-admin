import Link from 'next/link'

import { Download, Sparkles } from 'lucide-react'

import { PreviewTable } from '@/components/browse/PreviewTable'
import { formatDate } from '@/lib/i18n/config'
import type { BrowseDataset, BrowseResource } from '@/types/browse'

interface DatasetPreviewLabels {
  metadata: string
  organization: string
  license: string
  temporal: string
  spatial: string
  resources: string
  download: string
  preview: string
  previewError: string
  loading: string
  emptyPreview: string
  previewLimit: string
  visualize: string
  updated: string
}

interface DatasetPreviewProps {
  dataset: BrowseDataset
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels: DatasetPreviewLabels
  previewResource?: BrowseResource | undefined
}

export function DatasetPreview({ dataset, locale, labels, previewResource }: DatasetPreviewProps) {
  const previewUrl = previewResource
    ? `/api/browse/preview?url=${encodeURIComponent(previewResource.url)}&format=${encodeURIComponent(
        previewResource.format
      )}`
    : undefined

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{dataset.title}</h1>
            {dataset.description ? (
              <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-600">
                {dataset.description}
              </p>
            ) : null}
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-gov-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-gov-accent"
            href={`/${locale}/create?dataset=${dataset.id}`}
          >
            <Sparkles className="h-4 w-4" />
            {labels.visualize}
          </Link>
        </div>
        <h2 className="mt-6 text-lg font-semibold text-gray-900">{labels.metadata}</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {labels.organization}
            </dt>
            <dd className="mt-2 text-sm text-gray-800">{dataset.organization?.name ?? '—'}</dd>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {labels.license}
            </dt>
            <dd className="mt-2 text-sm text-gray-800">{dataset.license ?? '—'}</dd>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {labels.temporal}
            </dt>
            <dd className="mt-2 text-sm text-gray-800">
              {dataset.temporal_coverage?.start || dataset.temporal_coverage?.end
                ? `${dataset.temporal_coverage?.start ?? '—'} - ${dataset.temporal_coverage?.end ?? '—'}`
                : '—'}
            </dd>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {labels.spatial}
            </dt>
            <dd className="mt-2 text-sm text-gray-800">{dataset.spatial?.granularity ?? '—'}</dd>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {labels.updated}
            </dt>
            <dd className="mt-2 text-sm text-gray-800">
              {dataset.last_modified ? formatDate(dataset.last_modified, locale) : '—'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.resources}</h2>
        <div className="mt-4 space-y-3">
          {dataset.resources.map(resource => (
            <article
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
              key={resource.id}
            >
              <div>
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {resource.format.toUpperCase()}
                  {resource.filesize ? ` • ${resource.filesize} B` : ''}
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-gov-primary transition hover:text-gov-accent"
                href={resource.url}
                rel="noreferrer"
                target="_blank"
              >
                <Download className="h-4 w-4" />
                {labels.download}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.preview}</h2>
        {previewUrl ? (
          <div className="mt-4">
            <PreviewTable
              emptyLabel={labels.emptyPreview}
              errorLabel={labels.previewError}
              loadingLabel={labels.loading}
              previewLabel={labels.previewLimit}
              previewUrl={previewUrl}
            />
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyPreview}</p>
        )}
      </section>
    </div>
  )
}
