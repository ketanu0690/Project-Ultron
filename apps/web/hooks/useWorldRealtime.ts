'use client';

import type { AgentStatus } from '@ultron/shared';
import { useEffect } from 'react';

import { getAgentInterpolator } from '@/controllers/AgentInterpolator';
import { WorldRealtimeSocket } from '@/lib/world-realtime-socket';
import { useAgentStore } from '@/stores/agentStore';
import { useWorldStore } from '@/stores/worldStore';

function asAgentStatus(value: unknown): AgentStatus {
  if (
    value === 'idle' ||
    value === 'thinking' ||
    value === 'acting' ||
    value === 'learning' ||
    value === 'migrating' ||
    value === 'offline' ||
    value === 'error'
  ) {
    return value;
  }
  return 'idle';
}

export function useWorldRealtime(): void {
  const isHydrated = useWorldStore((state) => state.isHydrated);
  const applyAgentServerUpdate = useWorldStore(
    (state) => state.applyAgentServerUpdate,
  );
  const setSimulationState = useWorldStore((state) => state.setSimulationState);
  const setGovernancePolicies = useWorldStore(
    (state) => state.setGovernancePolicies,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const agents = useWorldStore.getState().agents;
    const interpolator = getAgentInterpolator();
    for (const agent of Object.values(agents)) {
      interpolator.syncFromAgent(
        agent.slug,
        agent.id,
        agent.position,
        agent.rotationY,
        agent.status,
      );
    }

    const socket = new WorldRealtimeSocket({
      onEvent: (event) => {
        if (event.event === 'agent:status') {
          applyAgentServerUpdate(event.payload);
          interpolator.applyServerUpdate(
            event.payload.agentId,
            undefined,
            event.payload.position ?? [0, 0, 0],
            event.payload.rotationY ?? 0,
            event.payload.status,
          );
          if (event.payload.status === 'thinking') {
            useAgentStore.getState().setAgentThinking(event.payload.agentId);
          }
        }

        if (event.event === 'world:state') {
          for (const entity of event.payload.changes.updated) {
            if (entity.type !== 'agent' || !entity.position || !entity.id) {
              continue;
            }
            const agentId = entity.id;
            const metadata = entity.metadata ?? {};
            const status = asAgentStatus(metadata.status);
            applyAgentServerUpdate({
              agentId,
              status,
              position: entity.position,
              rotationY:
                typeof metadata.rotationY === 'number' ? metadata.rotationY : 0,
            });
            interpolator.applyServerUpdate(
              agentId,
              undefined,
              entity.position,
              typeof metadata.rotationY === 'number' ? metadata.rotationY : 0,
              status,
            );
          }
        }

        if (event.event === 'simulation:tick') {
          setSimulationState(event.payload.worldState, event.payload.tickId);
        }

        if (event.event === 'governance:policy') {
          void fetch('/api/v1/governance/policies')
            .then((response) => response.json())
            .then((body: { data?: unknown }) => {
              if (Array.isArray(body.data)) {
                setGovernancePolicies(
                  body.data as Parameters<typeof setGovernancePolicies>[0],
                );
              }
            })
            .catch(() => undefined);
        }
      },
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [
    applyAgentServerUpdate,
    isHydrated,
    setGovernancePolicies,
    setSimulationState,
  ]);
}
