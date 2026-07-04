# Feature Spec: UI Shell

## Purpose

Define the **2D overlay layer** — HUD, panels, navigation chrome, and dialogue container that wraps the 3D canvas.

## Scope: MVP (required before any 3D scene ships)

## Requirements

### Layout (MVP)

- [ ] Top bar (48px): logo, breadcrumbs, search placeholder, settings icon
- [ ] Right sidebar (320px): entity detail on selection; hidden by default
- [ ] Bottom HUD (64px): scale-specific metrics for current view
- [ ] Left sidebar (280px): hierarchy tree; collapsed by default
- [ ] 3D canvas occupies ≥ 70% viewport at 1366×768
- [ ] All panels use `GlassPanel` component pattern

### Top Bar

- [ ] Breadcrumb reflects navigation path (see ADR-0008 MVP levels)
- [ ] Breadcrumb items clickable for ascend navigation
- [ ] Search input present but disabled until v1 (show tooltip)
- [ ] Scale indicator badge (e.g., "REASONING DISTRICT")

### Right Sidebar

- [ ] Opens on entity select (building, agent, room)
- [ ] Closes on Escape or deselect
- [ ] Sections: EntityCard header, metrics, actions
- [ ] "Enter" / "Talk" / "View Memory" action buttons

### Bottom HUD

| Scale    | Metrics Shown                                 |
| -------- | --------------------------------------------- |
| Megacity | District count, total agents, city prosperity |
| District | District name, agent count, throughput        |
| Building | Building name, utilization, agent count       |
| Room     | Room name, agents present                     |
| Agent    | Agent name, status, model                     |

### Left Sidebar

- [ ] Hierarchy tree: Megacity → Reasoning → Planning Tower → Rooms → Agents
- [ ] Click tree item → navigate (instant cut at MVP)
- [ ] Toggle with `Tab` key or hamburger icon
- [ ] Auto-collapse after 10s inactivity

### Dialogue Panel

- [ ] Opens on agent double-click or "Talk" button
- [ ] Glass panel floating over canvas (not full-screen at desktop)
- [ ] Full-screen **bottom sheet** on mobile (< 768px) — not modal
- [ ] Public visibility warning on first dialogue
- [ ] Streaming text, tool call cards, send input

### Keyboard Shortcuts (MVP)

| Key      | Action                   |
| -------- | ------------------------ |
| `Escape` | Deselect / close sidebar |
| `Tab`    | Toggle left sidebar      |
| `?`      | Show shortcuts overlay   |

### Non-Functional

- [ ] First paint < 1s (shell without 3D)
- [ ] WCAG AA contrast on all text
- [ ] Keyboard-operable without mouse
- [ ] `prefers-reduced-motion` respected

## Out of Scope (MVP)

- Search functionality (v1)
- Mini-map (v1)
- Settings panel content (placeholder icon only)
- Governor controls (v2)

## Components to Build

```
components/
├── ui/GlassPanel.tsx
├── ui/StatusBadge.tsx
├── hud/TopBar.tsx
├── hud/BottomHUD.tsx
├── hud/Breadcrumb.tsx
├── panels/RightSidebar.tsx
├── panels/LeftSidebar.tsx
├── panels/EntityCard.tsx
├── panels/DialoguePanel.tsx
└── panels/ShortcutsOverlay.tsx
```

## Acceptance Criteria

- [ ] Shell renders with placeholder canvas before 3D loads
- [ ] Selecting agent in 3D opens right sidebar + dialogue on action
- [ ] Breadcrumb updates on every navigation
- [ ] Bottom HUD shows correct metrics per scale
- [ ] Mobile layout uses bottom sheet for dialogue

## References

- `docs/design-system/ui-principles.md`
- `docs/adr/0008-mvp-entry-and-scale-stack.md`
- `docs/canonical-numbers.md`
