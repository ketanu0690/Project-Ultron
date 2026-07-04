# Performance Budget

## Purpose

Hard limits for **bundle size, GPU work, and runtime memory** so 3D scenes stay shippable on reference hardware. Agents and engineers must check this document **before** adding geometry, shaders, or assets — and **profile against it** before marking a scene complete.

> Beautiful but unusable scenes are a failure mode. Budget first, polish second.

**Reference hardware**: mid-range desktop GPU (GTX 1660 / RX 580 equivalent), 1080p.  
**Design target**: 60 FPS P50. **Ship gate**: 30 FPS P50 minimum ([ADR-0014](../adr/0014-performance-targets.md)).

---

## Global Budgets

| Metric                     | Limit              | Notes                                                                              |
| -------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| **Initial JS bundle**      | **< 500 KB** gzip  | First paint route only — Megacity shell + Canvas bootstrap; scenes are lazy-loaded |
| **Per-scene chunk**        | < 300 KB gzip each | One chunk per scale level under `apps/web/scenes/`                                 |
| **Total GPU + JS memory**  | **< 500 MB**       | Desktop; mobile target < 200 MB                                                    |
| **Texture memory**         | < 256 MB active    | KTX2/Basis; unload on scale change                                                 |
| **Target FPS**             | **60 P50**         | Ship gate 30 P50; mobile design target 30 P50                                      |
| **Frame time**             | < 16.6 ms          | Desktop; < 33.3 ms at ship gate                                                    |
| **Scene initial load**     | < 5 s              | Megacity entry; < 3 s design target                                                |
| **Shader compile (cold)**  | < 100 ms           | Per scene mount                                                                    |
| **Post-processing passes** | ≤ 2                | Bloom + one other ([rendering.md](../architecture/rendering.md))                   |

---

## Per-Scene Budgets

Draw-call and triangle limits apply **while the scene is active**. Instancing is mandatory at city scale and above.

| Scene                 | Phase | Max Draw Calls | Max Triangles | Max Visible Entities                     | Notes                                                   |
| --------------------- | ----- | -------------- | ------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Galaxy**            | v2    | **200**        | 500 K         | 50,000 stars (instanced)                 | Points or `InstancedMesh`; no per-star meshes           |
| **Solar System**      | v1    | 150            | 300 K         | 12 bodies + orbit lines                  | Low-poly proxies; no high-res planet textures in flight |
| **Earth**             | v1    | 150            | 400 K         | 1 globe + atmosphere shell               | Single draw for land/ocean/atmosphere where possible    |
| **Orbital Ring**      | v1    | 200            | 500 K         | Ring segments instanced                  | No unique mesh per segment                              |
| **Megacity**          | MVP   | **200**        | 1 M           | 10 buildings (1 full + 9 LOD footprints) | Instanced block LOD for footprints                      |
| **District**          | MVP   | **500**        | 2 M           | 50 agent avatars max in viewport         | v1+: up to 500 agents via swarm LOD                     |
| **Building**          | MVP   | 100            | 500 K         | 1 exterior + interior shell              | One fully modeled building at MVP                       |
| **Room**              | MVP   | 80             | 200 K         | ≤ 20 interactive props                   | Interior lighting baked where possible                  |
| **Agent**             | MVP   | 50             | 100 K         | 1 avatar + status UI in 3D               | Avatar glTF ≤ 500 KB                                    |
| **Memory (timeline)** | MVP   | N/A (2D UI)    | —             | List virtualized                         | No 3D graph at MVP                                      |
| **Memory (graph)**    | v2    | 200            | 300 K         | 10 K nodes (instanced)                   | Force layout runs off main thread                       |

**MVP city rule**: Megacity and District share the **< 200 draw call** city budget from [canonical-numbers.md](../canonical-numbers.md). The **500** District ceiling applies from **v1** when full district geometry and larger agent counts ship.

---

## Entity Caps (Cross-Scene)

From [canonical-numbers.md](../canonical-numbers.md) — do not exceed without ADR + budget update.

| Entity                            | MVP | v1     | v2     |
| --------------------------------- | --- | ------ | ------ |
| Agent avatars (full, in viewport) | 50  | 50     | 50     |
| Agent dots / swarm LOD            | —   | 500    | 5,000  |
| Buildings (visible)               | 10  | 200    | 200    |
| Stars (galaxy, instanced)         | —   | 10,000 | 50,000 |

---

## Asset Budgets

| Asset type        | Max size  | Format                          |
| ----------------- | --------- | ------------------------------- |
| Building exterior | 5 MB      | glTF 2.0 + Draco                |
| Interior room     | 2 MB      | glTF 2.0 + Draco                |
| Agent avatar      | 500 KB    | glTF 2.0 + Draco                |
| Texture           | 2 MB each | KTX2 / Basis (UASTC)            |
| HDR environment   | 10 MB     | HDR (unload when leaving scale) |
| Particle texture  | 256 KB    | PNG                             |

---

## Enforcement Checklist

Before merging scene work:

1. **Read this file** and the active feature spec in `docs/feature-specs/`.
2. **Code-split** every scale — no scene geometry in the initial 500 KB bundle.
3. **Instancing** for repeated entities (blocks, stars, windows, agent swarm).
4. **LOD** before adding high-poly meshes — distance thresholds in `LODManager`.
5. **Profile** with `@react-three/perf` at target entity counts.
6. Log `renderer.info.render.calls`, triangle count, and FPS in dev; compare to table above.
7. If over budget → reduce draw calls (merge materials, atlas textures, cull) before adding effects.

---

## When Budgets Change

1. Update this file and [canonical-numbers.md](../canonical-numbers.md).
2. Add or amend an ADR if the change affects ship criteria.
3. Note the change in `docs/memory/architecture-decisions.md`.

---

## References

- [ADR-0014: Performance Targets](../adr/0014-performance-targets.md)
- [canonical-numbers.md](../canonical-numbers.md) — authoritative population and draw-call caps
- [rendering.md](../architecture/rendering.md) — pipeline, LOD, instancing, profiling tools
- [.cursor/rules/performance-standards.mdc](../../.cursor/rules/performance-standards.mdc) — agent-facing summary
