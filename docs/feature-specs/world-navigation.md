# Feature Spec: World Navigation

## Purpose

Seamless navigation across all 10 scale levels with camera transitions, breadcrumbs, search, and non-3D alternatives.

## Scope: MVP (instant cuts), v1 (animated transitions), v2 (full stack)

## Requirements

### MVP

- [ ] Navigate: Megacity → District → Building → Room → Agent
- [ ] Instant scene cuts (no animation)
- [ ] Breadcrumb trail in top bar
- [ ] Sidebar hierarchy tree
- [ ] Entity selection syncs 3D ↔ sidebar
- [ ] Back button reverses navigation

### v1

- [ ] Add: Solar System, Earth, Orbital Ring → Megacity transitions
- [ ] Animated camera flights (Bezier paths, < 3s)
- [ ] Skip transition button (after 500ms)
- [ ] Search with quick-jump to entity
- [ ] Bookmarks for saved locations
- [ ] Keyboard shortcuts (`G`, `1-9`, `Escape`, `/`)

### v2

- [ ] Add: Galaxy transitions
- [ ] Agent → Memory graph transition
- [ ] Full breadcrumb: Galaxy › ... › Memory
- [ ] Mini-map at city scale
- [ ] Follow agent camera mode

## Scale Transition Controller

```typescript
interface ScaleTransition {
  from: ScaleLevel;
  to: ScaleLevel;
  duration: number; // ms
  curve: 'bezier' | 'linear';
  controlPoints: CameraKeyframe[];
  easing: string;
  preload: boolean; // preload destination during flight
}

interface CameraKeyframe {
  position: [number, number, number];
  lookAt: [number, number, number];
  timestamp: number; // 0-1 normalized
}
```

## Navigation Store

```typescript
interface NavigationState {
  currentScale: ScaleLevel;
  focusEntityId: string | null;
  breadcrumbs: Breadcrumb[];
  cameraState: CameraState;
  isTransitioning: boolean;
  bookmarks: Bookmark[];
}
```

## API Endpoints

```
GET /api/v1/navigation/:scale?focus=
GET /api/v1/search?q=&type=
```

## WebSocket Events

```
nav:subscribe { scale, focusId }
nav:ack { tick }
```

## Implementation Steps

1. Create `navigationStore` (Zustand) with scale, focus, breadcrumbs
2. Build `SceneRouter` component (scale → scene mapping)
3. Implement breadcrumb UI in top bar
4. Build sidebar hierarchy tree from navigation API
5. Wire 3D selection ↔ sidebar bidirectionally
6. (v1) Implement `ScaleTransitionController` with Bezier paths
7. (v1) Author transition paths as JSON configs
8. (v1) Add search service with quick-jump
9. (v2) Add galaxy and solar system transitions
10. (v2) Implement mini-map component

## Acceptance Criteria

- [ ] User can navigate from megacity to agent in < 5 clicks
- [ ] Breadcrumbs always reflect current position
- [ ] Sidebar tree matches 3D scene entities
- [ ] (v1) Animated transitions complete in < 3 seconds
- [ ] (v1) Search finds entities and navigates to them
- [ ] (v2) Full galaxy-to-memory journey possible
