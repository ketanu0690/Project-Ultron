# UI-First Development Workflow

> **Cursor Memory File** — How to build Project-Ultron with the UI driving backend contracts, not the reverse.  
> **Adopted**: 2026-06-16

---

## Principle

**UI First** means every feature starts from a user-visible surface (screen, panel, 3D scene, or interaction flow). Backend work exists to satisfy what the UI needs — endpoints, payloads, and WebSocket events are derived from hooks and components, not invented in isolation.

This complements (does not replace) existing governance:

- Feature specs and ADRs still define boundaries.
- `docs/architecture/api-contracts.md` remains the canonical contract — but **changes start from a UI need**, then update the contract, then implement the API.
- Do not edit accepted ADRs directly; file `docs/proposals/` when UI-first delivery diverges. **Galaxy-first entry approved** — see [Proposal 0001](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md) and [galaxy-first-roadmap.md](./galaxy-first-roadmap.md).

---

## Canonical User Path (Galaxy-First)

Approved 2026-06-16. All sprint planning and E2E design start here:

```
Galaxy (default load)
  → scroll → Earth
  → scroll → Megacity
  → District → Building → Room → Agent
  → Talk (dialogue) / View Memory (timeline)
```

- **Production entry**: Galaxy scroll journey (not megacity).
- **QA shortcut**: `?scale=megacity` skips cosmic steps for city-only tests — not a second production door.
- **City chain**: Instant cuts (ADR-0008 city behavior retained).
- **Cosmic scales**: Animated transitions OK; HUD mock data until v1/v2 APIs.

---

## When to Use UI First

| Situation                                               | UI-first?         | Notes                                                                                                                       |
| ------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| New MVP user journey step (navigate, talk, view memory) | **Yes**           | Build or extend scene/panel first                                                                                           |
| New HUD metric or sidebar section                       | **Yes**           | Define displayed fields → derive API field                                                                                  |
| New REST endpoint with no consumer                      | **No**            | Wait for a screen/hook that needs it                                                                                        |
| Infra (health, metrics, CI)                             | **No**            | Ops concerns; not user-facing                                                                                               |
| Cosmic scales (galaxy, earth) ahead of ADR phase        | **Yes, approved** | Galaxy-first entry (Proposal 0001); reconcile ADR via [Proposal 0002](../proposals/0002-supersede-adr-0008-galaxy-entry.md) |

---

## Work Order (Default Sequence)

```
1. Screen / flow     →  Feature spec acceptance criteria + Figma or component stub
2. Hook / store      →  What data does this surface need? When does it load?
3. API contract      →  Add or adjust `api-contracts.md` + `@ultron/shared` types
4. api-endpoints.ts  →  Typed fetch helper (REST) or socket util (WS)
5. Backend endpoint  →  NestJS module implements contract only
6. Test              →  UI unit test → API contract test → E2E path
```

### Per-Step Checklist

#### 1 — Screen / flow

- [ ] Identifies `ScaleLevel`, focus `entityId`, and shell panels involved
- [ ] Lists user actions (click, Enter, Talk, View Memory, scroll step)
- [ ] Documents loading, empty, and error states in the component
- [ ] References `docs/feature-specs/ui-shell.md` or scale-specific spec

#### 2 — Hook / store

- [ ] Data lives in the correct store (ADR-0004): `navigationStore`, `worldStore`, `agentStore`, `uiStore`
- [ ] Hook name follows `use{Feature}` convention
- [ ] No direct `fetch` in components — use `lib/api-endpoints.ts` or dedicated socket module
- [ ] 3D scenes do not call REST; they use stores or hooks wired at shell level

#### 3 — API contract

- [ ] New route or WS event documented in `docs/architecture/api-contracts.md`
- [ ] TypeScript types added to `packages/shared`
- [ ] If transport is dialogue: follow ADR-0015 (WS primary, SSE fallback)

#### 4 — `api-endpoints.ts`

- [ ] One exported function per REST call the UI makes
- [ ] Returns `ApiResponse<T>` envelope
- [ ] Dialogue and other streaming calls should still get a typed initiator here (even if stream is WS/SSE)

#### 5 — Backend

- [ ] NestJS module matches domain boundary (ADR-0010)
- [ ] Implements **only** what the UI hook requested — no extra fields “for later”
- [ ] Slug and UUID resolution consistent with navigation/memory patterns

#### 6 — Test

- [ ] Gherkin scenario in `docs/qa/` for the user path
- [ ] API contract test when endpoint is new
- [ ] Playwright E2E when the path is MVP-critical

---

## How to Derive a Contract from UI

### Example: Right sidebar “Talk” on an agent

