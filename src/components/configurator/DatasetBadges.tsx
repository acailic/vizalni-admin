'use client'

import type { DatasetReference } from '@/types'

interface DatasetBadgesProps {
  datasets: DatasetReference[]
  primaryDatasetId: string | null
  labels: {
    primary: string
    secondary: string
    remove: string
    maxDatasetsReached: string
  }
  onRemove?: (datasetId: string) => void
  maxDatasets?: number
}

const BADGE_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
]

export function DatasetBadges({
  datasets,
  primaryDatasetId,
  labels,
  onRemove,
  maxDatasets = 3,
}: DatasetBadgesProps) {
  const allDatasets = primaryDatasetId
    ? [{ datasetId: primaryDatasetId, isPrimary: true }, ...datasets.map(d => ({ ...d, isPrimary: false }))]
    : datasets.map(d => ({ ...d, isPrimary: false }))

  return (
    <div className="flex flex-wrap gap-2">
      {allDatasets.map((dataset, index) => (
        <div
          key={dataset.datasetId}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            dataset.isPrimary ? 'bg-gov-primary text-white' : BADGE_COLORS[index % BADGE_COLORS.length]
          }`}
        >
          <span className="max-w-[120px] truncate">
            {dataset.isPrimary ? labels.primary : `${labels.secondary} ${index}`}
          </span>
          {!dataset.isPrimary && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(dataset.datasetId)}
              className="ml-1 rounded-full hover:bg-black/10 p-0.5"
              aria-label={labels.remove}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      {allDatasets.length >= maxDatasets && (
        <span className="text-xs text-slate-500 self-center">
          {labels.maxDatasetsReached}
        </span>
      )}
    </div>
  )
}
