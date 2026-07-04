# ADR-0014: Performance Targets

## Status

**Accepted** — 2026-06-14

## Context

Architecture docs target 60 FPS desktop. Roadmap acceptance criteria target 30 FPS. Both appeared in documentation without reconciliation, causing engineers to optimize for conflicting goals.

## Decision

### Dual-Target Model

| Metric                     | Design Target  | Ship Gate (minimum) | Platform |
| -------------------------- | -------------- | ------------------- | -------- |
| Frame rate                 | **60 FPS P50** | **30 FPS P50**      | Desktop  |
| Frame rate                 | **30 FPS P50** | **24 FPS P50**      | Mobile   |
| Frame time                 | < 16.6 ms      | < 33.3 ms           | Desktop  |
| Agent dialogue first token | < 1.5 s P50    | < 2 s P95           | All      |
| Scene load                 | < 3 s          | < 5 s               | Desktop  |

### Interpretation

- **Design for 60** — LOD, instancing, shader budgets target 60 FPS
- **Ship at 30** — milestone acceptance if P50 ≥ 30 FPS on reference hardware
- Reference hardware: mid-range desktop GPU (GTX 1660 / RX 580 equivalent), 1080p

### Profiling Requirements

- `@react-three/perf` in development
- Client FPS reported to Prometheus in production (sampled 1%)
- CI does not gate on FPS (manual milestone check)

## Alternatives Considered

- **60 FPS only**: Rejected — blocks ship on mid-range hardware
- **30 FPS only**: Rejected — undershoots desktop capability

## Consequences

- Update roadmap acceptance criteria to reference this ADR
- `canonical-numbers.md` is authoritative
- Performance regression tracked in Grafana

## References

- `docs/canonical-numbers.md`
- `docs/architecture/rendering.md`
