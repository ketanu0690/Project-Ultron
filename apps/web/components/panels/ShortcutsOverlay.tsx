'use client';

import { X } from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { useUiStore } from '@/stores/uiStore';

const SHORTCUTS = [
  { keys: 'Tab', action: 'Toggle left navigation sidebar' },
  { keys: 'Escape', action: 'Deselect entity / close panels' },
  { keys: '?', action: 'Show this shortcuts overlay' },
  {
    keys: 'Scroll wheel',
    action: 'Zoom galaxy/earth; reach galactic core to travel to Earth',
  },
  { keys: 'G', action: 'Return to galaxy view (from any scale)' },
  { keys: 'Shift + 1', action: 'Return to galaxy view (from any scale)' },
  { keys: 'Click district', action: 'Enter district from megacity' },
  { keys: 'Double-click Sol', action: 'Enter solar system from galaxy (stub)' },
] as const;

export function ShortcutsOverlay(): React.JSX.Element | null {
  const isOpen = useUiStore((state) => state.isPanelOpen('shortcuts'));
  const setPanelOpen = useUiStore((state) => state.setPanelOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-void-black/70 absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-md p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-signal-cyan text-sm">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            aria-label="Close shortcuts"
            onClick={() => {
              setPanelOpen('shortcuts', false);
            }}
            className="text-text-secondary hover:bg-steel-blue/50 hover:text-text-primary rounded p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.keys}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <kbd className="border-steel-blue/60 bg-void-black/60 text-signal-cyan rounded border px-2 py-1 font-mono">
                {shortcut.keys}
              </kbd>
              <span className="text-text-secondary text-right">
                {shortcut.action}
              </span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
