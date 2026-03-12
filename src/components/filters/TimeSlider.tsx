'use client'

import { useEffect, useMemo, useState } from 'react'

import { formatChartValue } from '@/components/charts/shared/chart-formatters'

interface TimeSliderProps {
  values: string[]
  currentValue: string | null
  locale?: string
  playLabel: string
  pauseLabel: string
  onChange: (value: string | null) => void
}

export function TimeSlider({
  values,
  currentValue,
  locale,
  playLabel,
  pauseLabel,
  onChange,
}: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const currentIndex = useMemo(
    () => (currentValue ? Math.max(values.indexOf(currentValue), 0) : 0),
    [currentValue, values]
  )

  useEffect(() => {
    if (!isPlaying || values.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      const nextIndex = currentIndex >= values.length - 1 ? 0 : currentIndex + 1
      onChange(values[nextIndex] ?? null)
    }, 1400)

    return () => {
      window.clearInterval(timer)
    }
  }, [currentIndex, isPlaying, onChange, values])

  if (values.length <= 1) {
    return null
  }

  const selectedValue = values[currentIndex] ?? values[0]

  return (
    <div className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <button
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={() => setIsPlaying(current => !current)}
        type="button"
      >
        {isPlaying ? pauseLabel : playLabel}
      </button>
      <input
        className="h-2 flex-1 accent-gov-primary"
        max={values.length - 1}
        min={0}
        onChange={event => {
          const nextValue = values[Number(event.target.value)] ?? null
          onChange(nextValue)
        }}
        type="range"
        value={currentIndex}
      />
      <span className="min-w-[84px] text-right text-xs font-medium text-slate-600">
        {selectedValue ? formatChartValue(new Date(selectedValue), locale) : '—'}
      </span>
    </div>
  )
}
