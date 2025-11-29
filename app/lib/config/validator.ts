import { VizualniAdminConfig } from "./types";

export interface ValidationIssue {
  path: string;
  message: string;
  keyword?: string;
}

// Helper functions
const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);
const isValidDomain = (domain: string): boolean => {
  if (!domain) return true; // Empty string is valid
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
};

const validateString = (value: unknown, path: string): ValidationIssue[] => {
  if (!isString(value)) {
    return [{ path, message: `${path} must be string` }];
  }
  return [];
};

const validateBoolean = (value: unknown, path: string): ValidationIssue[] => {
  if (!isBoolean(value)) {
    return [{ path, message: `${path} must be boolean` }];
  }
  return [];
};

const validateStringArray = (value: unknown, path: string): ValidationIssue[] => {
  if (!isArray(value)) {
    return [{ path, message: `${path} must be array` }];
  }

  return value.flatMap((item, index) => {
    if (!isString(item)) {
      return [{ path: `${path}/${index}`, message: `${path}/${index} must be string` }];
    }
    return [];
  });
};

const validateHexColorArray = (value: unknown, path: string): ValidationIssue[] => {
  if (!isArray(value)) {
    return [{ path, message: `${path} must be array` }];
  }

  return value.flatMap((item, index) => {
    if (!isString(item) || !isHexColor(item)) {
      return [{ path: `${path}/${index}`, message: `${path}/${index} must match color format` }];
    }
    return [];
  });
};

const validateEnum = (value: unknown, path: string, allowedValues: string[]): ValidationIssue[] => {
  if (!isString(value) || !allowedValues.includes(value)) {
    return [{ path, message: `${path} Invalid enum value` }];
  }
  return [];
};

export const validateConfig = (
  input: unknown
): { valid: true; data: VizualniAdminConfig } | { valid: false; errors: ValidationIssue[] } => {
  // Basic validation
  if (!isObject(input)) {
    return {
      valid: false,
      errors: [{ path: "(root)", message: "Config must be an object" }]
    };
  }

  const config = input as Record<string, unknown>;
  const errors: ValidationIssue[] = [];

  // Check for additional properties
  const allowedKeys = ['project', 'categories', 'datasets', 'visualization', 'features', 'deployment'];
  const additionalKeys = Object.keys(config).filter(key => !allowedKeys.includes(key));

  if (additionalKeys.length > 0) {
    errors.push({
      path: '',
      message: `must NOT have additional properties: ${additionalKeys.join(', ')}`
    });
  }

  // Validate project section
  if (!isObject(config.project)) {
    errors.push({ path: 'project', message: 'project must be object' });
  } else {
    const project = config.project;

    errors.push(...validateString(project.name, '/project/name'));
    errors.push(...validateEnum(project.language, '/project/language', ['en', 'sr']));
    errors.push(...validateEnum(project.theme, '/project/theme', ['light', 'dark']));
  }

  // Validate categories section
  if (!isObject(config.categories)) {
    errors.push({ path: 'categories', message: 'categories must be object' });
  } else {
    const categories = config.categories;

    errors.push(...validateStringArray(categories.enabled, '/categories/enabled'));
    errors.push(...validateStringArray(categories.featured, '/categories/featured'));
  }

  // Validate datasets section
  if (!isObject(config.datasets)) {
    errors.push({ path: 'datasets', message: 'datasets must be object' });
  } else {
    const datasets = config.datasets;

    errors.push(...validateBoolean(datasets.autoDiscovery, '/datasets/autoDiscovery'));

    if (!isObject(datasets.manualIds)) {
      errors.push({ path: 'datasets.manualIds', message: 'datasets.manualIds must be object' });
    }
  }

  // Validate visualization section
  if (!isObject(config.visualization)) {
    errors.push({ path: 'visualization', message: 'visualization must be object' });
  } else {
    const visualization = config.visualization;

    errors.push(...validateEnum(visualization.defaultChartType, '/visualization/defaultChartType',
      ['bar', 'line', 'pie', 'scatter', 'map']));
    errors.push(...validateString(visualization.colorPalette, '/visualization/colorPalette'));
    errors.push(...validateHexColorArray(visualization.customColors, '/visualization/customColors'));
  }

  // Validate features section
  if (!isObject(config.features)) {
    errors.push({ path: 'features', message: 'features must be object' });
  } else {
    const features = config.features;

    errors.push(...validateBoolean(features.embedding, '/features/embedding'));
    errors.push(...validateBoolean(features.export, '/features/export'));
    errors.push(...validateBoolean(features.sharing, '/features/sharing'));
    errors.push(...validateBoolean(features.tutorials, '/features/tutorials'));
  }

  // Validate deployment section
  if (!isObject(config.deployment)) {
    errors.push({ path: 'deployment', message: 'deployment must be object' });
  } else {
    const deployment = config.deployment;

    errors.push(...validateString(deployment.basePath, '/deployment/basePath'));
    errors.push(...validateString(deployment.customDomain, '/deployment/customDomain'));

    if (isString(deployment.customDomain) && !isValidDomain(deployment.customDomain)) {
      errors.push({ path: '/deployment/customDomain', message: '/deployment/customDomain must be valid domain' });
    }

    errors.push(...validateEnum(deployment.target, '/deployment/target', ['local', 'production', 'staging']));
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // If we got here, validation passed
  return { valid: true, data: config as VizualniAdminConfig };
};
