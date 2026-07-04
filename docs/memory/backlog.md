# Backlog

> **Cursor Memory File** — Complete implementation backlog sorted by execution order.  
> Estimates: **XS** (<1d) · **S** (1–2d) · **M** (3–5d) · **L** (1–2w) · **XL** (2w+)  
> Priority: **P0** blocker · **P1** MVP · **P2** v1 · **P3** v2 · **P4** future  
> Source of truth for numbers: `docs/canonical-numbers.md`

---

## Order 1 — Epic: Foundation & Monorepo

### Feature: Monorepo Scaffold

| #   | Task                                                                                      | Estimate | Dependencies  | Priority | Acceptance Criteria                                           |
| --- | ----------------------------------------------------------------------------------------- | -------- | ------------- | -------- | ------------------------------------------------------------- |
| 1.1 | Initialize npm workspace root (`package.json`, `package-lock.json`, `turbo.json`)         | S        | -             | P0       | `npm install` succeeds; workspaces resolve                    |
| 1.2 | Scaffold `apps/web` (Next.js 15 App Router, TypeScript strict)                            | M        | 1.1           | P0       | Dev server starts; `/` renders placeholder                    |
| 1.3 | Scaffold `apps/api` (NestJS strict, health module)                                        | M        | 1.1           | P0       | API starts; `GET /health` returns 200                         |
| 1.4 | Scaffold `packages/shared` with initial exports (`ScaleLevel`, `DistrictId`, event types) | M        | 1.1           | P0       | Both apps import `@ultron/shared` without error               |
| 1.5 | Scaffold `packages/personality` (prompt templates from `Personality/`)                    | S        | 1.1           | P1       | Personality strings importable from shared package            |
| 1.6 | Configure ESLint, Prettier, TypeScript project references across workspace                | M        | 1.2, 1.3, 1.4 | P0       | `npm run lint` and `npm run typecheck` pass on empty scaffold |
| 1.7 | Add path aliases (`@/` in web, module paths in api)                                       | S        | 1.2, 1.3      | P0       | Imports resolve in IDE and CI                                 |

### Feature: Development Environment

| #    | Task                                                                   | Estimate | Dependencies | Priority | Acceptance Criteria                        |
| ---- | ---------------------------------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------ |
| 1.8  | Create `docker-compose.yml` (postgres, redis, minio, ollama, api, web) | M        | 1.2, 1.3     | P0       | `docker compose up` starts all services    |
| 1.9  | Add `.env.example` with documented variables (no secrets committed)    | XS       | 1.8          | P0       | New dev can copy env and boot stack        |
| 1.10 | Wire hot-reload dev scripts (`npm run dev` runs web + api)             | S        | 1.8          | P0       | Code change reloads without manual restart |
| 1.11 | Add Dockerfiles for `web` and `api`                                    | M        | 1.8          | P1       | Images build in CI                         |

### Feature: CI/CD Pipeline

| #    | Task                                               | Estimate | Dependencies | Priority | Acceptance Criteria                               |
| ---- | -------------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------------- |
| 1.12 | GitLab CI: lint, typecheck, test stages            | M        | 1.6          | P0       | Pipeline runs on every MR                         |
| 1.13 | GitLab CI: build web + api + shared packages       | M        | 1.11, 1.12   | P1       | Build artifacts produced on main                  |
| 1.14 | Add testcontainers setup for API integration tests | M        | 1.3, 1.12    | P1       | Integration test runs against real Postgres in CI |

### Feature: Observability Foundation

| #    | Task                                            | Estimate | Dependencies | Priority | Acceptance Criteria                        |
| ---- | ----------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------ |
| 1.15 | Prometheus metrics interceptor on NestJS        | S        | 1.3          | P1       | `/metrics` exposes HTTP latency histograms |
| 1.16 | Grafana dashboard for API health + request rate | M        | 1.15, 1.8    | P1       | Dashboard loads in docker-compose Grafana  |
| 1.17 | Structured JSON logging (no PII) in API         | S        | 1.3          | P1       | Logs parseable; secrets never logged       |

**Epic exit criteria (M1):** Developer clones repo, runs `docker compose up`, health checks pass, CI green.

---

## Order 2 — Epic: Data Layer & API Core

### Feature: Database Schema & Migrations

| #   | Task                                                                                    | Estimate | Dependencies | Priority | Acceptance Criteria                           |
| --- | --------------------------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------------- |
| 2.1 | Design Prisma schema (districts, buildings, floors, rooms, agents, memories, dialogues) | L        | 1.8          | P0       | Schema matches `database.md` entity model     |
| 2.2 | Add soft-delete columns (`deletedAt`) on all user-facing entities                       | S        | 2.1          | P0       | Queries filter deleted records by default     |
| 2.3 | Enable pgvector extension; add embedding column on `agent_memories`                     | S        | 2.1          | P0       | Migration applies; vector column indexed      |
| 2.4 | Create indexes on foreign keys and common query filters                                 | M        | 2.1          | P0       | EXPLAIN shows index use on navigation queries |
| 2.5 | Prisma migrate dev workflow documented in README                                        | XS       | 2.1          | P1       | Fresh DB migrates without manual steps        |

### Feature: Seed Data (MVP)

| #    | Task                                                                      | Estimate | Dependencies | Priority | Acceptance Criteria                           |
| ---- | ------------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------------- |
| 2.6  | Seed 5 district zones (Reasoning fully populated; others as metadata)     | M        | 2.1          | P0       | `GET /districts` returns 5 districts          |
| 2.7  | Seed 10 buildings in Reasoning (1 full Planning Tower + 9 LOD footprints) | M        | 2.6          | P0       | Building count matches `canonical-numbers.md` |
| 2.8  | Seed 3 rooms in Planning Tower                                            | S        | 2.7          | P0       | Rooms queryable via building API              |
| 2.9  | Seed 50 agents (20 planner, 10 simulator, 10 debater, 10 verifier)        | M        | 2.6          | P0       | Agent roles and district assignment correct   |
| 2.10 | Seed initial agent memories (5,000 rows target per canonical-numbers)     | M        | 2.9, 2.3     | P1       | Memory API returns chronological list         |

