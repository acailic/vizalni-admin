'use client'

import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { getChartColors, getPieData } from '@/components/charts/shared/chart-data'
import { createChartFormatters } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'

export function PieChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
}: ChartRendererComponentProps) {
  const series = getPieData(data, config, locale)
  const colors = getChartColors(config)
  const { formatNumber, formatPercent } = createChartFormatters(locale)
  const total = series.reduce((sum, item) => sum + item.value, 0)

  if (!series.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric data available for this pie chart."
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
        <RechartsPieChart>
          <Tooltip
            formatter={(value) => typeof value === 'number' ? formatNumber(value) : String(value)}
            labelFormatter={value => String(value)}
          />
          {showInternalLegend && (config.options?.showLegend ?? true) ? <Legend /> : null}
          <Pie
            data={series}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="78%"
            innerRadius={config.options?.innerRadius ?? 0}
            label={
              config.options?.showLabels
                ? ({ name, percent }) =>
                    config.options?.showPercentages
                      ? `${name}: ${formatPercent(percent ?? 0)}`
                      : String(name)
                : false
            }
            isAnimationActive={config.options?.animation ?? false}
          >
            {series.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      {config.options?.showPercentages && total > 0 ? (
        <p className="mt-3 text-xs text-slate-500">Values are shown as share of total.</p>
      ) : null}
    </ChartFrame>
  )
}
