# ADR-0013: Simulation vs Governance Phasing

## Status

**Accepted** — 2026-06-14

## Context

`simulation-system.md` includes policy evaluation. `governance.md` describes full council system. Roadmap deferred governance UI to v2 but simulation to v1. This created confusion about what ships when.

## Decision

### v1: Backend Simulation Only

- 60-second simulation tick runs server-side
- World state variables update (prosperity, health, etc.)
- Random events generated and broadcast via WebSocket
- Policy rules evaluated from **seeded defaults** (not user-editable)
- Visual indicators respond to state changes
- **No governance UI** — no council view, no policy editor, no voting

### v2: Governance UI + User Participation

- Policy CRUD interface for Governor role
- Council chamber visualization in Reasoning District
- Policy change proposals and approval flow
- Historical governance timeline
- User voting (optional, governor-gated)

### MVP: No Simulation

- Static world state from seed data
- Building metrics update from real agent activity only
- No simulation tick cron job

## Alternatives Considered

- **Full governance at v1**: Rejected — scope; auth not ready at MVP
- **No simulation until v2**: Rejected — living world is v1 value prop
- **Simulation without policy evaluation**: Rejected — policies drive event outcomes

## Consequences

- `GovernanceService` exists at v1 but is read-only (seed policies)
- `SimulationEngine` runs at v1 without user-facing governance
- Feature spec `governance-system.md` scoped to v2
- Milestones M4 auth wording corrected: auth at v1, governance UI at v2

## References

- `docs/feature-specs/simulation-system.md`
- `docs/feature-specs/governance-system.md`
- `docs/canonical-numbers.md`