### Feature: REST API — Navigation & Entities

| #    | Task                                                                  | Estimate | Dependencies | Priority | Acceptance Criteria                                                   |
| ---- | --------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------------------------------------- |
| 2.11 | Implement `NavigationModule` — `GET /api/v1/navigation/:scale`        | M        | 2.1, 2.6     | P0       | Returns entities for megacity, district, building, room, agent scales |
| 2.12 | Implement `DistrictsModule` CRUD read endpoints                       | M        | 2.6          | P0       | Endpoints match `api-contracts.md`                                    |
| 2.13 | Implement `BuildingsModule` (detail, floors, rooms, agents, metrics)  | M        | 2.7          | P0       | Planning Tower fully queryable                                        |
| 2.14 | Implement `AgentsModule` (list, detail, status)                       | M        | 2.9          | P0       | 50 agents returned with role and position                             |
| 2.15 | Add global validation pipe (class-validator DTOs)                     | S        | 2.11         | P0       | Invalid params return 400 with structured error                       |
| 2.16 | Add global exception filter and error response shape                  | S        | 2.11         | P0       | All errors follow consistent JSON schema                              |
| 2.17 | Generate OpenAPI spec from controllers (or manual from api-contracts) | M        | 2.11–2.14    | P1       | OpenAPI validates against documented contracts                        |

### Feature: Anonymous Session & Rate Limiting

| #    | Task                                                          | Estimate | Dependencies | Priority | Acceptance Criteria                                |
| ---- | ------------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------------- |
| 2.18 | Implement `POST /auth/anonymous` with HttpOnly session cookie | M        | 2.11         | P0       | Anonymous session created; cookie set per ADR-0007 |
| 2.19 | Rate limit middleware per session (dialogue + API)            | M        | 2.18         | P0       | Limits match `api-contracts.md`; 429 on exceed     |

---

## Order 3 — Epic: Realtime & Client Foundation

### Feature: WebSocket Gateway

| #   | Task                                                        | Estimate | Dependencies | Priority | Acceptance Criteria                                               |
| --- | ----------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------------------------------------------- |
| 3.1 | Implement `WorldGateway` with session validation on connect | M        | 2.18         | P0       | WS connects with valid session; 4001 on invalid                   |
| 3.2 | Implement `world:state` diff broadcast channel              | L        | 3.1, 2.11    | P0       | Clients receive entity diffs, not full state dumps                |
| 3.3 | Implement `nav:subscribe` / `nav:ack` subscription protocol | M        | 3.1          | P0       | Client subscribes to scale; ack on reconnect per scalability-plan |
| 3.4 | Implement `agent:status` broadcast (position, status)       | M        | 3.1, 2.14    | P0       | Status updates pushed on agent state change                       |
| 3.5 | Implement `building:metrics` broadcast                      | S        | 3.1, 2.13    | P1       | Window glow metric updates via WS                                 |
| 3.6 | Redis pub/sub fan-out for multi-node readiness              | M        | 3.2, 1.8     | P1       | Pub/sub channels match `api-contracts.md` naming                  |

### Feature: Shared Client Infrastructure

| #    | Task                                                           | Estimate | Dependencies | Priority | Acceptance Criteria                                         |
| ---- | -------------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------------------------------------- |
| 3.7  | Create REST API client in `apps/web/lib/`                      | M        | 2.11, 1.4    | P0       | Typed fetch wrappers for all MVP endpoints                  |
| 3.8  | Create WebSocket client with reconnect + snapshot on reconnect | M        | 3.1, 1.4     | P0       | Reconnect restores state within 5s                          |
| 3.9  | Implement four Zustand stores (world, navigation, agent, ui)   | M        | 3.7, 3.8     | P0       | Stores match ADR-0004; narrow selectors documented          |
| 3.10 | Implement `useWorldSync` hook (REST initial load + WS diffs)   | M        | 3.9, 3.2     | P0       | World store updates from server diffs; server authoritative |
| 3.11 | Add district theme configs to `@ultron/shared`                 | M        | 1.4          | P0       | Themes match `design-system/district-themes.md`             |

### Feature: UI Shell (MVP)

| #    | Task                                                                 | Estimate | Dependencies | Priority | Acceptance Criteria                                   |
| ---- | -------------------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------------------------------- |
| 3.12 | Build `GlassPanel`, `StatusBadge` base components                    | M        | 1.2          | P0       | WCAG AA contrast; `prefers-reduced-motion` respected  |
| 3.13 | Build `TopBar` with breadcrumbs and scale badge                      | M        | 3.12, 3.9    | P0       | Breadcrumb reflects MVP navigation levels (ADR-0008)  |
| 3.14 | Build `BottomHUD` with scale-specific metrics                        | M        | 3.13, 3.9    | P0       | Metrics table per `ui-shell.md` for each scale        |
| 3.15 | Build `RightSidebar` (entity detail, Enter/Talk/View Memory actions) | M        | 3.12, 3.9    | P0       | Opens on select; closes on Escape                     |
| 3.16 | Build `LeftSidebar` hierarchy tree                                   | M        | 3.9, 3.13    | P0       | Tree navigates via instant cut; Tab toggles           |
| 3.17 | Build `DialoguePanel` container (streaming placeholder)              | M        | 3.12         | P0       | Opens on Talk; public visibility warning on first use |
| 3.18 | Wire keyboard shortcuts (Escape, Tab, ?)                             | S        | 3.13–3.17    | P1       | Shortcuts overlay lists all bindings                  |
| 3.19 | Root layout: shell + dynamic Canvas slot (≥70% viewport)             | M        | 3.13, 1.2    | P0       | First paint < 1s without 3D loaded                    |

### Feature: 3D Canvas Foundation

