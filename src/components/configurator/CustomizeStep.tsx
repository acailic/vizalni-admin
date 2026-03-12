'use client'

import { useMemo } from 'react'

import { COLOR_PALETTES } from '@/lib/charts/color-scales'
import {
  PALETTES,
  getPalettesByType,
  getPalettesBySource,
  type ColorPalette as PaletteDefinition,
} from '@/lib/charts/palettes'
import { cn } from '@/lib/utils/cn'
import { useConfiguratorStore } from '@/stores/configurator'
import { type MapPalette, type ColorScaleType, type ClassificationMethod } from '@/types/chart-config'

interface CustomizeStepProps {
  labels?: {
    chart_title?: string
    chart_description?: string
    source_attribution?: string
    color_palette?: string
    legend_position?: string
    legend_top?: string
    legend_bottom?: string
    legend_right?: string
    legend_none?: string
    show_legend?: string
    show_grid?: string
    animation?: string
    curve_type?: string
    curve_linear?: string
    curve_monotone?: string
    curve_step?: string
    fill_opacity?: string
    donut_mode?: string
    show_labels?: string
    show_percentages?: string
    dot_size?: string
    page_size?: string
    grouping?: string
    grouped?: string
    stacked?: string
    percent_stacked?: string
    // Map options
    map_options?: string
    color_scale_type?: string
    sequential?: string
    diverging?: string
    categorical?: string
    map_palette?: string
    classification_method?: string
    equal_intervals?: string
    quantiles?: string
    natural_breaks?: string
    class_count?: string
    show_symbols?: string
    symbol_size?: string
    symbol_opacity?: string
    missing_data_pattern?: string
    basemap_style?: string
    streets?: string
    light?: string
    satellite?: string
    // Palette categories
    government?: string
    colorblind_safe?: string
  }
}

