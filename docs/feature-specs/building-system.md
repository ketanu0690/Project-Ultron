# Feature Spec: Building System

## Purpose

Render buildings with exterior detail, interior rooms, floor navigation, and real-time metric visualization.

## Scope: MVP (1 building), v1 (200 buildings)

## Requirements

### MVP: Planning Tower

- [ ] Exterior mesh with Reasoning District materials
- [ ] Window glow mapped to utilization metric
- [ ] 3 interior rooms: Strategy Room, Plan Vault, Observation Deck
- [ ] Floor selection via sidebar
- [ ] Portal transition from exterior to interior
- [ ] Agent stations within rooms

### v1: All Building Types

- [ ] 25 building types across 5 districts (5 per district)
- [ ] LOD system: footprint → simplified → detailed → interior
- [ ] Building state visuals (active, degraded, offline)
- [ ] Cutaway view for floor selection
- [ ] Corridor walk mode between rooms
- [ ] Building metrics in sidebar (throughput, error rate, uptime)

## Building States

| State        | Visual                           |
| ------------ | -------------------------------- |
| active       | Full glow, lit windows           |
| degraded     | Flickering lights, damage decals |
| offline      | Dark, desaturated                |
| constructing | Holographic blueprint outline    |

## API Endpoints

```
GET /api/v1/buildings/:id
GET /api/v1/buildings/:id/floors
GET /api/v1/buildings/:id/rooms
GET /api/v1/buildings/:id/agents
GET /api/v1/buildings/:id/metrics
```

## WebSocket Events

```
building:metrics { buildingId, metrics }
world:state { changes: { updated: [building] } }
```

## Scene Components

```
scenes/building/
├── BuildingScene.tsx
├── BuildingExterior.tsx
├── BuildingCutaway.tsx     # Floor highlight
├── WindowGlow.tsx          # Shader uniform
└── BuildingSidebar.tsx

scenes/interior/
├── InteriorScene.tsx
├── Corridor.tsx
├── RoomNode.tsx
├── AgentStation.tsx
└── TerminalNode.tsx
```

## Implementation Steps

1. Create glTF exterior model for Planning Tower
2. Implement `WindowGlow` shader driven by metrics WebSocket
3. Build interior scene with 3 rooms
4. Portal transition: exterior camera → interior camera
5. Floor selector in right sidebar
6. Place agent stations in rooms from API data
7. (v1) Create LOD variants for city-scale rendering
8. (v1) Add remaining 24 building type models

## Acceptance Criteria

- [ ] Building exterior renders with district theme
- [ ] Window glow reflects utilization metric
- [ ] User can enter building and navigate floors
- [ ] Rooms contain agent stations
- [ ] Building metrics update in realtime
