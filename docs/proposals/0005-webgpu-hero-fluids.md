# Proposal 0005: WebGPU Hero Fluid Scenes

## Status

**Draft** — implementation with WebGL fallback

## Author

Cursor Agent — 2026-07-05

## Problem

ADR-0003 defers WebGPU to v2. Simulation Dome / training crucible scenes need hero-quality fluid VFX that exceed WebGL stable-fluids budget without migrating the entire renderer.

## Proposed Change

Add optional `WebGPURenderer` detection in a dedicated `WebGpuFluidScene` (Simulation Dome only). Default path remains WebGL + `three-fluid-fx` or static shader fallback. Full renderer migration stays v2.

## Conflicts With

| Document | Section             | Conflict                             |
| -------- | ------------------- | ------------------------------------ |
| ADR-0003 | WebGPU rejected MVP | Scoped to one lazy-loaded hero scene |

## Technical Decision Evaluation

| Dimension       | Score | Notes                          |
| --------------- | ----- | ------------------------------ |
| Complexity      | 5     | Isolated scene, dual path      |
| Performance     | 9     | Hero only, not city background |
| Maintainability | 6     | Two render paths to test       |

## Approval

- [ ] User approved for full ADR-0003 supersede
- [x] Hero-scene scoped implementation proceeding with fallback
