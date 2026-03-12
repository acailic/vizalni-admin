/**
 * useChartConfig Hook
 *
 * React hook for managing chart configuration with validation.
 *
 * @example
 * ```tsx
 * import { useChartConfig } from '@acailic/vizualni-admin/hooks';
 *
 * function MyComponent() {
 *   const { config, updateConfig, errors, isValid } = useChartConfig({
 *     chartType: 'line'
 *   });
 *
 *   return (
 *     <div>
 *       {!isValid && <div>Errors: {errors.join(', ')}</div>}
 *       <button onClick={() => updateConfig({ title: 'New Title' })}>
 *         Update Title
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useEffect } from "react";

import {
  validateConfig,
  DEFAULT_CONFIG,
  type VizualniAdminConfig,
} from "../core";

export interface UseChartConfigOptions {
  /** Initial configuration */
  initialConfig?: Partial<VizualniAdminConfig>;
  /** Validate on mount */
  validateOnMount?: boolean;
  /** Auto-validate on updates */
  autoValidate?: boolean;
}

export interface UseChartConfigResult {
  /** Current configuration */
  config: VizualniAdminConfig;
  /** Validation errors */
  errors: string[];
  /** Whether configuration is valid */
  isValid: boolean;
  /** Update configuration with partial updates */
  updateConfig: (updates: Partial<VizualniAdminConfig>) => void;
  /** Reset to initial/default configuration */
  resetConfig: () => void;
  /** Manually validate configuration */
  validate: () => boolean;
  /** Set a specific field value */
  setField: <K extends keyof VizualniAdminConfig>(
    key: K,
    value: VizualniAdminConfig[K]
  ) => void;
}

export function useChartConfig(
  options: UseChartConfigOptions = {}
): UseChartConfigResult {
  const {
    initialConfig = {},
    validateOnMount = true,
    autoValidate = true,
  } = options;

  const [config, setConfig] = useState<VizualniAdminConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [initialConfigState] = useState(() => ({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  }));

  const validate = useCallback((): boolean => {
    const result = validateConfig(config);
    if (result.valid) {
      setErrors([]);
      return true;
    } else {
      setErrors(result.errors.map((e) => `${e.path}: ${e.message}`));
      return false;
    }
  }, [config]);

  const updateConfig = useCallback(
    (updates: Partial<VizualniAdminConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        if (autoValidate) {
          const result = validateConfig(newConfig);
          if (!result.valid) {
            setErrors(result.errors.map((e) => `${e.path}: ${e.message}`));
          } else {
            setErrors([]);
          }
        }
        return newConfig;
      });
    },
    [autoValidate]
  );

  const resetConfig = useCallback(() => {
    setConfig({ ...initialConfigState });
    setErrors([]);
  }, [initialConfigState]);

  const setField = useCallback(
    <K extends keyof VizualniAdminConfig>(
      key: K,
      value: VizualniAdminConfig[K]
    ) => {
      updateConfig({ [key]: value } as Partial<VizualniAdminConfig>);
    },
    [updateConfig]
  );

  // Validate on mount
  useEffect(() => {
    if (validateOnMount) {
      validate();
    }
  }, [validateOnMount, validate]);

  return {
    config,
    errors,
    isValid: errors.length === 0,
    updateConfig,
    resetConfig,
    validate,
    setField,
  };
}
