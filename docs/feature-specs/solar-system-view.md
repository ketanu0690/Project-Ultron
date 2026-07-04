# Feature Spec: Solar System View

## Purpose

Render the Sol system with orbiting planets, enabling navigation from Solar System to Earth and completing the planetary scale stack at v1.

## Scope: v1 (required for Earth scale stack integrity)

> **Phasing correction**: Originally deferred to v2 in `mvp.md`. Moved to v1 because Earth view requires Solar System as parent scale per `transportation.md` and `earth.md`.

## Requirements

### Functional

- [ ] Sun at center with corona glow
- [ ] 8 planets (Mercury through Neptune) + Pluto optional
- [ ] Earth highlighted with civilization activity indicator
- [ ] Simplified orbital animation (not N-body; scripted paths)
- [ ] Click Earth → transition to Earth view
- [ ] Click other planets → info panel only (no entry)
- [ ] Time scrub controls orbital positions
- [ ] Solar System HUD: system name, body count

### Non-Functional

- [ ] ≥ 60 FPS desktop with 9 bodies
- [ ] Load < 3s
- [ ] Mobile: static positions, no animation

## Scale Stack Position

```
Galaxy (v2) → Solar System (v1) → Earth (v1) → ...
```

At v1, user reaches Solar System via breadcrumb/quick-jump (not Galaxy descent). Galaxy → Solar System transition added at v2.

## API

```
GET /api/v1/navigation/solar_system
GET /api/v1/star-systems/sol
```

## Scene Components

```
scenes/solar-system/
├── SolarSystemScene.tsx
├── Sun.tsx
├── Planet.tsx              # Instanced or shared mesh
├── OrbitPath.tsx           # Decorative ring
├── EarthHighlight.tsx
└── SolarSystemHUD.tsx
```

## Implementation Steps

1. Create orbital paths as `THREE.CatmullRomCurve3` per planet
2. Animate planets with `useFrame` along path parameter
3. Earth emissive pulse for civilization indicator
4. Camera orbital controls around Sun
5. Click raycast for planet selection
6. Wire Earth click to `ScaleTransitionController` (v1 Earth transition)

## Acceptance Criteria

- [ ] Sun and planets visible with recognizable relative positions
- [ ] Earth pulses with activity indicator
- [ ] Click Earth navigates to Earth view
- [ ] Other planets show info panel only
- [ ] Orbits animate smoothly

## References

- `docs/feature-specs/earth-view.md`
- `docs/canonical-numbers.md` — Solar System at v1
- `docs/adr/0008-mvp-entry-and-scale-stack.md`
