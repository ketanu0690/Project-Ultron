# Data Flow Diagram — ULTRON AI WORLD

> End-to-end movement of data among User, Frontend, Three.js Engine, Backend API, AI Systems, Databases, Realtime layer, and External APIs.

---

## Data Classification

| Class                   | Examples                         | Authority             | Storage               |
| ----------------------- | -------------------------------- | --------------------- | --------------------- |
| **World entities**      | Districts, buildings, agents     | Server (PostgreSQL)   | PostgreSQL            |
| **Ephemeral runtime**   | Agent status, WS subscriptions   | Server (Redis)        | Redis                 |
| **Semantic memory**     | Agent memories, embeddings       | Server                | PostgreSQL + pgvector |
| **3D geometry**         | glTF meshes, textures            | CDN/MinIO (immutable) | MinIO + client cache  |
| **Client view state**   | Camera, selection, UI panels     | Client                | Zustand + session     |
| **Inference artifacts** | LangGraph checkpoints, dialogues | Server                | PostgreSQL            |
| **Metrics**             | FPS, latency, token counts       | Both                  | Prometheus            |

**Invariant**: Server sends **entity state**, never geometry. Client maps state → Scene Graph nodes locally.

---

## Master Data Flow Overview

```mermaid
flowchart TB
    subgraph User["User"]
        BROWSER[Browser]
    end

    subgraph Client["Client Tier"]
        WEB[Frontend / Zustand]
        THREE[Three.js Engine]
    end

    subgraph Server["Server Tier"]
        API[NestJS API]
        AI[AI Systems]
        WORK[Bull Workers]
    end

    subgraph Data["Data Tier"]
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        MINIO[(MinIO)]
    end

    subgraph External["External"]
        CDN[CDN]
        OR[OpenRouter]
        OL[Ollama]
        EXT[External APIs]
    end

    BROWSER --> WEB
    WEB --> THREE
    THREE -->|"selection, raycast"| WEB

    WEB -->|"REST: navigation, CRUD"| API
    WEB <-->|"WSS: diffs, dialogue"| API

    WEB -->|"HTTPS: glTF"| CDN
    CDN --> MINIO

    API --> PG
    API --> REDIS
    API --> MINIO
    API --> AI
    API --> WORK

    AI --> PG
    AI --> REDIS
    AI --> OR
    AI --> OL
    AI --> EXT

    WORK --> PG
    WORK --> REDIS
```

---

## Flow 1: Initial World Load (REST)

User opens the app at **Galaxy** (production entry per [ADR-0016](../docs/adr/0016-galaxy-first-entry-and-scale-phasing.md)); scroll journey or `?scale=` deep-link reaches megacity, then REST hydrates city data.

```mermaid
sequenceDiagram
    participant U as User
    participant WEB as Frontend
    participant STORE as worldStore
    participant API as NavigationService
    participant CACHE as Redis
    participant PG as PostgreSQL
    participant THREE as Scene Graph

    U->>WEB: Load / (galaxy default) or ?scale=megacity
    WEB->>API: GET /api/v1/navigation/megacity (on city scale)
    API->>CACHE: Check navigation snapshot
    alt cache miss
        API->>PG: Scale-aware JOIN query
        PG-->>API: districts, buildings, agents, metrics
        API->>CACHE: SET snapshot TTL 30s
    else cache hit
        CACHE-->>API: Cached bundle
    end
    API-->>WEB: NavigationResponse envelope
    WEB->>STORE: Hydrate entities (useWorldSync)
    STORE->>THREE: Render District/Building/Agent nodes
    THREE->>CDN: Lazy load glTF per visible entity
```

| Step              | Data shape                                        | Size estimate (v1 megacity) |
| ----------------- | ------------------------------------------------- | --------------------------- |
| Navigation bundle | Districts + 200 building summaries + agent counts | 50–200 KB JSON              |
| glTF per building | Draco compressed mesh                             | ~500 KB each (lazy)         |
| Agent summaries   | id, status, position, role                        | ~500 B × 500 agents         |

---

## Flow 2: Realtime State Sync (WebSocket Diffs)

