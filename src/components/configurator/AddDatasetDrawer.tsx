'use client'

import { useState, useCallback, useEffect } from 'react'

import { inferJoinDimensions, calculateJoinOverlap } from '@/lib/data'
import type { ParsedDataset, JoinSuggestion, DatasetReference } from '@/types'

import { JoinPreview } from './JoinPreview'

interface AddDatasetDrawerProps {
  open: boolean
  onClose: () => void
  primaryDataset: ParsedDataset | null
  labels: {
    title: string
    searchPlaceholder: string
    addDataset: string
    cancel: string
    confirm: string
    loading: string
    joinBy: string
    joinPreview: string
    noMatchingColumns: string
    lowOverlap: string
    selectJoinKey: string
    overlapPercent: string
    matchedColumns: string
    innerJoin: string
    leftJoin: string
  }
  onAddDataset: (ref: DatasetReference, dataset: ParsedDataset, suggestion: JoinSuggestion) => void
  // Mock data for demo - in real app would fetch from API
  availableDatasets?: Array<{ id: string; name: string; resourceId: string }>
  onLoadDataset?: (datasetId: string, resourceId: string) => Promise<ParsedDataset>
}

export function AddDatasetDrawer({
  open,
  onClose,
  primaryDataset,
  labels,
  onAddDataset,
  availableDatasets = [],
  onLoadDataset,
}: AddDatasetDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<{ id: string; name: string; resourceId: string } | null>(null)
  const [loadingDataset, setLoadingDataset] = useState<ParsedDataset | null>(null)
  const [suggestions, setSuggestions] = useState<JoinSuggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<JoinSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredDatasets = availableDatasets.filter(ds =>
    ds.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectDataset = useCallback(async (dataset: { id: string; name: string; resourceId: string }) => {
    setSelectedDataset(dataset)
    setIsLoading(true)

    if (onLoadDataset && primaryDataset) {
      try {
        const loaded = await onLoadDataset(dataset.id, dataset.resourceId)
        setLoadingDataset(loaded)

        // Infer join dimensions
        const inferred = inferJoinDimensions(primaryDataset, loaded)
        setSuggestions(inferred)
        if (inferred.length > 0) {
          setSelectedSuggestion(inferred[0]!)
        }
      } catch (error) {
        console.error('Failed to load dataset:', error)
      }
    }

    setIsLoading(false)
  }, [onLoadDataset, primaryDataset])

  const handleConfirm = useCallback(() => {
    if (selectedDataset && loadingDataset && selectedSuggestion) {
      onAddDataset(
        {
          datasetId: selectedDataset.id,
          resourceId: selectedDataset.resourceId,
          joinKey: selectedSuggestion.secondaryKey,
          prefix: loadingDataset.source.name,
        },
        loadingDataset,
        selectedSuggestion
      )
      // Reset and close
      setSelectedDataset(null)
      setLoadingDataset(null)
      setSuggestions([])
      setSelectedSuggestion(null)
      setSearchQuery('')
      onClose()
    }
  }, [selectedDataset, loadingDataset, selectedSuggestion, onAddDataset, onClose])

  const handleClose = useCallback(() => {
    setSelectedDataset(null)
    setLoadingDataset(null)
    setSuggestions([])
    setSelectedSuggestion(null)
    setSearchQuery('')
    onClose()
  }, [onClose])

  // Reset on close
  useEffect(() => {
    if (!open) {
      handleClose()
    }
  }, [open, handleClose])

  if (!open) return null

  const overlapPercent = selectedSuggestion && primaryDataset && loadingDataset
    ? calculateJoinOverlap(
        primaryDataset,
        loadingDataset,
        selectedSuggestion.primaryKey,
        selectedSuggestion.secondaryKey
      ).overlapPercent
    : 0

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <button
          type="button"
          className="fixed inset-0 bg-black/50 transition-opacity cursor-default"
          onClick={handleClose}
          aria-label="Close drawer"
        />

        {/* Drawer */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">{labels.addDataset}</h3>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!selectedDataset ? (
              <>
                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={labels.searchPlaceholder}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-gov-primary focus:ring-2 focus:ring-gov-primary/20"
                  />
                </div>

                {/* Dataset list */}
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {filteredDatasets.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      No datasets available. In production, this would search data.gov.rs.
                    </p>
                  ) : (
                    filteredDatasets.map(dataset => (
                      <button
                        key={dataset.id}
                        type="button"
                        onClick={() => handleSelectDataset(dataset)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-900">{dataset.name}</div>
                        <div className="text-xs text-slate-500">{dataset.id}</div>
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Selected dataset info */}
                <div className="mb-4 rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-medium text-slate-900">{selectedDataset.name}</div>
                  <div className="text-xs text-slate-500">{selectedDataset.id}</div>
                </div>

                {/* Loading state */}
                {isLoading ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    {labels.loading}
                  </div>
                ) : loadingDataset && primaryDataset ? (
                  <JoinPreview
                    primary={primaryDataset}
                    secondary={loadingDataset}
                    suggestions={suggestions}
                    selectedSuggestion={selectedSuggestion}
                    overlapPercent={overlapPercent}
                    labels={{
                      joinBy: labels.joinBy,
                      joinPreview: labels.joinPreview,
                      noMatchingColumns: labels.noMatchingColumns,
                      lowOverlap: labels.lowOverlap,
                      selectJoinKey: labels.selectJoinKey,
                      overlapPercent: labels.overlapPercent,
                      matchedColumns: labels.matchedColumns,
                      innerJoin: labels.innerJoin,
                      leftJoin: labels.leftJoin,
                    }}
                    onSelectSuggestion={setSelectedSuggestion}
                  />
                ) : (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Unable to load dataset preview
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {selectedDataset && (
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedSuggestion || isLoading}
                className="rounded-xl bg-gov-primary px-4 py-2 text-sm font-medium text-white hover:bg-gov-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {labels.confirm}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
