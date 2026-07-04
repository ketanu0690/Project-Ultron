'use client';

import { ArrowRight, Brain, MessageSquare, X } from 'lucide-react';

import { EntityCard } from '@/components/panels/EntityCard';
import { MemoryTimeline } from '@/components/panels/MemoryTimeline';
import { getEnterNavigation } from '@/lib/navigation-enter';
import { openDialogue } from '@/lib/open-dialogue';
import { getScaleTransitionController } from '@/lib/scale-transition-instance';
import { getEntityDetail } from '@/lib/shell-data';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { useWorldStore } from '@/stores/worldStore';
import { cn } from '@/lib/utils';

export function RightSidebar(): React.JSX.Element | null {
  const isOpen = useUiStore((state) => state.isPanelOpen('rightSidebar'));
  const setPanelOpen = useUiStore((state) => state.setPanelOpen);
  const focusEntityId = useNavigationStore((state) => state.focusEntityId);
  const currentScale = useNavigationStore((state) => state.currentScale);
  const setFocusEntityId = useNavigationStore(
    (state) => state.setFocusEntityId,
  );
  const getAgentUuid = useWorldStore((state) => state.getAgentUuid);
  const entity = getEntityDetail(focusEntityId);
  const enterAction = entity ? getEnterNavigation(currentScale, entity) : null;
  const showMemoryTimeline =
    entity?.type === 'agent' && currentScale === 'memory';

  const handleClose = (): void => {
    setFocusEntityId(null);
    setPanelOpen('rightSidebar', false);
  };

  const handleEnter = (): void => {
    if (!enterAction) {
      return;
    }
    if (enterAction.targetScale) {
      getScaleTransitionController().transitionTo(enterAction.targetScale);
    }
    setFocusEntityId(enterAction.focusId);
  };

  const handleTalk = (): void => {
    if (!entity || entity.type !== 'agent') {
      return;
    }
    const agentRef = getAgentUuid(entity.id) ?? entity.id;
    openDialogue(agentRef);
  };

  const handleViewMemory = (): void => {
    getScaleTransitionController().transitionTo('memory');
    if (entity) {
      setFocusEntityId(entity.id);
    }
  };

  if (!isOpen || !entity) {
    return null;
  }

  return (
    <aside className="border-steel-blue/60 bg-space-dark/90 flex w-[320px] shrink-0 flex-col border-l backdrop-blur-md">
      <div className="border-steel-blue/40 flex items-center justify-between border-b px-4 py-3">
        <p className="font-display text-signal-cyan text-xs tracking-wide">
          ENTITY DETAIL
        </p>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={handleClose}
          className="text-text-secondary hover:bg-steel-blue/50 hover:text-text-primary rounded p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <EntityCard entity={entity} />

        {showMemoryTimeline && entity.type === 'agent' ? (
          <MemoryTimeline agentSlug={entity.id} />
        ) : null}

        <div className="space-y-2">
          {enterAction ? (
            <button
              type="button"
              onClick={handleEnter}
              className={cn(
                'border-signal-cyan/40 flex w-full items-center justify-center gap-2 rounded-md border',
                'bg-signal-cyan/10 text-signal-cyan px-3 py-2 text-sm font-medium',
                'hover:bg-signal-cyan/20 transition-colors',
              )}
            >
              <ArrowRight className="h-4 w-4" />
              Enter
            </button>
          ) : null}

          {entity.canTalk ? (
            <button
              type="button"
              onClick={handleTalk}
              className={cn(
                'border-steel-blue/60 flex w-full items-center justify-center gap-2 rounded-md border',
                'bg-steel-blue/30 text-text-primary px-3 py-2 text-sm font-medium',
                'hover:bg-steel-blue/50 transition-colors',
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Talk
            </button>
          ) : null}

          {entity.canViewMemory && currentScale !== 'memory' ? (
            <button
              type="button"
              onClick={handleViewMemory}
              className={cn(
                'border-signal-purple/40 flex w-full items-center justify-center gap-2 rounded-md border',
                'bg-signal-purple/10 text-signal-purple px-3 py-2 text-sm font-medium',
                'hover:bg-signal-purple/20 transition-colors',
              )}
            >
              <Brain className="h-4 w-4" />
              View Memory
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
