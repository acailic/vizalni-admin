'use client'

import useSWR from 'swr'

import type { PreviewPayload } from '@/types/browse'

const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to load preview')
  }

  return (await response.json()) as PreviewPayload
}

interface PreviewTableProps {
  emptyLabel: string
  errorLabel: string
  loadingLabel: string
  previewLabel: string
  previewUrl: string
}

export function PreviewTable({
  emptyLabel,
  errorLabel,
  loadingLabel,
  previewLabel,
  previewUrl,
}: PreviewTableProps) {
  const { data, error, isLoading } = useSWR(previewUrl, fetcher, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return <p className="text-sm text-gray-500">{loadingLabel}</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{errorLabel}</p>
  }

  if (!data || data.rows.length === 0) {
    return <p className="text-sm text-gray-500">{emptyLabel}</p>
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">{previewLabel}</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {data.columns.map(column => (
                <th className="px-4 py-3 font-semibold text-gray-700" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {data.columns.map(column => (
                  <td
                    className="max-w-xs truncate px-4 py-3 text-gray-700"
                    key={`${rowIndex}-${column}`}
                  >
                    {row[column] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
