// app/charts/shared/legend-interactive.tsx
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useCallback, memo } from "react";

export type LegendSymbol =
  | "square"
  | "line"
  | "dashed-line"
  | "circle"
  | "cross"
  | "triangle";

export enum LegendInteractionMode {
  Isolate = "isolate", // Click to show only this series
  Compare = "compare", // Shift-click to add to comparison
  Toggle = "toggle", // Click to toggle visibility
}

interface InteractiveLegendItemProps {
  label: string;
  color: string;
  symbol: LegendSymbol;
  dimension?: unknown;
  interactive?: boolean;
  mode?: LegendInteractionMode;
  isActive?: boolean;
  onIsolate?: (label: string) => void;
  onCompare?: (label: string) => void;
  onToggle?: (label: string) => void;
  smaller?: boolean;
}

const LegendIcon = ({
  symbol,
  size,
  fill,
}: {
  symbol: LegendSymbol;
  size: number;
  fill: string;
}) => {
  let node: React.ReactNode;

  switch (symbol) {
    case "circle":
      node = <circle cx={0.5} cy={0.5} r={0.5} fill={fill} />;
      break;
    case "square":
      node = <rect width={1} height={1} fill={fill} />;
      break;
    case "cross":
      node = (
        <g fill={fill} transform="translate(0 0.05) rotate(45 0.5 0.5)">
          <rect x={0.45} y={0} width={0.1} height={1} />
          <rect x={0} y={0.45} width={1} height={0.1} />
        </g>
      );
      break;
    case "line":
      node = (
        <line
          x1={0}
          x2={1}
          y1={0.5}
          y2={0.5}
          stroke={fill}
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
      );
      break;
    case "dashed-line":
      node = (
        <line
          x1={0}
          x2={1}
          y1={0.5}
          y2={0.5}
          stroke={fill}
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
          strokeDashoffset="3"
          strokeDasharray="2 2"
        />
      );
      break;
    case "triangle":
      node = (
        <polygon
          points="0.5,0.1339746 0.0669873,0.8660254 0.9330127,0.8660254"
          transform="translate(0 0.05)"
          fill={fill}
        />
      );
      break;
    default:
      const _exhaustiveCheck: never = symbol;
      return _exhaustiveCheck;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1 1"
      style={{ minWidth: size, minHeight: size }}
    >
      {node}
    </svg>
  );
};

export const InteractiveLegendItem = memo(function InteractiveLegendItem({
  label,
  color,
  symbol,
  interactive,
  mode = LegendInteractionMode.Toggle,
  isActive = true,
  onIsolate,
  onCompare,
  onToggle,
  smaller,
}: InteractiveLegendItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;

      if (e.shiftKey && onCompare) {
        onCompare(label);
      } else if (mode === LegendInteractionMode.Isolate && onIsolate) {
        onIsolate(label);
      } else if (mode === LegendInteractionMode.Toggle && onToggle) {
        onToggle(label);
      }
    },
    [interactive, mode, label, onIsolate, onCompare, onToggle]
  );

  const handleMouseEnter = useCallback(() => {
    if (interactive) setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Box
      data-testid="legend-item"
      className={isHovered ? "hovered" : ""}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: smaller ? 1 : 2,
        cursor: interactive ? "pointer" : "default",
        opacity: isActive ? 1 : 0.2,
        transition: "opacity 0.2s ease-out, transform 0.15s ease-out",
        transform: isHovered ? "translateX(2px)" : "translateX(0)",
        "&:hover": interactive
          ? {
              "& .legend-label": {
                color: "text.primary",
              },
            }
          : {},
      }}
    >
      <LegendIcon symbol={symbol} size={smaller ? 8 : 12} fill={color} />
      <Typography
        className="legend-label"
        variant={smaller ? "caption" : "body3"}
        sx={{
          wordBreak: "break-word",
          transition: "color 0.15s ease-out",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
});
