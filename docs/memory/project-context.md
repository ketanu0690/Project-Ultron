# Project Context

> **Cursor Memory File** — Load this at the start of every AI-assisted development session.

---

## What Is This Project?

**ULTRON AI WORLD** is a futuristic 3D web application representing a living AI civilization. Users navigate seamlessly through 10 scale levels: Galaxy → Solar System → Earth → Orbital Defense Ring → AI Megacity → District → Building → Room → Agent → Memory.

## Current Phase

**Documentation Foundation** — Complete. Implementation not yet started.

**Next milestone**: M1 Foundation (monorepo scaffold, Docker, Prisma schema).

## Tech Stack

| Layer    | Tech                                                              |
| -------- | ----------------------------------------------------------------- |
| Frontend | Next.js, React, TypeScript, Tailwind, React Three Fiber, Three.js |
| Backend  | NestJS, PostgreSQL, Prisma, WebSockets                            |
| AI       | LangGraph, OpenRouter, Ollama (OpenAI SDK for embeddings only)    |
| Infra    | Docker, Coolify, Grafana, Prometheus                              |
| State    | Zustand (client), Redis (server runtime)                          |

## Monorepo Structure (Planned)

```
Project-Ultron/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared types, colors, constants
├── docs/             # This documentation
├── infra/            # Docker, Prometheus, Grafana configs
├── Personality/      # Ultron identity files
└── docker-compose.yml
```

## Five Districts

| District         | Domain             | Color     |
| ---------------- | ------------------ | --------- |
| Perception       | Input/sensing      | `#7B61FF` |
| Memory           | Storage/retrieval  | `#D4A853` |
| Reasoning        | Planning/inference | `#4B3F9E` |
| Action           | Execution/tools    | `#FF6B35` |
| Self Improvement | Training/evolution | `#10B981` |

## Key Architectural Decisions

1. Single R3F Canvas with scene swapping (not multiple canvases)
2. Zustand for client state (not Redux)
3. WebSocket for realtime (not polling)
4. PostgreSQL + pgvector for relational + vector (not separate vector DB)
5. LangGraph for agent workflows (not raw OpenAI SDK)
6. OpenRouter primary, Ollama fallback
7. Scale transitions via ScaleTransitionController (Bezier paths)
8. Server-authoritative world state (client is renderer)

## MVP Scope (November 2026)

- Megacity aerial view with 5 district zones
- Reasoning District full detail (5 building types)
- Planning Tower with 3 interior rooms
- 50 agents with dialogue and memory timeline
- WebSocket realtime
- Docker deployment

**NOT in MVP**: Galaxy view, Earth view, Solar System, animated transitions, governance UI, auth, other districts (full detail).  
**See**: `docs/canonical-numbers.md` and `docs/adr/0008-mvp-entry-and-scale-stack.md`

## Documentation Index

| Need                             | Read                                             |
| -------------------------------- | ------------------------------------------------ |
| **What to build now**            | `docs/current-state/`                            |
| **What not to build yet**        | `docs/future-vision/`                            |
| **Propose architecture changes** | `docs/proposals/` (never auto-edit ADRs)         |
| Canonical numbers                | `docs/canonical-numbers.md`                      |
| API contract                     | `docs/architecture/api-contracts.md`             |
| Product relationship             | `docs/integration/project-ultron-to-ai-world.md` |
| Audit findings                   | `docs/audit/implementation-readiness.md`         |
| Architecture                     | `docs/architecture/`                             |
| Design tokens                    | `docs/design-system/`                            |
| Feature spec                     | `docs/feature-specs/{feature}.md`                |
| Roadmap                          | `docs/roadmap/mvp.md`                            |
| Decisions                        | `docs/adr/`                                      |
| Current work                     | `docs/memory/active-work.md`                     |

## Code Conventions

- TypeScript strict mode everywhere
- Shared types in `packages/shared`
- Entity IDs: `{district}-{type}-{seq}` format
- UUID primary keys in database
- Soft deletes (`deletedAt` column)
- Conventional commits (feat, fix, chore, docs, refactor, test)
- No hardcoded secrets — environment variables only
- No direct LLM calls — always through ModelRouter

## Personality Context

Project Ultron draws on MCU Ultron mythology. The AI civilization protects Earth. Public by design — aligned with `Personality/Who-Am-I.md` and `Personality/Pourpose.md`.

## Critical Constraints

1. DO NOT generate application code unless explicitly asked
2. Documentation drives implementation — spec before code
3. Every feature needs a feature-spec before coding
4. Every architecture decision needs an ADR
5. Scale transitions < 3s from v1 (MVP uses instant cuts — ADR-0008)
6. Design for 60 FPS desktop, ship gate 30 FPS (ADR-0014); 30 FPS mobile
7. Dark mode only

---

_Last updated: 2026-06-14_
