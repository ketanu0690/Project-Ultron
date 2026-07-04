# API and Realtime Contracts

> **Authoritative contract** for REST endpoints and WebSocket events.  
> TypeScript types live in `packages/shared/src/` (to be created at M1).  
> Decision record: [ADR-0015](../adr/0015-api-and-realtime-contract.md)

---

## Purpose

Single source of truth for client-server communication. All feature specs reference this document for transport details.

---

## REST API Conventions

### Base URL

```
https://{host}/api/v1
```

### Response Envelope

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    scale?: ScaleLevel;
  };
  timestamp: string; // ISO 8601
}
```

### Error Envelope

```typescript
interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}
```

### Common Headers

| Header            | Required     | Description            |
| ----------------- | ------------ | ---------------------- |
| `Content-Type`    | POST/PATCH   | `application/json`     |
| `Idempotency-Key` | Mutations    | UUID, 24h dedup window |
| `Authorization`   | v1+ optional | `Bearer {jwt}`         |

---

## Core REST Endpoints

### Navigation

```
GET  /navigation/:scale?focus={entityId}
GET  /search?q={query}&type={entityType}&limit=20
```

### Districts

```
GET  /districts
GET  /districts/:id
GET  /districts/:id/buildings
GET  /districts/:id/agents
GET  /districts/:id/metrics
```

### Buildings

```
GET  /buildings/:id
GET  /buildings/:id/floors
GET  /buildings/:id/rooms
GET  /buildings/:id/agents
GET  /buildings/:id/metrics
```

### Agents

```
GET   /agents?district={id}&status={status}&page=1&pageSize=50
GET   /agents/:id
POST  /agents/:id/dialogue          # Initiate; stream via WS or SSE
GET   /agents/:id/status
GET   /agents/:id/memory
POST  /agents/:id/memory/search     # v2: semantic search
POST  /agents/:id/delegate          # v1
```

### World

```
GET  /world/state
GET  /earth/state                   # v1
GET  /earth/ground-stations         # v1
GET  /ring/segments                 # v1
GET  /ring/segments/:id             # v1
GET  /ring/threats                  # v2
GET  /star-systems                  # v2
GET  /star-systems/:id              # v2
```

### Simulation (v1+)

```
GET  /simulation/state
GET  /simulation/events?limit=50&severity={level}
```

### Governance (v2)

```
GET   /governance/policies
GET   /governance/policies/:id
PATCH /governance/policies/:id      # Governor only
GET   /governance/decisions?limit=20
```

### Auth (v1+)

```
POST  /auth/anonymous               # Create anonymous session
POST  /auth/register                # Optional registration
POST  /auth/login
POST  /auth/refresh
POST  /auth/logout
GET   /auth/me
```

### Health

```
GET  /health                        # Liveness
GET  /ready                         # Readiness (DB + Redis)
GET  /metrics                       # Prometheus
```

---

## WebSocket Protocol

### Connection

```
wss://{host}/ws
```

### Message Envelope

```typescript
interface WsMessage<T = unknown> {
  event: string;
  version: 1;
  payload: T;
  timestamp: string;
  requestId?: string;
}
```

---

## WebSocket Events — Client → Server

### `nav:subscribe`

```typescript
{ scale: ScaleLevel; focusId?: string }
```

### `nav:unsubscribe`

```typescript
{
  scale: ScaleLevel;
}
```

### `nav:ack`

```typescript
{
  tick: number;
}
```

### `agent:dialogue`

```typescript
{
  agentId: string;
  message: string;
  sessionId?: string;  // omit to start new session
}
```

### `agent:delegate` (v1)

```typescript
{
  sourceAgentId: string;
  targetAgentId: string;
  task: {
    description: string;
    priority: number;
  }
}
```

### `select:entity`

```typescript
{
  entityType: EntityType;
  entityId: string;
}
```

### `ping`

```typescript
{
}
```

---

## WebSocket Events — Server → Client

### `world:state`

```typescript
{
  tick: number;
  scale: ScaleLevel;
  changes: {
    added: Entity[];
    updated: Partial<Entity>[];
    removed: string[];
  };
}
// Batched every 100ms
```

### `world:snapshot` (on subscribe / reconnect)

```typescript
{
  tick: number;
  scale: ScaleLevel;
  entities: Record<string, Entity[]>;
  worldState: WorldStateVariables;
  metrics: ScaleMetrics;
}
```

### `agent:status`

```typescript
{
  agentId: string;
  status: AgentStatus;
  position?: [number, number, number];
  buildingId?: string;
  roomId?: string;
}
```

### `agent:dialogue`

```typescript
{
  sessionId: string;
  agentId: string;
  token?: string;
  toolCall?: {
    id: string;
    name: string;
    input: Record<string, unknown>;
    status: 'pending' | 'running' | 'complete' | 'error';
    result?: unknown;
  };
  done?: boolean;
  error?: string;
}
```

### `simulation:tick` (v1+)

```typescript
{
  tickId: number;
  worldState: WorldStateVariables;
  changes: WorldStateDiff;
}
```

### `simulation:event` (v1+)

```typescript
{
  eventId: string;
  type: SimulationEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  data: Record<string, unknown>;
}
```

### `defense:alert` (v1+)

```typescript
{
  threatId: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  segmentId: string;
  type: 'debris' | 'asteroid' | 'satellite' | 'anomaly' | 'solar';
}
```

### `building:metrics`

```typescript
{
  buildingId: string;
  metrics: {
    throughput: number;
    errorRate: number;
    uptime: number;
  }
}
```

### `governance:policy` (v2)

```typescript
{
  policyId: string;
  change: 'created' | 'updated' | 'deleted';
  policy: GovernancePolicy;
}
```

### `pong`

```typescript
{
  serverTime: string;
}
```

---

## Shared Type Catalog

### `ScaleLevel`

```typescript
type ScaleLevel =
  | 'galaxy'
  | 'solar_system'
  | 'earth'
  | 'orbital_ring'
  | 'megacity'
  | 'district'
  | 'building'
  | 'room'
  | 'agent'
  | 'memory';
