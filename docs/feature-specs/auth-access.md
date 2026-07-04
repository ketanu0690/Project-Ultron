# Feature Spec: Authentication and Access

## Purpose

Define **identity, sessions, roles, and permissions** for ULTRON AI WORLD.

## Scope: v1 (optional auth); MVP is anonymous-only

## Requirements

### MVP

- [ ] Anonymous session via `POST /auth/anonymous`
- [ ] Session cookie (`ultron_session`, HttpOnly, Secure, SameSite=Lax)
- [ ] Rate limits per anonymous session (see api-contracts.md)
- [ ] No login UI

### v1

- [ ] JWT access token (15 min) + refresh token (7 days)
- [ ] Optional registration (email + password or OAuth2 — TBD)
- [ ] Login does not gate exploration — anonymous remains default
- [ ] Role assignment on registration (default: Interactor)

### Roles

| Role       | MVP | v1  | Permissions                                          |
| ---------- | --- | --- | ---------------------------------------------------- |
| Anonymous  | ✓   | ✓   | Explore, dialogue (rate limited)                     |
| Interactor | —   | ✓   | Higher rate limits, bookmarks                        |
| Governor   | —   | ✓   | Policy proposals (v2), model promotion approval (v2) |
| Architect  | —   | —   | v2+: custom buildings                                |
| Admin      | —   | ✓   | Deployment, user management                          |

### Permission Matrix (v1)

| Action                  | Anonymous   | Interactor | Governor | Admin |
| ----------------------- | ----------- | ---------- | -------- | ----- |
| Navigate world          | ✓           | ✓          | ✓        | ✓     |
| Agent dialogue          | ✓ (limited) | ✓          | ✓        | ✓     |
| Task delegation         | —           | ✓          | ✓        | ✓     |
| Bookmarks               | —           | ✓          | ✓        | ✓     |
| View policies           | —           | ✓          | ✓        | ✓     |
| Edit policies           | —           | —          | v2       | ✓     |
| Approve model promotion | —           | —          | v2       | ✓     |

## API Endpoints

See `docs/architecture/api-contracts.md` — Auth section.

## WebSocket Auth

- Session cookie validated on WS connect
- JWT in `Authorization` header as alternative (v1)
- Invalid session → WS close 4001

## Security Requirements

- [ ] Passwords hashed with bcrypt (cost 12) if password auth used
- [ ] JWT signed with RS256 or HS256 from env `JWT_SECRET`
- [ ] Refresh token rotation on use
- [ ] Rate limit login: 5 attempts/min per IP
- [ ] No PII in JWT payload beyond `sub` and `role`

## Open Decision

**Auth provider at v1**: Custom JWT (default) vs OAuth2/OIDC (Google/GitHub).  
Decision required before v1 sprint. Track in `architecture-decisions.md`.

## Acceptance Criteria (v1)

- [ ] Anonymous user can explore without ever logging in
- [ ] Authenticated user receives higher rate limits
- [ ] Governor role assignable by admin
- [ ] WS connection works with both anonymous and JWT sessions

## References

- `docs/adr/0007-public-access-and-privacy.md`
- `docs/canonical-numbers.md`
