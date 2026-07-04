# Current Capabilities Matrix

> Status key: **Now** = exists in repo today · **MVP** = in scope for first ship · **No** = not current — see [`../future-vision/`](../future-vision/)

| Capability                                           | Status                               | Notes                                                                                        |
| ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Monorepo (`apps/web`, `apps/api`, `packages/shared`) | **Now: Partial** · MVP: Yes          | Turbo + Husky + npm workspace; no `packages/personality/`, no Docker, no CI                  |
| Shared types & WS event contracts                    | **Now: Partial** · MVP: Yes          | `@ultron/shared` — 13 source files; no server/client WS implementation                       |
| Single R3F Canvas + SceneRouter                      | **Now: Yes** · MVP: Yes              | ADR-0003 compliant; all 10 scales registered, 9 renderable                                   |
| Four Zustand stores                                  | **Now: Partial** · MVP: Yes          | ADR-0004 structure; only `navigationStore` is functional                                     |
| Camera & scale transitions                           | **Now: Partial** · MVP: Instant cuts | `CameraController`, `ScaleTransitionController` functional; animated paths ahead of ADR-0008 |
| Megacity aerial view                                 | **Now: Partial** · MVP: Yes          | 5 district zones on infinite grid; no drill-down handlers                                    |
| Reasoning District (full 3D)                         | **Now: Partial** · MVP: Yes          | 10 building footprints + Planning Tower highlight; no API/seed                               |
| Other 4 districts (full 3D)                          | **No**                               | v1 — megacity footprints only                                                                |
| Planning Tower (exterior + 3 rooms)                  | **Now: Partial** · MVP: Yes          | Procedural mesh + 3 room boxes; no portal transitions or glTF                                |
| Agent avatar (placeholder)                           | **Now: Partial** · MVP: Yes          | 1 capsule in `AgentScene`; not 50 agents                                                     |
| 50 agents with dialogue                              | **Now: No** · MVP: Yes               | No dialogue panel, WS, or backend                                                            |
| Agent memory timeline                                | **Now: Partial** · MVP: Yes          | 6 mock 3D cards; no panel UI or backend persistence                                          |
| UI shell (TopBar, sidebars, HUD, dialogue)           | **Now: Partial** · MVP: Yes          | Earth/Galaxy HUDs only; `panels/` and `ui/` empty                                            |
| World navigation drill-down                          | **Now: No** · MVP: Yes               | Scenes isolated; breadcrumbs always `[]`; no city-scale `onDoubleClick`                      |
| REST API (domain modules)                            | **Now: No** · MVP: Yes               | Health at `/health` only — not `/api/v1/`                                                    |
| WebSocket realtime                                   | **Now: No** · MVP: Yes               | Contracts in shared package; no gateway                                                      |
| Database + seed data                                 | **Now: No** · MVP: Yes               | No Prisma schema or seed script                                                              |
| Docker deployment                                    | **Now: No** · MVP: Yes               | `infra/.gitkeep` only                                                                        |
| CI/CD pipeline                                       | **Now: No** · MVP: Yes               | No `.gitlab-ci.yml` or GitHub Actions                                                        |
| Earth view                                           | **Now: Partial** · v1: Yes           | Full frontend scene + HUD + transitions; mock data; no API                                   |
| Solar System view                                    | **Now: Partial** · v1: Yes           | `LockedScaleScene` placeholder only                                                          |
| Orbital Defense Ring                                 | **Now: Partial** · v1: Yes           | Ring segments, tethers, zone markers; no DefenseHUD or API                                   |
| Galaxy view                                          | **Now: Partial** · v2: Yes           | 50K instanced stars, mock systems, HUD; no API                                               |
| 500 agents                                           | **No**                               | v1                                                                                           |
| 5,000 agents                                         | **No**                               | v2                                                                                           |
| Simulation tick                                      | **No**                               | v1 backend                                                                                   |
| Authentication (JWT)                                 | **No**                               | v1 optional                                                                                  |
| Governance UI                                        | **No**                               | v2                                                                                           |
| Animated scale transitions                           | **Now: Partial** · v1: Yes           | Earth/Galaxy/Ring paths built; megacity chain not wired                                      |
| 3D memory graph                                      | **No**                               | v2                                                                                           |
| Voice interaction                                    | **No**                               | Future vision                                                                                |
| Planetary simulation                                 | **No**                               | Future vision                                                                                |
| VR / AR                                              | **No**                               | Future vision                                                                                |
| 10,000+ agents                                       | **No**                               | Future vision                                                                                |

When a capability moves from future to current, update this table **and** [`../future-vision/capabilities.md`](../future-vision/capabilities.md).
