# Feature Request

## Title
Time Range Brush Component - Interactive date range selection

## Problem
The current date filter uses separate "from" and "to" inputs. Users cannot see the overview of the data while selecting ranges. The Swiss visualization tool uses a brush component - a mini-preview of the data with a draggable range selection, making date range selection intuitive and visual.

## Proposed behavior

### Brush Features
- Mini-preview chart showing data distribution over time
- Draggable handles for start/end of range
- Shaded area shows selected range
- Snap to data points
- Brush can be moved as a whole (drag center)
- Zoom controls for detailed selection

### UI Integration
- Appears when time-based data is detected
- Alternative to separate date inputs
- Sync with existing time range filter state
- Responsive width based on container

---

## Detailed Implementation

### File 1: `src/components/charts/shared/TimeRangeBrush.tsx` (new)

```typescript
'use client'

import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { scaleTime, scaleLinear } from 'd3-scale'
import { area, line } from 'd3-shape'
import { extent, max } from 'd3-array'
import { cn } from '@/lib/utils/cn'

interface TimeRangeBrushProps {
  data: Array<{ date: Date; value: number }>
  range: { from: Date | null; to: Date | null }
  onRangeChange: (range: { from: Date; to: Date }) => void
  width: number
  height?: number
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  labels?: {
    from?: string
    to?: string
    selection?: string
  }
  className?: string
}

function TimeRangeBrushComponent({
  data,
  range,
  onRangeChange,
  width,
  height = 60,
  locale,
  labels,
  className,
}: TimeRangeBrushProps) {
  const l = {
    from: 'From',
    to: 'To',
    selection: 'Selected range',
    ...labels,
  }

  const brushRef = useRef<SVGGElement>(null)
  const [isDragging, setIsDragging] = useState<'left' | 'right' | 'center' | null>(null)

  const margins = { top: 10, right: 10, bottom: 20, left: 10 }
  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  // Create scales
  const xScale = scaleTime()
    .domain(extent(data, d => d.date) as [Date, Date])
    .range([0, innerWidth])

  const yScale = scaleLinear()
    .domain([0, max(data, d => d.value) ?? 0])
    .range([innerHeight, 0])

  // Create area generator for mini preview
  const areaPath = area<{ date: Date; value: number }>()
    .x(d => xScale(d.date))
    .y0(innerHeight)
    .y(d => yScale(d.value))
    (data)

  // Create line generator
  const linePath = line<{ date: Date; value: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    (data)

  // Convert selection to pixel coordinates
  const selectionX = {
    left: range.from ? xScale(range.from) : 0,
    right: range.to ? xScale(range.to) : innerWidth,
  }

  // Handle drag
  const handleMouseDown = useCallback((type: 'left' | 'right' | 'center') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(type)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!brushRef.current) return

      const rect = brushRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - margins.left
      const date = xScale.invert(x)

      if (isDragging === 'left') {
        const newFrom = date < (range.to ?? new Date()) ? date : range.to!
        onRangeChange({ from: newFrom, to: range.to ?? new Date() })
      } else if (isDragging === 'right') {
        const newTo = date > (range.from ?? new Date(0)) ? date : range.from!
        onRangeChange({ from: range.from ?? new Date(0), to: newTo })
      } else if (isDragging === 'center') {
        // Move entire selection
        const selectionWidth = selectionX.right - selectionX.left
        const newLeft = Math.max(0, Math.min(innerWidth - selectionWidth, x - selectionWidth / 2))
        const newRight = newLeft + selectionWidth
        onRangeChange({
          from: xScale.invert(newLeft),
          to: xScale.invert(newRight),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, range, selectionX, xScale, onRangeChange, innerWidth, margins])

  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'sr-RS', {
      year: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-2', className)}>
      <svg
        ref={brushRef as any}
        width={width}
        height={height}
        className="time-range-brush"
      >
        <g transform={`translate(${margins.left},${margins.top})`}>
          {/* Mini preview area */}
          {areaPath && (
            <path
              d={areaPath}
              fill="#e2e8f0"
            />
          )}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1}
            />
          )}

          {/* Unselected overlay (left) */}
          <rect
            x={0}
            y={0}
            width={selectionX.left}
            height={innerHeight}
            fill="rgba(0,0,0,0.3)"
          />

          {/* Unselected overlay (right) */}
          <rect
            x={selectionX.right}
            y={0}
            width={innerWidth - selectionX.right}
            height={innerHeight}
            fill="rgba(0,0,0,0.3)"
          />

          {/* Selection area */}
          <rect
            x={selectionX.left}
            y={0}
            width={selectionX.right - selectionX.left}
            height={innerHeight}
            fill="rgba(37,99,235,0.1)"
            stroke="rgb(37,99,235)"
            strokeWidth={1}
            style={{ cursor: isDragging === 'center' ? 'grab' : 'default' }}
            onMouseDown={handleMouseDown('center')}
          />

          {/* Left handle */}
          <rect
            x={selectionX.left - 4}
            y={0}
            width={8}
            height={innerHeight}
            fill="rgb(37,99,235)"
            rx={2}
            style={{ cursor: 'ew-resize' }}
            onMouseDown={handleMouseDown('left')}
          />

          {/* Right handle */}
          <rect
            x={selectionX.right - 4}
            y={0}
            width={8}
            height={innerHeight}
            fill="rgb(37,99,235)"
            rx={2}
            style={{ cursor: 'ew-resize' }}
            onMouseDown={handleMouseDown('right')}
          />

          {/* Axis labels */}
          <text x={0} y={innerHeight + 15} fontSize={10} fill="#64748b">
            {range.from ? formatDate(range.from) : '...'}
          </text>
          <text x={innerWidth} y={innerHeight + 15} fontSize={10} fill="#64748b" textAnchor="end">
            {range.to ? formatDate(range.to) : '...'}
          </text>
        </g>
      </svg>

      {/* Range display */}
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{l.from}: {range.from ? formatDate(range.from) : '—'}</span>
        <span>{l.to}: {range.to ? formatDate(range.to) : '—'}</span>
      </div>
    </div>
  )
}

export const TimeRangeBrush = memo(TimeRangeBrushComponent)
```

