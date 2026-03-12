'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { featuredExamples } from '@/lib/examples'
import type { Locale } from '@/lib/i18n/config'

import { ExampleCard } from './ExampleCard'
import { useExampleData } from './useExampleData'

interface FeaturedExamplesProps {
  locale: Locale
}

// Localized section titles
const sectionTitles: Record<Locale, { title: string; description: string; errorTitle: string; retry: string }> = {
  'sr-Cyrl': {
    title: 'Примери визуелизација',
    description: 'Истражите визуелизације направљене од података српске владе',
    errorTitle: 'Није могуће учитати примере',
    retry: 'Понови све',
  },
  'sr-Latn': {
    title: 'Primeri vizuelizacija',
    description: 'Istražite vizuelizacije napravljene od podataka srpske vlade',
    errorTitle: 'Nije moguće učitati primere',
    retry: 'Ponovi sve',
  },
  en: {
    title: 'Featured Visualizations',
    description: 'Explore visualizations created from Serbian government data',
    errorTitle: 'Unable to load examples',
    retry: 'Retry all',
  },
}

export function FeaturedExamples({ locale }: FeaturedExamplesProps) {
  const texts = sectionTitles[locale]

  // Track all example states
  const [globalRetryKey, setGlobalRetryKey] = useState(0)

  // Create hooks for each example
  const example1 = useExampleData(featuredExamples[0])
  const example2 = useExampleData(featuredExamples[1])
  const example3 = useExampleData(featuredExamples[2])

  const examples = [example1, example2, example3]

  // Check if all failed
  const allFailed = examples.every((e) => e.status === 'error')
  const anyLoading = examples.some((e) => e.status === 'loading' || e.status === 'idle')

  // Global retry function
  const retryAll = () => {
    setGlobalRetryKey((k) => k + 1)
    examples.forEach((e) => e.retry())
  }

  return (
    <section className="py-12" aria-labelledby="featured-examples-title">
      {/* Section header */}
      <header className="mb-8 text-center">
        <h2 id="featured-examples-title" className="text-2xl font-bold text-gray-900">
          {texts.title}
        </h2>
        <p className="mt-2 text-gray-600">{texts.description}</p>
      </header>

      {/* Global error state */}
      {allFailed && !anyLoading && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{texts.errorTitle}</p>
          <button
            type="button"
            onClick={retryAll}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" />
            {texts.retry}
          </button>
        </div>
      )}

      {/* Examples grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredExamples.map((config, index) => {
          const exampleState = examples[index]
          return (
            <ExampleCard
              key={`${config.id}-${globalRetryKey}`}
              config={config}
              locale={locale}
              dataset={exampleState.dataset}
              status={exampleState.status}
              onRetry={exampleState.retry}
            />
          )
        })}
      </div>
    </section>
  )
}
