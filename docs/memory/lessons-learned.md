# Lessons Learned

> **Cursor Memory File** — Insights from development to inform future decisions.

---

## Documentation Phase

### What Worked

- **Spec-driven approach**: Writing world bible before architecture prevented technical decisions from overriding narrative coherence
- **District-as-cognitive-module**: Mapping AI capabilities to spatial districts creates intuitive mental model for both users and developers
- **Cursor memory system**: Separating project context, active work, and backlog gives AI agents clear session orientation
- **ADR format**: Immutable decision records prevent re-debating settled questions

### What to Watch

- **Scale transition complexity**: Google Earth-style seamless zoom across 10 orders of magnitude is the hardest UX challenge — build early, not late
- **Agent rendering at scale**: 5,000+ agents requires aggressive LOD — plan swarm rendering from v1, not v2
- **AI cost management**: 500+ agents with LLM backbones is expensive — Ollama fallback and model routing are critical, not optional
- **Documentation drift**: 55 docs will drift from code without automated checks — consider doc-to-code validation in CI

### Principles Confirmed

- Dark-mode-only reduces design scope by 50%
- Single Canvas is correct for seamless transitions but creates memory pressure
- Five districts is the right number — fewer feels incomplete, more feels overwhelming
- Public-by-design aligns with Project Ultron mandate and simplifies auth decisions

### Principles to Validate

- Will users actually navigate 3D, or prefer sidebar tree? (Test in MVP)
- Does district theming aid AI comprehension or is it just aesthetic? (User research in v1)
- Is 60-second simulation tick the right frequency? (Tune based on user feedback)
- Can LangGraph scale to 5,000 concurrent instances? (Load test in v1)

---

_Add lessons as development progresses._
