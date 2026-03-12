import {
  PALETTES,
  getPalette,
  getAllPalettes,
  getPalettesByType,
  getColorblindSafePalettes,
  getPaletteColors,
  getDefaultPaletteForChartType,
  DEFAULT_PALETTE_ID,
} from '@/lib/charts/palettes'

describe('color palettes', () => {
  describe('palette registry', () => {
    it('contains all required palettes', () => {
      // Government palettes
      expect(PALETTES['serbian-primary']).toBeDefined()
      expect(PALETTES['serbian-flag']).toBeDefined()
      expect(PALETTES['serbian-extended']).toBeDefined()
      expect(PALETTES['serbian-neutral']).toBeDefined()

      // Sequential palettes
      expect(PALETTES['blues']).toBeDefined()
      expect(PALETTES['greens']).toBeDefined()
      expect(PALETTES['reds']).toBeDefined()

      // Diverging palettes
      expect(PALETTES['rd-bu']).toBeDefined()
      expect(PALETTES['rd-yl-gn']).toBeDefined()

      // Categorical palettes
      expect(PALETTES['category10']).toBeDefined()
      expect(PALETTES['tableau10']).toBeDefined()
    })

    it('has at least 15 palettes', () => {
      const palettes = getAllPalettes()
      expect(palettes.length).toBeGreaterThanOrEqual(15)
    })
  })

  describe('getPalette', () => {
    it('returns a palette by ID', () => {
      const palette = getPalette('serbian-primary')
      expect(palette).toBeDefined()
      expect(palette?.name).toBe('palettes.serbianPrimary')
      expect(palette?.type).toBe('sequential')
      expect(palette?.source).toBe('government')
    })

    it('returns undefined for unknown palette', () => {
      expect(getPalette('unknown-palette')).toBeUndefined()
    })
  })

  describe('getPalettesByType', () => {
    it('returns sequential palettes', () => {
      const palettes = getPalettesByType('sequential')
      expect(palettes.length).toBeGreaterThan(0)
      expect(palettes.every(p => p.type === 'sequential')).toBe(true)
    })

    it('returns diverging palettes', () => {
      const palettes = getPalettesByType('diverging')
      expect(palettes.length).toBeGreaterThan(0)
      expect(palettes.every(p => p.type === 'diverging')).toBe(true)
    })

    it('returns categorical palettes', () => {
      const palettes = getPalettesByType('categorical')
      expect(palettes.length).toBeGreaterThan(0)
      expect(palettes.every(p => p.type === 'categorical')).toBe(true)
    })
  })

  describe('getColorblindSafePalettes', () => {
    it('returns only colorblind-safe palettes', () => {
      const palettes = getColorblindSafePalettes()
      expect(palettes.length).toBeGreaterThan(0)
      expect(palettes.every(p => p.colorblindSafe)).toBe(true)
    })
  })

  describe('getPaletteColors', () => {
    it('returns palette colors unchanged when no count specified', () => {
      const colors = getPaletteColors('serbian-primary')
      expect(colors).toEqual(PALETTES['serbian-primary'].colors)
    })

    it('returns default colors for unknown palette', () => {
      const colors = getPaletteColors('unknown-palette')
      expect(colors).toEqual(PALETTES['serbian-primary'].colors)
    })

    it('interpolates sequential palettes', () => {
      const colors = getPaletteColors('blues', 5)
      expect(colors.length).toBe(5)
    })

    it('cycles categorical palettes', () => {
      const colors = getPaletteColors('category10', 15)
      expect(colors.length).toBe(15)
      // Should cycle the palette
      expect(colors[0]).toBe(colors[10])
    })

    it('truncates categorical palettes', () => {
      const colors = getPaletteColors('category10', 3)
      expect(colors.length).toBe(3)
    })
  })

  describe('getDefaultPaletteForChartType', () => {
    it('returns serbian-primary for map charts', () => {
      expect(getDefaultPaletteForChartType('map')).toBe('serbian-primary')
    })

    it('returns serbian-primary for line charts', () => {
      expect(getDefaultPaletteForChartType('line')).toBe('serbian-primary')
    })

    it('returns category10 for pie charts', () => {
      expect(getDefaultPaletteForChartType('pie')).toBe('category10')
    })

    it('returns category10 for bar charts', () => {
      expect(getDefaultPaletteForChartType('bar')).toBe('category10')
    })
  })

  describe('DEFAULT_PALETTE_ID', () => {
    it('is serbian-primary', () => {
      expect(DEFAULT_PALETTE_ID).toBe('serbian-primary')
    })
  })
})
