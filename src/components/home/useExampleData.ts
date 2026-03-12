'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { getCachedDataset, setCachedDataset } from '@/lib/examples/cache'
import type { FeaturedExampleConfig, LoadingStatus } from '@/lib/examples/types'
import { loadDatasetFromUrl } from '@/lib/data/loader'
import type { ParsedDataset } from '@/types/observation'

interface UseExampleDataResult {
  dataset: ParsedDataset | null
  status: LoadingStatus
  error: Error | null
  retry: () => void
}

// Retry delays in milliseconds
const RETRY_DELAYS = [1000, 2000]
const MAX_RETRIES = 2

/**
 * Hook for fetching example dataset with caching and retry logic
 */
export function useExampleData(config: FeaturedExampleConfig): UseExampleDataResult {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      // Check cache first
      const cached = getCachedDataset(config.resourceUrl)
      if (cached) {
        setDataset(cached)
        setStatus('success')
        setError(null)
        return
      }

      setStatus('loading')
      setError(null)

      try {
        const result = await loadDatasetFromUrl(config.resourceUrl, {
          fetchInit: { signal },
        })

        // Cache the result
        setCachedDataset(config.resourceUrl, result)

        if (!signal.aborted) {
          setDataset(result)
          setStatus('success')
          setError(null)
          retryCountRef.current = 0
        }
      } catch (err) {
        if (!signal.aborted) {
          const fetchError = err instanceof Error ? err : new Error(String(err))

          // Automatic retry with exponential backoff
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++
            const delay = RETRY_DELAYS[retryCountRef.current - 1]

            retryTimeoutRef.current = setTimeout(() => {
              if (!signal.aborted) {
                const newController = new AbortController()
                abortControllerRef.current = newController
                fetchData(newController.signal)
              }
            }, delay)
          } else {
            setError(fetchError)
            setStatus('error')
          }
        }
      }
    },
    [config.resourceUrl]
  )

  const retry = useCallback(() => {
    // Cancel any in-flight request and pending retry
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    // Reset state
    retryCountRef.current = 0
    setError(null)

    // Start new fetch
    const controller = new AbortController()
    abortControllerRef.current = controller
    fetchData(controller.signal)
  }, [fetchData])

  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current = controller
    fetchData(controller.signal)

    return () => {
      controller.abort()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [fetchData])

  return { dataset, status, error, retry }
}
