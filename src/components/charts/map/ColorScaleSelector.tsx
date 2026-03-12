'use client'

import { useMemo } from 'react'

import {
  COLOR_PALETTES,
  getPaletteInfo,
  getPalettesByType,
  classifyData,
} from '@/lib/charts/color-scales'
import { cn } from '@/lib/utils/cn'
import type {
  ColorScaleType,
  ClassificationMethod,
  MapPalette,
} from '@/types/chart-config'

interface ColorScaleSelectorProps {
  palette: MapPalette
  scaleType: ColorScaleType
  classificationMethod: ClassificationMethod
  classCount: number
  customBreaks?: number[]
  dataValues: number[]
  locale?: string
  onPaletteChange: (palette: MapPalette) => void
  onScaleTypeChange: (scaleType: ColorScaleType) => void
  onClassificationChange: (method: ClassificationMethod) => void
  onClassCountChange: (count: number) => void
  onCustomBreaksChange?: (breaks: number[]) => void
  className?: string
}

// Labels by locale
const LABELS = {
  'sr-Cyrl': {
    colorPalette: 'Палета боја',
    scaleType: 'Тип скале',
    sequential: 'Секвенцијална',
    diverging: 'Дивергентна',
    categorical: 'Категоријска',
    classificationMethod: 'Метод класификације',
    equalIntervals: 'Једнаки интервали',
    quantiles: 'Квантили',
    naturalBreaks: 'Природне границе',
    custom: 'Прилагођено',
    classCount: 'Број класа',
    preview: 'Преглед',
    min: 'Мин',
    max: 'Макс',
    histogram: 'Хистограм',
  },
  'sr-Latn': {
    colorPalette: 'Paleta boja',
    scaleType: 'Tip skale',
    sequential: 'Sekvencijalna',
    diverging: 'Divergentna',
    categorical: 'Kategorijska',
    classificationMethod: 'Metod klasifikacije',
    equalIntervals: 'Jednaki intervali',
    quantiles: 'Kvantili',
    naturalBreaks: 'Prirodne granice',
    custom: 'Prilagođeno',
    classCount: 'Broj klasa',
    preview: 'Pregled',
    min: 'Min',
    max: 'Max',
    histogram: 'Histogram',
  },
  en: {
    colorPalette: 'Color Palette',
    scaleType: 'Scale Type',
    sequential: 'Sequential',
    diverging: 'Diverging',
    categorical: 'Categorical',
    classificationMethod: 'Classification Method',
    equalIntervals: 'Equal Intervals',
    quantiles: 'Quantiles',
    naturalBreaks: 'Natural Breaks',
    custom: 'Custom',
    classCount: 'Class Count',
    preview: 'Preview',
    min: 'Min',
    max: 'Max',
    histogram: 'Histogram',
  },
}

export function ColorScaleSelector({
  palette,
  scaleType,
  classificationMethod,
  classCount,
  customBreaks,
  dataValues,
  locale = 'en',
  onPaletteChange,
  onScaleTypeChange,
  onClassificationChange,
  onClassCountChange,
  className,
}: ColorScaleSelectorProps) {
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en
  const palettesByType = getPalettesByType()

  // Calculate current breaks for preview
  const currentBreaks = useMemo(() => {
    if (classificationMethod === 'custom' && customBreaks) {
      return customBreaks
    }
    const result = classifyData(dataValues, classificationMethod, classCount)
    return result.breaks
  }, [dataValues, classificationMethod, classCount, customBreaks])

  // Get histogram bins for preview
  const histogramBins = useMemo(() => {
    if (dataValues.length === 0) return []

    const min = Math.min(...dataValues)
    const max = Math.max(...dataValues)
    const binCount = 20
    const binWidth = (max - min) / binCount

    const bins = Array(binCount)
      .fill(0)
      .map((_, i) => ({
        from: min + i * binWidth,
        to: min + (i + 1) * binWidth,
        count: 0,
      }))

    dataValues.forEach((v) => {
      if (isNaN(v)) return
      const binIndex = Math.min(
        Math.floor((v - min) / binWidth),
        binCount - 1
      )
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex]!.count++
      }
    })

    return bins
  }, [dataValues])

  const maxBinCount = Math.max(...histogramBins.map((b) => b.count), 1)

  // Classification method options
  const classificationOptions: { value: ClassificationMethod; label: string }[] = [
    { value: 'equal-intervals', label: labels.equalIntervals },
    { value: 'quantiles', label: labels.quantiles },
    { value: 'natural-breaks', label: labels.naturalBreaks },
    { value: 'custom', label: labels.custom },
  ]

  return (
    <div className={cn('space-y-5', className)}>
      {/* Scale type selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.scaleType}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['sequential', 'diverging', 'categorical'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onScaleTypeChange(type)}
              className={cn(
                'rounded-lg border px-3 py-2 text-xs font-medium transition',
                scaleType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {labels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Palette selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.colorPalette}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {palettesByType[scaleType].map((p) => {
            const info = getPaletteInfo(p)
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPaletteChange(p)}
                className={cn(
                  'rounded-lg border p-2 transition',
                  palette === p
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="mb-1 flex h-3 gap-0.5">
                  {info.colors.slice(0, 6).map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm first:rounded-l-sm last:rounded-r-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {info.name}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Classification method selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.classificationMethod}
        </label>
        <select
          value={classificationMethod}
          onChange={(e) =>
            onClassificationChange(e.target.value as ClassificationMethod)
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {classificationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Class count slider */}
      {classificationMethod !== 'custom' && (
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>{labels.classCount}</span>
            <span className="text-blue-600">{classCount}</span>
          </label>
          <input
            type="range"
            min="3"
            max="9"
            value={classCount}
            onChange={(e) => onClassCountChange(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>3</span>
            <span>9</span>
          </div>
        </div>
      )}

      {/* Preview histogram with breaks */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.histogram}
        </label>
        <div className="rounded-lg border border-slate-200 p-3">
          {/* Histogram */}
          <div className="flex h-16 items-end gap-0.5">
            {histogramBins.map((bin, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-slate-300"
                style={{
                  height: `${(bin.count / maxBinCount) * 100}%`,
                  minHeight: bin.count > 0 ? '2px' : '0',
                }}
              />
            ))}
          </div>

          {/* Break lines */}
          <div className="relative -mt-16 h-16">
            {currentBreaks.map((brk, i) => {
              const min = Math.min(...dataValues)
              const max = Math.max(...dataValues)
              if (max === min) return null
              const position = ((brk - min) / (max - min)) * 100

              return (
                <div
                  key={i}
                  className="absolute top-0 h-full w-0.5 bg-red-500 opacity-70"
                  style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
                  title={brk.toFixed(2)}
                />
              )
            })}
          </div>

          {/* Min/Max labels */}
          {dataValues.length > 0 && (
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>
                {labels.min}: {Math.min(...dataValues).toFixed(1)}
              </span>
              <span>
                {labels.max}: {Math.max(...dataValues).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Preview color scale */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.preview}
        </label>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex h-6 gap-0.5">
            {COLOR_PALETTES[palette].map((color, i) => (
              <div
                key={i}
                className="flex-1 first:rounded-l-sm last:rounded-r-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {currentBreaks.length > 0 && (
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>{currentBreaks[0]?.toFixed(1)}</span>
              <span>{currentBreaks[currentBreaks.length - 1]?.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { LABELS as COLOR_SELECTOR_LABELS }
