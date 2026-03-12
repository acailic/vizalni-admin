// app/pages/demos/playground/_constants/themes.ts
import type { ThemePreset } from "../_types";

export const THEME_PRESETS: ThemePreset[] = [
  { id: "indigo", name: "Indigo", primary: "#6366f1", secondary: "#818cf8" },
  { id: "emerald", name: "Emerald", primary: "#10b981", secondary: "#34d399" },
  { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#fbbf24" },
  { id: "rose", name: "Rose", primary: "#f43f5e", secondary: "#fb7185" },
  { id: "cyan", name: "Cyan", primary: "#06b6d4", secondary: "#22d3ee" },
];

export const getThemeById = (id: string): ThemePreset | undefined =>
  THEME_PRESETS.find((t) => t.id === id);
