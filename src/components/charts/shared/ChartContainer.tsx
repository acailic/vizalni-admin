'use client'

import { forwardRef, useState, useCallback, useMemo, type ReactNode, type KeyboardEvent } from 'react'
import type { ChartConfig, ChartRendererDataRow } from '@/types'

interface ChartContainerProps {
  config: ChartConfig
  data: ChartRendererDataRow[]
  children: ReactNode
  /** Accessible description of the chart content */
  summary?: string
  /** Height of the chart area */
  height?: number
  /** Additional className */
  className?: string
  /** Filter bar to render above the chart */
  filterBar?: ReactNode
  /** Whether to show the accessible table toggle */
  showTableToggle?: boolean
  /** Labels for accessibility */
  labels?: {
    chartType?: string
    skipToTable?: string
    showTable?: string
    hideTable?: string
  }
}

/**
 * ChartContainer wraps chart visualizations with proper ARIA attributes
 * and provides keyboard navigation support.
 */
export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      config,
      data,
      children,
      summary,
      height = 400,
      className = '',
      filterBar,
      showTableToggle = true,
      labels = {},
    },
    ref
  ) => {
    const [focusedPointIndex, setFocusedPointIndex] = useState<number | null>(null)
    const [showAccessibleTable, setShowAccessibleTable] = useState(false)

    // Generate chart type description
    const chartTypeLabel = useMemo(() => {
      const typeMap: Record<string, string> = {
        line: 'Line chart',
        bar: 'Bar chart',
        column: 'Column chart',
        area: 'Area chart',
        pie: 'Pie chart',
        scatterplot: 'Scatterplot',
        table: 'Data table',
        combo: 'Combination chart',
        map: 'Choropleth map',
      }
      return labels.chartType || typeMap[config.type] || 'Chart'
    }, [config.type, labels.chartType])

    // Generate aria-label for the chart
    const ariaLabel = useMemo(() => {
      const parts = [chartTypeLabel, `showing "${config.title}"`]
      if (showTableToggle) {
        parts.push('Accessible data table available via toggle button')
      }
      return parts.join('. ')
    }, [chartTypeLabel, config.title, showTableToggle])

    // Generate unique ID for description element
    const descriptionId = useMemo(() => {
      return `chart-description-${config.id || Math.random().toString(36).slice(2)}`
    }, [config.id])

    // Keyboard navigation handlers
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const totalPoints = data.length

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault()
            if (focusedPointIndex === null) {
              setFocusedPointIndex(0)
            } else {
              setFocusedPointIndex((focusedPointIndex + 1) % totalPoints)
            }
            break

          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault()
            if (focusedPointIndex === null) {
              setFocusedPointIndex(totalPoints - 1)
            } else {
              setFocusedPointIndex((focusedPointIndex - 1 + totalPoints) % totalPoints)
            }
            break

          case 'Home':
            event.preventDefault()
            setFocusedPointIndex(0)
            break

          case 'End':
            event.preventDefault()
            setFocusedPointIndex(totalPoints - 1)
            break

          case 'Enter':
          case ' ':
            // Let child components handle this for tooltips
            break

          case 'Escape':
            event.preventDefault()
            setFocusedPointIndex(null)
            break
        }
      },
      [data.length, focusedPointIndex]
    )

    const handleFocus = useCallback(() => {
      // Announce chart when focused
    }, [])

    const handleBlur = useCallback(() => {
      setFocusedPointIndex(null)
    }, [])

    const toggleTable = useCallback(() => {
      setShowAccessibleTable(prev => !prev)
    }, [])

    return (
      <div className={`chart-container ${className}`}>
        {/* Chart header */}
        <header className="mb-4 space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
          {config.description ? (
            <p className="text-sm leading-6 text-slate-600">{config.description}</p>
          ) : null}
        </header>

        {/* Skip to table link (screen reader users) */}
        {showTableToggle && (
          <a
            href={`#accessible-table-${config.id || 'chart'}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-gov-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
          >
            {labels.skipToTable || 'Skip to data table'}
          </a>
        )}

        {/* Chart area with ARIA attributes */}
        <div
          ref={ref}
          role="img"
          aria-label={ariaLabel}
          aria-describedby={summary ? descriptionId : undefined}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="chart-visual relative rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
          style={{ height }}
          data-focused-point={focusedPointIndex}
        >
          {children}
        </div>

        {/* Visually hidden description for screen readers */}
        {summary && (
          <p id={descriptionId} className="sr-only">
            {summary}
          </p>
        )}

        {/* Filter bar */}
        {filterBar}

        {/* Accessible table toggle */}
        {showTableToggle && (
          <div className="mt-4">
            <button
              type="button"
              onClick={toggleTable}
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
              aria-expanded={showAccessibleTable}
              aria-controls={`accessible-table-${config.id || 'chart'}`}
            >
              {showAccessibleTable ? (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  {labels.hideTable || 'Hide table'}
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {labels.showTable || 'Show as table'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }
)

ChartContainer.displayName = 'ChartContainer'

/**
 * Focus indicator styles to be added to globals.css
 * These provide 3:1 contrast ratio focus indicators
 */
export const focusIndicatorStyles = `
  /* Focus indicators with 3:1 contrast */
  .focus-visible:focus,
  .focus-visible:focus-visible {
    outline: 3px solid #0D4077;
    outline-offset: 2px;
  }

  /* High contrast focus for interactive chart elements */
  .chart-visual:focus-within {
    outline: 3px solid #0D4077;
    outline-offset: 2px;
  }

  /* Skip link styling */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #0D4077;
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    font-weight: 500;
    z-index: 100;
    transition: top 0.2s;
  }

  .skip-link:focus {
    top: 0;
  }
`

export default ChartContainer
