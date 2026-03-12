'use client'

import type { ReferenceLine as ReferenceLineType } from '@/types/chart-config'

interface ReferenceLineProps {
  line: ReferenceLineType
  // For scaling data values to pixel coordinates
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
  marginTop?: number
  marginRight?: number
}

export function ReferenceLine({
  line,
  xScale,
  yScale,
  chartWidth,
  chartHeight,
  marginTop = 0,
  marginRight = 0,
}: ReferenceLineProps) {
  const isX = line.axis === 'x'
  const strokeDasharray =
    line.style === 'dashed' ? '6 4' : line.style === 'dotted' ? '2 2' : undefined

  // Calculate line position
  let x1: number, y1: number, x2: number, y2: number

  if (isX && xScale) {
    // Vertical line at X value
    const x = xScale(line.value)
    x1 = x2 = x
    y1 = marginTop
    y2 = chartHeight
  } else if (!isX && yScale) {
    // Horizontal line at Y value
    const y = yScale(line.value as number)
    x1 = 0
    x2 = chartWidth - marginRight
    y1 = y2 = y
  } else {
    return null
  }

  // Label positioning
  const labelX = isX ? x1 : line.labelPosition === 'right' ? chartWidth - marginRight - 5 : 5
  const labelY = isX
    ? line.labelPosition === 'below'
      ? chartHeight - 5
      : marginTop + 15
    : y1
  const textAnchor = isX ? 'middle' : line.labelPosition === 'right' ? 'end' : 'start'
  const dominantBaseline = isX ? (line.labelPosition === 'below' ? 'auto' : 'hanging') : 'middle'

  return (
    <g className="reference-line">
      {/* The line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={line.color || '#64748B'}
        strokeWidth={1.5}
        strokeDasharray={strokeDasharray}
        opacity={0.8}
      />

      {/* Label background */}
      <rect
        x={labelX - (isX ? 40 : 0)}
        y={labelY - (isX ? 8 : 10)}
        width={isX ? 80 : 100}
        height={16}
        fill="white"
        fillOpacity={0.8}
        rx={3}
      />

      {/* Label text */}
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fill={line.color || '#64748B'}
        fontSize={11}
        fontWeight={500}
      >
        {line.label}
      </text>
    </g>
  )
}

interface ReferenceLinesLayerProps {
  lines: ReferenceLineType[]
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
  marginTop?: number
  marginRight?: number
}

export function ReferenceLinesLayer({
  lines,
  xScale,
  yScale,
  chartWidth,
  chartHeight,
  marginTop,
  marginRight,
}: ReferenceLinesLayerProps) {
  if (!lines || lines.length === 0) return null

  return (
    <g className="reference-lines-layer">
      {lines.map(line => (
        <ReferenceLine
          key={line.id}
          line={line}
          xScale={xScale}
          yScale={yScale}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          marginTop={marginTop}
          marginRight={marginRight}
        />
      ))}
    </g>
  )
}
