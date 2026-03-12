import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { chartPanelLayoutGridClasses } from "@/components/chart-panel-layout-grid";

/** Number of grid rows spanned by a chart in a dashboard */
export const CHART_GRID_ROW_COUNT = 7;

/**
 * Attribute key to prevent color wiping during screenshot.
 * Elements with this attribute will retain their original colors.
 */
export const DISABLE_SCREENSHOT_COLOR_WIPE_KEY =
  "data-disable-screenshot-color";

/**
 * Attribute object to apply to elements that should retain colors in screenshots.
 * Use this with the spread operator: `{...DISABLE_SCREENSHOT_COLOR_WIPE_ATTR}`
 */
export const DISABLE_SCREENSHOT_COLOR_WIPE_ATTR = {
  [DISABLE_SCREENSHOT_COLOR_WIPE_KEY]: true,
};

/**
 * Generic styles shared between `ChartPreview` and `ChartPublished`.
 *
 * @param options - Style options
 * @param options.removeBorder - Whether to remove the border from the chart container
 * @returns Material-UI styles object
 */
type ChartStyleProps = { removeBorder?: boolean };

export const useChartStyles = makeStyles<Theme, ChartStyleProps>((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 0,
    padding: theme.spacing(8),
    backgroundColor: theme.palette.background.paper,
    border: ({ removeBorder }: ChartStyleProps) =>
      removeBorder ? "none" : `1px solid ${theme.palette.divider}`,

    [`.${chartPanelLayoutGridClasses.root} &`]: {
      display: "flex",
      flexDirection: "column",
    },

    // Make sure that all children have min-width: 0 and max-width: 100%
    // to prevent overflow issues.
    "& > *": {
      minWidth: 0,
      maxWidth: "100%",
    },
  },
  editing: {
    display: "flex",
    flexDirection: "column",
  },
  pastEditing: {
    display: "grid",
    gridTemplateRows: "subgrid",
    /** Should stay in sync with number of rows contained in a chart */
    gridRow: `span ${CHART_GRID_ROW_COUNT}`,
  },
}));
