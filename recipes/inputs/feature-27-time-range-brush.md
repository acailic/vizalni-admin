# Feature Request

## Title
Time Range Brush Component for Interactive Date Selection

## Problem
Users with time-series data cannot easily select date ranges to focus on specific periods. The current filter requires typing dates manually. The Swiss tool provides an interactive brush/slider that shows a mini-preview of the full timeline and allows dragging to select ranges.

## Proposed behavior

### Brush Features
1. **Mini Timeline** - Shows entire data range as a small preview chart
2. **Draggable Selection** - Two handles to adjust start and end dates
3. **Moveable Window** - Drag the middle to pan the selection
4. **Click to Set** - Click on timeline to move selection there
5. **Keyboard Accessible** - Arrow keys to adjust selection
6. **Play Animation** - Button to animate through time periods

### UI Requirements
- Compact height (60-80px) to fit in sidebar
- Show selected range as highlighted area
- Display start/end dates as labels
- Tooltip shows date on hover
- Smooth transition animations

---

## Detailed Implementation

### File 1: `src/components/filters/TimeRangeBrush.tsx` (new)

```typescript
'use client'

import { memo, useMemo, useState, useCallback, useRef } from 'react'
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, max } from 'd3-array'
import { line, area } from 'd3-shape'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { sr, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils/cn'
import type { ChartRendererDataRow } from '@/types'

interface TimeRangeBrushProps {
  data: ChartRendererDataRow[]
  timeField: string
  valueField: string
  selectedRange: [Date, Date] | null
  onRangeChange: (range: [Date, Date] | null) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  className?: string
}

const HANDLE_WIDTH = 8
const MIN_SELECTION_DAYS = 1

function TimeRangeBrushComponent({
  data,
  timeField,
  valueField,
  selectedRange,
  onRangeChange,
  locale,
  className
}: TimeRangeBrushProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'middle' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const dateLocale = locale === 'sr-Cyrl' ? sr : locale === 'sr-Latn' ? sr : enUS

  // Parse dates and get extent
  const { dates, values, dateExtent } = useMemo(() => {
    const parsedData = data.map(row => ({
      date: typeof row[timeField] === 'string'
        ? parseISO(row[timeField] as string)
        : row[timeField] as Date,
      value: typeof row[valueField] === 'number'
        ? row[valueField] as number
        : parseFloat(row[valueField] as string) || 0
    })).filter(d => !isNaN(d.date.getTime()))

    const dates = parsedData.map(d => d.date)
    const values = parsedData.map(d => d.value)
    const dateExtent = extent(dates) as [Date, Date]

    return { dates, values, dateExtent }
  }, [data, timeField, valueField])

  // Generate mini chart path
  const miniChartPath = useMemo(() => {
    if (dates.length === 0) return ''

    const width = 300 // Approximate width
    const height = 40

    const xScale = scaleTime()
      .domain(dateExtent)
      .range([HANDLE_WIDTH, width - HANDLE_WIDTH])

    const yScale = scaleLinear()
      .domain([0, max(values) ?? 0])
      .range([height, 4])

    const areaGenerator = area<{ date: Date; value: number }>()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))

    const path = areaGenerator(
      dates.map((date, i) => ({ date, value: values[i] }))
    )

    return path ?? ''
  }, [dates, values, dateExtent])

  // Handle mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'start' | 'end' | 'middle') => {
    e.preventDefault()
    setIsDragging(handle)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !selectedRange) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))

    const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
    const hoveredDate = new Date(dateExtent[0].getTime() + totalMs * percent)

    if (isDragging === 'start') {
      const newStart = new Date(Math.min(hoveredDate.getTime(), selectedRange[1].getTime() - MIN_SELECTION_DAYS * 86400000))
      onRangeChange([newStart, selectedRange[1]])
    } else if (isDragging === 'end') {
      const newEnd = new Date(Math.max(hoveredDate.getTime(), selectedRange[0].getTime() + MIN_SELECTION_DAYS * 86400000))
      onRangeChange([selectedRange[0], newEnd])
    } else if (isDragging === 'middle') {
      const rangeMs = selectedRange[1].getTime() - selectedRange[0].getTime()
      let newStart = new Date(hoveredDate.getTime() - rangeMs / 2)
      let newEnd = new Date(hoveredDate.getTime() + rangeMs / 2)

      // Clamp to bounds
      if (newStart < dateExtent[0]) {
        const diff = dateExtent[0].getTime() - newStart.getTime()
        newStart = dateExtent[0]
        newEnd = new Date(newEnd.getTime() + diff)
      }
      if (newEnd > dateExtent[1]) {
        const diff = newEnd.getTime() - dateExtent[1].getTime()
        newEnd = dateExtent[1]
        newStart = new Date(newStart.getTime() - diff)
      }

      onRangeChange([newStart, newEnd])
    }
  }, [isDragging, selectedRange, dateExtent, onRangeChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // Handle click to set position
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))

    const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
    const clickedDate = new Date(dateExtent[0].getTime() + totalMs * percent)

    // Create a 30-day window around clicked date
    const windowMs = 30 * 86400000
    let start = new Date(clickedDate.getTime() - windowMs / 2)
    let end = new Date(clickedDate.getTime() + windowMs / 2)

    // Clamp to bounds
    if (start < dateExtent[0]) {
      const diff = dateExtent[0].getTime() - start.getTime()
      start = dateExtent[0]
      end = new Date(end.getTime() + diff)
    }
    if (end > dateExtent[1]) {
      const diff = end.getTime() - dateExtent[1].getTime()
      end = dateExtent[1]
      start = new Date(start.getTime() - diff)
    }

    onRangeChange([start, end])
  }, [dateExtent, onRangeChange])

  // Animation playback
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
      setIsPlaying(false)
    } else {
      if (!selectedRange) return

      const stepMs = 30 * 86400000 // 30 days per step
      playIntervalRef.current = setInterval(() => {
        const currentRange = useInteractiveFiltersStore.getState().charts['configurator-preview']?.timeRange
        if (!currentRange) {
          setIsPlaying(false)
          if (playIntervalRef.current) clearInterval(playIntervalRef.current)
          return
        }

        const [start, end] = currentRange
        const newStart = new Date(start.getTime() + stepMs)
        const newEnd = new Date(end.getTime() + stepMs)

        if (newEnd > dateExtent[1]) {
          setIsPlaying(false)
          if (playIntervalRef.current) clearInterval(playIntervalRef.current)
          return
        }

        onRangeChange([newStart, newEnd])
      }, 1000)

      setIsPlaying(true)
    }
  }, [isPlaying, selectedRange, dateExtent, onRangeChange])

  // Calculate selection positions
  const selectionPositions = useMemo(() => {
    if (!selectedRange) return null

    const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
    const startPercent = (selectedRange[0].getTime() - dateExtent[0].getTime()) / totalMs
    const endPercent = (selectedRange[1].getTime() - dateExtent[0].getTime()) / totalMs

    return {
      start: startPercent * 100,
      end: endPercent * 100
    }
  }, [selectedRange, dateExtent])

  if (dates.length === 0) {
    return (
      <div className={cn("text-sm text-slate-500 p-4", className)}>
        No time data available
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {selectedRange
            ? format(selectedRange[0], 'dd.MM.yyyy', { locale: dateLocale })
            : format(dateExtent[0], 'dd.MM.yyyy', { locale: dateLocale })}
        </span>
        <span>
          {selectedRange
            ? format(selectedRange[1], 'dd.MM.yyyy', { locale: dateLocale })
            : format(dateExtent[1], 'dd.MM.yyyy', { locale: dateLocale })}
        </span>
      </div>

      {/* Brush container */}
      <div
        ref={containerRef}
        className="relative h-16 bg-slate-100 rounded-lg cursor-crosshair overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        {/* Mini chart */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d={miniChartPath}
            fill="rgba(204, 13, 35, 0.2)"
            stroke="none"
          />
        </svg>

        {/* Selection overlay */}
        {selectionPositions && (
          <>
            {/* Unselected areas */}
            <div
              className="absolute top-0 bottom-0 bg-slate-200/60"
              style={{ left: 0, width: `${selectionPositions.start}%` }}
            />
            <div
              className="absolute top-0 bottom-0 bg-slate-200/60"
              style={{ left: `${selectionPositions.end}%`, right: 0 }}
            />

            {/* Selected area highlight */}
            <div
              className="absolute top-0 bottom-0 border-2 border-gov-primary bg-gov-primary/10"
              style={{
                left: `${selectionPositions.start}%`,
                width: `${selectionPositions.end - selectionPositions.start}%`
              }}
              onMouseDown={(e) => handleMouseDown(e, 'middle')}
            />

            {/* Start handle */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-gov-primary cursor-ew-resize hover:bg-gov-accent rounded-l"
              style={{ left: `calc(${selectionPositions.start}% - 4px)` }}
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'start') }}
            />

            {/* End handle */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-gov-primary cursor-ew-resize hover:bg-gov-accent rounded-r"
              style={{ left: `calc(${selectionPositions.end}% - 4px)` }}
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'end') }}
            />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onRangeChange(null)}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
          title="Reset to full range"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          className={cn(
            "p-2 rounded-full",
            isPlaying
              ? "bg-gov-primary text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          )}
          title={isPlaying ? 'Pause' : 'Play animation'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => onRangeChange([dateExtent[0], dateExtent[1]])}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
          title="Select all"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export const TimeRangeBrush = memo(TimeRangeBrushComponent)

// Import the store for animation
import { useInteractiveFiltersStore } from '@/stores/interactive-filters'
```

