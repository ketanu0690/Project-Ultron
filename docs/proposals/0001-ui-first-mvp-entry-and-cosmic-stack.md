# Proposal 0001: UI-First MVP Entry and Cosmic Stack

## Status

**Approved** — 2026-06-16 (user decision: Galaxy is the main door)

## Author

Cursor Agent — 2026-06-16

## Problem

Project-Ultron has adopted **UI-first** development: scenes and flows are built ahead of backend support, and the running app diverges from ADR-0008 in ways that improved demo value but were never formally accepted.

Concrete deviations in the repo today:

| Area                | ADR-0008 (accepted)    | Current implementation                                                          |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| MVP entry point     | Megacity aerial view   | Default `galaxy` in `navigationStore`; scroll journey galaxy → earth → megacity |
| MVP transitions     | Instant cuts (< 500ms) | Animated `galaxy-to-earth` and other Bezier paths on cosmic scales              |
| Galaxy at MVP       | Not in scope (v2)      | Full `GalaxyScene`, spiral shaders, `GalaxyHUD`                                 |
| Earth at MVP        | Not in scope (v1)      | Full `EarthScene`, `EarthHUD`, mock state                                       |
| Orbital Ring at MVP | Not in scope (v1)      | `OrbitalRingScene` registered                                                   |

Without a decision, UI-first work would continue to conflict with ADR-0008, and contributors would not know which entry point is authoritative.

## Proposed Change (Authoritative — Approved)

**Galaxy-first single entry** — one front door for showcase, default, and production. Document as a superseding amendment to ADR-0008 via [Proposal 0002](./0002-supersede-adr-0008-galaxy-entry.md) → new ADR after human review.

1. **Primary entry (default load, dev, demo, production)** — Galaxy scroll journey → Earth → Megacity → districts → building → room → agent → memory. `navigationStore` default remains `galaxy`; no env flag to swap the front door.
2. **Megacity is mid-journey, not the door** — reached via scroll ladder or deep link (`?scale=megacity`). City-scale drill-down (megacity → memory) remains the **MVP functional chain** for API integration and agent/dialogue features; it is not the first screen.
3. **Phase labels** — Cosmic scales use **frontend mock HUD** at MVP; REST/WS for galaxy/earth remain v1/v2 per backend phase. Mock data must be labeled in HUD (e.g. “simulated”).
4. **Transition rule** — Animated transitions **permitted on cosmic scales** (galaxy, earth, orbital ring). Megacity → memory chain stays **instant cut** at MVP (< 500ms perceived swap).

This formalizes what the codebase already ships and aligns governance with the product narrative: the user enters the cosmos and scrolls into the city.

## Relationship to ADR-0008

| ADR-0008 section                           | Still valid | Superseded by this decision                               |
| ------------------------------------------ | ----------- | --------------------------------------------------------- |
| 6 navigable MVP levels (megacity → memory) | ✅          | —                                                         |
| Instant cuts on city-scale chain           | ✅          | —                                                         |
| Reasoning-only district detail             | ✅          | —                                                         |
| MVP entry = Megacity                       | —           | ✅ → Galaxy scroll journey                                |
| Galaxy/Earth out of MVP scope              | —           | ✅ → frontend cosmic scenes at MVP (mock data)            |
| Animated transitions rejected at MVP       | —           | ✅ → allowed on cosmic scales only                        |
| `ScaleTransitionController` at v1          | —           | ✅ → cosmic paths use it now; city chain uses instant cut |

**Follow-up required**: [Proposal 0002](./0002-supersede-adr-0008-galaxy-entry.md) drafts ADR-0008 amendment. Do **not** edit `docs/adr/0008-mvp-entry-and-scale-stack.md` directly. After ADR review, mark ADR-0008 **Superseded** (partial — entry, transition, phase-unlock rows) or publish `docs/adr/0016-galaxy-first-entry-and-scale-phasing.md`.

## Conflicts With

