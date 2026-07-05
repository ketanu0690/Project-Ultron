# Proposal 0004: Natural World Simulation Libraries

## Status

**Approved** — 2026-07-05 (implementation in progress per Natural World Simulation plan)

## Author

Cursor Agent — 2026-07-05

## Problem

Ultron agents are static capsules on a client grid with no server positions, no behavior tick, no policy enforcement, and no scoped physics. The world does not feel alive or governed. ADR-0017 Phase 2+ and the simulation/governance specs require new libraries on the critical rendering and simulation path.

## Proposed Change

Adopt a phased library stack: **Yuka** + **@nestjs/schedule** for server agent steering; **three-mesh-bvh** for camera collision; **Motion** for UI/avatar transitions; **@react-three/rapier** for room-scoped colliders; **three-fluid-fx** for atmosphere VFX; **WebGPU** hero fluids deferred to proposal 0005. Recast navmesh WASM deferred to v1.1 — room-bounds wander via Yuka satisfies Track A.

## Conflicts With

| Document            | Section / Decision     | Conflict                                                             |
| ------------------- | ---------------------- | -------------------------------------------------------------------- |
| ADR-0003            | WebGPU deferred to v2  | WebGPU only in hero scenes with WebGL fallback (0005)                |
| `transportation.md` | No transit physics     | Rapier scoped to interiors only                                      |
| ADR-0013            | MVP no simulation tick | Behavior tick (10s) starts parallel M2; macro 60s tick ships Track B |

## Alternatives Considered

| Option                      | Why rejected                                                                   |
| --------------------------- | ------------------------------------------------------------------------------ |
| Cannon-es                   | Rapier is faster, pmndrs-native, React 19 compatible                           |
| Full Recast WASM at Track A | High integration cost; room AABB wander sufficient for first ship              |
| Bull + Redis for ticks      | Redis exists in compose but @nestjs/schedule suffices for interval crons at v1 |
| Client-side autonomy LLM    | Violates ADR-0017 server authority                                             |

---

## Dependency Rule

| Package                                             | Role                       | Est. gzip         | Phase     |
| --------------------------------------------------- | -------------------------- | ----------------- | --------- |
| `yuka`                                              | Server steering / wander   | ~25 KB            | A         |
| `three-mesh-bvh`                                    | Camera collision raycast   | ~15 KB            | A         |
| `motion`                                            | Panel + avatar transitions | ~20 KB            | A         |
| `@react-three/rapier` + `@dimforge/rapier3d-compat` | Room colliders             | ~200 KB WASM lazy | B         |
| `three-fluid-fx`                                    | 2D airflow VFX             | ~30 KB lazy       | B         |
| WebGPU path                                         | Hero fluid scenes          | large             | v2 (0005) |

| Question                            | Answer                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Why can't existing deps solve this? | drei/three provide rendering only; no steering, physics, or fluid solvers |
| Estimated bundle impact             | Track A ~60 KB web; Rapier ~200 KB lazy per room scene                    |
| Maintenance cost                    | MIT licenses; pmndrs + Yuka actively maintained                           |
| Existing stack tried first?         | Yes — CSS transitions and grid layout insufficient for natural movement   |

---

## Technical Decision Evaluation

| Dimension            | Score | Notes                                                 |
| -------------------- | ----- | ----------------------------------------------------- |
| Complexity           | 6     | Dual tick + WS sync adds moving parts                 |
| Performance          | 8     | Server tick + client interpolate scales to 500 agents |
| Maintainability      | 7     | Clear server/client boundary                          |
| Scalability          | 7     | LOD tiers cap T0 render cost                          |
| Developer Experience | 8     | pmndrs ecosystem alignment                            |

### Tradeoffs

**Pros**

- Natural agent movement without full CFD/physics sandbox
- Nation-state rules enforceable server-side
- Lazy WASM keeps initial bundle under budget

**Cons**

- Two simulation intervals (10s + 60s) require clear docs
- Recast navmesh deferred — paths are room-bounded wander

**Risks**

| Risk                | Severity | Mitigation                      |
| ------------------- | -------- | ------------------------------- |
| WASM bundle blow    | Med      | Lazy-load Rapier per room scene |
| 500 agents FPS      | Med      | T0/T1 LOD + server throttle     |
| LLM cost for wander | Low      | Rule-based FSM first            |

---

## Implementation Impact

- Files: `apps/api/src/modules/simulation/`, `apps/web/scenes/agent/`, `apps/web/controllers/`
- Docs: `active-work.md`, `capabilities.md`, `architecture-decisions.md`
- Migration: agent position columns + world_state + governance_policies tables

## Approval

- [x] User approved (plan execution 2026-07-05)
- [ ] New ADR drafted if WebGPU supersedes ADR-0003 (see 0005)
