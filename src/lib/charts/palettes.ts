/**
 * Color Palette System for Charts
 *
 * Provides built-in palettes including Serbian government official colors,
 * sequential, diverging, and categorical palettes from d3-scale-chromatic.
 */

export type PaletteType = 'sequential' | 'diverging' | 'categorical'

export interface ColorPalette {
  id: string
  name: string // Translation key like 'palettes.serbianPrimary'
  type: PaletteType
  colors: string[]
  colorblindSafe: boolean
  source: 'built-in' | 'government' | 'user'
}

// Serbian Government Official Colors
const SERBIAN_GOVERNMENT_BLUE = '#0D4077'
const SERBIAN_GOVERNMENT_RED = '#C6363C'
const SERBIAN_GOVERNMENT_WHITE = '#FFFFFF'
// const SERBIAN_GOVERNMENT_GOLD = '#D4AF37' // Reserved for future use

// Serbian government palettes
const SERBIAN_PRIMARY: ColorPalette = {
  id: 'serbian-primary',
  name: 'palettes.serbianPrimary',
  type: 'sequential',
  colors: ['#E8F4FD', '#B8D9F7', '#7BBEF0', '#4B90F5', '#2E6BC4', '#0D4077'],
  colorblindSafe: true,
  source: 'government',
}

const SERBIAN_FLAG: ColorPalette = {
  id: 'serbian-flag',
  name: 'palettes.serbianFlag',
  type: 'categorical',
  colors: [SERBIAN_GOVERNMENT_RED, SERBIAN_GOVERNMENT_BLUE, SERBIAN_GOVERNMENT_WHITE],
  colorblindSafe: false,
  source: 'government',
}

const SERBIAN_EXTENDED: ColorPalette = {
  id: 'serbian-extended',
  name: 'palettes.serbianExtended',
  type: 'categorical',
  colors: ['#C6363C', '#0D4077', '#D4AF37', '#4B90F5', '#2E6BC4', '#1A5F9E', '#8B4513', '#228B22'],
  colorblindSafe: false,
  source: 'government',
}

