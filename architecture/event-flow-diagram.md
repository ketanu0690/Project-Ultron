# Event Flow Diagram — ULTRON AI WORLD

> Async and realtime event paths across Frontend, Backend, Redis Pub/Sub, Bull queues, and External systems. Complements REST data flows in [`data-flow-diagram.md`](data-flow-diagram.md).

---

## Event Taxonomy

| Category                     | Transport           | Durability              | Examples                                   |
| ---------------------------- | ------------------- | ----------------------- | ------------------------------------------ |
| **Client ↔ Server realtime** | WebSocket (JSON)    | Connection-scoped       | `world:state`, `agent:dialogue`            |
| **Inter-service async**      | Redis Pub/Sub       | Ephemeral (not durable) | `world:state:{scale}`, `simulation:events` |
| **Background jobs**          | Bull (Redis queues) | Durable until processed | simulation tick, training, embedding       |
| **External callbacks**       | HTTPS               | Provider-dependent      | OpenRouter streaming chunks                |
| **Fallback**                 | REST polling / SSE  | Request-scoped          | `GET /world/state`, dialogue SSE           |

Authoritative contract: [`docs/architecture/api-contracts.md`](../docs/architecture/api-contracts.md) · ADR-0015

---

## Realtime Event Bus Architecture

```mermaid
flowchart TB
    subgraph Clients
        C1[Browser 1]
        C2[Browser 2]
        CN[Browser N]
    end

    subgraph API["Backend API Nodes"]
        WS1[World Gateway 1]
        WS2[World Gateway 2]
        SVC[Domain Services]
    end

    subgraph Realtime["Realtime Systems"]
        REDIS_PUB[(Redis Pub/Sub)]
        REDIS_Q[(Redis Bull Queues)]
    end

    subgraph Workers
        SIM_W[Simulation Worker]
        INF_W[Inference Worker]
        EMB_W[Embedding Worker]
    end

    C1 <-->|WSS| WS1
    C2 <-->|WSS| WS2
    CN <-->|WSS| WS2

    SVC -->|publish| REDIS_PUB
    REDIS_PUB --> WS1
    REDIS_PUB --> WS2

    SVC -->|enqueue| REDIS_Q
    REDIS_Q --> SIM_W
    REDIS_Q --> INF_W
    REDIS_Q --> EMB_W
    SIM_W -->|publish| REDIS_PUB
    SIM_W --> PG[(PostgreSQL)]
```

---

## WebSocket Event Catalog

### Client → Server

```mermaid
flowchart LR
    CLIENT[Frontend useWorldSocket]

    CLIENT --> NAV_SUB[nav:subscribe]
    CLIENT --> NAV_UNSUB[nav:unsubscribe]
    CLIENT --> NAV_ACK[nav:ack]
    CLIENT --> AGENT_DIA[agent:dialogue]
    CLIENT --> AGENT_DEL[agent:delegate v1]
    CLIENT --> SELECT[select:entity]
    CLIENT --> PING[ping]

    NAV_SUB --> GW[World Gateway]
    NAV_UNSUB --> GW
    NAV_ACK --> GW
    AGENT_DIA --> GW
    AGENT_DEL --> GW
    SELECT --> GW
    PING --> GW
```

| Event             | Handler                     | Downstream                   |
| ----------------- | --------------------------- | ---------------------------- |
| `nav:subscribe`   | SubscriptionManager         | WorldStateService → snapshot |
| `nav:unsubscribe` | SubscriptionManager         | Remove from channel          |
| `nav:ack`         | WorldStateService           | Confirm snapshot received    |
| `agent:dialogue`  | AgentOrchestrator           | LangGraph → Model Router     |
| `agent:delegate`  | AgentOrchestrator           | Target agent graph (v1)      |
| `select:entity`   | Analytics / future presence | Optional metrics             |
| `ping`            | Gateway                     | `pong` with serverTime       |

### Server → Client

```mermaid
flowchart LR
    GW[World Gateway] --> WS_OUT[Multiplexed WSS]

    WS_OUT --> W_STATE[world:state]
    WS_OUT --> W_SNAP[world:snapshot]
    WS_OUT --> A_STATUS[agent:status]
    WS_OUT --> A_DIA[agent:dialogue]
    WS_OUT --> SIM_TICK[simulation:tick v1]
    WS_OUT --> SIM_EVT[simulation:event v1]
    WS_OUT --> DEF[defense:alert v1]
    WS_OUT --> B_MET[building:metrics]
    WS_OUT --> GOV[governance:policy v2]
    WS_OUT --> PONG[pong]

    WS_OUT --> CLIENT[Frontend stores]
```

