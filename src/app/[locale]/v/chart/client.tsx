'use client'

import { useState, useEffect } from 'react'

import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { ExportMenu } from '@/components/charts/shared/ExportMenu'
import type { UrlState } from '@/lib/url'

interface ShareableChartViewProps {
  initialState: UrlState | null
  parseError: string | null
  previewUrl?: string | null
  previewFormat?: string | null
  sourceDataset?: string | null
}

export function ShareableChartView({
  initialState,
  parseError,
  previewUrl,
  previewFormat,
  sourceDataset,
}: ShareableChartViewProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (previewUrl && previewFormat) {
      setLoading(true)
      setError(null)

      // Fetch the data
      fetch(previewUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch data')
          const format = previewFormat.toLowerCase()
          if (format === 'csv') {
            return res.text()
          }
          return res.json()
        })
        .then((result) => {
          if (previewFormat?.toLowerCase() === 'csv') {
            // Parse CSV - simple implementation
            const lines = (result as string).split('\n')
            const headerLine = lines[0]
            if (!headerLine) {
              setData([])
              return
            }
            const headers = headerLine.split(/[,;]/)
            const parsed = lines.slice(1).map((line) => {
              const values = line.split(/[,;]/)
              const row: Record<string, unknown> = {}
              headers.forEach((h, i) => {
                row[h.trim()] = values[i]?.trim()
              })
              return row
            })
            setData(parsed)
          } else {
            setData(Array.isArray(result) ? result : [result])
          }
        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [previewUrl, previewFormat])

  if (parseError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">Error Loading Chart</h2>
          <p className="mt-2 text-sm text-red-600">{parseError}</p>
        </div>
      </div>
    )
  }

  if (!initialState?.config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-700">No Chart Data</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please provide a valid chart state in the URL.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{initialState.config.title || 'Shared Chart'}</h1>
          {data.length > 0 && (
            <ExportMenu
              title={initialState.config.title || 'Chart'}
              data={data}
              {...(sourceDataset && { source: `data.gov.rs — ${sourceDataset}` })}
              locale="sr-Cyrl"
              labels={{
                download: 'Download',
                imagePng: 'Image (PNG)',
                dataCsv: 'Data (CSV)',
                spreadsheetExcel: 'Spreadsheet (Excel)',
                exporting: 'Exporting...',
                source: 'Source',
              }}
            />
          )}
        </div>

        {loading && (
          <div className="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
              <p className="text-slate-600">Loading data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-96 items-center justify-center rounded-lg border border-red-200 bg-red-50">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ChartRenderer
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config={initialState.config as any}
            data={data}
            height={500}
            locale="sr-Cyrl"
            {...(sourceDataset && { sourceDataset })}
          />
        )}

        {sourceDataset && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Source: data.gov.rs — {sourceDataset}
          </p>
        )}
      </div>
    </div>
  )
}
