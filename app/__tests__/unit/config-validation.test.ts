import { describe, it, expect } from 'vitest';
import { validateConfig } from '../lib/config/validator';

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
      expect(result.valid).toBe(true);
      expect(result.data).toEqual(validConfig);
    });

    it('should validate config with minimal required fields', () => {
      const minimalConfig = {
        project: {
          name: 'Test',
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
          colorPalette: 'palette',
          customColors: [],
        },
        features: {
          embedding: true,
          export: true,
          sharing: true,
          tutorials: false,
        },
        deployment: {
          basePath: '/test',
          customDomain: 'example.com',
          target: 'github-pages' as const,
        },
      };

      const result = validateConfig(minimalConfig);
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid configurations', () => {
    it('should reject config missing required top-level property', () => {
      const invalidConfig = {
        // missing project
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '(root)',
          message: expect.stringContaining('must have required property'),
        })
      );
    });

    it('should reject config with invalid type', () => {
      const invalidConfig = {
        project: {
          name: 123, // should be string
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/project/name',
          message: expect.stringContaining('must be string'),
        })
      );
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
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/project/language',
          message: expect.stringContaining('must be equal to one of the allowed values'),
        })
      );
    });

    it('should reject config with empty string where minLength required', () => {
      const invalidConfig = {
        project: {
          name: '', // empty string, minLength 1
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/project/name',
          message: expect.stringContaining('must NOT have fewer than 1 characters'),
        })
      );
    });

    it('should reject config with invalid hex color', () => {
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
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: ['invalid'], // invalid hex
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/visualization/customColors/0',
          message: expect.stringContaining('must match pattern'),
        })
      );
    });

    it('should reject config with extra properties', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
          extra: 'property', // extra property
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/project',
          message: expect.stringContaining('must NOT have additional properties'),
        })
      );
    });

    it('should reject config with invalid array type', () => {
      const invalidConfig = {
        project: {
          name: 'Test',
          language: 'sr' as const,
          theme: 'light' as const,
        },
        categories: {
          enabled: 'not an array', // should be array
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'bar' as const,
          colorPalette: 'palette',
          customColors: [],
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
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/categories/enabled',
          message: expect.stringContaining('must be array'),
        })
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = validateConfig(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle undefined input', () => {
      const result = validateConfig(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty object', () => {
      const result = validateConfig({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-object input', () => {
      const result = validateConfig('string');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('error messages', () => {
    it('should provide helpful error messages with paths', () => {
      const invalidConfig = {
        project: {
          name: '',
          language: 'invalid',
          theme: 'light',
        },
        categories: {
          enabled: [],
          featured: [],
        },
        datasets: {
          autoDiscovery: true,
          manualIds: {},
        },
        visualization: {
          defaultChartType: 'invalid' as any,
          colorPalette: '',
          customColors: ['#invalid'],
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
          target: 'invalid' as any,
        },
      };

      const result = validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      result.errors.forEach(error => {
        expect(error.path).toBeDefined();
        expect(error.message).toBeDefined();
        expect(typeof error.path).toBe('string');
        expect(typeof error.message).toBe('string');
        expect(error.message.length).toBeGreaterThan(0);
      });
    });
  });
});