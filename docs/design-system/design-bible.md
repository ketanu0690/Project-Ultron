# ULTRON AI WORLD — Design Bible

> **Version**: 1.0  
> **Date**: 2026-06-14  
> **Status**: Authoritative  
> **Audience**: Design, engineering, art, and product  
> **Scope**: Entire application — 3D world, UI overlays, transitions, and district identity

---

## How to Use This Document

This is the **single cohesive visual constitution** for ULTRON AI WORLD. Every surface — galaxy starfield, megacity neon, JARVIS dialogue panel, agent hologram — must feel like it belongs to **one futuristic civilization**, not a collection of unrelated themes.

| Need                 | Start here           | Deep dive                                  |
| -------------------- | -------------------- | ------------------------------------------ |
| Color tokens         | §1 Colors            | [`colors.md`](colors.md)                   |
| District identity    | §9 District Styles   | [`district-themes.md`](district-themes.md) |
| UI layout philosophy | §15 Panels           | [`ui-principles.md`](ui-principles.md)     |
| Camera & flight      | §10 Camera Behaviour | [`camera.md`](camera.md)                   |
| Motion timing        | §5 Motion            | [`animation.md`](animation.md)             |
| Scene lighting       | §6 Lighting          | [`lighting.md`](lighting.md)               |
| Type scale           | §3 Typography        | [`typography.md`](typography.md)           |

**Visual identity anchor**: _Neo-futurist utilitarianism_ — Cyberpunk density, No Man's Sky scale, JARVIS holographic overlays, Civilization governance aesthetics. **Dark mode only** at MVP.

---

## Universe Cohesion Manifesto

Every design decision must pass five tests:

| Test                 | Question                                                  | Pass criteria                                                            |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Continuity**       | Does this look like the same civilization at every scale? | Shared void-black base, signal-cyan accent language, glass HUD aesthetic |
| **Information**      | Does light, color, or motion communicate state?           | Nothing decorative without meaning; glow = activity                      |
| **Restraint**        | Is the view readable at a glance?                         | ≤ 3 accent colors per viewport; UI never occludes > 40% of canvas        |
| **Depth**            | Does the world feel layered, not flat?                    | Elevation, fog, bloom, and parallax create spatial hierarchy             |
| **District respect** | Does district identity stay within its boundary?          | District palettes inside districts; global UI uses signal tokens only    |

### The Three Layers

All visuals exist in one of three layers. Layers never break their rules:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 3 — UI OVERLAY (2D)                              │
│  Glass panels, typography, buttons, notifications        │
│  Always: space-dark glass, signal-cyan focus, Orbitron   │
├─────────────────────────────────────────────────────────┤
│  LAYER 2 — HOLOGRAPHIC (2.5D)                           │
│  Labels, tooltips, agent avatars, blueprint previews     │
│  Always: scan lines, gradient-hologram, partial alpha    │
├─────────────────────────────────────────────────────────┤
│  LAYER 1 — WORLD (3D)                                   │
│  Geometry, lighting, particles, buildings, districts     │
│  Always: dark base, neon accents, district palette       │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Colors

### 1.1 Foundation Palette

| Token            | Hex       | Role                                         |
| ---------------- | --------- | -------------------------------------------- |
| `void-black`     | `#020408` | Deep space, canvas void, darkest UI backdrop |
| `space-dark`     | `#0A0E1A` | Panel backgrounds, secondary surfaces        |
| `steel-blue`     | `#1A2332` | Borders, dividers, inactive chrome           |
| `fog-gray`       | `#2A3444` | Disabled states, muted chrome                |
| `text-primary`   | `#E8ECF4` | Primary readable text                        |
| `text-secondary` | `#8899AA` | Supporting text, metadata                    |
| `text-tertiary`  | `#556677` | Hints, timestamps, placeholders              |

### 1.2 Signal Palette (Global Accent)

Used in UI, cross-district navigation, and universal status indicators:

| Token           | Hex       | Meaning                                         |
| --------------- | --------- | ----------------------------------------------- |
| `signal-cyan`   | `#00E5FF` | Primary accent — active, selected, links, focus |
| `signal-green`  | `#06D6A0` | Success, online, healthy                        |
| `signal-amber`  | `#FFB300` | Warning, degraded, attention                    |
| `signal-red`    | `#E63946` | Error, critical, threat                         |
| `signal-purple` | `#8B5CF6` | AI activity, inference, special                 |

### 1.3 Gradient Tokens

| Token               | Values                | Usage                                        |
| ------------------- | --------------------- | -------------------------------------------- |
| `gradient-hologram` | `#00E5FF` → `#8B5CF6` | Holograms, agent avatars, blueprint previews |
| `gradient-neon`     | `#00E5FF` → `#06D6A0` | Edge glow, active neon strips                |
| `gradient-threat`   | `#FFB300` → `#E63946` | Defense alerts, critical banners             |
| `gradient-data`     | `#7B61FF` → `#00E5FF` | Data flow particles, stream visualization    |

### 1.4 Color Rules

1. **No pure white** — Maximum brightness: `#F0F0FF`
2. **Neon is accent, never fill** — Backgrounds stay in void/space range
3. **District colors stay in districts** — Global chrome uses signal palette only
4. **Status never color-only** — Pair with icon + label (accessibility)
5. **Maximum 3 accent colors per viewport** — Prevents visual noise at city scale

---

## 2. Spacing

Spacing follows an **8px base grid** with a 4px half-step for fine UI tuning. All layout, padding, and component gaps derive from this scale.

### 2.1 Spacing Scale

