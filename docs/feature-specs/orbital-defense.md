# Feature Spec: Orbital Defense

## Purpose

Visualize the equatorial defense ring with segment status, threat tracking, and uplink connections to districts.

## Scope: v1 (basic), v2 (threat system)

## Requirements

### v1

- [ ] Render ring as instanced segments along Earth orbit
- [ ] 12 operational zones with status colors
- [ ] Camera orbits along ring path
- [ ] Click segment → sidebar with status
- [ ] Uplink hub → transition to linked district
- [ ] Tether columns to ground stations

### v2

- [ ] Active threat objects with trajectory arcs
- [ ] Threat detail panel with risk level
- [ ] Auto-tracking animation
- [ ] Alert escalation visualization
- [ ] Defense response status indicators

## API Endpoints

```
GET /api/v1/navigation/orbital_ring
GET /api/v1/ring/segments
GET /api/v1/ring/segments/:id
GET /api/v1/ring/threats          # v2
```

## WebSocket Events

```
defense:alert { threatId, level, segment }
world:state { scale: 'orbital_ring', changes: {...} }
```

## Scene Components

```
scenes/orbital-ring/
├── OrbitalRingScene.tsx
├── RingSegments.tsx       # InstancedMesh
├── ThreatTracker.tsx      # v2: trajectory lines
├── TetherColumn.tsx
├── SegmentLabel.tsx
└── DefenseHUD.tsx
```

## Implementation Steps

1. Calculate ring path at Earth radius + 400km altitude
2. Create segment mesh and instance along path (360 segments, 12 zones)
3. Color segments by status from API
4. Implement orbital camera constraint
5. Add tether column visuals to ground station coordinates
6. (v2) Add threat objects with `Line2` trajectory arcs
7. Wire uplink clicks to district transitions

## Acceptance Criteria

- [ ] Ring visible from Earth view as thin band
- [ ] Segments color-coded by status
- [ ] Camera orbits ring smoothly
- [ ] Segment click shows status in sidebar
- [ ] Uplink transitions to correct district
