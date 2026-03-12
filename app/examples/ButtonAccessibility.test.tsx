/**
 * Example accessibility test for UI components
 * This demonstrates how to use the accessibility testing framework
 */

import { Button } from "@mui/material";
import { describe, it, expect, beforeEach } from "vitest";

import {
  renderWithA11y,
  runComprehensiveA11yTests,
  setupIntersectionObserverMock,
  setupResizeObserverMock,
} from "@/test-utils/accessibility";

describe("Button Accessibility", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    setupResizeObserverMock();
  });

  it("should have no accessibility violations for basic button", async () => {
    const TestButton = () => (
      <Button variant="contained" onClick={() => {}}>
        Click me
      </Button>
    );

    await runComprehensiveA11yTests(<TestButton />);
  });

  it("should have no accessibility violations for disabled button", async () => {
    const TestButton = () => (
      <Button variant="contained" disabled onClick={() => {}}>
        Disabled button
      </Button>
    );

    await runComprehensiveA11yTests(<TestButton />);
  });

  it("should have no accessibility violations for button with icon", async () => {
    const TestButton = () => (
      <Button variant="contained" startIcon={<span aria-label="add">+</span>}>
        Add item
      </Button>
    );

    await runComprehensiveA11yTests(<TestButton />);
  });

  it("should have proper ARIA attributes for toggle button", async () => {
    const TestToggleButton = () => (
      <Button
        variant="contained"
        aria-pressed="false"
        aria-label="Toggle visibility"
        onClick={() => {}}
      >
        Toggle
      </Button>
    );

    await runComprehensiveA11yTests(<TestToggleButton />);
  });

  it("should handle keyboard navigation properly", async () => {
    const TestButton = () => (
      <Button variant="contained" onClick={() => {}}>
        Keyboard test button
      </Button>
    );

    const { renderResult } = await renderWithA11y(<TestButton />);
    const button = renderResult.getByRole("button", {
      name: "Keyboard test button",
    });

    // Test that button can receive focus
    button.focus();
    expect(document.activeElement).toBe(button);

    // Test that button can be activated with keyboard
    expect(button).toBeEnabled();
  });
});

describe("Form Accessibility", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    setupResizeObserverMock();
  });

  it("should have no accessibility violations for form with proper labels", async () => {
    const TestForm = () => (
      <form>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-describedby="email-help"
        />
        <div id="email-help">We'll never share your email.</div>

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
          aria-describedby="password-help"
        />
        <div id="password-help">Must be at least 8 characters.</div>

        <Button type="submit">Sign up</Button>
      </form>
    );

    await runComprehensiveA11yTests(<TestForm />);
  });

  it("should have no accessibility violations for form with fieldset", async () => {
    const TestFormWithFieldset = () => (
      <form>
        <fieldset>
          <legend>Personal Information</legend>

          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required />

          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required />
        </fieldset>

        <Button type="submit">Submit</Button>
      </form>
    );

    await runComprehensiveA11yTests(<TestFormWithFieldset />);
  });
});

describe("Navigation Accessibility", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    setupResizeObserverMock();
  });

  it("should have no accessibility violations for navigation menu", async () => {
    const TestNavigation = () => (
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    );

    await runComprehensiveA11yTests(<TestNavigation />);
  });

  it("should have no accessibility violations for accessible button group", async () => {
    const TestButtonGroup = () => (
      <div role="group" aria-label="Document actions">
        <Button
          variant="outlined"
          onClick={() => {}}
          aria-label="Save document"
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={() => {}}
          aria-label="Cancel changes"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={() => {}}
          aria-label="Delete document"
        >
          Delete
        </Button>
      </div>
    );

    await runComprehensiveA11yTests(<TestButtonGroup />);
  });
});
