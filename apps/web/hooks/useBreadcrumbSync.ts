'use client';

import { useEffect } from 'react';

import { fetchAgentMemories, fetchNavigation } from '@/lib/api-endpoints';
import { buildBreadcrumbs } from '@/lib/navigation-breadcrumbs';
import { getEntityDetail } from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useWorldStore } from '@/stores/worldStore';

export function useBreadcrumbSync(): void {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const setBreadcrumbs = useNavigationStore((state) => state.setBreadcrumbs);
  const isHydrated = useWorldStore((state) => state.isHydrated);
  const getWorldEntityDetail = useWorldStore((state) => state.getEntityDetail);

  useEffect(() => {
    if (!isHydrated) {
      setBreadcrumbs(buildBreadcrumbs(currentScale, focusEntityId));
      return;
    }

    let cancelled = false;

    async function syncFromApi(): Promise<void> {
      try {
        const response = await fetchNavigation(currentScale, focusEntityId);
        if (!cancelled && response.data.breadcrumbs.length > 0) {
          setBreadcrumbs(response.data.breadcrumbs);
          return;
        }
      } catch {
        // Fall back to local breadcrumb builder when API is unavailable.
      }

      if (!cancelled) {
        const entity =
          getWorldEntityDetail(focusEntityId) ?? getEntityDetail(focusEntityId);
        if (entity) {
          setBreadcrumbs(buildBreadcrumbs(currentScale, entity.id));
        } else {
          setBreadcrumbs(buildBreadcrumbs(currentScale, focusEntityId));
        }
      }
    }

    void syncFromApi();

    return () => {
      cancelled = true;
    };
  }, [
    currentScale,
    focusEntityId,
    getWorldEntityDetail,
    isHydrated,
    setBreadcrumbs,
  ]);
}
