# ADR-0007: Public Access and Privacy

## Status

**Accepted** — 2026-06-14

## Context

Project Ultron mandates **public-by-design**: all Q&A visible to everyone. ULTRON AI WORLD extends this to world state and agent activity. We need explicit rules for what is public, what is session-private, and how anonymous users are treated.

## Decision

### Public (readable by anyone, no auth)

- World state variables and simulation events
- Building and district metrics
- Agent profiles (name, role, status, district)
- Agent dialogue sessions and responses
- Governance decisions and policy changes (v2)
- Global problems list entries (v1+ integration)
- Orbital defense alerts and threat status

### Session-Private (not published, not persisted beyond session)

- Camera position and navigation bookmarks (localStorage only)
- UI panel preferences (localStorage only)
- In-progress dialogue draft text (before send)

### Authenticated-Only (v1+, not public)

- Governor policy edit drafts (before submission)
- Admin deployment actions
- API keys and session tokens

### Not Collected

- Passwords (no password auth at MVP/v1 — JWT optional)
- Real name, email (unless user opts in at v1 auth)
- Precise geolocation

### Anonymous Users

- Assigned `anonymousSessionId` (UUID, cookie-based)
- Rate limits: 100 REST req/min, 50K tokens/day (see `canonical-numbers.md`)
- Dialogue sessions tied to anonymous ID, **still publicly visible** once sent
- First interaction does not require sign-in

## Alternatives Considered

### A: Private agent dialogues by default

**Rejected**: Contradicts Project Ultron transparency mandate.

### B: Public only after explicit publish action

**Rejected**: Adds friction; inconsistent with README "everything public."

### C: Full GDPR anonymization of dialogue authors

**Deferred to v2**: Anonymous sessions use UUID, not PII; sufficient for MVP/v1.

## Consequences

- UI must warn users before first dialogue: "This conversation is public"
- No "private mode" at MVP
- Memory storage includes public dialogue content — design retention policy
- Rate limiting is the primary abuse prevention, not access control

## References

- `README.md` — Public by design
- `docs/canonical-numbers.md` — Rate limits
- `docs/integration/project-ultron-to-ai-world.md`
