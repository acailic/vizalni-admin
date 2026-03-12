'use client'

import { Suspense, useMemo, useRef } from 'react'

import { getAxisLabel, getTableColumns } from '@/components/charts/shared/chart-data'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import { ExportMenu } from '@/components/charts/shared/ExportMenu'
import { FilterBar } from '@/components/filters'
import {
  getChartId,
  getChartSeriesKeys,
  getFilterableDimensions,
  getTemporalValues,
  isTemporalChart,
  supportsCalculationToggle,
  supportsLegendFilter,
} from '@/lib/charts/interactive-filters'
import { getChartDefinition } from '@/lib/charts/registry'
import { applyInteractiveFilters } from '@/lib/data'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { useChartInteractiveFilters } from '@/stores/interactive-filters'
import {
  normalizeChartType,
  type Observation,
  parseChartConfig,
  type ChartConfigInput,
  type ChartRendererDataRow,
} from '@/types'

interface ChartRendererProps {
  config: ChartConfigInput
  data: ChartRendererDataRow[]
  height?: number
  locale?: string
  /** Source dataset name for attribution */
  sourceDataset?: string
}

export function ChartRenderer({
  config,
  data,
  height = 400,
  locale = 'sr-Cyrl',
  sourceDataset,
}: ChartRendererProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const parseResult = useMemo(() => {
    try {
      return {
        parsedConfig: parseChartConfig(config),
        error: null,
      }
    } catch (error) {
      return {
        parsedConfig: null,
        error,
      }
    }
  }, [config])

  const localeMessages = getMessages(resolveLocale(locale))

  const parsedConfig =
    parseResult.parsedConfig ??
    parseChartConfig({
      type: 'table',
      title: config.title || 'Chart',
    })

  const normalizedType = normalizeChartType(parsedConfig.type)
  const chartId = useMemo(() => getChartId(parsedConfig), [parsedConfig])

  const seriesKeys = useMemo(
    () => (supportsLegendFilter(parsedConfig) ? getChartSeriesKeys(parsedConfig) : []),
    [parsedConfig]
  )

  const temporalValues = useMemo(
    () => (isTemporalChart(parsedConfig, data) ? getTemporalValues(parsedConfig, data) : []),
    [data, parsedConfig]
  )

  const dimensions = useMemo(
    () => getFilterableDimensions(parsedConfig, data, locale),
    [data, locale, parsedConfig]
  )

  const filterDefaults = useMemo(
    () => ({
      legend: Object.fromEntries(seriesKeys.map((key) => [key, true])),
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: Object.fromEntries(dimensions.map((dimension) => [dimension.key, null])),
      calculation: 'absolute' as const,
    }),
    [dimensions, seriesKeys]
  )

  const filters = useChartInteractiveFilters({
    chartId,
    defaults: filterDefaults,
  })

  const hiddenSeriesKeys = useMemo(
    () =>
      Object.entries(filters.legend)
        .filter(([, visible]) => !visible)
        .map(([key]) => key),
    [filters.legend]
  )

  const filteredData = useMemo(
    () =>
      applyInteractiveFilters(
        data as Observation[],
        filters,
        parsedConfig
      ) as ChartRendererDataRow[],
    [data, filters, parsedConfig]
  )

  // Get column headers for export
  const exportHeaders = useMemo(() => getTableColumns(filteredData, parsedConfig), [filteredData, parsedConfig])

  // Build source attribution text
  const sourceAttribution = sourceDataset
    ? localeMessages.common.export?.sourceAttribution?.replace('{{dataset}}', sourceDataset) ||
      `Source: data.gov.rs — ${sourceDataset}`
    : undefined

  // Build filters description for Excel metadata
  const filtersApplied = useMemo(() => {
    const parts: string[] = []
    if (filters.calculation === 'percent') {
      parts.push(localeMessages.charts.filters.percent)
    }
    Object.entries(filters.dataFilters).forEach(([key, value]) => {
      if (value !== null) {
        parts.push(`${key}: ${value}`)
      }
    })
    return parts.length > 0 ? parts.join(', ') : undefined
  }, [filters, localeMessages])

  // Export menu labels
  const exportLabels = {
    download: localeMessages.common.export?.download || 'Download',
    imagePng: localeMessages.common.export?.imagePng || 'Image (PNG)',
    dataCsv: localeMessages.common.export?.dataCsv || 'Data (CSV)',
    spreadsheetExcel: localeMessages.common.export?.spreadsheetExcel || 'Spreadsheet (Excel)',
    exporting: localeMessages.common.export?.exporting || 'Exporting...',
    source: localeMessages.common.export?.source || 'Source',
  }

  const showLegendFilter = supportsLegendFilter(parsedConfig) && seriesKeys.length > 0
  const showTimeFilters = temporalValues.length > 1
  const showCalculationFilter = supportsCalculationToggle(parsedConfig)

  const filterBar =
    showLegendFilter || showTimeFilters || showCalculationFilter || dimensions.length > 0 ? (
      <FilterBar
        calculation={filters.calculation}
        dataFilters={filters.dataFilters}
        dimensions={dimensions}
        labels={{
          showAll: localeMessages.charts.filters.legend_show_all,
          hideAll: localeMessages.charts.filters.legend_hide_all,
          all: localeMessages.charts.filters.all,
          search: localeMessages.charts.filters.search,
          noResults: localeMessages.charts.filters.no_results,
          from: localeMessages.charts.filters.from,
          to: localeMessages.charts.filters.to,
          absolute: localeMessages.charts.filters.absolute,
          percent: localeMessages.charts.filters.percent,
          resetAll: localeMessages.charts.filters.reset_all,
          play: localeMessages.charts.filters.play,
          pause: localeMessages.charts.filters.pause,
        }}
        legend={filters.legend}
        locale={locale}
        onResetAll={filters.resetAll}
        onSetCalculation={filters.setCalculation}
        onSetDataFilter={filters.setDataFilter}
        onSetLegendState={filters.setLegendState}
        onSetTimeRange={filters.setTimeRange}
        onSetTimeSliderValue={filters.setTimeSliderValue}
        onToggleLegendItem={filters.toggleLegendItem}
        seriesKeys={seriesKeys}
        seriesLabels={Object.fromEntries(
          seriesKeys.map((key) => [
            key,
            key === parsedConfig.y_axis?.field
              ? getAxisLabel(parsedConfig.y_axis)
              : key === parsedConfig.options?.secondaryField
                ? parsedConfig.options?.secondaryField
                : key,
          ])
        )}
        showCalculationToggle={showCalculationFilter}
        showLegendFilter={showLegendFilter}
        showTimeFilters={showTimeFilters}
        temporalValues={temporalValues}
        timeRange={filters.timeRange}
        timeSlider={filters.timeSlider}
      />
    ) : undefined

  if (parseResult.error) {
    return (
      <ChartFrame
        title={config.title || 'Chart'}
        description={config.description}
        height={height}
        errorMessage={
          parseResult.error instanceof Error
            ? parseResult.error.message
            : 'Chart configuration is invalid.'
        }
      />
    )
  }

  if (!normalizedType) {
    return (
      <ChartFrame
        title={parsedConfig.title}
        description={parsedConfig.description}
        height={height}
        errorMessage="Chart type is not supported."
      />
    )
  }

  const definition = getChartDefinition(normalizedType)

  if (!definition) {
    return (
      <ChartFrame
        title={parsedConfig.title}
        description={parsedConfig.description}
        height={height}
        errorMessage="Renderer definition is missing for this chart type."
      />
    )
  }

  const RendererComponent = definition.renderer

  return (
    <div ref={chartContainerRef} className="relative">
      {/* Export Menu - positioned absolutely in top-right */}
      <div className="absolute right-5 top-5 z-10">
        <ExportMenu
          chartRef={chartContainerRef}
          title={parsedConfig.title}
          data={filteredData as Record<string, unknown>[]}
          headers={exportHeaders}
          source={sourceAttribution}
          locale={locale}
          labels={exportLabels}
          filtersApplied={filtersApplied}
        />
      </div>

      <Suspense
        fallback={
          <ChartFrame
            title={parsedConfig.title}
            description={parsedConfig.description}
            height={height}
            emptyMessage="Loading chart renderer..."
          />
        }
      >
        <RendererComponent
          config={parsedConfig}
          data={filteredData}
          filterBar={filterBar}
          height={height}
          hiddenSeriesKeys={hiddenSeriesKeys}
          locale={locale}
          showInternalLegend={!showLegendFilter}
        />
      </Suspense>
    </div>
  )
}