| #    | Task                                                                    | Estimate | Dependencies | Priority | Acceptance Criteria                                       |
| ---- | ----------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------------------------- |
| 3.20 | Single persistent `<Canvas>` via `next/dynamic` (`ssr: false`)          | M        | 1.2          | P0       | One Canvas; no SSR errors                                 |
| 3.21 | Renderer config (ACES tone mapping, pixelRatio cap 2)                   | S        | 3.20         | P0       | Matches `rendering.md` baseline config                    |
| 3.22 | Implement `SceneRouter` (swap scenes by `navigationStore.currentScale`) | M        | 3.20, 3.9    | P0       | Scale change swaps scene without remounting Canvas        |
| 3.23 | Implement `CameraController` (non-React class)                          | M        | 3.20         | P0       | Orbit/pan/zoom works at all MVP scales                    |
| 3.24 | Implement `InputController` (click pick → selection)                    | M        | 3.23, 3.9    | P0       | Click entity updates `navigationStore.focusEntityId`      |
| 3.25 | Implement `LODManager` skeleton                                         | M        | 3.20         | P1       | LOD levels assignable; distance table from `rendering.md` |
| 3.26 | Add `@react-three/perf` dev overlay                                     | XS       | 3.20         | P1       | FPS visible in development builds                         |

---

## Order 4 — Epic: MVP World Content

### Feature: Megacity Aerial View

| #   | Task                                                     | Estimate | Dependencies | Priority | Acceptance Criteria                          |
| --- | -------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------- |
| 4.1 | Build `MegacityScene` with 5 district zone footprints    | L        | 3.22, 3.11   | P0       | All 5 zones visible; Reasoning highlighted   |
| 4.2 | Implement `DistrictZone` ground planes with theme colors | M        | 4.1          | P0       | Zones match district theme primary colors    |
| 4.3 | District boundary gradient shader between zones          | M        | 4.1          | P1       | Visible boundary at aerial zoom              |
| 4.4 | Megacity entry route (`/` → `/world/megacity`)           | S        | 4.1, 3.13    | P0       | MVP entry is Megacity, not Galaxy (ADR-0008) |
| 4.5 | Click district zone → instant cut to district scale      | M        | 4.1, 3.22    | P0       | Transition < 500 ms perceived                |

### Feature: Reasoning District

| #    | Task                                                       | Estimate | Dependencies | Priority | Acceptance Criteria                            |
| ---- | ---------------------------------------------------------- | -------- | ------------ | -------- | ---------------------------------------------- |
| 4.6  | Build `DistrictScene` with Reasoning theme (lighting, fog) | L        | 4.5, 3.11    | P0       | District lighting profile applied on entry     |
| 4.7  | Place 9 LOD building footprints from API seed data         | M        | 4.6, 3.10    | P0       | Footprints visible; not full interior          |
| 4.8  | District ground shader and ambient audio hook              | M        | 4.6          | P1       | Ambient loop plays; respects mute preference   |
| 4.9  | District HUD metrics wired to live data                    | S        | 4.6, 3.14    | P0       | Agent count and throughput shown in bottom HUD |
| 4.10 | Frustum culling for district buildings                     | M        | 4.6, 3.25    | P1       | Off-screen buildings not rendered              |

### Feature: Planning Tower (Building System MVP)

| #    | Task                                                                            | Estimate | Dependencies | Priority | Acceptance Criteria                          |
| ---- | ------------------------------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------- |
| 4.11 | Create/import Planning Tower exterior glTF                                      | L        | 4.6          | P0       | Exterior renders with Reasoning materials    |
| 4.12 | Implement `WindowGlow` shader driven by `building:metrics` WS                   | M        | 4.11, 3.5    | P0       | Window intensity reflects utilization metric |
| 4.13 | Build interior scene with 3 rooms (Strategy Room, Plan Vault, Observation Deck) | L        | 4.11         | P0       | 3 rooms navigable; matches canonical-numbers |
| 4.14 | Portal transition exterior → interior (instant cut MVP)                         | M        | 4.11, 4.13   | P0       | Enter building < 2 s                         |
| 4.15 | Floor/room selector in right sidebar                                            | M        | 4.13, 3.15   | P0       | Sidebar switches active room                 |
| 4.16 | Place agent stations in rooms from API positions                                | M        | 4.13, 3.10   | P0       | Agents appear in correct rooms               |

### Feature: Agent Avatars (MVP — 50)

| #    | Task                                                      | Estimate | Dependencies | Priority | Acceptance Criteria                          |
| ---- | --------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------- |
| 4.17 | Build `AgentNode` holographic avatar with district shader | L        | 4.6, 3.11    | P0       | Avatars visible; Reasoning-colored           |
| 4.18 | Status particle effects (idle, thinking, acting)          | M        | 4.17         | P0       | Status change triggers visual effect         |
| 4.19 | Sync agent positions from `agent:status` WS               | M        | 4.17, 3.4    | P0       | Positions match server on connect and update |
| 4.20 | Click agent → profile in right sidebar                    | S        | 4.17, 3.15   | P0       | Agent detail shows role, status, model       |
| 4.21 | Double-click agent → open dialogue panel                  | S        | 4.17, 3.17   | P0       | Dialogue panel opens with agent context      |
| 4.22 | Performance gate: 50 agents ≥ 30 FPS P50 desktop          | M        | 4.17–4.19    | P0       | Manual milestone check on reference hardware |

### Feature: World Navigation (MVP)

| #    | Task                                                | Estimate | Dependencies | Priority | Acceptance Criteria                              |
| ---- | --------------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------------ |
| 4.23 | Implement instant scene cuts for all MVP scale hops | M        | 3.22, 3.9    | P0       | Megacity → District → Building → Room → Agent    |
| 4.24 | Breadcrumb ascend navigation (click parent)         | S        | 3.13, 4.23   | P0       | Click breadcrumb navigates up one level          |
| 4.25 | Back button reverses navigation stack               | S        | 4.23         | P0       | Back returns to previous scale/entity            |
| 4.26 | 3D selection syncs with sidebar hierarchy           | M        | 3.16, 3.24   | P0       | Select in 3D highlights tree node and vice versa |
| 4.27 | Search input placeholder (disabled, tooltip "v1")   | XS       | 3.13         | P1       | Tooltip shown on focus per ui-shell spec         |

---

