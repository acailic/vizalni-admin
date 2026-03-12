import { cache } from 'react'

import { loadDatasetFromUrl, parseDatasetContent } from '@/lib/data'
import type {
  BrowseDataset,
  BrowseFacets,
  BrowsePageResponse,
  BrowseResource,
  BrowseSearchParams,
  BrowseTopic,
  PreviewPayload,
} from '@/types/browse'
import type { ParsedDataset } from '@/types/observation'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DATA_GOV_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://data.gov.rs/api/1'

const PREVIEWABLE_FORMATS = new Set(['csv', 'json'])
const PREVIEW_HOSTS = new Set(['data.gov.rs'])
const PREVIEW_FORMAT_PRIORITY: Record<string, number> = {
  csv: 0,
  json: 1,
}
const FACET_CACHE_TTL_MS = 5 * 60 * 1000
const ORGANIZATION_FACET_PAGE_SIZE = 100

type BrowseStaticFacets = Omit<BrowseFacets, 'formats'>

function createTtlCache<T>(loader: () => Promise<T>, ttlMs: number) {
  let value: T | null = null
  let expiresAt = 0
  let pending: Promise<T> | null = null

  return async () => {
    const now = Date.now()
    if (value && now < expiresAt) {
      return value
    }

    if (pending) {
      return pending
    }

    pending = loader()
      .then(result => {
        value = result
        expiresAt = Date.now() + ttlMs
        pending = null
        return result
      })
      .catch(error => {
        pending = null
        throw error
      })

    return pending
  }
}

function buildApiUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`)

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function fetchApi<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = buildApiUrl(path, params)
  const response = await fetch(url, {
    next: { revalidate: 300 },
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Browse API request failed with ${response.status} for ${url}`)
  }

  return response.json()
}

export function getBrowsePath(locale: string, datasetId?: string) {
  return datasetId ? `/${locale}/browse/${datasetId}` : `/${locale}/browse`
}

export function isPreviewableFormat(format?: string | null) {
  return !!format && PREVIEWABLE_FORMATS.has(format.toLowerCase())
}

export function isAllowedPreviewHost(hostname: string) {
  return PREVIEW_HOSTS.has(hostname) || hostname.endsWith('.data.gov.rs')
}

export function findPreviewableResource(resources: BrowseResource[]) {
  return resources
    .filter(resource => isPreviewableFormat(resource.format))
    .sort((left, right) => {
      const leftSize = left.filesize ?? Number.POSITIVE_INFINITY
      const rightSize = right.filesize ?? Number.POSITIVE_INFINITY

      if (leftSize !== rightSize) {
        return leftSize - rightSize
      }

      const leftPriority = PREVIEW_FORMAT_PRIORITY[left.format.toLowerCase()] ?? Number.MAX_SAFE_INTEGER
      const rightPriority =
        PREVIEW_FORMAT_PRIORITY[right.format.toLowerCase()] ?? Number.MAX_SAFE_INTEGER

      return leftPriority - rightPriority
    })[0]
}

export function normalizeBrowseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): BrowseSearchParams {
  const read = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const page = Number.parseInt(read('page') ?? '1', 10)
  const pageSize = Number.parseInt(read('pageSize') ?? '12', 10)

  return {
    q: read('q')?.trim() || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 12,
    organization: read('organization') || undefined,
    topic: read('topic') || undefined,
    format: read('format') || undefined,
    frequency: read('frequency') || undefined,
    sort: read('sort') || '-last_update',
  }
}

export const getBrowseDatasets = cache(async (params: BrowseSearchParams) => {
  return fetchApi<BrowsePageResponse<BrowseDataset>>('datasets/', {
    q: params.q,
    page: params.page ?? 1,
    page_size: params.pageSize ?? 12,
    organization: params.organization,
    topic: params.topic,
    format: params.format,
    frequency: params.frequency,
    sort: params.sort ?? '-last_update',
  })
})

export const getBrowseDataset = cache(async (id: string) => {
  return fetchApi<BrowseDataset>(`datasets/${id}/`)
})

