'use client'

import type { DashboardTemplate } from '@/types'
import { DASHBOARD_TEMPLATES } from '@/types/dashboard'

interface DashboardTemplatesProps {
  labels: {
    title: string
    selectTemplate: string
    skipForNow: string
  }
  onSelect: (template: DashboardTemplate) => void
  onSkip: () => void
}

export function DashboardTemplates({
  labels,
  onSelect,
  onSkip,
}: DashboardTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">{labels.title}</h2>
        <p className="text-slate-500">{labels.selectTemplate}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_TEMPLATES.map(template => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-gov-primary hover:shadow-md"
          >
            <div className="mb-2 text-3xl">
              {template.id === 'single' && '📊'}
              {template.id === 'side-by-side' && '⚖️'}
              {template.id === '2x2-grid' && '⊞'}
              {template.id === 'hero-plus-two' && '📈'}
            </div>
            <h3 className="font-semibold text-slate-900">{template.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{template.description}</p>
            <p className="mt-2 text-xs text-slate-400">
              {template.chartPlaceholders.length} chart{template.chartPlaceholders.length !== 1 && 's'}
            </p>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          {labels.skipForNow}
        </button>
      </div>
    </div>
  )
}