## Order 5 — Epic: AI & Dialogue (MVP)

### Feature: Agent Orchestration Backend

| #   | Task                                                             | Estimate | Dependencies | Priority | Acceptance Criteria                                  |
| --- | ---------------------------------------------------------------- | -------- | ------------ | -------- | ---------------------------------------------------- |
| 5.1 | Implement `ModelRouter` (OpenRouter primary, Ollama fallback)    | L        | 1.8, 2.14    | P0       | Routes by config; no direct LLM calls outside router |
| 5.2 | Implement LangGraph planner graph for Reasoning agents           | L        | 5.1          | P0       | Graph invokes; streams tokens                        |
| 5.3 | Agent orchestrator with session pooling (≤10 concurrent MVP)     | M        | 5.2          | P0       | Concurrent limit enforced per canonical-numbers      |
| 5.4 | Inference budget counters in Redis (daily per session)           | M        | 5.1, 2.19    | P0       | Budget caps match canonical-numbers MVP column       |
| 5.5 | Integrate `@ultron/personality` prompts into agent system prompt | S        | 5.2, 1.5     | P1       | Agent voice matches Personality docs                 |

### Feature: Agent Dialogue (Streaming)

| #    | Task                                                         | Estimate | Dependencies   | Priority | Acceptance Criteria                            |
| ---- | ------------------------------------------------------------ | -------- | -------------- | -------- | ---------------------------------------------- |
| 5.6  | Implement `agent:dialogue` WS channel (send + stream tokens) | L        | 3.1, 5.3       | P0       | Protocol matches ADR-0015 / api-contracts      |
| 5.7  | Dialogue session lifecycle (create, stream, complete, error) | M        | 5.6            | P0       | Sessions cleaned up; errors surfaced to UI     |
| 5.8  | Tool call cards inline in dialogue panel                     | M        | 5.6, 3.17      | P0       | Tool invocations render as cards during stream |
| 5.9  | Persist dialogue messages to PostgreSQL                      | M        | 5.6, 2.1       | P0       | Messages queryable; soft-delete respected      |
| 5.10 | Wire dialogue panel to WS streaming                          | M        | 5.6, 3.17, 3.9 | P0       | First token < 2 s P95                          |
| 5.11 | Public visibility warning on first dialogue                  | XS       | 5.10           | P0       | Warning shown once per session (ADR-0007)      |

### Feature: Memory System (MVP Timeline)

| #    | Task                                                                  | Estimate | Dependencies | Priority | Acceptance Criteria                                 |
| ---- | --------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------------------- |
| 5.12 | Implement `MemoryService` (CRUD + list by agent)                      | M        | 2.1, 2.10    | P0       | `GET /agents/:id/memory` returns chronological list |
| 5.13 | Implement `EmbeddingService` (text-embedding-3-small via ModelRouter) | M        | 5.1, 5.12    | P0       | Embeddings stored in pgvector column                |
| 5.14 | Auto-create episodic memory after each dialogue session               | M        | 5.9, 5.12    | P0       | New memory row after completed dialogue             |
| 5.15 | Build `MemoryTimeline` panel component                                | M        | 5.12, 3.15   | P0       | List with expand; episodic + semantic types         |
| 5.16 | Wire "View Memory" from agent profile                                 | S        | 5.15, 4.20   | P0       | Memory retrieval < 1 s                              |
| 5.17 | Memory count and stats in agent profile sidebar                       | S        | 5.15         | P1       | Stats visible without opening full timeline         |

---

## Order 6 — Epic: MVP Launch

### Feature: Integration Testing & QA

| #   | Task                                                           | Estimate | Dependencies   | Priority | Acceptance Criteria                       |
| --- | -------------------------------------------------------------- | -------- | -------------- | -------- | ----------------------------------------- |
| 6.1 | API integration tests for navigation, agents, dialogue, memory | L        | 2.11–2.14, 5.6 | P0       | ≥80% coverage on API services             |
| 6.2 | Store unit tests with mock WS payloads                         | M        | 3.9, 3.10      | P1       | Sync handlers tested for diff application |
| 6.3 | End-to-end smoke test: Megacity → agent dialogue → memory      | M        | 4._, 5._       | P0       | Automated or scripted walkthrough passes  |
| 6.4 | Load test: 50 concurrent WS connections                        | M        | 3.1, 1.8       | P1       | No connection drops; latency acceptable   |

### Feature: MVP Deployment

| #   | Task                                                     | Estimate | Dependencies | Priority | Acceptance Criteria                          |
| --- | -------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------- |
| 6.5 | Production docker-compose / Coolify deployment config    | M        | 1.8, 1.11    | P0       | Full stack deploys per deployment.md         |
| 6.6 | Environment secrets via env vars (JWT, OpenRouter, DB)   | S        | 6.5          | P0       | No secrets in images or repo                 |
| 6.7 | Client FPS sampling to Prometheus (1% production sample) | M        | 3.20, 1.15   | P1       | FPS metrics visible in Grafana               |
| 6.8 | MVP demo recording and milestone sign-off                | S        | 6.3          | P0       | Recorded walkthrough meets MVP exit criteria |
| 6.9 | Update README per ADR-0006 (ULTRON AI WORLD alignment)   | S        | 6.8          | P1       | README reflects product scope                |

**MVP exit criteria (M2):** User flies into Reasoning District, enters Planning Tower, talks to agent, views memory. Scene load < 5 s; 50 agents ≥ 30 FPS; docker compose cold start < 3 min.

---

## Order 7 — Epic: v1 Macro Navigation

### Feature: Solar System View

| #   | Task                                                   | Estimate | Dependencies | Priority | Acceptance Criteria                                 |
| --- | ------------------------------------------------------ | -------- | ------------ | -------- | --------------------------------------------------- |
| 7.1 | Build `SolarSystemScene` with simplified orbital paths | L        | 3.22         | P2       | Planets orbit; Earth marked as entry                |
| 7.2 | Solar System navigation API endpoint                   | M        | 2.11         | P2       | `GET /navigation/solar-system` returns system state |
| 7.3 | Click Earth → transition to Earth scale                | M        | 7.1, 7.4     | P2       | v1 animated transition < 3 s                        |

