'use client';

import { useEffect } from 'react';

import { getScrollJourneyController } from '@/lib/scroll-journey-instance';
import { useNavigationStore } from '@/stores/navigationStore';

export function useScrollJourney(
  hostRef: React.RefObject<HTMLElement | null>,
): void {
  const isScrollJourneyComplete = useNavigationStore(
    (state) => state.isScrollJourneyComplete,
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const controller = getScrollJourneyController();

    const handleWheel = (event: WheelEvent): void => {
      if (useNavigationStore.getState().isScrollJourneyComplete) {
        return;
      }

      const consumed = controller.handleWheel(event.deltaY);
      if (consumed) {
        event.preventDefault();
      }
    };

    host.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      host.removeEventListener('wheel', handleWheel);
    };
  }, [hostRef, isScrollJourneyComplete]);
}