| Document                             | Section / Decision                             | Resolution                                      |
| ------------------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| ADR-0008                             | MVP Entry Point = Megacity                     | Supersede via Proposal 0002 + new ADR           |
| ADR-0008                             | MVP Transition Style = instant cuts everywhere | Cosmic scales: animated; city chain: instant    |
| ADR-0008                             | Phase Unlock — Galaxy v2, Earth v1             | Frontend at MVP; API phased per 0002            |
| `docs/roadmap/mvp.md`                | Out of scope: Galaxy, Earth                    | Update roadmap to “cosmic UI at MVP, API v1/v2” |
| `docs/current-state/capabilities.md` | Stale matrix                                   | Refresh in Galaxy-first sprint (Phase 1)        |
| `docs/canonical-numbers.md`          | MVP entry = Megacity                           | Update when ADR-0008 superseded                 |

## Alternatives Considered

| Option                                             | Why rejected                                                                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Revert to megacity-only entry                      | Throws away working scroll journey and Earth/Galaxy scenes; contradicts approved product direction |
| Dual-entry (showcase galaxy + production megacity) | User rejected — single Galaxy door; avoids two E2E baselines and contributor confusion             |
| Ignore ADR-0008 silently                           | Governance violation                                                                               |
| Move cosmic scales to v2 API before any UI         | Backend-first; contradicts UI-first principle                                                      |

---

## Dependency Rule (if adding or replacing a package)

Not applicable — documentation and routing only.

---

## Technical Decision Evaluation

| Dimension            | Score (1–10) | Notes                                              |
| -------------------- | ------------ | -------------------------------------------------- |
| Complexity           | 8            | Single entry path; deep links for QA shortcuts     |
| Performance          | 8            | Cosmic scenes on first load; city path unchanged   |
| Maintainability      | 8            | One narrative; E2E primary path matches production |
| Scalability          | 9            | Backend phasing unchanged for cosmic APIs          |
| Developer Experience | 9            | UI-first team aligns with shipped default          |

### Tradeoffs

**Pros**

- Formalizes Galaxy-first product narrative
- No dual-entry env flags or test matrix split
- UI-first cosmic investment is authoritative
- City-scale MVP chain unchanged for Nexus/Phoenix integration

**Cons**

- ADR-0008 and several docs remain stale until Proposal 0002 ADR lands
- E2E must cover scroll journey (longer, flakier) or document `?scale=` shortcuts
- First-load performance budget includes galaxy shaders

**Risks**

| Risk                               | Severity | Mitigation                                                                   |
| ---------------------------------- | -------- | ---------------------------------------------------------------------------- |
| E2E flakiness on scroll journey    | Med      | Primary E2E from galaxy; `?scale=megacity` variant for city-only CI job      |
| Mock cosmic data mistaken for real | Low      | HUD labels “simulated”; no cosmic REST until v1/v2                           |
| ADR drift until 0002 merged        | Med      | Working notes in `architecture-decisions.md`; block megacity-first doc edits |

---

## Implementation Impact

- Files / modules affected:
  - `apps/web/stores/navigationStore.ts` — **no change** (already `galaxy` default)
  - `docs/memory/galaxy-first-roadmap.md` — sprint plan (created)
  - `docs/memory/active-work.md`, `ui-first-workflow.md` — Galaxy-first backlog
  - `docs/adr/` — new ADR via Proposal 0002 (after approval)
  - `docs/current-state/capabilities.md`, `canonical-numbers.md` — refresh after ADR
  - `docs/qa/nexus-scenarios.md` — add galaxy journey E2E scenario + megacity deep-link variant
- Docs to update after ADR approval:
  - ADR-0008 marked superseded (partial)
  - `world-navigation.md`, `mvp.md`, `architecture/data-flow-diagram.md`
- Migration or rollback plan:
  - Deep link `?scale=megacity` remains for QA and city-only tests; no rollback to megacity default without new proposal

## Approval

- [x] User approved (2026-06-16 — Galaxy is the main door)
- [ ] New ADR drafted: `docs/adr/0016-galaxy-first-entry-and-scale-phasing.md` (via Proposal 0002 review)
- [ ] Old ADR marked Superseded (partial — entry + transition + phase-unlock sections only)
