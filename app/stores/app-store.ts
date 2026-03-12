import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  ConfiguratorSlice,
  createConfiguratorSlice,
} from "@/stores/slices/configurator";

export type AppStore = ConfiguratorSlice;

export const useAppStore = create<AppStore>()(
  immer((...args) => ({
    ...createConfiguratorSlice(...args),
  }))
);

// Selectors — co-located with the store, not scattered
export const selectPhase = (s: AppStore) => s.phase;
export const selectActiveChart = (s: AppStore) =>
  s.chartConfigs.find((c) => c.key === s.activeChartKey) ?? null;
export const selectChartConfigs = (s: AppStore) => s.chartConfigs;
