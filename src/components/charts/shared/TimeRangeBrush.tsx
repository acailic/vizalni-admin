'use client'

import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { scaleTime, scaleLinear } from 'd3-scale'
import { line, area } from 'd3-shape'
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
  height = 80,
  locale,
  labels,
  className,
}: TimeRangeBrushProps) {
  const brushRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState<'left' | 'right' | 'center' | null>(null)
  const margins = { top: 10, right: 20, bottom: 20, left: 40 }
  const innerWidth = width - margins.left - margins.right
  const innerHeight = height - margins.top - margins.bottom

  const xScale = scaleTime()
    .domain(extent(data, d => d.date) as [Date, Date])
    .range([0, innerWidth])
    .nice()

  const yScale = scaleLinear()
    .domain([0, max(data, d => d.value) ?? 0])
    .range([innerHeight, 0])
    .nice()

  const linePath = line<{ date: Date; value: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    (data)

  const areaPath = area<{ date: Date; value: number }>()
    .x(d => xScale(d.date))
    .y0(innerHeight)
    .y1(d => yScale(d.value))
    (data)

  const selectionX = {
    left: range.from ? xScale(range.from) : 0,
    right: range.to ? xScale(range.to) : innerWidth,
  }

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
        const selectionWidth = selectionX.right - selectionX.left
        const newLeft = Math.max(0, Math.min(innerWidth - selectionWidth, x - selectionWidth / 2))
        const newRight = newLeft + selectionWidth
        onRangeChange({ from: xScale.invert(newLeft), to: xScale.invert(newRight) })
      }
    }

    const handleMouseUp = () => setIsDragging(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, range, selectionX, xScale, onRangeChange, innerWidth, margins])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'sr-RS', {
      year: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-2', className)}>
      <svg ref={brushRef} width={width} height={height} className="time-range-brush">
        <g transform={`translate(${margins.left},${margins.top})`}>
          {areaPath && <path d={areaPath} fill="#e2e8f0" opacity={0.5} />}
          {linePath && <path d={linePath} fill="none" stroke="#94a3b8" strokeWidth={1} />}
          <rect x={0} y={0} width={selectionX.left} height={innerHeight} fill="rgba(0,0,0,0.3)" />
          <rect x={selectionX.right} y={0} width={innerWidth - selectionX.right} height={innerHeight} fill="rgba(0,0,0,0.3)" />
          <rect x={selectionX.left} y={0} width={selectionX.right - selectionX.left} height={innerHeight} fill="rgba(37,99,235,0.1)" stroke="rgb(37,99,235)" strokeWidth={1} style={{ cursor: isDragging === 'center' ? 'grab' : 'default' }} onMouseDown={handleMouseDown('center')} />
          <rect x={selectionX.left - 4} y={0} width={8} height={innerHeight} fill="rgb(37,99,235)" rx={4} style={{ cursor: 'ew-resize' }} onMouseDown={handleMouseDown('left')} />
          <rect x={selectionX.right - 4} y={0} width={8} height={innerHeight} fill="rgb(37,99,235)" rx={4} style={{ cursor: 'ew-resize' }} onMouseDown={handleMouseDown('right')} />
        </g>
      </svg>
    </div>
  )
}

export const TimeRangeBrush = memo(TimeRangeBrushComponent)
