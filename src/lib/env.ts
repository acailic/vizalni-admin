/**
 * Environment Configuration Validator
 *
 * Validates that all required environment variables are set
 */

import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
  // Application
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Data.gov.rs API
  NEXT_PUBLIC_DATA_GOV_RS_API_URL: z.string().url().optional(),
  DATA_GOV_RS_API_KEY: z.string().optional(),
  DATA_GOV_RS_API_TIMEOUT: z.string().regex(/^\d+$/).optional(),
  ENABLE_API_CACHE: z.enum(['true', 'false']).optional(),
  API_CACHE_TTL: z.string().regex(/^\d+$/).optional(),

  // Internationalization
  NEXT_PUBLIC_DEFAULT_LANGUAGE: z.enum(['sr-cyr', 'sr-lat', 'en']).optional(),
  NEXT_PUBLIC_SUPPORTED_LANGUAGES: z.string().optional(),
  NEXT_PUBLIC_AUTO_DETECT_LANGUAGE: z.enum(['true', 'false']).optional(),

  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).optional(),

  // Maps
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  NEXT_PUBLIC_MAP_CENTER_LAT: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
  NEXT_PUBLIC_MAP_CENTER_LNG: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
  NEXT_PUBLIC_MAP_DEFAULT_ZOOM: z.string().regex(/^\d+$/).optional(),

  // Features
  NEXT_PUBLIC_ENABLE_DARK_MODE: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_ENABLE_DATA_EXPORT: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_ENABLE_SOCIAL_SHARING: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_ENABLE_PRINT: z.enum(['true', 'false']).optional(),

  // SEO
  NEXT_PUBLIC_SITE_TITLE: z.string().optional(),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().optional(),
  NEXT_PUBLIC_SITE_KEYWORDS: z.string().optional(),
  NEXT_PUBLIC_SITE_AUTHOR: z.string().optional(),

  // Debug
  NEXT_PUBLIC_DEBUG: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_SHOW_PERFORMANCE_METRICS: z.enum(['true', 'false']).optional(),
});

/**
 * Validates environment variables
 * @returns Validated environment variables or throws error
 */
export function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
      throw new Error('Invalid environment variables');
    }

    return parsed.data;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get environment variable with fallback
 */
export function getEnv<T>(key: string, fallback?: T): string | T | undefined {
  const value = process.env[key];
  return value !== undefined ? value : fallback;
}

/**
 * Get boolean environment variable
 */
export function getBooleanEnv(key: string, fallback = false): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value === 'true';
}

/**
 * Get number environment variable
 */
export function getNumberEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Check if required environment variables are set
 */
export function checkRequiredEnvVars(): { success: boolean; missing: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_DATA_GOV_RS_API_URL',
    // Add more required variables as needed
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  return {
    success: missing.length === 0,
    missing,
  };
}

/**
 * Log environment configuration (only in development)
 */
export function logEnvConfig(): void {
  if (isDevelopment()) {
    console.log('🔧 Environment Configuration:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - API URL:', process.env.NEXT_PUBLIC_DATA_GOV_RS_API_URL);
    console.log('  - Default Language:', process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE);
    console.log('  - Debug Mode:', process.env.NEXT_PUBLIC_DEBUG);
    console.log('  - Analytics:', process.env.NEXT_PUBLIC_ENABLE_ANALYTICS);
  }
}

// Export validated env for use in app
export const env = validateEnv();
