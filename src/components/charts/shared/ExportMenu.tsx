'use client'

import { useState, useCallback } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Download, Image as ImageIcon, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'

import {
  exportChartAsPNG,
  exportDataAsCSV,
  exportDataAsExcel,
  type PNGExportOptions,
  type CSVExportOptions,
  type ExcelExportOptions,
} from '@/lib/export'

export interface ExportMenuProps {
  /** Chart container ref for PNG export */
  chartRef?: React.RefObject<HTMLDivElement>
  /** Chart title for filenames */
  title: string
  /** Data to export (for CSV/Excel) */
  data: Record<string, unknown>[]
  /** Column headers for CSV/Excel */
  headers?: string[]
  /** Source attribution */
  source?: string
  /** Locale for labels */
  locale?: string
  /** Labels for i18n */
  labels?: {
    download?: string
    imagePng?: string
    dataCsv?: string
    spreadsheetExcel?: string
    exporting?: string
    source?: string
  }
  /** Applied filters description */
  filtersApplied?: string
  /** Disabled export types */
  disabledExports?: ('png' | 'csv' | 'excel')[]
  /** Callback when export starts */
  onExportStart?: (type: 'png' | 'csv' | 'excel') => void
  /** Callback when export completes */
  onExportEnd?: (type: 'png' | 'csv' | 'excel') => void
  /** Callback when export fails */
  onExportError?: (type: 'png' | 'csv' | 'excel', error: Error) => void
}

type ExportState = {
  png: boolean
  csv: boolean
  excel: boolean
}

const defaultLabels = {
  download: 'Download',
  imagePng: 'Image (PNG)',
  dataCsv: 'Data (CSV)',
  spreadsheetExcel: 'Spreadsheet (Excel)',
  exporting: 'Exporting...',
  source: 'Source',
}

export function ExportMenu({
  chartRef,
  title,
  data,
  headers,
  source,
  locale: _locale = 'sr-Cyrl',
  labels = {},
  filtersApplied,
  disabledExports = [],
  onExportStart,
  onExportEnd,
  onExportError,
}: ExportMenuProps) {
  const [exporting, setExporting] = useState<ExportState>({
    png: false,
    csv: false,
    excel: false,
  })
  const [isOpen, setIsOpen] = useState(false)
  const mergedLabels = { ...defaultLabels, ...labels }

  const handlePNGExport = useCallback(async () => {
    if (!chartRef?.current) {
      console.error('Chart ref not available for PNG export')
      return
    }

    setExporting((prev) => ({ ...prev, png: true }))
    onExportStart?.('png')

    try {
      const options: PNGExportOptions = {
        title,
        scale: 2,
        backgroundColor: '#ffffff',
        source: source ? `${mergedLabels.source}: ${source}` : undefined,
      }

      await exportChartAsPNG(chartRef.current, options)
      onExportEnd?.('png')
    } catch (error) {
      console.error('PNG export failed:', error)
      onExportError?.('png', error as Error)
    } finally {
      setExporting((prev) => ({ ...prev, png: false }))
    }
  }, [chartRef, title, source, mergedLabels.source, onExportStart, onExportEnd, onExportError])

  const handleCSVExport = useCallback(() => {
    setExporting((prev) => ({ ...prev, csv: true }))
    onExportStart?.('csv')

    try {
      const columnHeaders = headers || (data.length > 0 ? Object.keys(data[0]!) : [])
      const options: CSVExportOptions = {
        title,
        headers: columnHeaders,
        delimiter: ';',
        includeBOM: true,
      }

      exportDataAsCSV(data, options)
      onExportEnd?.('csv')
    } catch (error) {
      console.error('CSV export failed:', error)
      onExportError?.('csv', error as Error)
    } finally {
      setExporting((prev) => ({ ...prev, csv: false }))
    }
  }, [data, headers, title, onExportStart, onExportEnd, onExportError])

  const handleExcelExport = useCallback(async () => {
    setExporting((prev) => ({ ...prev, excel: true }))
    onExportStart?.('excel')

    try {
      const columnHeaders = headers || (data.length > 0 ? Object.keys(data[0]!) : [])
      const options: ExcelExportOptions = {
        title,
        headers: columnHeaders,
        source,
        filters: filtersApplied,
      }

      await exportDataAsExcel(data, options)
      onExportEnd?.('excel')
    } catch (error) {
      console.error('Excel export failed:', error)
      onExportError?.('excel', error as Error)
    } finally {
      setExporting((prev) => ({ ...prev, excel: false }))
    }
  }, [data, headers, title, source, filtersApplied, onExportStart, onExportEnd, onExportError])

  const isPNGDisabled = disabledExports.includes('png') || !chartRef?.current || exporting.png
  const isCSVDisabled = disabledExports.includes('csv') || data.length === 0 || exporting.csv
  const isExcelDisabled = disabledExports.includes('excel') || data.length === 0 || exporting.excel

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={mergedLabels.download}
        >
          <Download className="h-4 w-4" />
          <span>{mergedLabels.download}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            disabled={isPNGDisabled}
            onSelect={(e) => {
              e.preventDefault()
              handlePNGExport()
            }}
          >
            {exporting.png ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <ImageIcon className="h-4 w-4 text-slate-500" />
            )}
            <span>{exporting.png ? mergedLabels.exporting : mergedLabels.imagePng}</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            disabled={isCSVDisabled}
            onSelect={(e) => {
              e.preventDefault()
              handleCSVExport()
            }}
          >
            {exporting.csv ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <FileText className="h-4 w-4 text-slate-500" />
            )}
            <span>{exporting.csv ? mergedLabels.exporting : mergedLabels.dataCsv}</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            disabled={isExcelDisabled}
            onSelect={(e) => {
              e.preventDefault()
              handleExcelExport()
            }}
          >
            {exporting.excel ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-slate-500" />
            )}
            <span>{exporting.excel ? mergedLabels.exporting : mergedLabels.spreadsheetExcel}</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
