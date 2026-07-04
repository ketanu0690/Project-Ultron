'use client';

import { useEffect } from 'react';
import { SCALE_LEVELS, type ScaleLevel } from '@ultron/shared';

import { createDefaultCameraState } from '@/lib/camera-presets';
import { buildBreadcrumbs } from '@/lib/navigation-breadcrumbs';
import { readNavigationFromUrl } from '@/lib/navigation-url';
import { getSceneGraphManager } from '@/lib/scene-graph-instance';
import { useNavigationStore } from '@/stores/navigationStore';

function isScaleLevel(value: string): value is ScaleLevel {
  return (SCALE_LEVELS as readonly string[]).includes(value);
}

/**
 * Ensures a fresh visit (no ?scale=) starts at galaxy step 0, unless ?entry=brain-city.
 * When ?scale= is present, hydrates store from URL so reload lands on the correct scene.
 */
export function useInitialNavigation(): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlNavigation = readNavigationFromUrl(window.location.search);

    if (urlNavigation) {
      const { scale, focusEntityId } = urlNavigation;
      getSceneGraphManager().setActiveScale(scale);
      const isDeepLink = scale !== 'galaxy' || focusEntityId !== null;
      const isCosmicJourney = scale === 'galaxy' || scale === 'earth';

      useNavigationStore.setState({
        currentScale: scale,
        focusEntityId,
        breadcrumbs: buildBreadcrumbs(scale, focusEntityId),
        cameraState: createDefaultCameraState(scale),
        isScrollJourneyComplete: isDeepLink || !isCosmicJourney,
      });
      return;
    }

    const entryParam = params.get('entry');
    if (entryParam === 'brain-city') {
      const initialScale: ScaleLevel = 'earth';
      getSceneGraphManager().setActiveScale(initialScale);
      useNavigationStore.setState({
        currentScale: initialScale,
        focusEntityId: null,
        scrollJourneyStepIndex: 1,
        isScrollJourneyComplete: false,
        breadcrumbs: [
          { scale: 'galaxy', label: 'Galaxy' },
          { scale: 'earth', label: 'Earth' },
        ],
        cameraState: createDefaultCameraState(initialScale),
      });
      return;
    }

    const scaleParam = params.get('scale');
    if (scaleParam && isScaleLevel(scaleParam)) {
      return;
    }

    const initialScale: ScaleLevel = 'galaxy';
    getSceneGraphManager().setActiveScale(initialScale);
    useNavigationStore.setState({
      currentScale: initialScale,
      focusEntityId: null,
      scrollJourneyStepIndex: 0,
      isScrollJourneyComplete: false,
      breadcrumbs: [{ scale: 'galaxy', label: 'Galaxy' }],
      cameraState: createDefaultCameraState(initialScale),
    });
  }, []);
}
