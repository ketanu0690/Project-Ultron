# Active Work

> **Cursor Memory File** — What is being worked on right now.

---

## Development Principle: UI First (2026-06-16)

**Status**: ✅ Adopted

The UI drives what gets built. Every feature starts from a screen, panel, or 3D flow; backend contracts and endpoints follow hooks and components — not the reverse.

| Doc                                                                                                                    | Purpose                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`ui-first-workflow.md`](./ui-first-workflow.md)                                                                       | Work order, contract worksheet, API audit table                                             |
| [`../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md`](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md) | **Approved** — Galaxy-first single entry (2026-06-16)                                       |
| [`galaxy-first-roadmap.md`](./galaxy-first-roadmap.md)                                                                 | Phase 1–3 sprint plan (cosmic entry → city chain → E2E)                                     |
| [`../proposals/0002-supersede-adr-0008-galaxy-entry.md`](../proposals/0002-supersede-adr-0008-galaxy-entry.md)         | **Approved** → [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) (2026-06-16) |

### Alignment snapshot

| Signal                           | UI-first?       | Notes                                                                                             |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| Galaxy scroll journey            | ✅ Yes          | Built ahead of backend; mock HUD data                                                             |
| Earth / Orbital Ring scenes      | ✅ Yes          | Earth HUD wired to `GET /earth/state`; Sun slider + Enter Brain City overlay removed (2026-06-17) |
| Megacity → memory drill-down     | ✅ Yes          | UI chain drove Nexus navigation + memory APIs                                                     |
| Dialogue + Memory panels         | ✅ Yes          | Phoenix/Nexus integrated from Talk / View Memory actions                                          |
| Full domain REST modules         | ⚠️ Partial      | Many endpoints exist with **no UI consumer** (see audit in `ui-first-workflow.md`)                |
| `shell-data.ts` static fallbacks | ⚠️ Reduced (M2) | LOD footprints only; entity detail from worldStore/API                                            |
| `AgentScene` single capsule      | ✅ Fixed        | 50 agents from `worldStore`; click selects `focusEntityId` (2026-06-16)                           |

**Canonical user path (Galaxy-first)**: galaxy scroll → earth → megacity → district → building → room → agent → Talk → View Memory. **Phase 1 (cosmic entry polish)** in progress — see [`galaxy-first-roadmap.md`](./galaxy-first-roadmap.md).

---

## Current Phase: M2 MVP Polish (In Progress)

**Status**: 🟡 In progress (2026-07-04) — M1 closed same day

M2 closes documentation drift, static-fallback debt, and QA automation gaps before MVP ship.

### M2 — Done (2026-07-04)

- [x] Reconcile [`docs/current-state/scope.md`](../current-state/scope.md) and [`capabilities.md`](../current-state/capabilities.md) with M1-complete reality
- [x] API ESLint strict-rule violations resolved (`tsconfig.spec.json` + test-file overrides in `eslint.config.mjs`)
- [x] `shell-data.ts` — removed static district/building/room/agent stubs; LOD footprints + structural constants only
- [x] Phoenix WS/SSE integration test — `apps/api/test/phoenix/dialogue.integration.spec.ts` (in-process Nest + mocked Prisma)
- [x] Nexus API contract test — `apps/api/test/nexus/api-contract.nexus.spec.ts`
- [x] Web store/breadcrumb Vitest — `apps/web/test/nexus/world-store.spec.ts`, `breadcrumb.spec.ts`
- [x] GitLab CI — `test:web` job; non-blocking `e2e:galaxy-journey` (`@ci` megacity variant)
- [x] Quality gates — `npm run lint`, `typecheck`, `test` (API 45/45, web 20/20), `build` all green

### M2 — Remaining

- [ ] Promote `e2e:galaxy-journey` from `allow_failure: true` to required gate after flake validation
- [ ] Full galaxy-scroll Playwright E2E (non-`@ci`) — nightly/manual only
- [ ] testcontainers / live-DB contract assertions (seed-invariants pattern retained)
- [ ] Per-district `DistrictScene` variants; room-scene agent markers (galaxy-first P2 backlog)

### Natural World Simulation (2026-07-05, parallel M2)

