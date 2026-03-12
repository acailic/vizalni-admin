import type { ChartConfig, InteractiveFiltersState } from '@/types'
import type {
  AggregationType,
  DatasetFilterValue,
  MissingValueStrategy,
  Observation,
  ObservationValue,
  PivotTable,
  SortDirection,
} from '@/types/observation'

function compareObservationValues(left: ObservationValue, right: ObservationValue) {
  if (left == null && right == null) {
    return 0
  }

  if (left == null) {
    return 1
  }

  if (right == null) {
    return -1
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return String(left).localeCompare(String(right), 'sr')
}

function sameObservationValue(left: ObservationValue, right: ObservationValue) {
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime()
  }

  return left === right
}

function toNumericValue(value: ObservationValue) {
  if (typeof value === 'number') {
    return value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  return null
}

function matchesFilterValue(value: ObservationValue, filter: DatasetFilterValue) {
  if (Array.isArray(filter)) {
    return filter.some(entry => sameObservationValue(value, entry))
  }

  if (filter instanceof Date || typeof filter === 'string' || typeof filter === 'number' || filter === null) {
    return sameObservationValue(value, filter)
  }

  if (filter.includes) {
    const included = filter.includes.some(entry => sameObservationValue(value, entry))
    if (!included) {
      return false
    }
  }

  const numericValue = toNumericValue(value)

  if (filter.min !== undefined) {
    const minValue = toNumericValue(filter.min)
    if (numericValue === null || minValue === null || numericValue < minValue) {
      return false
    }
  }

  if (filter.max !== undefined) {
    const maxValue = toNumericValue(filter.max)
    if (numericValue === null || maxValue === null || numericValue > maxValue) {
      return false
    }
  }

  return true
}

function serializeGroupValue(value: ObservationValue) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return value == null ? '__null__' : String(value)
}

function asDateTimestamp(value: ObservationValue) {
  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime()
  }

  return null
}

export function filterObservations(
  observations: Observation[],
  filters: Record<string, DatasetFilterValue>
) {
  return observations.filter(observation =>
    Object.entries(filters).every(([key, filter]) => matchesFilterValue(observation[key] ?? null, filter))
  )
}

export function sortObservations(
  observations: Observation[],
  sortKey: string,
  direction: SortDirection = 'asc'
) {
  const modifier = direction === 'asc' ? 1 : -1

  return [...observations].sort(
    (left, right) => compareObservationValues(left[sortKey] ?? null, right[sortKey] ?? null) * modifier
  )
}

export function aggregateObservations(
  observations: Observation[],
  groupBy: string | string[],
  measureKey: string,
  aggregation: AggregationType
) {
  const groupingKeys = Array.isArray(groupBy) ? groupBy : [groupBy]
  const grouped = new Map<string, Observation[]>()

  for (const observation of observations) {
    const groupId = groupingKeys.map(key => serializeGroupValue(observation[key] ?? null)).join('::')
    const items = grouped.get(groupId)

    if (items) {
      items.push(observation)
    } else {
      grouped.set(groupId, [observation])
    }
  }

  return [...grouped.values()].map(group => {
    const first = group[0] ?? {}
    const numbers = group
      .map(item => item[measureKey])
      .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value))

    let aggregatedValue = 0

    if (aggregation === 'count') {
      aggregatedValue = group.length
    } else if (aggregation === 'sum') {
      aggregatedValue = numbers.reduce((total, value) => total + value, 0)
    } else if (aggregation === 'avg') {
      aggregatedValue = numbers.length > 0 ? numbers.reduce((total, value) => total + value, 0) / numbers.length : 0
    } else if (aggregation === 'min') {
      aggregatedValue = numbers.length > 0 ? Math.min(...numbers) : 0
    } else if (aggregation === 'max') {
      aggregatedValue = numbers.length > 0 ? Math.max(...numbers) : 0
    }

    return groupingKeys.reduce<Observation>(
      (result, key) => {
        result[key] = first[key] ?? null
        return result
      },
      {
        [measureKey]: aggregatedValue,
      }
    )
  })
}

