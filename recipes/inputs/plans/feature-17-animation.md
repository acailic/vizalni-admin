# Feature Request

## Title
Time-based chart animation with playback controls

## Problem
Temporal datasets (year-by-year population, monthly economic indicators) are best understood as animations showing change over time. The Swiss tool supports animated scatterplots and time-stepped charts. We need this for Serbian temporal data — especially for showing trends across years (census data, economic indicators, regional development).

## Proposed behavior

### Animation model
For charts with a temporal dimension on X or as a slider:
- Instead of showing all time periods simultaneously, step through them one at a time
- Each "frame" shows data for one time period
- Transition between frames with smooth interpolation

### Playback controls
A control bar below the chart:
```
[◀ Prev] [▶ Play / ⏸ Pause] [▶ Next]  ════════●══════  2015  [Speed: 1x ▾]
```

Components:
- Play/pause toggle button
- Previous/next step buttons
- Slider showing current position in time series
- Current time value label (formatted per locale: "2015", "jan 2020", "Q3 2019")
- Speed selector: 0.5x, 1x, 2x, 4x
- Frame duration: default 1500ms at 1x speed

### Animation types per chart

**Animated scatterplot** (like Gapminder):
- X and Y axes show measures
- Dots represent entities (municipalities, regions)
- Dot size can map to a third measure
- On play: dots move smoothly to new positions as time advances
- Trail option: show fading trail of previous positions

**Animated bar/column chart**:
- Bars resize smoothly as values change over time
- Optional: bar race animation (sort by value at each time step)
- Current time period shown as title subtitle

**Animated line chart**:
- Line draws progressively, revealing data up to the current time period
- "Curtain reveal" effect: data before current time is visible, after is hidden

**Animated map** (build on Feature 11-12):
- Choropleth colors transition smoothly between time periods
- Shows temporal patterns in geographic data (e.g., population change by municipality over decades)

### Animation state
Extend the interactive filters store (Feature 05):
```typescript
interface AnimationState {
  isPlaying: boolean
  currentIndex: number
  totalFrames: number
  speed: number  // multiplier
  frameDuration: number  // ms
  timeValues: (Date | string)[]
  // Actions
  play: () => void
  pause: () => void
  stepForward: () => void
  stepBackward: () => void
  seekTo: (index: number) => void
  setSpeed: (speed: number) => void
}
```

### Smooth transitions
- Use `requestAnimationFrame` for smooth interpolation between frames
- For Recharts: leverage built-in `isAnimationActive` prop
- For D3: use `d3-transition` with duration matching frame rate
- Interpolate numeric values linearly between frames
- Categorical changes snap instantly (no interpolation)

### Configurator integration
In customize step (Feature 04), when temporal dimension exists:
- "Enable animation" toggle
- Select which dimension is the time axis
- Select animation speed default
- Preview animation in configurator

## Affected areas
- `src/stores/animation.ts` (new Zustand store)
- `src/components/charts/shared/AnimationControls.tsx` (new: playback bar)
- `src/components/charts/shared/AnimationProvider.tsx` (new: animation context and loop)
- `src/components/charts/scatterplot/` (extend: animated dot transitions)
- `src/components/charts/bar/`, `column/` (extend: animated bar resize)
- `src/components/charts/line/` (extend: progressive reveal)
- `src/components/charts/map/` (extend: temporal choropleth transitions)
- `src/types/chart-config.ts` (add animation config fields)
- `src/lib/data/transforms.ts` (add: `getTimeSlice(data, timeValue)` function)
- `public/locales/*/common.json` (labels: "Play", "Pause", "Speed", time format labels)

## Constraints
- Animation must not cause memory leaks — cancel animation loop on unmount
- Smooth on mid-range devices (target 30fps minimum on 3-year-old phones)
- Large datasets (1000+ entities × 20 time periods) may need simplified rendering during playback
- Animation frame timing must be consistent (use timestamp-based loop, not interval-based)
- Paused state must show the current frame clearly (no stuck-between-frames artifacts)
- Animation controls must be keyboard-accessible (space = play/pause, arrows = step)

## Out of scope
- Recording animation as video/GIF
- Custom easing functions
- Per-entity animation (only temporal global animation)
- Sound effects

## Acceptance criteria
- [ ] Play button starts animation, stepping through time values
- [ ] Pause stops at current frame
- [ ] Previous/next buttons step one frame
- [ ] Slider shows progress and is draggable to seek
- [ ] Speed selector changes frame duration (0.5x to 4x)
- [ ] Animated scatterplot: dots move smoothly between positions
- [ ] Animated bar chart: bars resize smoothly
- [ ] Animated line chart: progressive reveal works
- [ ] Animation state managed in Zustand store (not component-local)
- [ ] Animation stops cleanly on component unmount (no memory leaks)
- [ ] Keyboard controls work (space, left/right arrows)
- [ ] All playback labels translated in three locales
- [ ] Current time value formatted per locale

## Prior art / references
- Swiss tool: `app/stores/interactive-filters.tsx` — timeSlider state (animation value)
- Swiss tool: `app/configurator/interactive-filters/time-slider.tsx` — time slider component
- Swiss tool: `app/utils/animated-frame.ts` — requestAnimationFrame wrapper
- Gapminder (gapminder.org): animated scatterplot inspiration
- d3-transition: smooth SVG transitions
