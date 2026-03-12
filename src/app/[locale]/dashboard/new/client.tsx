'use client'

import { useRouter } from 'next/navigation'

import { useDashboardStore } from '@/stores/dashboard'
import type { DashboardTemplate } from '@/types'
import { DASHBOARD_TEMPLATES } from '@/types/dashboard'

interface NewDashboardClientProps {
  locale: string
  labels: {
    title: string
    selectTemplate: string
    skipForNow: string
    single: string
    singleDesc: string
    sideBySide: string
    sideBySideDesc: string
    grid2x2: string
    grid2x2Desc: string
    heroPlusTwo: string
    heroPlusTwoDesc: string
    empty: string
    newDashboard: string
    orStartFromScratch: string
    blankDashboard: string
    blankDashboardDesc: string
  }
}

const templateIcons: Record<string, { icon: string; color: string }> = {
  single: { icon: '📊', color: 'bg-blue-50 text-blue-600' },
  'side-by-side': { icon: '⚖️', color: 'bg-green-50 text-green-600' },
  '2x2-grid': { icon: '⊞', color: 'bg-purple-50 text-purple-600' },
  'hero-plus-two': { icon: '📈', color: 'bg-orange-50 text-orange-600' },
}

export function NewDashboardClient({ locale, labels }: NewDashboardClientProps) {
  const router = useRouter()
  const { createFromTemplate, createNew, saveDashboard } = useDashboardStore()

  const handleSelectTemplate = (template: DashboardTemplate) => {
    createFromTemplate(template.id)
    const dashboard = saveDashboard()
    if (dashboard) {
      router.push(`/${locale}/dashboard/${dashboard.id}`)
    }
  }

  const handleSkip = () => {
    createNew()
    const dashboard = saveDashboard()
    if (dashboard) {
      router.push(`/${locale}/dashboard/${dashboard.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">{labels.title}</h1>
          <p className="mt-2 text-lg text-slate-600">{labels.selectTemplate}</p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_TEMPLATES.map(template => {
            const iconInfo = templateIcons[template.id] || { icon: '📊', color: 'bg-slate-50 text-slate-600' }
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all hover:border-gov-primary hover:shadow-lg"
              >
                {/* Icon */}
                <div className={`mb-4 inline-flex rounded-xl p-3 ${iconInfo.color}`}>
                  <span className="text-2xl">{iconInfo.icon}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 transition group-hover:text-gov-primary">
                  {template.id === 'single' && labels.single}
                  {template.id === 'side-by-side' && labels.sideBySide}
                  {template.id === '2x2-grid' && labels.grid2x2}
                  {template.id === 'hero-plus-two' && labels.heroPlusTwo}
                </h3>

                {/* Description */}
                <p className="mt-1 text-sm text-slate-500">
                  {template.id === 'single' && labels.singleDesc}
                  {template.id === 'side-by-side' && labels.sideBySideDesc}
                  {template.id === '2x2-grid' && labels.grid2x2Desc}
                  {template.id === 'hero-plus-two' && labels.heroPlusTwoDesc}
                </p>

                {/* Chart count badge */}
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {template.chartPlaceholders.length}
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gov-primary opacity-0 transition group-hover:opacity-100" />
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-slate-500">{labels.orStartFromScratch}</span>
          </div>
        </div>

        {/* Blank dashboard option */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSkip}
            className="group flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-4 transition hover:border-gov-primary hover:bg-white"
          >
            <div className="rounded-lg bg-white p-2 shadow-sm transition group-hover:shadow">
              <svg
                className="h-6 w-6 text-slate-400 transition group-hover:text-gov-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900">{labels.blankDashboard}</p>
              <p className="text-sm text-slate-500">{labels.blankDashboardDesc}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
