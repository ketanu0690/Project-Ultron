# ADR-0001: Project Direction

## Status

**Accepted** — 2026-06-14

## Context

Project Ultron began as a public problem-solving intelligence with a Q&A interface. The vision has expanded to represent AI systems as a navigable 3D civilization — making artificial intelligence visible, understandable, and governable through spatial exploration.

We need to decide the fundamental direction of the software: a traditional web application with 3D elements, or a 3D-first spatial operating system for AI.

## Decision

Build ULTRON AI WORLD as a **3D-first spatial operating system** where:

1. The primary interface is a navigable 3D world (not a dashboard)
2. AI concepts map to spatial entities (districts, buildings, agents, memories)
3. Scale navigation (galaxy to memory) is the signature feature
4. The world is a living simulation, not a static visualization
5. Documentation drives implementation (spec before code)

## Alternatives Considered

### A: Dashboard-First with 3D Widgets

Traditional admin dashboard with embedded 3D viewers for specific entities.

**Rejected because**: Reduces the world to decoration. The spatial metaphor IS the product.

### B: Game Engine (Unity/Unreal WebGL)

Build in a game engine and export to WebGL.

**Rejected because**: Less web-native, harder to integrate with React UI, larger bundle sizes, weaker SEO and accessibility.

### C: 2D Map-Based (SimCity style)

Top-down 2D city builder with district zones.

**Rejected because**: Loses the scale navigation feature. Cannot represent galaxy-to-memory journey.

## Consequences

### Positive

- Unique product differentiation (no competitor combines these influences)
- Spatial metaphor makes AI architecture intuitive
- Scale navigation creates memorable user experience
- Documentation-first approach reduces rework

### Negative

- Higher development complexity than a dashboard
- 3D performance constraints on mobile
- Requires specialized Three.js engineering skills
- Longer time to MVP (5 months vs 2-3 for dashboard)

### Risks

- Users may prefer sidebar navigation over 3D flight
- Scale transitions may be technically harder than estimated
- 3D asset pipeline adds art dependency

## Compliance

- Aligns with Project Ultron transparency mandate
- Personality files (`Who-Am-I.md`, `Pourpose.md`) inform world narrative
- Public-by-design: all world state visible

## References

- `docs/roadmap/vision.md`
- `docs/world-bible/overview.md`
- `Personality/Who-Am-I.md`