| Token       | Value | Usage                                    |
| ----------- | ----- | ---------------------------------------- |
| `space-0`   | 0     | Flush edges                              |
| `space-0.5` | 4px   | Icon-to-label gap, badge padding         |
| `space-1`   | 8px   | Compact inline spacing, chip padding     |
| `space-2`   | 16px  | Default component padding, list item gap |
| `space-3`   | 24px  | Section padding inside panels            |
| `space-4`   | 32px  | Panel outer padding, card padding        |
| `space-5`   | 40px  | Large section breaks                     |
| `space-6`   | 48px  | Top bar height, major layout unit        |
| `space-8`   | 64px  | Bottom HUD height, hero spacing          |
| `space-10`  | 80px  | Cinematic safe zones                     |
| `space-12`  | 96px  | Scale title margins                      |

### 2.2 Layout Constants

| Element        | Dimension        | Notes                                     |
| -------------- | ---------------- | ----------------------------------------- |
| Top bar        | 48px (`space-6`) | Always visible                            |
| Bottom HUD     | 64px (`space-8`) | Always visible                            |
| Left sidebar   | 280px            | Collapsed by default                      |
| Right sidebar  | 320px            | Context panel on selection                |
| Dialogue panel | 400px × auto     | Desktop floating; mobile full-width sheet |
| Mini-map (v1)  | 200px × 200px    | Bottom-right inset, `space-4` from edges  |
| Canvas minimum | ≥ 70% viewport   | At 1366×768 with one sidebar open         |

### 2.3 Spacing Rules

1. **Outer margins from viewport edge**: minimum `space-4` (32px) on desktop
2. **Nested padding decreases**: panel `space-4` → section `space-3` → item `space-2`
3. **Touch targets**: minimum 44×44px on mobile (use `space-6` padding if needed)
4. **3D label offset**: 8px (`space-1`) above entity anchor point
5. **District transition blend zone**: 200m in world space (not UI pixels)

### 2.4 Tailwind Mapping

```javascript
spacing: {
  0.5: '4px',
  1: '8px',
  2: '16px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  8: '64px',
  10: '80px',
  12: '96px',
}
```

---

## 3. Typography

### 3.1 Font Families

| Role    | Font               | Usage                                                    |
| ------- | ------------------ | -------------------------------------------------------- |
| Display | **Orbitron**       | Scale titles, district names, HUD headers, 3D nameplates |
| Body    | **Inter**          | Dialogue, sidebar content, descriptions                  |
| Mono    | **JetBrains Mono** | Metrics, IDs, coordinates, tool output                   |

Maximum **3 font families**. No italic at MVP. Minimum size **10px**.

### 3.2 Type Scale

| Token        | Size | Weight | Font           | Usage                        |
| ------------ | ---- | ------ | -------------- | ---------------------------- |
| `display-xl` | 48px | 700    | Orbitron       | Galaxy / Solar System titles |
| `display-lg` | 36px | 700    | Orbitron       | Scale level titles           |
| `display-md` | 24px | 600    | Orbitron       | District / building names    |
| `heading-lg` | 20px | 600    | Inter          | Panel headings               |
| `heading-md` | 16px | 600    | Inter          | Section headings             |
| `heading-sm` | 14px | 600    | Inter          | Card titles                  |
| `body-lg`    | 16px | 400    | Inter          | Agent dialogue               |
| `body-md`    | 14px | 400    | Inter          | Sidebar body                 |
| `body-sm`    | 12px | 400    | Inter          | Captions, timestamps         |
| `mono-lg`    | 14px | 400    | JetBrains Mono | HUD metrics                  |
| `mono-sm`    | 12px | 400    | JetBrains Mono | Coordinates, debug           |

### 3.3 Typography Patterns

| Context               | Spec                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| HUD panel header      | Orbitron 600, `display-md`, uppercase, `letter-spacing: 0.05em`, `text-primary` |
| Metric value          | JetBrains Mono 400, `mono-lg`, `signal-cyan`, `tabular-nums`                    |
| Agent dialogue        | Inter 400, `body-lg`, max-width 65ch, line-height 1.6                           |
| Breadcrumb            | Inter 400, `body-sm`, `text-secondary`; active segment `signal-cyan`            |
| 3D building nameplate | Orbitron 14px, uppercase, cyan glow shadow                                      |
| Threat indicator      | JetBrains Mono 10px, `signal-red`                                               |

### 3.4 3D Label Rules

1. HTML overlays via `@react-three/drei` `Html` — not TextGeometry
2. Billboard toward camera
3. Fade with distance: opacity 1.0 at LOD 0 → 0 at LOD 3+
4. Maximum 50 visible labels; selected entity always visible

---

## 4. Elevation

Elevation defines **depth hierarchy** across UI layers and 3D post-processing. The universe reads as stacked glass over a dark luminous world.

### 4.1 UI Elevation Scale

| Level | Token         | Shadow / Effect                               | Usage                         |
| ----- | ------------- | --------------------------------------------- | ----------------------------- |
| 0     | `elevation-0` | None                                          | Canvas, inline text           |
| 1     | `elevation-1` | `0 1px 2px rgba(0,0,0,0.4)`                   | Subtle inset fields           |
| 2     | `elevation-2` | `0 4px 12px rgba(0,0,0,0.5)`                  | Cards, tooltips               |
| 3     | `elevation-3` | `0 8px 24px rgba(0,0,0,0.6)`                  | Panels, sidebars              |
| 4     | `elevation-4` | `0 16px 48px rgba(0,0,0,0.7)`                 | Dialogue panel, notifications |
| 5     | `elevation-5` | `0 24px 64px rgba(0,0,0,0.8)` + cyan rim glow | Modals (v1+), command palette |

### 4.2 Glass Surface Recipe

All floating UI uses the same glass material:

```
background: space-dark @ 80% opacity
backdrop-filter: blur(12px)
border: 1px solid steel-blue @ 50% opacity
border-radius: 8px (panels) | 6px (cards) | 4px (buttons)
box-shadow: elevation-N (see table)
```

On `:focus-within` or `.selected`: add `0 0 0 1px signal-cyan @ 40%` outer ring.

### 4.3 3D Depth Cues

