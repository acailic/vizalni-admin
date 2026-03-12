'use client'

import { useState, useCallback, useMemo, type ReactNode } from 'react'
import type { ChartConfig, ChartRendererDataRow } from '@/types'

interface AccessibleTableProps {
  config: ChartConfig
  data: ChartRendererDataRow[]
  className?: string
  labels?: {
    showTable?: string
    hideTable?: string
    noData?: string
  }
}

/**
 * Accessible data table component for charts.
 * Provides a screen-reader-friendly alternative to visual charts.
 * Can be toggled visible for all users via "Show as table" button.
 */
export function AccessibleTable({
  config,
  data,
  className = '',
  labels = {},
}: AccessibleTableProps) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleTable = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  // Extract column headers from config
  const columns = useMemo(() => {
    const cols: { key: string; label: string }[] = []

    // X-axis
    if (config.x_axis) {
      cols.push({
        key: config.x_axis.field,
        label: config.x_axis.label || config.x_axis.field,
      })
    }

    // Y-axis (measures)
    if (config.y_axis) {
      cols.push({
        key: config.y_axis.field,
        label: config.y_axis.label || config.y_axis.field,
      })
    }

    // For pie charts, use category and value
    if (config.type === 'pie' && config.x_axis) {
      const categoryField = config.x_axis.field
      const valueField = config.y_axis?.field || 'value'
      return [
        { key: categoryField, label: config.x_axis.label || categoryField },
        { key: valueField, label: config.y_axis?.label || valueField },
      ]
    }

    // Add secondary field for combo charts
    if (config.options?.secondaryField) {
      cols.push({
        key: config.options.secondaryField,
        label: config.options.secondaryField,
      })
    }

    return cols
  }, [config])

  // Format cell value for display
  const formatValue = useCallback((value: unknown, _key: string): ReactNode => {
    if (value === null || value === undefined) {
      return '—'
    }
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    return String(value)
  }, [])

  // Get chart type description for aria-label
  const chartTypeDescription = useMemo(() => {
    const typeMap: Record<string, string> = {
      line: 'Line chart',
      bar: 'Bar chart',
      column: 'Column chart',
      area: 'Area chart',
      pie: 'Pie chart',
      scatterplot: 'Scatterplot',
      table: 'Data table',
      combo: 'Combination chart',
      map: 'Choropleth map',
    }
    return typeMap[config.type] || 'Chart'
  }, [config.type])

  const showTableLabel = labels.showTable || 'Show as table'
  const hideTableLabel = labels.hideTable || 'Hide table'
  const noDataLabel = labels.noData || 'No data available'

  return (
    <div className={`accessible-table-container ${className}`}>
      {/* Toggle button - always visible */}
      <button
        type="button"
        onClick={toggleTable}
        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
        aria-expanded={isVisible}
        aria-controls={`accessible-table-${config.id || 'chart'}`}
      >
        {isVisible ? (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            {hideTableLabel}
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {showTableLabel}
          </>
        )}
      </button>

      {/* Table container - toggleable visibility */}
      <div
        id={`accessible-table-${config.id || 'chart'}`}
        className={`mt-4 overflow-x-auto ${isVisible ? 'block' : 'sr-only'}`}
        role="region"
        aria-label={`${chartTypeDescription} data: ${config.title}`}
      >
        {data.length === 0 ? (
          <p className="text-sm text-slate-600">{noDataLabel}</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 border border-slate-200">
            <caption className="sr-only">
              {chartTypeDescription} showing {config.title}.{' '}
              {config.description || ''}
            </caption>
            <thead className="bg-slate-50">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${rowIndex}-${col.key}`}
                      className={`whitespace-nowrap px-4 py-3 text-sm text-slate-700 ${
                        colIndex === 0 ? 'font-medium' : ''
                      }`}
                      // First column is typically a category/header
                      {...(colIndex === 0 ? { scope: 'row' as const } : {})}
                    >
                      {formatValue(row[col.key], col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/**
 * Hook to generate accessible chart summary for aria-describedby
 */
export function useChartSummary(
  data: ChartRendererDataRow[],
  measureField: string,
  dimensionField?: string
): string {
  return useMemo(() => {
    if (data.length === 0) {
      return 'No data available.'
    }

    const values = data
      .map(row => {
        const val = row[measureField]
        return typeof val === 'number' ? val : null
      })
      .filter((v): v is number => v !== null)

    if (values.length === 0) {
      return `${data.length} data points. Values not available.`
    }

    const max = Math.max(...values)
    const min = Math.min(...values)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length

    // Find max/min labels if dimension exists
    let maxLabel = ''
    let minLabel = ''
    if (dimensionField) {
      const maxItem = data.find(row => row[measureField] === max)
      const minItem = data.find(row => row[measureField] === min)
      maxLabel = maxItem?.[dimensionField] ? ` (${maxItem[dimensionField]})` : ''
      minLabel = minItem?.[dimensionField] ? ` (${minItem[dimensionField]})` : ''
    }

    const parts = [
      `${data.length} data points.`,
      `Highest: ${max.toLocaleString()}${maxLabel}.`,
      `Lowest: ${min.toLocaleString()}${minLabel}.`,
      `Average: ${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}.`,
    ]

    // Detect trend if temporal data
    if (values.length >= 2) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2))
      const secondHalf = values.slice(Math.floor(values.length / 2))
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

      if (secondAvg > firstAvg * 1.05) {
        parts.push('Overall trend: increasing.')
      } else if (secondAvg < firstAvg * 0.95) {
        parts.push('Overall trend: decreasing.')
      }
    }

    return parts.join(' ')
  }, [data, measureField, dimensionField])
}

export default AccessibleTable
