# Agent Flow Diagram — ULTRON AI WORLD

> End-to-end lifecycle of AI agents: orchestration, LangGraph state machines, Model Router inference, memory retrieval, tool execution, and client visualization paths.

---

## Agent System Scope by Phase

| Phase   | Agents (DB) | Concurrent LangGraph | Districts         | Key flows                                     |
| ------- | ----------- | -------------------- | ----------------- | --------------------------------------------- |
| **MVP** | 50          | ≤ 10                 | Reasoning only    | Dialogue, memory store, streaming WS          |
| **v1**  | 500         | ≤ 50                 | All 5             | + delegation, movement, simulation background |
| **v2**  | 5,000       | ≤ 200                | All 5 + swarm LOD | + debate, reputation, pooled workers          |

Canonical source: [`docs/canonical-numbers.md`](../docs/canonical-numbers.md)

---

## Agent Architecture Overview

```mermaid
flowchart TB
    subgraph User["User"]
        U[Explorer]
        UI[Dialogue Panel / Scene]
    end

    subgraph Frontend
        WS_C[useWorldSocket]
        AS[agentStore]
        SG[AgentNode / HologramAvatar]
    end

    subgraph Backend
        GW[World Gateway]
        ORCH[Agent Orchestrator]
        LG[LangGraph Runtime]
        MR[Model Router]
        RET[Memory Retriever]
        TR[Tool Registry]
        TC[Tool Executor]
    end

    subgraph Data
        PG[(PostgreSQL)]
        VEC[(pgvector)]
        RD[(Redis)]
    end

    subgraph External
        OR[OpenRouter]
        OL[Ollama]
        EXT[External APIs]
    end

    U --> UI
    UI --> WS_C
    WS_C --> GW
    GW --> ORCH
    ORCH --> LG
    LG --> MR
    LG --> RET
    LG --> TR
    TR --> TC
    MR --> OR
    MR --> OL
    TC --> EXT
    RET --> VEC
    RET --> PG
    LG --> PG
    ORCH --> RD
    GW --> WS_C
    WS_C --> AS
    AS --> UI
    AS --> SG
```

---

## Agent Lifecycle State Machine

Server-side agent **status** (distinct from LangGraph internal state):

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> thinking : dialogue started
    thinking --> acting : tool call invoked
    acting --> thinking : tool result
    thinking --> idle : response complete
    idle --> migrating : v1 movement
    migrating --> idle : arrived at room
    idle --> learning : training job v1+
    learning --> idle : training complete
    idle --> offline : decommission
    thinking --> error : inference failure
    error --> idle : recovery / timeout
```

Client receives transitions via `agent:status` WebSocket events → particle effects on `HologramAvatar`.

---

## LangGraph Workflow (Per Dialogue Turn)

```mermaid
stateDiagram-v2
    [*] --> Receive
    Receive --> RetrieveMemory : message received
    RetrieveMemory --> Reason : context loaded
    Reason --> ToolCall : tool needed
    Reason --> Respond : answer ready
    ToolCall --> ExecuteTool
    ExecuteTool --> Reason : result returned
    Respond --> StoreMemory
    StoreMemory --> [*]
