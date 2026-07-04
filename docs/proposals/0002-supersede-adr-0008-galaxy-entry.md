# Proposal 0002: Supersede ADR-0008 — Galaxy-First Entry and Cosmic Transitions

## Status

**Approved** — 2026-06-16 (formalized as [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md))

## Author

Cursor Agent — 2026-06-16

## Problem

[Proposal 0001](./0001-ui-first-mvp-entry-and-cosmic-stack.md) is **Approved** (2026-06-16): Galaxy is the single front door for showcase, default, and production. [ADR-0008](../adr/0008-mvp-entry-and-scale-stack.md) still states:

- MVP entry = Megacity aerial view
- Galaxy and Earth not in MVP scope
- All MVP transitions = instant cuts
- `ScaleTransitionController` deferred to v1

The codebase and product direction now contradict ADR-0008 on entry, cosmic scale phasing (frontend), and transition style on cosmic scales. Accepted ADRs must not be edited in place; this proposal defines the amendment for a **new ADR** that partially supersedes ADR-0008.

## Proposed Change

Publish **`docs/adr/0016-galaxy-first-entry-and-scale-phasing.md`** (title tentative) with these decisions:

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

### Phase Unlock Schedule (Amended)

| Scale             | MVP (frontend)     | MVP (API) | v1          | v2               |
| ----------------- | ------------------ | --------- | ----------- | ---------------- |
| Galaxy            | ✓ scene + mock HUD | —         | partial     | full             |
| Solar System      | stub / locked      | —         | ✓           | ✓                |
| Earth             | ✓ scene + mock HUD | —         | ✓ state API | ✓                |
| Orbital Ring      | ✓ scene (mock)     | —         | ✓           | ✓                |
| Megacity → Memory | ✓                  | ✓         | ✓           | ✓ (memory graph) |

**Clarification**: “MVP frontend” cosmic scenes do not imply authoritative backend data until the corresponding API phase ships.

### Vision Metric (Unchanged)

“3 scale levels at MVP” in vision docs still refers to **macro layers** (City, District, Agent) within the megacity chain — not negating the cosmic entry wrapper.

### Supersedes ADR-0008

Mark ADR-0008 **Superseded (partial)** — sections: MVP Entry Point, MVP Transition Style (cosmic), Phase Unlock Schedule (Galaxy/Earth rows), Consequences referencing megacity-only entry. Retain: 6 city navigable levels, Reasoning district focus, instant cuts on city chain.

## Conflicts With

| Document                    | Section / Decision               | Conflict                    |
| --------------------------- | -------------------------------- | --------------------------- |
| ADR-0008                    | MVP Entry Point = Megacity       | Galaxy default              |
| ADR-0008                    | Galaxy — at v2 only              | Galaxy scene at MVP         |
| ADR-0008                    | Earth — at v1 only               | Earth scene at MVP          |
| ADR-0008                    | Instant cuts at MVP (all scales) | Cosmic animated paths       |
| ADR-0008                    | ScaleTransitionController at v1  | Used for cosmic paths today |
| `docs/canonical-numbers.md` | MVP entry = Megacity             | Must update with new ADR    |
| `docs/roadmap/mvp.md`       | Galaxy/Earth out of scope        | Cosmic UI in scope at MVP   |

## Alternatives Considered

| Option                                        | Why rejected                   |
| --------------------------------------------- | ------------------------------ |
| Edit ADR-0008 in place                        | Governance violation           |
| Keep ADR-0008; ignore in code                 | Drift; E2E and docs disagree   |
| Revert code to megacity entry                 | User rejected in Proposal 0001 |
| Dual-entry ADR (galaxy + megacity production) | User rejected dual-entry       |

---

## Dependency Rule (if adding or replacing a package)

Not applicable.

---

## Technical Decision Evaluation

| Dimension            | Score (1–10) | Notes                                            |
| -------------------- | ------------ | ------------------------------------------------ |
| Complexity           | 7            | Doc + E2E alignment; code mostly already matches |
| Performance          | 7            | Galaxy first load in perf budget                 |
| Maintainability      | 8            | Single entry narrative                           |
| Scalability          | 9            | API phasing unchanged                            |
| Developer Experience | 8            | Clear canonical path in roadmap                  |

### Tradeoffs

**Pros**

- ADR matches shipped product
- Preserves city-chain MVP investment (Nexus/Phoenix)
- Explicit mock vs API boundary for cosmic scales

**Cons**

- Multiple stale docs until canonical-numbers/roadmap refreshed
- Longer primary E2E path

**Risks**

| Risk                           | Severity | Mitigation                                    |
| ------------------------------ | -------- | --------------------------------------------- |
| Contributors read old ADR-0008 | Med      | Superseded banner + architecture-decisions.md |
| Perf regression on galaxy load | Med      | ADR-0014 budget; Phase 1 polish in roadmap    |

---

## Implementation Impact

- Files / modules affected:
  - `docs/adr/0016-galaxy-first-entry-and-scale-phasing.md` — **create after approval**
  - `docs/adr/0008-mvp-entry-and-scale-stack.md` — add Superseded header only (human review)
  - `docs/canonical-numbers.md`, `docs/roadmap/mvp.md`, `docs/current-state/capabilities.md`
  - `docs/qa/nexus-scenarios.md` — galaxy journey E2E feature
  - `architecture/data-flow-diagram.md`, `docs/PRD.md` constraint C-009
- Docs to update after approval:
  - All references to “MVP entry = Megacity”
  - `docs/memory/architecture-decisions.md` row for ADR #8
- Migration or rollback plan:
  - None for code; doc-only ADR supersession

## Suggested ADR-0016 Outline (for reviewer)

```markdown
# ADR-0016: Galaxy-First Entry and Scale Phasing

## Status

Accepted — [date after review]

## Context

[Proposal 0001 approved; ADR-0008 entry/transition mismatch]

## Decision

[Copy Proposed Change sections from this proposal]

## Consequences

- Supersedes ADR-0008 (partial)
- E2E primary path starts at galaxy
- canonical-numbers.md MVP entry → Galaxy scroll journey

## References

- Supersedes: ADR-0008 (entry, cosmic transitions, phase table rows)
- Related: ADR-0014 (performance), Proposal 0001
```

## Approval

- [x] User approved Proposal 0002 (2026-06-16)
- [x] New ADR drafted: `docs/adr/0016-galaxy-first-entry-and-scale-phasing.md`
- [x] ADR-0008 supersession documented in ADR-0016 (ADR-0008 body unchanged per governance)
