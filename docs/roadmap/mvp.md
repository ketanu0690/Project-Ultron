# MVP Specification

> **Entry & cosmic phasing**: [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) — Galaxy scroll journey is MVP entry; city chain (Megacity → Memory) unchanged from [ADR-0008](../adr/0008-mvp-entry-and-scale-stack.md).

## Purpose

Define the **Minimum Viable Product** for ULTRON AI WORLD — the smallest version that demonstrates core value.

---

## MVP Goal

> A user can fly into the AI Megacity, explore the Reasoning District, enter a building, talk to an agent, and view its memory.

---

## Scope

### In Scope

| Feature                  | Detail                                             |
| ------------------------ | -------------------------------------------------- |
| Megacity aerial view     | 5 district zones (colored regions)                 |
| Reasoning District       | Full 3D detail, 5 building types                   |
| Building: Planning Tower | Exterior + 3 interior rooms                        |
| 50 agents                | In Reasoning District, persistent                  |
| Agent dialogue           | Text chat with streaming response                  |
| Agent memory             | Timeline view (list, not graph)                    |
| WebSocket                | Agent status, building metrics                     |
| UI shell                 | Top bar, right sidebar, bottom HUD, dialogue panel |
| Docker deployment        | Full stack via docker-compose                      |

### Out of Scope

| Feature                         | Deferred To                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Galaxy / Solar System views     | Galaxy at MVP (mock HUD); Solar System stub — see [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) |
| Earth / Orbital Ring views      | Earth at MVP (mock HUD); Orbital Ring scene at MVP frontend — API at v1                                           |
| Other 4 districts (full detail) | v1                                                                                                                |
| Scale transitions (animated)    | Cosmic scales at MVP (ADR-0016); city chain instant cut (ADR-0008)                                                |
| Governance system               | v2                                                                                                                |
| Simulation tick                 | v1                                                                                                                |
| Authentication                  | v1                                                                                                                |
| Mobile UI                       | v1                                                                                                                |
| Memory graph (3D)               | v2                                                                                                                |
| Training pipeline               | v2                                                                                                                |

---

## Technical MVP

### Frontend

- Next.js app with R3F Canvas
- Megacity scene with Reasoning District
- Planning Tower exterior + 3 rooms
- Agent hologram avatars (50)
- Dialogue panel with WebSocket streaming
- Memory timeline panel
- Zustand stores (world, navigation, agent, ui)

### Backend

- NestJS with Prisma
- PostgreSQL with seed data (5 districts, 10 buildings, 50 agents)
- WebSocket gateway (agent status, dialogue, metrics)
- Agent orchestrator with LangGraph (planner graph)
- Model router (OpenRouter primary, Ollama fallback)
- Memory service (episodic + semantic)

### Infrastructure

- Docker Compose (8 services)
- Prometheus metrics on API
- Basic Grafana dashboard

---

## MVP Agent Configuration

| Role      | Count | Model           | District  |
| --------- | ----- | --------------- | --------- |
| planner   | 20    | claude-sonnet-4 | Reasoning |
| simulator | 10    | gpt-4o          | Reasoning |
| debater   | 10    | claude-sonnet-4 | Reasoning |
| verifier  | 10    | gpt-4o-mini     | Reasoning |

---

## MVP Success Criteria

| Criterion              | Target               |
| ---------------------- | -------------------- |
| Load megacity scene    | < 5 s                |
| Enter Planning Tower   | < 2 s                |
| Start agent dialogue   | < 2 s to first token |
| 50 agents visible      | ≥ 30 FPS desktop     |
| Docker compose up      | < 3 min cold start   |
| Agent memory retrieval | < 1 s                |

---

## MVP Timeline

**Target launch**: November 2026 (5 months from documentation)

| Month          | Focus                                       |
| -------------- | ------------------------------------------- |
| July 2026      | Monorepo, DB schema, API core, WebSocket    |
| August 2026    | Megacity scene, Reasoning District geometry |
| September 2026 | Building interior, agent avatars            |
| October 2026   | Agent dialogue, memory, polish              |
| November 2026  | Testing, deployment, launch                 |

---

## Tradeoffs Accepted for MVP

| Tradeoff                                     | Rationale                                          |
| -------------------------------------------- | -------------------------------------------------- |
| Instant cuts instead of animated transitions | Saves 4+ weeks of transition engineering           |
| One district only                            | Proves district theming before scaling             |
| 50 agents not 500                            | Sufficient for demo; reduces AI costs              |
| Timeline memory not graph                    | Graph view is v2 complexity                        |
| No auth                                      | Reduces scope; public by design aligns with Ultron |

---

## Implementation Guidance

See [`../feature-specs/`](../feature-specs/) for per-feature implementation details.
Track progress in [`../memory/active-work.md`](../memory/active-work.md).