export function pivotObservations(
  observations: Observation[],
  rowDimension: string,
  columnDimension: string,
  measureKey: string
): PivotTable {
  const rowValues = [...new Set(observations.map(item => serializeGroupValue(item[rowDimension] ?? null)))]
  const columnValues = [...new Set(observations.map(item => serializeGroupValue(item[columnDimension] ?? null)))]
  const values: PivotTable['values'] = {}

  for (const rowValue of rowValues) {
    values[rowValue] = {}

    for (const columnValue of columnValues) {
      const matching = observations.find(
        item =>
          serializeGroupValue(item[rowDimension] ?? null) === rowValue &&
          serializeGroupValue(item[columnDimension] ?? null) === columnValue
      )

      values[rowValue][columnValue] =
        typeof matching?.[measureKey] === 'number' ? (matching[measureKey] as number) : null
    }
  }

  return {
    rows: rowValues,
    columns: columnValues,
    values,
  }
}

export function computePercentages(
  observations: Observation[],
  measureKey: string,
  groupBy?: string | string[]
): Observation[] {
  if (!groupBy) {
    const total = observations.reduce(
      (sum, observation) => sum + (typeof observation[measureKey] === 'number' ? (observation[measureKey] as number) : 0),
      0
    )

    return observations.map(observation => ({
      ...observation,
      [`${measureKey}Percentage`]:
        total > 0 && typeof observation[measureKey] === 'number'
          ? ((observation[measureKey] as number) / total) * 100
          : 0,
    }))
  }

  const groupingKeys = Array.isArray(groupBy) ? groupBy : [groupBy]
  const totals = new Map<string, number>()

  for (const observation of observations) {
    const groupId = groupingKeys.map(key => serializeGroupValue(observation[key] ?? null)).join('::')
    const current = totals.get(groupId) ?? 0
    const measure = typeof observation[measureKey] === 'number' ? (observation[measureKey] as number) : 0
    totals.set(groupId, current + measure)
  }

  return observations.map(observation => {
    const groupId = groupingKeys.map(key => serializeGroupValue(observation[key] ?? null)).join('::')
    const total = totals.get(groupId) ?? 0
    const measure = typeof observation[measureKey] === 'number' ? (observation[measureKey] as number) : 0

    return {
      ...observation,
      [`${measureKey}Percentage`]: total > 0 ? (measure / total) * 100 : 0,
    }
  })
}

export function applyInteractiveFilters(
  observations: Observation[],
  filters: InteractiveFiltersState,
  config: Pick<ChartConfig, 'type' | 'x_axis' | 'y_axis'>
): Observation[] {
  let next = observations

  const dataFilters = Object.fromEntries(
    Object.entries(filters.dataFilters).filter(([, value]) => {
      if (value == null) {
        return false
      }

      return !(Array.isArray(value) && value.length === 0)
    })
  )

  if (Object.keys(dataFilters).length > 0) {
    next = filterObservations(next, dataFilters)
  }

  const timeField = config.x_axis?.field
  if (timeField) {
    if (filters.timeRange.from || filters.timeRange.to) {
      const from = filters.timeRange.from ? new Date(filters.timeRange.from).getTime() : null
      const to = filters.timeRange.to ? new Date(filters.timeRange.to).getTime() : null

      next = next.filter(observation => {
        const timestamp = asDateTimestamp(observation[timeField] ?? null)
        if (timestamp === null) {
          return true
        }

        if (from !== null && timestamp < from) {
          return false
        }

        if (to !== null && timestamp > to) {
          return false
        }

        return true
      })
    }

    if (filters.timeSlider) {
      const targetTimestamp = new Date(filters.timeSlider).getTime()

      next = next.filter(observation => {
        const timestamp = asDateTimestamp(observation[timeField] ?? null)
        return timestamp === null || timestamp === targetTimestamp
      })
    }
  }

  if (
    filters.calculation === 'percent' &&
    config.y_axis?.field &&
    ['bar', 'column', 'area'].includes(config.type)
  ) {
    const measureKey = config.y_axis.field

    next = computePercentages(next, measureKey).map(observation => {
      const percentageKey = `${measureKey}Percentage`
      const percentageValue = observation[percentageKey]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [percentageKey]: _ignored, ...rest } = observation

      return {
        ...rest,
        [measureKey]: typeof percentageValue === 'number' ? percentageValue : observation[measureKey] ?? null,
      } as Observation
    })
  }

  return next
}

function mean(values: number[]) {
  return values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : 0
}

