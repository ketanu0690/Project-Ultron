'use client';

import { useEffect, useState } from 'react';
import type { AgentMemory } from '@ultron/shared';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { fetchAgentMemories } from '@/lib/api-endpoints';
import { useWorldStore } from '@/stores/worldStore';
import { cn } from '@/lib/utils';

interface MemoryTimelineProps {
  readonly agentSlug: string;
}

function formatMemoryType(type: AgentMemory['type']): string {
  return type.replace('_', ' ');
}

export function MemoryTimeline({
  agentSlug,
}: MemoryTimelineProps): React.JSX.Element {
  const cached = useWorldStore((state) => state.memoriesByAgentSlug[agentSlug]);
  const setAgentMemories = useWorldStore((state) => state.setAgentMemories);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) {
      return;
    }

    let cancelled = false;

    async function load(): Promise<void> {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAgentMemories(agentSlug);
        if (!cancelled) {
          setAgentMemories(agentSlug, response.data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load memories',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [agentSlug, cached, setAgentMemories]);

  const memories = cached ?? [];

  if (isLoading) {
    return (
      <p className="text-text-secondary text-xs">Loading memory timeline…</p>
    );
  }

  if (error) {
    return <p className="text-signal-red text-xs">{error}</p>;
  }

  if (memories.length === 0) {
    return (
      <p className="text-text-secondary text-xs">
        No memories recorded for this agent.
      </p>
    );
  }

  return (
    <GlassPanel className="p-3">
      <p className="font-display text-signal-purple mb-3 text-xs tracking-wide">
        MEMORY TIMELINE
      </p>
      <ul className="space-y-2">
        {memories.map((memory) => {
          const isExpanded = expandedId === memory.id;
          return (
            <li
              key={memory.id}
              className="border-steel-blue/40 bg-void-black/40 rounded border"
            >
              <button
                type="button"
                onClick={() => {
                  setExpandedId(isExpanded ? null : memory.id);
                }}
                className="flex w-full items-start gap-2 px-3 py-2 text-left"
              >
                {isExpanded ? (
                  <ChevronDown className="text-signal-cyan mt-0.5 h-3 w-3 shrink-0" />
                ) : (
                  <ChevronRight className="text-text-tertiary mt-0.5 h-3 w-3 shrink-0" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="text-text-primary block text-xs font-medium">
                    {formatMemoryType(memory.type)}
                  </span>
                  <span className="text-text-tertiary block text-[10px]">
                    {new Date(memory.createdAt).toLocaleString()}
                  </span>
                </span>
              </button>
              {isExpanded ? (
                <p
                  className={cn(
                    'border-steel-blue/30 border-t px-3 py-2 text-xs leading-relaxed',
                    'text-text-secondary',
                  )}
                >
                  {memory.content}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}
