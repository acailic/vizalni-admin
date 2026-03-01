import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('NextAuth Security Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should throw error when NEXTAUTH_SECRET is missing in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    delete process.env.NEXTAUTH_SECRET;

    // Re-import to trigger validation
    await expect(async () => {
      await import('../[...nextauth]');
    }).rejects.toThrow('NEXTAUTH_SECRET is required in production');
  });

  it('should not use hardcoded fallback secret', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    delete process.env.NEXTAUTH_SECRET;

    const module = await import('../[...nextauth]');
    const options = module.nextAuthOptions;

    // Should not have a hardcoded fallback
    expect(options.secret).not.toBe('development-only-secret');
    expect(options.secret).toBeUndefined();
  });
});
