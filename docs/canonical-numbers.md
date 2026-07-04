# Canonical Numbers

> **Source of truth** for all quantitative targets across ULTRON AI WORLD documentation.  
> When any other document disagrees with this file, **this file wins**. Update other docs to match.

**Last reconciled**: 2026-06-14

---

## How to Use

- Roadmap, architecture NFRs, feature specs, and world-bible must reference these values
- Deviations require an ADR and an update to this file
- Ranges (e.g., `50–100`) are **deprecated** — use exact phase targets below

---

## Agent Population

| Phase      | Total Agents | Per District (default %)                                                          | LangGraph Instances      |
| ---------- | ------------ | --------------------------------------------------------------------------------- | ------------------------ |
| **MVP**    | **50**       | Reasoning only (100%)                                                             | ≤ 10 concurrent active   |
| **v1**     | **500**      | Perception 125, Memory 75, Reasoning 100, Action 150, Self Improvement 50         | ≤ 50 concurrent active   |
| **v2**     | **5,000**    | Perception 1,250, Memory 750, Reasoning 1,000, Action 1,500, Self Improvement 500 | ≤ 200 concurrent active  |
| **Future** | 50,000+      | Dynamic                                                                           | Pooled workers (not 1:1) |

**MVP role distribution** (all in Reasoning District):

| Role      | Count |
| --------- | ----- |
| planner   | 20    |
| simulator | 10    |
| debater   | 10    |
| verifier  | 10    |

---

## Buildings & Rooms

| Phase   | Buildings                    | Building Types Rendered                                     | Interior Rooms (MVP target) |
| ------- | ---------------------------- | ----------------------------------------------------------- | --------------------------- |
| **MVP** | **10** (seed)                | **1 full** (Planning Tower) + 9 LOD footprints in Reasoning | **3** in Planning Tower     |
| **v1**  | **200**                      | **25 types** × ~8 instances each                            | 1+ room per building type   |
| **v2**  | 200+ (growth via simulation) | 25+ types                                                   | Full interior coverage      |

**Clarification**: MVP ships **one fully modeled building** (Planning Tower). Other Reasoning District buildings appear as LOD footprints for city context. Five building **types** are documented in world-bible; one is fully implemented at MVP.

---

## Scale Levels

| #   | Scale Level          | MVP          | v1           | v2        |
| --- | -------------------- | ------------ | ------------ | --------- |
| 1   | Galaxy               | —            | —            | ✓         |
| 2   | Solar System         | —            | ✓            | ✓         |
| 3   | Earth                | —            | ✓            | ✓         |
| 4   | Orbital Defense Ring | —            | ✓            | ✓         |
| 5   | AI Megacity          | ✓ (entry)    | ✓            | ✓         |
| 6   | District             | ✓            | ✓            | ✓         |
| 7   | Building             | ✓            | ✓            | ✓         |
| 8   | Room                 | ✓            | ✓            | ✓         |
| 9   | Agent                | ✓            | ✓            | ✓         |
| 10  | Memory               | ✓ (timeline) | ✓ (timeline) | ✓ (graph) |

**MVP navigable count**: 6 city levels (Megacity → District → Building → Room → Agent → Memory timeline) plus cosmic entry wrapper (Galaxy → Earth)  
**MVP entry point**: Galaxy scroll journey (Galaxy → Earth → Megacity → …) — see [ADR-0016](adr/0016-galaxy-first-entry-and-scale-phasing.md)  
**Vision "3 scale levels at MVP"** means 3 **macro** layers: Megacity, District, Agent — not the full 10-level stack

---

## Scale Transitions

| Phase                | Transition Style                                                       | Max Duration       |
| -------------------- | ---------------------------------------------------------------------- | ------------------ |
| **MVP (cosmic)**     | Animated Bezier paths (Galaxy, Earth, Orbital Ring); skip after 500 ms | < 3 s              |
| **MVP (city chain)** | **Instant scene cut** (Megacity → Memory)                              | < 500 ms perceived |
| **v1**               | Animated Bezier camera flights (city-scale optional)                   | < 3 s              |
| **v2**               | Full-stack animated transitions                                        | < 3 s per hop      |