### Feature: Earth View

| #   | Task                                                                 | Estimate | Dependencies | Priority | Acceptance Criteria                      |
| --- | -------------------------------------------------------------------- | -------- | ------------ | -------- | ---------------------------------------- |
| 7.4 | Build `EarthScene` (atmosphere shader, cloud layer, megacity beacon) | L        | 3.22         | P2       | Globe rotates; beacon visible            |
| 7.5 | Earth navigation API + world state hooks                             | M        | 2.11         | P2       | Planetary health drives texture vitality |
| 7.6 | Click megacity beacon → transition to Megacity                       | M        | 7.4, 4.1     | P2       | Animated transition < 3 s                |

### Feature: Orbital Defense Ring

| #   | Task                                             | Estimate | Dependencies | Priority | Acceptance Criteria                         |
| --- | ------------------------------------------------ | -------- | ------------ | -------- | ------------------------------------------- |
| 7.7 | Build `OrbitalRingScene` with instanced segments | L        | 3.22         | P2       | Segments render with defense_readiness glow |
| 7.8 | Orbital ring navigation API                      | M        | 2.11         | P2       | Segment status queryable                    |
| 7.9 | Ring → Earth / Megacity navigation links         | M        | 7.7          | P2       | Transitions connect to macro stack          |

### Feature: Animated Scale Transitions (v1)

| #    | Task                                                             | Estimate | Dependencies | Priority | Acceptance Criteria                                |
| ---- | ---------------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------------- |
| 7.10 | Implement `ScaleTransitionController` with Bezier camera paths   | XL       | 3.23, 3.22   | P2       | Flights < 3 s P95; preload destination             |
| 7.11 | Skip transition button (visible after 500 ms)                    | S        | 7.10         | P2       | Skip instantly completes transition                |
| 7.12 | Replace MVP instant cuts with animated transitions (city-scale+) | M        | 7.10, 4.23   | P2       | Macro hops animated; micro hops may remain instant |
| 7.13 | Bookmarks in `navigationStore`                                   | M        | 3.9, 7.10    | P2       | Saved locations persist for authenticated users    |

---

## Order 8 — Epic: v1 City Expansion

### Feature: Remaining Four Districts

| #   | Task                                                    | Estimate | Dependencies  | Priority | Acceptance Criteria                          |
| --- | ------------------------------------------------------- | -------- | ------------- | -------- | -------------------------------------------- |
| 8.1 | Perception District scene + theme                       | L        | 4.6, 3.11     | P2       | Unique theme per design-system               |
| 8.2 | Memory District scene + theme                           | L        | 4.6, 3.11     | P2       | Unique theme; memory tower visual            |
| 8.3 | Action District scene + theme                           | L        | 4.6, 3.11     | P2       | Unique theme; activity effects               |
| 8.4 | Self Improvement District scene + theme                 | L        | 4.6, 3.11     | P2       | Unique theme; training building placeholders |
| 8.5 | District weather particle systems (4 districts)         | L        | 8.1–8.4       | P2       | Weather per district-themes spec             |
| 8.6 | District procgen: 40 buildings per district (200 total) | XL       | 8.1–8.4, 2.1  | P2       | 200 buildings seeded; 25 types               |
| 8.7 | District HUD for all 5 districts                        | M        | 8.1–8.4, 3.14 | P2       | Health, throughput, agent count per district |

### Feature: Building System (v1 Scale)

| #    | Task                                                             | Estimate | Dependencies | Priority | Acceptance Criteria                       |
| ---- | ---------------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------------------- |
| 8.8  | LOD pipeline: footprint → simplified → detailed → interior       | L        | 3.25, 4.11   | P2       | LOD switches at distances in rendering.md |
| 8.9  | 24 additional building type models (25 total types)              | XL       | 8.8          | P2       | Each type has exterior; 1+ room interior  |
| 8.10 | Building state visuals (active, degraded, offline, constructing) | M        | 8.8          | P2       | States match building-system spec table   |
| 8.11 | Cutaway view for floor selection                                 | M        | 8.8, 3.15    | P2       | Floor highlight in 3D on sidebar select   |
| 8.12 | Corridor walk mode between rooms                                 | L        | 8.9          | P2       | Walk mode navigates interior graph        |
| 8.13 | MinIO + CDN asset pipeline for glTF at v1                        | L        | 1.8, 8.9     | P2       | Assets served from CDN; compressed glTF   |

### Feature: District Transit

| #    | Task                                            | Estimate | Dependencies | Priority | Acceptance Criteria                     |
| ---- | ----------------------------------------------- | -------- | ------------ | -------- | --------------------------------------- |
| 8.14 | Monorail transit lines between district centers | M        | 4.1, 8.1–8.4 | P2       | Transit paths visible at megacity scale |
| 8.15 | Transit stations at district boundaries         | M        | 8.14         | P2       | Stations clickable for district jump    |

---

## Order 9 — Epic: v1 Agents & Simulation

### Feature: Agent Scale-Up (500 Agents)

| #   | Task                                                           | Estimate | Dependencies | Priority | Acceptance Criteria                                |
| --- | -------------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------------------- |
| 9.1 | Seed 450 additional agents per v1 distribution table           | M        | 2.9, 8.6     | P2       | 500 total; district counts match canonical-numbers |
| 9.2 | Expand orchestrator pool to ≤50 concurrent active              | M        | 5.3          | P2       | Pool limit enforced                                |
| 9.3 | Role-based avatar shapes by agent role                         | M        | 4.17         | P2       | Distinct silhouettes per role category             |
| 9.4 | Agent movement between rooms (visual)                          | L        | 4.19, 9.1    | P2       | Position updates animate smoothly                  |
| 9.5 | Task delegation API + UI (`POST /agents/:id/delegate`)         | L        | 5.3, 2.14    | P2       | Interactor+ can delegate; WS notifies              |
| 9.6 | Agent follow camera mode                                       | M        | 3.23, 4.17   | P2       | Camera tracks selected agent                       |
| 9.7 | Agent swarm rendering plan (dots on mini-map for off-viewport) | M        | 9.1          | P2       | 500 agents ≥ 30 FPS desktop                        |

