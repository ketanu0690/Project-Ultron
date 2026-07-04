'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SCALE_LEVELS, type ScaleLevel } from '@ultron/shared';

import { NAVIGATION_URL_PARAMS } from '@/lib/navigation-url';
import { getSceneGraphManager } from '@/lib/scene-graph-instance';
import { useNavigationStore } from '@/stores/navigationStore';

function isScaleLevel(value: string): value is ScaleLevel {
  return (SCALE_LEVELS as readonly string[]).includes(value);
}

export function useScaleUrlParam(): void {
  const searchParams = useSearchParams();
  const setScale = useNavigationStore((state) => state.setScale);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );
  const setScrollJourneyComplete = useNavigationStore(
    (state) => state.setScrollJourneyComplete,
  );

  useEffect(() => {
    const scaleParam = searchParams.get(NAVIGATION_URL_PARAMS.scale);
    const entityParam = searchParams.get(NAVIGATION_URL_PARAMS.entity);

    if (scaleParam && isScaleLevel(scaleParam)) {
      getSceneGraphManager().setActiveScale(scaleParam);
      setScale(scaleParam);
      setFocusEntityId(entityParam ?? null);

      const isDeepLink = scaleParam !== 'galaxy' || entityParam !== null;
      const isCosmicJourney = scaleParam === 'galaxy' || scaleParam === 'earth';
      if (isDeepLink || !isCosmicJourney) {
        setScrollJourneyComplete(true);
      }
    } else if (entityParam) {
      setFocusEntityId(entityParam);
    }
  }, [searchParams, setFocusEntityId, setScale, setScrollJourneyComplete]);
}
