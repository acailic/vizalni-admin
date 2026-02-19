// @vitest-environment jsdom
// app/charts/shared/__tests__/legend-interactive.spec.tsx
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";

import {
  InteractiveLegendItem,
  LegendInteractionMode,
} from "../legend-interactive";

afterEach(() => {
  cleanup();
});

describe("InteractiveLegendItem", () => {
  it("should render label and color indicator", () => {
    render(
      <InteractiveLegendItem label="Series A" color="#3B82F6" symbol="line" />
    );
    expect(screen.getByText("Series A")).toBeInTheDocument();
  });

  it("should call onIsolate when clicked in isolate mode", () => {
    const onIsolate = vi.fn();
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        interactive
        mode={LegendInteractionMode.Isolate}
        onIsolate={onIsolate}
      />
    );
    fireEvent.click(screen.getByText("Series A"));
    expect(onIsolate).toHaveBeenCalledWith("Series A");
  });

  it("should be dimmed when inactive", () => {
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        isActive={false}
      />
    );
    const item = screen.getByTestId("legend-item");
    expect(item).toHaveStyle({ opacity: "0.2" });
  });

  it("should show hover effect", () => {
    render(
      <InteractiveLegendItem
        label="Series A"
        color="#3B82F6"
        symbol="line"
        interactive
      />
    );
    const item = screen.getByTestId("legend-item");
    fireEvent.mouseEnter(item);
    expect(item).toHaveClass("hovered");
  });
});
