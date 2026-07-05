# Web E2E (Playwright)

End-to-end tests for the Galaxy-first MVP path documented in `docs/qa/nexus-scenarios.md` and `docs/memory/galaxy-first-roadmap.md`.

## Prerequisites

Both services must be running against seeded data:

| Service | Command                                                         | URL                     |
| ------- | --------------------------------------------------------------- | ----------------------- |
| API     | `npm run dev --workspace @ultron/api` (or Docker Compose stack) | `http://localhost:4000` |
| Web     | `npm run dev --workspace @ultron/web`                           | `http://localhost:3000` |

Set `NEXT_PUBLIC_API_URL` if the API is not on `:4000`.

## Run

From repo root:

```bash
npm exec --workspace @ultron/web playwright install chromium
npm run test:e2e
```

From `apps/web`:

```bash
npm exec playwright install chromium
npm run test:e2e
```

## CI fast variant

The `@ci` tagged spec uses `?scale=megacity` to skip the scroll journey (avoids flaky wheel timing in headless CI). Run only that test:

```bash
npm run test:e2e:ci --workspace @ultron/web
```

GitLab CI runs this as the `e2e:galaxy-journey` job (`infra/.gitlab-ci.yml`) against a spun-up Postgres + API + web stack. The job is **non-blocking** (`allow_failure: true`) until flake rate is validated.

## Specs

| File                     | Path                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `galaxy-journey.spec.ts` | Default galaxy load → scroll to Reasoning District → sidebar → Sigma-7 → Talk → View Memory |
| `@ci` variant            | `?scale=megacity` deep-link → same city chain                                               |

Tests skip automatically when `GET /api/v1/health` fails so local runs without the API do not false-fail.

## Notes

- Navigation uses the left sidebar tree (Menu button) — 3D canvas clicks are not required.
- Dialogue uses stub mode when Ollama is unavailable; tests assert panel visibility only.
- Memory timeline requires seed data (`agent-sigma-7` memories).
