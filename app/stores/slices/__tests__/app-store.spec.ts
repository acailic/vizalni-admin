import { describe, it, expect } from "vitest";

import { useAppStore } from "@/stores/app-store";

describe("appStore", () => {
  it("exposes configurator slice actions", () => {
    const state = useAppStore.getState();
    expect(typeof state.selectDataset).toBe("function");
    expect(typeof state.setField).toBe("function");
    expect(typeof state.publish).toBe("function");
  });

  it("initial configurator phase is selecting-dataset", () => {
    expect(useAppStore.getState().phase).toBe("selecting-dataset");
  });
});
