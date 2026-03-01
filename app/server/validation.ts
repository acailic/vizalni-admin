/**
 * Input validation utilities for API routes
 */

// Maximum allowed key length
const MAX_KEY_LENGTH = 128;

// Valid key pattern: alphanumeric, hyphens, underscores
const VALID_KEY_PATTERN = /^[\w-]+$/;

// Dangerous patterns to reject
const DANGEROUS_PATTERNS = [
  /\.\./,           // Directory traversal
  /[;<>&|`$]/,      // Shell metacharacters
  /\0/,             // Null byte
  /(\r\n|\n|\r)/,   // CRLF injection
];

/**
 * Validate a configuration key
 * @throws Error if key is invalid
 */
export function validateConfigKey(key: unknown): string {
  // Type check
  if (typeof key !== 'string') {
    throw new Error('Config key must be a string');
  }

  // Length check
  if (key.length === 0) {
    throw new Error('Config key cannot be empty');
  }

  if (key.length > MAX_KEY_LENGTH) {
    throw new Error(`Config key exceeds maximum length of ${MAX_KEY_LENGTH}`);
  }

  // Pattern check
  if (!VALID_KEY_PATTERN.test(key)) {
    throw new Error('Config key contains invalid characters');
  }

  // Danger check
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(key)) {
      throw new Error('Config key contains forbidden pattern');
    }
  }

  return key;
}

/**
 * Validate and sanitize a numeric limit parameter
 */
export function validateLimit(limit: unknown, max = 1000, defaultVal = 100): number {
  if (limit === undefined || limit === null) {
    return defaultVal;
  }

  const num = Number(limit);

  if (isNaN(num) || !Number.isInteger(num)) {
    throw new Error('Limit must be an integer');
  }

  if (num < 1) {
    throw new Error('Limit must be positive');
  }

  if (num > max) {
    throw new Error(`Limit cannot exceed ${max}`);
  }

  return num;
}

/**
 * Sanitize a string for safe logging
 */
export function sanitizeForLogging(str: unknown): string {
  if (typeof str !== 'string') {
    return '[non-string]';
  }

  // Remove control characters and limit length
  return str
    .replace(/[\x00-\x1F\x7F]/g, '')
    .slice(0, 500);
}
