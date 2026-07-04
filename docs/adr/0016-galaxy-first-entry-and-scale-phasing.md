# ADR-0016: Galaxy-First Entry and Scale Phasing

## Status

**Accepted** — 2026-06-16

## Context

[Proposal 0001](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md) is **Approved** (2026-06-16): Galaxy is the single front door for showcase, default, and production. [ADR-0008](./0008-mvp-entry-and-scale-stack.md) still states Megacity aerial view as MVP entry, Galaxy and Earth out of MVP scope, and instant cuts on all scales.

The codebase and product direction now contradict ADR-0008 on entry, cosmic scale phasing (frontend), and transition style on cosmic scales. Accepted ADRs must not be edited in place; this ADR partially supersedes ADR-0008 per [Proposal 0002](../proposals/0002-supersede-adr-0008-galaxy-entry.md) (Approved 2026-06-16).

## Decision

### MVP Entry Point

**Galaxy scroll journey** — default load renders `GalaxyScene`; user scrolls galaxy → earth → megacity → districts. Megacity is **mid-journey**, not the application entry.

- Deep links: `?scale=earth`, `?scale=megacity`, etc. bypass scroll journey for dev/QA only; they do not redefine production entry.
- `apps/web/app/page.tsx` / shell loads at `galaxy` scale (matches `navigationStore` default).

### MVP Navigable Experience (Full Chain)

| Step | Scale             | MVP detail              | Data source                           |
| ---- | ----------------- | ----------------------- | ------------------------------------- |
| 1    | Galaxy            | Full scene + HUD        | Frontend mock (v2 API later)          |
| 2    | Earth             | Full scene + HUD        | Frontend mock (`GET /earth/state` v1) |
| 3    | Megacity          | Entry to city MVP chain | API-backed (Nexus)                    |
| 4–6  | District → Memory | Per ADR-0008            | API-backed                            |

The **6 city-scale levels** from ADR-0008 remain unchanged in behavior and API requirements.

### MVP Transition Style

| Scale range                          | Transition                                                            |
| ------------------------------------ | --------------------------------------------------------------------- |
| Galaxy, Earth, Orbital Ring (cosmic) | Animated Bezier paths permitted; skip-after-500ms UX; target < 3s NFR |
| Megacity → Memory (city chain)       | **Instant cuts** — < 500ms perceived swap; optional 200ms crossfade   |

Reject animated flights **only** on the city drill-down chain at MVP.

### Vision Metric (Unchanged)

"3 scale levels at MVP" in vision docs still refers to **macro layers** (City, District, Agent) within the megacity chain — not negating the cosmic entry wrapper.

### Phase Unlock Schedule (Amended)

| Scale             | MVP (frontend)     | MVP (API) | v1          | v2               |
| ----------------- | ------------------ | --------- | ----------- | ---------------- |
| Galaxy            | ✓ scene + mock HUD | —         | partial     | full             |
| Solar System      | stub / locked      | —         | ✓           | ✓                |
| Earth             | ✓ scene + mock HUD | —         | ✓ state API | ✓                |
| Orbital Ring      | ✓ scene (mock)     | —         | ✓           | ✓                |
| Megacity → Memory | ✓                  | ✓         | ✓           | ✓ (memory graph) |

**Clarification**: "MVP frontend" cosmic scenes do not imply authoritative backend data until the corresponding API phase ships.

## Alternatives Considered

| Option                                        | Why rejected                                        |
| --------------------------------------------- | --------------------------------------------------- |
| Edit ADR-0008 in place                        | Governance violation — ADRs immutable once accepted |
| Keep ADR-0008; ignore in code                 | Drift; E2E and docs disagree                        |
| Revert code to megacity entry                 | User rejected in Proposal 0001                      |
| Dual-entry ADR (galaxy + megacity production) | User rejected dual-entry                            |

## Consequences

- **Supersedes ADR-0008 (partial)** — entry point, cosmic transition style, Galaxy/Earth phase-unlock rows, and megacity-only entry consequences. ADR-0008 body remains canonical for: 6 city navigable levels, Reasoning district focus, instant cuts on city chain.
- Update `docs/canonical-numbers.md` — MVP entry → Galaxy scroll journey; cosmic transitions at MVP.
- Update `docs/roadmap/mvp.md`, `docs/PRD.md` constraint C-009/C-010.
- E2E primary path starts at galaxy default load.
- `ScaleTransitionController` used for cosmic paths at MVP; city chain uses instant swap per ADR-0008.

## References

- Supersedes (partial): [ADR-0008](./0008-mvp-entry-and-scale-stack.md)
- Related: [ADR-0014](./0014-performance-targets.md) (performance), [Proposal 0001](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md), [Proposal 0002](../proposals/0002-supersede-adr-0008-galaxy-entry.md)
- Sprint plan: [`docs/memory/galaxy-first-roadmap.md`](../memory/galaxy-first-roadmap.md)
