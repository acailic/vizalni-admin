'use client'

import { useState, useCallback, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Save, Check, Loader2, AlertCircle } from 'lucide-react'

import { useConfiguratorStore } from '@/stores/configurator'
import type { ChartConfig } from '@/types/chart-config'

interface SaveButtonProps {
  locale: string
  labels: {
    save: string
    saved: string
    saving: string
    saveAsNew: string
    publish: string
    error: string
    unsavedChanges: string
  }
  onSaved?: (chartId: string) => void
}

export function SaveButton({ locale, labels, onSaved }: SaveButtonProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    config,
    datasetId,
    datasetTitle,
    savedChartId,
    isDirty,
    setSavedChartId,
    setIsDirty,
  } = useConfiguratorStore()

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      if (!config.type || !datasetId) {
        setSaveError('Cannot save: missing chart configuration or dataset')
        return
      }

      setIsSaving(true)
      setSaveError(null)

      try {
        const payload = {
          title: config.title || datasetTitle || 'Untitled Chart',
          description: config.description,
          config: config as ChartConfig,
          datasetIds: [datasetId],
          chartType: config.type,
        }

        let response: Response

        if (savedChartId) {
          // Update existing chart
          response = await fetch(`/api/charts/${savedChartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        } else {
          // Create new chart
          response = await fetch('/api/charts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        }

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save chart')
        }

        const savedChart = await response.json()
        setSavedChartId(savedChart.id)
        setIsDirty(false)
        setLastSaved(new Date())

        if (!isAutoSave && onSaved) {
          onSaved(savedChart.id)
        }
      } catch (error) {
        console.error('Failed to save chart:', error)
        setSaveError(error instanceof Error ? error.message : labels.error)
      } finally {
        setIsSaving(false)
      }
    },
    [config, datasetId, datasetTitle, savedChartId, setSavedChartId, setIsDirty, onSaved, labels.error]
  )

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    if (!isDirty || !config.type || !datasetId) return

    const interval = setInterval(() => {
      handleSave(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [isDirty, config, datasetId, handleSave])

  const handleSaveAsNew = useCallback(async () => {
    // Clear saved ID to create a new chart
    setSavedChartId(null)
    setIsDirty(true)
    await handleSave(false)
  }, [setSavedChartId, setIsDirty, handleSave])

  const handlePublish = useCallback(async () => {
    if (!savedChartId) {
      // Save first, then publish
      await handleSave(false)
    }

    if (!savedChartId && !useConfiguratorStore.getState().savedChartId) {
      setSaveError('Cannot publish: failed to save chart')
      return
    }

    const chartId = savedChartId || useConfiguratorStore.getState().savedChartId
    if (!chartId) return

    try {
      const response = await fetch(`/api/charts/${chartId}/publish`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to publish chart')
      }

      // Navigate to the published chart
      router.push(`/${locale}/v/${chartId}`)
    } catch (error) {
      console.error('Failed to publish:', error)
      setSaveError(error instanceof Error ? error.message : labels.error)
    }
  }, [savedChartId, handleSave, router, locale, labels.error])

  return (
    <div className="space-y-3">
      {/* Status indicators */}
      {lastSaved && !isDirty && (
        <p className="flex items-center gap-1.5 text-sm text-green-600">
          <Check className="h-4 w-4" />
          {labels.saved}
        </p>
      )}
      {isDirty && lastSaved && (
        <p className="text-sm text-amber-600">{labels.unsavedChanges}</p>
      )}
      {saveError && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {saveError}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={isSaving || !config.type || !datasetId}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {labels.saving}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {savedChartId ? labels.save : labels.save}
            </>
          )}
        </button>

        {savedChartId && (
          <button
            type="button"
            onClick={handleSaveAsNew}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {labels.saveAsNew}
          </button>
        )}

        {savedChartId && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {labels.publish}
          </button>
        )}
      </div>
    </div>
  )
}
