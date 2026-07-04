'use client';

import { useEffect } from 'react';

import {
  fetchDistrictAgents,
  fetchDistrictBuildings,
  fetchDistricts,
  fetchNavigation,
} from '@/lib/api-endpoints';
import { useWorldStore } from '@/stores/worldStore';

export function useWorldSync(): void {
  const setHydrated = useWorldStore((state) => state.setHydrated);
  const setLoading = useWorldStore((state) => state.setLoading);
  const setError = useWorldStore((state) => state.setError);
  const isHydrated = useWorldStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated) {
      return;
    }

    let cancelled = false;

    async function hydrate(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        const [districtsRes, navigationRes, buildingsRes, agentsRes] =
          await Promise.all([
            fetchDistricts(),
            fetchNavigation('megacity'),
            fetchDistrictBuildings('reasoning'),
            fetchDistrictAgents('reasoning'),
          ]);

        if (cancelled) {
          return;
        }

        const agentNav = await fetchNavigation('agent', 'agent-sigma-7');
        const buildingNav = await fetchNavigation(
          'building',
          'building-planning-tower',
        );

        if (cancelled) {
          return;
        }

        setHydrated({
          districts: districtsRes.data,
          buildings: buildingsRes.data,
          rooms: buildingNav.data.entities.rooms,
          agents: agentsRes.data,
          hierarchy: navigationRes.data.hierarchy,
          aggregates: {
            districtCount: navigationRes.data.entities.metrics.entityCount,
            totalAgents: navigationRes.data.entities.metrics.activeAgents,
            cityProsperity: 94.2,
          },
        });

        void agentNav;
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load world data',
          );
        }
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, setError, setHydrated, setLoading]);
}