### Feature: Simulation Engine (v1)

| #    | Task                                                                  | Estimate | Dependencies   | Priority | Acceptance Criteria                               |
| ---- | --------------------------------------------------------------------- | -------- | -------------- | -------- | ------------------------------------------------- |
| 9.8  | `SimulationService` with Bull 60s cron tick                           | L        | 1.8, 2.1       | P2       | Tick runs every 60 s reliably                     |
| 9.9  | `GovernanceService` seeded policies (read-only API)                   | M        | 9.8            | P2       | Policies queryable; no UI at v1 (ADR-0013)        |
| 9.10 | `PolicyEvaluator` (JSON Logic) during tick                            | L        | 9.8, 9.9       | P2       | Policies affect simulation outcomes               |
| 9.11 | `EventGenerator` with configurable event types                        | M        | 9.8            | P2       | Random events injected per spec                   |
| 9.12 | World state variables update + snapshot storage                       | M        | 9.8, 2.1       | P2       | Snapshots in `world_state_snapshots`              |
| 9.13 | `simulation:tick` and `simulation:event` WS broadcasts                | M        | 9.8, 3.1       | P2       | Visual indicators update within 1 tick            |
| 9.14 | Simulation event feed in sidebar UI                                   | M        | 9.13, 3.15     | P2       | Last 50 events visible                            |
| 9.15 | Wire world state variables to visual effects (Earth, buildings, ring) | L        | 9.13, 7.4, 7.7 | P2       | prosperity, defense_readiness, etc. drive visuals |
| 9.16 | Simulation tick processing < 5 s                                      | M        | 9.8            | P2       | Tick completes within SLA                         |

---

## Order 10 — Epic: v1 Platform Features

### Feature: Search System

| #    | Task                                               | Estimate | Dependencies | Priority | Acceptance Criteria                              |
| ---- | -------------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------------ |
| 10.1 | PostgreSQL full-text search (tsvector + GIN index) | M        | 2.1, 9.1     | P2       | Indexes on agent, building, room, district names |
| 10.2 | `GET /api/v1/search?q=&type=&limit=20`             | M        | 10.1         | P2       | Response shape matches search-system spec        |
| 10.3 | Enable top-bar search (replace MVP placeholder)    | M        | 10.2, 3.13   | P2       | Debounce 300 ms; min 2 chars                     |
| 10.4 | Search results UI with keyboard navigation         | M        | 10.3         | P2       | `/` focuses; ↑↓ navigates; Enter selects         |
| 10.5 | Quick-jump navigation on result select             | M        | 10.4, 7.10   | P2       | "Sigma" finds agent; "Planning" finds tower      |
| 10.6 | Search p95 < 500 ms with 500 agents, 200 buildings | M        | 10.2         | P2       | Load test confirms SLA                           |

### Feature: Authentication (v1)

| #     | Task                                                                | Estimate | Dependencies | Priority | Acceptance Criteria                        |
| ----- | ------------------------------------------------------------------- | -------- | ------------ | -------- | ------------------------------------------ |
| 10.7  | JWT access (15 min) + refresh token (7 days) rotation               | L        | 2.18         | P2       | Tokens issued; refresh rotates on use      |
| 10.8  | Optional registration (email/password or OAuth — decision required) | L        | 10.7         | P2       | Login optional; anonymous remains default  |
| 10.9  | Role assignment (Interactor default; Governor assignable by admin)  | M        | 10.7         | P2       | Permission matrix matches auth-access spec |
| 10.10 | WS auth via session cookie or JWT Authorization header              | M        | 10.7, 3.1    | P2       | Both auth modes work on WS                 |
| 10.11 | Higher rate limits for authenticated users                          | S        | 10.7, 2.19   | P2       | Limits match canonical-numbers v1 column   |
| 10.12 | Bookmarks require Interactor role                                   | S        | 10.9, 7.13   | P2       | Anonymous cannot persist bookmarks         |

### Feature: Mobile UI (v1)

| #     | Task                                        | Estimate | Dependencies | Priority | Acceptance Criteria                             |
| ----- | ------------------------------------------- | -------- | ------------ | -------- | ----------------------------------------------- |
| 10.13 | Responsive layout breakpoints (< 768 px)    | M        | 3.19         | P2       | Shell adapts without horizontal scroll          |
| 10.14 | Bottom sheet for dialogue (not modal)       | M        | 3.17, 10.13  | P2       | Full-screen bottom sheet on mobile per ui-shell |
| 10.15 | Touch gestures for camera (pinch zoom, pan) | M        | 3.23, 10.13  | P2       | 3D navigable on touch devices                   |
| 10.16 | Mobile FPS gate: ≥ 24 FPS P50               | M        | 10.13, 4.22  | P2       | Acceptable on mid-range mobile                  |

### Feature: v1 Launch

| #     | Task                                      | Estimate | Dependencies | Priority | Acceptance Criteria                                      |
| ----- | ----------------------------------------- | -------- | ------------ | -------- | -------------------------------------------------------- |
| 10.17 | v1 integration test suite expansion       | L        | 7._–10._     | P2       | Critical paths covered                                   |
| 10.18 | Load test: 1,000 concurrent users         | L        | 6.4, 9.\*    | P2       | 99.5% uptime target in staging                           |
| 10.19 | v1 deployment (1–2 API nodes, CDN assets) | M        | 6.5, 8.13    | P2       | Production matches v1 infra table                        |
| 10.20 | v1 demo recording and milestone sign-off  | S        | 10.17        | P2       | Earth → any district → building → room → agent in < 30 s |

**v1 exit criteria (M3):** Full city navigation, 500 agents, 200 buildings, simulation tick, search, auth, mobile.

---

## Order 11 — Epic: v2 Cosmic Scale

### Feature: Galaxy View

