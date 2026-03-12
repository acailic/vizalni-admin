'use client'

import { cn } from '@/lib/utils/cn'
import { useConfiguratorStore, stepOrder , canProceedFromStep } from '@/stores/configurator'
import type { ConfiguratorStep } from '@/types'

interface ConfiguratorSidebarProps {
  labels: {
    steps: {
      dataset: string
      chartType: string
      mapping: string
      customize: string
      review: string
    }
    stepIndicator: string
    backToBrowse: string
    next: string
    previous: string
    finish: string
    preview: {
      title: string
      description: string
      no_config: string
    }
  }
}

const stepIcons: Record<ConfiguratorStep, string> = {
  dataset: '📊',
  chartType: '📈',
  mapping: '🔗',
  customize: '🎨',
  review: '✅',
}

export function ConfiguratorSidebar({ labels }: ConfiguratorSidebarProps) {
  const { step, config, parsedDataset, setStep } = useConfiguratorStore()
  const normalizedCurrentStep = step === 'dataset' ? 'chartType' : step
  const currentIndex = stepOrder.indexOf(normalizedCurrentStep)

  const handleStepClick = (targetStep: ConfiguratorStep) => {
    if (targetStep === 'dataset') {
      setStep(targetStep)
      return
    }

    const targetIndex = stepOrder.indexOf(targetStep)

    // Allow going back to any previous step
    if (targetIndex < currentIndex) {
      setStep(targetStep)
    }
    // Allow going forward only if current step is valid
    else if (targetIndex === currentIndex + 1 && canProceedFromStep(step, config, parsedDataset)) {
      setStep(targetStep)
    }
  }

  return (
    <nav aria-label="Configurator steps" className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <ol className="space-y-1">
        {stepOrder.map((stepKey, index) => {
          const isActive = step === stepKey
          const isCompleted = currentIndex > index
          const isAccessible = index <= currentIndex || isCompleted

          return (
            <li key={stepKey}>
              <button
                type="button"
                onClick={() => handleStepClick(stepKey)}
                disabled={!isAccessible}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  isActive && 'bg-blue-50 text-gov-primary',
                  isCompleted && !isActive && 'text-slate-600 hover:bg-slate-50',
                  !isAccessible && 'cursor-not-allowed text-slate-400'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                    isActive && 'bg-gov-primary text-white',
                    isCompleted && !isActive && 'bg-green-100 text-green-700',
                    !isActive && !isCompleted && 'bg-slate-100 text-slate-400'
                  )}
                >
                  {isCompleted && !isActive ? '✓' : index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stepIcons[stepKey]}</span>
                  <span className="text-sm font-medium">
                    {labels.steps[stepKey]}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