```

### Role-specific graph variants

| Role         | District         | Unique nodes                               |
| ------------ | ---------------- | ------------------------------------------ |
| `planner`    | Reasoning        | `decompose`, `prioritize`, `validate_plan` |
| `classifier` | Perception       | `classify`, `route`, `filter`              |
| `archivist`  | Memory           | `index`, `deduplicate`, `link`             |
| `executor`   | Action           | `select_tool`, `execute`, `verify`         |
| `trainer`    | Self Improvement | `prepare_data`, `train`, `evaluate`        |
| `debater`    | Reasoning (v2)   | `argue`, `counter`, `synthesize`           |

MVP agent roles (all Reasoning): planner 20, simulator 10, debater 10, verifier 10.

---

## Complete Dialogue Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant UI as Dialogue Panel
    participant WS as WebSocket Client
    participant GW as World Gateway
    participant ORCH as Agent Orchestrator
    participant MEM as Memory Service
    participant LG as LangGraph
    participant RET as Retriever
    participant MR as Model Router
    participant OR as OpenRouter
    participant PG as PostgreSQL

    U->>UI: Type message
    UI->>WS: agent:dialogue {agentId, message}
    WS->>GW: forward event
    GW->>ORCH: createDialogueSession(agentId)

    ORCH->>MEM: loadAgentMemory(agentId)
    MEM->>PG: recent episodes
    PG-->>MEM: episodic memories

    ORCH->>LG: invokeGraph(state, message)
    LG->>RET: retrieve(agentId, query)
    RET->>PG: vector similarity + recency
    PG-->>RET: semantic + episodic context
    RET-->>LG: merged contextMemories

    LG->>MR: streamCompletion(model, prompt)
    MR->>MR: check Redis budget
    MR->>OR: HTTPS streaming request

    loop Token stream
        OR-->>MR: token chunk
        MR-->>LG: token
        LG-->>ORCH: partial response
        ORCH-->>GW: agent:dialogue {sessionId, token}
        GW-->>WS: push
        WS-->>UI: append streaming text
    end

    opt Tool call required
        LG-->>ORCH: toolCall {name, input}
        ORCH-->>GW: agent:dialogue {toolCall, status: running}
        GW-->>UI: inline tool card
        ORCH->>ORCH: ToolExecutor (permission + sandbox)
        ORCH-->>GW: agent:dialogue {toolResult}
    end

    LG->>MEM: storeEpisode(agentId, dialogue)
    MEM->>PG: dialogue_messages + agent_memories
    MEM->>PG: embedding via async queue

    ORCH-->>GW: agent:dialogue {done: true}
    GW-->>WS: finalize
    WS-->>UI: enable input
    ORCH-->>GW: agent:status {idle}
```

**Latency target**: P95 first token < 2 s (MVP), < 3 s mobile.

---

## Model Router Decision Flow

All inference passes through Model Router — no bypass paths.

```mermaid
flowchart TD
    REQ[Inference Request] --> MR[Model Router]
    MR --> POL{Governance policy<br/>model restriction?}
    POL -->|yes| POL_MODEL[Policy-specified model]
    POL -->|no| BUDGET{Token budget OK?}
    BUDGET -->|no| FB[Ollama smallest model]
    BUDGET -->|yes| SEL[Select model by role/task]
    SEL --> PROV{Provider}
    PROV -->|primary| OR[OpenRouter]
    OR -->|success| RES[Stream response]
    OR -->|timeout > 30s or error| OL[Ollama fallback]
    PROV -->|training job| GPU[Ollama GPU instance]
    OL -->|success| RES
    OL -->|failure| ERR[504 AI timeout → client fallback message]
    FB --> RES
    POL_MODEL --> OR
```

### MVP model routing

| Use case            | Primary                          | Fallback            |
| ------------------- | -------------------------------- | ------------------- |
| Reasoning, planning | `claude-sonnet-4` via OpenRouter | `llama3:70b` Ollama |
| General dialogue    | `gpt-4o`                         | `llama3:70b`        |
| Classification      | `gpt-4o-mini`                    | `llama3:8b`         |
| Embeddings          | `text-embedding-3-small`         | —                   |

---

## Memory Retrieval Pipeline

```mermaid
flowchart LR
    QUERY[User message] --> EMB_Q[Embed query]
    EMB_Q --> OR_E[OpenRouter embedding]
    OR_E --> VEC_Q[Query vector 1536-dim]

    VEC_Q --> SIM[pgvector top 5 semantic]
    QUERY --> REC[PostgreSQL last 10 episodic]
    QUERY --> PROC[Procedural role match]

    SIM --> MERGE[Weighted merge]
    REC --> MERGE
    PROC --> MERGE

    MERGE --> CTX[Context window → LangGraph Reason node]
```

| Memory type | Weight | Storage                         |
| ----------- | ------ | ------------------------------- |
| Semantic    | 0.5    | `agent_memories.embedding` HNSW |
| Episodic    | 0.3    | `dialogue_messages` recency     |
| Procedural  | 0.2    | Agent role capabilities         |

Post-response: new episode stored → embedding queued (Bull `embedding`).

---

## Tool Execution Flow

