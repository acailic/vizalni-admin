// app/pages/demos/playground/_hooks/usePlaygroundStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  PlaygroundState,
  PlaygroundConfig,
  ChartType,
  Datum,
} from "../_types";

interface PlaygroundActions {
  setChartType: (type: ChartType) => void;
  setData: (data: Datum[]) => void;
  setConfig: (config: PlaygroundConfig) => void;
  updateConfig: (partial: Partial<PlaygroundConfig>) => void;
  setThemeId: (id: string) => void;
  setActiveTab: (tab: "preview" | "code") => void;
  togglePanel: () => void;
  dismissOnboarding: () => void;
  reset: () => void;
}

const initialState: PlaygroundState = {
  chartType: "line",
  data: [],
  config: { xAxis: "", yAxis: "", color: "#6366f1" },
  themeId: "indigo",
  ui: {
    activeTab: "preview",
    showOnboarding: true,
    panelCollapsed: false,
  },
};

export const usePlaygroundStore = create<PlaygroundState & PlaygroundActions>()(
  persist(
    (set) => ({
      ...initialState,

      setChartType: (chartType) => set({ chartType }),
      setData: (data) => set({ data }),
      setConfig: (config) => set({ config }),
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      setThemeId: (themeId) => set({ themeId }),
      setActiveTab: (activeTab) =>
        set((state) => ({ ui: { ...state.ui, activeTab } })),
      togglePanel: () =>
        set((state) => ({
          ui: { ...state.ui, panelCollapsed: !state.ui.panelCollapsed },
        })),
      dismissOnboarding: () =>
        set((state) => ({
          ui: { ...state.ui, showOnboarding: false },
        })),
      reset: () => set(initialState),
    }),
    {
      name: "playground-state",
      partialize: (state) => ({
        chartType: state.chartType,
        data: state.data,
        config: state.config,
        themeId: state.themeId,
        ui: { ...state.ui, showOnboarding: state.ui.showOnboarding },
      }),
    }
  )
);
