# Feature Request

## Title
Advanced Table Charts with Grouping and Responsive Layouts

## Problem
Current table charts are basic - they don't support hierarchical data grouping, mobile-responsive layouts, or interactive drill-down. Users with large datasets cannot explore data effectively in table format. The Swiss visualization tool (visualize.admin.ch) provides advanced table features including expandable groups and mobile/desktop layouts.

## Proposed behavior

### Table Features
1. **Grouped Rows** - Group data by a dimension with expandable headers
2. **Sortable Columns** - Click column headers to sort ascending/descending
3. **Responsive Layout** - Card view on mobile, full table on desktop
4. **Linked Cells** - Click cells to filter or navigate to detail view
5. **Status Badges** - Show tags/badges for status indicators

### UI Requirements
- Group header row with expand/collapse toggle
- Column header sorting indicators (↑↓)
- Responsive breakpoint detection (switch to card layout on mobile)
- Cell click handlers for drill-down
- Badge/tag component for status fields

---

## Detailed Implementation

### File 1: Update `src/types/chart-config.ts`

Add table-specific configuration:

```typescript
export interface TableChartConfig extends BaseChartConfig {
  type: 'table';
  fields: {
    columns: TableColumnConfig[];
    groupBy?: ChartField; // For grouped tables
  };
  options: {
    sortable: boolean;
    groupable: boolean;
    responsive: boolean;
    pageSize?: number;
    showRowNumbers: boolean;
    striped: boolean;
  };
}

export interface TableColumnConfig {
  field: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  format?: 'number' | 'date' | 'text' | 'badge';
  sortable?: boolean;
}
```

### File 2: `src/components/charts/table/AdvancedTable.tsx` (new)