function interpolateNumericSeries(values: Array<number | null>) {
  const result = [...values]

  for (let index = 0; index < result.length; index += 1) {
    if (result[index] !== null) {
      continue
    }

    let previousIndex = index - 1
    while (previousIndex >= 0 && result[previousIndex] === null) {
      previousIndex -= 1
    }

    let nextIndex = index + 1
    while (nextIndex < result.length && result[nextIndex] === null) {
      nextIndex += 1
    }

    const previousValue = previousIndex >= 0 ? result[previousIndex]! : null
    const nextValue = nextIndex < result.length ? result[nextIndex]! : null

    if (previousValue != null && nextValue != null) {
      const distance = nextIndex - previousIndex
      result[index] = previousValue + ((nextValue - previousValue) * (index - previousIndex)) / distance
    } else if (previousValue != null) {
      result[index] = previousValue
    } else if (nextValue != null) {
      result[index] = nextValue
    }
  }

  return result
}

export function imputeMissing(
  observations: Observation[],
  strategy: MissingValueStrategy,
  measureKeys?: string[]
) {
  if (strategy === 'skip') {
    return observations.filter(observation =>
      Object.values(observation).every(value => value !== null && value !== undefined)
    )
  }

  const keys =
    measureKeys && measureKeys.length > 0
      ? measureKeys
      : [...new Set(observations.flatMap(observation => Object.keys(observation)))].filter(key =>
          observations.some(observation => typeof observation[key] === 'number')
        )

  if (strategy === 'zero' || strategy === 'mean') {
    const means = new Map(
      keys.map(key => [
        key,
        mean(
          observations
            .map(observation => observation[key])
            .filter((value): value is number => typeof value === 'number')
        ),
      ])
    )

    return observations.map(observation => {
      const nextObservation = { ...observation }

      for (const key of keys) {
        if (nextObservation[key] !== null) {
          continue
        }

        nextObservation[key] = strategy === 'zero' ? 0 : (means.get(key) ?? 0)
      }

      return nextObservation
    })
  }

  const interpolated = new Map<string, Array<number | null>>()

  for (const key of keys) {
    interpolated.set(
      key,
      interpolateNumericSeries(
        observations.map(observation =>
          typeof observation[key] === 'number' ? (observation[key] as number) : null
        )
      )
    )
  }

  return observations.map((observation, index) => {
    const nextObservation = { ...observation }

    for (const key of keys) {
      if (nextObservation[key] !== null) {
        continue
      }

      nextObservation[key] = interpolated.get(key)?.[index] ?? null
    }

    return nextObservation
  })
}

/**
 * Extract unique time values from data for animation
 */
export function extractTimeValues(
  observations: Observation[],
  timeField: string
): (Date | string)[] {
  const values = new Set<string>()
  const dateValues: Date[] = []

  for (const obs of observations) {
    const value = obs[timeField]
    if (value == null) continue

    if (value instanceof Date) {
      dateValues.push(value)
    } else {
      values.add(String(value))
    }
  }

  // If we have dates, sort and return as Date array
  if (dateValues.length > 0) {
    return dateValues.sort((a, b) => a.getTime() - b.getTime())
  }

  // Otherwise return sorted string values
  return Array.from(values).sort((a, b) => a.localeCompare(b, 'sr'))
}

/**
 * Filter data to show only observations for a specific time value
 */
export function getTimeSlice(
  observations: Observation[],
  timeField: string,
  timeValue: Date | string
): Observation[] {
  return observations.filter(obs => {
    const value = obs[timeField]
    if (value == null) return false

    if (timeValue instanceof Date && value instanceof Date) {
      return value.getTime() === timeValue.getTime()
    }

    return String(value) === String(timeValue)
  })
}

/**
 * Filter data to show observations up to and including a specific time value
 * Used for progressive reveal animations in line charts
 */
export function getTimeSliceUpTo(
  observations: Observation[],
  timeField: string,
  timeValue: Date | string,
  allTimeValues: (Date | string)[]
): Observation[] {
  const currentIndex = allTimeValues.findIndex(tv => {
    if (tv instanceof Date && timeValue instanceof Date) {
      return tv.getTime() === timeValue.getTime()
    }
    return String(tv) === String(timeValue)
  })

  if (currentIndex === -1) return observations

  const validTimeValues = allTimeValues.slice(0, currentIndex + 1)

  return observations.filter(obs => {
    const value = obs[timeField]
    if (value == null) return false

    return validTimeValues.some(tv => {
      if (tv instanceof Date && value instanceof Date) {
        return tv.getTime() === value.getTime()
      }
      return String(tv) === String(value)
    })
  })
}
