'use client'

interface LegendFilterProps {
  seriesKeys: string[]
  legend: Record<string, boolean>
  labels: Record<string, string>
  showAllLabel: string
  hideAllLabel: string
  onToggle: (key: string) => void
  onSetAll: (visible: boolean) => void
}

export function LegendFilter({
  seriesKeys,
  legend,
  labels,
  showAllLabel,
  hideAllLabel,
  onToggle,
  onSetAll,
}: LegendFilterProps) {
  if (!seriesKeys.length) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={() => onSetAll(true)}
        type="button"
      >
        {showAllLabel}
      </button>
      <button
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={() => onSetAll(false)}
        type="button"
      >
        {hideAllLabel}
      </button>
      {seriesKeys.map(key => {
        const visible = legend[key] ?? true

        return (
          <button
            aria-pressed={visible}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              visible
                ? 'border-gov-primary bg-blue-50 text-gov-primary'
                : 'border-slate-200 bg-slate-100 text-slate-400 line-through'
            }`}
            key={key}
            onClick={() => onToggle(key)}
            type="button"
          >
            {labels[key] ?? key}
          </button>
        )
      })}
    </div>
  )
}
