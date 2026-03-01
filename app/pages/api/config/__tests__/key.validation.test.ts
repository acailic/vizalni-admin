import { describe, it, expect } from 'vitest';
import { validateConfigKey } from '@/server/validation';

describe('Config API Input Validation', () => {
  it('should reject invalid config keys', () => {
    expect(() => validateConfigKey('../etc/passwd')).toThrow();
    expect(() => validateConfigKey('config; DROP TABLE')).toThrow();
    expect(() => validateConfigKey('')).toThrow();
  });

  it('should accept valid config keys', () => {
    expect(() => validateConfigKey('theme')).not.toThrow();
    expect(() => validateConfigKey('data-source-1')).not.toThrow();
    expect(() => validateConfigKey('my_config')).not.toThrow();
  });

  it('should reject excessively long keys', () => {
    const longKey = 'a'.repeat(256);
    expect(() => validateConfigKey(longKey)).toThrow();
  });
});
