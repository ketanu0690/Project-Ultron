# Current Scope

> **Current Reality** — not the full vision. For aspirational features see [`../future-vision/`](../future-vision/).

---

## Today (2026-06-14)

| Area                 | Reality                                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Codebase**         | Monorepo exists — `apps/web`, `apps/api`, `packages/shared` with Turbo, Husky, npm workspace                                                                                                       |
| **Frontend**         | Next.js 16 + R3F single Canvas; 9 of 10 scale scenes render (solar system is locked placeholder); Earth/Galaxy/Orbital Ring built ahead of MVP phase                                               |
| **Backend**          | NestJS 11 — `/api/v1` REST stubs (health, navigation, districts, buildings, agents, memory, world), `PrismaModule`, class-validator DTOs, `ApiResponse`/`ApiError` envelopes; no WebSocket gateway |
| **Shared contracts** | `@ultron/shared` exports types, constants, colors, WebSocket event shapes — consumed by web and api                                                                                                |
| **Deployment**       | None — `infra/` is `.gitkeep` only; no Docker Compose or CI pipeline                                                                                                                               |
| **3D world**         | Visual demo chain (megacity → memory) renders in isolation; no megacity→district→building drill-down wiring                                                                                        |
| **Agents**           | One capsule placeholder in `AgentScene`; no dialogue, no backend orchestrator                                                                                                                      |
| **Database**         | Prisma schema v1 + seed script (`apps/api/prisma/`); domain services not yet querying DB                                                                                                           |
| **Phase**            | **M1 Foundation partially complete (~55%)**; MVP critical path (UI shell, navigation wiring, WS, dialogue) not started                                                                             |

### What Exists in Code (Not Yet Shippable)

| Layer                  | Built                                                                                                                                              | Not Built                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `apps/web`             | `WorldCanvas`, `SceneRouter`, 4 Zustand stores (navigation functional), 5 controllers (3 functional), 4 hooks, Earth/Galaxy HUDs, ~72 source files | UI shell (`panels/`, `ui/` empty), drill-down navigation, WS sync, `api-client` usage |
| `apps/api`             | 7 domain modules, `PrismaModule`, 2 Jest specs, class-validator DTOs                                                                               | Wire services to Prisma seed, `GET /ready`, WebSocket                                 |
| `packages/shared`      | 13 source files — `ScaleLevel`, `Entity`, `DistrictId`, `EarthState`, WS events, camera constants                                                  | `district-themes.ts`, runtime agent/building types beyond stubs                       |
| `packages/personality` | Not created                                                                                                                                        | ADR-0012 package absent                                                               |

---

## MVP — First Shippable Target

What **must exist in the product** when MVP ships. This is the boundary for initial implementation — most items below are **targets, not current reality**.

### World & Navigation

| Item                       | Current (MVP)                                                           | Built Today                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Entry point**            | AI Megacity aerial view — **not** Galaxy, Solar System, or Earth        | Default scale is `megacity`; Earth/Galaxy reachable via dev shortcuts (`?scale=earth`, `G` key) — ahead of ADR-0008 |
| **Scale levels navigable** | **6** — Megacity → District → Building → Room → Agent → Memory timeline | All 6 scenes render via `SceneRouter`; no wired drill-down between city scales                                      |
| **Scale transitions**      | **Instant scene cuts** (< 500 ms) — no camera flights                   | Animated Bezier paths for Earth/Galaxy/Ring — ahead of ADR-0008                                                     |
| **Districts in 3D**        | **1 full** — Reasoning District                                         | Reasoning district scene + 4 other zones as colored footprints on megacity map                                      |
| **Other districts**        | Colored zone footprints on megacity map only                            | ✓ Footprints exist                                                                                                  |
| **Buildings**              | **1 fully modeled** — Planning Tower; 9 LOD footprints for city context | Procedural tower mesh + 9 footprints; no glTF assets                                                                |
| **Interior rooms**         | **3** in Planning Tower                                                 | 3 labeled room boxes in `RoomScene`                                                                                 |

### Agents & AI

| Item                           | Current (MVP)                                             | Built Today                                   |
| ------------------------------ | --------------------------------------------------------- | --------------------------------------------- |
| **Agent count**                | **50** — all in Reasoning District                        | 1 placeholder capsule                         |
| **Agent roles**                | planner (20), simulator (10), debater (10), verifier (10) | Not implemented                               |
| **Dialogue**                   | Text chat with streaming — **no voice**                   | Not implemented                               |
| **Memory UI**                  | Timeline list — **no 3D force-directed graph**            | 6 mock cards in 3D `MemoryScene`; no panel UI |
| **Simulation tick**            | **Off**                                                   | Off (correct)                                 |
| **Background agent inference** | **Off**                                                   | Off (correct)                                 |

### Platform & Access

| Item               | Current (MVP)                               | Built Today                          |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| **Authentication** | Anonymous only                              | ✓ No auth (correct)                  |
| **Governance**     | **None**                                    | ✓ None (correct)                     |
| **Realtime**       | WebSocket (agent status, dialogue, metrics) | Event types in `@ultron/shared` only |
| **Deployment**     | Docker Compose (full stack)                 | Not started                          |

### Explicitly NOT Current (MVP Target)

These belong in [`../future-vision/`](../future-vision/) — do not implement for MVP:

- Galaxy, Solar System, Earth, Orbital Defense Ring views _(note: frontend stubs exist early — reconcile via ADR proposal)_
- Full detail in Perception, Memory, Action, Self Improvement districts
- Animated scale transitions (Galaxy → Memory)
- Governance UI, policy editing, governor role
- Simulation-driven world changes
- JWT / authenticated users
- Mobile-optimized UI
- 3D memory graph
- Training pipeline UI
- Agent counts above 50

---

## References

- [`capabilities.md`](capabilities.md)
- [`../canonical-numbers.md`](../canonical-numbers.md)
- [`../roadmap/mvp.md`](../roadmap/mvp.md)
- [`../progress/master-progress.md`](../progress/master-progress.md)
- [`../adr/0008-mvp-entry-and-scale-stack.md`](../adr/0008-mvp-entry-and-scale-stack.md)
- [`../adr/0013-simulation-vs-governance-phasing.md`](../adr/0013-simulation-vs-governance-phasing.md)
