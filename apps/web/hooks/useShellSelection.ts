'use client';

import { useEffect } from 'react';

import { getEntityDetail } from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';

const SIDEBAR_ENTITY_TYPES = new Set(['district', 'building', 'room', 'agent']);

export function useShellSelection(): void {
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const setPanelOpen = useUiStore((state) => state.setPanelOpen);

  useEffect(() => {
    const entity = getEntityDetail(focusEntityId);
    const shouldOpen =
      entity !== null &&
      SIDEBAR_ENTITY_TYPES.has(entity.type) &&
      focusEntityId !== null;

    setPanelOpen('rightSidebar', shouldOpen);
  }, [focusEntityId, setPanelOpen]);
}