| Cue            | Implementation                 | Purpose                                         |
| -------------- | ------------------------------ | ----------------------------------------------- |
| Volumetric fog | `FogExp2`, density 0.002–0.005 | Atmospheric depth at city scale                 |
| Bloom          | threshold 0.8, strength 0.6    | Neon reads as emissive, not flat                |
| Vignette       | offset 0.3, darkness 0.5       | Cinematic focus on center action                |
| Film grain     | intensity 0.05                 | Subtle texture; unifies render + UI screenshots |
| Parallax HUD   | UI fixed; world moves          | Reinforces "looking through a visor"            |
| Z-order        | World < Hologram labels < UI   | Never interleave incorrectly                    |

### 4.4 Elevation Rules

1. **Higher elevation = more blur + darker shadow** — Never float without shadow
2. **Only one elevation-5 surface at a time** — Prevents competing focal points
3. **Selected entity gets elevation-2 cyan rim in 3D** — UI selection mirrors world selection
4. **No drop shadows on 3D geometry** — Depth via lighting and fog only

---

## 5. Motion

Motion is **informational physics** — the universe breathes, but never distracts.

### 5.1 Timing Tokens

| Token       | Duration    | Easing                         | Usage                           |
| ----------- | ----------- | ------------------------------ | ------------------------------- |
| `instant`   | 100ms       | `ease-out`                     | Button press, toggle            |
| `fast`      | 200ms       | `ease-out`                     | Tooltip appear, toast dismiss   |
| `normal`    | 300ms       | `ease-in-out`                  | Panel slide, selection pulse    |
| `slow`      | 500ms       | `ease-in-out`                  | Floor change, metric count-up   |
| `cinematic` | 1500–2500ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Scale transitions               |
| `ambient`   | 3000ms+     | `linear` loop                  | Particles, glows, ring rotation |

### 5.2 UI Motion Patterns

| Interaction     | Animation                                 |
| --------------- | ----------------------------------------- |
| Button hover    | Border glow intensifies, 200ms            |
| Panel enter     | `translateX(16px)` → `0` + fade in, 300ms |
| Panel exit      | fade out, 200ms                           |
| Selection       | Single cyan border pulse, 500ms           |
| Metric update   | Count-up interpolation, 500ms             |
| Dialogue stream | Token fade-in, 50ms per token             |
| Loading         | Cyan spinner, continuous                  |

### 5.3 World Motion Patterns

| Element              | Animation                                   |
| -------------------- | ------------------------------------------- |
| Star twinkle         | Shader brightness oscillation               |
| Building window glow | Pulse mapped to utilization                 |
| Neon edge strips     | Slow color cycle through district secondary |
| Data flow particles  | Spline path following                       |
| Agent status orb     | Orbit speed by status                       |
| Hologram scan lines  | UV scroll on Y axis                         |
| Orbital ring         | Slow Y-axis rotation                        |

### 5.4 Agent Status Motion

| Status   | Body                  | Particles                   |
| -------- | --------------------- | --------------------------- |
| Idle     | Hover bob ±0.05m      | Slow orbit                  |
| Thinking | Head tilt, pulse glow | Spiral rise                 |
| Acting   | Lean toward target    | Directional streak          |
| Learning | Cross-legged float    | Upward leaf/spore particles |
| Error    | Flicker + shake       | Chaotic scatter             |
| Offline  | Static                | None                        |

### 5.5 Motion Rules

1. **`prefers-reduced-motion`**: disable all non-essential animation; instant transitions only
2. **Skip available after 500ms** on cinematic sequences
3. **GPU-first**: shaders and transforms, not layout-triggering properties
4. **No animation blocks interaction** beyond 500ms without skip affordance
5. **Particle budgets enforced per scale** — see §7 Particles

---

## 6. Lighting

Light is **data**, not decoration. The world is dark; luminous elements tell you what is alive.

### 6.1 Global Principles

1. Dark world, bright accents
2. No pure white light — max ~6000K
3. Shadows only at LOD 0–1
4. Maximum 8 dynamic lights per scene
5. Volumetric fog off on mobile

### 6.2 Scale-Level Lighting Summary

| Scale           | Key light                                | Mood                 |
| --------------- | ---------------------------------------- | -------------------- |
| Galaxy          | Star point lights, nebula ambient        | Infinite, cold       |
| Earth           | Directional sun `#FFF5E0`                | Planetary, warm limb |
| Megacity aerial | Moon directional + city hemisphere       | Neon underbelly      |
| District        | District profile (see §9)                | Identity-specific    |
| Interior        | RectArea ceiling + terminal point lights | Functional, intimate |
| Agent view      | District-colored hologram point light    | Focused portrait     |

### 6.3 Dynamic Lighting Response

| Simulation event     | Light response                 |
| -------------------- | ------------------------------ |
| Utilization increase | Window glow brightens          |
| Agent thinking       | Point light pulse at avatar    |
| Defense alert        | Ring segment red flash         |
| Policy change        | District key light hue shift   |
| Construction         | Blueprint hologram glow        |
| Offline              | All lights fade to 10% over 2s |

Full per-district profiles: [`lighting.md`](lighting.md).

---

## 7. Particles

Particles visualize **flows, weather, and agent state** — never ambient confetti.

### 7.1 Particle Budget (Hard Limits)

| Scale      | Max particles | Primary types                  |
| ---------- | ------------- | ------------------------------ |
| Galaxy     | 0             | —                              |
| Earth      | 200           | Atmosphere entry streaks       |
| Megacity   | 5,000         | City haze, distant traffic     |
| District   | 2,000         | Weather, data streams          |
| Interior   | 500           | Terminal sparks, hologram dust |
| Agent view | 200           | Status aura                    |

If frame time exceeds 20ms, reduce particle count by 25% automatically.

### 7.2 Particle Catalog

