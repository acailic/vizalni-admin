import { notFound } from 'next/navigation'

import { DatasetPreview } from '@/components/browse/DatasetPreview'
import { getDatasetDetailData } from '@/lib/api/browse'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

export default async function BrowseDatasetPage({
  params,
}: {
  params: { locale: string; id: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  try {
    const { dataset, previewResource } = await getDatasetDetailData(params.id)

    return (
      <main className="container-custom py-10">
        <DatasetPreview
          dataset={dataset}
          labels={{
            metadata: messages.browse.metadata,
            organization: messages.datasets.organization,
            license: messages.datasets.license,
            temporal: messages.datasets.temporal_coverage,
            spatial: messages.datasets.spatial_coverage,
            resources: messages.browse.resources,
            download: messages.common.download,
            preview: messages.browse.preview,
            previewError: messages.browse.preview_error,
            loading: messages.common.loading,
            emptyPreview: messages.browse.preview_empty,
            previewLimit: messages.browse.preview_limit,
            visualize: messages.browse.visualize,
            updated: messages.browse.last_updated,
          }}
          locale={locale}
          previewResource={previewResource}
        />
      </main>
    )
  } catch {
    notFound()
  }
}