- [x] Proposal [`0004-natural-world-simulation-libraries.md`](../proposals/0004-natural-world-simulation-libraries.md) + WebGPU hero scope [`0005-webgpu-hero-fluids.md`](../proposals/0005-webgpu-hero-fluids.md)
- [x] Agent DB positions + `simulation` module (`AgentBehaviorService` 10s, `SimulationService` 60s, seeded `GovernanceService`)
- [x] WS `world:state` / `agent:status` / `simulation:tick` / `governance:policy` broadcast
- [x] Client `useWorldRealtime`, `AgentInterpolator`, `HologramAvatar`, `AgentMiniMap`, `GovernancePanel`
- [x] `three-mesh-bvh` camera collision; `@react-three/rapier` in `RoomScene`; `WebGpuFluidScene` on Observation Deck
- [ ] Run migration `20260705110000_agent_positions_and_simulation` + re-seed before live behavior tick
- [ ] Mixamo glTF walk/idle clips (asset pipeline; shader + procedural mesh in place)

---

## Previous Phase: M1 Foundation (Complete)

**Status**: ✅ Complete (2026-07-04) — started 2026-06-14

M1 exit criteria (_clone → `docker compose up` → health checks pass_) is **met**. Use `docker compose --env-file .env -f infra/docker-compose.yml up --build` and verify `GET /api/v1/health` and `GET /api/v1/ready`.

### M1 — Done

- [x] Monorepo scaffold (`apps/web`, `apps/api`, `packages/shared`, `packages/personality`) — npm workspace + Turbo + Husky
- [x] Next.js app with single R3F Canvas (`WorldCanvas`, `SceneRouter`)
- [x] Shared types package (`ScaleLevel`, `Entity`, `DistrictId`, `EarthState`, WS events, camera constants)
- [x] Shared entity DTOs (`District`, `Building`, `Room`, `Agent`, `AgentMemory`, `AgentRole`, `MemoryType`)
- [x] NestJS bootstrap + `GET /api/v1/health` with Jest spec (ApiResponse envelope)
- [x] **NestJS API foundation** — global `/api/v1` prefix, `ValidationPipe`, `HttpExceptionFilter` (`ApiError`), `PrismaModule`, domain stubs (navigation, world); Prisma-backed queries for districts, buildings, agents, memory
- [x] Four Zustand stores (ADR-0004 structure) — `navigationStore` functional
- [x] Camera system (`CameraController`, `CameraRig`, scale presets)
- [x] Scene graph registration (`SceneGraphManager`, `EntityNode`)
- [x] Scale transition controller (Bezier paths + instant cut fallback)
- [x] City-scale 3D scene stubs (megacity → district → building → room → agent → memory)
- [x] Earth, Galaxy, Orbital Ring scenes (ahead of documented phase — see ADR-0008 note)
- [x] **Prisma schema v1** — `districts`, `buildings`, `rooms`, `agents`, `agent_memories` with soft deletes (`apps/api/prisma/schema.prisma`)
- [x] **Seed script** — 5 districts, 10 buildings, 3 rooms, 50 agents (planner 20 / simulator 10 / debater 10 / verifier 10), 12 sample memories (`apps/api/prisma/seed.ts`)
- [x] **Full Docker Compose (8 services)** — `infra/docker-compose.yml`: web, api, postgres (pgvector), redis, minio, prometheus, grafana; optional `ollama` profile. API entrypoint runs `migrate deploy` + seed before NestJS. Run: `docker compose --env-file .env -f infra/docker-compose.yml up --build`
- [x] **`.env.example`** — documented variables at repo root (no secrets committed)
- [x] Migration applied locally — `20260614135948_init_mvp_entities`
- [x] **MVP navigation drill-down chain** — megacity → district → building → room → agent → memory via 3D clicks + RightSidebar Enter/Talk/View Memory; LOD footprint stubs; breadcrumb memory append; Escape deselect verified
- [x] **Scroll-driven galaxy journey** — default load `galaxy`; spiral galaxy visual (sboez/Galaxy MIT); wheel ladder galaxy → earth → megacity → 5 districts; `galaxy-to-earth` transition path
- [x] CI/CD pipeline — `infra/.gitlab-ci.yml` (npm ci, lint, typecheck, test, build)
- [x] Prometheus `/metrics` interceptor + HTTP histogram (`prom-client`)
- [x] Grafana dashboards — `infra/grafana/provisioning/dashboards/ultron-api.json` (request rate, latency, 5xx, up, RSS)
- [x] `packages/personality/` — `@ultron/personality` prompt templates wired into `ModelRouterService`
- [x] pgvector `embedding` column on `agent_memories` — migration `20260704140000_add_pgvector_embedding` (1536 dims)
- [x] Monorepo quality gates — `npm run lint`, `typecheck`, `test`, `build` all green

