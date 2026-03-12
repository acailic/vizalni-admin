/**
 * URL state encoding utilities
 * Compresses and encodes chart state for shareable URLs
 */
import * as LZString from 'lz-string'

import type { UrlState, PartialUrlState } from './state-schema'
import { URL_STATE_VERSION } from './state-schema'

/**
 * Encode state to URL-safe string
 * Process: JSON serialize → LZ-string compress → Base64 URL-safe encode
 */
export function encodeUrlState(state: UrlState | PartialUrlState): string {
  // Ensure version is set
  const stateWithVersion = {
    ...state,
    v: URL_STATE_VERSION,
  }

  // Serialize to JSON
  const json = JSON.stringify(stateWithVersion)

  // Compress with LZ-string (handles Unicode/Cyrillic properly)
  const compressed = LZString.compressToEncodedURIComponent(json)

  return compressed
}

/**
 * Calculate the approximate URL length for a given state
 * Useful for checking if URL will be under 2000 character limit
 */
export function estimateUrlLength(state: UrlState | PartialUrlState): number {
  const encoded = encodeUrlState(state)
  // Base URL path: /v/chart?s=
  const basePathLength = '/v/chart?s='.length
  return basePathLength + encoded.length
}

/**
 * Check if state will fit within URL limits
 * Most browsers support ~2000 characters for URLs
 */
export function isStateWithinUrlLimit(state: UrlState | PartialUrlState, maxLength = 2000): boolean {
  return estimateUrlLength(state) <= maxLength
}

/**
 * Create a full shareable URL from state
 */
export function createShareableUrl(
  state: UrlState,
  baseUrl: string = ''
): string {
  const encoded = encodeUrlState(state)
  const path = `/v/chart?s=${encoded}`
  
  if (baseUrl) {
    // Remove trailing slash from baseUrl
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    return `${cleanBaseUrl}${path}`
  }
  
  return path
}

/**
 * Create URL hash string for configurator sync
 * Uses hash instead of path to avoid page reload
 */
export function createUrlHash(state: PartialUrlState): string {
  const encoded = encodeUrlState(state)
  return `#s=${encoded}`
}
