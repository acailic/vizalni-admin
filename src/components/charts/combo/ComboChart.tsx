'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  getAxisLabel,
  getCartesianData,
  getChartColors,
} from '@/components/charts/shared/chart-data'
import { createChartFormatters } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'

export function ComboChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
}: ChartRendererComponentProps) {
  const series = getCartesianData(data, config, locale).filter(datum => datum.value !== null)
  const colors = getChartColors(config)
  const { formatNumber } = createChartFormatters(locale)
  const primaryKey = config.y_axis?.field ?? ''
  const secondaryKey = config.options?.secondaryField ?? ''
  const showPrimary = !hiddenSeriesKeys.includes(primaryKey)
  const showSecondary = secondaryKey ? !hiddenSeriesKeys.includes(secondaryKey) : false

  if (!series.length || (!showPrimary && !showSecondary)) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric data available for this combo chart."
      />
    )
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          ) : null}
          <XAxis
            dataKey="label"
            minTickGap={24}
            tick={{ fontSize: 12 }}
            label={{ value: getAxisLabel(config.x_axis), position: 'insideBottom', offset: -12 }}
          />
          <YAxis
            tickFormatter={formatNumber}
            label={{ value: getAxisLabel(config.y_axis), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatNumber(value) : String(value)} />
          {showInternalLegend && (config.options?.showLegend ?? true) ? <Legend /> : null}
          {showPrimary ? (
            <Bar
              dataKey="value"
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              name={getAxisLabel(config.y_axis)}
            />
          ) : null}
          {showSecondary ? (
            <Line
              dataKey="secondaryValue"
              stroke={colors[2] ?? colors[0]}
              strokeWidth={3}
              dot={false}
              name={config.options?.secondaryField || `${getAxisLabel(config.y_axis)} trend`}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}
