import { encodeUrlState } from '@/lib/url'
import type { UrlChartConfig, PartialUrlState } from '@/lib/url'

export type EmbedTheme = 'light' | 'dark' | 'auto'

export interface EmbedOptions {
  baseUrl: string
  state: PartialUrlState
  width?: string | number
  height?: string | number
  theme?: EmbedTheme
  title?: string
  includeResizeScript?: boolean
}

export interface EmbedCodeResult {
  iframe: string
  fullCode: string
  url: string
}

const DEFAULT_WIDTH = '100%'
const DEFAULT_HEIGHT = 500
const EMBED_SCRIPT_URL = '/embed.js'

/**
 * Generates an iframe embed code for a chart configuration
 */
export function generateEmbedCode(options: EmbedOptions): EmbedCodeResult {
  const {
    baseUrl,
    state,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    theme = 'light',
    title = 'Chart',
    includeResizeScript = true,
  } = options

  // Encode the state
  const encodedState = encodeUrlState(state)

  // Build the embed URL
  const embedUrl = new URL('/embed/chart', baseUrl)
  embedUrl.searchParams.set('s', encodedState)
  if (theme !== 'light') {
    embedUrl.searchParams.set('theme', theme)
  }

  const widthStr = typeof width === 'number' ? `${width}px` : width
  const heightStr = typeof height === 'number' ? `${height}px` : height

  // Generate iframe tag
  const iframe = `<iframe
  src="${embedUrl.toString()}"
  width="${widthStr}"
  height="${heightStr}"
  frameborder="0"
  style="border: none;"
  title="${escapeHtml(title)}"
  loading="lazy"
  data-viz-admin-embed
></iframe>`

  // Include optional resize script
  const scriptTag = includeResizeScript
    ? `\n<script src="${baseUrl}${EMBED_SCRIPT_URL}" defer></script>`
    : ''

  const fullCode = iframe + scriptTag

  return {
    iframe: iframe.replace(/\s+/g, ' ').trim(),
    fullCode,
    url: embedUrl.toString(),
  }
}

/**
 * Parse theme parameter from URL
 */
export function parseEmbedTheme(param: string | null): EmbedTheme {
  if (param === 'dark' || param === 'auto') {
    return param
  }
  return 'light'
}

/**
 * Generate embed code for a specific chart config
 */
export function generateChartEmbedCode(
  baseUrl: string,
  datasetId: string,
  resourceId: string,
  config: UrlChartConfig,
  options: {
    datasetTitle?: string
    organizationName?: string
    theme?: EmbedTheme
    width?: string | number
    height?: string | number
  } = {}
): EmbedCodeResult {
  const state: PartialUrlState = {
    v: 1,
    dataset: {
      datasetId,
      resourceId,
      datasetTitle: options.datasetTitle,
      organizationName: options.organizationName,
    },
    config: {
      type: config.type,
      title: config.title ?? '',
      description: config.description,
      x_axis: config.x_axis,
      y_axis: config.y_axis,
      options: config.options,
    },
  }

  return generateEmbedCode({
    baseUrl,
    state,
    title: config.title || 'Chart',
    theme: options.theme,
    width: options.width,
    height: options.height,
  })
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Get theme CSS variables based on theme setting
 */
export function getThemeStyles(theme: EmbedTheme): Record<string, string> {
  const lightTheme = {
    '--bg': '#ffffff',
    '--fg': '#0f172a',
    '--muted': '#64748b',
    '--accent': '#c53030',
    '--border': '#e2e8f0',
    '--chart-bg': '#ffffff',
  }

  const darkTheme = {
    '--bg': '#0f172a',
    '--fg': '#f8fafc',
    '--muted': '#94a3b8',
    '--accent': '#f87171',
    '--border': '#334155',
    '--chart-bg': '#1e293b',
  }

  if (theme === 'dark') {
    return darkTheme
  }

  if (theme === 'auto') {
    // Return CSS that handles both
    return {
      ...lightTheme,
      '--bg': 'light-dark(#ffffff, #0f172a)',
      '--fg': 'light-dark(#0f172a, #f8fafc)',
      '--muted': 'light-dark(#64748b, #94a3b8)',
      '--accent': 'light-dark(#c53030, #f87171)',
      '--border': 'light-dark(#e2e8f0, #334155)',
      '--chart-bg': 'light-dark(#ffffff, #1e293b)',
    }
  }

  return lightTheme
}
