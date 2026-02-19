/**
 * Default color palette (Tableau 10)
 * https://www.tableau.com/about/blog/examining-data-viz-rules-dont-use-red-green-together
 */
export const DEFAULT_COLORS = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
] as const;

/**
 * Get a color from the default palette by index
 */
export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/**
 * Get all default colors as a mutable array (for d3-scale compatibility)
 */
export function getDefaultColors(): string[] {
  return [...DEFAULT_COLORS];
}
