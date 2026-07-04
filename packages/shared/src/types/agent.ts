export type AgentStatus =
  | 'idle'
  | 'thinking'
  | 'acting'
  | 'learning'
  | 'migrating'
  | 'offline'
  | 'error';

export const AGENT_STATUSES: readonly AgentStatus[] = [
  'idle',
  'thinking',
  'acting',
  'learning',
  'migrating',
  'offline',
  'error',
] as const;

/** MVP Reasoning District roles (canonical-numbers.md). */
export type AgentRole = 'planner' | 'simulator' | 'debater' | 'verifier';

export const MVP_AGENT_ROLES: readonly AgentRole[] = [
  'planner',
  'simulator',
  'debater',
  'verifier',
] as const;

export const REASONING_AGENT_ROLE_COUNTS: Readonly<Record<AgentRole, number>> =
  {
    planner: 20,
    simulator: 10,
    debater: 10,
    verifier: 10,
  };

export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: AgentRole;
  homeDistrictId: string;
  homeBuildingId: string;
  homeRoomId?: string | null;
  model: string;
  version: string;
  status: AgentStatus;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
