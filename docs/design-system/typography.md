# Typography

## Purpose

Define the **type system** for ULTRON AI WORLD — font families, scales, weights, and usage rules for UI overlays and in-world labels.

---

## Responsibilities

- Font selection and loading strategy
- Type scale for UI hierarchy
- 3D text and label specifications
- Monospace usage for data and code display
- Responsive type scaling

---

## Font Families

| Role      | Font               | Fallback              | Source        |
| --------- | ------------------ | --------------------- | ------------- |
| Display   | **Orbitron**       | Rajdhani, sans-serif  | Google Fonts  |
| Body      | **Inter**          | system-ui, sans-serif | Google Fonts  |
| Mono      | **JetBrains Mono** | Fira Code, monospace  | Google Fonts  |
| 3D Labels | **Orbitron**       | —                     | Texture atlas |

### Why These Fonts

| Font           | Rationale                                                   |
| -------------- | ----------------------------------------------------------- |
| Orbitron       | Geometric, futuristic, excellent for headings and 3D labels |
| Inter          | Highly legible at small sizes, extensive weight range       |
| JetBrains Mono | Clear distinction for data values, metrics, IDs             |

---

## Type Scale

| Token        | Size            | Weight | Line Height | Font           | Usage                      |
| ------------ | --------------- | ------ | ----------- | -------------- | -------------------------- |
| `display-xl` | 48px / 3rem     | 700    | 1.1         | Orbitron       | Galaxy/Solar System titles |
| `display-lg` | 36px / 2.25rem  | 700    | 1.15        | Orbitron       | Scale level titles         |
| `display-md` | 24px / 1.5rem   | 600    | 1.2         | Orbitron       | District/building names    |
| `heading-lg` | 20px / 1.25rem  | 600    | 1.3         | Inter          | Panel headings             |
| `heading-md` | 16px / 1rem     | 600    | 1.4         | Inter          | Section headings           |
| `heading-sm` | 14px / 0.875rem | 600    | 1.4         | Inter          | Card titles                |
| `body-lg`    | 16px / 1rem     | 400    | 1.6         | Inter          | Dialogue text              |
| `body-md`    | 14px / 0.875rem | 400    | 1.5         | Inter          | Sidebar content            |
| `body-sm`    | 12px / 0.75rem  | 400    | 1.5         | Inter          | Captions, timestamps       |
| `mono-lg`    | 14px / 0.875rem | 400    | 1.5         | JetBrains Mono | Metrics, IDs               |
| `mono-sm`    | 12px / 0.75rem  | 400    | 1.4         | JetBrains Mono | Coordinates, debug         |

---

## UI Typography Patterns

### HUD Panel Header

```
Font: Orbitron 600
Size: display-md (24px)
Color: text-primary
Letter-spacing: 0.05em
Text-transform: uppercase
```

### Metric Value

```
Font: JetBrains Mono 400
Size: mono-lg (14px)
Color: signal-cyan
Tabular-nums: enabled
```

### Agent Dialogue

```
Font: Inter 400
Size: body-lg (16px)
Color: text-primary
Line-height: 1.6
Max-width: 65ch
```

### Breadcrumb

```
Font: Inter 400
Size: body-sm (12px)
Color: text-secondary
Separator: " › " in text-tertiary
Active: signal-cyan
```

---

## 3D Text Labels

In-world labels use **HTML overlays** (not Three.js TextGeometry) for quality and accessibility:

| Context              | Font           | Size | Style                             |
| -------------------- | -------------- | ---- | --------------------------------- |
| Building nameplate   | Orbitron       | 14px | Uppercase, cyan glow shadow       |
| District zone marker | Orbitron       | 24px | Uppercase, district primary color |
| Agent name tag       | Inter          | 12px | Below avatar, white with shadow   |
| Threat indicator     | JetBrains Mono | 10px | Red, monospace                    |

### Label Rules

1. Labels face camera (billboard behavior via `@react-three/drei` `Html`)
2. Labels fade with distance (opacity 1.0 at LOD 0, 0 at LOD 3+)
3. Maximum 50 visible labels at any time
4. Selected entity label is always visible regardless of LOD

---

## Tailwind Configuration

```javascript
// Conceptual
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
        // ...
      },
    },
  },
};
```

---

## Constraints

1. **Maximum 3 font families** — Orbitron, Inter, JetBrains Mono
2. **No font size below 10px** — Accessibility minimum
3. **No italic at MVP** — Clarity over style
4. **Font loading: swap** — Prevent FOIT; show fallback immediately
5. **3D labels via HTML overlay** — Not TextGeometry or troika-three-text

---

## Future Considerations

- Variable font support for smoother weight transitions
- Per-district display font variants
- Agent dialogue font customization
- RTL language support
- Dynamic font scaling based on viewport

---

## Implementation Guidance

1. Load fonts via `next/font/google` for automatic optimization
2. Define type tokens in Tailwind config
3. Create typography component library: `<Heading>`, `<Metric>`, `<Label>`
4. Use `Html` from drei for 3D labels with Tailwind classes
5. Enable `font-display: swap` on all font loads