| UI surface | `RightSidebar` → Talk button |
| Hook | `openDialogue()` → `uiStore` → `useAgentDialogue` |
| Data needed | `agentId` (slug or UUID), agent display name, streaming tokens, session id |
| REST | `POST /api/v1/agents/:id/dialogue` — initiate session |
| WS | `agent:dialogue` — stream tokens; `agent:status` — optional status chip |
| Store | `agentStore` messages + `isStreaming` |
| Tests | `docs/qa/phoenix-scenarios.md` |

### Example: Bottom HUD at galaxy / earth scale (Phase 1 — mock)

| UI surface | `GalaxyHUD` / `EarthHUD` — exploration metrics |
| Hook | `useEarthState` (mock); galaxy metrics from scene constants |
| Data needed | TBD — complete UI-first worksheet before v1/v2 API |
| REST | `GET /earth/state` (v1); galaxy endpoints (v2) — **defer until worksheet locked** |
| Rule | Label HUD “simulated”; no backend until fields approved |

### Example: Bottom HUD at megacity scale

| UI surface | `BottomHUD` — Districts / Total Agents / City Prosperity |
| Hook | `useWorldSync` hydrates `worldStore.aggregates` |
| Data needed | `entityCount`, `activeAgents`, prosperity (or computed metric) |
| REST | `GET /navigation/megacity` → `entities.metrics` (preferred single bundle) |
| Avoid | Separate calls per metric unless the screen truly needs lazy load |

### Contract derivation worksheet

Copy into a PR or `active-work.md` when starting a feature:

```markdown
## UI contract: [Feature name]

**Surface**: [component path]
**User action**: [click / scroll / keyboard]
**Scale / focus**: [e.g. agent / agent-sigma-7]

### Fields displayed

| Label | Source | Type | Required |
| ----- | ------ | ---- | -------- |

### Mutations / streams

| Action | Transport | Endpoint / event |

### Empty / error UX

- Loading: …
- Empty: …
- Error: …
```

---

## API Endpoints Audit (UI vs Backend)

> Snapshot 2026-06-16. Re-audit when adding endpoints. **Rule**: if Backend = ✅ and UI = ❌, either wire a UI surface or defer the endpoint.

| Endpoint / event               | Backend | `api-endpoints.ts`          | UI consumer                           | UI-first verdict                           |
| ------------------------------ | ------- | --------------------------- | ------------------------------------- | ------------------------------------------ |
| `GET /health`                  | ✅      | ✅ `fetchHealth`            | — (ops)                               | OK — infra                                 |
| `GET /ready`                   | ✅      | ✅ `fetchReady`             | — (ops)                               | OK — infra                                 |
| `GET /metrics`                 | ✅      | ❌                          | — (ops)                               | OK — infra                                 |
| `GET /navigation/:scale`       | ✅      | ✅ `fetchNavigation`        | `useWorldSync`, `useBreadcrumbSync`   | **Core** — keep                            |
| `GET /districts`               | ✅      | ✅ `fetchDistricts`         | `useWorldSync`                        | **Core**                                   |
| `GET /districts/:id`           | ✅      | ✅ `fetchDistrict`          | —                                     | **Defer** — use navigation bundle          |
| `GET /districts/:id/buildings` | ✅      | ✅ `fetchDistrictBuildings` | `useWorldSync`                        | **Core**                                   |
| `GET /districts/:id/agents`    | ✅      | ✅ `fetchDistrictAgents`    | `useWorldSync`                        | **Core** — needed for swarm UI             |
| `GET /districts/:id/metrics`   | ✅      | ❌                          | —                                     | **Defer** until HUD needs district metrics |
| `GET /buildings/:id`           | ✅      | ❌                          | —                                     | **Defer** — navigation bundle              |
| `GET /buildings/:id/rooms`     | ✅      | ❌                          | —                                     | Partial — rooms via navigation             |
| `GET /buildings/:id/agents`    | ✅      | ❌                          | —                                     | **Next** — room/agent scene selection      |
| `GET /buildings/:id/metrics`   | ✅      | ❌                          | —                                     | **Defer** until building HUD wired         |
| `GET /agents`                  | ✅      | ❌                          | —                                     | **Next** — agent swarm / district view     |
| `GET /agents/:id`              | ✅      | ❌                          | —                                     | **Defer** — entity detail via store        |
| `GET /agents/:id/memory`       | ✅      | ✅ `fetchAgentMemories`     | `MemoryTimeline`, `useBreadcrumbSync` | **Core**                                   |
| `GET /agents/:id/status`       | ✅      | ❌                          | —                                     | **Next** — agent status badge in HUD       |
| `POST /agents/:id/dialogue`    | ✅      | ❌ (inline in hook)         | `useAgentDialogue`                    | **Core** — move to `api-endpoints.ts`      |
| `POST /agents/:id/delegate`    | ✅      | ❌                          | —                                     | v1 — no UI                                 |
| `GET /world/state`             | ✅      | ❌                          | —                                     | **Defer** until `world:state` WS wired     |
| `GET /earth/state`             | ✅      | ❌                          | —                                     | v1 — `useEarthState` still mock            |
| `GET /ring/segments`           | ✅      | ❌                          | —                                     | v1 — orbital scene mock                    |
| `GET /search`                  | ❌      | ❌                          | —                                     | v1 per spec                                |
| WS `agent:dialogue`            | ✅      | `agent-dialogue-socket.ts`  | `useAgentDialogue`                    | **Core**                                   |
| WS `world:state`               | ❌      | ❌                          | —                                     | **Defer** — no UI subscriber yet           |
| WS `nav:subscribe`             | ❌      | ❌                          | —                                     | **Defer** — breadcrumbs use REST           |

