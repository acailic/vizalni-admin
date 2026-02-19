// app/charts/shared/__tests__/guidance-hint.spec.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { GuidanceHint, useGuidance } from "../interaction/guidance-hint";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("GuidanceHint", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it("should render hint on first visit", async () => {
    render(<GuidanceHint message="Hover for details" />);
    await waitFor(() => {
      expect(screen.getByText("Hover for details")).toBeInTheDocument();
    });
  });

  it("should not render hint after dismissal", async () => {
    localStorageMock.getItem.mockReturnValue("true");
    render(<GuidanceHint message="Hover for details" />);
    expect(screen.queryByText("Hover for details")).not.toBeInTheDocument();
  });
});

describe("useGuidance", () => {
  it("should return true for first visit", () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useGuidance("test-chart"));
    expect(result.current.shouldShow).toBe(true);
  });
});
