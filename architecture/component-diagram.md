# Component Diagram — ULTRON AI WORLD

> **C4 Component level** · Internal structure of the Frontend (including Three.js Engine) and Backend API containers, plus AI subsystem components.

---

## Scope

This diagram decomposes the two primary **application containers** into components that developers implement. Infrastructure components (PostgreSQL, Redis, MinIO) appear as dependencies, not expanded internals.

---

## Frontend + Three.js Engine Components

```mermaid
C4Component
    title Frontend Container — Components

    Container_Boundary(web, "Frontend (apps/web)") {
        Component(router, "App Router", "Next.js", "Routes: /world/[scale], layout, providers")
        Component(stores, "Zustand Stores", "Zustand", "worldStore, navigationStore, agentStore, uiStore")
        Component(api_client, "API Client", "fetch + WS hook", "REST calls, useWorldSocket, reconnect policy")
        Component(ui_shell, "UI Shell", "Tailwind", "HUD, sidebars, dialogue panel, search")
        Component(controllers, "Controllers", "TypeScript", "ScaleTransition, Camera, Input, LODManager")
        Component(scene_router, "Scene Router", "R3F", "Mounts active scale scene branch")
        Component(scene_graph, "Scene Graph", "R3F nodes", "District, Building, Room, Agent, Memory nodes")
        Component(rendering, "Rendering Pipeline", "Three.js", "Shaders, post-processing, instancing")
    }

    Container_Ext(api, "Backend API", "NestJS")
    Container_Ext(cdn, "CDN", "Assets")

    Rel(router, ui_shell, "Layout")
    Rel(router, scene_router, "World routes")
    Rel(stores, ui_shell, "Subscribe")
    Rel(stores, scene_graph, "Entity data")
    Rel(api_client, stores, "Sync state")
    Rel(api_client, api, "REST + WSS")
    Rel(controllers, scene_router, "Transition / camera")
    Rel(controllers, rendering, "LOD decisions")
    Rel(scene_router, scene_graph, "Active branch")
    Rel(scene_graph, rendering, "Meshes, materials")
    Rel(scene_graph, cdn, "Load glTF")
    Rel(ui_shell, stores, "Read/write selection, dialogue")
```

### Frontend Component Responsibilities

| Component              | Key modules                                                   | Communicates with           |
| ---------------------- | ------------------------------------------------------------- | --------------------------- |
| **App Router**         | `app/world/[scale]`, root layout                              | UI Shell, Scene Router      |
| **Zustand Stores**     | `worldStore`, `navigationStore`, `agentStore`, `uiStore`      | All UI and scene components |
| **API Client**         | `lib/api`, `useWorldSocket`                                   | Backend REST + WebSocket    |
| **UI Shell**           | `components/hud`, `panels`, `ui`                              | Stores only (no direct API) |
| **Controllers**        | `ScaleTransitionController`, `CameraController`, `LODManager` | Scene Graph, Rendering      |
| **Scene Router**       | `SceneRouter` — single Canvas strategy                        | One active scale branch     |
| **Scene Graph**        | Per-scale R3F nodes mirroring server entities                 | worldStore, Controllers     |
| **Rendering Pipeline** | LOD meshes, shader library, post-processing                   | Scene Graph, GPU            |

---

## Backend API Components

