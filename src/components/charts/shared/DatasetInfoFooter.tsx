'use client'

import { memo } from 'react'
import { format, parseISO } from 'date-fns'
import { sr, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils/cn'

export interface DatasetInfoFooterProps {
  datasetName: string
  datasetUrl?: string
  lastUpdated?: Date | string | null
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    dataset?: string
    latestUpdate?: string
  }
  className?: string
}

function DatasetInfoFooterComponent({
  datasetName,
  datasetUrl,
  lastUpdated,
  locale,
  labels,
  className,
}: DatasetInfoFooterProps) {
  const l = {
    dataset: 'Dataset',
    latestUpdate: 'Latest data update',
    ...labels,
  }

  // Get date-fns locale
  const dateLocale = locale === 'en' ? enUS : sr

  // Format date
  const formattedDate = (() => {
    if (!lastUpdated) return null
    const date = typeof lastUpdated === 'string' ? parseISO(lastUpdated) : lastUpdated
    return format(date, 'dd.MM.yyyy HH:mm', { locale: dateLocale })
  })()

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500', className)}>
      <span>
        {l.dataset}:{' '}
        {datasetUrl ? (
          <a
            href={datasetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gov-primary hover:underline"
          >
            {datasetName}
          </a>
        ) : (
          <span className="font-medium">{datasetName}</span>
        )}
      </span>
      {formattedDate && (
        <span>
          {l.latestUpdate}: {formattedDate}
        </span>
      )}
    </div>
  )
}

export const DatasetInfoFooter = memo(DatasetInfoFooterComponent)
