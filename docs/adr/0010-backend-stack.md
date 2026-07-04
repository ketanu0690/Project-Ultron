# ADR-0010: Backend Stack

## Status

**Accepted** — 2026-06-14

## Context

Backend must serve REST, WebSocket, AI orchestration, simulation cron, and queue jobs for a system scaling to thousands of agents.

## Decision

| Component  | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | NestJS (strict TypeScript)           |
| ORM        | Prisma                               |
| WebSocket  | `@nestjs/platform-ws` (ws library)   |
| Job queues | Bull (Redis-backed)                  |
| Validation | class-validator + class-transformer  |
| API style  | REST `/api/v1/` + WebSocket channels |
| Testing    | Jest + Supertest + testcontainers    |

### Module Boundaries

One NestJS module per domain: `agents`, `buildings`, `districts`, `governance`, `simulation`, `memory`, `ai`, `navigation`, `defense`, `health`.

### No GraphQL at MVP/v1

REST + WebSocket sufficient. Revisit at v2 if client query complexity warrants.

## Alternatives Considered

- **Express**: Rejected — no module structure, weaker WS integration
- **Fastify**: Rejected — smaller ecosystem for our patterns
- **tRPC**: Rejected — doesn't cover WebSocket streaming well

## Consequences

- Boilerplate overhead accepted for long-term maintainability
- All endpoints versioned under `/api/v1/`
- Soft deletes everywhere
- Prometheus metrics interceptor from day one

## References

- `docs/architecture/backend.md`
- `docs/architecture/api-contracts.md`
