# Current State

## Purpose

**Implementation truth** — what exists today and what the next ship target includes. Agents and engineers implement **only** what appears here (or in an active feature spec scoped to current work).

> Do not treat `world-bible/` or `future-vision/` as build targets unless a feature is explicitly promoted into current state.

---

## Read This First

| Question                    | Answer here                                          |
| --------------------------- | ---------------------------------------------------- |
| What code exists right now? | [`scope.md`](scope.md) → **Today**                   |
| What are we building next?  | [`scope.md`](scope.md) → **MVP**                     |
| Feature-by-feature status?  | [`capabilities.md`](capabilities.md)                 |
| Exact numbers?              | [`../canonical-numbers.md`](../canonical-numbers.md) |

---

## Rules for Cursor

1. **Before writing code** — read `scope.md` and confirm the feature is **In scope** in `capabilities.md`.
2. **Do not** add Galaxy, Earth, governance UI, simulation tick, voice, or 3D memory graph unless they appear under **Today** or **MVP** here.
3. **World Bible** describes the full fictional civilization — use it for art direction and naming, not as a feature checklist.
4. When MVP scope ships, update **Today** and move delivered items out of future vision.

---

## References

- [`scope.md`](scope.md) — narrative current reality
- [`capabilities.md`](capabilities.md) — feature matrix
- [`../roadmap/mvp.md`](../roadmap/mvp.md) — detailed MVP spec
- [`../adr/0008-mvp-entry-and-scale-stack.md`](../adr/0008-mvp-entry-and-scale-stack.md) — entry point and scale stack
- [`../memory/project-context.md`](../memory/project-context.md) — session bootstrap

_Last updated: 2026-07-04_
