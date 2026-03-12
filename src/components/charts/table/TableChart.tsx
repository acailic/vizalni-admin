'use client'

import { useCallback, useMemo, useState } from 'react'

import { getTableColumns } from '@/components/charts/shared/chart-data'
import { formatChartValue } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'
import type { SortDirection } from '@/types/table-chart'

export function TableChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
}: ChartRendererComponentProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const columns = getTableColumns(data, config)
  const pageSize = config.options?.pageSize ?? 10
  // Enable sorting by default for table charts
  const sortable = true

  const handleSort = useCallback(
    (column: string) => {
      if (!sortable) return

      if (sortColumn === column) {
        if (sortDirection === 'asc') {
          setSortDirection('desc')
        } else if (sortDirection === 'desc') {
          setSortColumn(null)
          setSortDirection(null)
        }
      } else {
        setSortColumn(column)
        setSortDirection('asc')
      }
      // Reset to first page when sorting
      setCurrentPage(0)
    },
    [sortable, sortColumn, sortDirection]
  )

  const sortedRows = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      let comparison = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal), locale)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection, locale])

  const paginatedRows = useMemo(() => {
    return sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [sortedRows, currentPage, pageSize])

  const totalPages = Math.ceil(sortedRows.length / pageSize)

  if (!data.length || !columns.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No rows available for this table."
      />
    )
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
    >
      <div className="h-full overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className={`px-4 py-3 font-medium text-slate-700 ${sortable ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {column}
                    {sortColumn === column && (
                      <span className="text-gov-primary">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedRows.map((row, index) => (
              <tr key={`${config.title}-${index}`} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-slate-600">
                    {formatChartValue(row[column], locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sortedRows.length)}{' '}
              of {sortedRows.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </ChartFrame>
  )
}