| Event               | Frequency           | Throttle     | Consumer store              |
| ------------------- | ------------------- | ------------ | --------------------------- |
| `world:state`       | On change           | 100 ms batch | worldStore                  |
| `world:snapshot`    | Subscribe/reconnect | Once         | worldStore                  |
| `agent:status`      | On change           | None         | worldStore, Scene Graph     |
| `agent:dialogue`    | Streaming           | None         | agentStore → Dialogue Panel |
| `simulation:tick`   | 60 s                | None         | worldStore                  |
| `simulation:event`  | Per event           | None         | uiStore sidebar             |
| `defense:alert`     | On detection        | None         | worldStore, HUD             |
| `building:metrics`  | 5 s                 | Per-building | Scene Graph shaders         |
| `governance:policy` | On change           | None         | worldStore (v2)             |

---

## Subscription Scoping Event Filter

Clients receive only events for **subscribed scale and children**:

```mermaid
flowchart TD
    SUB[nav:subscribe scale] --> FILTER{Subscription Filter}

    FILTER -->|galaxy| GAL[Galaxy state only]
    FILTER -->|megacity| MEG[All districts + buildings + agent positions]
    FILTER -->|district| DIST[District buildings + agents]
    FILTER -->|building| BLD[Rooms + building agents]
    FILTER -->|room| ROOM[Room agents + terminals]
    FILTER -->|agent| AGT[Single agent + active dialogue]

    MEG --> SUPPRESS[Suppress off-scope position updates]
    SUPPRESS --> EXCEPTION[Except: active dialogue agent always streams]
```

Reduces fan-out noise at megacity scale (critical for v1 — see scalability R3).

---

## Redis Pub/Sub Channel Map

```mermaid
flowchart TB
    subgraph Publishers
        WORLD[WorldStateService]
        AGENT[AgentService]
        SIM[SimulationService]
        DEF[DefenseService]
        GOV[GovernanceService v2]
    end

    subgraph Channels
        CH1[world:state:megacity]
        CH2[world:state:district]
        CH3[agent:status]
        CH4[simulation:events]
        CH5[defense:alerts]
        CH6[governance:policies v2]
    end

    subgraph Subscribers
        WS1[WS Gateway 1]
        WS2[WS Gateway 2]
    end

    WORLD --> CH1
    WORLD --> CH2
    AGENT --> CH3
    SIM --> CH4
    DEF --> CH5
    GOV --> CH6

    CH1 --> WS1
    CH1 --> WS2
    CH2 --> WS1
    CH3 --> WS1
    CH3 --> WS2
    CH4 --> WS1
    CH4 --> WS2
    CH5 --> WS1
    CH6 --> WS2
```

**Durability caveat (R7)**: Pub/Sub messages are lost if no subscriber is connected. Mitigation: `world:snapshot` on reconnect + client `nav:ack {tick}` within 5 s.

---

## Bull Queue Event Flow

```mermaid
flowchart LR
    subgraph Producers
        API[NestJS Services]
        TOOL[Agent Tools]
    end

    subgraph Queues["Redis Bull Queues"]
        Q_SIM[simulation]
        Q_INF[inference]
        Q_TRAIN[training]
        Q_EMB[embedding]
        Q_GOV[governance]
    end

    subgraph Processors
        P_SIM[SimulationProcessor<br/>concurrency: 1]
        P_INF[InferenceProcessor<br/>concurrency: 10]
        P_TRAIN[TrainingProcessor<br/>concurrency: 2]
        P_EMB[EmbeddingProcessor<br/>concurrency: 5]
        P_GOV[GovernanceProcessor<br/>concurrency: 3]
    end

    API --> Q_SIM
    API --> Q_GOV
    TOOL --> Q_TRAIN
    API --> Q_EMB
    API --> Q_INF

    Q_SIM --> P_SIM
    Q_INF --> P_INF
    Q_TRAIN --> P_TRAIN
    Q_EMB --> P_EMB
    Q_GOV --> P_GOV

    P_SIM -->|simulation:tick, simulation:event| REDIS[Redis Pub/Sub]
    P_SIM --> PG[(PostgreSQL)]
    P_TRAIN --> OLLAMA[Ollama GPU]
    P_INF --> AI[LangGraph batch]
    P_EMB --> OR[OpenRouter embed]
```

| Queue        | Trigger               | Output events                           |
| ------------ | --------------------- | --------------------------------------- |
| `simulation` | Cron 60 s             | `simulation:tick`, `simulation:event`   |
| `inference`  | Batch jobs            | Internal completion; optional WS notify |
| `training`   | `start_training` tool | `simulation:event` on complete          |
| `embedding`  | Memory write          | None (DB update only)                   |
| `governance` | Policy evaluation     | `governance:policy` (v2)                |

---

## Simulation Event Flow (v1)

```mermaid
sequenceDiagram
    participant CRON as Bull Cron
    participant SIM as SimulationService
    participant GOV as PolicyEvaluator
    participant PG as PostgreSQL
    participant REDIS as Redis Pub/Sub
    participant WS as World Gateway
    participant WEB as Frontend

    CRON->>SIM: simulation job (60s)
    SIM->>GOV: evaluate active policies
    GOV->>PG: read policies
    SIM->>SIM: generate random events
    SIM->>PG: update world_state variables
    SIM->>PG: insert simulation_events, snapshot
    SIM->>REDIS: publish simulation:tick
    SIM->>REDIS: publish simulation:event (per event)
    REDIS->>WS: fan-out
    WS->>WEB: simulation:tick + simulation:event
    WEB->>WEB: Update HUD metrics, sidebar feed
```

