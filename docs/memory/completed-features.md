# Completed Features

> **Cursor Memory File** — Track what has been shipped.

---

## Documentation Phase (June 2026)

| Feature                        | Completed  | Notes                                              |
| ------------------------------ | ---------- | -------------------------------------------------- |
| Documentation foundation       | 2026-06-14 | Full `/docs` directory (98 files)                  |
| Documentation audit pass       | 2026-06-14 | Canonical numbers, ADRs 0006–0015, 7 feature specs |
| World bible (10 docs)          | 2026-06-14 | Includes agent-roles.md                            |
| Architecture docs (11 docs)    | 2026-06-14 | Includes api-contracts, scalability-plan           |
| Design system (7 docs)         | 2026-06-14 | Colors through UI principles                       |
| Roadmap (6 docs)               | 2026-06-14 | Vision through future                              |
| Memory system (7 docs)         | 2026-06-14 | Cursor-compatible context                          |
| Feature specs (16 docs)        | 2026-06-14 | All subsystems specified                           |
| Agent prompts (7 docs)         | 2026-06-14 | Role-specific AI prompts                           |
| ADRs (15 docs)                 | 2026-06-14 | 0001–0015                                          |
| Implementation readiness audit | 2026-06-14 | `docs/audit/implementation-readiness.md`           |
| Master progress report         | 2026-06-14 | `docs/progress/master-progress.md`                 |

---

## M1 Foundation (Partial — June 2026)

These items pass M1 deliverables but M1 as a whole is **not complete** (~55%). Full Docker Compose, CI, and Prometheus remain.

| Feature                          | Completed  | Notes                                                                  |
| -------------------------------- | ---------- | ---------------------------------------------------------------------- |
| Monorepo scaffold                | 2026-06-14 | npm workspace, Turbo, Husky, lint-staged, commitlint                   |
| `apps/web` (Next.js 16)          | 2026-06-14 | App Router; builds successfully; ~72 source files                      |
| `apps/api` (NestJS 11)           | 2026-06-14 | `/api/v1` REST foundation — 7 domain modules + PrismaModule            |
| `packages/shared`                | 2026-06-14 | Types, events, colors, constants — entity DTOs exported                |
| Health check endpoint            | 2026-06-14 | `GET /api/v1/health` → `ApiResponse<HealthResponse>`                   |
| Health check test                | 2026-06-14 | `health.controller.spec.ts` passes                                     |
| Districts read endpoint test     | 2026-06-14 | `districts.controller.spec.ts` — `GET /districts/reasoning`            |
| Prisma-backed entity queries     | 2026-06-14 | districts, buildings, agents, memory services + mappers; service specs |
| Prisma schema v1 + seed          | 2026-06-14 | 5 districts, 10 buildings, 50 agents; `apps/api/prisma/`               |
| Single R3F Canvas                | 2026-06-14 | `WorldCanvas.tsx` — ADR-0003 compliant                                 |
| SceneRouter (lazy scale loading) | 2026-06-14 | All 10 scale levels registered in `scene-loaders.ts`                   |
| Four Zustand stores              | 2026-06-14 | ADR-0004 structure; `navigationStore` functional                       |
| Camera system                    | 2026-06-14 | `CameraController`, `CameraRig`, per-scale presets                     |
| Scene graph registration         | 2026-06-14 | `SceneGraphManager`, `EntityNode`                                      |
| Scale transition controller      | 2026-06-14 | `ScaleTransitionController` + `transition-paths.ts`                    |
| Shared WebSocket event contracts | 2026-06-14 | Client/server shapes in `packages/shared/src/events.ts`                |

---

## Frontend 3D Scenes (Visual Stubs — June 2026)

Demo-geometry scenes that render but are not wired into a shippable MVP journey.

