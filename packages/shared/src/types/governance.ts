export type PolicyDomain =
  'agent' | 'model' | 'resource' | 'defense' | 'movement';

export const POLICY_DOMAINS: readonly PolicyDomain[] = [
  'agent',
  'model',
  'resource',
  'defense',
  'movement',
] as const;

export interface GovernancePolicy {
  id: string;
  slug: string;
  domain: PolicyDomain;
  name: string;
  rules: Record<string, unknown>;
  version: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationEventRecord {
  id: string;
  type: string;
  severity: string;
  data: Record<string, unknown>;
  tickId?: number | null;
  createdAt: string;
}
