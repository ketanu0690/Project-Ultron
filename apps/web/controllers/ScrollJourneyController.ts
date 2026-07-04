import { hasFreeCameraControl } from '@/lib/camera-interaction';
import { getCameraController } from '@/lib/camera-controller-instance';
import { enterBrainCity } from '@/lib/enter-brain-city';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { resolveScrollWheelJourneyAction } from '@/lib/scroll-journey-wheel';
import {
  SCROLL_JOURNEY_LAST_STEP_INDEX,
  SCROLL_JOURNEY_STEPS,
} from '@/lib/scroll-journey-steps';
import { useNavigationStore } from '@/stores/navigationStore';

const WHEEL_THRESHOLD = 100;
const STEP_COOLDOWN_MS = 600;

export class ScrollJourneyController {
  private accumulatedDelta = 0;
  private lastStepAt = 0;

  handleWheel(deltaY: number): boolean {
    const store = useNavigationStore.getState();

    if (
      store.isScrollJourneyComplete ||
      store.isTransitioning ||
      hasFreeCameraControl(store.currentScale)
    ) {
      return false;
    }

    const camera = getCameraController();
    const action = resolveScrollWheelJourneyAction(
      deltaY,
      camera.isDollyAtMin(),
      camera.isDollyAtMax(),
      store.scrollJourneyStepIndex,
    );

    if (action === 'delegate_dolly') {
      return false;
    }

    if (action === 'consume_idle') {
      return true;
    }

    const now = Date.now();
    if (now - this.lastStepAt < STEP_COOLDOWN_MS) {
      return true;
    }

    this.accumulatedDelta += deltaY;

    if (Math.abs(this.accumulatedDelta) < WHEEL_THRESHOLD) {
      return true;
    }

    const direction = this.accumulatedDelta > 0 ? 1 : -1;
    this.accumulatedDelta = 0;

    if (direction > 0) {
      this.advanceForward(store.scrollJourneyStepIndex);
    } else {
      this.advanceBackward(store.scrollJourneyStepIndex);
    }

    this.lastStepAt = now;
    return true;
  }

  applyStep(stepIndex: number, direction: 'forward' | 'backward'): void {
    const step = SCROLL_JOURNEY_STEPS[stepIndex];
    if (!step) {
      return;
    }

    const store = useNavigationStore.getState();
    const currentScale = store.currentScale;
    const pathId = direction === 'forward' ? step.enterPathId : step.exitPathId;

    if (pathId) {
      if (step.scale !== currentScale) {
        getScaleTransitionController().transitionTo(step.scale, pathId);
      } else {
        getScaleTransitionController().animatePathOnly(pathId);
      }
    } else if (step.scale !== currentScale) {
      getScaleTransitionController().transitionTo(step.scale);
    }

    store.setFocusEntityId(step.focusEntityId);
    store.setScrollJourneyStepIndex(stepIndex);
  }

  complete(): void {
    const store = useNavigationStore.getState();
    store.setScrollJourneyComplete(true);
  }

  /** Auto-trigger Earth transition when the galaxy camera reaches the core (min dolly). */
  tryAdvanceFromGalaxyCore(): void {
    const store = useNavigationStore.getState();

    if (
      store.currentScale !== 'galaxy' ||
      store.scrollJourneyStepIndex !== 0 ||
      store.isScrollJourneyComplete ||
      store.isTransitioning
    ) {
      return;
    }

    if (!getCameraController().isDollyAtMin()) {
      return;
    }

    this.advanceForward(0);
  }

  /** Auto-trigger Brain City when the Earth camera reaches the surface (min dolly). */
  tryAdvanceFromEarthCore(): void {
    const store = useNavigationStore.getState();

    if (store.currentScale !== 'earth' || store.isTransitioning) {
      return;
    }

    if (!getCameraController().isDollyAtMin()) {
      return;
    }

    enterBrainCity();
  }

  private advanceForward(stepIndex: number): void {
    if (stepIndex >= SCROLL_JOURNEY_LAST_STEP_INDEX) {
      this.complete();
      return;
    }

    const currentStep = SCROLL_JOURNEY_STEPS[stepIndex];
    const nextStep = SCROLL_JOURNEY_STEPS[stepIndex + 1];

    // Earth → Brain City uses click / Enter Brain City — never scroll
    if (currentStep?.scale === 'earth' && nextStep?.scale === 'megacity') {
      return;
    }

    const nextIndex = stepIndex + 1;
    this.applyStep(nextIndex, 'forward');

    if (nextIndex >= SCROLL_JOURNEY_LAST_STEP_INDEX) {
      this.complete();
    }
  }

  private advanceBackward(stepIndex: number): void {
    if (stepIndex <= 0) {
      return;
    }

    const store = useNavigationStore.getState();
    if (store.isScrollJourneyComplete) {
      store.setScrollJourneyComplete(false);
    }

    const currentStep = SCROLL_JOURNEY_STEPS[stepIndex];
    const pathId = currentStep?.exitPathId;

    if (pathId) {
      const previousStep = SCROLL_JOURNEY_STEPS[stepIndex - 1];
      if (previousStep && previousStep.scale !== store.currentScale) {
        getScaleTransitionController().transitionTo(previousStep.scale, pathId);
      } else {
        getScaleTransitionController().animatePathOnly(pathId);
      }
    }

    store.setFocusEntityId(
      SCROLL_JOURNEY_STEPS[stepIndex - 1]?.focusEntityId ?? null,
    );
    store.setScrollJourneyStepIndex(stepIndex - 1);
  }

  reset(): void {
    this.accumulatedDelta = 0;
    this.lastStepAt = 0;
  }
}
