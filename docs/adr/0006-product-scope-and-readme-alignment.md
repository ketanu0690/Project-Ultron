# ADR-0006: Product Scope and README Alignment

## Status

**Accepted** — 2026-06-14

## Context

Two product descriptions coexist:

- `README.md`: Project Ultron as a **public Q&A problem-solving app** with global problems list
- `/docs`: **ULTRON AI WORLD** as a 3D spatial OS for AI civilization

Developers and AI agents encounter conflicting product identity. Implementation cannot proceed without resolving this.

## Decision

**ULTRON AI WORLD is a new product layer within the Project Ultron ecosystem**, not an immediate replacement for the Q&A app.

| Product              | Role                                   | Timeline            |
| -------------------- | -------------------------------------- | ------------------- |
| Project Ultron Q&A   | Current user-facing product            | Now                 |
| Global Problems List | Shared data asset                      | Now → integrated v1 |
| ULTRON AI WORLD      | 3D visualization and interaction layer | MVP Nov 2026        |
| Unified experience   | Q&A + World deep links                 | v2 2027             |

### Implementation Structure

- Single monorepo with shared packages
- Route separation: `/` (Q&A) and `/world` (3D) within `apps/web`, OR separate apps TBD at M1
- Shared personality, colors, and agent backend

## Alternatives Considered

### A: Replace Q&A entirely with 3D world

**Rejected**: Q&A is documented and may be live; 3D world is months from MVP.

### B: Unrelated projects — delete README alignment

**Rejected**: Wastes established brand, personality, and public-transparency mandate.

### C: 3D world as marketing demo only

**Rejected**: ADR-0001 commits to 3D-first spatial OS, not a demo.

## Consequences

- `README.md` must be updated during M1 to reference `/docs` and AI WORLD status
- Personality files apply to both products with context-specific tone (see `integration/project-ultron-to-ai-world.md`)
- Documentation in `/docs` is authoritative for AI WORLD; `README.md` for Q&A until integration

## References

- `docs/integration/project-ultron-to-ai-world.md`
- `docs/adr/0001-project-direction.md`
