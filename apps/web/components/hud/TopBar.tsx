'use client';

import { Menu, Search, Settings } from 'lucide-react';

import { BreadcrumbNav } from '@/components/hud/Breadcrumb';
import { getScaleBadgeLabel } from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function TopBar(): React.JSX.Element {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const breadcrumbs = useNavigationStore((state) => state.breadcrumbs);
  const togglePanel = useUiStore((state) => state.togglePanel);
  const leftSidebarOpen = useUiStore((state) =>
    state.isPanelOpen('leftSidebar'),
  );

  const scaleBadge = getScaleBadgeLabel(currentScale, focusEntityId);

  return (
    <header className="border-steel-blue/60 bg-space-dark/90 flex h-12 shrink-0 items-center gap-3 border-b px-3 backdrop-blur-md">
      <button
        type="button"
        aria-label={leftSidebarOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={leftSidebarOpen}
        onClick={() => {
          togglePanel('leftSidebar');
        }}
        className="text-text-secondary hover:bg-steel-blue/50 hover:text-signal-cyan rounded p-1.5 transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0">
          <p className="font-display text-signal-cyan text-xs font-semibold tracking-wider">
            ULTRON
          </p>
          <p className="text-text-tertiary text-[10px]">AI WORLD</p>
        </div>
        <div
          className="bg-steel-blue/80 hidden h-6 w-px sm:block"
          aria-hidden
        />
        <BreadcrumbNav
          crumbs={breadcrumbs}
          className="hidden min-w-0 sm:flex"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan hidden rounded border px-2 py-0.5 font-mono text-[10px] tracking-wide md:inline">
          {scaleBadge}
        </span>

        <div className="relative hidden md:block">
          <Search className="text-text-tertiary pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="search"
            disabled
            placeholder="Search entities..."
            title="Search available in v1"
            aria-label="Search entities (coming in v1)"
            className="border-steel-blue/60 bg-void-black/60 text-text-tertiary placeholder:text-text-tertiary/70 h-8 w-44 rounded-md border pl-8 pr-3 text-xs"
          />
        </div>

        <button
          type="button"
          aria-label="Settings"
          title="Settings (coming soon)"
          className={cn(
            'text-text-secondary rounded p-1.5 transition-colors',
            'hover:bg-steel-blue/50 hover:text-text-primary',
          )}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