### M1 — Remaining

_None — M1 closed 2026-07-04. Next: M2 MVP polish (see Galaxy-first backlog below)._

---

## Previous Sprints (Complete)

### MVP Database Layer (2026-06-14)

**Status**: ✅ Complete

- [x] Prisma schema with MVP entities only (no floors, no dialogue tables)
- [x] Soft deletes (`deletedAt`) on all entity tables
- [x] Shared DTO exports in `@ultron/shared`
- [x] Idempotent seed with slug-based upserts
- [x] Local migrate + seed verified (districts: 5, buildings: 10, rooms: 3, agents: 50, memories: 12)

### Earth Scene (Frontend — ahead of v1 phase)

**Status**: ✅ Complete (2026-06-14)

- [x] `EarthScene` with procedural globe, atmosphere shader, cloud layer, night lights
- [x] `MegacityBeacon` and `GroundStation` markers with scale transitions
- [x] `EarthHUD` — planetary health metrics (Sun slider + Enter Brain City overlay removed 2026-06-17)
- [x] Animated transitions (`earth-to-megacity`, `earth-to-orbital_ring`) with skip after 500ms
- [x] `?scale=earth` URL param dev entry
- [x] `EarthState` types in `@ultron/shared`
- [x] Mobile static variant (no cloud animation / atmosphere shader)

- [x] `GET /earth/state` wired in `useEarthState` with mock fallback (2026-06-17)

**Deferred**: NASA/KTX2 textures, WS health polling

### Galaxy Scene (Frontend — ahead of v2 phase)

**Status**: ✅ Complete (2026-06-14)

- [x] Instanced star field, mock star systems, nebula background
- [x] `GalaxyHUD` overlay
- [x] Keyboard navigation (`G`, `Shift+1`)

- [x] `GET /star-systems` v2 API + `useGalaxyMetrics` hook (2026-06-17)

**Deferred**: Real solar system routing (Sol → `LockedScaleScene`)

### Scroll-Driven Galaxy Journey (2026-06-14)

**Status**: ✅ Complete

