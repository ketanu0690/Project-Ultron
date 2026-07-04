'use client';

import { useEffect } from 'react';

import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function useShellKeyboard(): void {
  const togglePanel = useUiStore((state) => state.togglePanel);
  const setPanelOpen = useUiStore((state) => state.setPanelOpen);
  const closeDialogue = useUiStore((state) => state.closeDialogue);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        togglePanel('leftSidebar');
        return;
      }

      if (event.key === 'Escape') {
        setFocusEntityId(null);
        setPanelOpen('rightSidebar', false);
        closeDialogue();
        setPanelOpen('shortcuts', false);
        return;
      }

      if (event.key === '?') {
        event.preventDefault();
        togglePanel('shortcuts');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDialogue, setFocusEntityId, setPanelOpen, togglePanel]);
}
