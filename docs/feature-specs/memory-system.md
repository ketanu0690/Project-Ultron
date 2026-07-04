# Feature Spec: Memory System

## Purpose

Store, retrieve, and visualize agent memories — from timeline lists (MVP) to 3D knowledge graphs (v2).

## Scope: MVP (timeline), v2 (graph)

## Requirements

### MVP: Memory Timeline

- [ ] List agent memories chronologically
- [ ] Memory types: episodic, semantic
- [ ] Click memory → expand content
- [ ] Memory count and stats in agent profile
- [ ] New memories created after each dialogue

### v2: Memory Graph

- [ ] 3D force-directed knowledge graph
- [ ] Nodes = memories, edges = relationships
- [ ] Node size by importance/recency
- [ ] Click node → memory detail
- [ ] Filter by type, date range
- [ ] Semantic search with vector similarity
- [ ] Graph navigation (pan, zoom, orbit)

## Data Model

```typescript
interface AgentMemory {
  id: string;
  agentId: string;
  type: 'short_term' | 'episodic' | 'semantic' | 'procedural';
  content: string;
  embedding: number[]; // 1536 dimensions
  metadata: {
    source?: string;
    confidence?: number;
    relatedEntities?: string[];
    tags?: string[];
  };
  createdAt: ISO8601;
  expiresAt?: ISO8601;
}
```

## API Endpoints

```
GET /api/v1/agents/:id/memory
GET /api/v1/agents/:id/memory/:memoryId
POST /api/v1/agents/:id/memory/search
GET /api/v1/agents/:id/memory/graph    # v2
```

## Scene Components

```
scenes/memory/
├── MemoryTimeline.tsx     # MVP: list view
├── MemoryGraph.tsx        # v2: 3D graph
├── MemoryNode.tsx         # v2: graph node
├── MemoryEdge.tsx         # v2: graph edge
└── MemoryDetail.tsx       # Detail panel
```

## Implementation Steps

### MVP

1. Create `MemoryService` with PostgreSQL storage
2. Add `agent_memories` table with pgvector column
3. Implement `EmbeddingService` (OpenRouter text-embedding-3-small)
4. Store episodic memory after each dialogue session
5. Build `MemoryTimeline` React component
6. Wire "View Memory" button on agent profile

### v2

7. Implement vector similarity search
8. Build force-directed graph layout algorithm
9. Create `MemoryGraph` Three.js scene
10. Render nodes as spheres, edges as lines
11. Add semantic search with natural language input
12. Implement graph filtering and navigation

## Acceptance Criteria

- [ ] Agent memories persist across sessions
- [ ] Timeline shows chronological memory list
- [ ] New dialogue creates episodic memory
- [ ] (v2) Graph renders 10K nodes at ≥ 30 FPS
- [ ] (v2) Semantic search returns relevant memories
