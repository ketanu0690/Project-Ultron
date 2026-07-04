# ADR-0011: Deployment Platform

## Status

**Accepted** — 2026-06-14

## Context

Small team needs production deployment without Kubernetes operational burden. Self-hosted infrastructure with monitoring required.

## Decision

**Docker Compose (dev) + Coolify (staging/production)** for MVP through v1.

| Environment         | Platform                                 |
| ------------------- | ---------------------------------------- |
| Development         | Docker Compose (8 services)              |
| Staging             | Coolify single node                      |
| Production (MVP–v1) | Coolify single node                      |
| Production (v2+)    | Coolify multi-node → evaluate Kubernetes |

### Monitoring Stack

- Prometheus (metrics collection)
- Grafana (dashboards)
- Loki deferred to v2 (log aggregation)

### Secrets

- Coolify encrypted environment variables
- No secrets in git
- TLS via Let's Encrypt (Coolify managed)

## Alternatives Considered

- **Kubernetes at MVP**: Rejected — team size
- **Vercel + managed DB**: Rejected — Ollama GPU requires self-hosted
- **Railway/Fly.io**: Rejected — GPU + WebSocket long-connection needs

## Consequences

- Single-node ceiling ~1,000 concurrent users (see scalability-plan)
- Ollama requires GPU on host
- Manual scaling path documented for v2

## References

- `docs/architecture/deployment.md`
- `docs/architecture/scalability-plan.md`
