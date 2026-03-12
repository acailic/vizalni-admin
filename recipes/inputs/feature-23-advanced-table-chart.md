# Feature Request

## Title
Advanced Table Chart - Grouped rows with expand/collapse

## Problem
The current table view is a flat list. For hierarchical data (e.g., regions > districts > municipalities), users must scroll through long lists. The Swiss visualization tool supports grouped tables with expandable headers for hierarchical dimensions, making navigation much easier.

## Proposed behavior

### Grouping Features
- Hierarchical rows grouped under expandable headers
- Click header to expand/collapse group
- Indentation for nested levels
- Group aggregation (sum/avg) in header row
- Breadcrumb navigation for deep hierarchies

### Column Features
- Sortable columns (click header to sort)
- Resizable columns (drag column border)
- Fixed/scrollable columns
- Custom column order via drag and drop

### Cell Features
- Linked cells (click to filter other charts)
- Tag/badge support for status values
- Sparkline mini-charts in cells
- Conditional formatting (color scales)

---

## Detailed Implementation

### File 1: `src/components/charts/table/GroupHeader.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface GroupHeaderProps {
  label: string
  level: number
  expanded: boolean
  onToggle: () => void
  aggregateValue?: string | number
  rowCount: number
  labels?: {
    expand?: string
    collapse?: string
    rows?: string
  }
}

function GroupHeaderComponent({
  label,
  level,
  expanded,
  onToggle,
  aggregateValue,
  rowCount,
  labels,
}: GroupHeaderProps) {
  const l = {
    expand: 'Expand group',
    collapse: 'Collapse group',
    rows: 'rows',
    ...labels,
  }

  return (
    <tr
      className={cn(
        'group-header',
        'bg-slate-50 hover:bg-slate-100 transition-colors'
      )}
      style={{ paddingLeft: `${level * 16}px` }}
    >
      <td colSpan={100} className="py-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-2 text-left"
          aria-expanded={expanded}
          aria-label={expanded ? l.collapse : l.expand}
        >
          <span
            className={cn(
              'inline-block transition-transform',
              expanded && 'rotate-90'
            )}
          >
            ▶
          </span>
          <span className="font-medium text-slate-900">{label}</span>
          <span className="text-sm text-slate-500">
            ({rowCount} {l.rows})
          </span>
          {aggregateValue !== undefined && (
            <span className="ml-auto text-sm font-medium text-gov-primary">
              {aggregateValue}
            </span>
          )}
        </button>
      </td>
    </tr>
  )
}

export const GroupHeader = memo(GroupHeaderComponent)
```

### File 2: `src/components/charts/table/TableChart.tsx` (new)

```typescript
'use client'

import { memo, useState, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { GroupHeader } from './GroupHeader'
import { TableCell } from './TableCell'
import type { ChartRendererDataRow } from '@/types'

interface TableChartProps {
  data: ChartRendererDataRow[]
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    width?: number | string
  }>
  groupBy?: string
  groupAggregation?: 'sum' | 'avg' | 'count'
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    expand?: string
    collapse?: string
    rows?: string
    sortAscending?: string
    sortDescending?: string
  }
  className?: string
}

interface GroupState {
  [groupKey: string]: boolean
}

