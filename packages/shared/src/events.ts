import type { AgentStatus } from './types/agent';
import type { Entity, EntityType } from './types/entity';
import type { ScaleLevel } from './types/scale';
import type { ScaleMetrics, WorldStateVariables } from './types/api';

export interface WsMessage<T = unknown> {
  event: string;
  version: 1;
  payload: T;
  timestamp: string;
  requestId?: string;
}

// Client → Server payloads

export interface NavSubscribePayload {
  scale: ScaleLevel;
  focusId?: string;
}

export interface NavUnsubscribePayload {
  scale: ScaleLevel;
}

export interface NavAckPayload {
  tick: number;
}

export interface AgentDialogueClientPayload {
  agentId: string;
  message: string;
  sessionId?: string;
}

export interface SelectEntityPayload {
  entityType: EntityType;
  entityId: string;
}

export interface PingPayload {
  [key: string]: never;
}

// Server → Client payloads

export interface WorldStatePayload {
  tick: number;
  scale: ScaleLevel;
  changes: {
    added: Entity[];
    updated: Partial<Entity>[];
    removed: string[];
  };
}

export interface WorldSnapshotPayload {
  tick: number;
  scale: ScaleLevel;
  entities: Record<string, Entity[]>;
  worldState: WorldStateVariables;
  metrics: ScaleMetrics;
}

export interface AgentStatusPayload {
  agentId: string;
  status: AgentStatus;
  position?: [number, number, number];
  buildingId?: string;
  roomId?: string;
}

export interface AgentDialogueServerPayload {
  sessionId: string;
  agentId: string;
  token?: string;
  toolCall?: {
    id: string;
    name: string;
    input: Record<string, unknown>;
    status: 'pending' | 'running' | 'complete' | 'error';
    result?: unknown;
  };
  done?: boolean;
  error?: string;
}

export interface BuildingMetricsPayload {
  buildingId: string;
  metrics: { throughput: number; errorRate: number; uptime: number };
}

export interface PongPayload {
  serverTime: string;
}

// Discriminated unions for client-side event handling

export type ClientWsEvent =
  | { event: 'nav:subscribe'; payload: NavSubscribePayload }
  | { event: 'nav:unsubscribe'; payload: NavUnsubscribePayload }
  | { event: 'nav:ack'; payload: NavAckPayload }
  | { event: 'agent:dialogue'; payload: AgentDialogueClientPayload }
  | { event: 'select:entity'; payload: SelectEntityPayload }
  | { event: 'ping'; payload: PingPayload };

export type ServerWsEvent =
  | { event: 'world:state'; payload: WorldStatePayload }
  | { event: 'world:snapshot'; payload: WorldSnapshotPayload }
  | { event: 'agent:status'; payload: AgentStatusPayload }
  | { event: 'agent:dialogue'; payload: AgentDialogueServerPayload }
  | { event: 'building:metrics'; payload: BuildingMetricsPayload }
  | { event: 'pong'; payload: PongPayload };