### Static fallback debt (`shell-data.ts`)

Several shell components still fall back to static `ENTITY_DETAILS` and `NAV_HIERARCHY` when `worldStore` is empty or entity is unknown. UI-first rule: **new work must not add static entities**; extend API hydration or navigation bundle instead.

| File            | Static fallback                          | Target                                         |
| --------------- | ---------------------------------------- | ---------------------------------------------- |
| `shell-data.ts` | `ENTITY_DETAILS`, `NAV_HIERARCHY`        | Remove as `worldStore` covers all MVP entities |
| `BottomHUD`     | `GALAXY_HUD_METRICS`, `MOCK_EARTH_STATE` | v1 APIs when those scales ship                 |
| `AgentScene`    | Hardcoded `agent-sigma-7`                | Render from `worldStore.agents`                |
| `useWorldSync`  | `cityProsperity: 94.2` hardcoded         | Derive from API or drop until defined          |

---

## Anti-Patterns

| Pattern                                                  | Why it violates UI-first      | Fix                                                   |
| -------------------------------------------------------- | ----------------------------- | ----------------------------------------------------- |
| Implement full CRUD module before any panel uses it      | Backend-led scope creep       | Ship endpoint when hook exists                        |
| Duplicate entity data in `shell-data.ts` and Prisma seed | Drift, double maintenance     | Single source: API → `worldStore` → `getEntityDetail` |
| `fetch` inside R3F scene components                      | Breaks ADR boundary           | Shell hooks hydrate stores                            |
| Galaxy/Earth APIs before HUD defines fields              | Speculative backend           | Mock in scene until HUD worksheet complete            |
| Skipping `api-endpoints.ts`                              | Untyped, undiscoverable calls | Add helper when hook needs REST                       |

---

## UI-First Sprint Planning (Galaxy-First)

1. Pick the **next user-visible step** on the canonical path (see [galaxy-first-roadmap.md](./galaxy-first-roadmap.md)).
2. Write the contract worksheet (above) for that step only.
3. Implement screen → hook → contract → API in one MR when possible.
4. Update this audit table if endpoints changed.
5. Log completed flows in `completed-features.md`.

### Backlog priority (2026-06-16)

| Priority  | Focus                                                                            |
| --------- | -------------------------------------------------------------------------------- |
| **P0**    | Phase 1 cosmic entry polish; galaxy-first E2E; agent swarm UI                    |
| **P1**    | Static fallback removal; Earth HUD worksheet; room agents; api-endpoints hygiene |
| **P2**    | Per-district scenes; agent status chip; Galaxy HUD worksheet; ADR-0016           |
| **Defer** | District/building metrics; world:state WS until panel specced                    |

---

## References

- `docs/memory/active-work.md` — current Galaxy-first backlog
- `docs/memory/galaxy-first-roadmap.md` — Phase 1–3 sprint plan
- `docs/feature-specs/ui-shell.md` — shell layout requirements
- `docs/feature-specs/world-navigation.md` — scale navigation
- `docs/architecture/api-contracts.md` — REST + WS schemas
- `docs/adr/0008-mvp-entry-and-scale-stack.md` — **superseded pending ADR-0016** (Proposal 0002)
- `docs/adr/0015-api-and-realtime-contract.md` — dialogue transport
- `docs/proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md` — **Approved** Galaxy-first entry
- `docs/proposals/0002-supersede-adr-0008-galaxy-entry.md` — ADR amendment draft

---

_Update the audit table when wiring new UI surfaces or deprecating unused endpoints._
