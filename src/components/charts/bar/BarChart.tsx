'use client'

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
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

export function BarChart({
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
  const isPrimaryVisible = !hiddenSeriesKeys.includes(config.y_axis?.field ?? '')

  if (!series.length || !isPrimaryVisible) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric data available for this bar chart."
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
        <RechartsBarChart
          data={series}
          layout="vertical"
          margin={{ top: 8, right: 12, bottom: 8, left: 24 }}
        >
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          ) : null}
          <XAxis
            type="number"
            tickFormatter={formatNumber}
            label={{ value: getAxisLabel(config.y_axis), position: 'insideBottom', offset: -4 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fontSize: 12 }}
            label={{ value: getAxisLabel(config.x_axis), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatNumber(value) : String(value)} />
          {showInternalLegend && (config.options?.showLegend ?? true) ? <Legend /> : null}
          <Bar
            dataKey="value"
            fill={colors[0]}
            radius={[0, 8, 8, 0]}
            isAnimationActive={config.options?.animation ?? false}
            name={getAxisLabel(config.y_axis)}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}
