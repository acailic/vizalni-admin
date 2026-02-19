// app/charts/column/rounded-corners-utils.ts
// Utility functions for column chart rounded corners
// Extracted for testability

import type { ChartThemeVariant } from "@/charts/shared/use-chart-theme";

/**
 * Determines whether rounded corners should be shown based on theme or explicit override
 * @param theme - The chart theme variant
 * @param explicitOverride - Optional explicit override for rounded corners
 * @returns boolean indicating if rounded corners should be shown
 */
export function shouldShowRoundedCorners(
  theme: ChartThemeVariant,
  explicitOverride?: boolean
): boolean {
  if (explicitOverride !== undefined) return explicitOverride;
  return theme === "modern" || theme === "dark";
}

/**
 * Calculates the appropriate border radius for a bar based on theme and size
 * @param theme - The chart theme variant
 * @param barHeight - The height of the bar (used to cap radius)
 * @returns The calculated border radius
 */
export function calculateBarRadius(
  theme: ChartThemeVariant,
  barHeight: number
): number {
  if (barHeight <= 0) return 0; // Guard against invalid input

  const baseRadius =
    theme === "modern" || theme === "dark" ? 4 : theme === "minimal" ? 2 : 0;

  // Cap radius at half the bar height to avoid visual artifacts
  return Math.min(baseRadius, barHeight / 2);
}