```typescript
'use client'

import { memo, useMemo, useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils/cn'
import type { ChartRendererDataRow, TableChartConfig } from '@/types'

interface AdvancedTableProps {
  data: ChartRendererDataRow[]
  config: TableChartConfig
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  onCellClick?: (row: ChartRendererDataRow, column: string) => void
}

type SortDirection = 'asc' | 'desc' | null

interface GroupState {
  [key: string]: boolean // expanded state per group
}

function AdvancedTableComponent({ data, config, locale, onCellClick }: AdvancedTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [expandedGroups, setExpandedGroups] = useState<GroupState>({})
  const [currentPage, setCurrentPage] = useState(0)

  const pageSize = config.options.pageSize ?? 20
  const groupByField = config.fields.groupBy?.field

  // Group data if groupBy is set
  const groupedData = useMemo(() => {
    if (!groupByField) return null

    const groups = new Map<string, ChartRendererDataRow[]>()
    data.forEach(row => {
      const groupKey = String(row[groupByField] ?? 'Other')
      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey)!.push(row)
    })
    return groups
  }, [data, groupByField])

  // Sort data
  const sortedData = useMemo(() => {
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

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = useCallback((column: string) => {
    if (!config.options.sortable) return

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
  }, [config.options.sortable, sortColumn, sortDirection])

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }, [])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Mobile card view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  if (isMobile && config.options.responsive) {
    return (
      <div className="space-y-4">
        {paginatedData.map((row, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
            {config.fields.columns.map(col => (
              <div key={col.field} className="flex justify-between py-1">
                <span className="text-sm text-slate-500">{col.label}</span>
                <span className="font-medium">
                  {formatCellValue(row[col.field], col.format)}
                </span>
              </div>
            ))}
          </div>
        ))}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-1">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className={cn(
        "w-full border-collapse",
        config.options.striped && "[&_tbody_tr:nth-child(odd)]:bg-slate-50"
      )}>
        <thead>
          <tr className="border-b-2 border-slate-200">
            {config.options.showRowNumbers && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">#</th>
            )}
            {groupByField && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 w-8" />
            )}
            {config.fields.columns.map(col => (
              <th
                key={col.field}
                onClick={() => col.sortable !== false && handleSort(col.field)}
                className={cn(
                  "px-4 py-3 text-sm font-semibold text-slate-600",
                  col.sortable !== false && "cursor-pointer hover:bg-slate-50",
                  col.align === 'right' && "text-right",
                  col.align === 'center' && "text-center"
                )}
                style={{ width: col.width }}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortColumn === col.field && (
                    sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {groupedData ? (
            // Grouped rendering
            Array.from(groupedData.entries()).map(([groupKey, rows]) => (
              <tbody key={groupKey}>
                <tr
                  className="bg-slate-100 cursor-pointer hover:bg-slate-200"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <td colSpan={config.fields.columns.length + (config.options.showRowNumbers ? 1 : 0) + (groupByField ? 1 : 0)} className="px-4 py-2 font-semibold">
                    <div className="flex items-center gap-2">
                      {expandedGroups[groupKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      {groupKey} ({rows.length})
                    </div>
                  </td>
                </tr>
                {expandedGroups[groupKey] && rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    {config.options.showRowNumbers && (
                      <td className="px-4 py-2 text-sm text-slate-500">{idx + 1}</td>
                    )}
                    {config.fields.columns.map(col => (
                      <td
                        key={col.field}
                        onClick={() => onCellClick?.(row, col.field)}
                        className={cn(
                          "px-4 py-2 text-sm",
                          onCellClick && "cursor-pointer hover:text-gov-primary"
                        )}
                      >
                        {formatCellValue(row[col.field], col.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))
          ) : (
            // Regular rendering
            paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                {config.options.showRowNumbers && (
                  <td className="px-4 py-2 text-sm text-slate-500">{currentPage * pageSize + idx + 1}</td>
                )}
                {config.fields.columns.map(col => (
                  <td
                    key={col.field}
                    onClick={() => onCellClick?.(row, col.field)}
                    className={cn(
                      "px-4 py-2 text-sm",
                      col.align === 'right' && "text-right",
                      col.align === 'center' && "text-center",
                      onCellClick && "cursor-pointer hover:text-gov-primary"
                    )}
                  >
                    {formatCellValue(row[col.field], col.format)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <p className="text-sm text-slate-500">
            Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatCellValue(value: unknown, format?: string): React.ReactNode {
  if (value == null) return '-'

  switch (format) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value
    case 'date':
      try {
        return format(new Date(String(value)), 'dd.MM.yyyy')
      } catch {
        return String(value)
      }
    case 'badge':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gov-primary/10 text-gov-primary">
          {String(value)}
        </span>
      )
    default:
      return String(value)
  }
}

export const AdvancedTable = memo(AdvancedTableComponent)
```

### File 3: Update `src/components/configurator/MappingStep.tsx`

Add table column configuration:

```typescript
{config.type === 'table' && (
  <TableColumnConfigurator
    fields={availableFields}
    columns={config.fields.columns}
    onChange={(columns) => updateConfig({ fields: { ...config.fields, columns } })}
  />
)}
```

---

## Affected areas
- `src/types/chart-config.ts` - Add TableChartConfig
- `src/components/charts/table/AdvancedTable.tsx` (new) - Main table component
- `src/components/configurator/MappingStep.tsx` - Add table column configuration
- `src/components/charts/ChartRenderer.tsx` - Use AdvancedTable for table type
- `src/locales/*.json` - Add translations

## Constraints
- Must handle 10,000+ rows with virtualization for performance
- Mobile card view must work on screens < 640px
- Sorting should work on all data, not just current page
- Group expansion state should persist during sort

## Out of scope
- Inline editing of cells
- Excel export from table (separate feature)
- Column resizing by drag

## Acceptance criteria
- [ ] Table displays columns as configured
- [ ] Column headers sort ascending/descending on click
- [ ] Third click clears sort
- [ ] Grouped tables show expand/collapse icons
- [ ] Group headers show row count
- [ ] Mobile view switches to card layout
- [ ] Pagination shows correct totals
- [ ] Row numbers optional but functional
- [ ] Badge format renders styled badges
- [ ] Date format uses locale-aware formatting