- [x] Spiral galaxy shaders ported from [sboez/Galaxy](https://github.com/sboez/Galaxy) (MIT) — `shaders/galaxy-spiral.ts`, `SpiralGalaxyField.tsx`
- [x] Default entry scale changed to `galaxy` (`navigationStore`, `SceneGraphManager`, `CameraController`)
- [x] Wheel ladder: galaxy → earth → megacity → 5 districts (`ScrollJourneyController`, `useScrollJourney`)
- [x] Zoom-gated cosmic scroll (2026-06-17): wheel dollies within galaxy/earth; scale step only at min/max dolly
- [x] Sidebar URL sync (`?scale=` / `?entity=`), Galaxy in hierarchy, React Flow-style zoom controls (2026-06-17)
- [x] `galaxy-to-earth` animated transition path; scroll hint in `BottomHUD`
- [x] `?scale=` URL param bypasses scroll journey; reload preserves deep link (2026-06-17)

**Attribution**: Galaxy spiral shaders adapted from sboez/Galaxy (MIT License), based on Three.js Journey.

**Deferred**: Per-district 3D geometry (all district scroll steps share Reasoning `DistrictScene` layout)

### MVP Navigation Drill-Down (2026-06-14)

**Status**: ✅ Complete

- [x] `DistrictScene` — Planning Tower click → `building` scale; LOD footprints select-only with sidebar stub
- [x] `BuildingScene` — tower click → `room` scale (focus `room-strategy`)
- [x] `RoomScene` — Strategy Room click → `agent` scale; other rooms select-only
- [x] `AgentScene` — agent click → `memory` scale
- [x] `RightSidebar` — scale-aware Enter via `getEnterNavigation()` (`lib/navigation-enter.ts`)
- [x] `shell-data.ts` — LOD footprints 1–9, `room-plan-vault`, `room-observation-deck` stubs
- [x] Breadcrumb trail includes Memory when at `memory` scale with agent focus

**Deferred**: Per-district scene variants (all districts currently share Reasoning district geometry)

### Documentation Foundation

**Status**: ✅ Complete (2026-06-14)

- [x] Full `/docs` directory (98 files), 15 ADRs, 16 feature specs
- [x] Canonical numbers, api-contracts, world bible, design system

---

## Next Sprint: Galaxy-First Backlog (Post-Integration)

**Target**: Polish cosmic entry (Phase 1), then close city-chain UI gaps (Phase 2–3). Full plan: [`galaxy-first-roadmap.md`](./galaxy-first-roadmap.md).

MVP exit criterion (_galaxy journey → megacity → Reasoning → Planning Tower → talk to agent → view memory_) is **partially wired** — city chain works; E2E must start from galaxy default.

### Priority order (Galaxy-first — UI → hook → contract → API)

| P         | UI surface / flow                     | Exists                          | Missing (UI-first)                                                                                                              | Backend needed                                   |
| --------- | ------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **P0**    | Galaxy/Earth entry polish             | Scenes + scroll journey         | HUD “simulated” labels; **zoom-gated scroll** (pan/zoom within scale, transition at dolly limits); megacity deck altitude clamp | None — mocks OK at MVP                           |
| **P0**    | E2E MVP journey (galaxy-first)        | Manual city path verified       | ✅ Playwright `apps/web/e2e/galaxy-journey.spec.ts`; `@ci` uses `?scale=megacity`                                               | None                                             |
| **P0**    | Agent selection in 3D                 | ~~1 hardcoded `agent-sigma-7`~~ | ✅ `AgentScene` swarm from `worldStore` (2026-06-16)                                                                            | Use hydrated store / `GET /districts/:id/agents` |
| **P1**    | Room scene agents                     | Strategy room only              | Show agent markers for room occupants                                                                                           | `GET /buildings/:id/agents`                      |
| **P1**    | Entity detail (sidebar/HUD)           | API + static fallback           | Remove `ENTITY_DETAILS` stubs; fail gracefully when store empty                                                                 | None — navigation bundle                         |
| **P1**    | Earth HUD contract worksheet          | Mock fallback only on API error | ✅ `GET /earth/state` wired (2026-06-17)                                                                                        | `GET /earth/state` (v1)                          |
| **P1**    | `api-endpoints.ts` hygiene            | Partial                         | Move `POST .../dialogue` from `useAgentDialogue` inline fetch                                                                   | Already implemented                              |
| **P2**    | Per-district scroll steps             | All use Reasoning geometry      | District-specific `DistrictScene` variants                                                                                      | Navigation bundle likely sufficient              |
| **P2**    | Agent status in HUD                   | Static from seed                | Live status chip on agent scale                                                                                                 | `GET /agents/:id/status`                         |
| **P2**    | Galaxy HUD contract worksheet         | Mock fallback only on API error | ✅ `GET /star-systems` + metrics (2026-06-17)                                                                                   | v2 star-system endpoints                         |
| **P2**    | ADR-0008 reconciliation               | Proposal 0002 approved          | ✅ [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) (2026-06-16)                                                 | Doc only                                         |
| **Defer** | Building/district metrics endpoints   | Backend exists                  | No HUD consumer                                                                                                                 | Until BottomHUD worksheet                        |
| **Defer** | `GET /world/state` + WS `world:state` | Partial backend                 | No UI subscriber                                                                                                                | Live metrics panel specced                       |

### Recommended next sprint sequence

1. ~~**Phase 1 — Cosmic entry polish (P0)**~~ — **In progress** (2026-06-16): HUD simulated labels, scroll hints, GalaxyHUD mount.
2. ~~**Agent swarm UI (P0)**~~ — ✅ `AgentScene` reads `worldStore.agents` (2026-06-16).
3. ~~**E2E automation (P0)**~~ — ✅ Playwright primary + `@ci` megacity variant (2026-06-16).
4. ~~**Static fallback removal (P1)**~~ — ✅ LOD-only fallbacks in `shell-data.ts` (2026-07-04 M2).
5. **Earth HUD worksheet → v1 API (P1)** — only after fields locked in UI-first worksheet.
6. ~~**ADR-0016 review (P2)**~~ — ✅ Approved 2026-06-16 ([ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md)).

### Completed integration (reference)

- ~~Megacity drill-down~~ — ✅ 3D clicks + sidebar Enter chain through memory (2026-06-14)
- ~~WebSocket gateway~~ — ✅ `WorldGateway` at `/ws`, `agent:dialogue` events (Phoenix 2026-06-16)
- ~~Agent dialogue backend~~ — ✅ `POST /agents/:id/dialogue` + SSE (Phoenix 2026-06-16)
- ~~Memory service~~ — ✅ `GET /agents/:id/memory` + `MemoryTimeline` (Nexus 2026-06-16)

### Integration checkpoint (2026-06-16)

**Status**: ✅ Phoenix + Nexus integrated — MVP critical path wired

- [x] RightSidebar **Talk** → `openDialogue()` → `uiStore` → `DialoguePanel` + `useAgentDialogue` WS/SSE
- [x] Breadcrumb `entityId` slugs align with navigation focus + memory API (`agent-sigma-7`, etc.)
- [x] Dialogue agent ref: slug (breadcrumbs/focus) or UUID (Talk when `worldStore` hydrated); API accepts both
- [x] `GET /ready`, navigation by slug, memory by slug verified against rebuilt Docker stack
- [x] `npm run typecheck` — all packages pass; `npm test` — 30/30 pass
- [x] `npm run lint` — all packages pass (API spec overrides + `tsconfig.spec.json`, 2026-07-04 M2)
- [x] E2E Playwright automation — specs in `apps/web/e2e/`; CI `e2e:galaxy-journey` job wired (non-blocking, 2026-07-04 M2)

**Fixes applied at integration**

- `worldStore.getEntityDetail` resolves agent UUID → slug (DialoguePanel display name)
- `slugOrUuidWhere` util — Prisma queries no longer cast slugs against UUID columns (navigation 500 fix)
- `agents.controller` missing `Body` import; `TooManyRequestsException` → `HttpException` (typecheck)

**Manual E2E path (Galaxy-first — primary)**

1. Default load at **Galaxy**; scroll through Earth to **Megacity**
2. Reasoning District → Planning Tower → Strategy Room → `agent-sigma-7`
3. **Talk** opens `DialoguePanel`, streams via WS (SSE fallback)
4. **View Memory** → `memory` scale; `MemoryTimeline` loads `GET /agents/agent-sigma-7/memory`

**Manual E2E shortcut (CI fast variant)**: `?scale=megacity` → same city chain from step 2.

### Blockers

- ~~Domain REST modules must consume Prisma seed data before frontend can hydrate `worldStore`~~ — done (Nexus)
- ~~UI shell must land before dialogue UX is testable end-to-end~~ — done
- API ESLint strict violations ~~block `npm run lint` CI gate~~ — resolved 2026-07-04 M2

### Notes

- `worldStore`, `agentStore`, `uiStore` wired to REST + WS (Nexus + Phoenix 2026-06-16)
- pgvector column + `POST /agents/:id/memory/search` shipped — ADR-0017 Phase 1 (2026-07-04)
- Galaxy-first entry **approved** — [`docs/proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md`](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md); formalized in [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md)

---

## Living World — ADR-0017 Phase 1 (In Progress)

**Status**: 🟡 In progress (2026-07-04) — [Proposal 0003](../proposals/0003-autonomous-living-world.md) approved → [ADR-0017](../adr/0017-autonomous-living-world.md)

**MVP unchanged** per ADR-0013 — no simulation tick, no background autonomy.

### Phase 1 scope

- [x] Real LangGraph dialogue graph (`retrieveMemory` → `storeMemory`; respond streamed via ModelRouter)
- [x] `EmbeddingService` + pgvector semantic search
- [x] `POST /api/v1/agents/:id/memory/search`
- [x] Episodic memory write after completed dialogue turn
- [x] Reflection job (every 10 episodic memories → semantic summary)
- [x] LangGraph checkpoint tables migration
- [ ] Integration tests for memory search + dialogue memory write
- [ ] Phase 2: agent-behavior tick + server-authoritative movement

---

**Status**: ✅ Complete — integrated with Nexus (2026-06-16)

### Decisions (Phase 2 — confirmed)

| Question   | Decision                                                                |
| ---------- | ----------------------------------------------------------------------- |
| Inference  | Ollama if `OLLAMA_BASE_URL` set, else deterministic stub echo           |
| Transport  | WebSocket primary + REST SSE fallback (ADR-0015)                        |
| Talk entry | `openDialogue(agentId)` exported from `@/lib/open-dialogue` for Nexus   |
| Limits     | 120 WS msg/min anonymous; 10K max message (api-contracts + realtime.md) |

### Done

- [x] `apps/api/src/modules/ai/` — ModelRouter stub + AgentOrchestrator (LangGraph stub)
- [x] `apps/api/src/modules/realtime/` — WorldGateway (`/ws`), DialogueService, `POST /agents/:id/dialogue` + SSE
- [x] Phoenix Jest tests — `apps/api/test/phoenix/*.spec.ts`
- [x] `agentStore` — messages, streaming, sessionId
- [x] `useAgentDialogue` hook — WS connect + SSE fallback
- [x] `DialoguePanel` — streaming UI, public warning, mobile bottom sheet
- [x] `docs/qa/phoenix-scenarios.md` — Gherkin handoff

### Remaining

- [x] Run `npm install` at repo root (WS deps added to `@ultron/api`)
- [x] Nexus: wire RightSidebar Talk → `openDialogue(agentId)` — `getAgentUuid` + `openDialogue` (2026-06-16)
- [x] Integration test: in-process Nest WS handshake — `dialogue.integration.spec.ts` (2026-07-04 M2)
- [ ] E2E Playwright — open dialogue, send, assert streamed text (panel visibility covered by `@ci` spec)

### Nexus dependency

- ~~RightSidebar **Talk** button should call `openDialogue(agentId)`~~ — wired via `getAgentUuid` + `openDialogue` (2026-06-16 QA re-audit)

---

## Phoenix QA — Realtime & Agent Dialogue (2026-06-16)

**Status**: 🟡 Scenarios ready — core Dev verified; integration + contract tests landed (2026-07-04 M2)

**Deliverables**

- [x] Phase 1 requirements read (ADR-0005, ADR-0015, api-contracts, agent-system, ui-shell Dialogue)
- [x] Test pyramid + CI mock strategy (`docs/qa/phoenix-scenarios.md`)
- [x] Gherkin scenarios (streaming, SSE fallback, warning, WS lifecycle, errors, a11y)
- [x] Unit tests — `apps/api/test/phoenix/` — runs in default `npm test`
- [x] Integration tests — `apps/api/test/phoenix/dialogue.integration.spec.ts` (WS + SSE, in-process)
- [ ] E2E — `apps/web/e2e/` dialogue send/assert streamed text (galaxy-journey covers Talk open + `@ci` path)

**Blockers (resolved by Phoenix Dev 2026-06-16)**

- ~~`POST /agents/:id/dialogue` → 501~~ → implemented with JSON session + SSE stream
- ~~No WS gateway~~ → `WorldGateway` at `/ws`
- ~~DialoguePanel send disabled~~ → wired via `useAgentDialogue`
- ~~agentStore scaffold~~ → streaming state added
- ~~No ModelRouter stub~~ → Ollama + stub echo
- ~~No `useAgentDialogue` hook~~ → added

**QA decisions (pending Dev confirm)**

- CI: `MODEL_ROUTER_MODE=stub` only; assert protocol not LLM content
- Integration: in-process NestJS WS; nightly E2E via Docker Compose
- Latency MVP: first token ≤ 2000 ms (from agent-system acceptance criteria)

---

## Nexus QA Sprint (2026-06-16)

**Status**: 🟡 In Progress — scenarios + seed invariant + contract tests  
**Branch**: `feat/nexus/qa-shell-integration` (when automation lands)

### Scope

Test World Data & UI Shell Integration per `docs/qa/nexus-scenarios.md`:

- REST contract matrix (districts, buildings, agents read, memory, navigation, world, health/ready)
- E2E: drill-down, breadcrumb ascend, View Memory timeline
- CI: pipeline must pass on Nexus MRs

### Done

- [x] Phase 1 requirements read (`ui-shell`, `world-navigation`, `memory-system`, `api-contracts`, seed)
- [x] Phase 5 Gherkin scenarios — `docs/qa/nexus-scenarios.md`
- [x] Seed invariant tests — `apps/api/test/nexus/seed-invariants.nexus.spec.ts`

### Remaining

- [ ] Phase 2 decisions locked (Postgres testcontainers for live seed contract; functional-only visual; axe in CI)
- [ ] `useBreadcrumbSync` hook integration test (store tests cover breadcrumb builder + worldStore)

### M2 automation landed (2026-07-04)

- [x] `api-contract.nexus.spec.ts` — in-process Nest + mocked Prisma
- [x] Jest `roots` in `apps/api/package.json` picks up `test/nexus/` and `test/phoenix/`
- [x] `infra/.gitlab-ci.yml` — `test:api`, `test:web`, `e2e:galaxy-journey` (allow_failure)
- [x] Playwright `e2e/galaxy-journey.spec.ts` — shell + View Memory (`@ci` megacity variant)
- [x] Vitest `test/nexus/*.spec.ts` for `worldStore` + `buildBreadcrumbs`

### Phase 2 QA decisions (recommended)

| Question          | Decision                                         | Rationale                                          |
| ----------------- | ------------------------------------------------ | -------------------------------------------------- |
| Test DB           | Ephemeral Postgres (testcontainers / CI service) | `testing-standards.mdc`; Prisma + pgvector path    |
| Visual regression | Functional only for MVP                          | ADR-0014 — 3D/FPS manual; shell via DOM assertions |
| WCAG AA           | axe in Playwright CI + manual 3D checklist       | Automate shell chrome; canvas not axe-scannable    |

### Dependencies on Nexus Dev

- `GET /ready` implementation
- `worldStore` hydration wired to `api-client`
- `shell-data.ts` migration to API-backed entity detail
- Memory timeline UI consuming `GET /agents/:id/memory`

### Dependencies on Phoenix (out of scope)

- `POST /agents/:id/dialogue`, WS streaming, `DialoguePanel` tokens

---

## Nexus Sprint — World Data & UI Shell (2026-06-16)

**Status**: ✅ Complete (2026-06-16)  
**Branch**: `feat/nexus/world-data-ui-shell`

### Decisions (Phase 2 defaults)

- BottomHUD city metrics: **API aggregates** from seed (fallback to static when API unavailable)
- LeftSidebar tree: **full megacity hierarchy** from navigation API; Reasoning path fully expanded
- CI platform: **GitLab CI** (`infra/.gitlab-ci.yml`)
- Memory UI: **RightSidebar section** when at `memory` scale (list, expandable rows)

### Done

- [x] `GET /api/v1/ready` — DB connectivity check
- [x] Navigation service wired to Prisma (breadcrumbs, hierarchy, entities)
- [x] Memory service accepts agent slug or UUID
- [x] Prometheus `/metrics` + HTTP histogram interceptor (`prom-client`)
- [x] Jest specs: districts, memory, navigation, health + `seed-invariants.nexus.spec.ts` (skips without DB)
- [x] `api-endpoints.ts` typed fetch helpers
- [x] `worldStore` hydration + `useWorldSync`
- [x] `useBreadcrumbSync` — API breadcrumbs with local fallback
- [x] `MemoryTimeline` panel + View Memory flow
- [x] Talk → `uiStore.openDialogue(agentUuid)` (Phoenix handoff)
- [x] BottomHUD megacity metrics from API aggregates
- [x] LeftSidebar hierarchy from API
- [x] `docs/qa/nexus-scenarios.md`
- [x] `infra/.gitlab-ci.yml` — lint, typecheck, test, build
- [x] Verified: `npm test --workspace @ultron/api` (30/30), `@ultron/web typecheck` pass

### Remaining (follow-up)

- [x] E2E with live API + Docker Compose — manual API verification done (2026-06-16 integration checkpoint)
- [ ] Web Vitest/Playwright automation — Playwright E2E + Vitest store/breadcrumb tests landed (2026-07-04 M2); `useBreadcrumbSync` hook integration test still deferred
- [x] Monorepo `npm run typecheck` — passes after integration fixes (2026-06-16)

### Phoenix integration point

- `RightSidebar` **Talk** sets `uiStore.dialogueOpen` + `dialogueAgentId` (agent UUID)
- Phoenix implements `DialoguePanel` streaming; Nexus does not modify `DialoguePanel.tsx` logic

---

_Update this file at the start and end of every work session._
