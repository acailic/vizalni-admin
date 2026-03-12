import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { StoryState, StoryConfig } from "@/types/stories";

import type { StoreApi, StateCreator } from "zustand";

interface StoryStore extends StoryState {
  // Actions
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  setInteraction: (key: string, value: unknown) => void;
  toggleBookmark: () => void;
  resetProgress: () => void;
}

type StoryStoreApi = StoreApi<StoryStore>;

interface StoreState {
  stories: Record<string, StoryStoreApi>;
  getStory: (storyId: string) => StoryStoreApi | undefined;
  createStory: (config: StoryConfig, storyId: string) => StoryStoreApi;
}

const createStoryStore = (
  config: StoryConfig,
  storyId: string
): StoryStoreApi => {
  const stateCreator: StateCreator<StoryStore> = (set) => ({
    currentStep: 0,
    completedSteps: new Set(),
    userInteractions: {},
    bookmarked: false,

    setCurrentStep: (step: number) =>
      set((_state) => ({
        currentStep: Math.max(0, Math.min(step, config.steps.length - 1)),
      })),

    markStepComplete: (step: number) =>
      set((state) => {
        const completed = new Set(state.completedSteps);
        completed.add(step);
        return { completedSteps: completed };
      }),

    setInteraction: (key: string, value: unknown) =>
      set((state) => ({
        userInteractions: { ...state.userInteractions, [key]: value },
      })),

    toggleBookmark: () => set((state) => ({ bookmarked: !state.bookmarked })),

    resetProgress: () =>
      set({
        currentStep: 0,
        completedSteps: new Set(),
        userInteractions: {},
        bookmarked: false,
      }),
  });

  return create<StoryStore>()(
    persist(stateCreator as any, {
      name: `vizualni-story-${storyId}`,
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: Array.from(state.completedSteps),
        userInteractions: state.userInteractions,
        bookmarked: state.bookmarked,
      }),
      merge: (
        persistedState: unknown,
        currentState: StoryState
      ): StoryState => {
        const persisted = persistedState as Partial<StoryState> & {
          completedSteps?: number[];
        };
        return {
          ...currentState,
          ...persisted,
          completedSteps: new Set(persisted.completedSteps || []),
        };
      },
    }) as any
  );
};

export const useStoryStore = create<StoreState>((set, get) => ({
  stories: {},

  getStory: (storyId) => get().stories[storyId],

  createStory: (config, storyId) => {
    const stories = get().stories;
    if (stories[storyId]) {
      return stories[storyId];
    }

    const newStore = createStoryStore(config, storyId);
    set((state) => ({
      stories: { ...state.stories, [storyId]: newStore },
    }));
    return newStore;
  },
}));
