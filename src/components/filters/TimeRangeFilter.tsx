'use client'

import { useEffect, useMemo, useRef } from 'react'

import { axisBottom, brushX, extent, scaleTime, select } from 'd3'

interface TimeRangeFilterProps {
  values: string[]
  from: string | null
  to: string | null
  allLabel: string
  fromLabel: string
  toLabel: string
  onChange: (from: string | null, to: string | null) => void
}

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : ''
}

export function TimeRangeFilter({
  values,
  from,
  to,
  allLabel,
  fromLabel,
  toLabel,
  onChange,
}: TimeRangeFilterProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const dates = useMemo(
    () =>
      values
        .map(value => new Date(value))
        .filter(date => !Number.isNaN(date.getTime()))
        .sort((left, right) => left.getTime() - right.getTime()),
    [values]
  )

  useEffect(() => {
    if (!svgRef.current || dates.length < 2) {
      return
    }

    const domain = extent(dates)
    if (!domain[0] || !domain[1]) {
      return
    }

    const width = 540
    const height = 74
    const margin = { top: 10, right: 16, bottom: 24, left: 16 }
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const scale = scaleTime()
      .domain([domain[0], domain[1]])
      .range([margin.left, width - margin.right])

    svg
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', 28)
      .attr('y2', 28)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 6)
      .attr('stroke-linecap', 'round')

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(scale).ticks(Math.min(dates.length, 4)).tickSizeOuter(0))
      .call(group => group.selectAll('text').attr('font-size', 10).attr('fill', '#64748b'))
      .call(group => group.selectAll('path,line').attr('stroke', '#cbd5e1'))

    const brush = brushX<unknown>()
      .extent([
        [margin.left, 10],
        [width - margin.right, 46],
      ])
      .on('end', event => {
        if (!event.selection) {
          onChange(null, null)
          return
        }

        const [start, end] = event.selection as [number, number]
        onChange(scale.invert(start).toISOString(), scale.invert(end).toISOString())
      })

    const brushGroup = svg.append('g').attr('class', 'brush')
    brushGroup.call(brush)

    if (from && to) {
      brushGroup.call(brush.move, [scale(new Date(from)), scale(new Date(to))])
    }
  }, [dates, from, onChange, to])

  if (dates.length <= 1) {
    return null
  }

  return (
    <div className="min-w-[280px] space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {allLabel}
        </p>
        <button
          className="text-xs font-medium text-gov-primary transition hover:text-gov-accent"
          onClick={() => onChange(null, null)}
          type="button"
        >
          {allLabel}
        </button>
      </div>
      <svg className="w-full" ref={svgRef} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {fromLabel}
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700"
            onChange={event =>
              onChange(
                event.target.value ? new Date(event.target.value).toISOString() : null,
                to
              )
            }
            type="date"
            value={toDateInputValue(from)}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {toLabel}
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700"
            onChange={event =>
              onChange(
                from,
                event.target.value ? new Date(event.target.value).toISOString() : null
              )
            }
            type="date"
            value={toDateInputValue(to)}
          />
        </label>
      </div>
    </div>
  )
}
