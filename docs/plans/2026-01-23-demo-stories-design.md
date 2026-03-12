# Demo Data Stories Design

**Date**: 2026-01-23 **Status**: Approved **Owner**: Vizualni Admin Team

## Overview

Transform demo pages from a simple component gallery into an immersive data
storytelling platform that engages end users with compelling narratives about
Serbia's challenges and progress, while simultaneously demonstrating the
package's capabilities to developers.

## Vision

Create **interactive story walkthroughs** where users progress through curated
data narratives step-by-step. Each story combines context, data visualization,
insights, and actionable next steps.

### Goals

1. **For End Users**: Compelling stories about Serbia's challenges and progress
2. **For Developers**: Demonstrates package power through real-world scenarios
3. **For Stakeholders**: Pitch-ready visualizations with clear narratives

## Story Themes

| Story                     | Focus                                     | Key Insights                               |
| ------------------------- | ----------------------------------------- | ------------------------------------------ |
| **Demographic Crisis**    | Population decline, aging, brain drain    | Serbia: 7.5M → 6.7M since 2002             |
| **Economic Transition**   | Regional disparities, energy, digital     | GDP gaps, coal dependency, skills shortage |
| **Climate Crisis**        | Temperature rise, air quality, renewables | Pollution trends, energy transition needs  |
| **Healthcare Challenges** | Wait times, capacity, access              | Systemic constraints and quality issues    |

## Architecture

### New Components

```
app/components/stories/
├── StoryContainer.tsx       # Main wrapper, step management
├── StoryStep.tsx            # Individual step with chart + narrative
├── StoryNavigation.tsx      # Progress bar, Next/Prev, step thumbnails
├── StoryProgress.tsx        # Visual progress indicator
└── StoryInsight.tsx         # Highlighted insight callout
```

### New Pages

```
app/pages/stories/
├── index.tsx                # Story gallery/landing
├── [storyId].tsx            # Dynamic story page
└── _components/
    ├── StoryLayout.tsx
    ├── StoryCard.tsx
    └── StoryHero.tsx
```

### Configuration

```
app/lib/stories/
├── config.ts                # Story metadata
├── useStoryProgress.ts      # Progress hook
├── demographics-story.ts    # Story 1
├── economy-story.ts         # Story 2
├── climate-story.ts         # Story 3
├── healthcare-story.ts      # Story 4
└── index.ts
```

### Data

```
app/data/stories/
├── demographics-data.ts     # Curated data.gov.rs datasets
├── economy-data.ts
├── climate-data.ts
└── healthcare-data.ts
```

## Component APIs

### StoryContainer

```typescript
interface StoryContainerProps {
  storyId: string;
  config: StoryConfig;
}

interface StoryConfig {
  id: string;
  title: { sr: string; en: string };
  description: { sr: string; en: string };
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  theme: "demographics" | "economy" | "climate" | "healthcare";
  steps: StoryStepConfig[];
}

interface StoryStepConfig {
  id: string;
  title: { sr: string; en: string };
  narrative: { sr: string; en: string };
  chartComponent: React.ComponentType;
  chartProps: Record<string, unknown>;
  insights: string[];
  callout?: string;
}
```

### StoryStep

```typescript
interface StoryStepProps {
  step: StoryStepConfig;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}
```

### StoryNavigation

```typescript
interface StoryNavigationProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  onNavigate: (step: number) => void;
}
```

## User Journey Example: Demographics Story

```
Story Gallery → User selects "Demographic Crisis"
              ↓
Story Intro → Title, duration (5 min), preview
              ↓
Step 1: National Trend
  - Line chart: Population 1990-2024
  - Insight: "Serbia's population declined from 7.5M to 6.7M"
  - Interactive: Hover for year-by-year
              ↓
Step 2: Regional Impact
  - Map: Population change by district
  - Insight: "Eastern Serbia most affected: -22%"
  - Interactive: Click region for details
              ↓
Step 3: Age Structure
  - Population pyramid with slider
  - Insight: "65+ will double by 2050"
  - Interactive: Drag slider to see projections
              ↓
Step 4: Brain Drain
  - Flow chart: Education → Destination
  - Insight: "40% of graduates plan to emigrate"
              ↓
Step 5: What Can Be Done
  - Scenario explorer with sliders
  - Interactive: Adjust policies, see outcomes
              ↓
Summary → Key takeaways + action items
       ↓
Next → Explore healthcare impact or View docs
```

## State Management

```typescript
interface StoryState {
  currentStep: number;
  completedSteps: Set<number>;
  userInteractions: Record<string, unknown>; // { "step3-slider": 2050 }
  bookmarked: boolean;
}
```

Stored in localStorage for persistence.

## Data Strategy

1. **Pre-fetch**: Load all datasets for story on page load
2. **Cache**: Store in browser for instant transitions
3. **Fallback**: Use demo data if API fails gracefully
4. **Progressive**: Stream large datasets in chunks

## Error Handling

| Scenario            | Response                                           |
| ------------------- | -------------------------------------------------- |
| Dataset unavailable | Friendly message + retry option + fallback to demo |
| User abandons story | Save progress + "Continue where you left off"      |
| Network error       | Show cached data + retry indicator                 |
| Missing translation | Fall back to English                               |

## Accessibility

- Keyboard navigation for all interactives
- Screen reader announcements for step changes
- High contrast mode support
- Chart alt text with data insights
- ARIA labels on all controls

## Performance Targets

| Metric                | Target      |
| --------------------- | ----------- |
| Initial page load     | < 2 seconds |
| Step transition       | < 500ms     |
| Bundle size per story | < 200KB     |
| Story completion rate | > 70%       |

## Implementation Phases

### Phase 1: Foundation

- [ ] Create StoryContainer and StoryStep components
- [ ] Implement useStoryProgress hook
- [ ] Build story gallery page
- [ ] Set up dynamic routing

### Phase 2: First Story

- [ ] Create demographics-story.ts config
- [ ] Build 5 story steps with real data
- [ ] Implement navigation and transitions
- [ ] Add progress persistence
- [ ] Test on mobile and desktop

### Phase 3: Remaining Stories

- [ ] Economy story (GDP, energy, digital)
- [ ] Climate story (temperature, air quality)
- [ ] Healthcare story (wait times, capacity)

### Phase 4: Polish

- [ ] Animations and micro-interactions
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Social sharing features
- [ ] Analytics integration

### Phase 5: Package Integration

- [ ] "Build Your Own Story" developer guide
- [ ] Story template as NPM export
- [ ] CLI tool: `npx create-vizualni-story`
- [ ] Link stories to API docs

## Success Metrics

- Users complete 70%+ of story steps on average
- Average time on story pages: 3+ minutes
- NPM package installs increase 25% after launch
- 5+ community-contributed stories within 3 months

## Key Design Decisions

| Aspect           | Decision                 | Rationale                  |
| ---------------- | ------------------------ | -------------------------- |
| State management | Zustand                  | Simple, already in project |
| Animations       | Framer Motion            | Smooth step transitions    |
| Charts           | Existing demo components | Reuse, consistency         |
| Data source      | data.gov.rs + fallbacks  | Real data, resilient       |
| i18n             | Lingui (existing)        | Serbian/English support    |

## Dependencies

**New to install:**

```bash
npm install framer-motion
```

**Already in project:**

- @lingui/react (i18n)
- zustand (state)
- @mui/material (UI)
- Existing chart components

## Next Steps

1. Create git worktree for isolated development
2. Create detailed implementation plan
3. Begin Phase 1 implementation
