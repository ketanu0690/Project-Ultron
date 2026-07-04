'use client';

import { useEffect, useState } from 'react';
import type { GalaxyHudMetrics } from '@ultron/shared';

import { fetchStarSystems } from '@/lib/api-endpoints';
import { GALAXY_HUD_METRICS } from '@/scenes/galaxy/star-systems.mock';
import { useNavigationStore } from '@/stores/navigationStore';

interface GalaxyMetricsState {
  readonly metrics: GalaxyHudMetrics;
  readonly isLoading: boolean;
  readonly isMockData: boolean;
  readonly error: string | null;
}

export function useGalaxyMetrics(): GalaxyMetricsState {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const [metrics, setMetrics] = useState<GalaxyHudMetrics>(GALAXY_HUD_METRICS);
  const [isLoading, setIsLoading] = useState(currentScale === 'galaxy');
  const [isMockData, setIsMockData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentScale !== 'galaxy') {
      return;
    }

    let cancelled = false;

    async function loadMetrics(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchStarSystems();
        if (cancelled) {
          return;
        }

        setMetrics(response.data.metrics);
        setIsMockData(false);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setMetrics(GALAXY_HUD_METRICS);
        setIsMockData(true);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load galaxy metrics',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMetrics();

    return () => {
      cancelled = true;
    };
  }, [currentScale]);

  return { metrics, isLoading, isMockData, error };
}
