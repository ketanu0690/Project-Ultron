# Color System

## Purpose

Define the **color palette and usage rules** for ULTRON AI WORLD — ensuring visual consistency across 3D scenes, UI overlays, and district identities.

---

## Responsibilities

- Global color tokens for UI and 3D rendering
- District-specific color palettes
- Semantic color mapping (status, alerts, metrics)
- Accessibility contrast requirements
- Dark-mode-only design (no light mode at MVP)

---

## Global Palette

### Foundation Colors

| Token            | Hex       | RGB           | Usage                   |
| ---------------- | --------- | ------------- | ----------------------- |
| `void-black`     | `#020408` | 2, 4, 8       | Deep space, backgrounds |
| `space-dark`     | `#0A0E1A` | 10, 14, 26    | UI panels, secondary bg |
| `steel-blue`     | `#1A2332` | 26, 35, 50    | Borders, dividers       |
| `fog-gray`       | `#2A3444` | 42, 52, 68    | Disabled, muted text    |
| `text-primary`   | `#E8ECF4` | 232, 236, 244 | Primary text            |
| `text-secondary` | `#8899AA` | 136, 153, 170 | Secondary text          |
| `text-tertiary`  | `#556677` | 85, 102, 119  | Hints, timestamps       |

### Signal Colors

| Token           | Hex       | Usage                                |
| --------------- | --------- | ------------------------------------ |
| `signal-cyan`   | `#00E5FF` | Primary accent, active states, links |
| `signal-green`  | `#06D6A0` | Success, online, healthy             |
| `signal-amber`  | `#FFB300` | Warning, degraded, attention         |
| `signal-red`    | `#E63946` | Error, critical, threat              |
| `signal-purple` | `#8B5CF6` | AI activity, inference, special      |

### Gradient Tokens

| Token               | Values                | Usage                |
| ------------------- | --------------------- | -------------------- |
| `gradient-hologram` | `#00E5FF` → `#8B5CF6` | Holographic elements |
| `gradient-neon`     | `#00E5FF` → `#06D6A0` | Neon edge glow       |
| `gradient-threat`   | `#FFB300` → `#E63946` | Alert indicators     |
| `gradient-data`     | `#7B61FF` → `#00E5FF` | Data flow particles  |

---

## District Palettes

| District         | Primary   | Secondary | Accent    | Background |
| ---------------- | --------- | --------- | --------- | ---------- |
| Perception       | `#7B61FF` | `#00E5FF` | `#39FF14` | `#0A0A12`  |
| Memory           | `#D4A853` | `#4A90D9` | `#F0F0FF` | `#12101A`  |
| Reasoning        | `#4B3F9E` | `#C0C8D8` | `#FFD700` | `#08081A`  |
| Action           | `#FF6B35` | `#E63946` | `#06D6A0` | `#1A1410`  |
| Self Improvement | `#10B981` | `#A855F7` | `#84CC16` | `#0A1A12`  |

See [`district-themes.md`](district-themes.md) for complete district visual specs.

---

## Semantic Colors

| State           | Color Token           | 3D Application          | UI Application  |
| --------------- | --------------------- | ----------------------- | --------------- |
| Online / Active | `signal-green`        | Window glow, agent aura | Status dot      |
| Idle            | `signal-cyan` at 50%  | Dim glow                | Muted badge     |
| Processing      | `signal-purple` pulse | Particle animation      | Loading spinner |
| Warning         | `signal-amber`        | Flickering edge         | Alert banner    |
| Critical        | `signal-red`          | Rapid pulse             | Error toast     |
| Offline         | `fog-gray`            | No glow, desaturated    | Gray badge      |
| Selected        | `signal-cyan`         | Bright edge highlight   | Border accent   |

---

## Tailwind Configuration

```javascript
// Conceptual tailwind.config extension
module.exports = {
  theme: {
    extend: {
      colors: {
        void: { black: '#020408' },
        space: { dark: '#0A0E1A' },
        steel: { blue: '#1A2332' },
        signal: {
          cyan: '#00E5FF',
          green: '#06D6A0',
          amber: '#FFB300',
          red: '#E63946',
          purple: '#8B5CF6',
        },
        district: {
          perception: { primary: '#7B61FF', bg: '#0A0A12' },
          memory: { primary: '#D4A853', bg: '#12101A' },
          reasoning: { primary: '#4B3F9E', bg: '#08081A' },
          action: { primary: '#FF6B35', bg: '#1A1410' },
          improvement: { primary: '#10B981', bg: '#0A1A12' },
        },
      },
    },
  },
};
```

---

## 3D Material Colors

Three.js materials reference the same tokens via CSS variables or a shared color constants file:

```typescript
// packages/shared/src/colors.ts (conceptual)
export const COLORS = {
  signalCyan: 0x00e5ff,
  signalGreen: 0x06d6a0,
  voidBlack: 0x020408,
  districtPerception: 0x7b61ff,
  // ...
} as const;
```

---

## Accessibility

| Requirement               | Standard                 | Implementation                           |
| ------------------------- | ------------------------ | ---------------------------------------- |
| Text contrast (primary)   | WCAG AA (4.5:1)          | `#E8ECF4` on `#0A0E1A` = 12.1:1 ✓        |
| Text contrast (secondary) | WCAG AA (4.5:1)          | `#8899AA` on `#0A0E1A` = 5.8:1 ✓         |
| Interactive elements      | 3:1 against bg           | Cyan accent on dark = 8.2:1 ✓            |
| Color-blind safety        | Not color-only           | Icons + text accompany all status colors |
| Motion sensitivity        | `prefers-reduced-motion` | Disable pulse animations                 |

---

## Constraints

1. **Dark mode only at MVP** — No light theme
2. **Maximum 3 accent colors per view** — Prevent visual noise
3. **District colors only within district boundaries** — Global UI uses signal colors
4. **No pure white** — Maximum brightness `#F0F0FF`
5. **Neon colors are accents, not fills** — Backgrounds stay dark

---

## Future Considerations

- Light mode for accessibility (v2)
- User-customizable accent color
- Color themes tied to governance events (e.g., red alert mode)
- Seasonal palette shifts
- Color-blind mode with pattern overlays

---

## Implementation Guidance

1. Define colors in `packages/shared/src/colors.ts` as single source of truth
2. Extend Tailwind config to import from shared package
3. Three.js materials import hex values from same constants
4. Create Storybook (or equivalent) color swatch page for visual QA
5. Test all text/background pairs with contrast checker in CI