| System             | District / Scale    | Visual                            | Color                 |
| ------------------ | ------------------- | --------------------------------- | --------------------- |
| Static rain        | Perception          | Vertical fall, splash on ground   | `#7B61FF` tint        |
| Golden dust        | Memory              | Slow float, warm motes            | `#D4A853`             |
| Data waterfall     | Perception          | Downward stream into intake pools | `gradient-data`       |
| Industrial haze    | Action              | Horizontal drift, low opacity     | `#FF6B35` @ 20%       |
| Organic spores     | Self Improvement    | Upward drift, bioluminescent      | `#10B981` / `#A855F7` |
| Spark forge        | Action              | Burst at machinery contact points | `#FFBE0B`             |
| Blueprint scaffold | Any (construction)  | Upward spiral around building pad | `gradient-hologram`   |
| Memory dissolve    | Memory (forgetting) | Noise-based scatter + fade        | `#4A90D9`             |
| Agent aura         | Agent view          | Orbit / spiral per status         | District primary      |
| Defense alert      | Orbital ring        | Radial pulse along ring segment   | `gradient-threat`     |

### 7.3 Particle Rules

1. **Instanced rendering** — `THREE.InstancedMesh` or GPU particles; no individual meshes
2. **Weather off on mobile** — Rain, spores, haze disabled
3. **Particles respect district boundary** — 200m blend at edges
4. **No particles behind UI** — UI layer always occludes; particles are world-only
5. **Color from palette only** — No one-off particle colors

---

## 8. Building Styles

Buildings are **service containers** — their silhouette, skin, and glow communicate function and health.

### 8.1 Universal Building Anatomy

```
┌──────────────────────────────┐
│  Roof signature element      │  ← Type-specific (dish, ring, dome, crane)
├──────────────────────────────┤
│  ░░ Window band (utilization)│  ← WindowGlowShader
│  ░░                          │
│  ▓▓ Edge neon strip          │  ← District secondary color
│  ▓▓                          │
│  ■ Base / foundation         │  ← District base material
├──────────────────────────────┤
│  ◈ Entrance portal           │  ← signal-cyan glow, interior transition
│  ▪ Holographic nameplate     │  ← Visible on hover / select
└──────────────────────────────┘
```

### 8.2 Building States

| State          | Visual treatment                                     |
| -------------- | ---------------------------------------------------- |
| `planned`      | Holographic blueprint outline only; scan-line shader |
| `constructing` | Partial mesh + scaffold particles; HUD progress bar  |
| `active`       | Full render; window glow proportional to utilization |
| `degraded`     | Flickering lights, damage decals, amber edge pulse   |
| `offline`      | Desaturated, no glow, fog-gray window tint           |
| `demolished`   | Absent; foundation pad with faint footprint outline  |

### 8.3 Building Type Silhouettes

Each type must be **recognizable in grayscale** at aerial LOD:

| Type       | Silhouette signature                    | Example buildings                    |
| ---------- | --------------------------------------- | ------------------------------------ |
| Tower      | Vertical extrusion, narrow footprint    | Classification Tower, Planning Tower |
| Hub        | Low wide footprint, central dome        | Ingestion Hub, Vector Vault          |
| Dome       | Hemispherical crown                     | Simulation Dome, Training Crucible   |
| Industrial | Horizontal sprawl, crane/roof machinery | Tool Forge, Deployment Pad           |
| Pavilion   | Open structure, minimal walls           | Cache Pavilion, Stream Plaza         |
| Gate       | Arch or portal frame                    | Filter Gate, Promotion Gate          |

### 8.4 District Skin Application

Same building **type** uses identical floor plan logic; **skin** comes from district theme:

| Property        | Source                                                       |
| --------------- | ------------------------------------------------------------ |
| Base material   | District theme JSON                                          |
| Edge neon color | District secondary                                           |
| Window pattern  | District aesthetic (slit / arch / porthole / greenhouse)     |
| Roof element    | District signature (antenna / vault / ring / crane / garden) |
| Damage variant  | District-specific decay texture                              |

Full procgen parameters: [`district-themes.md`](district-themes.md).

### 8.5 LOD Representation

| Distance            | Representation                            |
| ------------------- | ----------------------------------------- |
| > 2 km              | Colored extruded footprint + height block |
| 500m – 2 km         | Simplified mesh, no windows               |
| 100m – 500m         | Window glow bands, no interior            |
| < 100m              | Full exterior, nameplate, entrance portal |
| Interior transition | Full room geometry                        |

### 8.6 Building Rules

1. **Silhouette before detail** — Readable at megacity flyover
2. **Activity = window glow** — Utilization drives brightness, not arbitrary animation
3. **One entrance portal per building** — Always `signal-cyan`
4. **Nameplate on hover and select** — Orbitron uppercase
5. **Maximum 5 material variants per district** — Performance budget

---

## 9. District Styles

Five districts map to the **AI cognition loop**. Each is a biome within one city.

### 9.1 Theme Matrix

| Property     | Perception         | Memory              | Reasoning            | Action                | Self Improvement           |
| ------------ | ------------------ | ------------------- | -------------------- | --------------------- | -------------------------- |
| Primary      | `#7B61FF`          | `#D4A853`           | `#4B3F9E`            | `#FF6B35`             | `#10B981`                  |
| Secondary    | `#00E5FF`          | `#4A90D9`           | `#C0C8D8`            | `#E63946`             | `#A855F7`                  |
| Accent       | `#39FF14`          | `#F0F0FF`           | `#FFD700`            | `#06D6A0`             | `#84CC16`                  |
| Background   | `#0A0A12`          | `#12101A`           | `#08081A`            | `#1A1410`             | `#0A1A12`                  |
| Mood         | Alert, electric    | Contemplative, deep | Precise, intense     | Kinetic, urgent       | Patient, alive             |
| Architecture | Sprawling + spires | Vertical towers     | Monumental cathedral | Horizontal industrial | Organic curves             |
| Weather      | Static rain        | Golden dust         | Clear                | Industrial haze       | Organic spores             |
| Ground       | Wet asphalt        | Polished dark stone | White marble inlay   | Metal grating         | Living moss + fiber optics |
| Sky          | Overcast violet    | Warm amber haze     | Clear, cold          | Particulate orange    | Green-tinted spores        |

