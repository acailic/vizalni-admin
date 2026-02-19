// app/charts/shared/interaction/tooltip-rich.tsx
import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";

export enum TrendDirection {
  Up = "up",
  Down = "down",
  Neutral = "neutral",
}

interface TooltipRichProps {
  label: string;
  value: string;
  segment?: string;
  color?: string;
  symbol?: "line" | "square" | "circle";
  percentage?: string;
  trendDirection?: TrendDirection;
  trendValue?: string;
  children?: ReactNode;
}

const TrendArrow = ({ direction }: { direction: TrendDirection }) => {
  const color =
    direction === TrendDirection.Up
      ? "#10B981"
      : direction === TrendDirection.Down
        ? "#EF4444"
        : "#6B7280";

  const arrow =
    direction === TrendDirection.Up
      ? "↑"
      : direction === TrendDirection.Down
        ? "↓"
        : "→";

  return (
    <Typography
      component="span"
      sx={{ color, ml: 0.5, fontSize: "0.875rem" }}
      aria-label={`trending ${direction}`}
    >
      {arrow}
    </Typography>
  );
};

export const TooltipRich = ({
  label,
  value,
  segment,
  color,
  percentage,
  trendDirection,
  trendValue,
  children,
}: TooltipRichProps) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      {/* Label row */}
      <Typography
        component="div"
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      {/* Segment + Value row */}
      {segment && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
          {color && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
          )}
          <Typography component="span" variant="caption" color="text.secondary">
            {segment}:
          </Typography>
        </Box>
      )}

      {/* Value row with trend */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        <Typography
          component="span"
          variant="body2"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {value}
        </Typography>
        {percentage && (
          <Typography component="span" variant="caption" color="text.secondary">
            ({percentage})
          </Typography>
        )}
        {trendDirection !== undefined && trendValue && (
          <>
            <Typography
              component="span"
              variant="caption"
              sx={{
                color:
                  trendDirection === TrendDirection.Up
                    ? "#10B981"
                    : trendDirection === TrendDirection.Down
                      ? "#EF4444"
                      : "text.secondary",
              }}
            >
              {trendValue}
            </Typography>
            <TrendArrow direction={trendDirection} />
          </>
        )}
      </Box>

      {/* Additional content */}
      {children}
    </Box>
  );
};
