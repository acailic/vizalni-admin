const localeMap: Record<string, string> = {
  'sr-Cyrl': 'sr-Cyrl-RS',
  'sr-Latn': 'sr-Latn-RS',
  en: 'en-US',
}

export function resolveChartLocale(locale?: string) {
  return localeMap[locale ?? 'sr-Cyrl'] ?? localeMap['sr-Cyrl']
}

export function createChartFormatters(locale?: string) {
  const resolvedLocale = resolveChartLocale(locale)
  const numberFormatter = new Intl.NumberFormat(resolvedLocale, {
    maximumFractionDigits: 2,
  })
  const integerFormatter = new Intl.NumberFormat(resolvedLocale, {
    maximumFractionDigits: 0,
  })
  const percentFormatter = new Intl.NumberFormat(resolvedLocale, {
    style: 'percent',
    maximumFractionDigits: 1,
  })
  const dateFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return {
    formatNumber(value: number) {
      return Number.isInteger(value)
        ? integerFormatter.format(value)
        : numberFormatter.format(value)
    },
    formatPercent(value: number) {
      return percentFormatter.format(value)
    },
    formatDate(value: Date) {
      return dateFormatter.format(value)
    },
  }
}

export function formatChartValue(value: unknown, locale?: string) {
  if (value == null || value === '') {
    return '—'
  }

  const { formatDate, formatNumber } = createChartFormatters(locale)

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDate(value)
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatNumber(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) {
      return '—'
    }

    const parsedDate = new Date(trimmed)
    if (!Number.isNaN(parsedDate.getTime()) && /[-/T:.]/.test(trimmed)) {
      return formatDate(parsedDate)
    }

    return trimmed
  }

  return String(value)
}