| Feature                             | Completed  | Notes                                                             |
| ----------------------------------- | ---------- | ----------------------------------------------------------------- |
| Megacity aerial view                | 2026-06-14 | 5 district zones on infinite grid                                 |
| Reasoning District scene            | 2026-06-14 | 10 building footprints + Planning Tower                           |
| Planning Tower exterior             | 2026-06-14 | Procedural mesh + window planes                                   |
| 3 interior rooms                    | 2026-06-14 | Strategy, Simulation, Review in `RoomScene`                       |
| Agent avatar swarm                  | 2026-06-16 | 50 `EntityNode` markers from `worldStore` in `AgentScene`         |
| Playwright E2E (galaxy-first)       | 2026-06-16 | `apps/web/e2e/galaxy-journey.spec.ts` + `@ci` megacity variant    |
| Memory timeline (mock)              | 2026-06-14 | 6 hardcoded 3D cards in `MemoryScene`                             |
| Earth view (frontend)               | 2026-06-14 | Globe, atmosphere shader, clouds, beacon, stations, HUD           |
| Galaxy view (frontend)              | 2026-06-14 | 50K instanced stars, mock systems, nebula, HUD                    |
| Orbital Ring scene                  | 2026-06-14 | Segments, tethers, zone markers                                   |
| Earth → Megacity / Ring transitions | 2026-06-14 | Animated paths with skip-after-500ms                              |
| Galaxy keyboard navigation          | 2026-06-14 | `G` / `Shift+1` via `useGalaxyNavigation`                         |
| URL scale param                     | 2026-06-14 | `?scale=earth` dev entry via `useScaleUrlParam`                   |
| Earth state types                   | 2026-06-14 | `EarthState` in `@ultron/shared`                                  |
| Mobile Earth variant                | 2026-06-14 | Reduced effects via `useIsMobileEarth`                            |
| Agent dialogue platform (Phoenix)   | 2026-06-16 | WS `/ws`, ModelRouter stub, SSE fallback, DialoguePanel streaming |

---

## Nexus — World Data & UI Shell (June 2026)

| Feature                       | Completed  | Notes                                                          |
| ----------------------------- | ---------- | -------------------------------------------------------------- |
| `GET /api/v1/ready`           | 2026-06-16 | DB connectivity; `ReadyController` + `HealthService`           |
| Navigation API (Prisma)       | 2026-06-16 | Breadcrumbs, hierarchy, entities per scale/focus               |
| Memory API slug lookup        | 2026-06-16 | `GET /agents/:slug/memory`                                     |
| Prometheus metrics            | 2026-06-16 | `/api/v1/metrics` + HTTP histogram interceptor                 |
| `worldStore` + `useWorldSync` | 2026-06-16 | Hydrates districts, buildings, rooms, agents from REST         |
| UI shell API integration      | 2026-06-16 | Breadcrumbs, BottomHUD aggregates, LeftSidebar hierarchy       |
| Memory timeline panel         | 2026-06-16 | `MemoryTimeline` in RightSidebar at memory scale               |
| Phoenix Talk handoff          | 2026-06-16 | `uiStore.openDialogue(agentUuid)` from RightSidebar            |
| GitLab CI foundation          | 2026-06-16 | `infra/.gitlab-ci.yml` — lint, typecheck, test, build          |
| Nexus QA scenarios            | 2026-06-16 | `docs/qa/nexus-scenarios.md` + `seed-invariants.nexus.spec.ts` |

---

## Not Yet Completed (MVP Blockers)

For tracking — these are **not** done:

- ~~UI shell (TopBar, sidebars, BottomHUD, DialoguePanel)~~ — shell + API hydration shipped (Nexus 2026-06-16)
- Megacity→agent drill-down navigation — largely wired (2026-06-14)
- ~~50 agents with dialogue + WebSocket streaming~~ — swarm UI + dialogue path shipped (2026-06-16)
- ~~Prisma + PostgreSQL + seed data + worldStore hydration~~ — shipped (Nexus 2026-06-16)
- Docker Compose — shipped; CI/CD foundation in `infra/.gitlab-ci.yml`; Grafana dashboards pending
- ~~LangGraph agent orchestrator + ModelRouter~~ — stub orchestrator + ModelRouter (Ollama/stub)
- ~~Memory service (backend + panel UI)~~ — timeline API + RightSidebar panel shipped (Nexus 2026-06-16)

---

## Governance (June 2026)

| Feature                     | Completed  | Notes                                                                                                                                                        |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Galaxy-first entry decision | 2026-06-16 | [Proposal 0001](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md) approved; [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) accepted |
| ADR-0016 Galaxy-first entry | 2026-06-16 | Supersedes ADR-0008 entry + cosmic transitions; [Proposal 0002](../proposals/0002-supersede-adr-0008-galaxy-entry.md)                                        |
| Galaxy-first Phase 1 polish | 2026-06-16 | Simulated HUD labels, scroll hints, GalaxyHUD mount, Sol marker focus                                                                                        |
| Galaxy-first roadmap        | 2026-06-16 | [`galaxy-first-roadmap.md`](./galaxy-first-roadmap.md) — Phase 1–3 sprint plan                                                                               |

---

_Update this file when features ship. Move items from active-work.md here._
