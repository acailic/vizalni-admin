/**
 * Shared constants for demo chart components
 */

/** Default chart dimensions */
export const CHART_DIMENSIONS = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 400,
  DEFAULT_MARGIN: { top: 20, right: 30, bottom: 60, left: 80 },
} as const;

/** Maximum rows to display in auto-visualizations */
export const CHART_DATA_LIMITS = {
  /** Max rows for general chart visualization */
  MAX_VISIBLE_ROWS: 20,
  /** Max rows for pie chart slices */
  MAX_PIE_SLICES: 10,
  /** Max rows for ChartVisualizer display */
  VISUALIZER_MAX_ROWS: 25,
} as const;

/** Professional color palette for charts */
export const CHART_COLORS = {
  PRIMARY: "#6366f1",
  PROFESSIONAL_PALETTE: [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
  ],
  GRID_STROKE: "#e5e7eb",
  AXIS_STROKE: "#d1d5db",
  TEXT_PRIMARY: "#1f2937",
  TEXT_SECONDARY: "#6b7280",
} as const;

/** Animation settings */
export const CHART_ANIMATION = {
  DEFAULT_DURATION: 1200,
  DOT_DELAY_MULTIPLIER: 30,
  DOT_TRANSITION_DURATION: 400,
} as const;

/** Accessibility settings */
export const CHART_ACCESSIBILITY = {
  TOOLTIP_Z_INDEX: 100,
  FOCUS_OUTLINE_COLOR: "#0ea5e9",
} as const;
