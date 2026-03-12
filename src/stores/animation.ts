/**
 * Animation State Store
 *
 * Manages time-based chart animation with playback controls.
 * Supports stepping through temporal data with configurable speed.
 */

import { create } from 'zustand'

export interface AnimationState {
  // State
  isPlaying: boolean
  currentIndex: number
  totalFrames: number
  speed: number // multiplier: 0.5, 1, 2, 4
  frameDuration: number // ms at 1x speed
  timeValues: (Date | string)[]
  animationId: number | null

  // Computed
  currentTimeValue: () => Date | string | undefined
  progress: () => number // 0-1

  // Actions
  setTimeValues: (values: (Date | string)[]) => void
  play: () => void
  pause: () => void
  toggle: () => void
  stepForward: () => void
  stepBackward: () => void
  seekTo: (index: number) => void
  seekToProgress: (progress: number) => void
  setSpeed: (speed: number) => void
  setFrameDuration: (duration: number) => void
  reset: () => void
  setAnimationId: (id: number | null) => void
}

const SPEED_OPTIONS = [0.5, 1, 2, 4]
const DEFAULT_FRAME_DURATION = 1500 // ms

export const useAnimationStore = create<AnimationState>((set, get) => ({
  // Initial state
  isPlaying: false,
  currentIndex: 0,
  totalFrames: 0,
  speed: 1,
  frameDuration: DEFAULT_FRAME_DURATION,
  timeValues: [],
  animationId: null,

  // Computed
  currentTimeValue: () => {
    const { timeValues, currentIndex } = get()
    return timeValues[currentIndex]
  },

  progress: () => {
    const { currentIndex, totalFrames } = get()
    if (totalFrames <= 1) return 0
    return currentIndex / (totalFrames - 1)
  },

  // Actions
  setTimeValues: (values) => {
    set({
      timeValues: values,
      totalFrames: values.length,
      currentIndex: 0,
      isPlaying: false,
    })
  },

  play: () => {
    const { totalFrames } = get()
    if (totalFrames <= 1) return
    set({ isPlaying: true })
  },

  pause: () => {
    set({ isPlaying: false })
  },

  toggle: () => {
    const { isPlaying } = get()
    if (isPlaying) {
      set({ isPlaying: false })
    } else {
      get().play()
    }
  },

  stepForward: () => {
    const { currentIndex, totalFrames, isPlaying } = get()
    if (isPlaying) set({ isPlaying: false })
    if (currentIndex < totalFrames - 1) {
      set({ currentIndex: currentIndex + 1 })
    } else {
      // Loop back to start
      set({ currentIndex: 0 })
    }
  },

  stepBackward: () => {
    const { currentIndex, isPlaying } = get()
    if (isPlaying) set({ isPlaying: false })
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 })
    } else {
      // Loop to end
      const { totalFrames } = get()
      set({ currentIndex: totalFrames - 1 })
    }
  },

  seekTo: (index) => {
    const { totalFrames, isPlaying } = get()
    if (isPlaying) set({ isPlaying: false })
    const clampedIndex = Math.max(0, Math.min(index, totalFrames - 1))
    set({ currentIndex: clampedIndex })
  },

  seekToProgress: (progress) => {
    const { totalFrames } = get()
    const index = Math.round(progress * (totalFrames - 1))
    get().seekTo(index)
  },

  setSpeed: (speed) => {
    if (SPEED_OPTIONS.includes(speed)) {
      set({ speed })
    }
  },

  setFrameDuration: (duration) => {
    set({ frameDuration: duration })
  },

  reset: () => {
    set({
      isPlaying: false,
      currentIndex: 0,
      animationId: null,
    })
  },

  setAnimationId: (id) => {
    set({ animationId: id })
  },
}))

// Hook for getting effective frame duration based on speed
export function useEffectiveFrameDuration(): number {
  const { frameDuration, speed } = useAnimationStore()
  return frameDuration / speed
}

// Hook for checking if animation is available
export function useIsAnimationAvailable(): boolean {
  const { totalFrames } = useAnimationStore()
  return totalFrames > 1
}

// Speed options for UI
export const SPEED_LABELS: Record<number, string> = {
  0.5: '0.5×',
  1: '1×',
  2: '2×',
  4: '4×',
}

export const ANIMATION_SPEEDS = SPEED_OPTIONS
