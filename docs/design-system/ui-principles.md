# UI Principles

## Purpose

Define the **user interface design principles** for ULTRON AI WORLD — the 2D overlay layer that coexists with the 3D world.

---

## Responsibilities

- UI philosophy and hierarchy
- Panel layout and composition rules
- Interaction patterns
- Accessibility requirements
- Responsive behavior
- JARVIS-inspired dialogue interface design

---

## Design Philosophy

### "The World Is the Interface"

The 3D world is the primary interface. UI overlays are **contextual, minimal, and subservient** to the world — never competing with it.

| Principle          | Application                                               |
| ------------------ | --------------------------------------------------------- |
| World-first        | 3D canvas occupies ≥ 70% viewport at all times            |
| Contextual UI      | Panels appear only when relevant; auto-hide on inactivity |
| Glass aesthetic    | Panels use frosted glass (blur + transparency)            |
| Data as decoration | Metrics feel like holographic world elements              |
| JARVIS dialogue    | Agent chat is the primary text interaction                |

---

## Layout System

```
┌──────────────────────────────────────────────────────┐
│  TOP BAR (48px)                                      │
│  [Logo] [Breadcrumbs]          [Search] [Settings]   │
├────────┬─────────────────────────────┬───────────────┤
│        │                             │               │
│  LEFT  │                             │   RIGHT       │
│  280px │      3D CANVAS              │   320px       │
│  (opt) │      (flex: 1)              │   (context)   │
│        │                             │               │
├────────┴─────────────────────────────┴───────────────┤
│  BOTTOM HUD (64px) — scale-specific metrics          │
└──────────────────────────────────────────────────────┘
```

### Panel Rules

| Panel         | Default State                  | Toggle                 |
| ------------- | ------------------------------ | ---------------------- |
| Top bar       | Always visible                 | —                      |
| Left sidebar  | Collapsed                      | `Tab` key or hamburger |
| Right sidebar | Hidden until selection         | Auto on entity select  |
| Bottom HUD    | Always visible                 | —                      |
| Dialogue      | Hidden until agent interaction | Auto on agent click    |
| Mini-map      | Visible at city scale          | `M` key                |

---

## Component Library

### Core Components

| Component        | Usage                   | Style                                                                      |
| ---------------- | ----------------------- | -------------------------------------------------------------------------- |
| `GlassPanel`     | All panel containers    | `bg-space-dark/80 backdrop-blur-md border border-steel-blue/50 rounded-lg` |
| `HudMetric`      | Bottom HUD values       | JetBrains Mono, signal-cyan, tabular-nums                                  |
| `EntityCard`     | Right sidebar header    | Display font, entity name + status badge                                   |
| `StatusBadge`    | Online/offline/thinking | Semantic color dot + label                                                 |
| `SearchInput`    | Top bar search          | Glass background, cyan focus ring                                          |
| `Breadcrumb`     | Top bar navigation      | Clickable scale path                                                       |
| `DialoguePanel`  | Agent chat              | Glass panel, streaming text, tool cards                                    |
| `ToolCallCard`   | Inline tool execution   | Mono font, amber border, status icon                                       |
| `TransitionSkip` | During cinematic        | Subtle bottom-center button                                                |

---

## JARVIS Dialogue Interface

Inspired by Iron Man's JARVIS — the primary human-AI interaction:

```
┌─────────────────────────────────────┐
│  ◆ Analyst Sigma-7        [thinking]│
│  Reasoning District · Planning Tower│
├─────────────────────────────────────┤
│                                     │
│  USER: What threats are currently   │
│  being tracked by the defense ring? │
│                                     │
│  SIGMA-7: Three objects in LEO.    │
│  Two debris clusters at low risk.   │
│  One unauthorized satellite launch  │
│  detected 4 hours ago — tracking.   │
│                                     │
│  ┌─ Tool: query_defense ─────────┐  │
│  │ ✓ 3 threats retrieved         │  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  [Type a message...]          [Send]│
└─────────────────────────────────────┘
```

### Dialogue Rules

1. Agent name and status always visible in header
2. User messages right-aligned, agent messages left-aligned
3. Streaming text appears token by token (50ms fade-in)
4. Tool calls render as inline cards with status
5. Memory citations appear as clickable cyan threads
6. Input disabled while agent is thinking

---

## Interaction Patterns

| Pattern             | Behavior                              |
| ------------------- | ------------------------------------- |
| Hover entity (3D)   | Right sidebar preview (name + status) |
| Click entity (3D)   | Right sidebar full detail             |
| Double-click entity | Enter/navigate to entity              |
| Escape              | Deselect → close sidebar              |
| `/` key             | Focus search input                    |
| `?` key             | Show keyboard shortcuts overlay       |
| Inactivity (10s)    | Fade left sidebar if expanded         |

---

## Responsive Breakpoints

| Breakpoint  | Layout Changes                      |
| ----------- | ----------------------------------- |
| ≥ 1440px    | Full layout (left + right sidebars) |
| 1024–1439px | Right sidebar only; left collapsed  |
| 768–1023px  | Bottom drawer replaces sidebars     |
| < 768px     | Full-screen 3D; UI as bottom sheet  |

### Mobile UI

- 3D view is full-screen
- Tap entity → bottom sheet with details
- Navigation via bottom sheet hierarchy tree
- No free-flight camera; tap-to-go only
- Dialogue as full-screen bottom sheet on mobile (not a modal dialog)

---

## Accessibility

| Requirement         | Implementation                                       |
| ------------------- | ---------------------------------------------------- |
| Keyboard navigation | All UI operable without mouse                        |
| Screen reader       | ARIA labels on all panels; live regions for dialogue |
| Color contrast      | WCAG AA minimum (see colors.md)                      |
| Reduced motion      | `prefers-reduced-motion` disables transitions        |
| Focus indicators    | 2px cyan outline on focused elements                 |
| Non-3D navigation   | Sidebar tree usable without entering 3D              |

---

## Constraints

1. **UI never occludes > 40% of canvas** — Even with all panels open
2. **Maximum 2 simultaneous panels** — Left + right, or dialogue + right
3. **No modal dialogs at MVP** — Use panels and bottom sheets (dialogue uses bottom sheet on mobile, floating panel on desktop)
4. **All text in Inter or JetBrains Mono** — No system font fallbacks visible
5. **Touch targets ≥ 44px on mobile**

---

## Future Considerations

- Customizable UI layout (panel positions)
- Voice input for agent dialogue
- Holographic UI elements rendered in 3D (not HTML overlay)
- Notification system with priority queue
- Multi-user presence indicators
- Command palette (Cmd+K) for power users

---

## Implementation Guidance

1. Build `GlassPanel` as base component with Tailwind classes
2. Use `framer-motion` or CSS transitions for panel slide animations
3. Dialogue panel as React component with WebSocket streaming hook
4. Implement `useInactivity` hook for auto-hiding panels
5. Bottom sheet on mobile via `vaul` or custom implementation
6. Test all interactions with keyboard-only navigation