---

## Defense Alert Event Flow (v1)

```mermaid
sequenceDiagram
    participant SIM as Simulation/EventGenerator
    participant DEF as DefenseService
    participant PG as PostgreSQL
    participant REDIS as Redis Pub/Sub
    participant WS as World Gateway
    participant WEB as Frontend
    participant THREE as Orbital Ring Scene

    SIM->>DEF: threat_detected
    DEF->>PG: insert threat, update segment
    DEF->>REDIS: publish defense:alerts
    REDIS->>WS: fan-out
    WS->>WEB: defense:alert {threatId, level, segmentId}
    WEB->>THREE: Highlight ring segment shader
    WEB->>WEB: HUD alert banner
```

---

## Connection Lifecycle Events

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    Disconnected --> Connecting : open WSS
    Connecting --> Authenticated : session validated
    Authenticated --> Subscribed : nav:subscribe
    Subscribed --> Active : receiving events
    Active --> Active : world:state, agent:dialogue
    Active --> Reconnecting : connection lost
    Reconnecting --> Subscribed : exponential backoff success
    Reconnecting --> Disconnected : max attempts (never at MVP)
    Subscribed --> PollingFallback : WSS blocked
    PollingFallback --> Subscribed : WSS restored
```

### Reconnect event sequence

1. Client reconnects with exponential backoff (1s → 30s max)
2. Server assigns `clientId`; prior subscriptions cleared
3. Client re-sends `nav:subscribe` with last known scale
4. Server sends `world:snapshot` (full state, not diffs)
5. Client sends `nav:ack {tick}`

---

## Fallback Event Path (No WebSocket)

```mermaid
flowchart LR
    WEB[Frontend] -->|GET /world/state every 5s| API[REST]
    WEB -->|POST /agents/:id/dialogue| SSE[SSE stream]
    API --> PG[(PostgreSQL)]
    SSE -->|event: token| WEB
```

Used when corporate proxies block WSS. Half-duplex for dialogue (SSE), polling for world state.

---

## Backpressure & Event Dropping

| Signal                  | Policy              | Events affected               |
| ----------------------- | ------------------- | ----------------------------- |
| Inference queue > 50    | HTTP 429            | New `agent:dialogue` rejected |
| WS client queue > 1000  | Drop non-critical   | `building:metrics` first      |
| DB connection wait > 5s | Circuit breaker 503 | All REST; WS publish delayed  |
| Payload > 64 KB         | Split frames        | `world:state`                 |
| Token budget exceeded   | Route to Ollama     | Model Router internal event   |

---

## Scalability Bottlenecks (Event Path)

| Bottleneck                       | Impact                                  | Mitigation                                                                       |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| **Megacity diff fan-out**        | 1,000 clients × large diffs every 100ms | Scale-scoped subscriptions; delta fields only; off-viewport position throttle 5s |
| **Redis Pub/Sub not durable**    | Missed events during deploy             | Snapshot on subscribe; `nav:ack`                                                 |
| **Single simulation worker**     | Tick backlog                            | Keep concurrency 1; optimize tick < 5s; never LLM in tick                        |
| **WS 10K connections/node**      | Memory, CPU                             | Horizontal gateway nodes                                                         |
| **Dialogue stream head-of-line** | Slow client blocks gateway buffer       | Per-session stream isolation; disconnect slow clients                            |
| **Bull Redis single instance**   | Queue bottleneck at v2                  | Redis Cluster                                                                    |

---

## Future Expansion Strategy

| Capability               | Event mechanism                                             |
| ------------------------ | ----------------------------------------------------------- |
| **Multi-user presence**  | New channel `presence:scene`; CRDT sync research            |
| **Durable event log**    | Replace Pub/Sub with Redis Streams or NATS JetStream        |
| **Binary protocol**      | MessagePack for high-frequency agent positions              |
| **WebTransport**         | Lower-latency dialogue and diffs                            |
| **Event sourcing**       | Append-only `domain_events` table; rebuild world from log   |
| **Webhook integrations** | Outbound events for external systems (governance decisions) |
| **Edge WS**              | Geographic Pub/Sub bridges; scale-scoped edge caches        |

### Event versioning

All WebSocket messages carry `version: 1` in envelope. Breaking changes require contract version bump per ADR-0015.

---

## Related Documents

- [`data-flow-diagram.md`](data-flow-diagram.md) — Payload persistence paths
- [`agent-flow-diagram.md`](agent-flow-diagram.md) — Dialogue and tool events
- **Source**: [`docs/architecture/realtime.md`](../docs/architecture/realtime.md) · [`docs/architecture/api-contracts.md`](../docs/architecture/api-contracts.md)
