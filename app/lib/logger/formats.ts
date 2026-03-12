/**
 * Logger Formatters
 *
 * Provides structured formatting for log messages in different environments.
 */

import type { LogLevel } from "./config";

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Background colors
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
};

/**
 * Log level labels and their color mappings
 */
const logLevelConfig: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  0: { label: "DEBUG", color: colors.dim, icon: "🔍" },
  1: { label: "INFO", color: colors.blue, icon: "ℹ️" },
  2: { label: "WARN", color: colors.yellow, icon: "⚠️" },
  3: { label: "ERROR", color: colors.red, icon: "❌" },
};

/**
 * Format a log entry for development (console output with colors)
 */
export function formatDevLog(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): string[] {
  const config = logLevelConfig[level];
  const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
  const prefix = `${config.color}[${timestamp}] ${config.icon} ${config.label}${colors.reset}`;

  const parts = [prefix, message];

  if (context && Object.keys(context).length > 0) {
    parts.push(colors.dim + JSON.stringify(context, null, 2) + colors.reset);
  }

  return parts;
}

/**
 * Format a log entry for production (structured JSON)
 */
export function formatProdLog(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): string {
  const logEntry: Record<string, unknown> = {
    level: logLevelConfig[level].label,
    message,
    timestamp: new Date().toISOString(),
  };

  if (context && Object.keys(context).length > 0) {
    logEntry.context = context;
  }

  return JSON.stringify(logEntry);
}

/**
 * Get the appropriate console method for a log level
 */
export function getConsoleMethod(level: LogLevel): "log" | "warn" | "error" {
  if (level >= 3) return "error";
  if (level >= 2) return "warn";
  return "log";
}