After subscribe, server pushes incremental changes only.

```mermaid
sequenceDiagram
    participant WEB as Frontend
    participant WS as World Gateway
    participant SUB as SubscriptionManager
    participant WORLD as WorldStateService
    participant DIFF as StateDiffService
    participant REDIS as Redis Pub/Sub
    participant PG as PostgreSQL
    participant THREE as Scene Graph

    WEB->>WS: nav:subscribe {scale: district, focusId}
    WS->>SUB: Register client scope
    WS->>WORLD: Request snapshot
    WORLD->>PG: Query scoped entities
    WORLD-->>WS: world:snapshot
    WS-->>WEB: Full snapshot
    WEB->>THREE: Hydrate / replace branch
    WEB->>WS: nav:ack {tick}

    loop Every 100ms batch
        WORLD->>DIFF: Compute changes since tick
        DIFF->>REDIS: publish world:state:{scale}
        REDIS->>WS: Fan-out
        WS-->>WEB: world:state {added, updated, removed}
        WEB->>THREE: Patch entity nodes
    end
```

### Diff merge rules (client)

| Operation | Scene Graph action                      |
| --------- | --------------------------------------- |
| `added`   | Create node, fetch glTF if building     |
| `updated` | Patch position, status, metrics shaders |
| `removed` | Unmount node, dispose GPU resources     |

---

## Flow 3: Agent Dialogue (Streaming)

```mermaid
flowchart LR
    subgraph Client
        DP[Dialogue Panel]
        AS[agentStore]
    end

    subgraph API
        GW[World Gateway]
        ORCH[Orchestrator]
        LG[LangGraph]
        MR[Model Router]
        MEM[Memory Service]
    end

    subgraph Data
        PG[(PostgreSQL)]
        RD[(Redis budget)]
    end

    subgraph External
        OR[OpenRouter]
    end

    DP -->|agent:dialogue| GW
    GW --> ORCH
    ORCH --> MEM
    MEM --> PG
    ORCH --> LG
    LG --> MR
    MR --> RD
    MR --> OR
    OR -->|token stream| MR
    MR --> LG
    LG -->|tokens, toolCalls| ORCH
    ORCH --> GW
    GW -->|agent:dialogue| AS
    AS --> DP
    LG --> MEM
    MEM -->|store episode| PG
```

Dialogue **history** is not sent over WebSocket — client fetches via `GET /agents/:id/memory` when opening profile.

---

## Flow 4: Memory Write & Retrieval

```mermaid
flowchart TB
    MSG[User message / agent response]
    MSG --> EP[Store episodic memory]
    EP --> PG1[(dialogue_messages)]
    EP --> EMB[Embedding Service]
    EMB --> OR[OpenRouter embeddings]
    OR --> VEC[1536-dim vector]
    VEC --> PG2[(agent_memories + HNSW index)]

    QUERY[Dialogue query] --> RET[Retriever]
    RET --> EMB2[Embed query]
    EMB2 --> SIM[pgvector similarity top 5]
    RET --> REC[Recent episodes top 10]
    SIM --> MERGE[Rank & merge]
    REC --> MERGE
    MERGE --> CTX[Context window for LangGraph]
```

| Memory type | Storage            | Retrieval weight |
| ----------- | ------------------ | ---------------- |
| Semantic    | pgvector           | 0.5              |
| Episodic    | PostgreSQL recency | 0.3              |
| Procedural  | Role match         | 0.2              |

---

## Flow 5: Simulation Tick (v1+, Background)

```mermaid
flowchart LR
    CRON[Bull cron 60s] --> SIM[SimulationService]
    SIM --> GOV[PolicyEvaluator]
    GOV --> PG[(governance_policies)]
    SIM --> AGENT[Agent task rules]
    SIM --> EVT[EventGenerator]
    EVT --> MET[Update world_state variables]
    MET --> PG
    MET --> SNAP[world_state_snapshots]
    MET --> DIFF[Visual diffs]
    DIFF --> REDIS[Redis Pub/Sub]
    REDIS --> WS[WebSocket broadcast]
    WS --> WEB[Frontend worldStore]
    WEB --> THREE[Shader/metric updates]
```

