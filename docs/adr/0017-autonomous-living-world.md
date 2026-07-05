# ADR-0017: Autonomous Living World (Agent Behavior Loop)

## Status

**Accepted** — 2026-07-04

## Context

[Proposal 0003](../proposals/0003-autonomous-living-world.md) is **Approved** (2026-07-04). AI Town demonstrates a living world where agents autonomously wander, converse with each other, write episodic memory, reflect into semantic beliefs, and recall via vector search — all stepped by a server-side engine.

Project Ultron shares the substrate (3D world, persistent agents, dialogue, pgvector memory column, WebSocket gateway, `ModelRouterService`) but until now lacked the generative-agents loop. `AgentOrchestratorService` was a single-node stub; semantic search and reflection were deferred.

The product direction aligns with Ultron's spatial civilization vision. This ADR extends ADR-0005 (LangGraph) and ADR-0013 (simulation phasing) without replacing them.

## Decision

### Phased Delivery

| Phase | Scope                                                                                                                                          | Ships   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| **1** | Real LangGraph dialogue graph; memory write after user dialogue; reflection job; `POST /agents/:id/memory/search`; LangGraph checkpoint tables | v1      |
| **2** | Agent-behavior tick (10 s); server-authoritative movement; `agent:status` broadcast                                                            | v1      |
| **3** | Spontaneous agent ↔ agent conversations; relationship accumulation                                                                             | v1 → v2 |
| **4** | 3D conversation bubbles; relationship sidebar; memory graph hooks                                                                              | v2      |

### MVP Exclusion (ADR-0013)

**No change to MVP scope:**

- Static world state from seed data
- User-triggered dialogue only
- No simulation tick cron job
- No background agent inference
- No agent-behavior tick

Phases 1–3 ship during **v1**, after MVP (M2) polish completes.

### Phase 1: User-Triggered Intelligence

Replace the orchestrator stub with a real LangGraph graph for **user ↔ agent** dialogue:

```
Receive → RetrieveMemory → Respond → StoreMemory
```

- **RetrieveMemory** — episodic recency + pgvector semantic similarity per `ai-system.md`
- **Respond** — streamed via `ModelRouterService` with retrieved context injected
- **StoreMemory** — episodic memory + embedding after each completed dialogue turn
- **Reflect** — periodic synthesis of episodic memories into semantic memories (every 10 episodic memories per agent)

Activate `POST /api/v1/agents/:id/memory/search` using the existing pgvector `embedding` column. Store LangGraph checkpoints in PostgreSQL via `PostgresSaver`.

### Dual-Tick Simulation (Phase 2+)

- **Macro tick** (60 s): world-state variables per `simulation-system.md` — unchanged
- **Behavior tick** (10 s v1, 5 s v2): per-agent autonomy loop — new at Phase 2

### Autonomy Loop (Phase 2–3)

LangGraph graph per agent role:

```
Perceive → RecallMemory → Decide → (Move | StartConversation | Idle) → StoreMemory
Periodic Reflect synthesizes semantic memories.
```

### Agent-to-Agent Conversation (Phase 3)

- Separate WebSocket event `agent:conversation` (not `agent:dialogue`)
- Alternating turns; both participants write episodic memory
- Max 3 simultaneous conversations (v1)

### Server Authority

- Agent positions updated server-side only (Phase 2+)
- Client interpolates via `agent:status` broadcasts
- Viewport agents: full behavior tick; off-viewport: reduced rate per agent tier

### Budget

Enforce `ai-system.md` token limits. Pause autonomy on budget exceed (Phase 2+). Phase 1 inference is user-triggered only.

### Feature Flags

| Flag                   | Default | Phase |
| ---------------------- | ------- | ----- |
| `AUTONOMY_ENABLED`     | `false` | 2+    |
| `AGENT_SOCIAL_ENABLED` | `false` | 3     |

## Alternatives Considered

| Option                                 | Why rejected                                        |
| -------------------------------------- | --------------------------------------------------- |
| Keep static agents, user-only dialogue | Does not move toward living-world goal              |
| Fork AI Town (Convex + PixiJS)         | Violates ADR-0002, ADR-0003, ADR-0010, ADR-0012     |
| Client-side agent AI                   | Forbidden — security, budget control                |
| Single 60 s tick for macro + behavior  | Too slow for wandering/conversation feel            |
| CrewAI / AutoGen                       | ADR-0005 chose LangGraph                            |
| Autonomy at MVP                        | ADR-0013 defers simulation; MVP polish first        |
| Add `position` column on `Agent`       | Acceptable for v1 (50–500 agents); revisit at 5,000 |

## Consequences

- Extends ADR-0005 (LangGraph) and ADR-0013 (simulation phasing); no supersession
- Phase 1 requires LangGraph checkpoint migration; no agent position migration yet
- `feature-specs/agent-system.md`, `memory-system.md`, and `simulation-system.md` updated when phases ship
- `canonical-numbers.md` gains behavior-tick and autonomy caps at Phase 2
- Background inference remains OFF until Phase 2 (`current-state/scope.md` unchanged at MVP)

## References

- [Proposal 0003](../proposals/0003-autonomous-living-world.md) — Approved 2026-07-04
- [ADR-0005](./0005-ai-architecture.md) — AI Architecture
- [ADR-0013](./0013-simulation-vs-governance-phasing.md) — Simulation vs Governance Phasing
- AI Town: https://github.com/a16z-infra/ai-town