```mermaid
flowchart TD
    LG[LangGraph ToolCall node] --> TR[Tool Registry lookup]
    TR --> PERM{Agent role has capability?}
    PERM -->|no| DENY[Reject → Reason node with error]
    PERM -->|yes| VALID[Schema validate input]
    VALID --> RATE{Rate limit OK?}
    RATE -->|no| THROTTLE[Reject with cooldown]
    RATE -->|yes| EXEC[Tool Executor]

    EXEC --> T_TYPE{Tool type}
    T_TYPE -->|search_memory| MEM[Memory Service]
    T_TYPE -->|query_building| BLD[Building Service]
    T_TYPE -->|delegate_task| ORCH[Agent Orchestrator]
    T_TYPE -->|execute_api| PROXY[Sandbox proxy → External API]
    T_TYPE -->|update_policy| GOV[Governance Service v2]
    T_TYPE -->|run_simulation| SIM[Simulation Service]
    T_TYPE -->|start_training| QUEUE[Bull training queue]
    T_TYPE -->|deploy_model| TRAIN[Training pipeline v2]

    EXEC --> AUDIT[Immutable audit log → PostgreSQL]
    EXEC --> RESULT[Tool result → LangGraph Reason]
```

Perception District applies **prompt injection filtering** on classifier agents (security layer).

---

## Agent Delegation Flow (v1)

```mermaid
sequenceDiagram
    participant U as User
    participant A1 as Source Agent Graph
    participant ORCH as Orchestrator
    participant A2 as Target Agent Graph
    participant WS as WebSocket

    U->>WS: agent:delegate {source, target, task}
    WS->>ORCH: validate both agents
    ORCH->>A1: record delegation in memory
    ORCH->>A2: invokeGraph with task context
    A2->>A2: Reason → Act
    A2-->>ORCH: task result
    ORCH-->>WS: agent:status updates both agents
    ORCH-->>WS: simulation:event agent_milestone optional
```

---

## LangGraph Instance Pool Strategy

Critical scalability constraint: **agents in DB ≠ LangGraph instances running**.

```mermaid
flowchart TB
    subgraph MVP["MVP (≤ 10 concurrent)"]
        D1[Dialogue request] --> CREATE[Create instance]
        CREATE --> RUN[Run graph]
        RUN --> DESTROY[Destroy on session end]
    end

    subgraph V1["v1 (≤ 50 concurrent)"]
        D2[Dialogue request] --> POOL{Pool full?}
        POOL -->|no| ACQUIRE[Acquire instance]
        POOL -->|yes| QUEUE429[Queue / HTTP 429]
        ACQUIRE --> RUN2[Run graph]
        RUN2 --> RELEASE[Release to pool]
    end

    subgraph V2["v2 (≤ 200 concurrent)"]
        D3[Dialogue request] --> WORKER[AI Worker Pool]
        WORKER --> SHARED[Shared graph templates]
        SHARED --> REDIS_CP[Redis hot checkpoint]
        REDIS_CP --> PG_CP[PostgreSQL durable checkpoint]
    end
```

| Phase | Strategy                       | Load test gate                      |
| ----- | ------------------------------ | ----------------------------------- |
| MVP   | On-demand per dialogue         | 10 concurrent, P95 first token < 2s |
| v1    | Pool max 50; queue overflow    | 50 concurrent, API memory < 4GB     |
| v2    | Worker pool + shared templates | 200 concurrent dialogues            |

---

## Agent → Client Visualization Path

```mermaid
flowchart LR
    PG[(PostgreSQL agent row)] --> API[AgentService]
    API -->|REST initial| WS_STORE[worldStore]
    API -->|agent:status WS| WS_STORE
    WS_STORE --> SG[AgentNode]
    SG --> AVATAR[HologramAvatar shader]
    SG --> PART[StatusParticles]
    SG --> TAG[NameTag LabelNode]

    DIA[agent:dialogue tokens] --> AG_STORE[agentStore]
    AG_STORE --> PANEL[DialoguePanel HTML overlay]
```

Swarm rendering strategy ([`docs/feature-specs/agent-swarm-rendering.md`](../docs/feature-specs/agent-swarm-rendering.md)):

| Agents visible | Rendering                                                |
| -------------- | -------------------------------------------------------- |
| ≤ 50 (MVP)     | Full holographic avatar                                  |
| ≤ 500 (v1)     | Full in viewport; dots on mini-map elsewhere             |
| ≤ 5,000 (v2)   | Full in room; LOD silhouette in district; dots elsewhere |

---

## Inference Budget & Cost Control

Tracked in Redis with PostgreSQL audit trail:

