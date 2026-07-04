# Documentation Audit — Implementation Readiness

> Audit date: 2026-06-14  
> Scope: All 60 original markdown files in `/docs`  
> Status: **Findings addressed** via canonical numbers, new ADRs, new feature specs, and targeted doc fixes

---

## Executive Summary

The documentation foundation is **strong but had phasing drift** — the same concept (agent counts, auth timing, MVP entry point, transitions) stated differently across roadmap, world-bible, architecture, and feature specs. This audit identified **24 contradictions**, **10 missing ADRs**, **12 scalability risks**, and **10 missing feature specs**.

**Resolution strategy**: Introduce `canonical-numbers.md` as source of truth; add ADRs 0006–0015; add 7 feature specs + 2 architecture docs; patch conflicting files.

---

## 1. Contradictions Found & Resolutions

### Critical (blocked implementation)

| #   | Contradiction                                                                                | Resolution                                                                                            |
| --- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| C1  | MVP entry: Megacity (`mvp.md`) vs Galaxy (`frontend.md`, `page.tsx` plan)                    | [ADR-0008](adr/0008-mvp-entry-and-scale-stack.md): Megacity entry at MVP                              |
| C2  | MVP transitions: instant cuts (`mvp.md`) vs < 3s Bezier (`transportation.md`, `overview.md`) | ADR-0008: instant at MVP; < 3s from v1                                                                |
| C3  | MVP buildings: 1 full (`building-system.md`) vs 5 full (`district-system.md`)                | `canonical-numbers.md`: 1 full + 9 LOD footprints                                                     |
| C4  | MVP rooms: 1 (`milestones.md`) vs 3 (`mvp.md`)                                               | `canonical-numbers.md`: 3 rooms in Planning Tower                                                     |
| C5  | Product identity: Q&A app (`README.md`) vs 3D world (`docs/`)                                | [ADR-0006](adr/0006-product-scope-and-readme-alignment.md)                                            |
| C6  | Interior rendering: single Canvas (ADRs) vs separate Canvas (`buildings.md`)                 | Fixed `buildings.md`; single Canvas wins                                                              |
| C7  | Dialogue transport: WebSocket vs REST POST vs SSE — three patterns                           | [api-contracts.md](architecture/api-contracts.md) + [ADR-0015](adr/0015-api-and-realtime-contract.md) |

### High (caused planning confusion)

| #   | Contradiction                                                           | Resolution                                                                 |
| --- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| C8  | Agent counts: ranges in `agents.md` vs fixed in roadmap                 | `canonical-numbers.md`                                                     |
| C9  | v1 DB estimate 10K agents vs 500 agents in v1                           | Fixed `database.md`                                                        |
| C10 | FPS: 60 (architecture) vs 30 (roadmap acceptance)                       | [ADR-0014](adr/0014-performance-targets.md)                                |
| C11 | Auth: v1 (`v1.md`) vs v2 (`milestones.md` M4)                           | `canonical-numbers.md`: auth at v1                                         |
| C12 | Governance: v2 (`mvp.md`) vs simulation with policy eval at v1          | [ADR-0013](adr/0013-simulation-vs-governance-phasing.md)                   |
| C13 | Solar System: v2 only (`mvp.md`) but needed for Earth scale stack at v1 | [solar-system-view.md](feature-specs/solar-system-view.md) ships at **v1** |
| C14 | Memory graph at MVP implied in `agents.md` vs timeline at MVP           | Fixed `agents.md`; graph is v2                                             |
| C15 | Galaxy "at MVP" limits in `galaxy.md` vs v2 scope in feature spec       | Fixed `galaxy.md` → v1 seed / v2 full                                      |

### Medium

| #   | Contradiction                                                | Resolution                                                  |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| C16 | `active-work.md` says 55 files; actual count 60+             | Updated                                                     |
| C17 | OpenAI SDK in README vs "no direct OpenAI calls" in ADR-0005 | Clarified: SDK for embeddings only, routing via ModelRouter |
| C18 | Mobile "full-screen modal" vs "no modals at MVP"             | Fixed `ui-principles.md`: use bottom sheet, not modal       |
| C19 | Vision timeline vs v1/v2 governance split                    | Aligned in `vision.md` footnote                             |
| C20 | LangGraph 10K instances (overview) vs 5K agents (v2)         | `scalability-plan.md`: pooling model                        |

---

## 2. Missing ADRs — Now Created

