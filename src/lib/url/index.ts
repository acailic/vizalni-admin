/**
 * URL State Encoding/Decoding utilities
 * 
 * This module provides functions to encode and decode chart state
 * into shareable URLs. Uses LZ-string compression to keep URLs
 * short while supporting Unicode characters like Cyrillic.
 * 
 * @example
 * // Encoding state to URL
 * import { encodeUrlState, createShareableUrl } from '@/lib/url'
 * 
 * const state = {
 *   dataset: { datasetId: '123', resourceId: '456' },
 *   config: { type: 'line', title: 'My Chart' }
 * }
 * const url = createShareableUrl(state)
 * 
 * @example
 * // Decoding state from URL
 * import { decodeUrlState, extractStateFromParams } from '@/lib/url'
 * 
 * const result = extractStateFromParams(searchParams)
 * if (result.success) {
 *   const state = result.state
 * }
 */

// Schema and types
export {
  URL_STATE_VERSION,
  urlStateSchema,
  partialUrlStateSchema,
  urlAxisConfigSchema,
  urlChartOptionsSchema,
  urlChartConfigSchema,
  urlDatasetReferenceSchema,
  urlInteractiveFiltersSchema,
  urlFilterValueSchema,
  validateUrlState,
  validatePartialUrlState,
  type UrlState,
  type PartialUrlState,
  type UrlAxisConfig,
  type UrlChartOptions,
  type UrlChartConfig,
  type UrlDatasetReference,
  type UrlInteractiveFilters,
  type UrlFilterValue,
} from './state-schema'

// Encoding
export {
  encodeUrlState,
  estimateUrlLength,
  isStateWithinUrlLimit,
  createShareableUrl,
  createUrlHash,
} from './encode-state'

// Decoding
export {
  decodeUrlState,
  decodeFullUrlState,
  extractStateFromParams,
  extractStateFromHash,
  isEncodedState,
  type DecodeResult,
} from './decode-state'
