import type { ComponentType } from "react";

export type StoryDifficulty = "beginner" | "intermediate" | "advanced";
export type StoryTheme = "demographics" | "economy" | "climate" | "healthcare";

export interface StoryTitle {
  sr: string;
  en: string;
}

export interface StoryConfig {
  id: string;
  title: StoryTitle;
  description: StoryTitle;
  estimatedMinutes: number;
  difficulty: StoryDifficulty;
  theme: StoryTheme;
  steps: StoryStepConfig[];
}

export interface StoryStepConfig {
  id: string;
  title: StoryTitle;
  narrative: StoryTitle;
  chartComponent: ComponentType;
  chartProps: Record<string, unknown>;
  insights: string[];
  callout?: StoryTitle;
}

export interface StoryState {
  currentStep: number;
  completedSteps: Set<number>;
  userInteractions: Record<string, unknown>;
  bookmarked: boolean;
}

export interface StoryContext {
  storyId: string;
  config: StoryConfig;
  state: StoryState;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  setInteraction: (key: string, value: unknown) => void;
  toggleBookmark: () => void;
  resetProgress: () => void;
}