function TableChartComponent({
  data,
  columns,
  groupBy,
  groupAggregation = 'sum',
  locale,
  labels,
  className,
}: TableChartProps) {
  const [groupState, setGroupState] = useState<GroupState>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Group data if groupBy is specified
  const groupedData = useMemo(() => {
    if (!groupBy) return null

    const groups: Record<string, ChartRendererDataRow[]> = {}
    for (const row of data) {
      const groupKey = String(row[groupBy])
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(row)
    }
    return groups
  }, [data, groupBy])

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setGroupState(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  // Handle column sort
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  // Calculate aggregate value for a group
  const getAggregateValue = (rows: ChartRendererDataRow[], valueColumn?: string) => {
    if (!valueColumn) return undefined
    const values = rows.map(r => Number(r[valueColumn])).filter(v => !isNaN(v))
    if (values.length === 0) return undefined

    switch (groupAggregation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0)
      case 'avg':
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      case 'count':
        return values.length
      default:
        return undefined
    }
  }

  return (
    <div className={cn('overflow-auto rounded-lg border border-slate-200', className)}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-700',
                  col.sortable && 'cursor-pointer hover:bg-slate-200'
                )}
                style={{ width: col.width }}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortColumn === col.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedData ? (
            // Grouped rendering
            Object.entries(groupedData).map(([groupKey, rows]) => (
              <>
                <GroupHeader
                  key={`header-${groupKey}`}
                  label={groupKey}
                  level={0}
                  expanded={!!groupState[groupKey]}
                  onToggle={() => toggleGroup(groupKey)}
                  aggregateValue={getAggregateValue(rows, columns[columns.length - 1]?.key)}
                  rowCount={rows.length}
                  labels={labels}
                />
                {groupState[groupKey] && rows.map((row, idx) => (
                  <tr key={`row-${groupKey}-${idx}`} className="hover:bg-slate-50">
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        value={row[col.key]}
                        column={col}
                      />
                    ))}
                  </tr>
                ))}
              </>
            ))
          ) : (
            // Flat rendering
            data.map((row, idx) => (
              <tr key={`row-${idx}`} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    value={row[col.key]}
                    column={col}
                  />
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export const TableChart = memo(TableChartComponent)
```

### File 3: `src/components/charts/table/TableCell.tsx` (new)

```typescript
'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface TableCellProps {
  value: any
  column: {
    key: string
    type?: 'text' | 'number' | 'date' | 'badge' | 'link'
    format?: string
    badgeColors?: Record<string, string>
  }
  onClick?: () => void
}

function TableCellComponent({ value, column, onClick }: TableCellProps) {
  const { type = 'text', format, badgeColors } = column

  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return '—'

    switch (type) {
      case 'number':
        return format
          ? new Intl.NumberFormat('sr-RS').format(Number(value))
          : value
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'badge':
        return value
      default:
        return String(value)
    }
  }, [value, type, format])

  if (type === 'badge') {
    const badgeColor = badgeColors?.[value] || 'bg-slate-100 text-slate-700'
    return (
      <td className="px-4 py-2" onClick={onClick}>
        <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', badgeColor)}>
          {formattedValue}
        </span>
      </td>
    )
  }

  if (type === 'link') {
    return (
      <td className="px-4 py-2" onClick={onClick}>
        <button className="text-gov-primary hover:underline">
          {formattedValue}
        </button>
      </td>
    )
  }

  return (
    <td
      className={cn(
        'px-4 py-2',
        type === 'number' && 'text-right tabular-nums'
      )}
      onClick={onClick}
    >
      {formattedValue}
    </td>
  )
}

export const TableCell = memo(TableCellComponent)
```

### File 4: Update chart type configuration

Add table-specific options to configurator:

```typescript
// In chart configurator
{config.type === 'table' && (
  <>
    <FieldSelector
      label="Group by (optional)"
      field="groupBy"
      options={dimensions}
      optional
    />
    <SelectField
      label="Group aggregation"
      field="groupAggregation"
      options={[
        { value: 'sum', label: 'Sum' },
        { value: 'avg', label: 'Average' },
        { value: 'count', label: 'Count' },
      ]}
    />
    <ColumnOrderEditor
      columns={config.fields.columns}
      onChange={(columns) => updateConfig({ fields: { ...config.fields, columns } })}
    />
  </>
)}
```

### File 5: Add translations

**`src/locales/en.json`**:
```json
{
  "chartTypes": {
    "table": "Table"
  },
  "tableChart": {
    "groupBy": "Group by",
    "groupAggregation": "Group aggregation",
    "sum": "Sum",
    "avg": "Average",
    "count": "Count",
    "expandGroup": "Expand group",
    "collapseGroup": "Collapse group",
    "rows": "rows",
    "sortAscending": "Sort ascending",
    "sortDescending": "Sort descending"
  }
}
```

---

## Affected areas
- `src/components/charts/table/GroupHeader.tsx` (new)
- `src/components/charts/table/TableChart.tsx` (new)
- `src/components/charts/table/TableCell.tsx` (new)
- `src/components/charts/table/index.ts` - Export components
- `src/components/configurator/` - Add table configuration options
- `src/locales/*.json` - Translations

## Constraints
- Must handle large datasets efficiently (virtualization)
- Keyboard navigation for expand/collapse
- Accessible table structure (ARIA)
- Responsive on mobile (horizontal scroll or card view)
- Support 3+ levels of hierarchy

## Out of scope
- Inline editing of cells
- Row selection/multi-select
- Export table data (separate feature)

## Acceptance criteria
- [ ] Table chart type available in configurator
- [ ] Can select columns to display
- [ ] Can optionally group by a dimension
- [ ] Group headers are expandable/collapsible
- [ ] Group header shows aggregate value
- [ ] Clicking column header sorts table
- [ ] Sort indicator shows current sort direction
- [ ] Badge-type cells render with colors
- [ ] Number cells are right-aligned
- [ ] Table scrolls horizontally on narrow screens
- [ ] All text translated in all three locales
