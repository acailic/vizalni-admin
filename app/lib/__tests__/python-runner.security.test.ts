import { describe, it, expect, beforeEach } from 'vitest';
import { PythonRunner } from '../python-runner';

describe('PythonRunner Command Injection Prevention', () => {
  let runner: PythonRunner;

  beforeEach(() => {
    runner = new PythonRunner();
  });

  it('should escape shell metacharacters in query strings', () => {
    const maliciousQuery = 'test; rm -rf /';
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Should be wrapped in single quotes which neutralizes shell metacharacters
    expect(escaped).toMatch(/^'.*'$/);
    // The content should be preserved but safe within single quotes
    expect(escaped).toBe("'test; rm -rf /'");
  });

  it('should handle backticks in queries', () => {
    const maliciousQuery = 'test`whoami`';
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Should be wrapped in single quotes which neutralizes backticks
    expect(escaped).toMatch(/^'.*'$/);
    expect(escaped).toBe("'test`whoami`'");
  });

  it('should handle pipe characters', () => {
    const maliciousQuery = 'test | cat /etc/passwd';
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Should be wrapped in single quotes which neutralizes pipes
    expect(escaped).toMatch(/^'.*'$/);
    expect(escaped).toBe("'test | cat /etc/passwd'");
  });

  it('should handle newline injection', () => {
    const maliciousQuery = 'test\necho pwned';
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Should start and end with single quotes
    expect(escaped.startsWith("'")).toBe(true);
    expect(escaped.endsWith("'")).toBe(true);
    // Newlines are preserved but safe within single quotes
    expect(escaped).toContain("'test");
    expect(escaped).toContain("echo pwned'");
  });

  it('should handle single quotes by escaping them', () => {
    const maliciousQuery = "test'; rm -rf /; '";
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Single quotes should be escaped properly
    // The pattern should end any current quote, add escaped quote, start new quote
    expect(escaped).toContain("'\\''");
    // Verify the structure: starts with 'test, ends with '
    expect(escaped).toMatch(/^'test.*'$/);
  });

  it('should handle dollar sign variable expansion', () => {
    const maliciousQuery = 'test$(whoami)';
    const escaped = (runner as any).escapeShellArg(maliciousQuery);

    // Should be wrapped in single quotes which neutralizes $()
    expect(escaped).toMatch(/^'.*'$/);
    expect(escaped).toBe("'test$(whoami)'");
  });
});
