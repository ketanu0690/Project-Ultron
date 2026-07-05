export type MemoryType = 'short_term' | 'episodic' | 'semantic' | 'procedural';

export const MEMORY_TYPES: readonly MemoryType[] = [
  'short_term',
  'episodic',
  'semantic',
  'procedural',
] as const;

export interface AgentMemoryMetadata {
  source?: string;
  confidence?: number;
  relatedEntities?: string[];
  tags?: string[];
}

export interface AgentMemory {
  id: string;
  agentId: string;
  type: MemoryType;
  content: string;
  metadata: AgentMemoryMetadata;
  createdAt: string;
  expiresAt?: string | null;
  deletedAt?: string | null;
}

export interface MemorySearchRequest {
  query: string;
  limit?: number;
}

export interface MemorySearchResult {
  id: string;
  agentId: string;
  type: MemoryType;
  content: string;
  similarity: number;
  metadata: AgentMemoryMetadata;
  createdAt: string;
}
