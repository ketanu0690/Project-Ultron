'use client';

import { useEffect } from 'react';

import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { useNavigationStore } from '@/stores/navigationStore';

export function useGalaxyNavigation(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'g') {
        event.preventDefault();
        getScaleTransitionController().transitionTo('galaxy');
        return;
      }

      if (key === '1' && event.shiftKey) {
        event.preventDefault();
        getScaleTransitionController().transitionTo('galaxy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

export function useGalaxyHudVisibility(): boolean {
  return useNavigationStore((state) => state.currentScale === 'galaxy');
}
