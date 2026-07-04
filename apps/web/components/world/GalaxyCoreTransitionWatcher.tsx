'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { getCameraController } from '@/lib/camera-controller-instance';
import { getScrollJourneyController } from '@/lib/scroll-journey-instance';
import { useNavigationStore } from '@/stores/navigationStore';

/**
 * When the galaxy camera reaches min zoom (galactic core), auto-advance to Earth.
 */
export function GalaxyCoreTransitionWatcher(): null {
  const wasAtCoreRef = useRef(false);

  useFrame(() => {
    const store = useNavigationStore.getState();
    const onGalaxyStep =
      store.currentScale === 'galaxy' &&
      store.scrollJourneyStepIndex === 0 &&
      !store.isScrollJourneyComplete &&
      !store.isTransitioning;

    if (!onGalaxyStep) {
      wasAtCoreRef.current = false;
      return;
    }

    const atCore = getCameraController().isDollyAtMin();

    if (atCore && !wasAtCoreRef.current) {
      wasAtCoreRef.current = true;
      getScrollJourneyController().tryAdvanceFromGalaxyCore();
    } else if (!atCore) {
      wasAtCoreRef.current = false;
    }
  });

  return null;
}
