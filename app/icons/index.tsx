import { SxProps, Theme } from "@mui/material";
import { ComponentProps } from "react";

import { ChartType } from "@/config-types";
import { IconName, Icons } from "@/icons/components";

export { Icons } from "./components";
export type { IconName } from "./components";

export const Icon = ({
  size = 24,
  color,
  name,
  ...props
}: {
  size?: number | string;
  color?: string;
  name: IconName;
  sx?: SxProps<Theme>;
} & ComponentProps<"svg">) => {
  const { style, sx, ...otherProps } = props;
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn("No icon", name);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      style={{ minWidth: size, minHeight: size, ...style }}
      // Allow consumers to pass MUI sx; it's ignored by raw svg but keeps typings safe
      {...(sx ? { sx } : {})}
      {...otherProps}
    />
  );
};

export const getChartIcon = (chartType: ChartType): IconName => {
  switch (chartType) {
    case "area":
      return "areasChart";
    case "column":
      return "chartColumn";
    case "bar":
      return "chartBar";
    case "line":
      return "lineChart";
    case "map":
      return "mapChart";
    case "pie":
      return "pieChart";
    case "scatterplot":
      return "scatterplotChart";
    case "table":
      return "tableChart";
    case "comboLineSingle":
      return "multilineChart";
    case "comboLineDual":
      return "dualAxisChart";
    case "comboLineColumn":
      return "columnLineChart";
    default:
      const _exhaustiveCheck: never = chartType as never;
      return _exhaustiveCheck;
  }
};
