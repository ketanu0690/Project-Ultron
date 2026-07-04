/**

 * Session-local navigation state. Subscribe with narrow selectors:

 * useNavigationStore(s => s.currentScale)

 */

import type { CameraState, ScaleLevel } from '@ultron/shared';

import { create } from 'zustand';

import { createDefaultCameraState } from '@/lib/camera-presets';

import type { Breadcrumb } from '@/lib/navigation-breadcrumbs';

interface NavigationState {
  currentScale: ScaleLevel;
  focusEntityId: string | null;
  breadcrumbs: readonly Breadcrumb[];
  cameraState: CameraState;
  cameraStatesByScale: Partial<Record<ScaleLevel, CameraState>>;
  isTransitioning: boolean;
  scrollJourneyStepIndex: number;
  isScrollJourneyComplete: boolean;
}

interface NavigationActions {
  setScale: (scale: ScaleLevel) => void;
  setFocusEntityId: (entityId: string | null) => void;
  setBreadcrumbs: (breadcrumbs: readonly Breadcrumb[]) => void;
  setCameraState: (state: CameraState) => void;
  saveCameraStateForScale: (scale: ScaleLevel, state: CameraState) => void;
  getCameraStateForScale: (scale: ScaleLevel) => CameraState | undefined;
  setTransitioning: (isTransitioning: boolean) => void;
  setScrollJourneyStepIndex: (stepIndex: number) => void;
  setScrollJourneyComplete: (isComplete: boolean) => void;
}

export type NavigationStore = NavigationState & NavigationActions;

const initialScale: ScaleLevel = 'galaxy';

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentScale: initialScale,
  focusEntityId: null,
  breadcrumbs: [{ scale: 'galaxy', label: 'Galaxy' }],
  cameraState: createDefaultCameraState(initialScale),
  cameraStatesByScale: {},
  isTransitioning: false,
  scrollJourneyStepIndex: 0,
  isScrollJourneyComplete: false,
  setScale: (scale) => {
    set({ currentScale: scale });
  },
  setFocusEntityId: (entityId) => {
    set({ focusEntityId: entityId });
  },
  setBreadcrumbs: (breadcrumbs) => {
    set({ breadcrumbs });
  },
  setCameraState: (state) => {
    set({ cameraState: state });
  },
  saveCameraStateForScale: (scale, state) => {
    set((current) => ({
      cameraStatesByScale: {
        ...current.cameraStatesByScale,
        [scale]: state,
      },
      cameraState: current.currentScale === scale ? state : current.cameraState,
    }));
  },
  getCameraStateForScale: (scale) => {
    return get().cameraStatesByScale[scale];
  },
  setTransitioning: (isTransitioning) => {
    set({ isTransitioning });
  },
  setScrollJourneyStepIndex: (stepIndex) => {
    set({ scrollJourneyStepIndex: stepIndex });
  },
  setScrollJourneyComplete: (isComplete) => {
    set({ isScrollJourneyComplete: isComplete });
  },
}));
