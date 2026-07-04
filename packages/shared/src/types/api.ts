import type { ScaleLevel } from './scale';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    scale?: ScaleLevel;
  };
  timestamp: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface WorldStateVariables {
  planetaryHealth: number;
  cityProsperity: number;
  agentMorale: number;
  defenseReadiness: number;
  knowledgeIndex: number;
  innovationRate: number;
}

export interface ScaleMetrics {
  entityCount: number;
  activeAgents: number;
}