```mermaid
C4Component
    title Backend API Container — Components

    Container_Boundary(api, "Backend API (apps/api)") {
        Component(gateway, "World Gateway", "NestJS WS", "Connection lifecycle, subscription manager")
        Component(nav, "Navigation Module", "NestJS", "Scale-aware entity bundles")
        Component(world, "World Module", "NestJS", "State diffs, snapshots, metrics")
        Component(agents, "Agents Module", "NestJS", "CRUD, status, orchestration entry")
        Component(buildings, "Buildings Module", "NestJS", "Building/floor/room hierarchy")
        Component(districts, "Districts Module", "NestJS", "District metadata and metrics")
        Component(simulation, "Simulation Module", "NestJS", "60s tick, event generation")
        Component(governance, "Governance Module", "NestJS", "Policy CRUD, evaluation (v2 UI)")
        Component(memory, "Memory Module", "NestJS", "Episodes, semantic storage")
        Component(defense, "Defense Module", "NestJS", "Ring segments, threats (v1+)")
        Component(ai_module, "AI Module", "NestJS", "Orchestrator, LangGraph, Model Router")
        Component(queues, "Queue Processors", "Bull", "simulation, inference, training, embedding")
        Component(prisma, "Prisma Service", "ORM", "All DB access")
        Component(redis_svc, "Redis Service", "ioredis", "Cache, Pub/Sub, budget counters")
    }

    ContainerDb(pg, "PostgreSQL")
    ContainerDb(redis, "Redis")
    ContainerDb(minio, "MinIO")
    System_Ext(openrouter, "OpenRouter")
    System_Ext(ollama, "Ollama")

    Rel(gateway, nav, "Subscribe routing")
    Rel(gateway, world, "Push diffs")
    Rel(gateway, agents, "Dialogue events")
    Rel(agents, ai_module, "invokeGraph")
    Rel(ai_module, memory, "retrieve / store")
    Rel(ai_module, openrouter, "Inference")
    Rel(ai_module, ollama, "Fallback")
    Rel(simulation, governance, "Policy eval")
    Rel(simulation, queues, "Enqueue tick")
    Rel(queues, simulation, "Process tick")
    Rel(world, redis_svc, "Publish + cache")
    Rel(nav, prisma, "Scale queries")
    Rel(memory, prisma, "Vectors via raw SQL")
    Rel(prisma, pg, "SQL")
    Rel(redis_svc, redis, "TCP")
```

---

## AI Systems Components

```mermaid
flowchart TB
    subgraph AI["AI Module (apps/api/src/modules/ai)"]
        ORCH[Agent Orchestrator]
        LG[LangGraph Runtime]
        MR[Model Router]
        EMB[Embedding Service]
        RET[Memory Retriever]
        TR[Tool Registry]
        TC[Tool Executor]
        CP[Checkpoint Store]
    end

    subgraph Graphs["Role Graph Templates"]
        PLAN[Planner Graph]
        CLASS[Classifier Graph]
        ARCH[Archivist Graph]
        EXEC[Executor Graph]
        TRAIN[Trainer Graph]
        DEB[Debater Graph]
    end

    ORCH --> LG
    LG --> MR
    LG --> RET
    LG --> TR
    TR --> TC
    LG --> CP
    RET --> EMB
    RET --> VDB[(pgvector)]
    EMB --> MR
    CP --> PG[(PostgreSQL)]

    LG --> PLAN
    LG --> CLASS
    LG --> ARCH
    LG --> EXEC
    LG --> TRAIN
    LG --> DEB
```

| Component                    | Responsibility                                   | Persistence               |
| ---------------------------- | ------------------------------------------------ | ------------------------- |
| **Agent Orchestrator**       | Session lifecycle, dialogue routing, delegation  | Redis runtime             |
| **LangGraph Runtime**        | State machine execution per agent role           | PostgreSQL checkpoints    |
| **Model Router**             | Provider selection, fallback, budget enforcement | Redis counters + PG audit |
| **Embedding Service**        | Batch embed for memory indexing                  | —                         |
| **Memory Retriever**         | Semantic + episodic + procedural merge           | pgvector + PostgreSQL     |
| **Tool Registry / Executor** | Capability checks, sandboxed external calls      | Audit log in PostgreSQL   |
| **Checkpoint Store**         | PostgresSaver for durable graph state            | `langgraph_checkpoints`   |

---

## Cross-Container Interaction (Component Level)

