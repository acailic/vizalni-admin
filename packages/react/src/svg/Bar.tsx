import React from "react";

export interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  className?: string;
}

export function Bar({
  x,
  y,
  width,
  height,
  fill = "#4e79a7",
  className,
}: BarProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      className={className}
    />
  );
}
