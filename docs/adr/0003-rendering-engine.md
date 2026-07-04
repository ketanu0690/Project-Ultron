# ADR-0003: Rendering Engine

## Status

**Accepted** — 2026-06-14

## Context

ULTRON AI WORLD must render scenes spanning 10 orders of magnitude — from 50,000 galaxy stars to individual agent holograms — while maintaining 60 FPS on desktop and 30 FPS on mobile. We need to decide the rendering approach, LOD strategy, and post-processing pipeline.

## Decision

### Rendering Pipeline

- **Forward rendering** with post-processing (not deferred)
- **Single WebGL Canvas** via React Three Fiber
- **ACES Filmic tone mapping** with exposure 1.2
- **Post-processing**: Bloom + vignette (max 2 passes)

### LOD Strategy

- **Distance-based LOD** with 5 levels (0-4)
- **Instanced rendering** for stars, city blocks, particles
- **Scene branch swapping** (only active scale rendered)
- **Frustum culling** via R-tree spatial index at city scale

### Asset Pipeline

- **glTF 2.0** with Draco mesh compression
- **KTX2/Basis** texture compression
- **Shader library** for effects (hologram, atmosphere, neon, data flow)

### Performance Budgets

| Scale        | Draw Calls   | Triangles    | FPS Target |
| ------------ | ------------ | ------------ | ---------- |
| Galaxy       | < 10         | < 100K       | 60         |
| Megacity     | < 500        | < 2M         | 60         |
| District     | < 200        | < 500K       | 60         |
| Interior     | < 100        | < 200K       | 60         |
| Mobile (all) | Half desktop | Half desktop | 30         |

## Alternatives Considered

### A: Deferred Rendering

G-buffer for many lights.

**Rejected because**: Overkill for our light count (< 8 per scene). R3F post-processing ecosystem is forward-rendering oriented.

### B: Multiple Canvases (one per scale)

Separate WebGL contexts per scale level.

**Rejected because**: Prevents seamless transitions. Context switching is expensive. Memory multiplied by scale count.

### C: WebGPU Renderer

Next-generation graphics API.

**Rejected because**: R3F WebGPU support not yet stable. WebGL 2.0 sufficient for MVP. Revisit at v2.

### D: Photorealistic Rendering (PBR + IBL)

HDR environment maps, ray-traced reflections.

**Rejected because**: GPU budget incompatible with target hardware. Cyberpunk aesthetic favors stylized over realistic.

## Consequences

### Positive

- Forward rendering is well-supported in R3F ecosystem
- LOD system handles scale range effectively
- Instancing enables 50K stars and 200 buildings
- Shader library creates consistent visual language
- Performance budgets are measurable and enforceable

### Negative

- LOD pop-in without crossfade at distance thresholds
- glTF pipeline adds asset authoring dependency
- No ray tracing limits interior realism
- Single Canvas memory pressure with multiple preloaded scenes

### Mitigations

- LOD crossfade via opacity blend (adds 200ms transition)
- Procedural fallback for missing glTF assets
- Interior scenes use screen-space effects instead of ray tracing
- Preload only destination scene during transitions

## References

- `docs/architecture/rendering.md`
- `docs/architecture/scene-graph.md`
- `docs/design-system/lighting.md`
