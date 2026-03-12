'use client'

import { useState, useCallback } from 'react'

import { getDatasetDetailData, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'
import { loadDatasetFromUrl } from '@/lib/data'
import { useConfiguratorStore } from '@/stores/configurator'
import type { Dataset } from '@/types'

interface DatasetStepProps {
  labels?: {
    select_dataset?: string
    select_resource?: string
    search_datasets?: string
    no_datasets?: string
    loading_dataset?: string
    load_error?: string
    dataset_info?: string
    organization?: string
    dimensions?: string
    measures?: string
    rows?: string
    preview_data?: string
    next?: string
  }
}

export function DatasetStep(props: DatasetStepProps) {
  const labels = {
    select_dataset: 'Select dataset',
    select_resource: 'Select resource',
    search_datasets: 'Search datasets...',
    no_datasets: 'No datasets found',
    loading_dataset: 'Loading dataset...',
    load_error: 'Error loading dataset',
    dataset_info: 'Dataset info',
    organization: 'Organization',
    dimensions: 'Dimensions',
    measures: 'Measures',
    rows: 'Rows',
    preview_data: 'Preview data',
    next: 'Next',
    ...props?.labels,
  }

  const { 
    datasetId, 
    parsedDataset, 
    datasetTitle,
    organizationName,
    setDataset 
  } = useConfiguratorStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Dataset[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDatasetPicker, setShowDatasetPicker] = useState(!datasetId)

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/browse?q=${encodeURIComponent(query)}&pageSize=10`)
      const data = await response.json()
      setSearchResults(data.data || [])
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleDatasetSelect = useCallback(async (dataset: Dataset) => {
    setIsLoading(true)
    setError(null)

    try {
      const { dataset: fullDataset, previewResource } = await getDatasetDetailData(dataset.id)
      
      if (previewResource && isPreviewableFormat(previewResource.format)) {
        const previewUrl = new URL(previewResource.url)
        
        if (isAllowedPreviewHost(previewUrl.hostname)) {
          const parsed = await loadDatasetFromUrl(previewResource.url, {
            datasetId: fullDataset.id,
            resourceId: previewResource.id,
            resourceUrl: previewResource.url,
            format: previewResource.format,
            rowLimit: 500,
          })

          setDataset({
            datasetId: fullDataset.id,
            resourceId: previewResource.id,
            datasetTitle: fullDataset.title,
            organizationName: fullDataset.organization?.name,
            parsedDataset: parsed,
          })

          setShowDatasetPicker(false)
        } else {
          setError('Resource host not allowed for preview')
        }
      } else {
        setError('No previewable resource available')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.load_error)
    } finally {
      setIsLoading(false)
    }
  }, [labels.load_error, setDataset])

  // If dataset is already selected, show info
  if (!showDatasetPicker && datasetId && parsedDataset) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900">{datasetTitle}</h3>
          {organizationName && (
            <p className="mt-1 text-sm text-blue-700">{labels.organization}: {organizationName}</p>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white p-2 text-center">
              <p className="text-xs text-slate-500">{labels.dimensions}</p>
              <p className="text-lg font-semibold text-slate-900">{parsedDataset.dimensions.length}</p>
            </div>
            <div className="rounded-xl bg-white p-2 text-center">
              <p className="text-xs text-slate-500">{labels.measures}</p>
              <p className="text-lg font-semibold text-slate-900">{parsedDataset.measures.length}</p>
            </div>
            <div className="rounded-xl bg-white p-2 text-center">
              <p className="text-xs text-slate-500">{labels.rows}</p>
              <p className="text-lg font-semibold text-slate-900">{parsedDataset.rowCount}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDatasetPicker(true)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Choose a different dataset
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">{labels.select_dataset}</h3>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={labels.search_datasets}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
            <p className="mt-2 text-sm text-slate-600">{labels.loading_dataset}</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search results */}
      {searchResults.length > 0 && !isLoading && (
        <ul className="max-h-[400px] space-y-2 overflow-y-auto">
          {searchResults.map((dataset) => (
            <li key={dataset.id}>
              <button
                type="button"
                onClick={() => handleDatasetSelect(dataset)}
                className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-gov-primary hover:bg-blue-50/50"
              >
                <p className="font-medium text-slate-900">{dataset.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {dataset.organization?.name} • {dataset.resources?.length || 0} resources
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="py-8 text-center text-sm text-slate-500">
          {labels.no_datasets}
        </div>
      )}

      {/* Hint when no search */}
      {!searchQuery && (
        <div className="py-8 text-center text-sm text-slate-500">
          Start typing to search for datasets from data.gov.rs
        </div>
      )}
    </div>
  )
}
