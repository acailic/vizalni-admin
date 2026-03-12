import { TextDecoder as NodeTextDecoder } from 'util'

import Papa from 'papaparse'

import { classifyColumns } from '@/lib/data/classifier'
import type {
  DatasetLoadError,
  DatasetLoadOptions,
  Observation,
  ObservationValue,
  ParsedDataset,
} from '@/types/observation'

const SUPPORTED_FORMATS = new Set(['csv', 'json', 'ndjson'])
const SafeTextDecoder = globalThis.TextDecoder ?? NodeTextDecoder
const CSV_SAMPLE_BYTE_LIMIT = 2 * 1024 * 1024

function createLoadError(
  code: DatasetLoadError['code'],
  message: string,
  cause?: unknown
): DatasetLoadError {
  const error = new Error(message) as DatasetLoadError
  error.code = code
  error.cause = cause
  return error
}

function supportsEncoding(encoding: string) {
  try {
    new SafeTextDecoder(encoding)
    return true
  } catch {
    return false
  }
}

function stripBom(content: string) {
  return content.replace(/^\uFEFF/, '')
}

export function detectResourceFormat(
  format?: string,
  resourceUrl?: string,
  contentType?: string | null
) {
  const normalizedFormat = format?.trim().toLowerCase()
  if (normalizedFormat && SUPPORTED_FORMATS.has(normalizedFormat)) {
    return normalizedFormat
  }

  const normalizedContentType = contentType?.toLowerCase() ?? ''
  if (normalizedContentType.includes('application/json')) {
    return 'json'
  }

  if (normalizedContentType.includes('ndjson')) {
    return 'ndjson'
  }

  if (normalizedContentType.includes('csv') || normalizedContentType.includes('text/plain')) {
    return 'csv'
  }

  const pathname = resourceUrl ? new URL(resourceUrl).pathname.toLowerCase() : ''

  if (pathname.endsWith('.json')) {
    return 'json'
  }

  if (pathname.endsWith('.ndjson')) {
    return 'ndjson'
  }

  if (pathname.endsWith('.csv') || pathname.endsWith('.tsv') || pathname.endsWith('.txt')) {
    return 'csv'
  }

  throw createLoadError('UNSUPPORTED_FORMAT', 'Unsupported resource format')
}

export function decodeResourceBuffer(buffer: ArrayBuffer, encoding?: string) {
  const bytes = new Uint8Array(buffer)

  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return stripBom(new SafeTextDecoder('utf-8').decode(bytes))
  }

  if (encoding) {
    if (!supportsEncoding(encoding)) {
      throw createLoadError('UNKNOWN_ENCODING', `Unsupported encoding: ${encoding}`)
    }

    return stripBom(new SafeTextDecoder(encoding).decode(bytes))
  }

  const utf8 = stripBom(new SafeTextDecoder('utf-8').decode(bytes))

  if (utf8.includes('\uFFFD') && supportsEncoding('windows-1250')) {
    return stripBom(new SafeTextDecoder('windows-1250').decode(bytes))
  }

  return utf8
}

function buildColumnNames(headers: string[]) {
  const seen = new Map<string, number>()

  return headers.map((header, index) => {
    const trimmed = header.trim() || `column_${index + 1}`
    const count = seen.get(trimmed) ?? 0
    seen.set(trimmed, count + 1)

    return count === 0 ? trimmed : `${trimmed}_${count + 1}`
  })
}

function normalizeObjectValue(value: unknown) {
  if (value == null) {
    return ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function parseCsvRows(content: string) {
  const parsed = Papa.parse<string[]>(stripBom(content), {
    delimiter: '',
    skipEmptyLines: 'greedy',
  })

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw createLoadError('PARSE_FAILED', parsed.errors[0]?.message || 'Failed to parse CSV')
  }

  const [rawHeaders = [], ...rows] = parsed.data
  const columns = buildColumnNames(rawHeaders)

  return {
    columns,
    rows: rows.map(row =>
      Object.fromEntries(columns.map((column, index) => [column, row[index] ?? '']))
    ),
  }
}

function parseNdjsonRows(content: string) {
  const rows = stripBom(content)
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => JSON.parse(line) as unknown)

  return normalizeJsonRows(rows)
}

function normalizeJsonRows(parsed: unknown) {
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { data?: unknown }).data)
      ? ((parsed as { data: unknown[] }).data ?? [])
      : [parsed]

  const normalizedRows = items.map(item => {
    if (item == null || typeof item !== 'object' || Array.isArray(item)) {
      return { value: normalizeObjectValue(item) }
    }

    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, normalizeObjectValue(value)])
    )
  })

  const columns = [...new Set(normalizedRows.flatMap(row => Object.keys(row)))]

  return {
    columns,
    rows: normalizedRows.map(row =>
      Object.fromEntries(columns.map(column => [column, row[column] ?? '']))
    ),
  }
}

function parseJsonRows(content: string) {
  try {
    const parsed = JSON.parse(stripBom(content)) as unknown
    return normalizeJsonRows(parsed)
  } catch (error) {
    try {
      return parseNdjsonRows(content)
    } catch {
      throw createLoadError('INVALID_JSON', 'Failed to parse JSON resource', error)
    }
  }
}

