import { useMemo } from 'react'
import { useConfiguratorStore } from '@/stores/configurator'

/**
 * Returns the count of active filters in the chart configuration
 */
export function useActiveFilterCount(): number {
  const config = useConfiguratorStore(state => state.config)

  return useMemo(() => {
    if (!config) return 0

    let count = 0

    // Count annotations if present
    if (config.annotations && config.annotations.length > 0) {
      count += config.annotations.length
    }

    // Count reference lines if present
    if (config.referenceLines && config.referenceLines.length > 0) {
      count += config.referenceLines.length
    }

    return count
  }, [config])
}

/**
 * Returns the count of configured datasets
 */
export function useDatasetCount(): number {
  const datasetId = useConfiguratorStore(state => state.datasetId)
  const datasets = useConfiguratorStore(state => state.datasets)

  return useMemo(() => {
    let count = 0
    if (datasetId) count++
    count += datasets.length
    return count
  }, [datasetId, datasets])
}

/**
 * Returns the count of configured chart fields
 */
export function useConfiguredFieldCount(): number {
  const config = useConfiguratorStore(state => state.config)

  return useMemo(() => {
    if (!config) return 0

    let count = 0
    if (config.x_axis?.field) count++
    if (config.y_axis?.field) count++
    if (config.options?.secondaryField) count++

    return count
  }, [config])
}

/**
 * Returns the count of annotations
 */
export function useAnnotationCount(): number {
  const config = useConfiguratorStore(state => state.config)

  return useMemo(() => {
    if (!config?.annotations) return 0
    return config.annotations.length
  }, [config])
}