```

### `AgentStatus`

```typescript
type AgentStatus =
  | 'idle'
  | 'thinking'
  | 'acting'
  | 'learning'
  | 'migrating'
  | 'offline'
  | 'error';
```

### `DistrictId`

```typescript
type DistrictId =
  'perception' | 'memory' | 'reasoning' | 'action' | 'self_improvement';
```

### `EntityType`

```typescript
type EntityType =
  | 'district'
  | 'building'
  | 'room'
  | 'agent'
  | 'ring_segment'
  | 'threat'
  | 'star_system';
```

### `WorldStateVariables`

```typescript
interface WorldStateVariables {
  planetaryHealth: number; // 0-100
  cityProsperity: number;
  agentMorale: number;
  defenseReadiness: number;
  knowledgeIndex: number;
  innovationRate: number;
}
```

---

## SSE Fallback (Dialogue)

When WebSocket unavailable:

```
POST /api/v1/agents/:id/dialogue
Content-Type: application/json
Accept: text/event-stream

{ "message": "...", "sessionId": "..." }
```

Response: `text/event-stream`

```
event: token
data: {"token": "Hello"}

event: toolCall
data: {"id": "...", "name": "search_memory", "status": "running"}

event: done
data: {"sessionId": "..."}
```

---

## Rate Limits

| Identity           | REST      | WS messages/min | Tokens/day |
| ------------------ | --------- | --------------- | ---------- |
| Anonymous          | 100/min   | 120             | 50,000     |
| Authenticated (v1) | 1,000/min | 600             | 500,000    |

---

## Implementation Guidance

1. Create `packages/shared/src/api/` with all types above
2. Generate OpenAPI 3.1 spec from this document at M1
3. NestJS DTOs import from `@ultron/shared`
4. Client `useWorldSocket` hook types events via discriminated union on `event` field
5. Contract changes require ADR or version bump