// Palette swatch component with colorblind indicator
function PaletteSwatch({
  palette,
  selected,
  onClick,
  labels,
}: {
  palette: PaletteDefinition
  selected: boolean
  onClick: () => void
  labels: { colorblind_safe?: string }
}) {
  return (
    <button
      key={palette.id}
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border p-3 transition text-left',
        selected
          ? 'border-gov-primary bg-blue-50 ring-2 ring-gov-primary/20'
          : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className="mb-2 flex gap-1">
        {palette.colors.slice(0, 6).map((color, i) => (
          <div
            key={i}
            className="h-4 flex-1 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-700">{palette.name}</p>
        {palette.colorblindSafe && (
          <span
            className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
            title={labels.colorblind_safe || 'Colorblind safe'}
          >
            <svg className="mr-0.5 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
            </svg>
            {labels.colorblind_safe || 'CB'}
          </span>
        )}
      </div>
    </button>
  )
}

// Get palettes organized by category
const governmentPalettes = getPalettesBySource('government')
const sequentialPalettes = getPalettesByType('sequential').filter(p => p.source !== 'government')
const divergingPalettes = getPalettesByType('diverging')
const categoricalPalettes = getPalettesByType('categorical')

export function CustomizeStep(props: CustomizeStepProps) {
  const labels = {
    chart_title: 'Chart title',
    chart_description: 'Chart description',
    source_attribution: 'Source: data.gov.rs — {{title}}',
    color_palette: 'Color palette',
    legend_position: 'Legend position',
    legend_top: 'Top',
    legend_bottom: 'Bottom',
    legend_right: 'Right',
    legend_none: 'None',
    show_legend: 'Show legend',
    show_grid: 'Show grid',
    animation: 'Animation',
    curve_type: 'Curve type',
    curve_linear: 'Linear',
    curve_monotone: 'Monotone',
    curve_step: 'Step',
    fill_opacity: 'Fill opacity',
    donut_mode: 'Donut mode',
    show_labels: 'Show labels',
    show_percentages: 'Show percentages',
    dot_size: 'Dot size',
    page_size: 'Rows per page',
    grouping: 'Grouping',
    grouped: 'Grouped',
    stacked: 'Stacked',
    percent_stacked: 'Percent stacked',
    // Map options
    map_options: 'Map Options',
    color_scale_type: 'Color Scale Type',
    sequential: 'Sequential',
    diverging: 'Diverging',
    categorical: 'Categorical',
    map_palette: 'Map Palette',
    classification_method: 'Classification Method',
    equal_intervals: 'Equal Intervals',
    quantiles: 'Quantiles',
    natural_breaks: 'Natural Breaks',
    class_count: 'Number of Classes',
    show_symbols: 'Show Proportional Symbols',
    symbol_size: 'Symbol Size',
    symbol_opacity: 'Symbol Opacity',
    missing_data_pattern: 'Show Missing Data Pattern',
    basemap_style: 'Basemap Style',
    streets: 'Streets',
    light: 'Light',
    satellite: 'Satellite',
    ...props?.labels,
  }

  const { config, datasetTitle, updateConfig } = useConfiguratorStore()

  const chartType = config.type
  const options = config.options ?? {}

  const handleTitleChange = (title: string) => {
    updateConfig({ title })
  }

  const handleDescriptionChange = (description: string) => {
    updateConfig({ description })
  }

  const handleOptionChange = (key: string, value: unknown) => {
    updateConfig({
      options: {
        ...options,
        [key]: value,
      },
    })
  }

  const handlePaletteIdSelect = (paletteId: string) => {
    const palette = PALETTES[paletteId]
    if (!palette) return

    updateConfig({
      options: {
        ...options,
        paletteId,
        colors: palette.colors.slice(0, 6),
      },
    })
  }

  // Get source attribution text
  const sourceAttribution = useMemo(() => {
    return labels.source_attribution.replace('{{title}}', datasetTitle || 'Dataset')
  }, [labels.source_attribution, datasetTitle])

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.chart_title}
        </label>
        <input
          type="text"
          value={config.title || ''}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder={datasetTitle || 'Untitled Chart'}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.chart_description}
          <span className="ml-1 text-slate-400">(optional, markdown supported)</span>
        </label>
        <textarea
          value={config.description || ''}
          onChange={e => handleDescriptionChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
        />
      </div>

      {/* Source attribution */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs text-slate-500">{sourceAttribution}</p>
      </div>

      {/* Color palette */}
      {chartType !== 'map' && (
        <div className="space-y-4">
          <label className="mb-3 block text-sm font-medium text-slate-700">
            {labels.color_palette}
          </label>

          {/* Government palettes */}
          {governmentPalettes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">{labels.government || 'Government'}</p>
              <div className="grid grid-cols-2 gap-2">
                {governmentPalettes.map(palette => (
                  <PaletteSwatch
                    key={palette.id}
                    palette={palette}
                    selected={options.paletteId === palette.id}
                    onClick={() => handlePaletteIdSelect(palette.id)}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sequential palettes */}
          {sequentialPalettes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">{labels.sequential || 'Sequential'}</p>
              <div className="grid grid-cols-2 gap-2">
                {sequentialPalettes.map(palette => (
                  <PaletteSwatch
                    key={palette.id}
                    palette={palette}
                    selected={options.paletteId === palette.id}
                    onClick={() => handlePaletteIdSelect(palette.id)}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Diverging palettes */}
          {divergingPalettes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">{labels.diverging || 'Diverging'}</p>
              <div className="grid grid-cols-2 gap-2">
                {divergingPalettes.map(palette => (
                  <PaletteSwatch
                    key={palette.id}
                    palette={palette}
                    selected={options.paletteId === palette.id}
                    onClick={() => handlePaletteIdSelect(palette.id)}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Categorical palettes */}
          {categoricalPalettes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">{labels.categorical || 'Categorical'}</p>
              <div className="grid grid-cols-2 gap-2">
                {categoricalPalettes.map(palette => (
                  <PaletteSwatch
                    key={palette.id}
                    palette={palette}
                    selected={options.paletteId === palette.id}
                    onClick={() => handlePaletteIdSelect(palette.id)}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend options */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={options.showLegend ?? true}
            onChange={e => handleOptionChange('showLegend', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
          />
          <span className="text-sm text-slate-700">{labels.show_legend}</span>
        </label>

        {options.showLegend !== false && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.legend_position}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['top', 'bottom', 'right', 'none'] as const).map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => handleOptionChange('legendPosition', pos)}
                  className={cn(
                    'rounded-lg border px-2 py-1.5 text-xs font-medium transition',
                    options.legendPosition === pos || (pos === 'top' && !options.legendPosition)
                      ? 'border-gov-primary bg-blue-50 text-gov-primary'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {labels[`legend_${pos}` as keyof typeof labels] || pos}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid and animation toggles */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={options.showGrid ?? true}
            onChange={e => handleOptionChange('showGrid', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
          />
          <span className="text-sm text-slate-700">{labels.show_grid}</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={options.animation ?? true}
            onChange={e => handleOptionChange('animation', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
          />
          <span className="text-sm text-slate-700">{labels.animation}</span>
        </label>
      </div>

      {/* Chart type specific options */}
      {chartType === 'map' && (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-2">
            <h4 className="text-sm font-semibold text-slate-800">{labels.map_options}</h4>
          </div>

          {/* Color Scale Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.color_scale_type}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sequential', 'diverging', 'categorical'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleOptionChange('colorScaleType', type)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-medium transition',
                    (options.colorScaleType as ColorScaleType) === type ||
                    (type === 'sequential' && !options.colorScaleType)
                      ? 'border-gov-primary bg-blue-50 text-gov-primary'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {labels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Map Color Palette */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              {labels.map_palette}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['blues', 'reds', 'greens', 'oranges', 'viridis'] as const).map(palette => (
                <button
                  key={palette}
                  type="button"
                  onClick={() => handleOptionChange('colorPalette', palette)}
                  className={cn(
                    'rounded-lg border p-2 transition',
                    (options.colorPalette as MapPalette) === palette ||
                    (palette === 'blues' && !options.colorPalette)
                      ? 'border-gov-primary bg-blue-50 ring-2 ring-gov-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="mb-1 flex h-3 gap-0.5">
                    {COLOR_PALETTES[palette].slice(0, 6).map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-700 capitalize">{palette}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Classification Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.classification_method}
            </label>
            <select
              value={(options.classificationMethod as ClassificationMethod) || 'quantiles'}
              onChange={e => handleOptionChange('classificationMethod', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
            >
              <option value="equal-intervals">{labels.equal_intervals}</option>
              <option value="quantiles">{labels.quantiles}</option>
              <option value="natural-breaks">{labels.natural_breaks}</option>
            </select>
          </div>

          {/* Class Count */}
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>{labels.class_count}</span>
              <span className="text-blue-600">{options.classCount ?? 5}</span>
            </label>
            <input
              type="range"
              min="3"
              max="9"
              value={options.classCount ?? 5}
              onChange={e => handleOptionChange('classCount', parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          {/* Symbol Options */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.showSymbols ?? false}
                onChange={e => handleOptionChange('showSymbols', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
              />
              <span className="text-sm text-slate-700">{labels.show_symbols}</span>
            </label>

            {options.showSymbols && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {labels.symbol_size}: {options.symbolMinSize ?? 8} - {options.symbolMaxSize ?? 40}
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-500">Min</span>
                      <input
                        type="range"
                        min="4"
                        max="20"
                        value={options.symbolMinSize ?? 8}
                        onChange={e => handleOptionChange('symbolMinSize', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-slate-500">Max</span>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={options.symbolMaxSize ?? 40}
                        onChange={e => handleOptionChange('symbolMaxSize', parseInt(e.target.value, 10))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{labels.symbol_opacity}</span>
                    <span className="text-slate-500">
                      {((options.symbolOpacity ?? 0.7) * 100).toFixed(0)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.1"
                    value={options.symbolOpacity ?? 0.7}
                    onChange={e => handleOptionChange('symbolOpacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          {/* Missing Data Pattern */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.showMissingDataPattern ?? true}
              onChange={e => handleOptionChange('showMissingDataPattern', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
            />
            <span className="text-sm text-slate-700">{labels.missing_data_pattern}</span>
          </label>
        </div>
      )}

      {chartType === 'line' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.curve_type}
            </label>
            <select
              value={options.curveType || 'monotone'}
              onChange={e => handleOptionChange('curveType', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
            >
              <option value="monotone">{labels.curve_monotone}</option>
              <option value="linear">{labels.curve_linear}</option>
              <option value="step">{labels.curve_step}</option>
            </select>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.showDots ?? true}
              onChange={e => handleOptionChange('showDots', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
            />
            <span className="text-sm text-slate-700">Show dots</span>
          </label>
        </div>
      )}

      {(chartType === 'bar' || chartType === 'column') && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.grouping}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['grouped', 'stacked', 'percent-stacked'] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => handleOptionChange('grouping', g)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-medium transition',
                  options.grouping === g || (g === 'grouped' && !options.grouping)
                    ? 'border-gov-primary bg-blue-50 text-gov-primary'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                {labels[g === 'percent-stacked' ? 'percent_stacked' : g as keyof typeof labels] || g}
              </button>
            ))}
          </div>
        </div>
      )}

      {chartType === 'area' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.fill_opacity}: {(options.fillOpacity ?? 0.3).toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            value={options.fillOpacity ?? 0.3}
            onChange={e => handleOptionChange('fillOpacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {chartType === 'pie' && (
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={(options.innerRadius ?? 0) > 0}
              onChange={e => handleOptionChange('innerRadius', e.target.checked ? 50 : 0)}
              className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
            />
            <span className="text-sm text-slate-700">{labels.donut_mode}</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.showLabels ?? true}
              onChange={e => handleOptionChange('showLabels', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
            />
            <span className="text-sm text-slate-700">{labels.show_labels}</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.showPercentages ?? true}
              onChange={e => handleOptionChange('showPercentages', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-gov-primary focus:ring-gov-primary"
            />
            <span className="text-sm text-slate-700">{labels.show_percentages}</span>
          </label>
        </div>
      )}

      {chartType === 'scatterplot' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.dot_size}: {options.dotSize ?? 5}
          </label>
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={options.dotSize ?? 5}
            onChange={e => handleOptionChange('dotSize', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      )}

      {chartType === 'table' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.page_size}: {options.pageSize ?? 10}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={options.pageSize ?? 10}
            onChange={e => handleOptionChange('pageSize', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
