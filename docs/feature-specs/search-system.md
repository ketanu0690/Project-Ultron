# Feature Spec: Search System

## Purpose

Cross-entity search with quick-jump navigation to buildings, agents, rooms, and districts.

## Scope: v1

## Requirements

### Functional

- [ ] Search input in top bar (replaces MVP placeholder)
- [ ] Search across: agents, buildings, rooms, districts
- [ ] Results grouped by entity type
- [ ] Click result → instant navigation to entity (v1 animated transition)
- [ ] Keyboard: `/` focuses search; `↑↓` navigates results; `Enter` selects
- [ ] Minimum query length: 2 characters
- [ ] Debounce: 300ms

### Search Fields

| Entity   | Indexed Fields       |
| -------- | -------------------- |
| Agent    | name, role, id       |
| Building | name, type, district |
| Room     | name, type, building |
| District | name, type           |

### v2 Additions

- [ ] Semantic search via pgvector (natural language)
- [ ] Memory content search
- [ ] Star system search

## API

```
GET /api/v1/search?q={query}&type={optional}&limit=20
```

### Response

```typescript
interface SearchResponse {
  results: Array<{
    entityType: EntityType;
    entityId: string;
    name: string;
    subtitle: string; // e.g., "Reasoning District · planner"
    scale: ScaleLevel; // navigation target
    score: number;
  }>;
  total: number;
  query: string;
}
```

## Implementation

- PostgreSQL full-text search (`tsvector`) on name fields at v1
- GIN index on search vectors
- pgvector semantic search at v2

## Performance

- [ ] p95 response < 500ms with 500 agents, 200 buildings
- [ ] Results capped at 20 per query

## Acceptance Criteria

- [ ] Search "Sigma" returns agent Analyst Sigma-7
- [ ] Search "Planning" returns Planning Tower building
- [ ] Selecting result navigates to correct scale and selects entity
- [ ] Empty state shown for no results

## References

- `docs/architecture/api-contracts.md`
- `docs/feature-specs/world-navigation.md`
