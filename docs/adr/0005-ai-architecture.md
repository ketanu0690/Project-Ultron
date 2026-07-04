# ADR-0005: AI Architecture

## Status

**Accepted** — 2026-06-14

## Context

ULTRON AI WORLD requires an AI layer that supports:

- Thousands of persistent agents with unique roles
- Stateful multi-step workflows (plan → retrieve → reason → act → store)
- Multi-model routing (cloud + local)
- Memory retrieval across episodic and semantic stores
- Tool execution with safety controls
- Cost management and budget enforcement

## Decision

### Agent Framework: LangGraph

Each agent role has a template graph (state machine):

```
Receive → RetrieveMemory → Reason → ToolCall → Respond → StoreMemory
```

Agent instances are LangGraph graphs parameterized by agent ID, with checkpoints stored in PostgreSQL.

### Model Routing: OpenRouter + Ollama

| Priority | Provider   | Use Case                           |
| -------- | ---------- | ---------------------------------- |
| Primary  | OpenRouter | All inference (multi-model access) |
| Fallback | Ollama     | Timeout, budget exceeded, offline  |

No direct OpenAI/Anthropic API calls — all routed through ModelRouterService.

### Memory: PostgreSQL + pgvector

| Type       | Storage          | Retrieval              |
| ---------- | ---------------- | ---------------------- |
| Short-term | Redis            | Direct read            |
| Episodic   | PostgreSQL       | Recency + agent filter |
| Semantic   | pgvector (1536d) | Cosine similarity      |
| Procedural | PostgreSQL       | Role match             |

### Tool Registry

Capability-based tool access per agent role. All tool calls logged immutably.

### Budget

Tracked in Redis with PostgreSQL audit trail. Degradation to Ollama on budget exceed.

## Alternatives Considered

### A: Raw OpenAI SDK (No Framework)

Direct API calls with manual state management.

**Rejected because**: No stateful workflow support. Manual checkpoint management. Hard to visualize agent flows.

### B: AutoGen / CrewAI

Multi-agent frameworks.

**Rejected because**: Less control over individual agent graphs. LangGraph provides better state management and debugging.

### C: Dedicated Vector DB (Pinecone/Qdrant)

Separate vector database for memory.

**Rejected because**: Operational complexity of second database. pgvector sufficient for MVP scale (< 1M vectors).

### D: Single Model (GPT-4o only)

One model for all agents.

**Rejected because**: Cost prohibitive at scale. Different roles need different capability/cost tradeoffs.

### E: Local-Only (Ollama)

No cloud API dependency.

**Rejected because**: Quality gap too large for reasoning agents. Ollama appropriate as fallback, not primary.

## Consequences

### Positive

- LangGraph provides visualizable, debuggable agent workflows
- OpenRouter gives access to best models via single API
- Ollama fallback ensures uptime and cost control
- pgvector keeps memory in same database as entities
- Role-based graphs ensure consistent agent behavior

### Negative

- LangGraph adds dependency on LangChain ecosystem
- OpenRouter is external dependency with cost
- pgvector may not scale beyond 10M vectors
- Each agent instance consumes memory for LangGraph state
- Model routing adds latency (small, but measurable)

### Mitigations

- Abstract LangGraph behind AgentOrchestrator (swappable)
- Cache frequent inference patterns in Redis
- Plan Qdrant migration path for v2 if pgvector limits hit
- Agent instance pooling for idle agents
- Model routing decision cached per agent role

## References

- `docs/architecture/ai-system.md`
- `docs/world-bible/agents.md`
- `docs/feature-specs/agent-system.md`
- `docs/feature-specs/memory-system.md`
