import type { ScaleLevel } from '@ultron/shared';

import { hasFreeCameraControl } from '@/lib/camera-interaction';
import {
  commitCameraStateForScale,
  commitDefaultCameraForScale,
} from '@/lib/camera-navigation';
import { getCameraController } from '@/lib/camera-controller-instance';
import { getSceneGraphManager } from '@/lib/scene-graph-instance';
import { preloadScaleScene } from '@/lib/scene-loaders';
import {
  getTransitionPath,
  resolveTransitionId,
  type TransitionId,
} from '@/lib/transition-paths';
import { useNavigationStore } from '@/stores/navigationStore';

export class ScaleTransitionController {
  getScale(): ScaleLevel {
    return getSceneGraphManager().getActiveScale();
  }

  transitionTo(target: ScaleLevel, transitionId?: TransitionId): void {
    const store = useNavigationStore.getState();
    const from = store.currentScale;

    if (from === target) {
      return;
    }

    const resolvedId = transitionId ?? resolveTransitionId(from, target);

    if (!resolvedId) {
      this.instantTransition(target);
      return;
    }

    const path = getTransitionPath(resolvedId);
    const camera = getCameraController();

    if (camera.isAnimatingPath()) {
      return;
    }

    store.setTransitioning(true);

    if (path.preload) {
      preloadScaleScene(target);
    }

    camera.startPathAnimation(path, () => {
      getSceneGraphManager().setActiveScale(target);

      const endState = camera.syncFromControls();
      commitCameraStateForScale(target, endState);

      store.setScale(target);

      if (hasFreeCameraControl(target)) {
        store.setScrollJourneyComplete(true);
        getCameraController().setWheelDollyEnabled(true);
      }

      store.setTransitioning(false);
    });
  }

  skipTransition(): void {
    const camera = getCameraController();
    if (!camera.isAnimatingPath()) {
      return;
    }
    camera.skipPathAnimation();
    useNavigationStore.getState().setTransitioning(false);
  }

  setScale(scale: ScaleLevel): void {
    this.transitionTo(scale);
  }

  /** Camera path only — same scale, no scene swap (district-to-district zoom). */
  animatePathOnly(transitionId: TransitionId): void {
    const store = useNavigationStore.getState();
    const path = getTransitionPath(transitionId);
    const camera = getCameraController();

    if (camera.isAnimatingPath()) {
      return;
    }

    store.setTransitioning(true);
    camera.startPathAnimation(path, () => {
      const endState = camera.syncFromControls();
      commitCameraStateForScale(store.currentScale, endState);
      store.setTransitioning(false);
    });
  }

  private instantTransition(target: ScaleLevel): void {
    const store = useNavigationStore.getState();
    const defaultState = commitDefaultCameraForScale(target);

    store.setTransitioning(true);
    getSceneGraphManager().setActiveScale(target);
    store.setScale(target);

    if (hasFreeCameraControl(target)) {
      store.setScrollJourneyComplete(true);
      getCameraController().setWheelDollyEnabled(true);
    }

    void getCameraController().setState(defaultState, false);
    store.setTransitioning(false);
  }
}
