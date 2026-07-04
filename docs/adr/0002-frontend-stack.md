# ADR-0002: Frontend Stack

## Status

**Accepted** — 2026-06-14

## Context

ULTRON AI WORLD requires a web frontend that combines:

- 3D world rendering across 10 scale levels
- Rich 2D UI overlays (HUD, sidebars, dialogue)
- Realtime data synchronization
- Server-side rendering for non-3D pages (future)
- TypeScript for shared types with backend

## Decision

Use the following frontend stack:

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Framework    | Next.js 15+ (App Router)                        |
| UI Library   | React 19+                                       |
| Language     | TypeScript (strict)                             |
| Styling      | Tailwind CSS                                    |
| 3D Rendering | React Three Fiber + Three.js                    |
| 3D Helpers   | @react-three/drei, @react-three/postprocessing  |
| State        | Zustand                                         |
| Animation    | @react-spring/three (3D), CSS transitions (UI)  |
| Fonts        | Orbitron, Inter, JetBrains Mono (via next/font) |

## Alternatives Considered

### A: Vite + React (SPA)

Lighter build, no SSR complexity.

**Rejected because**: Loses Next.js App Router benefits, no API routes for BFF pattern, weaker production optimization.

### B: Remix + React

Nested routing, web standards.

**Rejected because**: Smaller 3D ecosystem integration, less mature than Next.js for production apps.

### C: Redux Toolkit for State

Industry standard, devtools, middleware.

**Rejected because**: Excessive boilerplate for our state shape. Zustand provides sufficient functionality with 1/5 the code.

### D: CSS-in-JS (styled-components, Emotion)

Component-scoped styles.

**Rejected because**: Conflicts with Tailwind approach, runtime overhead, SSR complexity with R3F.

## Consequences

### Positive

- R3F is the most mature React-Three.js integration
- Zustand stores are simple and performant
- Tailwind enables rapid UI overlay development
- Next.js provides production-grade optimization
- Shared TypeScript types with backend via monorepo

### Negative

- R3F scenes cannot use React Server Components
- Single Canvas creates memory pressure
- Tailwind class strings can become verbose
- Next.js adds build complexity over plain Vite

### Mitigations

- All R3F scenes loaded via `next/dynamic` with `ssr: false`
- Scene code-splitting per scale level
- `GlassPanel` base component reduces Tailwind repetition
- App Router used only for page shell, not 3D content

## References

- `docs/architecture/frontend.md`
- `docs/design-system/ui-principles.md`
