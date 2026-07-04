# ADR-0012: Monorepo Structure

## Status

**Accepted** — 2026-06-14

## Context

Frontend, backend, and shared types must stay synchronized across 100K+ LOC target. Deployment should be atomic.

## Decision

```
Project-Ultron/
├── apps/
│   ├── web/                 # Next.js (Q&A routes + /world 3D)
│   └── api/                 # NestJS
├── packages/
│   ├── shared/              # Types, constants, colors, events
│   └── personality/         # Prompt templates from Personality/
├── docs/                    # Documentation (this tree)
├── infra/                   # Docker, Prometheus, Grafana
├── Personality/             # Brand voice (existing)
├── docker-compose.yml
├── package.json             # Workspace root (npm workspaces)
└── turbo.json               # Optional: Turborepo for build orchestration
```

### Package Manager

**npm workspaces**.

### Shared Package Exports

- `ScaleLevel`, `DistrictId`, `AgentStatus` enums
- WebSocket event types (see `api-contracts.md`)
- Color constants
- District theme configs
- API response types

## Alternatives Considered

- **Polyrepo**: Rejected — shared type drift
- **Nx**: Rejected — unnecessary complexity for 2 apps
- **Separate web apps for Q&A and World**: Deferred — single app with routes per ADR-0006

## Consequences

- Atomic PRs can update API + client + types together
- CI builds all packages
- Import via `@ultron/shared`, `@ultron/personality`

## References

- `docs/memory/project-context.md`
- `docs/architecture/api-contracts.md`
