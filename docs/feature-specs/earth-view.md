# Feature Spec: Earth View

## Purpose

Render a recognizable Earth with atmosphere, enabling planetary navigation to the megacity and orbital ring.

## Scope: v1

## Requirements

### Functional

- [ ] Render Earth globe with 8K satellite texture
- [ ] Atmosphere shader with Rayleigh scattering
- [ ] Rotating cloud layer
- [ ] Night lights emissive texture
- [ ] Megacity beacon (pulsing cyan marker)
- [ ] Ground station markers for orbital ring tethers
- [ ] Click beacon → transition to Megacity
- [ ] Click ground station → transition to Orbital Ring
- [ ] Time scrub controls sun position
- [ ] Planetary health HUD

### Non-Functional

- [ ] ≥ 60 FPS desktop, ≥ 30 FPS mobile
- [ ] Earth load < 3 s
- [ ] Atmosphere shader < 2ms GPU

## API Endpoints

```
GET /api/v1/navigation/earth
GET /api/v1/earth/state
GET /api/v1/earth/ground-stations
```

## Scene Components

```
scenes/earth/
├── EarthScene.tsx
├── EarthGlobe.tsx         # Sphere + texture
├── AtmosphereShell.tsx    # Shader atmosphere
├── CloudLayer.tsx         # Rotating clouds
├── MegacityBeacon.tsx     # Pulsing marker
├── GroundStation.tsx      # Tether markers
└── EarthHUD.tsx
```

## Implementation Steps

1. Create `EarthGlobe` with `MeshStandardMaterial` + satellite texture
2. Implement `AtmosphereShell` with custom vertex/fragment shader
3. Add `CloudLayer` as larger transparent sphere
4. Night lights via emissive map blended by sun angle uniform
5. Place `MegacityBeacon` and `GroundStation` markers from API data
6. Wire click handlers to `ScaleTransitionController`
7. Build planetary health HUD from `earth/state` endpoint

## Acceptance Criteria

- [ ] Earth is recognizable at first glance
- [ ] Atmosphere visible at limb
- [ ] Clouds rotate independently
- [ ] Night lights visible on dark side
- [ ] Beacon click transitions to Megacity
