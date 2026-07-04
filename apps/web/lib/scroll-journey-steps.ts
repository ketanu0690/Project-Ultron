import type { ScaleLevel } from '@ultron/shared';

import type { TransitionId } from '@/lib/transition-paths';

export interface ScrollJourneyStep {
  readonly scale: ScaleLevel;
  readonly focusEntityId: string | null;
  readonly label: string;
  /** Step-specific scroll hint shown in BottomHUD. */
  readonly hint?: string;
  /** Animated path when entering this step (scroll down). */
  readonly enterPathId?: TransitionId;
  /** Animated path when leaving this step (scroll up to previous). */
  readonly exitPathId?: TransitionId;
}

export const SCROLL_JOURNEY_STEPS: readonly ScrollJourneyStep[] = [
  {
    scale: 'galaxy',
    focusEntityId: null,
    label: 'Galactic Overview',
    hint: 'Drag to pan · Scroll to zoom into the core · Center reached → Earth',
  },
  {
    scale: 'earth',
    focusEntityId: null,
    label: 'Earth',
    hint: 'Drag to orbit · Scroll to zoom into the surface · Center reached → Brain City',
    enterPathId: 'galaxy-to-earth',
    exitPathId: 'earth-to-galaxy',
  },
  {
    scale: 'megacity',
    focusEntityId: null,
    label: 'Brain City',
    hint: 'Click a floating district to explore · No scroll needed from Earth',
    enterPathId: 'earth-to-megacity',
    exitPathId: 'megacity-to-earth',
  },
  {
    scale: 'district',
    focusEntityId: 'district-perception',
    label: 'Perception District',
    enterPathId: 'megacity-to-district',
    exitPathId: 'district-to-megacity',
  },
  {
    scale: 'district',
    focusEntityId: 'district-memory',
    label: 'Memory District',
    enterPathId: 'district-dive-memory',
    exitPathId: 'district-rise-memory',
  },
  {
    scale: 'district',
    focusEntityId: 'district-reasoning',
    label: 'Reasoning District',
    enterPathId: 'district-dive-reasoning',
    exitPathId: 'district-rise-reasoning',
  },
  {
    scale: 'district',
    focusEntityId: 'district-action',
    label: 'Action District',
    enterPathId: 'district-dive-action',
    exitPathId: 'district-rise-action',
  },
  {
    scale: 'district',
    focusEntityId: 'district-self_improvement',
    label: 'Self Improvement District',
    enterPathId: 'district-dive-self-improvement',
    exitPathId: 'district-rise-self-improvement',
  },
];

export const SCROLL_JOURNEY_LAST_STEP_INDEX = SCROLL_JOURNEY_STEPS.length - 1;
