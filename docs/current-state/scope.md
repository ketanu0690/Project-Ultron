# Current Scope

> **Current Reality** — not the full vision. For aspirational features see [`../future-vision/`](../future-vision/).

---

## Today (2026-07-04)

| Area                 | Reality                                                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Codebase**         | Monorepo — `apps/web`, `apps/api`, `packages/shared`, `packages/personality` with Turbo, Husky, npm workspace                                                                                            |
| **Frontend**         | Next.js 16 + R3F single Canvas; 9 of 10 scale scenes render (solar system is locked placeholder); Galaxy-first default entry per ADR-0016                                                                |
| **Backend**          | NestJS 11 — `/api/v1` REST (health, ready, navigation, districts, buildings, agents, memory, world, earth, star-systems), `PrismaModule`, WebSocket gateway at `/ws`, `ApiResponse`/`ApiError` envelopes |
| **Shared contracts** | `@ultron/shared` exports types, constants, colors, WebSocket event shapes — consumed by web and api                                                                                                      |
| **Deployment**       | Docker Compose (8 services) in `infra/docker-compose.yml`; GitLab CI (`infra/.gitlab-ci.yml`) — lint, typecheck, test, build                                                                             |
| **3D world**         | Galaxy scroll journey → megacity → district → building → room → agent → memory drill-down wired (3D clicks + sidebar Enter/Talk/View Memory)                                                             |
| **Agents**           | 50 agents from seed in `AgentScene` (worldStore); dialogue via WS/SSE (`DialoguePanel`); `ModelRouter` stub + Ollama fallback                                                                            |
| **Database**         | Prisma schema v1 + seed (`5 districts`, `10 buildings`, `3 rooms`, `50 agents`, `12 memories`); pgvector `embedding` column on `agent_memories`                                                          |
| **Phase**            | **M1 Foundation complete** (2026-07-04); **M2 MVP polish** in progress                                                                                                                                   |

### What Exists in Code (M1 Shippable Baseline)

| Layer                  | Built                                                                                                                                                                                                   | Not Built / Deferred                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `apps/web`             | `WorldCanvas`, `SceneRouter`, 4 Zustand stores (navigation, world, agent, ui), controllers, hooks, UI shell (TopBar, sidebars, HUD, DialoguePanel, MemoryTimeline), Earth/Galaxy scenes, Playwright E2E | Per-district scene variants; full galaxy-scroll E2E in CI (non-blocking job planned) |
| `apps/api`             | 10+ domain modules, Prisma-backed queries, `GET /ready`, WebSocket `WorldGateway`, dialogue SSE, Prometheus metrics, Jest + integration tests                                                           | Semantic memory search (`POST /agents/:id/memory/search`); live `world:state` UI     |
| `packages/shared`      | Types, constants, WS events, camera constants, entity DTOs                                                                                                                                              | —                                                                                    |
| `packages/personality` | `@ultron/personality` prompt templates wired into `ModelRouterService`                                                                                                                                  | —                                                                                    |

---

## MVP — First Shippable Target

What **must exist in the product** when MVP ships. Most items below are **built or partially wired**; M2 polish closes automation and static-fallback debt.

### World & Navigation

| Item                       | Current (MVP)                                                              | Built Today                                                                                    |
| -------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Entry point**            | Galaxy-first scroll journey (ADR-0016)                                     | Default scale `galaxy`; `?scale=` deep-link bypass; megacity CI shortcut via `?scale=megacity` |
| **Scale levels navigable** | **6** city scales — Megacity → District → Building → Room → Agent → Memory | All 6 scenes + cosmic scales render; wired drill-down through memory                           |
| **Scale transitions**      | Instant city cuts; cosmic animated paths                                   | Bezier paths for galaxy/earth; instant swap megacity → memory                                  |
| **Districts in 3D**        | **1 full** — Reasoning District                                            | Reasoning district scene + 4 other zones as colored footprints on megacity map                 |
| **Other districts**        | Colored zone footprints on megacity map only                               | ✓ Footprints exist                                                                             |
| **Buildings**              | **1 fully modeled** — Planning Tower; 9 LOD footprints for city context    | Procedural tower mesh + 9 footprints; no glTF assets                                           |
| **Interior rooms**         | **3** in Planning Tower                                                    | 3 labeled room boxes in `RoomScene`                                                            |

### Agents & AI

| Item                           | Current (MVP)                                             | Built Today                                   |
| ------------------------------ | --------------------------------------------------------- | --------------------------------------------- |
| **Agent count**                | **50** — all in Reasoning District                        | ✓ 50 from seed via worldStore                 |
| **Agent roles**                | planner (20), simulator (10), debater (10), verifier (10) | ✓ Seed distribution                           |
| **Dialogue**                   | Text chat with streaming — **no voice**                   | ✓ WS primary + SSE fallback; stub/Ollama      |
| **Memory UI**                  | Timeline list — **no 3D force-directed graph**            | ✓ `MemoryTimeline` + `GET /agents/:id/memory` |
| **Simulation tick**            | **Off**                                                   | Off (correct)                                 |
| **Background agent inference** | **Off**                                                   | Off (correct)                                 |

### Platform & Access

| Item               | Current (MVP)                               | Built Today                          |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| **Authentication** | Anonymous only                              | ✓ No auth (correct)                  |
| **Governance**     | **None**                                    | ✓ None (correct)                     |
| **Realtime**       | WebSocket (agent status, dialogue, metrics) | ✓ `WorldGateway` at `/ws`            |
| **Deployment**     | Docker Compose (full stack)                 | ✓ `infra/docker-compose.yml` (8 svc) |

### Explicitly NOT Current (MVP Target)

These belong in [`../future-vision/`](../future-vision/) — do not implement for MVP:

- Full detail in Perception, Memory, Action, Self Improvement districts
- Governance UI, policy editing, governor role
- Simulation-driven world changes
- JWT / authenticated users
- Mobile-optimized UI
- 3D memory graph
- Training pipeline UI
- Agent counts above 50
- Semantic memory search (pgvector column exists; search endpoint deferred)

---

## References

- [`capabilities.md`](capabilities.md)
- [`../canonical-numbers.md`](../canonical-numbers.md)
- [`../roadmap/mvp.md`](../roadmap/mvp.md)
- [`../progress/master-progress.md`](../progress/master-progress.md)
- [`../adr/0016-galaxy-first-entry-and-scale-phasing.md`](../adr/0016-galaxy-first-entry-and-scale-phasing.md)
- [`../adr/0013-simulation-vs-governance-phasing.md`](../adr/0013-simulation-vs-governance-phasing.md)
