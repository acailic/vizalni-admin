'use client'

import { useState } from 'react'

import type { ChartConfig } from '@/types'

interface DashboardChartCardProps {
  chartId: string
  config: ChartConfig
  isSelected: boolean
  editMode: boolean
  labels: {
    loading: string
    error: string
    remove: string
    edit: string
    configure: string
  }
  onClick?: () => void
  onEdit?: () => void
  onRemove?: () => void
  children?: React.ReactNode
  isDragging?: boolean
}

export function DashboardChartCard({
  chartId,
  config,
  isSelected,
  editMode,
  labels,
  onClick,
  onEdit,
  onRemove,
  children,
  isDragging = false,
}: DashboardChartCardProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const borderColor = isSelected
    ? 'border-gov-primary ring-2 ring-gov-primary/20'
    : editMode
      ? 'border-slate-300 border-dashed hover:border-gov-primary hover:border-solid'
      : 'border-slate-200'

  const cardOpacity = isDragging ? 'opacity-90' : 'opacity-100'

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showRemoveConfirm) {
      onRemove?.()
      setShowRemoveConfirm(false)
    } else {
      setShowRemoveConfirm(true)
      // Auto-hide after 3 seconds
      setTimeout(() => setShowRemoveConfirm(false), 3000)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.()
  }

  const hasConfig = config.x_axis?.field || config.y_axis?.field || config.dataset_id

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white shadow-sm transition-all ${
        editMode ? 'cursor-pointer hover:shadow-md' : ''
      } ${borderColor} ${cardOpacity}`}
      onClick={editMode ? onClick : undefined}
      role={editMode ? 'button' : undefined}
      tabIndex={editMode ? 0 : undefined}
      onKeyDown={editMode ? e => e.key === 'Enter' && onClick?.() : undefined}
    >
      {/* Header */}
      <div className="dashboard-chart-header flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {editMode && (
            <div className="cursor-move text-slate-400 hover:text-slate-600" title="Drag to move">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {config.title || `Chart ${chartId.split('-').pop()}`}
            </h3>
            {config.description && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{config.description}</p>
            )}
          </div>
        </div>
        {editMode && (
          <div className="ml-2 flex shrink-0 gap-1">
            <button
              type="button"
              onClick={handleEditClick}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              title={labels.edit}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRemoveClick}
              className={`rounded-lg p-2 transition ${
                showRemoveConfirm
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
              }`}
              title={showRemoveConfirm ? 'Click again to confirm' : labels.remove}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-2">
        {hasConfig ? (
          children
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
            <div className="rounded-xl bg-slate-50 p-6">
              <svg
                className="mx-auto h-10 w-10 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-600">{labels.configure}</p>
              {editMode && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="mt-2 text-xs font-medium text-gov-primary hover:underline"
                >
                  Click to configure
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