### 9.2 Signature Elements (One per District)

| District         | Signature                                             | Purpose                           |
| ---------------- | ----------------------------------------------------- | --------------------------------- |
| Perception       | Holographic data waterfalls → intake pools            | "Input entering the system"       |
| Memory           | Light bridges between towers; archive stacks in glass | "Knowledge connected across time" |
| Reasoning        | Rotating inference rings on tower peaks               | "Computation in motion"           |
| Action           | Moving conveyor links between buildings               | "Output being delivered"          |
| Self Improvement | Neural garden terraces; bioluminescent plants         | "Growth and mutation"             |

### 9.3 Cross-District Rules

1. **200m palette blend** at boundaries — no hard color cuts
2. **Transit stations neutral** — steel-blue + signal-cyan only
3. **No logos or text branding** — identity through environment
4. **Audio crossfade 2s** on district entry
5. **Grayscale silhouette test** — each district identifiable without color

---

## 10. Camera Behaviour

The camera is the user's **body in the universe** — movement must feel physically grounded at every scale.

### 10.1 Camera Presets

| Scale        | FOV          | Control mode           |
| ------------ | ------------ | ---------------------- |
| Galaxy       | 60°          | Pan + logarithmic zoom |
| Solar System | 60°          | Orbital rotation       |
| Earth        | 50°          | Globe rotation + zoom  |
| Orbital Ring | 55°          | Path-constrained orbit |
| Megacity     | 65°          | Free flight            |
| District     | 65°          | Hover / walk           |
| Building     | 60°          | Orbit exterior         |
| Room         | 70°          | Walk / first-person    |
| Agent        | 45°          | Fixed focus portrait   |
| Memory       | Orthographic | Graph pan + zoom       |

### 10.2 Desktop Controls

| Input            | City / District | Interior   |
| ---------------- | --------------- | ---------- |
| Mouse drag       | Rotate          | Look       |
| Scroll           | Forward / back  | —          |
| WASD             | Fly             | Walk       |
| Q / E            | Down / Up       | —          |
| Right-click drag | Pan             | —          |
| Middle-click     | Reset view      | Reset view |

Speed scales with altitude: `speed = baseSpeed × (altitude / reference)^0.5`

### 10.3 Special Modes

| Mode            | Behaviour                                              |
| --------------- | ------------------------------------------------------ |
| Follow agent    | 3m behind, 1.5m above; smooth lerp 0.05                |
| Orbit selection | Fixed-radius orbit; scroll adjusts radius              |
| Cinematic       | Scripted Bezier path; input disabled; skip after 500ms |

### 10.4 Constraints

1. **No camera roll** — Horizon level except cinematic
2. **FOV range**: 30° – 80°
3. **Minimum altitude**: 50m above ground in city
4. **No camera below ground plane**
5. **State persisted** in navigation store for back navigation

Mobile: no free flight; tap-to-navigate via sidebar hierarchy. Full spec: [`camera.md`](camera.md).

---

## 11. Transitions

Scale transitions are the **signature experience** — a continuous flight through orders of magnitude.

### 11.1 Transition Timeline (2.5s reference)

```
0ms      200ms     500ms              1800ms    2200ms   2500ms
│─────────│─────────│──────────────────│─────────│────────│
│ Freeze  │ Highlight│ Camera Bezier   │ Fade in │ Settle │
│ input   │ entity   │ + LOD crossfade │ scene   │ controls│
│         │          │ + preload dest  │         │        │
```

### 11.2 Easing by Transition Type

| Transition            | Easing         | Feel                         |
| --------------------- | -------------- | ---------------------------- |
| Galaxy → Solar System | Spiral ease-in | Accelerating descent         |
| Earth → Megacity      | Ease-in-out    | Atmospheric entry            |
| District → Building   | Ease-out       | Approaching target           |
| Room → Agent          | Ease-out-back  | Slight overshoot, focus lock |
| Ascend (any)          | Ease-in        | Pulling away, widening       |

### 11.3 Transition UI

During cinematic transition:

- **Skip button**: bottom-center, appears at 500ms, `elevation-3` glass pill
- **Progress indicator**: thin cyan line at bottom HUD top edge (optional v1)
- **Audio**: crossfade ambient district/city audio with camera position
- **Interaction**: frozen until arrival + 300ms settle

### 11.4 MVP vs v1

| Phase | Transition style                                                          |
| ----- | ------------------------------------------------------------------------- |
| MVP   | Instant cut for sidebar tree navigation; cinematic for double-click enter |
| v1    | Animated Bezier for all cross-scale navigation                            |
| v2    | Full 10-level stack with queued transition pipeline                       |

---

## 12. Holograms

Holograms are the **visual bridge** between solid world and information — agents, blueprints, previews, and data.

### 12.1 Hologram Material Recipe

All holograms share one shader family with parameter variants:

| Parameter            | Default                                 | Range                  |
| -------------------- | --------------------------------------- | ---------------------- |
| Base color           | District primary or `gradient-hologram` | —                      |
| Opacity              | 0.35                                    | 0.15 – 0.85            |
| Scan line frequency  | 200                                     | UV Y axis              |
| Scan line speed      | 3.0                                     | Multiplier on `uTime`  |
| Fresnel power        | 3.0                                     | Edge brightening       |
| Chromatic aberration | 0.002                                   | Agent view only        |
| Flicker              | 0                                       | 0 – 0.3 on error state |

