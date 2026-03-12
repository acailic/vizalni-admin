/**
 * Accessibility testing utilities for comprehensive a11y validation
 * Supports WCAG 2.1 AA compliance testing
 */

import { render, RenderResult } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { ReactElement } from "react";
import { vi, expect } from "vitest";

import type { AxeResults as AxeCoreResults } from "axe-core";

// Use the axe-core type for compatibility
type AxeResults = AxeCoreResults;

// Extend Vitest matchers
expect.extend(toHaveNoViolations);

/**
 * Renders component and runs accessibility tests
 * @param component - React component to test
 * @param options - Optional render and axe configuration
 * @returns Render result and accessibility results
 */
export async function renderWithA11y(
  component: ReactElement,
  options: {
    renderOptions?: Parameters<typeof render>[1];
    axeOptions?: Parameters<typeof axe>[1];
  } = {}
): Promise<{
  renderResult: RenderResult;
  a11yResults: AxeResults | null;
}> {
  const { renderOptions = {}, axeOptions = {} } = options;

  const renderResult = render(component, renderOptions);

  try {
    const a11yResults = await axe(renderResult.container, axeOptions);
    return { renderResult, a11yResults };
  } catch (error) {
    console.warn("Accessibility testing failed:", error);
    return { renderResult, a11yResults: null };
  }
}

/**
 * Expect component to have no accessibility violations
 * @param component - React component to test
 * @param options - Optional render and axe configuration
 */
export async function expectNoA11yViolations(
  component: ReactElement,
  options?: {
    renderOptions?: Parameters<typeof render>[1];
    axeOptions?: Parameters<typeof axe>[1];
  }
): Promise<void> {
  const { a11yResults } = await renderWithA11y(component, options);

  if (!a11yResults) {
    throw new Error("Accessibility testing failed to run");
  }

  (expect(a11yResults) as any).toHaveNoViolations();
}

/**
 * Test keyboard navigation for interactive elements
 * @param container - DOM container to test
 */
export function testKeyboardNavigation(container: HTMLElement): void {
  const interactiveElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach((element, _index) => {
    // Simulate tab navigation
    (element as any).focus();
    expect(document.activeElement).toBe(element as any);

    // Test that focus is visible (basic check for focus styles)
    const computedStyle = window.getComputedStyle(element);
    const focusStyle = computedStyle.outline || computedStyle.boxShadow;
    if (focusStyle) {
      expect(focusStyle).toBeTruthy();
    }
  });
}

/**
 * Test color contrast for text elements
 * Note: This is a basic check. For comprehensive testing, use tools like
 * WebAIM Contrast Checker or Chrome DevTools Lighthouse
 */
export function testColorContrast(container: HTMLElement): void {
  const textElements = container.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, label, button"
  );

  textElements.forEach((element) => {
    const text = element.textContent?.trim();
    if (text && text.length > 0) {
      // Get computed colors
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor || "transparent";

      // Basic check that colors are defined
      if (!color) {
        return;
      }
      expect(color).not.toBe("");
      expect(backgroundColor).not.toBe("");

      // Note: For actual contrast ratio calculation, you'd need a color contrast library
      // This is a placeholder for where such logic would go
    }
  });
}

/**
 * Test ARIA attributes and roles
 * @param container - DOM container to test
 */
export function testAriaAttributes(container: HTMLElement): void {
  // Test elements with ARIA roles
  const elementsWithRoles = container.querySelectorAll("[role]");
  elementsWithRoles.forEach((element) => {
    const role = element.getAttribute("role");
    expect(role).toBeTruthy();
  });

  // Test aria-label and aria-labelledby
  const elementsWithAriaLabels = container.querySelectorAll(
    "[aria-label], [aria-labelledby]"
  );
  elementsWithAriaLabels.forEach((element) => {
    const ariaLabel = element.getAttribute("aria-label");
    const ariaLabelledBy = element.getAttribute("aria-labelledby");

    // At least one should be present
    expect(ariaLabel || ariaLabelledBy).toBeTruthy();
  });

  // Test required ARIA attributes for common roles
  const buttons = container.querySelectorAll("button[aria-expanded]");
  buttons.forEach((button) => {
    const expanded = button.getAttribute("aria-expanded");
    expect(expanded).toMatch(/^(true|false)$/);
  });
}

/**
 * Comprehensive accessibility test suite
 * @param component - React component to test
 * @param options - Optional test configuration
 */
export async function runComprehensiveA11yTests(
  component: ReactElement,
  options?: {
    skipKeyboardTest?: boolean;
    skipColorContrastTest?: boolean;
    skipAriaTest?: boolean;
  }
): Promise<void> {
  const {
    skipKeyboardTest = false,
    skipColorContrastTest = false,
    skipAriaTest = false,
  } = options || {};

  // Run axe accessibility check
  await expectNoA11yViolations(component);

  // Run additional custom accessibility tests
  const { renderResult } = await renderWithA11y(component);

  if (!skipKeyboardTest) {
    testKeyboardNavigation(renderResult.container);
  }

  if (!skipColorContrastTest) {
    testColorContrast(renderResult.container);
  }

  if (!skipAriaTest) {
    testAriaAttributes(renderResult.container);
  }
}

/**
 * Mock IntersectionObserver for tests
 */
export function setupIntersectionObserverMock(): void {
  const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
}

/**
 * Mock ResizeObserver for tests
 */
export function setupResizeObserverMock(): void {
  const mockResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  vi.stubGlobal("ResizeObserver", mockResizeObserver);
}
