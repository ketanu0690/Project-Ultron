import { Injectable } from '@nestjs/common';
import type {
  AgentStatusPayload,
  Entity,
  ScaleLevel,
  WorldStatePayload,
} from '@ultron/shared';

import { WorldGateway } from '../realtime/world.gateway';

@Injectable()
export class WorldBroadcastService {
  private tick = 0;
  private pendingAgentUpdates = new Map<string, AgentStatusPayload>();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly gateway: WorldGateway) {}

  queueAgentUpdates(updates: AgentStatusPayload[]): void {
    for (const update of updates) {
      this.pendingAgentUpdates.set(update.agentId, update);
    }
    this.scheduleFlush();
  }

  flushWorldState(scale: ScaleLevel = 'agent'): void {
    if (this.pendingAgentUpdates.size === 0) {
      return;
    }

    this.tick += 1;
    const updated: Partial<Entity>[] = [];

    for (const payload of this.pendingAgentUpdates.values()) {
      updated.push({
        id: payload.agentId,
        type: 'agent',
        name: payload.agentId,
        position: payload.position,
        metadata: {
          status: payload.status,
          rotationY: payload.rotationY,
          buildingId: payload.buildingId,
          roomId: payload.roomId,
        },
      });
    }

    const worldPayload: WorldStatePayload = {
      tick: this.tick,
      scale,
      changes: {
        added: [],
        updated,
        removed: [],
      },
    };

    this.gateway.broadcast('world:state', worldPayload);
    this.pendingAgentUpdates.clear();
  }

  broadcast(event: string, payload: unknown): void {
    this.gateway.broadcast(event, payload);
  }

  private scheduleFlush(): void {
    if (this.flushTimer) {
      return;
    }
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flushWorldState('agent');
    }, 100);
  }
}