```glsl
// Core hologram fragment (conceptual)
float scanLine = sin(vUv.y * 200.0 + uTime * 3.0) * 0.5 + 0.5;
float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
float alpha = uOpacity * (0.3 + scanLine * 0.2 + fresnel * 0.5);
```

### 12.2 Hologram Types

| Type          | Usage                           | Distinctive trait                                   |
| ------------- | ------------------------------- | --------------------------------------------------- |
| Agent avatar  | Room presence, agent view       | Full humanoid mesh, district tint, status particles |
| Blueprint     | Planned / constructing building | Wireframe extrusion, scaffold particles             |
| Nameplate     | Building / district labels      | Flat panel, Orbitron text, no scan lines            |
| Data panel    | Terminal readouts in world      | Mono text, horizontal scan only                     |
| Memory thread | Citation links in dialogue      | Thin cyan filament, clickable                       |
| Preview ghost | Hover before navigation         | 50% opacity silhouette of destination               |

### 12.3 Hologram Rules

1. **Never fully opaque** — Maximum 85% alpha; world always visible through
2. **Scan lines move upward** — Consistent direction = "data rising"
3. **Agent holograms use district primary** — Not signal-cyan (reserved for UI)
4. **Blueprint holograms use gradient-hologram** — Cyan → purple
5. **Post-processing**: bloom applies; SSR does not

---

## 13. Icons

Icons are **monoline HUD glyphs** — precise, geometric, readable at 16px.

### 13.1 Icon System

| Property     | Value                                                                      |
| ------------ | -------------------------------------------------------------------------- |
| Library      | Lucide React (stroke-based)                                                |
| Stroke width | 1.5px at 24px; scale proportionally                                        |
| Corner style | Rounded caps and joins                                                     |
| Grid         | 24×24px base; 16px and 20px variants                                       |
| Color        | `text-secondary` default; `signal-cyan` active; semantic colors for status |

### 13.2 Core Icon Set

| Icon        | Lucide name           | Usage                 |
| ----------- | --------------------- | --------------------- |
| Navigate up | `ChevronUp`           | Ascend scale          |
| Enter       | `LogIn`               | Enter building / room |
| Talk        | `MessageCircle`       | Open dialogue         |
| Memory      | `Brain`               | View agent memory     |
| Search      | `Search`              | Global search (v1)    |
| Settings    | `Settings`            | Settings panel        |
| Agent       | `User`                | Agent entity          |
| Building    | `Building2`           | Building entity       |
| District    | `Map`                 | District entity       |
| Online      | `Circle` filled green | Status dot            |
| Thinking    | `Loader2` animated    | Processing            |
| Warning     | `AlertTriangle`       | Degraded              |
| Critical    | `AlertOctagon`        | Error / threat        |
| Follow      | `Eye`                 | Follow agent camera   |
| Skip        | `SkipForward`         | Skip cinematic        |

### 13.3 Icon Rules

1. **Always pair with label** in primary actions — icon alone only in compact HUD
2. **Animated icons**: only `Loader2` spin and status pulse — no decorative animation
3. **District icons use neutral color** — Never district primary in global chrome
4. **Touch target**: icon button minimum 44×44px with transparent padding
5. **No filled icons except status dots** — Maintains HUD consistency

---

## 14. Buttons

Buttons are **command triggers** — tactile glass controls with neon feedback.

### 14.1 Button Variants

| Variant   | Background          | Border        | Text             | Usage                           |
| --------- | ------------------- | ------------- | ---------------- | ------------------------------- |
| Primary   | `signal-cyan` @ 15% | `signal-cyan` | `signal-cyan`    | Main action (Enter, Talk, Send) |
| Secondary | transparent         | `steel-blue`  | `text-primary`   | Cancel, Back                    |
| Ghost     | transparent         | transparent   | `text-secondary` | Tertiary, icon-only             |
| Danger    | `signal-red` @ 15%  | `signal-red`  | `signal-red`     | Destructive (v2 governance)     |
| Disabled  | `fog-gray` @ 10%    | `fog-gray`    | `text-tertiary`  | Unavailable                     |

### 14.2 Button Sizes

| Size | Height | Padding X | Font      | Usage                 |
| ---- | ------ | --------- | --------- | --------------------- |
| `sm` | 32px   | 12px      | `body-sm` | Inline actions, cards |
| `md` | 40px   | 16px      | `body-md` | Default               |
| `lg` | 48px   | 24px      | `body-lg` | Primary CTAs, mobile  |

### 14.3 Button States

| State          | Visual                                       |
| -------------- | -------------------------------------------- |
| Default        | Variant colors as above                      |
| Hover          | Border glow + 10% background brighten, 200ms |
| Active / Press | Scale 0.98, `instant` timing                 |
| Focus          | 2px `signal-cyan` outline offset 2px         |
| Loading        | Spinner replaces label; width preserved      |
| Disabled       | No hover; cursor not-allowed                 |

### 14.4 Button Rules

1. **One primary button per panel** — Never two cyan primaries in same view
2. **Verb labels** — "Enter Tower", "Talk to Agent", not "OK"
3. **Icon + label on primary** — Icon left, 8px gap
4. **Send in dialogue**: primary, right-aligned; disabled while agent thinking
5. **No pill shapes** — `border-radius: 4px` (slightly angular, not rounded-full)

---

## 15. Panels

Panels are the **glass HUD chrome** — contextual, minimal, subservient to the 3D canvas.

### 15.1 Panel Inventory

| Panel             | Size           | Default   | Trigger           |
| ----------------- | -------------- | --------- | ----------------- |
| Top bar           | full × 48px    | Visible   | —                 |
| Left sidebar      | 280px          | Collapsed | `Tab` / hamburger |
| Right sidebar     | 320px          | Hidden    | Entity select     |
| Bottom HUD        | full × 64px    | Visible   | —                 |
| Dialogue          | 400px float    | Hidden    | Agent interact    |
| Shortcuts overlay | centered 480px | Hidden    | `?` key           |

