'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { getCameraController } from '@/lib/camera-controller-instance';
import { getScrollJourneyController } from '@/lib/scroll-journey-instance';
import { useNavigationStore } from '@/stores/navigationStore';

/**
 * When the Earth camera reaches min zoom (planetary surface), auto-advance to Brain City.
 */
export function EarthCoreTransitionWatcher(): null {
  const wasAtCoreRef = useRef(false);

  useFrame(() => {
    const store = useNavigationStore.getState();
    const onEarth = store.currentScale === 'earth' && !store.isTransitioning;

    if (!onEarth) {
      wasAtCoreRef.current = false;
      return;
    }

    const atCore = getCameraController().isDollyAtMin();

    if (atCore && !wasAtCoreRef.current) {
      wasAtCoreRef.current = true;
      getScrollJourneyController().tryAdvanceFromEarthCore();
    } else if (!atCore) {
      wasAtCoreRef.current = false;
    }
  });

  return null;
}
