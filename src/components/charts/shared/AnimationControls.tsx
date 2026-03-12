'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useAnimationStore, ANIMATION_SPEEDS, SPEED_LABELS, useIsAnimationAvailable } from '@/stores/animation'

interface AnimationControlsProps {
  locale?: string
  labels?: {
    play?: string
    pause?: string
    previous?: string
    next?: string
    speed?: string
  }
}

/**
 * Animation playback controls for temporal charts.
 * Provides play/pause, step, seek, and speed controls.
 */
export function AnimationControls({ locale = 'sr-Cyrl', labels }: AnimationControlsProps) {
  const {
    isPlaying,
    currentIndex,
    totalFrames,
    speed,
    timeValues,
    toggle,
    stepForward,
    stepBackward,
    seekToProgress,
    setSpeed,
    progress,
    setAnimationId,
    animationId,
  } = useAnimationStore()

  const isAvailable = useIsAnimationAvailable()
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Default labels
  const t = {
    play: labels?.play || (locale === 'sr-Cyrl' ? 'Пусти' : locale === 'sr-Latn' ? 'Pusti' : 'Play'),
    pause: labels?.pause || (locale === 'sr-Cyrl' ? 'Пауза' : locale === 'sr-Latn' ? 'Pauza' : 'Pause'),
    previous: labels?.previous || (locale === 'sr-Cyrl' ? 'Претходно' : locale === 'sr-Latn' ? 'Prethodno' : 'Previous'),
    next: labels?.next || (locale === 'sr-Cyrl' ? 'Следеће' : locale === 'sr-Latn' ? 'Sledeće' : 'Next'),
    speed: labels?.speed || (locale === 'sr-Cyrl' ? 'Брзина' : locale === 'sr-Latn' ? 'Brzina' : 'Speed'),
  }

  // Format current time value for display
  const formatTimeValue = useCallback((value: Date | string | undefined): string => {
    if (!value) return ''
    if (value instanceof Date) {
      return value.toLocaleDateString(locale, { year: 'numeric', month: 'short' })
    }
    return String(value)
  }, [locale])

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      return
    }

    const frameDuration = 1500 / speed // ms
    lastTimeRef.current = performance.now()

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastTimeRef.current

      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp - (elapsed % frameDuration)

        // Advance frame
        const { currentIndex, totalFrames } = useAnimationStore.getState()
        const nextIndex = currentIndex < totalFrames - 1 ? currentIndex + 1 : 0
        useAnimationStore.setState({ currentIndex: nextIndex })

        // If we've looped back to start, pause
        if (nextIndex === 0) {
          useAnimationStore.setState({ isPlaying: false })
          return
        }
      }

      frameRef.current = requestAnimationFrame(animate)
      setAnimationId(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(animate)
    setAnimationId(frameRef.current)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [isPlaying, speed, setAnimationId])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          toggle()
          break
        case 'ArrowLeft':
          e.preventDefault()
          stepBackward()
          break
        case 'ArrowRight':
          e.preventDefault()
          stepForward()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle, stepForward, stepBackward])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [animationId])

  if (!isAvailable) return null

  const currentProgress = progress()

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
      role="toolbar"
      aria-label="Animation controls"
    >
      {/* Previous button */}
      <button
        onClick={stepBackward}
        disabled={totalFrames <= 1}
        className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        title={t.previous}
        aria-label={t.previous}
      >
        <SkipBack className="h-4 w-4" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={toggle}
        disabled={totalFrames <= 1}
        className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        title={isPlaying ? t.pause : t.play}
        aria-label={isPlaying ? t.pause : t.play}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>

      {/* Next button */}
      <button
        onClick={stepForward}
        disabled={totalFrames <= 1}
        className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        title={t.next}
        aria-label={t.next}
      >
        <SkipForward className="h-4 w-4" />
      </button>

      {/* Progress slider */}
      <div className="relative mx-2 flex flex-1 items-center">
        <input
          type="range"
          min={0}
          max={1}
          step={1 / (totalFrames - 1 || 1)}
          value={currentProgress}
          onChange={(e) => seekToProgress(parseFloat(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
          aria-label="Animation progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(currentProgress * 100)}
        />
      </div>

      {/* Current time label */}
      <span className="min-w-[60px] text-center text-sm font-medium text-slate-700">
        {formatTimeValue(timeValues[currentIndex])}
      </span>

      {/* Speed selector */}
      <div className="relative">
        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="appearance-none rounded border border-slate-200 bg-white px-2 py-1 pr-6 text-sm text-slate-600 hover:border-slate-300 focus:border-blue-500 focus:outline-none"
          aria-label={t.speed}
        >
          {ANIMATION_SPEEDS.map((s) => (
            <option key={s} value={s}>
              {SPEED_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
