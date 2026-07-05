# Architecture Decisions

> **Cursor Memory File** — Key decisions already made. Do not re-debate without new information.  
> **Canonical numbers**: `docs/canonical-numbers.md`

---

## Decided (ADRs)

| #   | Decision                                              | ADR                                                                                                                  |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Project direction: 3D AI civilization world           | [0001](../adr/0001-project-direction.md)                                                                             |
| 2   | Frontend: Next.js + R3F + Zustand + Tailwind          | [0002](../adr/0002-frontend-stack.md)                                                                                |
| 3   | Rendering: Forward + post-processing, LOD system      | [0003](../adr/0003-rendering-engine.md)                                                                              |
| 4   | State: Zustand (client) + Redis (server)              | [0004](../adr/0004-state-management.md)                                                                              |
| 5   | AI: LangGraph + OpenRouter + Ollama                   | [0005](../adr/0005-ai-architecture.md)                                                                               |
| 6   | Product scope: AI WORLD + Q&A coexist                 | [0006](../adr/0006-product-scope-and-readme-alignment.md)                                                            |
| 7   | Public access and privacy model                       | [0007](../adr/0007-public-access-and-privacy.md)                                                                     |
| 8   | MVP city chain: 6 levels; instant cuts on city scales | [0008](../adr/0008-mvp-entry-and-scale-stack.md) — **partially superseded** by ADR-0016 (entry + cosmic transitions) |
| 16  | Galaxy-first entry; cosmic scale phasing              | [0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) — supersedes ADR-0008 entry/transition rows              |
| 9   | PostgreSQL + pgvector                                 | [0009](../adr/0009-database-strategy.md)                                                                             |
| 10  | NestJS + Prisma backend                               | [0010](../adr/0010-backend-stack.md)                                                                                 |
| 11  | Docker + Coolify deployment                           | [0011](../adr/0011-deployment-platform.md)                                                                           |
| 12  | Monorepo structure                                    | [0012](../adr/0012-monorepo-structure.md)                                                                            |
| 13  | Simulation v1; governance UI v2                       | [0013](../adr/0013-simulation-vs-governance-phasing.md)                                                              |
| 14  | Performance: design 60 FPS, ship 30 FPS               | [0014](../adr/0014-performance-targets.md)                                                                           |
| 15  | API + WebSocket contract                              | [0015](../adr/0015-api-and-realtime-contract.md)                                                                     |
| 17  | Autonomous living world (phased)                      | [0017](../adr/0017-autonomous-living-world.md) — Phase 1: LangGraph dialogue + semantic memory                       |

## Working Notes (Not ADRs)

| Date       | Note                                                                      | Proposal / doc                                                                                                                             |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-16 | **UI-first development** adopted — screens drive API contracts            | [`ui-first-workflow.md`](./ui-first-workflow.md)                                                                                           |
| 2026-06-16 | **Galaxy-first single entry approved** — showcase = default = production  | [Proposal 0001](../proposals/0001-ui-first-mvp-entry-and-cosmic-stack.md) ✅                                                               |
| 2026-06-16 | ADR-0016 accepted — galaxy entry, cosmic transitions                      | [Proposal 0002](../proposals/0002-supersede-adr-0008-galaxy-entry.md) ✅ → [ADR-0016](../adr/0016-galaxy-first-entry-and-scale-phasing.md) |
| 2026-06-16 | Galaxy-first sprint plan (Phase 1–3)                                      | [`galaxy-first-roadmap.md`](./galaxy-first-roadmap.md)                                                                                     |
| 2026-07-04 | **Autonomous living world approved** — AI Town direction; phased delivery | [Proposal 0003](../proposals/0003-autonomous-living-world.md) ✅ → [ADR-0017](../adr/0017-autonomous-living-world.md)                      |

## Open (Not Yet Decided)

| #   | Question            | Options                      | Decide By   |
| --- | ------------------- | ---------------------------- | ----------- |
| 1   | Auth provider       | Custom JWT vs OAuth2/OIDC    | v1 sprint   |
| 2   | Vector DB migration | pgvector vs Qdrant           | 1M vectors  |
| 3   | 3D asset pipeline   | Blender vs procedural        | M2          |
| 4   | CDN provider        | Cloudflare vs AWS CloudFront | v1 deploy   |
| 5   | GraphQL adoption    | REST+WS vs GraphQL           | v2 planning |

## Rejected

| Decision                                                       | Reason                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| Redux for state                                                | Too much boilerplate                                         |
| Socket.IO                                                      | Heavier than needed                                          |
| Unity/WebGL export                                             | Less web-native than R3F                                     |
| Separate vector DB at MVP                                      | Operational complexity                                       |
| Kubernetes at MVP                                              | Team size doesn't justify                                    |
| Light mode                                                     | Breaks cyberpunk aesthetic                                   |
| Multiple Canvases                                              | Breaks seamless transitions                                  |
| Photorealistic agent avatars                                   | GPU cost, uncanny valley                                     |
| Separate R3F Canvas per interior                               | Breaks ADR-0002/0003                                         |
| Dual-entry MVP (galaxy showcase + megacity production default) | User approved Galaxy-only entry — Proposal 0001 (2026-06-16) |

---

_Update when ADRs are accepted or new decisions are made._
