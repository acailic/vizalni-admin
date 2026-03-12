/**
 * URL state decoding utilities
 * Decodes and validates chart state from shareable URLs
 */
import * as LZString from 'lz-string'

import type { UrlState, PartialUrlState } from './state-schema'
import { urlStateSchema, partialUrlStateSchema, URL_STATE_VERSION } from './state-schema'

export interface DecodeResult {
  success: boolean
  state?: UrlState | PartialUrlState
  error?: string
  errorType?: 'invalid_format' | 'invalid_version' | 'validation_error' | 'corrupted'
}

/**
 * Decode state from URL-safe string
 * Process: Base64 URL-safe decode → LZ-string decompress → JSON parse → Validate
 */
export function decodeUrlState(encoded: string): DecodeResult {
  try {
    // Handle empty or missing encoded string
    if (!encoded || encoded.trim() === '') {
      return {
        success: false,
        error: 'No state provided',
        errorType: 'invalid_format',
      }
    }

    // Decompress with LZ-string
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded)

    if (!decompressed) {
      return {
        success: false,
        error: 'Failed to decompress state',
        errorType: 'corrupted',
      }
    }

    // Parse JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(decompressed)
    } catch {
      return {
        success: false,
        error: 'Invalid JSON format',
        errorType: 'invalid_format',
      }
    }

    // Check version compatibility
    if (typeof parsed === 'object' && parsed !== null && 'v' in parsed) {
      const version = (parsed as { v: unknown }).v
      if (version !== URL_STATE_VERSION) {
        return {
          success: false,
          error: `Unsupported state version: ${version}. Expected: ${URL_STATE_VERSION}`,
          errorType: 'invalid_version',
        }
      }
    }

    // Validate against schema
    const fullResult = urlStateSchema.safeParse(parsed)
    if (fullResult.success) {
      return {
        success: true,
        state: fullResult.data,
      }
    }

    // Try partial schema for configurator
    const partialResult = partialUrlStateSchema.safeParse(parsed)
    if (partialResult.success) {
      return {
        success: true,
        state: partialResult.data,
      }
    }

    return {
      success: false,
      error: 'State validation failed',
      errorType: 'validation_error',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during decoding',
      errorType: 'corrupted',
    }
  }
}

/**
 * Decode and require full valid state (for view page)
 */
export function decodeFullUrlState(encoded: string): DecodeResult {
  const result = decodeUrlState(encoded)

  if (!result.success || !result.state) {
    return result
  }

  // Check if it's a full state (has required fields)
  const state = result.state as PartialUrlState
  if (!state.dataset?.datasetId || !state.config?.type) {
    return {
      success: false,
      error: 'Incomplete state: missing required fields',
      errorType: 'validation_error',
    }
  }

  return result
}

/**
 * Extract state from URL search params
 */
export function extractStateFromParams(params: URLSearchParams): DecodeResult {
  const encoded = params.get('s')
  
  if (!encoded) {
    return {
      success: false,
      error: 'No state parameter found in URL',
      errorType: 'invalid_format',
    }
  }

  return decodeUrlState(encoded)
}

/**
 * Extract state from URL hash
 */
export function extractStateFromHash(hash: string): DecodeResult {
  // Hash format: #s=encoded_state
  const match = hash.match(/^#s=(.+)$/)
  
  if (!match || !match[1]) {
    return {
      success: false,
      error: 'No state found in URL hash',
      errorType: 'invalid_format',
    }
  }

  return decodeUrlState(match[1])
}

/**
 * Check if a string looks like an encoded state
 */
export function isEncodedState(value: string): boolean {
  // LZ-string encoded strings have specific characteristics
  // They typically contain alphanumeric chars, -, _, and .
  if (!value || value.length < 10) return false
  
  // Check for reasonable length
  if (value.length > 10000) return false
  
  // Check for valid characters (base64url-like)
  const validChars = /^[A-Za-z0-9\-_.~!*$,()@%/]+$/
  return validChars.test(value)
}
