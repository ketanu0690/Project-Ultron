# District Themes

## Purpose

Provide the **complete visual specification** for each of the five AI Megacity districts — the authoritative reference for art, engineering, and design decisions.

---

## Responsibilities

- Consolidated district identity per cognitive domain
- Visual, architectural, and interactive specifications
- Asset requirements and procgen parameters
- Cross-district differentiation rules

---

## Theme Matrix

| Property     | Perception         | Memory              | Reasoning            | Action                | Self Improvement |
| ------------ | ------------------ | ------------------- | -------------------- | --------------------- | ---------------- |
| Primary      | `#7B61FF`          | `#D4A853`           | `#4B3F9E`            | `#FF6B35`             | `#10B981`        |
| Secondary    | `#00E5FF`          | `#4A90D9`           | `#C0C8D8`            | `#E63946`             | `#A855F7`        |
| Accent       | `#39FF14`          | `#F0F0FF`           | `#FFD700`            | `#06D6A0`             | `#84CC16`        |
| Background   | `#0A0A12`          | `#12101A`           | `#08081A`            | `#1A1410`             | `#0A1A12`        |
| Mood         | Alert, electric    | Contemplative, deep | Precise, intense     | Kinetic, urgent       | Patient, alive   |
| Architecture | Sprawling + spires | Vertical towers     | Monumental cathedral | Horizontal industrial | Organic curves   |
| Weather      | Static rain        | Golden dust         | Clear                | Industrial haze       | Organic spores   |
| Audio        | Electronic pulses  | Deep resonance      | Ticking, whispers    | Machinery, clanks     | Growth, bubbling |

---

## Perception District

### Visual Identity

- **Silhouette**: Low skyline with tall receiver spires
- **Signature element**: Holographic data waterfalls flowing into intake pools
- **Ground**: Dark wet asphalt with neon violet reflections
- **Sky**: Overcast with static rain particles

### Building Skin

```
Base material: Dark metal (#1A1A2A) with wetness shader
Edge glow: #00E5FF neon strips
Window pattern: Horizontal slit windows (receiver aesthetic)
Roof: Antenna arrays, dish receivers
Damage state: Sparking antenna, dimmed receivers
```

### Procgen Parameters

```json
{
  "buildingHeight": { "min": 20, "max": 200, "bias": "low" },
  "buildingDensity": 0.7,
  "spiresPerKm2": 8,
  "openPlazas": 0.3,
  "neonIntensity": 0.8
}
```

---

## Memory District

### Visual Identity

- **Silhouette**: Dense vertical towers with light bridges
- **Signature element**: Holographic archive stacks visible through glass facades
- **Ground**: Polished dark stone with gold inlay patterns
- **Sky**: Warm amber haze with floating dust motes

### Building Skin

```
Base material: Dark stone (#1A1520) with gold vein texture
Edge glow: #4A90D9 neon strips
Window pattern: Tall arched windows (library aesthetic)
Roof: Crystal vault domes
Damage state: Cracked vault, fading bridges
```

### Procgen Parameters

```json
{
  "buildingHeight": { "min": 50, "max": 400, "bias": "high" },
  "buildingDensity": 0.9,
  "bridgesPerKm2": 12,
  "vaultDomes": 0.2,
  "neonIntensity": 0.5
}
```

---

## Reasoning District

### Visual Identity

- **Silhouette**: Monumental towers with rotating inference rings
- **Signature element**: Geometric proof spaces visible as glowing interiors
- **Ground**: White marble with geometric inlay
- **Sky**: Clear, cold, star-visible

### Building Skin

```
Base material: Light stone (#2A2A3A) with geometric patterns
Edge glow: #FFD700 accent on peaks only
Window pattern: Large panoramic panels (observatory aesthetic)
Roof: Rotating ring structures
Damage state: Cracked rings, dimmed proofs
```

### Procgen Parameters

```json
{
  "buildingHeight": { "min": 100, "max": 500, "bias": "high" },
  "buildingDensity": 0.6,
  "inferenceRings": 0.4,
  "amphitheaters": 0.1,
  "neonIntensity": 0.3
}
```

---

## Action District

### Visual Identity

- **Silhouette**: Low horizontal sprawl with crane arms and smokestacks
- **Signature element**: Moving conveyor systems between buildings
- **Ground**: Metal grating with orange warning markings
- **Sky**: Hazy with industrial particulate

### Building Skin

```
Base material: Rusted metal (#2A1A10) with industrial wear
Edge glow: #FFBE0B motion strips (animated)
Window pattern: Small porthole windows (factory aesthetic)
Roof: Crane arms, exhaust vents, launch pads
Damage state: Smoke, sparking machinery
```

### Procgen Parameters

```json
{
  "buildingHeight": { "min": 10, "max": 80, "bias": "low" },
  "buildingDensity": 0.8,
  "conveyorLinks": 0.5,
  "craneArms": 0.3,
  "neonIntensity": 0.6
}
```

---

## Self Improvement District

### Visual Identity

- **Silhouette**: Organic curves with lab domes and garden terraces
- **Signature element**: Neural garden terraces with bioluminescent plants
- **Ground**: Living moss with embedded fiber optics
- **Sky**: Green-tinted with organic spore particles

### Building Skin

```
Base material: Bio-composite (#1A2A1A) with organic texture
Edge glow: #A855F7 mutation accents
Window pattern: Curved greenhouse panels
Roof: Garden terraces, training crucible domes
Damage state: Withered gardens, dim crucibles
```

### Procgen Parameters

```json
{
  "buildingHeight": { "min": 15, "max": 120, "bias": "medium" },
  "buildingDensity": 0.5,
  "gardenTerraces": 0.4,
  "crucibleDomes": 0.15,
  "neonIntensity": 0.4
}
```

---

## Cross-District Rules

1. **Transition zones**: 200m blend between district palettes at boundaries
2. **Transit stations**: Neutral design (steel + cyan) at district borders
3. **No district logo/branding** — Identity through environment only
4. **Building type consistency** — Same building type looks different per district skin
5. **Audio crossfade**: 2s blend when crossing district boundaries

---

## Constraints

1. **Each district must be identifiable in a grayscale screenshot** — Silhouette differentiation
2. **Maximum 5 material variants per district** — Performance budget
3. **District themes are data-driven** — JSON config, not hardcoded
4. **No district may use another district's primary color as primary**
5. **Weather effects off on mobile**

---

## Future Considerations

- Seasonal district variations
- District themes evolve with governance prosperity score
- User-customizable district skins (v2)
- District theme packs as DLC/content updates

---

## Implementation Guidance

1. Store district themes as JSON in `packages/shared/src/district-themes.ts`
2. Building materials load district variant based on `building.districtId`
3. District entry triggers: lighting change, audio crossfade, fog params update
4. Ground plane shader blends between district palettes at boundaries
5. Procgen uses district parameters for building placement at city generation
