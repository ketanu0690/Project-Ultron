# ADR-0004: State Management

## Status

**Accepted** — 2026-06-14

## Context

ULTRON AI WORLD requires state management on both client and server:

- **Client**: Navigation, world entities, agent dialogues, UI panels
- **Server**: Agent runtime state, simulation state, realtime subscriptions
- **Sync**: WebSocket-based server-to-client state synchronization

## Decision

### Client State: Zustand

Four focused stores:

| Store             | Contents                                | Persistence          |
| ----------------- | --------------------------------------- | -------------------- |
| `worldStore`      | Entity data from server                 | Server-synced via WS |
| `navigationStore` | Scale, position, selection, breadcrumbs | Session              |
| `agentStore`      | Active dialogues, streaming messages    | Session              |
| `uiStore`         | Panel visibility, theme, preferences    | LocalStorage         |

### Server Runtime State: Redis

| Data                      | Structure                       | TTL          |
| ------------------------- | ------------------------------- | ------------ |
| Agent runtime status      | Hash per agent                  | Session      |
| Navigation subscriptions  | Set per client                  | Connection   |
| Inference budget counters | Hash per user/agent             | Daily/hourly |
| Navigation snapshots      | Hash per scale                  | 30s          |
| Pub/Sub channels          | world:state, agent:status, etc. | —            |

### Persistent State: PostgreSQL

All entity data, memories, governance policies, simulation history.

### Sync Protocol

- **Initial load**: REST `GET /api/v1/navigation/:scale`
- **Realtime**: WebSocket diffs on `world:state` channel
- **Dialogue**: WebSocket streaming on `agent:dialogue` channel
- **Optimistic UI**: Local update → server confirm/rollback

## Alternatives Considered

### A: Redux Toolkit + RTK Query

Full state management with data fetching.

**Rejected because**: Excessive boilerplate for our state shape. RTK Query adds complexity for WebSocket-based sync.

### B: Jotai/Recoil (Atomic State)

Fine-grained reactivity.

**Rejected because**: Overkill for our entity-update patterns. Zustand's slice-based stores are simpler.

### C: Server State Only (No Client Store)

Fetch on every render, WebSocket updates trigger refetch.

**Rejected because**: 3D scene needs local state for camera, selection, LOD. Refetch latency unacceptable for 60 FPS rendering.

### D: Event Sourcing (Client)

Client replays events to derive state.

**Rejected because**: Complexity unjustified for MVP. Server event sourcing considered for v2.

## Consequences

### Positive

- Zustand is lightweight (~1KB), no providers needed
- Redis pub/sub enables multi-node WebSocket fan-out
- Diff-based sync minimizes bandwidth
- Clear separation: ephemeral (Redis) vs persistent (PostgreSQL)

### Negative

- Four stores require coordination for cross-store updates
- Redis is single point of failure (mitigated by clustering at v1)
- Optimistic UI rollback adds complexity
- No time-travel debugging (no Redux DevTools)

### Mitigations

- Cross-store updates via custom hooks (e.g., `useSelectEntity`)
- Redis Sentinel for HA at v1
- Server is authoritative — client always accepts server correction
- Zustand middleware for dev logging in development

## References

- `docs/architecture/frontend.md`
- `docs/architecture/realtime.md`
- `docs/architecture/database.md`
