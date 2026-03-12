'use client'

import type { ChartAnnotation as ChartAnnotationType } from '@/types/chart-config'

interface ChartAnnotationProps {
  annotation: ChartAnnotationType
  // For scaling data values to pixel coordinates
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
}

export function ChartAnnotation({
  annotation,
  xScale,
  yScale,
  chartWidth,
  chartHeight,
}: ChartAnnotationProps) {
  if (annotation.type === 'point') {
    return (
      <PointAnnotation
        annotation={annotation}
        xScale={xScale}
        yScale={yScale}
        chartWidth={chartWidth}
      />
    )
  }

  if (annotation.type === 'range') {
    return (
      <RangeAnnotation
        annotation={annotation}
        xScale={xScale}
        yScale={yScale}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
      />
    )
  }

  return null
}

interface PointAnnotationProps {
  annotation: ChartAnnotationType
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
}

function PointAnnotation({
  annotation,
  xScale,
  yScale,
  chartWidth,
}: Omit<PointAnnotationProps, 'chartHeight'>) {
  if (!xScale || !yScale) return null

  const x = annotation.x !== undefined ? xScale(annotation.x) : undefined
  const y = annotation.y !== undefined ? yScale(annotation.y) : undefined

  if (x === undefined || y === undefined) return null

  const color = annotation.color || '#C6363C'
  const bgColor = annotation.backgroundColor || 'white'

  // Determine callout position - prefer above-right
  const calloutWidth = 120
  const calloutHeight = 40
  const calloutX = x + 15 > chartWidth - calloutWidth ? x - calloutWidth - 15 : x + 15
  const calloutY = y - calloutHeight / 2

  if (annotation.style === 'highlight') {
    return (
      <g className="annotation-point-highlight">
        <circle
          cx={x}
          cy={y}
          r={12}
          fill={color}
          fillOpacity={0.2}
          stroke={color}
          strokeWidth={2}
        />
        <text
          x={x}
          y={y - 20}
          textAnchor="middle"
          fill={color}
          fontSize={11}
          fontWeight={600}
        >
          {annotation.text}
        </text>
      </g>
    )
  }

  if (annotation.style === 'badge') {
    return (
      <g className="annotation-point-badge">
        <rect
          x={x - 40}
          y={y - 20}
          width={80}
          height={20}
          rx={10}
          fill={color}
        />
        <text
          x={x}
          y={y - 8}
          textAnchor="middle"
          fill="white"
          fontSize={10}
          fontWeight={600}
        >
          {annotation.text}
        </text>
      </g>
    )
  }

  // Default: callout style
  return (
    <g className="annotation-point-callout">
      {/* Connecting line */}
      <line
        x1={x}
        y1={y}
        x2={calloutX + 10}
        y2={calloutY + calloutHeight / 2}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="3 2"
      />

      {/* Dot at data point */}
      <circle cx={x} cy={y} r={5} fill={color} />

      {/* Callout box */}
      <rect
        x={calloutX}
        y={calloutY}
        width={calloutWidth}
        height={calloutHeight}
        rx={6}
        fill={bgColor}
        stroke={color}
        strokeWidth={1}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
      />

      {/* Callout text */}
      <text
        x={calloutX + calloutWidth / 2}
        y={calloutY + calloutHeight / 2 + 4}
        textAnchor="middle"
        fill="#1E293B"
        fontSize={11}
      >
        {annotation.text.length > 20 ? annotation.text.slice(0, 18) + '...' : annotation.text}
      </text>
    </g>
  )
}

interface RangeAnnotationProps {
  annotation: ChartAnnotationType
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
}

function RangeAnnotation({
  annotation,
  xScale,
  yScale,
  chartWidth,
  chartHeight,
}: RangeAnnotationProps) {
  const color = annotation.color || '#4B90F5'
  const bgColor = annotation.backgroundColor || color

  // Horizontal range (x-axis)
  if (annotation.xStart !== undefined && annotation.xEnd !== undefined && xScale) {
    const x1 = xScale(annotation.xStart)
    const x2 = xScale(annotation.xEnd)
    const width = Math.abs(x2 - x1)
    const rectX = Math.min(x1, x2)

    return (
      <g className="annotation-range-x">
        <rect
          x={rectX}
          y={0}
          width={width}
          height={chartHeight}
          fill={bgColor}
          fillOpacity={0.15}
        />

        {/* Label */}
        <text
          x={rectX + width / 2}
          y={15}
          textAnchor="middle"
          fill={color}
          fontSize={11}
          fontWeight={500}
        >
          {annotation.text}
        </text>
      </g>
    )
  }

  // Vertical range (y-axis)
  if (annotation.yStart !== undefined && annotation.yEnd !== undefined && yScale) {
    const y1 = yScale(annotation.yStart)
    const y2 = yScale(annotation.yEnd)
    const height = Math.abs(y2 - y1)
    const rectY = Math.min(y1, y2)

    return (
      <g className="annotation-range-y">
        <rect
          x={0}
          y={rectY}
          width={chartWidth}
          height={height}
          fill={bgColor}
          fillOpacity={0.15}
        />

        {/* Label */}
        <text
          x={chartWidth - 10}
          y={rectY + height / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fill={color}
          fontSize={11}
          fontWeight={500}
        >
          {annotation.text}
        </text>
      </g>
    )
  }

  return null
}

interface AnnotationsLayerProps {
  annotations: ChartAnnotationType[]
  xScale?: (value: number | string) => number
  yScale?: (value: number) => number
  chartWidth: number
  chartHeight: number
}

export function AnnotationsLayer({
  annotations,
  xScale,
  yScale,
  chartWidth,
  chartHeight,
}: AnnotationsLayerProps) {
  if (!annotations || annotations.length === 0) return null

  return (
    <g className="annotations-layer">
      {annotations.map(annotation => (
        <ChartAnnotation
          key={annotation.id}
          annotation={annotation}
          xScale={xScale}
          yScale={yScale}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
      ))}
    </g>
  )
}