| Resource                          | MVP     | v1                              |
| --------------------------------- | ------- | ------------------------------- |
| Tokens per anonymous user/day     | 50,000  | 100,000                         |
| Tokens per authenticated user/day | —       | 500,000                         |
| Tokens per agent/hour             | 50,000  | 200,000                         |
| Concurrent inference jobs         | 5       | 20                              |
| Background agent inference        | **Off** | Limited (simulation uses rules) |

```mermaid
flowchart LR
    MR[Model Router] --> RD[(Redis counters)]
    MR --> AUDIT[(PostgreSQL audit)]
    RD -->|budget exceeded| OL[Force Ollama fallback]
    RD -->|hard limit| REJECT[429 agents busy]
```

**v1 cost estimate**: ~$900/mo dialogues + ~$50/mo embeddings at 5,000 dialogues/day (see scalability plan).

---

## Checkpoint & Session Durability

```mermaid
flowchart TB
    LG[LangGraph Runtime] --> CP[PostgresSaver]
    CP --> PG[(langgraph_checkpoints)]
    LG --> SESS[sessionId + thread_id]
    SESS --> DIA[(dialogue_sessions)]
    DIA --> MSG[(dialogue_messages)]
```

- Graph can resume mid-workflow on API restart
- Session tied to WebSocket `sessionId` for streaming continuity
- Soft-deleted agents retain audit trail; no new dialogues

---

## Scalability Bottlenecks (Agent Path)

| ID  | Bottleneck               | Risk                               | Mitigation                                                          |
| --- | ------------------------ | ---------------------------------- | ------------------------------------------------------------------- |
| R1  | 1:1 LangGraph instances  | Memory exhaustion at 5K agents     | Pool + on-demand destroy; worker pool v2                            |
| R2  | OpenRouter cost/latency  | Unsustainable background inference | Dialogue-only MVP; rule-based simulation; Ollama for classification |
| R4  | pgvector at 1M memories  | Retrieval p95 > 100ms              | Qdrant migration; partition tables                                  |
| —   | Tool `execute_api` abuse | Security, cost                     | Allowlist proxy, rate limits, audit                                 |
| —   | Embedding queue backlog  | Delayed memory indexing            | Bull concurrency 5; batch embed                                     |
| —   | GPU training contention  | Inference starvation               | Reject training at 90% GPU; separate GPU node                       |

---

## Future Expansion Strategy

### Agent capabilities

| Horizon | Feature                         | Architectural change                                   |
| ------- | ------------------------------- | ------------------------------------------------------ |
| v1      | Cross-room movement, delegation | AgentService position events; orchestrator fan-out     |
| v2      | Multi-agent debate, reputation  | Multi-graph coordination; debate amphitheater scene    |
| v2      | Personality evolution           | Versioned prompt templates in DB; A/B via Model Router |
| Future  | Agent swarms (100+ on one task) | Coordinator graph; hierarchical delegation             |
| Future  | Fine-tuned district models      | Model Router policy per `DistrictId`                   |
| Future  | Multi-modal perception          | Image/audio nodes in Perception graph                  |
| Future  | RL from governance outcomes     | Reward signal pipeline; training queue expansion       |

### AI infrastructure

| Trigger                    | Action                                            |
| -------------------------- | ------------------------------------------------- |
| 200 concurrent graphs      | Extract AI Worker Pool container                  |
| 1M vector rows             | Qdrant sidecar; dual-write                        |
| OpenRouter outage frequent | Promote Ollama to primary for classification tier |
| Custom governor tools      | Dynamic Tool Registry with approval workflow      |

### Integration with Project Ultron

v2+: Q&A agents share personality layer (`packages/personality`); Reasoning District agents reference Global Problems List as memory source ([`docs/integration/project-ultron-to-ai-world.md`](../docs/integration/project-ultron-to-ai-world.md)).

---

## Related Documents

- [`data-flow-diagram.md`](data-flow-diagram.md) — Persistence paths for dialogue and memory
- [`event-flow-diagram.md`](event-flow-diagram.md) — `agent:dialogue`, `agent:status` events
- [`component-diagram.md`](component-diagram.md) — AI module components
- **Source**: [`docs/architecture/ai-system.md`](../docs/architecture/ai-system.md) · [`docs/feature-specs/agent-system.md`](../docs/feature-specs/agent-system.md) · [`docs/architecture/scalability-plan.md`](../docs/architecture/scalability-plan.md)
