import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { getDatasetDetailData, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'
import { loadDatasetFromUrl } from '@/lib/data/loader'
import { parseEmbedTheme, getThemeStyles } from '@/lib/embed'
import { decodeFullUrlState, type UrlState } from '@/lib/url'

import EmbedClientScript from './client'

interface EmbedChartPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EmbedChartPage({ searchParams }: EmbedChartPageProps) {
  const resolvedSearchParams = await searchParams

  // Extract encoded state from URL params
  const encoded = Array.isArray(resolvedSearchParams.s)
    ? resolvedSearchParams.s[0]
    : resolvedSearchParams.s

  // Parse theme
  const themeParam = Array.isArray(resolvedSearchParams.theme)
    ? resolvedSearchParams.theme[0]
    : resolvedSearchParams.theme
  const theme = parseEmbedTheme(themeParam ?? null)

  // Decode URL state
  if (!encoded) {
    return (
      <EmbedError
        message="No chart state provided"
        theme={theme}
      />
    )
  }

  const decodeResult = decodeFullUrlState(encoded)

  if (!decodeResult.success || !decodeResult.state) {
    return (
      <EmbedError
        message="Invalid or corrupted chart state"
        theme={theme}
      />
    )
  }

  const state = decodeResult.state as UrlState
  const { dataset, config } = state

  // Validate required fields
  if (!dataset.datasetId || !dataset.resourceId) {
    return (
      <EmbedError
        message="Missing required chart information"
        theme={theme}
      />
    )
  }

  // Try to load the dataset
  let chartData: Record<string, unknown>[] = []
  let datasetTitle = dataset.datasetTitle || 'Dataset'
  let organizationName = dataset.organizationName

  try {
    // Get dataset metadata from API
    const { dataset: datasetInfo, previewResource } = await getDatasetDetailData(dataset.datasetId)
    datasetTitle = datasetInfo.title || datasetTitle
    organizationName = datasetInfo.organization?.name || organizationName

    // Check if resource is previewable
    if (previewResource && isPreviewableFormat(previewResource.format)) {
      const previewUrl = new URL(previewResource.url)

      if (isAllowedPreviewHost(previewUrl.hostname)) {
        const parsedDataset = await loadDatasetFromUrl(previewResource.url, {
          datasetId: dataset.datasetId,
          resourceId: dataset.resourceId,
          resourceUrl: previewResource.url,
          format: previewResource.format,
          rowLimit: 1000,
        })

        chartData = parsedDataset.observations as Record<string, unknown>[]
      }
    }
  } catch {
    // Silent fail - we'll render what we can
  }

  // Get theme styles
  const themeStyles = getThemeStyles(theme)

  // Build chart config
  const chartConfig = {
    ...config,
    dataset_id: dataset.datasetId,
  }

  return (
    <html lang="sr" style={themeStyles}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{config.title || datasetTitle}</title>
        <style dangerouslySetInnerHTML={{ __html: getEmbedStyles(theme) }} />
      </head>
      <body>
        <EmbedClientScript />
        <div className="embed-container">
          {chartData.length > 0 ? (
            <ChartRenderer
              config={chartConfig}
              data={chartData}
              height={400}
              locale="sr-Cyrl"
              sourceDataset={datasetTitle}
            />
          ) : (
            <div className="embed-error">
              <p>Unable to load chart data</p>
            </div>
          )}

          {/* Source attribution */}
          <footer className="embed-attribution">
            <a
              href={`https://data.gov.rs/dataset/${dataset.datasetId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {organizationName ? `${organizationName} • ` : ''}data.gov.rs
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}

function EmbedError({ message, theme }: { message: string; theme: 'light' | 'dark' | 'auto' }) {
  const themeStyles = getThemeStyles(theme)

  return (
    <html lang="sr" style={themeStyles}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chart Error</title>
        <style dangerouslySetInnerHTML={{ __html: getEmbedStyles(theme) }} />
      </head>
      <body>
        <EmbedClientScript />
        <div className="embed-container">
          <div className="embed-error">
            <p>{message}</p>
          </div>
          <footer className="embed-attribution">
            <a href="https://data.gov.rs" target="_blank" rel="noopener noreferrer">
              data.gov.rs
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}

function getEmbedStyles(theme: 'light' | 'dark' | 'auto'): string {
  const darkBg = '#0f172a'
  const darkFg = '#f8fafc'
  const darkMuted = '#94a3b8'
  const lightBg = '#ffffff'
  const lightFg = '#0f172a'
  const lightMuted = '#64748b'

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
    }

    .embed-container {
      padding: 16px;
      padding-bottom: 40px;
      position: relative;
    }

    .embed-error {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: var(--muted);
    }

    .embed-attribution {
      position: absolute;
      bottom: 8px;
      right: 16px;
      font-size: 11px;
    }

    .embed-attribution a {
      color: var(--muted);
      text-decoration: none;
    }

    .embed-attribution a:hover {
      text-decoration: underline;
    }
  `

  if (theme === 'auto') {
    return `
      ${baseStyles}

      @media (prefers-color-scheme: light) {
        :root {
          --bg: ${lightBg};
          --fg: ${lightFg};
          --muted: ${lightMuted};
        }
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg: ${darkBg};
          --fg: ${darkFg};
          --muted: ${darkMuted};
        }
      }
    `
  }

  return baseStyles
}

// Generate metadata
export async function generateMetadata({ searchParams }: EmbedChartPageProps) {
  const resolvedSearchParams = await searchParams
  const encoded = Array.isArray(resolvedSearchParams.s)
    ? resolvedSearchParams.s[0]
    : resolvedSearchParams.s

  let title = 'Chart'

  if (encoded) {
    const decodeResult = decodeFullUrlState(encoded)
    if (decodeResult.success && decodeResult.state) {
      const state = decodeResult.state as UrlState
      title = state.config?.title || 'Chart'
    }
  }

  return { title }
}