const getBrowseOrganizations = cache(async () => {
  const firstPage = await fetchApi<
    BrowsePageResponse<{
      id: string
      name: string
      slug: string
      metrics?: { datasets?: number }
    }>
  >('organizations/', {
    page: 1,
    page_size: ORGANIZATION_FACET_PAGE_SIZE,
  })

  const totalPages = Math.ceil(firstPage.total / ORGANIZATION_FACET_PAGE_SIZE)

  if (totalPages <= 1) {
    return firstPage
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchApi<
        BrowsePageResponse<{
          id: string
          name: string
          slug: string
          metrics?: { datasets?: number }
        }>
      >('organizations/', {
        page: index + 2,
        page_size: ORGANIZATION_FACET_PAGE_SIZE,
      })
    )
  )

  return {
    ...firstPage,
    data: [firstPage, ...remainingPages].flatMap(page => page.data),
  }
})

const getBrowseTopics = cache(async () => {
  return fetchApi<BrowsePageResponse<BrowseTopic>>('topics/')
})

const getBrowseFrequencies = cache(async () => {
  return fetchApi<Array<{ id: string; label: string }>>('datasets/frequencies/')
})

function uniqueFacetOptions(values: string[]) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map(value => ({
      value,
      label: value.toUpperCase(),
    }))
}

export function buildFormatFacetOptions(
  datasets: BrowseDataset[],
  selectedFormat?: string
) {
  const formats = uniqueFacetOptions(
    datasets.flatMap(dataset => dataset.resources.map(resource => resource.format?.toLowerCase() ?? ''))
  )

  if (
    selectedFormat &&
    !formats.some(option => option.value === selectedFormat)
  ) {
    return uniqueFacetOptions([...formats.map(option => option.value), selectedFormat.toLowerCase()])
  }

  return formats
}

const getBrowseStaticFacets = createTtlCache(async (): Promise<BrowseStaticFacets> => {
  const [organizations, topics, frequencies] = await Promise.allSettled([
    getBrowseOrganizations(),
    getBrowseTopics(),
    getBrowseFrequencies(),
  ])

  return {
    organizations:
      organizations.status === 'fulfilled'
        ? organizations.value.data.map(organization => ({
            value: organization.slug,
            label: organization.name,
            count: organization.metrics?.datasets,
          }))
        : [],
    topics:
      topics.status === 'fulfilled'
        ? topics.value.data.map(topic => ({
            value: topic.slug,
            label: topic.name,
          }))
        : [],
    frequencies:
      frequencies.status === 'fulfilled'
        ? frequencies.value.map(frequency => ({
            value: frequency.id,
            label: frequency.label,
          }))
        : [],
  }
}, FACET_CACHE_TTL_MS)

export async function getBrowseFacets(
  datasets: BrowseDataset[] = [],
  selectedFormat?: string
): Promise<BrowseFacets> {
  const staticFacets = await getBrowseStaticFacets()

  return {
    ...staticFacets,
    formats: buildFormatFacetOptions(datasets, selectedFormat),
  }
}

export async function getBrowsePageData(searchParams: BrowseSearchParams) {
  const [datasets, staticFacets] = await Promise.all([
    getBrowseDatasets(searchParams),
    getBrowseStaticFacets(),
  ])

  const facets: BrowseFacets = {
    ...staticFacets,
    formats: buildFormatFacetOptions(datasets.data, searchParams.format),
  }

  return { datasets, facets }
}

export async function getDatasetDetailData(id: string) {
  const dataset = await getBrowseDataset(id)
  return {
    dataset,
    previewResource: findPreviewableResource(dataset.resources),
  }
}

function toPreviewValue(value: ParsedDataset['observations'][number][string]) {
  if (value == null) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return String(value)
}

export function toPreviewPayload(dataset: ParsedDataset, limit: number = 100): PreviewPayload {
  const rows = dataset.observations.slice(0, limit).map(observation =>
    Object.fromEntries(
      dataset.columns.map(column => [column, toPreviewValue(observation[column] ?? null)])
    )
  )

  return {
    columns: dataset.columns,
    rows,
    format: dataset.source.format,
  }
}

export function parsePreviewData(
  content: string,
  format: string,
  limit: number = 100
): PreviewPayload {
  return toPreviewPayload(
    parseDatasetContent(content, {
      format,
      rowLimit: limit,
    }),
    limit
  )
}

export async function fetchPreviewPayload(
  resourceUrl: string,
  format: string,
  limit: number = 100
) {
  const dataset = await loadDatasetFromUrl(resourceUrl, {
    format,
    rowLimit: limit,
    fetchInit: {
      cache: 'no-store',
    },
  })

  return toPreviewPayload(dataset, limit)
}