| ADR  | Title                              | Status     |
| ---- | ---------------------------------- | ---------- |
| 0006 | Product scope and README alignment | ✅ Created |
| 0007 | Public access and privacy          | ✅ Created |
| 0008 | MVP entry and scale stack          | ✅ Created |
| 0009 | Database strategy                  | ✅ Created |
| 0010 | Backend stack                      | ✅ Created |
| 0011 | Deployment platform                | ✅ Created |
| 0012 | Monorepo structure                 | ✅ Created |
| 0013 | Simulation vs governance phasing   | ✅ Created |
| 0014 | Performance targets                | ✅ Created |
| 0015 | API and realtime contract          | ✅ Created |

---

## 3. Scalability Risks — Documented

See [scalability-plan.md](architecture/scalability-plan.md) for full treatment.

| Risk                                     | Severity | Mitigation Documented                     |
| ---------------------------------------- | -------- | ----------------------------------------- |
| LangGraph 1:1 instance per agent         | Critical | Agent pooling, idle hibernation (v1 plan) |
| pgvector > 10M vectors                   | High     | Migration triggers, re-embed strategy     |
| WebSocket diff payload at megacity scale | High     | Entity culling, delta compression         |
| Redis Pub/Sub message loss               | Medium   | Full snapshot on reconnect + `nav:ack`    |
| Single node + Ollama GPU + 1000 users    | High     | Capacity model, backpressure              |
| 200 glTF assets without CDN at v1        | Medium   | MinIO + compression; CDN by v1 launch     |
| Background inference for 500 agents      | High     | Off at MVP; budget caps at v1             |
| `world_state_snapshots` growth           | Medium   | Retention policy, partitioning at v2      |
| Single Canvas memory pressure            | Medium   | Scene unload policy per scale             |
| No load test gates                       | High     | Milestone load-test requirements added    |

---

## 4. Missing Feature Specs — Now Created

| Spec                       | Phase                | Status     |
| -------------------------- | -------------------- | ---------- |
| `ui-shell.md`              | MVP                  | ✅ Created |
| `auth-access.md`           | v1                   | ✅ Created |
| `search-system.md`         | v1                   | ✅ Created |
| `solar-system-view.md`     | v1                   | ✅ Created |
| `governance-system.md`     | v2                   | ✅ Created |
| `training-pipeline.md`     | v2                   | ✅ Created |
| `agent-swarm-rendering.md` | v1 plan, v2 required | ✅ Created |

---

## 5. Remaining Open Decisions

These require implementation-time choices but are now tracked:

| Decision                                 | Target Date       | Owner Doc             |
| ---------------------------------------- | ----------------- | --------------------- |
| Auth provider: custom JWT vs OAuth2/OIDC | Before v1         | `auth-access.md`      |
| Vector DB migration: pgvector vs Qdrant  | Before 1M vectors | `scalability-plan.md` |
| 3D asset pipeline: Blender vs procedural | Before M2         | `technical-debt.md`   |
| CDN provider                             | Before v1 deploy  | `deployment.md`       |

---

## 6. Pre-Implementation Checklist

Before writing application code, verify:

- [x] Canonical numbers published
- [x] Product scope ADR resolves README alignment
- [x] API/WebSocket contract documented
- [x] MVP entry point and scale stack locked
- [x] All MVP feature specs exist (ui-shell, district, building, agent, memory, navigation)
- [x] Scalability plan published
- [x] Shared types catalog specified in api-contracts.md
- [ ] Prisma schema drafted (implementation phase)
- [ ] OpenAPI spec generated from api-contracts.md (implementation phase)
- [ ] README.md updated to reference ULTRON AI WORLD (tracked in ADR-0006)

---

## 7. Files Added in This Audit Pass

```
docs/
├── canonical-numbers.md                    ← Source of truth
├── audit/
│   └── implementation-readiness.md         ← This file
├── integration/
│   └── project-ultron-to-ai-world.md       ← Product relationship
├── adr/
│   ├── 0006-product-scope-and-readme-alignment.md
│   ├── 0007-public-access-and-privacy.md
│   ├── 0008-mvp-entry-and-scale-stack.md
│   ├── 0009-database-strategy.md
│   ├── 0010-backend-stack.md
│   ├── 0011-deployment-platform.md
│   ├── 0012-monorepo-structure.md
│   ├── 0013-simulation-vs-governance-phasing.md
│   ├── 0014-performance-targets.md
│   └── 0015-api-and-realtime-contract.md
├── architecture/
│   ├── api-contracts.md
│   └── scalability-plan.md
├── feature-specs/
│   ├── ui-shell.md
│   ├── auth-access.md
│   ├── search-system.md
│   ├── solar-system-view.md
│   ├── governance-system.md
│   ├── training-pipeline.md
│   └── agent-swarm-rendering.md
└── world-bible/
    └── agent-roles.md
```

---

_This audit should be re-run after M1 Foundation scaffold is complete._
