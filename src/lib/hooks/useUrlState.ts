'use client'

import { useCallback, useEffect, useRef } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  createUrlHash,
  decodeUrlState,
  type PartialUrlState,
  type UrlState,
} from '@/lib/url'
const DEBOUNCE_MS = 500

export interface UseUrlStateOptions {
  /** Enable syncing state to URL hash */
  enabled?: boolean
  /** Debounce delay in ms */
  debounceMs?: number
  /** Callback when state is restored from URL */
  onStateRestored?: (state: PartialUrlState) => void
  /** Replace state instead of pushing (default: true to avoid history pollution) */
  replaceState?: boolean
}

/**
 * Hook for syncing chart state to URL hash
 * 
 * This hook:
 * 1. Reads initial state from URL hash on mount
 * 2. Debounces state changes and syncs them to URL hash
 * 3. Uses replaceState to avoid polluting browser history
 * 
 * @example
 * const { updateUrlState, initialState } = useUrlState({
 *   enabled: true,
 *   onStateRestored: (state) => {
 *     // Restore configurator state from URL
 *   }
 * })
 * 
 * // When configurator state changes:
 * updateUrlState(currentState)
 */
export function useUrlState(options: UseUrlStateOptions = {}) {
  const {
    enabled = true,
    debounceMs = DEBOUNCE_MS,
    onStateRestored,
    replaceState = true,
  } = options

  // Router available for future use
  useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)
  const lastSyncedState = useRef<string>('')
  const debounceTimeoutRef = useRef<number | null>(null)

  // Read initial state from URL hash (client-side only)
  const getInitialState = useCallback((): PartialUrlState | null => {
    if (typeof window === 'undefined') return null

    const hash = window.location.hash
    if (!hash || hash === '#' || !hash.startsWith('#s=')) return null

    const decodeResult = decodeUrlState(hash.slice(3)) // Remove '#s='
    if (decodeResult.success && decodeResult.state) {
      return decodeResult.state as PartialUrlState
    }

    return null
  }, [])

  // Update URL hash with debounced state
  const updateUrlState = useCallback(
    (state: PartialUrlState | UrlState | null) => {
      if (!enabled || typeof window === 'undefined') return

      // Don't update if state hasn't changed
      const stateJson = JSON.stringify(state)
      if (stateJson === lastSyncedState.current) return
      lastSyncedState.current = stateJson

      // Create hash from state
      const hash = state ? createUrlHash(state) : ''

      // Update URL without navigation
      const newUrl = hash
        ? `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}${hash}`
        : `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

      if (replaceState) {
        window.history.replaceState(null, '', newUrl)
      } else {
        window.history.pushState(null, '', newUrl)
      }
    },
    [enabled, pathname, replaceState, searchParams]
  )

  const debouncedUpdateUrlState = useCallback(
    (state: PartialUrlState | UrlState | null) => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = window.setTimeout(() => {
        updateUrlState(state)
      }, debounceMs)
    },
    [debounceMs, updateUrlState]
  )

  // Restore initial state on mount
  useEffect(() => {
    if (!enabled || !isInitialMount.current) return
    isInitialMount.current = false

    const initialState = getInitialState()
    if (initialState && onStateRestored) {
      onStateRestored(initialState)
    }
  }, [enabled, getInitialState, onStateRestored])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    updateUrlState: debouncedUpdateUrlState,
    getInitialState,
    /**
     * Clear URL hash state
     */
    clearUrlState: useCallback(() => {
      if (typeof window === 'undefined') return
      const newUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      window.history.replaceState(null, '', newUrl)
      lastSyncedState.current = ''
    }, [pathname, searchParams]),
  }
}

/**
 * Hook for reading URL state once on mount
 * Use this when you only need to read, not write
 */
export function useUrlStateReader() {
  const searchParams = useSearchParams()
  
  const getStateFromParams = useCallback(() => {
    const encoded = searchParams.get('s')
    if (!encoded) return null

    const result = decodeUrlState(encoded)
    return result.success ? result.state : null
  }, [searchParams])

  const getStateFromHash = useCallback(() => {
    if (typeof window === 'undefined') return null

    const hash = window.location.hash
    if (!hash || hash === '#' || !hash.startsWith('#s=')) return null

    const result = decodeUrlState(hash.slice(3))
    return result.success ? result.state : null
  }, [])

  return {
    getStateFromParams,
    getStateFromHash,
  }
}
