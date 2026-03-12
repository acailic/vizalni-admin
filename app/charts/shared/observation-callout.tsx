// app/charts/shared/observation-callout.tsx
import React, { useMemo } from "react";

export interface ObservationCalloutProps {
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  label: string;
  value: string;
  color: string;
  segment?: string;
  width?: number;
}

export const ObservationCallout: React.FC<ObservationCalloutProps> = ({
  x,
  y,
  targetX,
  targetY,
  label,
  value,
  color,
  segment,
  width = 120,
}) => {
  const showLeaderLine = targetX !== undefined && targetY !== undefined;

  const calloutPosition = useMemo(() => {
    if (!showLeaderLine) return { x, y };

    const dx = x - targetX!;
    const dy = y - targetY!;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50) {
      return {
        x: targetX! + (dx > 0 ? 60 : -60),
        y: targetY! + (dy > 0 ? 30 : -30),
      };
    }
    return { x, y };
  }, [x, y, targetX, targetY, showLeaderLine]);

  return (
    <g>
      {showLeaderLine && (
        <line
          x1={targetX}
          y1={targetY}
          x2={calloutPosition.x}
          y2={calloutPosition.y}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="3,3"
          opacity={0.7}
        />
      )}

      <rect
        x={calloutPosition.x - width / 2}
        y={calloutPosition.y - 20}
        width={width}
        height={segment ? 50 : 40}
        fill="white"
        stroke={color}
        strokeWidth={1}
        rx={4}
      />

      <text
        x={calloutPosition.x}
        y={calloutPosition.y - 5}
        textAnchor="middle"
        fontSize={10}
        fill="#6B7280"
      >
        {label}
      </text>

      <text
        x={calloutPosition.x}
        y={calloutPosition.y + 10}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill={color}
      >
        {value}
      </text>

      {segment && (
        <text
          x={calloutPosition.x}
          y={calloutPosition.y + 22}
          textAnchor="middle"
          fontSize={9}
          fill="#9CA3AF"
        >
          {segment}
        </text>
      )}
    </g>
  );
};
