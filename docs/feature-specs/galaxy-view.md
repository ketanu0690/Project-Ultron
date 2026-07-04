# Feature Spec: Galaxy View

## Purpose

Render a navigable Milky Way with selectable star systems, serving as the outermost entry point to the scale stack.

## Scope: v2

## Requirements

### Functional

- [ ] Render 50,000+ stars via instanced point sprites
- [ ] Display 100 named star systems with status indicators
- [ ] Sol system highlighted as active civilization
- [ ] Logarithmic pan and zoom
- [ ] Double-click Sol to transition to Solar System
- [ ] Galaxy HUD: total agents, system count, alerts
- [ ] Press `G` to return from any depth

### Non-Functional

- [ ] ≥ 60 FPS with 50,000 stars
- [ ] Star load < 2 s
- [ ] Mobile: reduced to 10,000 stars, no nebula

## API Endpoints

```
GET /api/v1/navigation/galaxy
GET /api/v1/star-systems
GET /api/v1/star-systems/:id
```

## WebSocket Events

```
nav:subscribe { scale: 'galaxy' }
world:state { scale: 'galaxy', changes: {...} }
```

## Scene Components

```
scenes/galaxy/
├── GalaxyScene.tsx
├── StarField.tsx          # Instanced points
├── StarSystemMarker.tsx   # Named systems
├── NebulaBackground.tsx   # Volumetric background
└── GalaxyHUD.tsx          # HTML overlay
```

## Implementation Steps

1. Create `StarField` with custom shader (magnitude-based brightness)
2. Load star system data from API
3. Implement logarithmic zoom in `CameraController`
4. Add `StarSystemMarker` with hover tooltip
5. Wire double-click to `ScaleTransitionController`
6. Build `GalaxyHUD` with aggregate metrics
7. Profile at 50,000 stars

## Dependencies

- ScaleTransitionController
- NavigationService (galaxy scale query)
- SpatialIndex (not needed at this scale)

## Acceptance Criteria

- [ ] User sees Milky Way with Sol highlighted
- [ ] Zoom from full galaxy to star system level
- [ ] Double-click Sol initiates transition
- [ ] HUD shows civilization metrics
