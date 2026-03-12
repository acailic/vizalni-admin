/**
 * Time Range Brush Component
 *
 * Interactive timeline filter with draggable handles for selecting
 * date ranges. Shows a mini chart preview of data distribution.
 */

'use client'

import { memo, useMemo, useState, useCallback, useRef } from 'react'
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, max } from 'd3-array'
import { area } from 'd3-shape'
import { Play, Pause } from 'lucide-react'
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
  className,
}: TimeRangeBrushProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'middle' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dateLocale = locale === 'sr-Cyrl' ? sr : locale === 'sr-Latn' ? sr : enUS

  // Parse dates and get extent
  const { dates, values, dateExtent } = useMemo(() => {
    const parsedData = data
      .map((row) => ({
        date:
          typeof row[timeField] === 'string'
            ? parseISO(row[timeField] as string)
            : (row[timeField] as Date),
        value:
          typeof row[valueField] === 'number'
            ? (row[valueField] as number)
            : parseFloat(row[valueField] as string) || 0,
      }))
      .filter((d) => !isNaN(d.date.getTime()))

    const dates = parsedData.map((d) => d.date)
    const values = parsedData.map((d) => d.value)
    const dateExtent = extent(dates) as [Date, Date]

    return { dates, values, dateExtent }
  }, [data, timeField, valueField])

  // Generate mini chart path
  const miniChartPath = useMemo(() => {
    if (dates.length === 0) return ''

    const width = 300
    const height = 40

    const xScale = scaleTime().domain(dateExtent).range([HANDLE_WIDTH, width - HANDLE_WIDTH])

    const yScale = scaleLinear()
      .domain([0, max(values) ?? 0])
      .range([height, 4])

    const areaGenerator = area<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y0(height)
      .y1((d) => yScale(d.value))

    return areaGenerator(dates.map((date, i) => ({ date, value: values[i] ?? 0 }))) ?? ''
  }, [dates, values, dateExtent])

  // Handle mouse interactions
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: 'start' | 'end' | 'middle') => {
      e.preventDefault()
      setIsDragging(handle)
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current || !selectedRange || !dateExtent[0] || !dateExtent[1])
        return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = Math.max(0, Math.min(1, x / rect.width))

      const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
      const hoveredDate = new Date(dateExtent[0].getTime() + totalMs * percent)

      if (isDragging === 'start') {
        const newStart = new Date(
          Math.min(hoveredDate.getTime(), selectedRange[1].getTime() - MIN_SELECTION_DAYS * 86400000)
        )
        onRangeChange([newStart, selectedRange[1]])
      } else if (isDragging === 'end') {
        const newEnd = new Date(
          Math.max(hoveredDate.getTime(), selectedRange[0].getTime() + MIN_SELECTION_DAYS * 86400000)
        )
        onRangeChange([selectedRange[0], newEnd])
      } else if (isDragging === 'middle') {
        const rangeMs = selectedRange[1].getTime() - selectedRange[0].getTime()
        let newStart = new Date(hoveredDate.getTime() - rangeMs / 2)
        let newEnd = new Date(hoveredDate.getTime() + rangeMs / 2)

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
    },
    [isDragging, selectedRange, dateExtent, onRangeChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // Handle click to set position
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !dateExtent[0] || !dateExtent[1]) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = Math.max(0, Math.min(1, x / rect.width))

      const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
      const clickedDate = new Date(dateExtent[0].getTime() + totalMs * percent)

      const windowMs = 30 * 86400000
      let start = new Date(clickedDate.getTime() - windowMs / 2)
      let end = new Date(clickedDate.getTime() + windowMs / 2)

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
    },
    [dateExtent, onRangeChange]
  )

  // Animation playback
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
      setIsPlaying(false)
    } else {
      if (!selectedRange || !dateExtent[0] || !dateExtent[1]) return

      // Animation would step through time ranges
      playIntervalRef.current = setInterval(() => {
        setIsPlaying(false)
        if (playIntervalRef.current) clearInterval(playIntervalRef.current)
      }, 1000)

      setIsPlaying(true)
    }
  }, [isPlaying, selectedRange, dateExtent])

  // Calculate selection positions
  const selectionPositions = useMemo(() => {
    if (!selectedRange || !dateExtent[0] || !dateExtent[1]) return null

    const totalMs = dateExtent[1].getTime() - dateExtent[0].getTime()
    const startPercent = (selectedRange[0].getTime() - dateExtent[0].getTime()) / totalMs
    const endPercent = (selectedRange[1].getTime() - dateExtent[0].getTime()) / totalMs

    return {
      start: startPercent * 100,
      end: endPercent * 100,
    }
  }, [selectedRange, dateExtent])

  if (dates.length === 0) {
    return (
      <div className={cn('text-sm text-slate-500 p-4', className)}>No time data available</div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
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
          <path d={miniChartPath} fill="rgba(204, 13, 35, 0.2)" stroke="none" />
        </svg>

        {/* Selection overlay */}
        {selectionPositions && (
          <>
            <div
              className="absolute top-0 bottom-0 bg-slate-200/60"
              style={{ left: 0, width: `${selectionPositions.start}%` }}
            />
            <div
              className="absolute top-0 bottom-0 bg-slate-200/60"
              style={{ left: `${selectionPositions.end}%`, right: 0 }}
            />
            <div
              className="absolute top-0 bottom-0 border-2 border-gov-primary bg-gov-primary/10"
              style={{
                left: `${selectionPositions.start}%`,
                width: `${selectionPositions.end - selectionPositions.start}%`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, 'middle')
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-2 bg-gov-primary cursor-ew-resize hover:bg-gov-accent rounded-l"
              style={{ left: `calc(${selectionPositions.start}% - 4px)` }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, 'start')
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-2 bg-gov-primary cursor-ew-resize hover:bg-gov-accent rounded-r"
              style={{ left: `calc(${selectionPositions.end}% - 4px)` }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, 'end')
              }}
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
          title="Reset"
        >
          ⏮
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          className={cn(
            'p-2 rounded-full',
            isPlaying
              ? 'bg-gov-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          )}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() =>
            dateExtent[0] && dateExtent[1] && onRangeChange([dateExtent[0], dateExtent[1]])
          }
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
          title="Select all"
        >
          ⏭
        </button>
      </div>
    </div>
  )
}

export const TimeRangeBrush = memo(TimeRangeBrushComponent)
