import Image from 'next/image'
import Link from 'next/link'

import { Building2 } from 'lucide-react'

import { getBrowsePath } from '@/lib/api/browse'
import { formatRelativeTime } from '@/lib/i18n/config'

interface DatasetCardDataset {
  id: string
  title: string
  description?: string | null
  organization?: {
    name: string
    logo?: string | null
    logo_thumbnail?: string | null
  } | null
  resources?: Array<{
    format?: string | null
  }>
  tags?: string[]
  last_modified?: string | null
}

interface DatasetCardProps {
  dataset: DatasetCardDataset
  lang?: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    resource: string
    updated: string
  }
}

export function DatasetCard({
  dataset,
  lang = 'sr-Cyrl',
  labels = {
    resource: 'resources',
    updated: 'Updated',
  },
}: DatasetCardProps) {
  const uniqueFormats = [
    ...new Set(
      (dataset.resources ?? [])
        .map(resource => resource.format?.toUpperCase())
        .filter((format): format is string => Boolean(format))
    ),
  ]

  return (
    <Link href={getBrowsePath(lang, dataset.id)}>
      <article className="card group cursor-pointer rounded-3xl border border-gray-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {dataset.organization?.logo_thumbnail || dataset.organization?.logo ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <Image
                  alt={dataset.organization?.name ?? 'Organization'}
                  className="object-cover"
                  fill
                  sizes="48px"
                  src={dataset.organization.logo_thumbnail || dataset.organization.logo || ''}
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gov-primary/10 text-gov-primary">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                {dataset.organization?.name ?? 'data.gov.rs'}
              </p>
              {dataset.last_modified ? (
                <p className="mt-1 text-xs text-gray-500">
                  {labels.updated}: {formatRelativeTime(dataset.last_modified, lang)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {uniqueFormats.slice(0, 3).map(format => (
              <span
                className="rounded-full bg-gov-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gov-primary"
                key={format}
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-gov-secondary">
          {dataset.title}
        </h3>

        {dataset.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">{dataset.description}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {dataset.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
          <div className="flex gap-4">
            <span>
              {dataset.resources?.length || 0} {labels.resource}
            </span>
          </div>

          <div className="link-arrow text-gov-secondary">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.3 0.7L12.1 4.5H0V5.5H12.1L8.3 9.3L9 10L14 5L9 0L8.3 0.7Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}