function parseNumberValue(value: string) {
  const normalized = value
    .replace(/\u00A0/g, ' ')
    .trim()
    .replace(/[%€$]/g, '')
    .replace(/\b(RSD|EUR|USD|DIN)\b/gi, '')
    .replace(/\s+/g, '')

  if (!normalized) {
    return null
  }

  if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(/\./g, '').replace(',', '.'))
  }

  if (/^-?\d+,\d+$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(',', '.'))
  }

  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(/,/g, ''))
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized)
  }

  return null
}

function parseDateValue(value: string) {
  const trimmed = value.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const localDateMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/)
  if (localDateMatch) {
    const [, day, month, year] = localDateMatch
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  }

  const monthYearMatch = trimmed.match(/^(\d{1,2})\/(\d{4})$/)
  if (monthYearMatch) {
    const [, month, year] = monthYearMatch
    return new Date(Date.UTC(Number(year), Number(month) - 1, 1))
  }

  const yearMatch = trimmed.match(/^\d{4}$/)
  if (yearMatch) {
    return new Date(Date.UTC(Number(trimmed), 0, 1))
  }

  return null
}

export function coerceObservationValue(value: unknown): ObservationValue {
  if (value == null) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value !== 'string') {
    return String(value)
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const numeric = parseNumberValue(trimmed)
  if (numeric !== null) {
    return numeric
  }

  const date = parseDateValue(trimmed)
  if (date) {
    return date
  }

  return trimmed
}

function coerceRows(
  rows: Array<Record<string, string>>,
  columns: string[],
  rowLimit?: number
): Observation[] {
  const limitedRows = rowLimit ? rows.slice(0, rowLimit) : rows

  return limitedRows.map(row =>
    Object.fromEntries(columns.map(column => [column, coerceObservationValue(row[column] ?? null)]))
  )
}

export function parseDatasetContent(
  content: string,
  options: DatasetLoadOptions = {}
): ParsedDataset {
  const format = detectResourceFormat(options.format, options.resourceUrl, options.contentType)
  const parsed = format === 'csv' ? parseCsvRows(content) : parseJsonRows(content)
  const observations = coerceRows(parsed.rows, parsed.columns, options.rowLimit)
  const classification = classifyColumns(observations, parsed.columns)

  return {
    observations,
    dimensions: classification.dimensions,
    measures: classification.measures,
    metadataColumns: classification.metadataColumns,
    columns: parsed.columns,
    rowCount: observations.length,
    source: {
      datasetId: options.datasetId,
      resourceId: options.resourceId,
      resourceUrl: options.resourceUrl,
      format,
      fetchedAt: new Date().toISOString(),
    },
  }
}

export async function loadDatasetFromUrl(
  resourceUrl: string,
  options: DatasetLoadOptions = {}
): Promise<ParsedDataset> {
  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? 30000
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const fetchInit = {
    ...options.fetchInit,
    ...(options.rowLimit && !options.fetchInit?.cache ? { cache: 'no-store' as const } : {}),
  }

  try {
    const response = await fetch(resourceUrl, {
      ...fetchInit,
      headers: {
        Accept: '*/*',
        ...(fetchInit.headers ?? {}),
      },
      signal: fetchInit.signal ?? controller.signal,
    })

    if (!response.ok) {
      throw createLoadError('FETCH_FAILED', `Failed to fetch resource: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') ?? undefined
    const format = detectResourceFormat(options.format, resourceUrl, contentType)

    let content: string
    if (format === 'csv' && options.rowLimit && response.body) {
      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let totalBytes = 0
      let newlineCount = 0

      while (totalBytes < CSV_SAMPLE_BYTE_LIMIT && newlineCount < options.rowLimit + 1) {
        const { value, done } = await reader.read()
        if (done || !value) {
          break
        }

        chunks.push(value)
        totalBytes += value.byteLength

        for (const byte of value) {
          if (byte === 0x0a) {
            newlineCount += 1
          }
        }
      }

      await reader.cancel()

      const sampleBuffer = new Uint8Array(totalBytes)
      let offset = 0
      for (const chunk of chunks) {
        sampleBuffer.set(chunk, offset)
        offset += chunk.byteLength
      }

      content = decodeResourceBuffer(sampleBuffer.buffer, options.encoding)

      const lastLineBreak = Math.max(content.lastIndexOf('\n'), content.lastIndexOf('\r'))
      if (lastLineBreak > 0 && lastLineBreak < content.length - 1) {
        content = content.slice(0, lastLineBreak)
      }
    } else {
      const buffer = await response.arrayBuffer()
      content = decodeResourceBuffer(buffer, options.encoding)
    }

    return parseDatasetContent(content, {
      ...options,
      resourceUrl,
      contentType,
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw createLoadError('FETCH_FAILED', 'Resource request timed out', error)
    }

    if ((error as DatasetLoadError).code) {
      throw error
    }

    throw createLoadError('FETCH_FAILED', 'Failed to fetch resource data', error)
  } finally {
    clearTimeout(timeout)
  }
}
