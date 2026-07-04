# ADR-0015: API and Realtime Contract

## Status

**Accepted** — 2026-06-14

## Context

REST endpoints, WebSocket events, and dialogue transport were described inconsistently across `backend.md`, `realtime.md`, `agent-system.md`, and feature specs. Implementation requires a single contract.

## Decision

### Dialogue Transport (Authoritative)

| Mode         | Protocol                               | When                  |
| ------------ | -------------------------------------- | --------------------- |
| **Primary**  | WebSocket `agent:dialogue`             | Client connected      |
| **Fallback** | SSE `POST /api/v1/agents/:id/dialogue` | WebSocket unavailable |
| **Never**    | Polling for token stream               | —                     |

`POST /api/v1/agents/:id/dialogue` initiates session; streaming tokens flow via WebSocket. SSE fallback streams from same POST response.

### WebSocket Connection

- Endpoint: `wss://{host}/ws`
- Auth: session cookie (anonymous or JWT)
- Heartbeat: `ping`/`pong` every 30s
- Reconnect: exponential backoff, full snapshot on reconnect

### Channel Catalog

See `docs/architecture/api-contracts.md` for complete schemas.

### Versioning

- REST: `/api/v1/` prefix
- WebSocket: event `version` field in payload (default `1`)
- Breaking changes require `/api/v2/` or event version bump

### Client Acknowledgment

- Client sends `nav:ack { tick }` within 5s of snapshot
- Server may resend snapshot if no ack

## Alternatives Considered

- **REST-only dialogue**: Rejected — poor streaming UX
- **Socket.IO**: Rejected per ADR in realtime.md
- **GraphQL subscriptions**: Rejected — not in stack

## Consequences

- `packages/shared/src/events.ts` is canonical type source
- OpenAPI spec generated from `api-contracts.md` at M1
- All feature specs reference api-contracts.md for transport

## References

- `docs/architecture/api-contracts.md`
- `docs/architecture/realtime.md`
