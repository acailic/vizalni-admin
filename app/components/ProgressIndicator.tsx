/**
 * Progress Indicator Component
 *
 * Shows loading progress for data operations with percentage and status.
 */

import React from 'react';

export interface ProgressIndicatorProps {
  /** Current progress (0-100) */
  progress: number;
  /** Status message */
  message?: string;
  /** Show percentage */
  showPercentage?: boolean;
  /** Show as indeterminate (spinning) */
  indeterminate?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Additional className */
  className?: string;
}

export function ProgressIndicator({
  progress,
  message,
  showPercentage = true,
  indeterminate = false,
  size = 'medium',
  color = 'primary',
  className = '',
}: ProgressIndicatorProps) {
  const sizeMap = {
    small: { height: 4, fontSize: 12 },
    medium: { height: 8, fontSize: 14 },
    large: { height: 12, fontSize: 16 },
  };

  const colorMap = {
    primary: '#1976d2',
    secondary: '#9c27b0',
    success: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f',
  };

  const { height, fontSize } = sizeMap[size];
  const barColor = colorMap[color];

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`progress-indicator ${className}`} style={{ width: '100%' }}>
      {message && (
        <div
          className="progress-message"
          style={{
            marginBottom: 8,
            fontSize,
            color: '#666',
          }}
        >
          {message}
        </div>
      )}

      <div
        className="progress-bar-container"
        style={{
          width: '100%',
          height,
          backgroundColor: '#e0e0e0',
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className={`progress-bar ${indeterminate ? 'indeterminate' : ''}`}
          style={{
            height: '100%',
            width: indeterminate ? '30%' : `${clampedProgress}%`,
            backgroundColor: barColor,
            transition: indeterminate ? 'none' : 'width 0.3s ease',
            animation: indeterminate ? 'progress-indeterminate 1.5s infinite' : 'none',
          }}
        />
      </div>

      {showPercentage && !indeterminate && (
        <div
          className="progress-percentage"
          style={{
            marginTop: 4,
            fontSize: fontSize - 2,
            color: '#666',
            textAlign: 'right',
          }}
        >
          {clampedProgress.toFixed(0)}%
        </div>
      )}

      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Circular Progress Indicator
 */
export interface CircularProgressProps {
  /** Progress value (0-100) */
  progress?: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color */
  color?: string;
  /** Show as indeterminate */
  indeterminate?: boolean;
}

export function CircularProgress({
  progress = 0,
  size = 40,
  strokeWidth = 4,
  color = '#1976d2',
  indeterminate = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{
        transform: 'rotate(-90deg)',
        animation: indeterminate ? 'spin 1s linear infinite' : 'none',
      }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.3s ease',
        }}
      />

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(-90deg);
          }
          to {
            transform: rotate(270deg);
          }
        }
      `}</style>
    </svg>
  );
}
