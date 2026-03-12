'use client'

import { useMemo } from 'react'

import type { JoinSuggestion, ParsedDataset } from '@/types'

interface JoinPreviewProps {
  primary: ParsedDataset
  secondary: ParsedDataset
  suggestions: JoinSuggestion[]
  selectedSuggestion: JoinSuggestion | null
  overlapPercent: number
  labels: {
    joinBy: string
    joinPreview: string
    noMatchingColumns: string
    lowOverlap: string
    selectJoinKey: string
    overlapPercent: string
    matchedColumns: string
    innerJoin: string
    leftJoin: string
  }
  onSelectSuggestion: (suggestion: JoinSuggestion) => void
}

export function JoinPreview({
  primary,
  secondary,
  suggestions,
  selectedSuggestion,
  overlapPercent,
  labels,
  onSelectSuggestion,
}: JoinPreviewProps) {
  const previewRows = useMemo(() => {
    if (!selectedSuggestion) return []

    const primaryKey = selectedSuggestion.primaryKey
    const secondaryKey = selectedSuggestion.secondaryKey
    const prefix = secondary.source.name ?? 'secondary'

    // Build a map of secondary values
    const secondaryMap = new Map<string, Record<string, unknown>>()
    for (const obs of secondary.observations.slice(0, 100)) {
      const key = String(obs[secondaryKey] ?? '').toLowerCase().trim()
      if (key) {
        secondaryMap.set(key, obs)
      }
    }

    // Find matching rows
    const rows: Record<string, unknown>[] = []
    for (const obs of primary.observations.slice(0, 5)) {
      const key = String(obs[primaryKey] ?? '').toLowerCase().trim()
      const secObs = secondaryMap.get(key)
      if (secObs) {
        const merged: Record<string, unknown> = {
          [primaryKey]: obs[primaryKey],
        }
        // Add a few secondary columns
        for (const [k, v] of Object.entries(secObs).slice(0, 3)) {
          if (k !== secondaryKey) {
            merged[`${prefix}.${k}`] = v
          }
        }
        rows.push(merged)
      }
    }

    return rows
  }, [primary, secondary, selectedSuggestion])

  const showLowOverlapWarning = overlapPercent < 20

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">{labels.noMatchingColumns}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.selectJoinKey}
        </label>
        <div className="space-y-2">
          {suggestions.map(suggestion => (
            <button
              key={`${suggestion.primaryKey}-${suggestion.secondaryKey}`}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className={`w-full rounded-xl border p-3 text-left text-sm transition ${
                selectedSuggestion?.primaryKey === suggestion.primaryKey &&
                selectedSuggestion?.secondaryKey === suggestion.secondaryKey
                  ? 'border-gov-primary bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {suggestion.primaryKey} ↔ {suggestion.secondaryKey}
                </span>
                <span className="text-xs text-slate-500">
                  {Math.round(suggestion.confidence * 100)}% {labels.matchedColumns}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {labels.overlapPercent.replace('{{percent}}', String(suggestion.overlapPercent))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showLowOverlapWarning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-800">
            {labels.lowOverlap.replace('{{percent}}', String(overlapPercent))}
          </p>
        </div>
      )}

      {previewRows.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700">{labels.joinPreview}</h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {Object.keys(previewRows[0]!).map(key => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left font-medium text-slate-600"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {previewRows.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-3 py-2 text-slate-900">
                        {String(value ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
