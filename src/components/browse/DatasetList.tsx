import { EmptyState } from '@/components/browse/EmptyState'
import { DatasetCard } from '@/components/ui/DatasetCard'
import type { Locale } from '@/lib/i18n/config'
import type { BrowseDataset } from '@/types/browse'

interface DatasetListProps {
  datasets: BrowseDataset[]
  locale: Locale
  emptyTitle: string
  emptyDescription: string
  resourceLabel: string
  updatedLabel: string
}

export function DatasetList({
  datasets,
  locale,
  emptyTitle,
  emptyDescription,
  resourceLabel,
  updatedLabel,
}: DatasetListProps) {
  if (datasets.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />
  }

  return (
    <div className="grid gap-4">
      {datasets.map(dataset => (
        <DatasetCard
          dataset={dataset}
          key={dataset.id}
          lang={locale}
          labels={{
            resource: resourceLabel,
            updated: updatedLabel,
          }}
        />
      ))}
    </div>
  )
}