```mermaid
sequenceDiagram
    participant UI as UI Shell
    participant SG as Scene Graph
    participant WS as useWorldSocket
    participant GW as World Gateway
    participant NAV as NavigationService
    participant WORLD as WorldStateService
    participant ORCH as AgentOrchestrator

    Note over UI,SG: Initial page load
    UI->>NAV: GET /navigation/megacity
    NAV-->>UI: Entity bundle → worldStore
    UI->>SG: Render from worldStore

    Note over WS,GW: Realtime subscription
    WS->>GW: nav:subscribe {scale}
    GW->>WORLD: register subscription
    WORLD-->>WS: world:snapshot
    WS->>SG: Hydrate entities

    Note over UI,ORCH: Agent dialogue
    UI->>WS: agent:dialogue {agentId, message}
    WS->>GW: forward
    GW->>ORCH: createDialogueSession
    loop tokens
        ORCH-->>WS: agent:dialogue {token}
        WS-->>UI: Stream to DialoguePanel
    end
```

---

## Shared Package (`packages/shared`)

Components on both sides import shared contracts:

| Export                                    | Used by                         |
| ----------------------------------------- | ------------------------------- |
| `ScaleLevel`, `AgentStatus`, `DistrictId` | Frontend stores, Backend DTOs   |
| WebSocket event types                     | `useWorldSocket`, World Gateway |
| API response envelopes                    | API Client, REST controllers    |
| District theme tokens                     | Scene Graph shaders, UI Shell   |

---

## Scalability Bottlenecks (Component Level)

| Component                                | Risk                                          | Mitigation                                                  |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| **World Gateway**                        | 10K connections/node; subscription map memory | Horizontal WS nodes; Redis fan-out                          |
| **WorldStateService / StateDiffService** | Diff computation CPU at megacity scale        | Scale-scoped subscriptions; 100ms batch; field-level deltas |
| **NavigationService**                    | Large payloads at city scale                  | Redis 30s cache; pagination; read replica                   |
| **Agent Orchestrator**                   | 1:1 LangGraph instance explosion              | Pool max 50 (v1); queue overflow 429                        |
| **LangGraph + Model Router**             | P95 first token > 2s                          | Streaming; Ollama fallback; prompt template cache           |
| **Scene Graph + LODManager**             | Draw calls > 500                              | Instancing, frustum cull, agent swarm LOD                   |
| **SimulationService**                    | Tick > 5s with 500 agents                     | Rule engine not LLM-per-agent; Bull single concurrency      |

---

## Future Expansion Strategy

### Frontend decomposition

| Trigger              | Action                                               |
| -------------------- | ---------------------------------------------------- |
| Team > 10 engineers  | Micro-frontend split (governance dashboard vs world) |
| WebGPU stable in R3F | Migrate rendering pipeline component                 |
| LOD CPU bound        | Web Worker for spatial indexing                      |

### Backend decomposition

| Trigger                     | Action                                             |
| --------------------------- | -------------------------------------------------- |
| Inference queue depth > 100 | Extract AI Module to `ai-worker` container         |
| Simulation tick blocks API  | Dedicated simulation worker container              |
| Navigation P95 > 500ms      | CQRS read model for navigation                     |
| 10+ API nodes               | API gateway (Traefik/Kong); optional gRPC internal |

### AI subsystem

| Trigger                    | Action                                             |
| -------------------------- | -------------------------------------------------- |
| 1M+ vector rows            | Qdrant sidecar; dual-write migration               |
| 200 concurrent graphs      | Shared graph templates; Redis checkpoint hot state |
| Fine-tuned district models | Model Router policy per district                   |

---

## Related Documents

- [`container-diagram.md`](container-diagram.md) — Deployable containers
- [`agent-flow-diagram.md`](agent-flow-diagram.md) — LangGraph state machine detail
- [`event-flow-diagram.md`](event-flow-diagram.md) — WebSocket event routing
- **Source**: [`docs/architecture/backend.md`](../docs/architecture/backend.md) · [`docs/architecture/frontend.md`](../docs/architecture/frontend.md) · [`docs/architecture/ai-system.md`](../docs/architecture/ai-system.md)
