'use client'

import { useState } from 'react'

import { useDashboardStore, selectChartCount, selectCanAddChart } from '@/stores/dashboard'
import type { DashboardConfig } from '@/types'

interface DashboardShellProps {
  dashboard: DashboardConfig | null
  locale?: string
  labels: {
    title: string
    description: string
    editMode: string
    viewMode: string
    addChart: string
    save: string
    export: string
    import: string
    sharedFilters: string
    maxChartsReached: string
    untitled: string
    saved: string
    saving: string
    charts: string
    lastSaved: string
    exportJson: string
    importJson: string
  }
  onAddChart?: () => void
  onSave?: (dashboard: DashboardConfig) => void
  onExport?: () => void
  onImport?: () => void
}

export function DashboardShell({
  dashboard,
  locale = 'sr-Cyrl',
  labels,
  onAddChart,
  onSave,
  onExport: _onExport,
  onImport: _onImport,
}: DashboardShellProps) {
  const {
    editMode,
    toggleEditMode,
    isDirty,
    saveDashboard,
    toggleSharedFilters,
    setTitle,
    setDescription,
  } = useDashboardStore()

  const chartCount = useDashboardStore(selectChartCount)
  const canAddChart = useDashboardStore(selectCanAddChart)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const saved = saveDashboard()
      if (saved && onSave) {
        onSave(saved)
      }
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-slate-600">No dashboard loaded</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Title and mode toggle */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {isEditingTitle && editMode ? (
              <input
                type="text"
                value={dashboard.title}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
                className="w-full max-w-md rounded-lg border border-gov-primary px-3 py-2 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
              />
            ) : editMode ? (
              <button
                type="button"
                className="text-left text-2xl font-bold text-slate-900 cursor-pointer hover:text-gov-primary"
                onClick={() => setIsEditingTitle(true)}
              >
                {dashboard.title || labels.untitled}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  (click to edit)
                </span>
              </button>
            ) : (
              <h1 className="text-2xl font-bold text-slate-900">
                {dashboard.title || labels.untitled}
              </h1>
            )}
            {editMode ? (
              <textarea
                value={dashboard.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Add a description..."
                className="w-full max-w-lg resize-none rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:border-gov-primary focus:outline-none focus:ring-1 focus:ring-gov-primary/20"
                rows={2}
              />
            ) : (
              dashboard.description && (
                <p className="text-sm text-slate-600">{dashboard.description}</p>
              )
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Edit/View mode toggle */}
            <button
              type="button"
              onClick={toggleEditMode}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                editMode
                  ? 'bg-gov-primary text-white shadow-md'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {editMode ? labels.editMode : labels.viewMode}
            </button>

            {/* Add chart button */}
            {editMode && (
              <button
                type="button"
                onClick={onAddChart}
                disabled={!canAddChart}
                className="flex items-center gap-1.5 rounded-xl bg-gov-accent px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-gov-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {canAddChart ? labels.addChart : labels.maxChartsReached}
              </button>
            )}

            {/* Shared filters toggle */}
            {chartCount > 1 && (
              <button
                type="button"
                onClick={toggleSharedFilters}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  dashboard.sharedFilters.enabled
                    ? 'bg-green-100 text-green-800 ring-1 ring-green-300'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {labels.sharedFilters}
              </button>
            )}

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-gov-primary" />
                  {labels.saving}
                </>
              ) : showSaved ? (
                <>
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {labels.saved}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {labels.save}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-3 text-xs text-slate-500">
          <span>
            {chartCount} {labels.charts}
          </span>
          <span className="text-slate-300">•</span>
          <span>
            {dashboard.updatedAt
              ? `${labels.lastSaved}: ${new Date(dashboard.updatedAt).toLocaleString(locale)}`
              : 'Not saved yet'}
          </span>
          {isDirty && (
            <>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-amber-600">Unsaved changes</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
