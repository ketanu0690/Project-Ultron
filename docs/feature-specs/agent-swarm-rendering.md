# Feature Spec: Agent Swarm Rendering

## Purpose

Define LOD and rendering rules for displaying hundreds to thousands of agents without exceeding frame budget.

## Scope: v1 planning, v2 required

> Per `lessons-learned.md`: plan swarm rendering from v1 even though 5,000 agents ship at v2.

## Agent Rendering Tiers

| Tier        | Condition                               | Visual                                       | Max Count |
| ----------- | --------------------------------------- | -------------------------------------------- | --------- |
| **T0 Full** | Agent in current room                   | Hologram avatar + particles + name tag       | 20        |
| **T1 LOD**  | Agent in current district, outside room | Simplified silhouette, no particles          | 50        |
| **T2 Dot**  | Agent in city, outside district         | Colored dot on mini-map + district aggregate | 500       |
| **T3 Data** | Agent elsewhere                         | Count in district HUD only; no render        | 5,000     |

## Phase Targets

| Phase | Agents in DB | Render Strategy                      |
| ----- | ------------ | ------------------------------------ |
| MVP   | 50           | T0 for all visible (single district) |
| v1    | 500          | T0 in viewport + T2 dots on mini-map |
| v2    | 5,000        | Full tier system T0–T3               |

## Culling Rules

1. Frustum cull all agent meshes
2. Only agents in subscribed district receive position updates
3. Position update throttle: 5s for T1; 30s for T2
4. Maximum T0 agents: 20 (oldest selection demoted to T1)
5. Selected/followed agent always T0

## Mini-Map Agent Dots (v1)

- 2D canvas overlay, bottom-right
- Dot color = district primary color
- Dot position = agent ground position projected
- Click dot → navigate to agent (if in accessible district)

## Swarm Animation (v2)

- District-level aggregate flow lines (not per-agent) for cross-district delegation
- Debate Amphitheater: up to 50 T0 agents in special scene

## Performance Budget

| Configuration                   | Draw Calls | FPS Target   |
| ------------------------------- | ---------- | ------------ |
| 50 T0                           | < 100      | 60           |
| 20 T0 + 30 T1                   | < 150      | 60           |
| 20 T0 + 100 T2 dots (canvas)    | < 120      | 60           |
| 20 T0 + 50 T1 + 500 T2 (v1 max) | < 200      | 30 ship gate |

## API Requirements

- `GET /agents?district={id}&viewport={bounds}` — viewport-scoped agent list
- Agent position in `agent:status` WebSocket event
- District-level `agentCount` in navigation response (for T3)

## Implementation Steps

### v1 (before scaling past 100 agents)

1. Implement mini-map canvas with agent dots
2. Add viewport bounds to navigation subscription
3. Server filters agents by viewport
4. T0/T1 swap based on room/district membership

### v2

5. T2 dots at city scale
6. T3 aggregate counts only
7. Swarm flow visualization for bulk delegation

## Acceptance Criteria

- [ ] 500 agents in DB: ≥ 30 FPS in Reasoning District viewport
- [ ] 5,000 agents in DB: ≥ 30 FPS with tier system active
- [ ] Selected agent always renders T0
- [ ] Mini-map shows correct agent positions
- [ ] No agent render beyond 20 T0 simultaneously

## References

- `docs/architecture/rendering.md`
- `docs/architecture/scalability-plan.md`
- `docs/canonical-numbers.md`
