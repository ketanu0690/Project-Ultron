# Feature Spec: District System

## Purpose

Render five themed cognitive districts within the AI Megacity, each with unique visual identity, buildings, and agent population.

## Scope: MVP (1 district), v1 (all 5)

## Requirements

### MVP: Reasoning District

- [ ] District zone visible in megacity aerial view
- [ ] **1 fully modeled building** (Planning Tower) + other Reasoning buildings as LOD footprints
- [ ] 5 building **types** documented; 1 implemented at full detail (see `canonical-numbers.md`)
- [ ] District-specific lighting, fog, and audio
- [ ] 50 agents distributed in buildings
- [ ] Building placement from seed data
- [ ] District boundary visual (ground shader gradient)

### v1: All Districts

- [ ] 5 districts with unique themes per design-system
- [ ] 40 buildings per district (200 total)
- [ ] District-specific weather effects
- [ ] Transit stations at boundaries
- [ ] 500 agents distributed by population table
- [ ] District HUD: agent count, throughput, health

## District Theme Config

Each district loads theme from `packages/shared/src/district-themes.ts`:

```typescript
interface DistrictTheme {
  id: DistrictId;
  colors: { primary; secondary; accent; background };
  lighting: LightingProfile;
  fog: FogConfig;
  audio: string; // ambient loop URL
  procgen: ProcgenParams;
  weather: WeatherEffect | null;
}
```

## API Endpoints

```
GET /api/v1/navigation/megacity
GET /api/v1/navigation/district/:id
GET /api/v1/districts
GET /api/v1/districts/:id
GET /api/v1/districts/:id/buildings
GET /api/v1/districts/:id/agents
```

## Scene Components

```
scenes/megacity/
├── MegacityScene.tsx       # Aerial view, all districts
├── DistrictZone.tsx        # Ground plane per district
└── TransitLine.tsx         # v1: monorail paths

scenes/district/
├── DistrictScene.tsx       # District detail view
├── DistrictGround.tsx      # Themed ground plane
├── DistrictWeather.tsx     # Rain, dust, spores
├── BuildingNode.tsx        # Building instances
└── DistrictHUD.tsx
```

## Implementation Steps

1. Create `MegacityScene` with 5 colored zone footprints
2. Implement `DistrictScene` with theme loading
3. Apply district lighting profile on entry
4. Place buildings from API data with district material variants
5. Add district weather particle system
6. Implement boundary gradient shader between districts
7. (v1) Add remaining 4 districts with unique themes
8. (v1) Add transit lines between district centers

## Acceptance Criteria

- [ ] 5 districts visible from megacity aerial view
- [ ] Each district identifiable by color within 2 seconds
- [ ] Buildings render with district-specific materials
- [ ] District entry triggers lighting/audio change
- [ ] Agents visible within district buildings
