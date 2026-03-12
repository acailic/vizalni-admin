'use client'

import { memo, useState } from 'react'
import { TimeRangeBrush } from '@/components/charts/shared/TimeRangeBrush'
import { cn } from '@/lib/utils/cn'

interface TimeRangeSelectorProps {
  data: Array<{ date: Date; value: number }>
  range: { from: Date | null; to: Date | null }
  onRangeChange: (range: { from: Date; to: Date }) => void
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en'
  mode?: 'brush' | 'inputs' | 'both'
  labels?: {
    from?: string
    to?: string
    selection?: string
    useBrush?: string
    useInputs?: string
  }
  className?: string
}

function TimeRangeSelectorComponent({
  data,
  range,
  onRangeChange,
  locale,
  mode = 'both',
  labels,
  className,
}: TimeRangeSelectorProps) {
  const l = {
    from: 'From',
    to: 'To',
    selection: 'Selected range',
    useBrush: 'Visual selection',
    useInputs: 'Manual input',
    ...labels,
  }

  const [showBrush, setShowBrush] = useState(mode !== 'inputs')

  return (
    <div className={cn('space-y-3', className)}>
      {mode === 'both' && (
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowBrush(true)} className={cn('rounded px-2 py-1 text-xs', showBrush ? 'bg-gov-primary text-white' : 'bg-slate-100 text-slate-600')}>{l.useBrush}</button>
          <button type="button" onClick={() => setShowBrush(false)} className={cn('rounded px-2 py-1 text-xs', !showBrush ? 'bg-gov-primary text-white' : 'bg-slate-100 text-slate-600')}>{l.useInputs}</button>
        </div>
      )}
      {showBrush && mode !== 'inputs' && (
        <TimeRangeBrush data={data} range={range} onRangeChange={onRangeChange} width={300} locale={locale} labels={labels} />
      )}
      {!showBrush && mode !== 'brush' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.from}</label>
            <input type="date" value={range.from?.toISOString().split('T')[0] || ''} onChange={(e) => onRangeChange({ from: new Date(e.target.value), to: range.to ?? new Date() })} className="w-full rounded border border-slate-200 px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{l.to}</label>
            <input type="date" value={range.to?.toISOString().split('T')[0] || ''} onChange={(e) => onRangeChange({ from: range.from ?? new Date(0), to: new Date(e.target.value) })} className="w-full rounded border border-slate-200 px-2 py-1 text-sm" />
          </div>
        </div>
      )}
    </div>
  )
}

export const TimeRangeSelector = memo(TimeRangeSelectorComponent)
