# Current Capabilities Matrix

> Status key: **Now** = exists in repo today · **MVP** = in scope for first ship · **No** = not current — see [`../future-vision/`](../future-vision/)

| Capability                                           | Status                     | Notes                                                                                     |
| ---------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| Monorepo (`apps/web`, `apps/api`, `packages/shared`) | **Now: Yes** · MVP: Yes    | Turbo + Husky + npm workspace; `packages/personality/` included                           |
| Shared types & WS event contracts                    | **Now: Yes** · MVP: Yes    | `@ultron/shared` — types, constants, events; WS gateway implemented                       |
| Single R3F Canvas + SceneRouter                      | **Now: Yes** · MVP: Yes    | ADR-0003 compliant; all 10 scales registered, 9 renderable                                |
| Four Zustand stores                                  | **Now: Yes** · MVP: Yes    | ADR-0004 — navigation, world, agent, ui all functional                                    |
| Camera & scale transitions                           | **Now: Yes** · MVP: Yes    | Animated cosmic paths + instant city cuts (ADR-0016 galaxy-first)                         |
| Megacity aerial view                                 | **Now: Yes** · MVP: Yes    | 5 district zones; drill-down to Reasoning path wired                                      |
| Reasoning District (full 3D)                         | **Now: Yes** · MVP: Yes    | Planning Tower + footprints; API/seed hydrated via worldStore                             |
| Other 4 districts (full 3D)                          | **No**                     | v1 — megacity footprints only                                                             |
| Planning Tower (exterior + 3 rooms)                  | **Now: Yes** · MVP: Yes    | Procedural mesh + 3 room boxes; portal transitions via navigation                         |
| Agent avatar (swarm)                                 | **Now: Yes** · MVP: Yes    | 50 agents from worldStore in `AgentScene`                                                 |
| 50 agents with dialogue                              | **Now: Yes** · MVP: Yes    | WS/SSE streaming; `DialoguePanel`; stub/Ollama `ModelRouter`                              |
| Agent memory timeline                                | **Now: Yes** · MVP: Yes    | `MemoryTimeline` panel + `GET /agents/:id/memory`; 3D memory scene stub                   |
| UI shell (TopBar, sidebars, HUD, dialogue)           | **Now: Yes** · MVP: Yes    | Full shell; Earth/Galaxy HUDs with API + mock fallback                                    |
| World navigation drill-down                          | **Now: Yes** · MVP: Yes    | 3D clicks + sidebar Enter; breadcrumbs API-backed with local fallback                     |
| REST API (domain modules)                            | **Now: Yes** · MVP: Yes    | `/api/v1` — health, ready, navigation, districts, buildings, agents, memory, world, earth |
| WebSocket realtime                                   | **Now: Yes** · MVP: Yes    | `WorldGateway` at `/ws` — dialogue, status, ping/pong                                     |
| Database + seed data                                 | **Now: Yes** · MVP: Yes    | Prisma v1 + idempotent seed; pgvector embedding column                                    |
| Docker deployment                                    | **Now: Yes** · MVP: Yes    | `infra/docker-compose.yml` — 8 services (+ optional Ollama profile)                       |
| CI/CD pipeline                                       | **Now: Yes** · MVP: Yes    | `infra/.gitlab-ci.yml` — lint, typecheck, test, build; e2e job (M2)                       |
| `@ultron/personality`                                | **Now: Yes** · MVP: Yes    | Prompt templates in `ModelRouterService`                                                  |
| Earth view                                           | **Now: Yes** · v1: Yes     | Full scene + HUD; `GET /earth/state` with mock fallback                                   |
| Solar System view                                    | **Now: Partial** · v1: Yes | `LockedScaleScene` placeholder only                                                       |
| Orbital Defense Ring                                 | **Now: Partial** · v1: Yes | Ring segments, tethers, zone markers; no DefenseHUD or API                                |
| Galaxy view                                          | **Now: Yes** · v2: Yes     | Spiral galaxy + HUD; `GET /star-systems` with mock fallback                               |
| 500 agents                                           | **No**                     | v1                                                                                        |
| 5,000 agents                                         | **No**                     | v2                                                                                        |
| Simulation tick                                      | **Now: Partial** · v1: Yes | 10s behavior + 60s macro ticks; run migration `20260705110000`                            |
| Authentication (JWT)                                 | **No**                     | v1 optional                                                                               |
| Governance UI                                        | **Now: Partial** · v2: Yes | Read-only GovernancePanel + policy API                                                    |
| Agent server movement                                | **Now: Partial** · v1: Yes | DB positions + WS sync + client interpolation                                             |
| Animated scale transitions (full stack)              | **Now: Partial** · v1: Yes | Cosmic paths built; city chain uses instant cuts                                          |
| 3D memory graph                                      | **No**                     | v2                                                                                        |
| Voice interaction                                    | **No**                     | Future vision                                                                             |
| Planetary simulation                                 | **No**                     | Future vision                                                                             |
| VR / AR                                              | **No**                     | Future vision                                                                             |
| 10,000+ agents                                       | **No**                     | Future vision                                                                             |
| Semantic memory search                               | **Now: Yes** · MVP: Yes    | `POST /agents/:id/memory/search` via pgvector (ADR-0017 Phase 1)                          |

When a capability moves from future to current, update this table **and** [`../future-vision/capabilities.md`](../future-vision/capabilities.md).