### File 2: Update `src/stores/interactive-filters.ts`

Add time range to the filter state:

```typescript
interface InteractiveFiltersState {
  timeRange: [Date, Date] | null
  setTimeRange: (range: [Date, Date] | null) => void
  // ... existing fields
}
```

### File 3: Update `src/components/configurator/CustomizeStep.tsx`

Add time range brush for time-series data:

```typescript
import { TimeRangeBrush } from '@/components/filters/TimeRangeBrush'

// In the time-series configuration section:
{hasTimeSeries && (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">
      Time Range Filter
    </label>
    <TimeRangeBrush
      data={data}
      timeField={config.x_axis.field}
      valueField={config.y_axis.field}
      selectedRange={interactiveFilters?.timeRange ?? null}
      onRangeChange={(range) => setTimeRange(range)}
      locale={locale}
    />
  </div>
)}
```

---

## Affected areas
- `src/components/filters/TimeRangeBrush.tsx` (new) - Main brush component
- `src/stores/interactive-filters.ts` - Add timeRange state
- `src/components/configurator/CustomizeStep.tsx` - Add brush to configurator
- `src/components/charts/shared/FilterPillsFromState.tsx` - Show time range pill
- `src/locales/*.json` - Add translations

## Constraints
- Must handle dates from 1900 to 2100
- Minimum selection: 1 day
- Animation speed: 1 step per second
- Brush must work with touch on mobile

## Out of scope
- Zoom in/out on timeline
- Multiple disjoint selections
- Custom step size for animation

## Acceptance criteria
- [ ] Mini chart renders correctly
- [ ] Drag start handle adjusts start date
- [ ] Drag end handle adjusts end date
- [ ] Drag middle pans the selection
- [ ] Click sets selection to that point
- [ ] Play button animates through time
- [ ] Pause stops animation
- [ ] Reset button clears selection
- [ ] All button selects full range
- [ ] Dates display in correct locale format
- [ ] Selection updates chart immediately
