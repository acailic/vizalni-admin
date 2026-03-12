import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { ComboLineColumnState } from "@/charts/combo/combo-line-column-state";
import { ComboLineDualState } from "@/charts/combo/combo-line-dual-state";
import { ComboLineSingleState } from "@/charts/combo/combo-line-single-state";
import { LinesState } from "@/charts/line/lines-state";
import { useChartState } from "@/charts/shared/chart-state";
import {
  TooltipPlacement,
  TooltipValue,
} from "@/charts/shared/interaction/tooltip";
import { useInteraction } from "@/charts/shared/use-interaction";
import { Margins } from "@/charts/shared/use-size";
import { Observation } from "@/domain/data";
import { useIsMobile } from "@/utils/use-is-mobile";

/**
 * Filters tooltip values to get only visible snap points.
 * Used for snap-to-data functionality.
 */
export const getSnapPoints = (
  values: TooltipValue[] | undefined
): TooltipValue[] => {
  if (!values) return [];
  return values.filter(
    (v) => !v.hide && v.axis === "y" && v.axisOffset !== undefined
  );
};

type RulerProps = {
  rotate?: boolean;
  snapToData?: boolean;
};

export const Ruler = (props: RulerProps) => {
  const { rotate = false, snapToData = false } = props;
  const [{ type, visible, observation }] = useInteraction();

  return (
    <>
      {type === "tooltip" && visible && observation && (
        <RulerInner d={observation} rotate={rotate} snapToData={snapToData} />
      )}
    </>
  );
};

type RulerInnerProps = {
  d: Observation;
  rotate: boolean;
  snapToData: boolean;
};

const RulerInner = (props: RulerInnerProps) => {
  const { d, rotate, snapToData } = props;
  const { getTooltipInfo, bounds } = useChartState() as
    | LinesState
    | ComboLineSingleState
    | ComboLineDualState
    | ComboLineColumnState;
  const { xAnchor, value, datum, placement, values } = getTooltipInfo(d);

  return (
    <RulerContent
      rotate={rotate}
      xValue={value}
      values={values}
      chartHeight={bounds.chartHeight}
      margins={bounds.margins}
      xAnchor={xAnchor}
      datum={datum}
      placement={placement}
      snapToData={snapToData}
    />
  );
};

type RulerContentProps = {
  rotate: boolean;
  xValue: string;
  values: TooltipValue[] | undefined;
  chartHeight: number;
  margins: Margins;
  xAnchor: number;
  datum: TooltipValue;
  placement: TooltipPlacement;
  showXValue?: boolean;
  snapToData?: boolean;
};

const useStyles = makeStyles<Theme, { rotate: boolean }>((theme: Theme) => ({
  left: {
    width: 0,
    position: "absolute",
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: theme.palette.cobalt[50],
    pointerEvents: "none",
    transform: "translateX(-50%)",
  },
  right: {
    position: "absolute",
    fontWeight: "bold",
    backgroundColor: theme.palette.background.paper,
    transform: ({ rotate }) =>
      rotate
        ? "translateX(-50%) translateY(50%) rotate(90deg)"
        : "translateX(-50%)",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontSize: "0.875rem",
  },
  snapIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: "50%",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.palette.cobalt[500],
    backgroundColor: theme.palette.background.paper,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
  snapValues: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2],
    fontSize: "0.75rem",
    maxWidth: 200,
    pointerEvents: "none",
  },
  snapValueItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    marginBottom: 2,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  snapValueDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
}));

export const RulerContent = (props: RulerContentProps) => {
  const { rotate, xValue, chartHeight, margins, xAnchor, values, snapToData } =
    props;
  const classes = useStyles({ rotate });
  const isMobile = useIsMobile();

  const snapPoints = snapToData ? getSnapPoints(values) : [];

  return (
    <>
      <div
        className={classes.left}
        style={{
          height: chartHeight,
          left: xAnchor + margins.left,
          top: margins.top,
        }}
      />
      {!isMobile && (
        <div
          className={classes.right}
          style={{
            left: xAnchor + margins.left,
            top: chartHeight + margins.top + 6,
          }}
        >
          {xValue}
        </div>
      )}
      {snapPoints.map((value, i) => (
        <div
          key={i}
          className={classes.snapIndicator}
          style={{
            left: xAnchor + margins.left,
            top: value.axisOffset! + margins.top,
            borderColor: value.color,
          }}
          title={`${value.label}: ${value.value}`}
        />
      ))}
      {snapPoints.length > 0 && (
        <div
          className={classes.snapValues}
          style={{
            left: xAnchor + margins.left + 20,
            top: margins.top,
          }}
        >
          {snapPoints.map((value, i) => (
            <div key={i} className={classes.snapValueItem}>
              <div
                className={classes.snapValueDot}
                style={{ backgroundColor: value.color }}
              />
              <span>
                {value.label}: {value.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