Simulation uses **rule engine**, not LLM per agent per tick (cost control).

---

## Flow 6: 3D Asset Pipeline

```mermaid
flowchart LR
    ART[Artist / pipeline] --> MINIO[MinIO bucket]
    MINIO --> CDN[CDN edge]
    CDN --> WEB[Frontend]
    WEB --> THREE[GLTFLoader + Draco]
    THREE --> GPU[GPU buffers]

    API --> MINIO
    API -->|"presigned URL or CDN path in entity metadata"| WEB
```

| Phase | Delivery                                |
| ----- | --------------------------------------- |
| MVP   | Direct MinIO or bundled assets          |
| v1    | CDN required; Service Worker cache      |
| v2    | Per-district lazy load; texture atlases |

---

## Flow 7: Client Performance Telemetry (Optional)

```mermaid
flowchart LR
    THREE[Three.js rAF loop] --> FPS[FPS sampler]
    FPS --> WEB[Frontend]
    WEB -->|POST /metrics/client or Prometheus pushgateway| PROM[Prometheus]
    PROM --> GRAF[Grafana Client Performance dashboard]
```

Feeds ADR-0014 performance gates (60 FPS design, 30 FPS ship bar).

---

## Caching Data Flow

| Data                | Layer           | TTL       | Invalidation   |
| ------------------- | --------------- | --------- | -------------- |
| Navigation snapshot | Redis           | 30 s      | Entity change  |
| District metadata   | Redis           | 1 h       | Policy change  |
| Building metrics    | Redis           | 5 s       | Metric update  |
| Agent runtime       | Redis           | Session   | Status change  |
| glTF assets         | CDN + browser   | Immutable | Version in URL |
| Embeddings          | PostgreSQL HNSW | —         | No cache       |

---

## Scalability Bottlenecks (Data Path)

| Flow                 | Bottleneck                            | Threshold                     | Mitigation                                                        |
| -------------------- | ------------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| Navigation REST      | Large JSON at megacity                | 200 buildings + 500 agents    | Cache, pagination, read replica                                   |
| WS diffs             | 64 KB frame limit; 100ms batch volume | 1,000 subscribers at megacity | Scale-scoped subscriptions; throttle off-viewport positions to 5s |
| Memory retrieval     | HNSW query latency                    | p95 > 100ms at 1M rows        | Qdrant migration; partition `agent_memories`                      |
| Embedding writes     | OpenRouter rate                       | 100 req/min MVP               | Bull `embedding` queue batch                                      |
| Asset load           | Uncached 400MB city                   | First visit                   | CDN, Draco, lazy district                                         |
| Checkpoint writes    | LangGraph state size                  | 50 concurrent sessions        | Compress state; Redis hot checkpoint (v2)                         |
| Simulation snapshots | 1,440 ticks/day                       | v2 history growth             | Monthly partition; 90-day retention                               |

---

## Future Expansion Strategy

| Data domain      | v1              | v2                         | Future                    |
| ---------------- | --------------- | -------------------------- | ------------------------- |
| Navigation reads | Read replica    | CQRS read model            | GraphQL federation        |
| World history    | Snapshot table  | Partitioned snapshots      | Event sourcing            |
| Vectors          | pgvector        | Dual-write Qdrant          | Dedicated vector cluster  |
| Assets           | CDN + MinIO     | R2/CloudFront multi-region | Edge asset pre-warm       |
| Client state     | Zustand session | CRDT collaborative view    | Multi-user presence       |
| Dialogue archive | PostgreSQL      | Monthly partition          | Cold storage (S3 Glacier) |

---

## Related Documents

- [`event-flow-diagram.md`](event-flow-diagram.md) — Event naming and async paths
- [`agent-flow-diagram.md`](agent-flow-diagram.md) — LangGraph data touchpoints
- **Source**: [`docs/architecture/database.md`](../docs/architecture/database.md) · [`docs/architecture/realtime.md`](../docs/architecture/realtime.md) · [`docs/architecture/api-contracts.md`](../docs/architecture/api-contracts.md)