**Note**: Cosmic animated transitions at MVP per [ADR-0016](adr/0016-galaxy-first-entry-and-scale-phasing.md); city chain instant cuts per [ADR-0008](adr/0008-mvp-entry-and-scale-stack.md).

---

## Performance Targets

| Metric                       | Desktop                             | Mobile             | Applies From   |
| ---------------------------- | ----------------------------------- | ------------------ | -------------- |
| Frame rate (city/district)   | **≥ 60 FPS** (P50)                  | **≥ 30 FPS** (P50) | MVP            |
| Frame rate (acceptance gate) | **≥ 30 FPS** (P50) minimum ship bar | **≥ 24 FPS**       | MVP milestones |
| Scale transition (animated)  | < 3 s P95                           | Skip available     | v1+            |
| Agent dialogue first token   | < 2 s P95                           | < 3 s P95          | MVP            |
| Scene initial load           | < 5 s                               | < 8 s              | MVP            |

**Interpretation**: Architecture targets 60 FPS; milestone **acceptance** allows 30 FPS as minimum ship criteria. Both are valid — design for 60, ship at 30.

---

## Concurrency & Infrastructure

| Metric                         | MVP | v1    | v2     |
| ------------------------------ | --- | ----- | ------ |
| Concurrent users               | 50  | 1,000 | 10,000 |
| WebSocket connections per node | 500 | 5,000 | 10,000 |
| API nodes                      | 1   | 1–2   | 3+     |
| Agent dialogues per day        | 100 | 5,000 | 50,000 |
| Simulation tick interval       | —   | 60 s  | 60 s   |

---

## Database Row Estimates

| Table             | MVP    | v1      | v2        |
| ----------------- | ------ | ------- | --------- |
| agents            | 50     | 500     | 5,000     |
| buildings         | 10     | 200     | 500+      |
| rooms             | 30     | 1,000   | 5,000     |
| agent_memories    | 5,000  | 500,000 | 5,000,000 |
| dialogue_messages | 10,000 | 500,000 | 5,000,000 |

---

## Rendering Budgets

| Entity                | MVP   | v1             | v2                         |
| --------------------- | ----- | -------------- | -------------------------- |
| Stars (galaxy)        | —     | 10,000         | 50,000                     |
| Buildings (visible)   | 10    | 200            | 200 (swarm LOD for agents) |
| Agent avatars (full)  | 50    | 50 in viewport | 50 in viewport             |
| Agent dots (mini-map) | —     | 500            | 5,000                      |
| Draw calls (city)     | < 200 | < 500          | < 500                      |

---

## Authentication & Governance Phasing

| Capability         | MVP | v1                | v2           |
| ------------------ | --- | ----------------- | ------------ |
| Anonymous access   | ✓   | ✓ (default)       | ✓ (default)  |
| JWT authentication | —   | ✓ (optional)      | ✓            |
| Governor role      | —   | ✓ (authenticated) | ✓            |
| Simulation tick    | —   | ✓ (backend only)  | ✓            |
| Governance UI      | —   | —                 | ✓            |
| Policy editing     | —   | —                 | ✓ (governor) |

---

## AI Inference Budget (Daily)

| Resource                      | MVP    | v1      | v2                |
| ----------------------------- | ------ | ------- | ----------------- |
| Tokens per anonymous user     | 50,000 | 100,000 | 100,000           |
| Tokens per authenticated user | —      | 500,000 | 500,000           |
| Concurrent inference jobs     | 5      | 20      | 100               |
| Background agent inference    | Off    | Limited | Simulation-driven |

---

## Document Index

When editing these files, verify against this document:

- `current-state/`, `future-vision/`
- `roadmap/mvp.md`, `roadmap/v1.md`, `roadmap/v2.md`
- `world-bible/agents.md`, `world-bible/buildings.md`, `world-bible/galaxy.md`
- `architecture/overview.md`, `architecture/database.md`, `architecture/rendering.md`
- `performance/performance-budget.md`
- `feature-specs/*.md`
- `memory/project-context.md`
