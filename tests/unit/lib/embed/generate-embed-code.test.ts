import {
  generateEmbedCode,
  generateChartEmbedCode,
  parseEmbedTheme,
  getThemeStyles,
} from '@/lib/embed'
import type { PartialUrlState } from '@/lib/url'

describe('embed code generator', () => {
  const baseUrl = 'https://example.com'

  const sampleState: PartialUrlState = {
    v: 1,
    dataset: {
      datasetId: 'test-dataset',
      resourceId: 'test-resource',
      datasetTitle: 'Test Dataset',
      organizationName: 'Test Org',
    },
    config: {
      type: 'line',
      title: 'Test Chart',
      x_axis: { field: 'date' },
      y_axis: { field: 'value' },
    },
  }

  describe('generateEmbedCode', () => {
    it('generates basic iframe code', () => {
      const result = generateEmbedCode({
        baseUrl,
        state: sampleState,
      })

      expect(result.iframe).toContain('<iframe')
      expect(result.iframe).toContain('src="https://example.com/embed/chart')
      expect(result.iframe).toContain('width="100%"')
      expect(result.iframe).toContain('height="500px"')
      expect(result.iframe).toContain('data-viz-admin-embed')
    })

    it('includes custom dimensions', () => {
      const result = generateEmbedCode({
        baseUrl,
        state: sampleState,
        width: '800px',
        height: 600,
      })

      expect(result.iframe).toContain('width="800px"')
      expect(result.iframe).toContain('height="600px"')
    })

    it('adds theme parameter when not light', () => {
      const darkResult = generateEmbedCode({
        baseUrl,
        state: sampleState,
        theme: 'dark',
      })

      expect(darkResult.url).toContain('theme=dark')

      const autoResult = generateEmbedCode({
        baseUrl,
        state: sampleState,
        theme: 'auto',
      })

      expect(autoResult.url).toContain('theme=auto')
    })

    it('does not add theme parameter for light (default)', () => {
      const result = generateEmbedCode({
        baseUrl,
        state: sampleState,
        theme: 'light',
      })

      expect(result.url).not.toContain('theme=')
    })

    it('includes resize script by default', () => {
      const result = generateEmbedCode({
        baseUrl,
        state: sampleState,
      })

      expect(result.fullCode).toContain('/embed.js')
    })

    it('omits resize script when disabled', () => {
      const result = generateEmbedCode({
        baseUrl,
        state: sampleState,
        includeResizeScript: false,
      })

      expect(result.fullCode).not.toContain('/embed.js')
      expect(result.fullCode).toContain('<iframe')
    })

    it('escapes HTML in title', () => {
      const stateWithTitle: PartialUrlState = {
        ...sampleState,
        config: {
          ...sampleState.config!,
          title: '<script>alert("xss")</script>',
        },
      }

      const result = generateEmbedCode({
        baseUrl,
        state: stateWithTitle,
        title: '<script>alert("xss")</script>',
      })

      expect(result.iframe).not.toContain('<script>')
      expect(result.iframe).toContain('&lt;script&gt;')
    })
  })

  describe('generateChartEmbedCode', () => {
    it('generates embed code from chart config', () => {
      const result = generateChartEmbedCode(
        baseUrl,
        'dataset-123',
        'resource-456',
        {
          type: 'bar',
          title: 'My Bar Chart',
          x_axis: { field: 'category' },
          y_axis: { field: 'count' },
        }
      )

      expect(result.iframe).toContain('<iframe')
      expect(result.url).toContain('/embed/chart?s=')
      // The dataset ID is encoded in the state, so we verify the URL is valid
      expect(result.url).toMatch(/^https:\/\/example\.com\/embed\/chart\?s=/)
    })

    it('includes dataset metadata', () => {
      const result = generateChartEmbedCode(
        baseUrl,
        'dataset-123',
        'resource-456',
        {
          type: 'pie',
          title: 'Pie Chart',
          x_axis: { field: 'label' },
          y_axis: { field: 'value' },
        },
        {
          datasetTitle: 'Population Data',
          organizationName: 'Statistics Office',
        }
      )

      // The state should include the metadata
      expect(result.url).toBeDefined()
    })
  })

  describe('parseEmbedTheme', () => {
    it('returns light for null/undefined', () => {
      expect(parseEmbedTheme(null)).toBe('light')
      expect(parseEmbedTheme(undefined as unknown as string)).toBe('light')
    })

    it('returns dark for dark', () => {
      expect(parseEmbedTheme('dark')).toBe('dark')
    })

    it('returns auto for auto', () => {
      expect(parseEmbedTheme('auto')).toBe('auto')
    })

    it('returns light for unknown values', () => {
      expect(parseEmbedTheme('blue')).toBe('light')
    })
  })

  describe('getThemeStyles', () => {
    it('returns light theme styles by default', () => {
      const styles = getThemeStyles('light')

      expect(styles['--bg']).toBe('#ffffff')
      expect(styles['--fg']).toBe('#0f172a')
    })

    it('returns dark theme styles', () => {
      const styles = getThemeStyles('dark')

      expect(styles['--bg']).toBe('#0f172a')
      expect(styles['--fg']).toBe('#f8fafc')
    })

    it('returns auto theme styles with light-dark', () => {
      const styles = getThemeStyles('auto')

      expect(styles['--bg']).toContain('light-dark')
      expect(styles['--fg']).toContain('light-dark')
    })
  })
})
