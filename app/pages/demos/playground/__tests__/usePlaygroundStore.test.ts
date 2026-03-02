// app/pages/demos/playground/__tests__/usePlaygroundStore.test.ts
import { act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import { usePlaygroundStore } from "../_hooks/usePlaygroundStore";

describe("Playground Store", () => {
  beforeEach(() => {
    // Reset store state
    usePlaygroundStore.setState({
      chartType: "line",
      data: [],
      config: { xAxis: "", yAxis: "", color: "#6366f1" },
      themeId: "indigo",
      ui: { activeTab: "preview", showOnboarding: true, panelCollapsed: false },
    });
  });

  it("should have initial state", () => {
    const state = usePlaygroundStore.getState();
    expect(state.chartType).toBe("line");
    expect(state.themeId).toBe("indigo");
  });

  it("should set chart type", () => {
    act(() => {
      usePlaygroundStore.getState().setChartType("bar");
    });
    expect(usePlaygroundStore.getState().chartType).toBe("bar");
  });

  it("should set data", () => {
    const newData = [{ label: "A", value: 10 }];
    act(() => {
      usePlaygroundStore.getState().setData(newData);
    });
    expect(usePlaygroundStore.getState().data).toEqual(newData);
  });

  it("should set config", () => {
    act(() => {
      usePlaygroundStore
        .getState()
        .setConfig({ xAxis: "x", yAxis: "y", color: "#10b981" });
    });
    expect(usePlaygroundStore.getState().config.color).toBe("#10b981");
  });

  it("should toggle panel", () => {
    const initial = usePlaygroundStore.getState().ui.panelCollapsed;
    act(() => {
      usePlaygroundStore.getState().togglePanel();
    });
    expect(usePlaygroundStore.getState().ui.panelCollapsed).toBe(!initial);
  });
});
