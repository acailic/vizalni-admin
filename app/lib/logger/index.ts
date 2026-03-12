/**
 * Structured Logger
 *
 * A replacement for console.* that provides:
 * - Log level control via LOG_LEVEL environment variable
 * - Structured output in production
 * - Colored, readable output in development
 * - Context-aware logging
 *
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.info("Application started");
 * logger.warn("Deprecated API used", { endpoint: "/api/v1" });
 * logger.error("Database connection failed", { error: err.message, code: "DB_001" });
 * logger.debug("Processing request", { requestId: "abc-123" });
 * ```
 */

import { isDevelopment, shouldLog, LogLevel } from "./config";
import { formatDevLog, formatProdLog, getConsoleMethod } from "./formats";

/**
 * Logger class that provides structured logging
 */
export class Logger {
  private context: Record<string, unknown>;

  constructor(context: Record<string, unknown> = {}) {
    this.context = context;
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Record<string, unknown>): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }

  /**
   * Log at DEBUG level
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log at INFO level
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log at WARN level
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log at ERROR level
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Internal log method that handles level checking and formatting
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (!shouldLog(level)) {
      return; // Skip logging if below threshold
    }

    const mergedContext = context
      ? { ...this.context, ...context }
      : this.context;

    if (isDevelopment()) {
      // Development: colored console output
      const parts = formatDevLog(level, message, mergedContext);
      const method = getConsoleMethod(level);
      console[method](...parts);
    } else {
      // Production: structured JSON output
      const formatted = formatProdLog(level, message, mergedContext);
      console.log(formatted);
    }
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a named logger with context
 *
 * @example
 * ```ts
 * const dbLogger = createLogger({ component: "database" });
 * dbLogger.error("Connection failed", { host: "localhost" });
 * // Output: {"level":"ERROR","message":"Connection failed","timestamp":"...","context":{"component":"database","host":"localhost"}}
 * ```
 */
export function createLogger(
  context: Record<string, unknown>
): Logger {
  return new Logger(context);
}

// Re-export types and utilities for convenience
export { LogLevel, parseLogLevel, getLogLevel } from "./config";
export type { LogLevel as LogLevelType } from "./config";
