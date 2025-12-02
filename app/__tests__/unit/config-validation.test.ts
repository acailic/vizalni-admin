import { describe, it, expect } from 'vitest';

import { validateConfig } from '@/lib/config/validator';
import type { ValidationIssue } from '@/lib/config/validator';

// Type guard function
function isValidConfigResult<T>(result: { valid: true; data: T } | { valid: false; errors: ValidationIssue[] }): result is { valid: true; data: T } {
  return result.valid;
}

function isInvalidConfigResult<T>(result: { valid: true; data: T } | { valid: false; errors: ValidationIssue[] }): result is { valid: false; errors: ValidationIssue[] } {
  return !result.valid;
}

describe('config-validation', () => {
  describe('valid configurations', () => {
    it('should validate a complete valid config', () => {
      const validConfig = {
        project: {
          name: 'Test Project',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: ['category1'],
          featured: ['category1'],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette1',
          customColors: ['#ffffff', '#000000'],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: true,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(validConfig);
      if (isValidConfigResult(result)) { expect(result.valid).toBe(true); } else { expect(true).toBe(false); }
      if (isValidConfigResult(result)) {
        expect(result.data).toEqual(validConfig);
      }
    });

    it('should validate minimal valid config', () => {
      const minimalConfig = {
        project: {
          name: 'Minimal',
          language: 'en' as const,
          theme: 'dark' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'line' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: true,
          export: true,
          sharing: true,
          tutorials: false,
        },
        deployment: {
          basePath: '/app',
          customDomain: 'example.com',
          target: 'production' as const,
        },
      };

      const result = validateConfig(minimalConfig);
      if (isValidConfigResult(result)) {
        expect(result.valid).toBe(true);
        expect(result.data).toEqual(minimalConfig);
      }
    });
  });

  describe('invalid configurations', () => {
    it('should reject config with missing required fields', () => {
      const invalidConfig = {
        project: {
          name: 123, // should be string
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: ['category1'],
          featured: ['category1'],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette1',
          customColors: ['#ffffff', '#000000'],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: true,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/project/name',
            message: expect.stringContaining('must be string'),
          })
        );
      }
    });

    it('should reject config with invalid enum value', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'invalid' as any, // invalid enum
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/project/language',
            message: expect.stringContaining('Invalid enum value'),
          })
        );
      }
    });

    it('should reject config with invalid array items', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [123], // should be strings
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/categories/enabled/0',
            message: expect.stringContaining('must be string'),
          })
        );
      }
    });

    it('should reject config with invalid boolean field', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: 'true', // should be boolean
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/datasets/autoDiscovery',
            message: expect.stringContaining('must be boolean'),
          })
        );
      }
    });

    it('should reject config with invalid color format', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: ['invalid-color'], // should be hex color
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/visualization/customColors/0',
            message: expect.stringContaining('must match color format'),
          })
        );
      }
    });

    it('should reject config with invalid domain format', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: 'invalid..domain', // invalid domain format
          target: 'local' as const,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '/deployment/customDomain',
            message: expect.stringContaining('must be valid domain'),
          })
        );
      }
    });

    it('should reject config with additional properties', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: false,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'default',
          customColors: [],
        },
        features: {
          embedding: false,
          export: false,
          sharing: false,
          tutorials: false,
        },
        deployment: {
          basePath: '/',
          customDomain: '',
          target: 'local' as const,
        },
        unauthorizedProperty: 'should not be allowed',
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            path: '',
            message: expect.stringContaining('must NOT have additional properties'),
          })
        );
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty config', () => {
      const emptyConfig = {};

      const result = validateConfig(emptyConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should handle null config', () => {
      const nullConfig = null;

      const result = validateConfig(nullConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should handle undefined config', () => {
      const undefinedConfig = undefined;

      const result = validateConfig(undefinedConfig);
      expect(result.valid).toBe(false);
      if (isInvalidConfigResult(result)) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});