const SERBIAN_NEUTRAL: ColorPalette = {
  id: 'serbian-neutral',
  name: 'palettes.serbianNeutral',
  type: 'sequential',
  colors: ['#F8FAFC', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B'],
  colorblindSafe: true,
  source: 'government',
}

// Sequential palettes (from d3-scale-chromatic)
const BLUES: ColorPalette = {
  id: 'blues',
  name: 'palettes.blues',
  type: 'sequential',
  colors: ['#F7FBFF', '#DEEBF7', '#C6DBEF', '#9ECAE1', '#6BAED6', '#4292C6', '#2171B5', '#084594'],
  colorblindSafe: true,
  source: 'built-in',
}

const GREENS: ColorPalette = {
  id: 'greens',
  name: 'palettes.greens',
  type: 'sequential',
  colors: ['#F7FCF5', '#E5F5E0', '#C7E9C0', '#A1D99B', '#74C476', '#41AB5D', '#238B45', '#005A32'],
  colorblindSafe: true,
  source: 'built-in',
}

const ORANGES: ColorPalette = {
  id: 'oranges',
  name: 'palettes.oranges',
  type: 'sequential',
  colors: ['#FFF5EB', '#FEE6CE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#F16913', '#D94801', '#8C2D04'],
  colorblindSafe: false,
  source: 'built-in',
}

const REDS: ColorPalette = {
  id: 'reds',
  name: 'palettes.reds',
  type: 'sequential',
  colors: ['#FFF5F0', '#FEE0D2', '#FCBBA1', '#FC9272', '#FB6A4A', '#EF3B2C', '#CB181D', '#99000D'],
  colorblindSafe: false,
  source: 'built-in',
}

const PURPLES: ColorPalette = {
  id: 'purples',
  name: 'palettes.purples',
  type: 'sequential',
  colors: ['#FCFBFD', '#EFEDF5', '#DADAEB', '#BCBDDC', '#9E9AC8', '#807DBA', '#6A51A3', '#4A1486'],
  colorblindSafe: false,
  source: 'built-in',
}

const GREYS: ColorPalette = {
  id: 'greys',
  name: 'palettes.greys',
  type: 'sequential',
  colors: ['#FFFFFF', '#F0F0F0', '#D9D9D9', '#BDBDBD', '#969696', '#737373', '#525252', '#252525'],
  colorblindSafe: true,
  source: 'built-in',
}

// Diverging palettes
const RD_BU: ColorPalette = {
  id: 'rd-bu',
  name: 'palettes.rdBu',
  type: 'diverging',
  colors: ['#67001F', '#B2182B', '#D6604D', '#F4A582', '#FDDBC7', '#F7F7F7', '#D1E5F0', '#92C5DE', '#4393C3', '#2166AC', '#053061'],
  colorblindSafe: false,
  source: 'built-in',
}

const RD_YL_GN: ColorPalette = {
  id: 'rd-yl-gn',
  name: 'palettes.rdYlGn',
  type: 'diverging',
  colors: ['#A50026', '#D73027', '#F46D43', '#FDAE61', '#FEE08B', '#FFFFBF', '#D9EF8B', '#A6D96A', '#66BD63', '#1A9850', '#006837'],
  colorblindSafe: false,
  source: 'built-in',
}

const PI_YG: ColorPalette = {
  id: 'pi-yg',
  name: 'palettes.piYg',
  type: 'diverging',
  colors: ['#8E0152', '#C51B7D', '#DE77AE', '#F1B6DA', '#FDE0EF', '#F7F7F7', '#E6F5D0', '#B8E186', '#7FBC41', '#4D9221', '#276419'],
  colorblindSafe: false,
  source: 'built-in',
}

const BR_BG: ColorPalette = {
  id: 'br-bg',
  name: 'palettes.brBg',
  type: 'diverging',
  colors: ['#543005', '#8C510A', '#BF812D', '#DFC27D', '#F6E8C3', '#F5F5F5', '#C7EAE5', '#80CDC1', '#35978F', '#01665E', '#003C30'],
  colorblindSafe: true,
  source: 'built-in',
}

const PR_GN: ColorPalette = {
  id: 'pr-gn',
  name: 'palettes.prGn',
  type: 'diverging',
  colors: ['#40004B', '#762A83', '#9970AB', '#C2A5CF', '#E7D4E8', '#F7F7F7', '#D9F0D3', '#A6DBA0', '#5AAE61', '#1B7837', '#00441B'],
  colorblindSafe: true,
  source: 'built-in',
}

// Categorical palettes
const CATEGORY10: ColorPalette = {
  id: 'category10',
  name: 'palettes.category10',
  type: 'categorical',
  colors: ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'],
  colorblindSafe: false,
  source: 'built-in',
}

const TABLEAU10: ColorPalette = {
  id: 'tableau10',
  name: 'palettes.tableau10',
  type: 'categorical',
  colors: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'],
  colorblindSafe: true,
  source: 'built-in',
}

const SET1: ColorPalette = {
  id: 'set1',
  name: 'palettes.set1',
  type: 'categorical',
  colors: ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00', '#FFFF33', '#A65628', '#F781BF', '#999999'],
  colorblindSafe: false,
  source: 'built-in',
}

const SET2: ColorPalette = {
  id: 'set2',
  name: 'palettes.set2',
  type: 'categorical',
  colors: ['#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854', '#FFD92F', '#E5C494', '#B3B3B3'],
  colorblindSafe: false,
  source: 'built-in',
}

const DARK2: ColorPalette = {
  id: 'dark2',
  name: 'palettes.dark2',
  type: 'categorical',
  colors: ['#1B9E77', '#D95F02', '#7570B3', '#E7298A', '#66A61E', '#E6AB02', '#A6761D', '#666666'],
  colorblindSafe: true,
  source: 'built-in',
}

const PASTEL1: ColorPalette = {
  id: 'pastel1',
  name: 'palettes.pastel1',
  type: 'categorical',
  colors: ['#FBB4AE', '#B3CDE3', '#CCEBC5', '#DECBE4', '#FED9A6', '#FFFFCC', '#E5D8BD', '#FDDAEC', '#F2F2F2'],
  colorblindSafe: false,
  source: 'built-in',
}

// Perceptually uniform palettes (colorblind-safe)
const VIRIDIS: ColorPalette = {
  id: 'viridis',
  name: 'palettes.viridis',
  type: 'sequential',
  colors: ['#440154', '#482878', '#3E4A89', '#31688E', '#26838F', '#1F9E89', '#35B779', '#6ECE58', '#B5DE2B', '#FDE725'],
  colorblindSafe: true,
  source: 'built-in',
}

const PLASMA: ColorPalette = {
  id: 'plasma',
  name: 'palettes.plasma',
  type: 'sequential',
  colors: ['#0D0887', '#46039F', '#7201A8', '#9C179E', '#BD3786', '#D8576B', '#ED7953', '#FB9F3A', '#FDCA26', '#F0F921'],
  colorblindSafe: false,
  source: 'built-in',
}

const INFERNO: ColorPalette = {
  id: 'inferno',
  name: 'palettes.inferno',
  type: 'sequential',
  colors: ['#000004', '#1B0C41', '#4A0C6B', '#781C6D', '#A52C60', '#CF4446', '#ED6925', '#FB9B06', '#F7D13D', '#FCFFA4'],
  colorblindSafe: false,
  source: 'built-in',
}

// Colorblind-safe categorical
const OKABE_ITO: ColorPalette = {
  id: 'okabe-ito',
  name: 'palettes.okabeIto',
  type: 'categorical',
  colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'],
  colorblindSafe: true,
  source: 'built-in',
}

// Palette registry
export const PALETTES: Record<string, ColorPalette> = {
  // Government palettes
  [SERBIAN_PRIMARY.id]: SERBIAN_PRIMARY,
  [SERBIAN_FLAG.id]: SERBIAN_FLAG,
  [SERBIAN_EXTENDED.id]: SERBIAN_EXTENDED,
  [SERBIAN_NEUTRAL.id]: SERBIAN_NEUTRAL,
  // Sequential palettes
  [BLUES.id]: BLUES,
  [GREENS.id]: GREENS,
  [ORANGES.id]: ORANGES,
  [REDS.id]: REDS,
  [PURPLES.id]: PURPLES,
  [GREYS.id]: GREYS,
  // Diverging palettes
  [RD_BU.id]: RD_BU,
  [RD_YL_GN.id]: RD_YL_GN,
  [PI_YG.id]: PI_YG,
  [BR_BG.id]: BR_BG,
  [PR_GN.id]: PR_GN,
  // Categorical palettes
  [CATEGORY10.id]: CATEGORY10,
  [TABLEAU10.id]: TABLEAU10,
  [SET1.id]: SET1,
  [SET2.id]: SET2,
  [DARK2.id]: DARK2,
  [PASTEL1.id]: PASTEL1,
  // Perceptually uniform palettes
  [VIRIDIS.id]: VIRIDIS,
  [PLASMA.id]: PLASMA,
  [INFERNO.id]: INFERNO,
  [OKABE_ITO.id]: OKABE_ITO,
}

/**
 * Get a palette by ID
 */
export function getPalette(paletteId: string): ColorPalette | undefined {
  return PALETTES[paletteId]
}

/**
 * Get all palettes
 */
export function getAllPalettes(): ColorPalette[] {
  return Object.values(PALETTES)
}

/**
 * Get palettes by type
 */
export function getPalettesByType(type: PaletteType): ColorPalette[] {
  return Object.values(PALETTES).filter(p => p.type === type)
}

/**
 * Get palettes by source
 */
export function getPalettesBySource(source: 'built-in' | 'government' | 'user'): ColorPalette[] {
  return Object.values(PALETTES).filter(p => p.source === source)
}

/**
 * Get colorblind-safe palettes
 */
export function getColorblindSafePalettes(): ColorPalette[] {
  return Object.values(PALETTES).filter(p => p.colorblindSafe)
}

/**
 * Get palette colors, optionally interpolated to a specific count
 */
export function getPaletteColors(paletteId: string, count?: number): string[] {
  const palette = PALETTES[paletteId]
  if (!palette) {
    // Default to Serbian primary if not found
    return SERBIAN_PRIMARY.colors
  }

  if (!count || count === palette.colors.length) {
    return palette.colors
  }

  // For categorical palettes, cycle or truncate
  if (palette.type === 'categorical') {
    if (count <= palette.colors.length) {
      return palette.colors.slice(0, count)
    }
    // Cycle to fill the count
    const result: string[] = []
    for (let i = 0; i < count; i++) {
      result.push(palette.colors[i % palette.colors.length]!)
    }
    return result
  }

  // For sequential/diverging, interpolate
  return interpolateColors(palette.colors, count)
}

/**
 * Interpolate colors to a specific count
 */
function interpolateColors(colors: string[], count: number): string[] {
  if (count <= 1) {
    return [colors[Math.floor(colors.length / 2)]!]
  }

  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const position = i / (count - 1)
    const index = position * (colors.length - 1)
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.min(lowerIndex + 1, colors.length - 1)
    const fraction = index - lowerIndex

    result.push(interpolateColor(colors[lowerIndex]!, colors[upperIndex]!, fraction))
  }

  return result
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, fraction: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * fraction)
  const g = Math.round(g1 + (g2 - g1) * fraction)
  const b = Math.round(b1 + (b2 - b1) * fraction)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Get the default palette for a chart type
 */
export function getDefaultPaletteForChartType(chartType: string): string {
  switch (chartType) {
    case 'map':
    case 'line':
    case 'area':
      return 'serbian-primary'
    case 'pie':
    case 'bar':
    case 'column':
    case 'scatterplot':
      return 'category10'
    default:
      return 'serbian-primary'
  }
}

/**
 * Get palette options for a chart type
 */
export function getPaletteOptionsForChartType(chartType: string): ColorPalette[] {
  switch (chartType) {
    case 'map':
      return [...getPalettesByType('sequential'), ...getPalettesByType('diverging')]
    case 'pie':
    case 'bar':
    case 'column':
      return getPalettesByType('categorical')
    default:
      return getAllPalettes()
  }
}

// Default palette ID
export const DEFAULT_PALETTE_ID = 'serbian-primary'
