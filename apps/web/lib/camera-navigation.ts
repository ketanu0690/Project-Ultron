import type { CameraState, ScaleLevel } from '@ultron/shared';

import { createDefaultCameraState } from '@/lib/camera-presets';
import { useNavigationStore } from '@/stores/navigationStore';

/** Persist camera framing so CameraRig applies it when the scale mounts. */
export function commitCameraStateForScale(
  scale: ScaleLevel,
  state: CameraState,
): void {
  const store = useNavigationStore.getState();
  store.saveCameraStateForScale(scale, state);
  store.setCameraState(state);
}

/** Reset a scale to its default overview framing (fit to screen). */
export function commitDefaultCameraForScale(scale: ScaleLevel): CameraState {
  const defaultState = createDefaultCameraState(scale);
  commitCameraStateForScale(scale, defaultState);
  return defaultState;
}
