'use client'

import type { InteractiveCalculation } from '@/types'

interface CalculationToggleProps {
  value: InteractiveCalculation
  absoluteLabel: string
  percentLabel: string
  disabled?: boolean
  onChange: (value: InteractiveCalculation) => void
}

export function CalculationToggle({
  value,
  absoluteLabel,
  percentLabel,
  disabled,
  onChange,
}: CalculationToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
      <button
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          value === 'absolute'
            ? 'bg-gov-primary text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        disabled={disabled}
        onClick={() => onChange('absolute')}
        type="button"
      >
        {absoluteLabel}
      </button>
      <button
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          value === 'percent'
            ? 'bg-gov-primary text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        disabled={disabled}
        onClick={() => onChange('percent')}
        type="button"
      >
        {percentLabel}
      </button>
    </div>
  )
}
