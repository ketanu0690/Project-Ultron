import { getCameraController } from '@/lib/camera-controller-instance';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';

const MEGACITY_JOURNEY_STEP_INDEX = 2;

/** Cinematic click-to-enter — no scroll between Earth and Brain City. */
export function enterBrainCity(): void {
  const store = useNavigationStore.getState();

  if (store.isTransitioning || store.currentScale !== 'earth') {
    return;
  }

  getScaleTransitionController().transitionTo('megacity', 'earth-to-megacity');
  store.setFocusEntityId(null);
  store.setScrollJourneyStepIndex(MEGACITY_JOURNEY_STEP_INDEX);
  store.setScrollJourneyComplete(true);
  getCameraController().setWheelDollyEnabled(true);
}

export function canEnterBrainCity(): boolean {
  const store = useNavigationStore.getState();
  return store.currentScale === 'earth' && !store.isTransitioning;
}
