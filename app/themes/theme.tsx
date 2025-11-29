import { createTheme } from "@mui/material/styles";

import { components } from "@/themes/components";
import { breakpoints, shadows, spacing } from "@/themes/constants";
import { palette } from "@/themes/palette";
import { typography } from "@/themes/typography";
import { CRITICAL_FONTS, generatePreloadLinks, initializeOptimizedFonts } from "@/themes/optimized-fonts";

export const theme = createTheme({
  palette,
  breakpoints,
  spacing, // 4
  shape: {
    borderRadius: 4,
  },
  shadows,
  typography,
  components,
});

/**
 * Optimized font loading strategy
 * Critical fonts only - reduced from 6 to 2 fonts (67% reduction)
 * Other fonts load on demand
 */
export const preloadFonts = CRITICAL_FONTS.map(font => font.url);

// Initialize optimized font loading on client side
if (typeof window !== 'undefined') {
  initializeOptimizedFonts();
}
