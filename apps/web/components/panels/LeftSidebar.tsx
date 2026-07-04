'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScaleLevel } from '@ultron/shared';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import {
  COSMIC_NAV_NODES,
  NAV_HIERARCHY,
  type HierarchyNode,
} from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { useWorldStore } from '@/stores/worldStore';
import { cn } from '@/lib/utils';

const AUTO_COLLAPSE_MS = 10_000;

interface TreeItemProps {
  readonly node: HierarchyNode;
  readonly depth: number;
  readonly expandedIds: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onNavigate: (node: HierarchyNode) => void;
  readonly activeEntityId: string | null;
  readonly activeScale: ScaleLevel;
}

function TreeItem({
  node,
  depth,
  expandedIds,
  onToggle,
  onNavigate,
  activeEntityId,
  activeScale,
}: TreeItemProps): React.JSX.Element {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expandedIds.has(node.id);
  const isActive =
    activeEntityId === node.entityId ||
    activeEntityId === node.id ||
    (activeScale === node.scale && !node.entityId && activeEntityId === null);

  return (
    <li>
      <div
        className="flex items-center"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            onClick={() => {
              onToggle(node.id);
            }}
            className="text-text-tertiary hover:text-signal-cyan rounded p-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" aria-hidden />
        )}
        <button
          type="button"
          onClick={() => {
            onNavigate(node);
          }}
          className={cn(
            'min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-xs transition-colors',
            isActive
              ? 'bg-signal-cyan/10 text-signal-cyan'
              : 'text-text-secondary hover:bg-steel-blue/40 hover:text-text-primary',
          )}
        >
          {node.label}
        </button>
      </div>

      {hasChildren && isExpanded ? (
        <ul>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
              activeEntityId={activeEntityId}
              activeScale={activeScale}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function LeftSidebar(): React.JSX.Element | null {
  const isOpen = useUiStore((state) => state.isPanelOpen('leftSidebar'));
  const setPanelOpen = useUiStore((state) => state.setPanelOpen);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const currentScale = useNavigationStore((state) => state.currentScale);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );
  const apiHierarchy = useWorldStore((state) => state.hierarchy);
  const cityHierarchy =
    apiHierarchy.length > 0 ? apiHierarchy : NAV_HIERARCHY.slice(2);
  const hierarchy: readonly HierarchyNode[] = [
    ...COSMIC_NAV_NODES,
    ...cityHierarchy,
  ];
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () =>
      new Set([
        'galaxy',
        'megacity',
        'district-reasoning',
        'building-planning-tower',
      ]),
  );
  const collapseTimerRef = useRef<number | null>(null);

  const resetAutoCollapse = useCallback(() => {
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
    }
    collapseTimerRef.current = window.setTimeout(() => {
      setPanelOpen('leftSidebar', false);
    }, AUTO_COLLAPSE_MS);
  }, [setPanelOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
      return;
    }

    resetAutoCollapse();
    return () => {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
      }
    };
  }, [isOpen, resetAutoCollapse]);

  const handleToggle = (id: string): void => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    resetAutoCollapse();
  };

  const handleNavigate = (node: HierarchyNode): void => {
    const targetScale: ScaleLevel = node.scale;
    getScaleTransitionController().transitionTo(targetScale);
    setFocusEntityId(node.entityId ?? null);
    resetAutoCollapse();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className="border-steel-blue/60 bg-space-dark/90 flex w-[280px] shrink-0 flex-col border-r backdrop-blur-md"
      onMouseMove={resetAutoCollapse}
      onFocus={resetAutoCollapse}
    >
      <GlassPanel className="bg-void-black/40 m-3 flex-1 overflow-y-auto border-0 p-2">
        <ul>
          {hierarchy.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              depth={0}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onNavigate={handleNavigate}
              activeEntityId={focusEntityId}
              activeScale={currentScale}
            />
          ))}
        </ul>
      </GlassPanel>
    </aside>
  );
}
