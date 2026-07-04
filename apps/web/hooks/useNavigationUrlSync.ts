'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import {
  buildNavigationQueryString,
  hasNavigationUrlParams,
  navigationQueryMatches,
} from '@/lib/navigation-url';
import { useNavigationStore } from '@/stores/navigationStore';

/** Keeps `?scale=` and `?entity=` in sync with navigation store (sidebar, breadcrumbs, transitions). */
export function useNavigationUrlSync(): void {
  const router = useRouter();
  const pathname = usePathname();
  const currentScale = useNavigationStore((state) => state.currentScale);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const isTransitioning = useNavigationStore((state) => state.isTransitioning);
  const skipInitialRef = useRef(true);

  useEffect(() => {
    if (isTransitioning) {
      return;
    }

    const preserve = new URLSearchParams(window.location.search);
    const nextQuery = buildNavigationQueryString(
      currentScale,
      focusEntityId,
      preserve,
    );
    const currentSearch = window.location.search;

    if (navigationQueryMatches(currentScale, focusEntityId, currentSearch)) {
      skipInitialRef.current = false;
      return;
    }

    if (skipInitialRef.current) {
      skipInitialRef.current = false;
      // URL is source of truth on first mount — never overwrite with default store state.
      if (hasNavigationUrlParams(currentSearch)) {
        return;
      }
    }

    const href = nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname;
    router.replace(href, { scroll: false });
  }, [currentScale, focusEntityId, isTransitioning, pathname, router]);
}
