import "@testing-library/jest-dom/vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/types/matchers";
import type { Mock as VitestMock } from "vitest";

// Re-export Mock type for convenience
export type Mock = VitestMock;

// Vitest 3.x moved Assertion to @vitest/expect, but @testing-library/jest-dom
// augments the 'vitest' module. We need to also augment @vitest/expect directly.
declare module "@vitest/expect" {
  interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    any,
    any
  > {}
}