| #    | Task                                                         | Estimate | Dependencies    | Priority | Acceptance Criteria                    |
| ---- | ------------------------------------------------------------ | -------- | --------------- | -------- | -------------------------------------- |
| 11.1 | Build `GalaxyScene` (50,000 instanced stars, system markers) | XL       | 3.22            | P3       | Stars render with instancing; ≥ 30 FPS |
| 11.2 | Galaxy navigation API                                        | M        | 2.11            | P3       | Star systems queryable                 |
| 11.3 | Galaxy → Solar System animated transition                    | L        | 11.1, 7.1, 7.10 | P3       | < 3 s per hop                          |
| 11.4 | Full breadcrumb: Galaxy › … › Memory                         | M        | 3.13, 11.3      | P3       | Complete 10-level trail                |

### Feature: Full-Stack Transitions (v2)

| #    | Task                                                       | Estimate | Dependencies | Priority | Acceptance Criteria           |
| ---- | ---------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------- |
| 11.5 | Extend `ScaleTransitionController` for all 10 scale levels | L        | 7.10         | P3       | Galaxy → Memory path animated |
| 11.6 | Agent → Memory graph transition                            | M        | 11.5, 12.1   | P3       | Smooth entry to memory view   |
| 11.7 | Mini-map at city scale                                     | M        | 4.1, 9.7     | P3       | 5,000 agent dots on mini-map  |

---

## Order 12 — Epic: v2 Memory Graph

### Feature: Memory Graph (3D)

| #    | Task                                                      | Estimate | Dependencies | Priority | Acceptance Criteria                    |
| ---- | --------------------------------------------------------- | -------- | ------------ | -------- | -------------------------------------- |
| 12.1 | Vector similarity search on agent memories                | L        | 5.13         | P3       | Semantic queries return ranked results |
| 12.2 | Force-directed graph layout algorithm                     | L        | 12.1         | P3       | Layout stable for 10K nodes            |
| 12.3 | Build `MemoryGraph` Three.js scene (nodes, edges)         | L        | 3.22, 12.2   | P3       | Graph renders < 3 s for 10K nodes      |
| 12.4 | Graph interaction (pan, zoom, orbit, node click → detail) | M        | 12.3         | P3       | Node click opens memory detail panel   |
| 12.5 | Filter by type and date range                             | M        | 12.3, 3.15   | P3       | Filters update graph in real time      |
| 12.6 | `GET /agents/:id/memory/graph` API                        | M        | 12.1         | P3       | Graph data endpoint for large graphs   |

---

## Order 13 — Epic: v2 Governance & Defense

### Feature: Governance UI (v2)

| #    | Task                                                                   | Estimate | Dependencies | Priority | Acceptance Criteria                     |
| ---- | ---------------------------------------------------------------------- | -------- | ------------ | -------- | --------------------------------------- |
| 13.1 | Policy list + detail views in Council Hall building                    | L        | 9.9, 8.9     | P3       | Policies readable by all users          |
| 13.2 | Governor: propose and edit policies (`PATCH /governance/policies/:id`) | L        | 13.1, 10.9   | P3       | Only Governor+ can edit                 |
| 13.3 | Council chamber visualization (agents deliberating)                    | L        | 13.1, 4.17   | P3       | Visual linked to simulation state       |
| 13.4 | Decision history timeline (90-day retention)                           | M        | 13.1         | P3       | History queryable and displayed         |
| 13.5 | Policy change → world visual update within 1 tick                      | M        | 13.2, 9.13   | P3       | District pulse on policy change         |
| 13.6 | `governance:policy` WS event                                           | S        | 13.2, 3.1    | P3       | Clients receive policy diffs            |
| 13.7 | Emergency override flow (admin only)                                   | M        | 13.2         | P3       | Override audited and visually indicated |

### Feature: Orbital Defense System (v2)

| #     | Task                                            | Estimate | Dependencies | Priority | Acceptance Criteria             |
| ----- | ----------------------------------------------- | -------- | ------------ | -------- | ------------------------------- |
| 13.8  | Threat detection module in API                  | L        | 9.8, 7.8     | P3       | Threats generated and tracked   |
| 13.9  | Threat trajectory visualization on orbital ring | L        | 13.8, 7.7    | P3       | Trajectories visible in 3D      |
| 13.10 | Alert beacons and defense_readiness WS updates  | M        | 13.8, 3.1    | P3       | Alerts visible within 1 tick    |
| 13.11 | Defense events in simulation feed               | S        | 13.8, 9.14   | P3       | Threat events appear in sidebar |

---

## Order 14 — Epic: v2 Agent Swarm & Training

### Feature: Agent Scale-Up (5,000 Agents)

| #    | Task                                               | Estimate | Dependencies | Priority | Acceptance Criteria                      |
| ---- | -------------------------------------------------- | -------- | ------------ | -------- | ---------------------------------------- |
| 14.1 | Seed 4,500 additional agents per v2 distribution   | L        | 9.1          | P3       | 5,000 total per canonical-numbers        |
| 14.2 | Expand orchestrator pool to ≤200 concurrent active | M        | 9.2          | P3       | Pool limit enforced                      |
| 14.3 | Swarm LOD renderer (full / LOD / dot by viewport)  | XL       | 9.7, 3.25    | P3       | 5,000 agents ≥ 30 FPS with swarm rules   |
| 14.4 | Multi-agent debate in amphitheater scene           | L        | 14.1, 5.6    | P3       | Multiple agents stream in shared session |
| 14.5 | Agent reputation scores                            | M        | 14.1, 5.12   | P3       | Scores visible in profile                |
| 14.6 | Agent personality evolution metadata               | M        | 14.1         | P3       | Evolution tracked across dialogues       |

### Feature: Training Pipeline (v2)

