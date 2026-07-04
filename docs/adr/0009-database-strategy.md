# ADR-0009: Database Strategy

## Status

**Accepted** — 2026-06-14

## Context

ULTRON AI WORLD needs relational data, vector embeddings, time-series snapshots, and high-write dialogue logs. Multiple storage options were evaluated.

## Decision

**PostgreSQL 16+ with pgvector** as the single primary database for MVP through v2.

| Data Type                          | Storage                        | Phase |
| ---------------------------------- | ------------------------------ | ----- |
| Entities (agents, buildings, etc.) | PostgreSQL                     | MVP   |
| Vector embeddings                  | pgvector (1536d)               | MVP   |
| Agent runtime state                | Redis                          | MVP   |
| Dialogue messages                  | PostgreSQL (partitioned at v1) | MVP   |
| World state snapshots              | PostgreSQL (partitioned at v2) | v1    |
| LangGraph checkpoints              | PostgreSQL                     | MVP   |
| 3D assets                          | MinIO/S3                       | MVP   |

### ORM: Prisma

- Schema-first with `prisma migrate`
- Raw SQL for vector similarity queries
- Connection pooling via PgBouncer at v1

### Migration Trigger to Dedicated Vector DB

Evaluate Qdrant/Pinecone when:

- `agent_memories` exceeds **1M rows**, OR
- p95 similarity query exceeds **100ms**, OR
- Embedding storage exceeds **50 GB**

## Alternatives Considered

- **Separate vector DB at MVP**: Rejected — operational overhead
- **MongoDB**: Rejected — weaker relational + vector combo
- **TimescaleDB for snapshots**: Deferred to v2 if query pain

## Consequences

- All services query one database (simpler ops)
- Vector index (HNSW) built after seed load
- Monthly partition strategy for `dialogue_messages` at v1
- Read replica at v1 for navigation queries

## References

- `docs/architecture/database.md`
- `docs/architecture/scalability-plan.md`
