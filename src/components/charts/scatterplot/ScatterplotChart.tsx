'use client'

import { useMemo } from 'react'

import { extent, max , scaleLinear } from 'd3'

import { toNumericValue } from '@/components/charts/shared/chart-data'
import { formatChartValue } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'

interface ScatterPoint {
  x: number
  y: number
  label: string
}

export function ScatterplotChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
}: ChartRendererComponentProps) {
  const points = useMemo<ScatterPoint[]>(() => {
    if (!config.x_axis || !config.y_axis) {
      return []
    }

    return data
      .map(row => {
        const x = toNumericValue(row[config.x_axis!.field])
        const y = toNumericValue(row[config.y_axis!.field])

        if (x === null || y === null) {
          return null
        }

        return {
          x,
          y,
          label: formatChartValue(row[config.x_axis!.field], locale),
        }
      })
      .filter((point): point is ScatterPoint => point !== null)
  }, [config, data, locale])

  if (!points.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric pairs available for this scatterplot."
      />
    )
  }

  const width = 960
  const margins = { top: 24, right: 24, bottom: 48, left: 60 }
  const chartHeight = Math.max(height, 280)
  const xExtent = extent(points, point => point.x)
  const yMax = max(points, point => point.y) ?? 0
  const xMin = xExtent[0] ?? 0
  const xMax = xExtent[1] ?? 1
  const xDomain = xMin === xMax ? [xMin - 1, xMax + 1] : [xMin, xMax]
  const yDomain = [0, yMax === 0 ? 1 : yMax]
  const xScale = scaleLinear()
    .domain(xDomain)
    .range([margins.left, width - margins.right])
    .nice()
  const yScale = scaleLinear()
    .domain(yDomain)
    .range([chartHeight - margins.bottom, margins.top])
    .nice()
  const dotRadius = config.options?.dotSize ?? 5
  const dotOpacity = config.options?.opacity ?? 0.7

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
    >
      <svg viewBox={`0 0 ${width} ${chartHeight}`} className="h-full w-full text-slate-500">
        <line
          x1={margins.left}
          x2={width - margins.right}
          y1={chartHeight - margins.bottom}
          y2={chartHeight - margins.bottom}
          stroke="currentColor"
        />
        <line
          x1={margins.left}
          x2={margins.left}
          y1={margins.top}
          y2={chartHeight - margins.bottom}
          stroke="currentColor"
        />
        {points.map((point, index) => (
          <circle
            key={`${point.label}-${index}`}
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={dotRadius}
            fill="#0D4077"
            fillOpacity={dotOpacity}
          >
            <title>{`${point.label}: ${point.x}, ${point.y}`}</title>
          </circle>
        ))}
        <text
          x={width / 2}
          y={chartHeight - 12}
          textAnchor="middle"
          className="fill-slate-600 text-xs"
        >
          {config.x_axis?.label || config.x_axis?.field}
        </text>
        <text
          x={18}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${chartHeight / 2})`}
          className="fill-slate-600 text-xs"
        >
          {config.y_axis?.label || config.y_axis?.field}
        </text>
      </svg>
    </ChartFrame>
  )
}