### File 2: `src/components/configurator/TimeRangeSelector.tsx` (new)

```typescript
'use client'

import { memo, useState } from 'react'
import { TimeRangeBrush } from '@/components/charts/shared/TimeRangeBrush'
import { cn } from '@/lib/utils/cn'

interface TimeRangeSelectorProps {
  data: Array<{ date: Date; value: number }>
  range: { from: Date | null; to: Date | null }
  onRangeChange: (range: { from: Date; to: Date }) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  mode?: 'brush' | 'inputs' | 'both'
  labels?: {
    from?: string
    to?: string
    selection?: string
    useBrush?: string
    useInputs?: string
  }
  className?: string
}

function TimeRangeSelectorComponent({
  data,
  range,
  onRangeChange,
  locale,
  mode = 'both',
  labels,
  className,
}: TimeRangeSelectorProps) {
  const l = {
    from: 'From',
    to: 'To',
    selection: 'Selected range',
    useBrush: 'Visual selection',
    useInputs: 'Manual input',
    ...labels,
  }

  const [showBrush, setShowBrush] = useState(mode !== 'inputs')

  return (
    <div className={cn('space-y-3', className)}>
      {/* Mode toggle */}
      {mode === 'both' && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowBrush(true)}
            className={cn(
              'rounded px-2 py-1 text-xs',
              showBrush ? 'bg-gov-primary text-white' : 'bg-slate-100 text-slate-600'
            )}
          >
            {l.useBrush}
          </button>
          <button
            type="button"
            onClick={() => setShowBrush(false)}
            className={cn(
              'rounded px-2 py-1 text-xs',
              !showBrush ? 'bg-gov-primary text-white' : 'bg-slate-100 text-slate-600'
            )}
          >
            {l.useInputs}
          </button>
        </div>
      )}

      {/* Brush mode */}
      {showBrush && mode !== 'inputs' && (
        <TimeRangeBrush
          data={data}
          range={range}
          onRangeChange={onRangeChange}
          width={300}
          locale={locale}
          labels={labels}
        />
      )}

      {/* Input mode */}
      {!showBrush && mode !== 'brush' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.from}</label>
            <input
              type="date"
              value={range.from?.toISOString().split('T')[0] || ''}
              onChange={(e) => onRangeChange({
                from: new Date(e.target.value),
                to: range.to ?? new Date(),
              })}
              className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.to}</label>
            <input
              type="date"
              value={range.to?.toISOString().split('T')[0] || ''}
              onChange={(e) => onRangeChange({
                from: range.from ?? new Date(0),
                to: new Date(e.target.value),
              })}
              className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const TimeRangeSelector = memo(TimeRangeSelectorComponent)
```

### File 3: Add translations

**`src/locales/en.json`**:
```json
{
  "timeRangeBrush": {
    "from": "From",
    "to": "To",
    "selection": "Selected range",
    "visualSelection": "Visual selection",
    "manualInput": "Manual input",
    "clearSelection": "Clear selection",
    "selectAll": "Select all"
  }
}
```

**`src/locales/sr-cyr.json`**:
```json
{
  "timeRangeBrush": {
    "from": "Од",
    "to": "До",
    "selection": "Изабрани опсег",
    "visualSelection": "Визуелни избор",
    "manualInput": "Ручни унос",
    "clearSelection": "Очисти избор",
    "selectAll": "Изабери све"
  }
}
```

---

## Affected areas
- `src/components/charts/shared/TimeRangeBrush.tsx` (new)
- `src/components/configurator/TimeRangeSelector.tsx` (new)
- `src/components/configurator/ConfigureStep.tsx` - Use TimeRangeSelector
- `src/stores/interactive-filters.ts` - Integrate with time range state
- `src/locales/*.json` - Translations

## Constraints
- Must work with touch devices (touch drag support)
- Handle date gaps in data gracefully
- Support different granularities (day, month, year)
- Keyboard accessible (arrow keys for fine adjustment)
- Must not block chart interactions when used in overlay

## Out of scope
- Zoom controls within brush (just use handles)
- Playhead/scrubber animation
- Multiple non-contiguous selections

## Acceptance criteria
- [ ] Mini preview shows data distribution
- [ ] Can drag left handle to change start date
- [ ] Can drag right handle to change end date
- [ ] Can drag selection area to move entire range
- [ ] Unselected areas are dimmed
- [ ] Date labels update as handles are dragged
- [ ] Toggle between brush and input modes works
- [ ] Syncs with existing time range filter state
- [ ] Touch devices can use brush
- [ ] Keyboard can adjust selection (arrow keys)
- [ ] All text translated in all three locales
