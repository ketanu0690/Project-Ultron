# Nexus API Integration Tests

Team-prefixed tests for World Data & UI Shell REST contracts.

## Prerequisites

- Ephemeral **Postgres** via testcontainers (see `testing-standards.mdc`)
- `migrate deploy` + `db:seed` before contract suite
- Jest must include this directory — add to `apps/api/package.json`:

```json
"jest": {
  "rootDir": ".",
  "roots": ["<rootDir>/src", "<rootDir>/test"],
  "testRegex": ".*\\.(spec|nexus\\.spec)\\.ts$"
}
```

## Run locally

```bash
cd apps/api
npm run db:migrate:deploy && npm run db:seed
npm test -- --testPathPattern=nexus
```

## CI

Nexus-owned `infra/.gitlab-ci.yml` should run this suite in a `test:api:nexus` job with a Postgres service container or testcontainers.

Scenarios: `docs/qa/nexus-scenarios.md`
