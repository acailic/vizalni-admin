'use client'

import { useCallback } from 'react'

import { useMap } from 'react-leaflet'

import { cn } from '@/lib/utils/cn'

interface MapControlsProps {
  locale?: string
  showLayerToggle?: boolean
  choroplethVisible?: boolean
  symbolsVisible?: boolean
  onToggleChoropleth?: () => void
  onToggleSymbols?: () => void
  className?: string
}

// Serbia bounds for reset
const SERBIA_BOUNDS: [[number, number], [number, number]] = [
  [41.85, 18.85], // Southwest
  [46.15, 23.00], // Northeast
]

// Labels by locale
const LABELS = {
  'sr-Cyrl': {
    zoomIn: 'Увећај',
    zoomOut: 'Умањи',
    resetView: 'Ресетуј поглед',
    fullscreen: 'Пун екран',
    exitFullscreen: 'Изађи из пуног екрана',
    layers: 'Слојеви',
    choropleth: 'Боје областа',
    symbols: 'Симболи',
    basemap: 'Позадинска мапа',
  },
  'sr-Latn': {
    zoomIn: 'Uvećaj',
    zoomOut: 'Umanji',
    resetView: 'Resetuj pogled',
    fullscreen: 'Pun ekran',
    exitFullscreen: 'Izađi iz punog ekrana',
    layers: 'Slojevi',
    choropleth: 'Boje oblasti',
    symbols: 'Simboli',
    basemap: 'Pozadinska mapa',
  },
  en: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetView: 'Reset view',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    layers: 'Layers',
    choropleth: 'Area colors',
    symbols: 'Symbols',
    basemap: 'Basemap',
  },
}

export function MapControls({
  locale = 'en',
  showLayerToggle = false,
  choroplethVisible = true,
  symbolsVisible = false,
  onToggleChoropleth,
  onToggleSymbols,
  className,
}: MapControlsProps) {
  const map = useMap()
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en

  const handleZoomIn = useCallback(() => {
    map.zoomIn()
  }, [map])

  const handleZoomOut = useCallback(() => {
    map.zoomOut()
  }, [map])

  const handleResetView = useCallback(() => {
    map.fitBounds(SERBIA_BOUNDS, { padding: [20, 20] })
  }, [map])

  const handleFullscreen = useCallback(() => {
    const container = map.getContainer()
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen().catch((err) => {
        console.warn('Fullscreen not available:', err)
      })
    }
  }, [map])

  return (
    <div className={cn('absolute right-3 top-3 z-[1000] flex flex-col gap-2', className)}>
      {/* Zoom controls */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
        <button
          type="button"
          onClick={handleZoomIn}
          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
          title={labels.zoomIn}
          aria-label={labels.zoomIn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="h-px bg-slate-200" />
        <button
          type="button"
          onClick={handleZoomOut}
          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
          title={labels.zoomOut}
          aria-label={labels.zoomOut}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Reset and fullscreen controls */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
        <button
          type="button"
          onClick={handleResetView}
          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
          title={labels.resetView}
          aria-label={labels.resetView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <div className="h-px bg-slate-200" />
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
          title={labels.fullscreen}
          aria-label={labels.fullscreen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>

      {/* Layer toggle */}
      {showLayerToggle && (
        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-md">
          <div className="mb-1 px-1 text-xs font-semibold text-slate-500">{labels.layers}</div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={onToggleChoropleth}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition',
                choroplethVisible
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              <span
                className={cn(
                  'h-3 w-3 rounded-sm border',
                  choroplethVisible ? 'border-blue-400 bg-blue-500' : 'border-slate-300 bg-slate-100'
                )}
              />
              {labels.choropleth}
            </button>
            <button
              type="button"
              onClick={onToggleSymbols}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition',
                symbolsVisible
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              <span
                className={cn(
                  'h-3 w-3 rounded-full border',
                  symbolsVisible ? 'border-blue-400 bg-blue-500' : 'border-slate-300 bg-slate-100'
                )}
              />
              {labels.symbols}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { SERBIA_BOUNDS }