| #     | Task                                                    | Estimate | Dependencies | Priority | Acceptance Criteria                      |
| ----- | ------------------------------------------------------- | -------- | ------------ | -------- | ---------------------------------------- |
| 14.7  | Bull `training` queue with GPU worker (Ollama CUDA)     | L        | 1.8, 8.4     | P3       | Jobs queue; concurrency 2                |
| 14.8  | Training job API (`POST/GET /training/jobs`)            | M        | 14.7         | P3       | Jobs monitorable                         |
| 14.9  | Training progress visualization (loss curve as terrain) | L        | 14.8, 8.4    | P3       | Crucible glow = progress                 |
| 14.10 | Evaluation Arena with benchmark scores                  | L        | 14.8         | P3       | Scores displayed on hologram leaderboard |
| 14.11 | Model genealogy tree in Genealogy Lab                   | L        | 14.8         | P3       | 3D tree of model versions                |
| 14.12 | Promotion Gate: Governor approve/reject model promotion | L        | 14.8, 13.2   | P3       | Promoted model used within 1 tick        |
| 14.13 | Rollback via Action District Rollback Station           | M        | 14.12        | P3       | Previous model restored on rollback      |

---

## Order 15 — Epic: v2 Platform & History

### Feature: Event Sourcing & Replay

| #    | Task                                                        | Estimate | Dependencies | Priority | Acceptance Criteria                 |
| ---- | ----------------------------------------------------------- | -------- | ------------ | -------- | ----------------------------------- |
| 15.1 | World state event log (append-only)                         | L        | 9.12         | P3       | Events stored with tick ID          |
| 15.2 | Historical replay API (`GET /simulation/history?from=&to=`) | M        | 15.1         | P3       | Time range queryable                |
| 15.3 | Replay scrubber UI                                          | L        | 15.2, 3.15   | P3       | Scrub simulation history in sidebar |

### Feature: Infrastructure Scaling (v2)

| #    | Task                                        | Estimate | Dependencies | Priority | Acceptance Criteria            |
| ---- | ------------------------------------------- | -------- | ------------ | -------- | ------------------------------ |
| 15.4 | PostgreSQL read replica setup               | M        | 2.1, 6.5     | P3       | Read queries routed to replica |
| 15.5 | Redis Cluster (3 nodes)                     | L        | 1.8, 3.6     | P3       | Failover tested                |
| 15.6 | Scale API to 3+ nodes behind load balancer  | L        | 6.5, 3.6     | P3       | 10,000 concurrent users target |
| 15.7 | 2+ Ollama GPU nodes with job routing        | L        | 14.7, 5.1    | P3       | Inference distributed          |
| 15.8 | CDN-backed object storage for all 3D assets | M        | 8.13         | P3       | Assets served globally         |

### Feature: v2 Launch

| #     | Task                                                     | Estimate | Dependencies | Priority | Acceptance Criteria      |
| ----- | -------------------------------------------------------- | -------- | ------------ | -------- | ------------------------ |
| 15.9  | v2 load test: 10,000 concurrent users, 50K dialogues/day | XL       | 15.6         | P3       | 99.9% uptime in staging  |
| 15.10 | Full galaxy → memory journey test (< 60 s)               | M        | 11._, 12._   | P3       | Journey completable      |
| 15.11 | v2 demo recording and milestone sign-off                 | S        | 15.10        | P3       | All v2 exit criteria met |

**v2 exit criteria (M4):** Galaxy → memory navigation, governance UI, 5,000 agents, simulation, training pipeline, defense system.

---

## Order 16 — Epic: Future (P4 — Not Scheduled)

### Feature: Platform Expansion

| #    | Task                        | Estimate | Dependencies | Priority | Acceptance Criteria                    |
| ---- | --------------------------- | -------- | ------------ | -------- | -------------------------------------- |
| 16.1 | VR / WebXR mode             | XL       | 15.11        | P4       | Headset navigation prototype           |
| 16.2 | User-created districts      | XL       | 15.11        | P4       | Architect role creates custom district |
| 16.3 | Multi-city expansion        | XL       | 16.2         | P4       | Second city navigable                  |
| 16.4 | Agent marketplace           | XL       | 15.11        | P4       | Agents tradable/deployable by users    |
| 16.5 | Real-world data integration | L        | 9.8          | P4       | External data feeds simulation         |
| 16.6 | Educational curriculum mode | L        | 15.11        | P4       | Guided tours and lesson paths          |
| 16.7 | Loki log aggregation        | M        | 1.17         | P4       | Centralized logs in Grafana stack      |

---

## Summary Counts

| Phase               | Epics  | Features | Tasks    | Priority |
| ------------------- | ------ | -------- | -------- | -------- |
| Foundation (M1)     | 1      | 4        | 17       | P0–P1    |
| Data & API          | 1      | 4        | 19       | P0–P1    |
| Realtime & Client   | 1      | 4        | 26       | P0–P1    |
| MVP World           | 1      | 5        | 27       | P0–P1    |
| AI & Dialogue       | 1      | 3        | 17       | P0–P1    |
| MVP Launch          | 1      | 2        | 9        | P0–P1    |
| v1 Macro Nav        | 1      | 4        | 13       | P2       |
| v1 City             | 1      | 3        | 15       | P2       |
| v1 Agents & Sim     | 1      | 2        | 16       | P2       |
| v1 Platform         | 1      | 4        | 20       | P2       |
| v2 Cosmic           | 1      | 2        | 7        | P3       |
| v2 Memory           | 1      | 1        | 6        | P3       |
| v2 Gov & Defense    | 1      | 2        | 11       | P3       |
| v2 Swarm & Training | 1      | 2        | 13       | P3       |
| v2 Platform         | 1      | 3        | 11       | P3       |
| Future              | 1      | 1        | 7        | P4       |
| **Total**           | **16** | **42**   | **~224** | —        |

---

## Open Decisions (Blockers)

| Decision                                 | Blocks Tasks | Target            |
| ---------------------------------------- | ------------ | ----------------- |
| Auth provider: custom JWT vs OAuth2/OIDC | 10.8         | Before v1 sprint  |
| 3D asset pipeline: Blender vs procedural | 4.11, 8.9    | Before M2         |
| CDN provider                             | 8.13, 15.8   | Before v1 deploy  |
| Vector DB migration (pgvector vs Qdrant) | 12.1         | Before 1M vectors |

---

_Reprioritize at each milestone review. Update `active-work.md` with in-progress tasks._
