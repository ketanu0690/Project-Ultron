# ADR-0008: MVP Entry and Scale Stack

## Status

**Accepted** — 2026-06-14

## Context

Documentation disagreed on:

- Application entry point (Galaxy vs Megacity)
- Number of navigable scale levels at MVP
- Transition style (instant cuts vs animated < 3s flights)
- Count of "3 scale levels" in vision vs 6 actual navigable levels

## Decision

### MVP Entry Point

**Megacity aerial view** — not Galaxy, not Earth.

`apps/web/app/page.tsx` redirects to `/world/megacity` (or renders MegacityScene directly).

### MVP Navigable Scale Levels (6)

1. Megacity (entry)
2. District (Reasoning only, full detail)
3. Building (Planning Tower full; others LOD)
4. Room (3 rooms in Planning Tower)
5. Agent (dialogue)
6. Memory (timeline list — not graph)

### MVP Transition Style

**Instant scene cuts** — no Bezier camera flights. Target < 500ms perceived swap with optional 200ms crossfade.

The **< 3 second animated transition** NFR applies from **v1** (city-scale) and **v2** (full stack).

### Vision Metric Clarification

"3 scale levels at MVP" in `vision.md` refers to **three macro layers**:

- **City** (Megacity)
- **District** (Reasoning)
- **Agent** (dialogue + memory)

Not the full 10-level cosmic stack.

### Phase Unlock Schedule

| Scale             | MVP | v1  | v2              |
| ----------------- | --- | --- | --------------- |
| Galaxy            | —   | —   | ✓               |
| Solar System      | —   | ✓   | ✓               |
| Earth             | —   | ✓   | ✓               |
| Orbital Ring      | —   | ✓   | ✓               |
| Megacity          | ✓   | ✓   | ✓               |
| District → Memory | ✓   | ✓   | ✓ (graph at v2) |

## Alternatives Considered

### A: Galaxy entry at MVP (per frontend.md scaffold)

**Rejected**: Galaxy scene not in MVP scope; false promise on first load.

### B: Animated transitions at MVP

**Rejected**: 4+ weeks engineering; instant cuts sufficient for demo.

### C: Skip District level — go Megacity → Building

**Rejected**: District theming is core identity proof.

## Consequences

- Update `architecture/frontend.md` entry point
- Update `world-bible/transportation.md` MVP transition rules
- Update `world-bible/overview.md` constraint #3 to reference this ADR
- `ScaleTransitionController` built at v1, not MVP (MVP uses `SceneRouter` instant swap)

## References

- `docs/canonical-numbers.md`
- `docs/roadmap/mvp.md`