### 15.2 Panel Anatomy

```
┌─────────────────────────────────────────┐
│  HEADER (space-6 height)                │
│  Orbitron title          [actions] [×]  │
├─────────────────────────────────────────┤
│  BODY (space-4 padding)                 │
│  scrollable content                     │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER (optional, space-4 padding)     │
│  [Secondary]              [Primary]     │
└─────────────────────────────────────────┘
```

### 15.3 Panel Behaviours

| Behaviour        | Rule                                        |
| ---------------- | ------------------------------------------- |
| Enter            | Slide from edge + fade, 300ms               |
| Exit             | Fade out, 200ms                             |
| Auto-hide        | Left sidebar collapses after 10s inactivity |
| Stacking         | Maximum 2 panels + dialogue simultaneously  |
| Canvas occlusion | Combined panels ≤ 40% viewport              |
| Mobile           | Sidebars become bottom sheets (< 768px)     |

### 15.4 GlassPanel Component Contract

```tsx
// Conceptual API
<GlassPanel
  elevation={3}
  header="PLANNING TOWER"
  onClose={handleClose}
  footer={<Button variant="primary">Enter</Button>}
>
  {children}
</GlassPanel>
```

Base classes: `bg-space-dark/80 backdrop-blur-md border border-steel-blue/50 rounded-lg`

---

## 16. Cards

Cards are **atomic information containers** inside panels — entity summaries, metrics, tool calls.

### 16.1 Card Variants

| Variant         | Usage              | Distinctive trait                |
| --------------- | ------------------ | -------------------------------- |
| Entity          | Sidebar header     | Display font title + StatusBadge |
| Metric          | HUD grid           | Mono value + label below         |
| Tool call       | Dialogue inline    | Amber left border, mono content  |
| Action          | Quick actions row  | Icon + label, ghost button style |
| Memory citation | Dialogue reference | Cyan left thread, clickable      |

### 16.2 Card Anatomy

```
┌─────────────────────────────────────┐
│  TITLE (heading-sm)     [badge]     │
│  Subtitle (body-sm, secondary)      │
├─────────────────────────────────────┤
│  Content (body-md)                  │
│  Metric: 847 agents (mono-lg cyan)  │
└─────────────────────────────────────┘
```

### 16.3 Card Spec

| Property          | Value                                            |
| ----------------- | ------------------------------------------------ |
| Background        | `space-dark` @ 60% (one step lighter than panel) |
| Border            | `steel-blue` @ 30%                               |
| Border radius     | 6px                                              |
| Padding           | `space-3` (24px)                                 |
| Elevation         | `elevation-2`                                    |
| Hover (clickable) | Border → `signal-cyan` @ 50%, 200ms              |

### 16.4 Card Rules

1. **One primary metric per metric card** — No compound numbers
2. **Tool call cards always show status icon** — ✓ complete, ⟳ running, ✗ failed
3. **Entity card always includes district context** — "Reasoning District · Planning Tower"
4. **No nested cards deeper than 2 levels**
5. **Selected card**: cyan left border 2px, not full background change

---

## 17. Tooltips

Tooltips are **minimal holographic hints** — brief, non-blocking, never essential information.

### 17.1 Tooltip Spec

| Property      | Value                               |
| ------------- | ----------------------------------- |
| Background    | `void-black` @ 95%                  |
| Border        | `steel-blue` @ 50%                  |
| Text          | `body-sm`, `text-primary`           |
| Max width     | 240px                               |
| Padding       | `space-1` × `space-2` (8px × 16px)  |
| Border radius | 4px                                 |
| Elevation     | `elevation-2`                       |
| Arrow         | 6px cyan-tinted caret toward anchor |
| Delay         | 400ms show; 100ms hide              |
| Animation     | Fade, `fast` (200ms)                |

### 17.2 Tooltip Content Rules

1. **Maximum 2 lines** — If more needed, use a popover (v1)
2. **Sentence case** — Not uppercase (reserved for headers)
3. **Never duplicate visible label** — Add context only ("Search available in v1")
4. **Keyboard accessible** — Show on focus, not hover-only
5. **No tooltips on 3D entities** — Use right sidebar preview instead

### 17.3 3D Hover Preview (Not Tooltip)

Hovering a 3D entity shows **right sidebar preview** (name + status), not a floating tooltip — keeps the visor aesthetic clean.

---

## 18. Notifications

Notifications are **system broadcasts from the civilization** — alerts, confirmations, and simulation events.

### 18.1 Notification Variants

| Variant  | Color           | Icon            | Usage                             |
| -------- | --------------- | --------------- | --------------------------------- |
| Info     | `signal-cyan`   | `Info`          | Neutral system message            |
| Success  | `signal-green`  | `CheckCircle`   | Action completed                  |
| Warning  | `signal-amber`  | `AlertTriangle` | Degraded state                    |
| Critical | `signal-red`    | `AlertOctagon`  | Defense alert, error              |
| AI event | `signal-purple` | `Sparkles`      | Inference complete, agent spawned |

### 18.2 Toast Layout

```
┌────────────────────────────────────────────┐
│ [icon]  Title (heading-sm)                 │
│         Description (body-sm, secondary)   │
│                              [Action] [×] │
└────────────────────────────────────────────┘
```

| Property  | Value                                                |
| --------- | ---------------------------------------------------- |
| Position  | Top-right, `space-4` from edges                      |
| Width     | 360px max                                            |
| Stack     | Up to 3 visible; oldest dismissed first              |
| Duration  | Info 5s; Success 4s; Warning 8s; Critical persistent |
| Enter     | Slide from right + fade, 300ms                       |
| Exit      | Fade out, 200ms                                      |
| Elevation | `elevation-4`                                        |

### 18.3 In-World Notifications (v1+)

Critical defense alerts also trigger **world events**:

- Orbital ring segment flash (`gradient-threat`)
- Bottom HUD banner strip (full width, amber/red)
- Optional audio ping (single tone, not repeating)

### 18.4 Notification Rules

1. **Public visibility warning** — First agent dialogue uses info toast, persistent until dismissed
2. **No notification hides canvas center** — Top-right or bottom banner only
3. **Critical requires explicit dismiss** — No auto-hide
4. **Maximum 1 critical at a time** — Queue others
5. **`prefers-reduced-motion`**: fade only, no slide

---

## 19. Theme Rules

These rules **bind the universe together**. Violating any rule breaks cohesion.

### 19.1 Absolute Constraints (MVP)

| #   | Rule                                                                                   |
| --- | -------------------------------------------------------------------------------------- |
| 1   | **Dark mode only** — No light theme                                                    |
| 2   | **World-first** — 3D canvas ≥ 70% viewport                                             |
| 3   | **Glass everywhere in UI** — No opaque solid panels                                    |
| 4   | **Signal-cyan is the only global interactive accent**                                  |
| 5   | **District colors never appear in global chrome**                                      |
| 6   | **No modal dialogs** — Panels and bottom sheets only                                   |
| 7   | **No pure white** — In color or light                                                  |
| 8   | **Typography trinity** — Orbitron, Inter, JetBrains Mono only                          |
| 9   | **8px spacing grid** — No arbitrary pixel values                                       |
| 10  | **Cohesion test** — Screenshot any two views side-by-side; must look like same product |

### 19.2 Scale-Appropriate Theming

| Scale           | Dominant visual                       | UI density                       |
| --------------- | ------------------------------------- | -------------------------------- |
| Galaxy / Solar  | Void black, star points, minimal UI   | Low — breadcrumbs + metrics only |
| Earth / Ring    | Planetary blues, defense amber alerts | Low                              |
| Megacity        | Multi-district glow, fog              | Medium — mini-map (v1)           |
| District        | Single district palette               | Medium                           |
| Building / Room | Interior lighting, terminals          | High — sidebars active           |
| Agent / Memory  | Hologram + graph                      | High — dialogue primary          |

### 19.3 Responsive Theming

| Breakpoint  | Adaptation                                           |
| ----------- | ---------------------------------------------------- |
| ≥ 1440px    | Full layout                                          |
| 1024–1439px | Right sidebar only                                   |
| 768–1023px  | Bottom drawer replaces sidebars                      |
| < 768px     | Full-screen 3D; bottom sheets; no free-flight camera |

### 19.4 Accessibility Theme Rules

| Requirement     | Implementation                                            |
| --------------- | --------------------------------------------------------- |
| Contrast        | WCAG AA minimum on all text pairs                         |
| Motion          | `prefers-reduced-motion` disables non-essential animation |
| Focus           | 2px cyan outline on all interactive elements              |
| Color blindness | Icon + text for all status; never color alone             |
| Keyboard        | All UI operable without mouse                             |
| Screen reader   | ARIA labels; live regions for dialogue stream             |

### 19.5 Implementation Source of Truth

| Asset                   | Location (planned)                       |
| ----------------------- | ---------------------------------------- |
| Color constants         | `packages/shared/src/colors.ts`          |
| Spacing / motion tokens | `packages/shared/src/tokens.ts`          |
| District themes         | `packages/shared/src/district-themes.ts` |
| Tailwind config         | Extends from shared tokens               |
| Shaders                 | `packages/client/src/shaders/`           |
| UI components           | `packages/client/src/components/ui/`     |

### 19.6 Design QA Checklist

Before any feature ships, verify:

- [ ] Uses tokens from shared package — no hardcoded hex in components
- [ ] Passes cohesion test against megacity + dialogue screenshots
- [ ] Respects particle and LOD budgets for target scale
- [ ] UI occlusion ≤ 40% with all panels open
- [ ] `prefers-reduced-motion` tested
- [ ] Contrast checked on all new text/background pairs
- [ ] District palette contained within district views
- [ ] Holograms use shared shader — no one-off transparency

---

## Appendix A — Tailwind Token Export (Conceptual)

```javascript
// tailwind.config.ts — extends from @ultron/shared/tokens
module.exports = {
  theme: {
    extend: {
      colors: {/* see §1 */},
      spacing: {/* see §2 */},
      fontFamily: {/* see §3 */},
      fontSize: {/* see §3 */},
      boxShadow: {/* see §4 elevation scale */},
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
        cinematic: '2500ms',
      },
      borderRadius: {
        button: '4px',
        card: '6px',
        panel: '8px',
      },
    },
  },
};
```

---

## Appendix B — Related Documents

| Document                                                       | Relationship                               |
| -------------------------------------------------------------- | ------------------------------------------ |
| [`colors.md`](colors.md)                                       | Color token detail + Tailwind config       |
| [`typography.md`](typography.md)                               | Full type scale + 3D labels                |
| [`ui-principles.md`](ui-principles.md)                         | Layout philosophy + JARVIS dialogue        |
| [`animation.md`](animation.md)                                 | Motion timing + particle budgets           |
| [`lighting.md`](lighting.md)                                   | Per-scale and per-district lighting rigs   |
| [`camera.md`](camera.md)                                       | Full camera controls + collision           |
| [`district-themes.md`](district-themes.md)                     | Procgen + building skin detail             |
| [`../world-bible/buildings.md`](../world-bible/buildings.md)   | Building taxonomy + catalog                |
| [`../world-bible/districts.md`](../world-bible/districts.md)   | District narrative + cognition map         |
| [`../architecture/rendering.md`](../architecture/rendering.md) | Shader library + post-processing           |
| [`../PRD.md`](../PRD.md)                                       | Product vision + visual identity statement |

---

_This Design Bible is the authoritative visual contract for ULTRON AI WORLD. When in doubt, choose the option that makes the universe feel like one place._

_Last updated: 2026-06-14_
