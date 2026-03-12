/**
 * Logger Configuration
 *
 * Manages log levels and environment-based logging behavior.
 */

/**
 * Log level enum - ordered by severity (lower values = more severe)
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Parse a log level string to the enum value
 */
export function parseLogLevel(level: string): LogLevel {
  switch (level.toLowerCase()) {
    case "debug":
      return LogLevel.DEBUG;
    case "info":
      return LogLevel.INFO;
    case "warn":
    case "warning":
      return LogLevel.WARN;
    case "error":
      return LogLevel.ERROR;
    default:
      return LogLevel.INFO; // Default to INFO in production
  }
}

/**
 * Get the current log level from environment variable
 */
export function getLogLevel(): LogLevel {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    // Browser environment - default to INFO
    return LogLevel.INFO;
  }

  const envLevel = process.env.LOG_LEVEL || process.env.NEXT_PUBLIC_LOG_LEVEL;
  if (!envLevel) {
    // Check if we're in development
    return process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;
  }

  return parseLogLevel(envLevel);
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return false; // Assume production in browser
  }
  return process.env.NODE_ENV === "development";
}

/**
 * Check if a given log level should be logged based on current configuration
 */
export function shouldLog(level: LogLevel): boolean {
  const currentLevel = getLogLevel();
  return level >= currentLevel;
}
