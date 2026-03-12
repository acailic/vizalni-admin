/**
 * @vizualni/core - Color Utilities
 *
 * Default color palette and color utility functions.
 *
 * @module utils/colors
 */

/**
 * Default color palette (Tableau 10).
 * A colorblind-friendly palette suitable for most visualizations.
 *
 * @see https://www.tableau.com/about/blog/examining-data-viz-rules-dont-use-red-green-together
 *
 * @public
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
 * Get a color from the default palette by index.
 * Cycles through colors if index exceeds palette length.
 *
 * @param index - Color index (0-based)
 * @returns Color hex string
 *
 * @public
 *
 * @example
 * ```typescript
 * getDefaultColor(0); // '#4e79a7'
 * getDefaultColor(10); // '#4e79a7' (cycles back)
 * ```
 */
export function getDefaultColor(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/**
 * Get all default colors as a mutable array (for d3-scale compatibility).
 *
 * @returns Array of color hex strings
 *
 * @public
 *
 * @example
 * ```typescript
 * const colors = getDefaultColors();
 * // Use with d3 scale
 * scale.range(colors);
 * ```
 */
export function getDefaultColors(): string[] {
  return [...DEFAULT_COLORS];
}
