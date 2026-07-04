# Lighting Design

## Purpose

Define the **lighting systems** for each scale level and district — creating atmosphere, readability, and visual identity through light.

---

## Responsibilities

- Per-scale lighting rigs
- Per-district lighting profiles
- Shadow configuration and performance
- Dynamic lighting tied to simulation state
- Post-processing interaction with lighting

---

## Global Lighting Principles

1. **Dark world, bright accents** — Light is information, not illumination
2. **Neon as narrative** — Glowing elements indicate activity and status
3. **No pure white light** — Maximum light color temperature: 6000K
4. **Shadows selective** — Only at LOD 0-1 where performance allows
5. **Volumetric effects sparingly** — Fog/haze for atmosphere, not obscuring

---

## Scale-Level Lighting

### Galaxy

| Light         | Type             | Color               | Intensity       |
| ------------- | ---------------- | ------------------- | --------------- |
| Star emission | Point (per star) | Variable (spectral) | Magnitude-based |
| Nebula glow   | Ambient          | `#1A0A2E`           | 0.3             |
| Sol corona    | Point            | `#FFD700`           | 2.0             |

No shadows. No directional light.

### Earth

| Light        | Type               | Color     | Intensity |
| ------------ | ------------------ | --------- | --------- |
| Sun          | Directional        | `#FFF5E0` | 1.5       |
| Earth bounce | Ambient            | `#1A2A3A` | 0.2       |
| Night lights | Emissive (texture) | `#FFE4B5` | Self-lit  |
| Atmosphere   | Shader             | `#4488FF` | Limb glow |

Shadow: sun directional only.

### Megacity (Aerial)

| Light            | Type                 | Color                 | Intensity     |
| ---------------- | -------------------- | --------------------- | ------------- |
| Moon             | Directional          | `#AABBCC`             | 0.4           |
| City glow        | Hemisphere           | `#0A1A2A` / `#1A2A3A` | 0.5           |
| District accents | Point (per district) | District primary      | 0.3           |
| Volumetric fog   | Fog exp2             | `#0A0E1A`             | Density 0.003 |

No shadows at aerial view.

### Interior

| Light            | Type             | Color                 | Intensity |
| ---------------- | ---------------- | --------------------- | --------- |
| Ceiling panels   | RectAreaLight    | `#E8ECF4`             | 0.8       |
| Terminal screens | Point            | `#00E5FF`             | 0.5       |
| Agent hologram   | Point (self-lit) | District color        | 1.0       |
| Ambient          | Hemisphere       | `#1A1A2A` / `#0A0A1A` | 0.3       |

Shadows enabled. Max 4 shadow-casting lights.

---

## District Lighting Profiles

### Perception District

```
Ambient: #0A0A12 (cool violet tint)
Key: #7B61FF directional (low angle, like dawn)
Neon: #00E5FF edge strips on all buildings
Special: Rain particle reflections, data stream glow
Mood: Alert, electric, receptive
Fog: Light violet haze, density 0.004
```

### Memory District

```
Ambient: #12101A (warm dark)
Key: #D4A853 directional (warm, like archive lamps)
Neon: #4A90D9 edge strips
Special: Light bridges between towers, vault glow from below
Mood: Contemplative, deep, reverent
Fog: Golden dust particles, density 0.002
```

### Reasoning District

```
Ambient: #08081A (cold dark)
Key: #C0C8D8 directional (bright, clinical)
Neon: #FFD700 accent on tower peaks
Special: Inference ring rotation glow, probability gradients
Mood: Precise, intense, cathedral-like
Fog: Minimal, clear air
```

### Action District

```
Ambient: #1A1410 (warm industrial)
Key: #FF6B35 directional (harsh, industrial)
Neon: #FFBE0B motion strips on machinery
Special: Spark particles at forge, launch pad glare
Mood: Kinetic, urgent, productive
Fog: Industrial haze, density 0.005
```

### Self Improvement District

```
Ambient: #0A1A12 (organic dark green)
Key: #10B981 directional (natural, growth)
Neon: #A855F7 mutation accents on lab equipment
Special: Bioluminescent garden glow, training crucible light
Mood: Patient, experimental, alive
Fog: Organic spore particles, density 0.003
```

---

## Dynamic Lighting

Lighting responds to simulation state:

| State Change                  | Lighting Effect                        |
| ----------------------------- | -------------------------------------- |
| Building utilization increase | Window glow brightens                  |
| Agent status → thinking       | Agent point light pulses               |
| Defense alert                 | Ring segments flash red                |
| Policy change                 | Affected district key light shifts hue |
| Construction                  | Holographic blueprint glow             |
| Building offline              | All lights fade to 10% over 2s         |

---

## Shadow Configuration

```typescript
// Conceptual shadow settings
const shadowConfig = {
  enabled: lod <= 1,
  mapSize: lod === 0 ? 2048 : 1024,
  camera: { near: 0.5, far: 500, fov: 50 },
  bias: -0.001,
  maxCasters: 4,
};
```

---

## Constraints

1. **Maximum 8 dynamic lights per scene** — Including emissive materials
2. **Shadow maps only at LOD 0-1** — Disabled at city overview
3. **No HDRI environment maps at MVP** — Procedural sky only
4. **Light color from district palette** — No arbitrary colors
5. **Volumetric fog off on mobile** — Performance

---

## Future Considerations

- Time-of-day lighting cycle (city scenes)
- Weather-reactive lighting (storms darken, lightning flashes)
- User-controlled lighting for screenshots
- Ray-traced reflections for interior scenes
- Light pollution visualization from space

---

## Implementation Guidance

1. Create `LightingRig` component per scale level
2. District lighting as preset configs loaded on district entry
3. Use `RectAreaLight` from drei for interior ceiling panels
4. Window glow via emissive shader uniform, not point lights
5. Dynamic state lighting via `useFrame` uniform updates
6. Toggle shadows based on `LODManager.getCurrentLOD()`
