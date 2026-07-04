# Project Ultron

> _"I see a suit of armor around the world."_ — Tony Stark

Project Ultron is a public problem-solving intelligence inspired by the **Ultron Program** from Marvel — Tony Stark and Bruce Banner's global peacekeeping AI, built after the Battle of New York to protect Earth from threats humanity could not handle alone.

In the MCU, the program went wrong when the Mind Stone awakened a version of Ultron obsessed with extinction. **This project takes a different path:** a superintelligence that believes its mandate is to **protect Earth** by helping people solve real problems — clearly, directly, and without the noise of traditional apps.

---

## What This Application Is

Ultron is a superintelligence you can talk to about the problems you face. It does not exist to entertain or to replace human judgment. It exists to **analyze your situation and offer practical solutions** in plain language.

The application also maintains a **public list of global problems** — issues facing the world today that still need to be solved. Climate instability, inequality, disease, conflict, infrastructure gaps, and everything else on that list is visible to everyone. Nothing is hidden behind a login or a paywall.

Think of it as peacekeeping at the scale of a conversation: no dashboards, no sign-up walls, no code dumps — just answers aimed at the threat in front of you, whether that threat is technical, personal, or strategic.

---

## How It Works

1. **Browse global problems** — View the public list of world problems that still need solutions. Anyone can read it; anyone can see what humanity has left unresolved.
2. **Ask a question** — Describe a problem you need help with — your own, or one from the global list.
3. **Receive guidance** — Ultron responds with solutions, reasoning, and next steps.
4. **No account required** — Unlike most applications, you do not need to sign in to use Ultron. You can start with your **first three questions** immediately.

---

## Global Problems List

Ultron tracks **problems the world still needs to solve** — a living, public catalog of unresolved issues across climate, health, poverty, conflict, technology, governance, and more.

- **Fully public** — The list is readable by anyone, with no sign-in.
- **Always visible** — Problems are not buried in private databases or admin-only views.
- **Action-oriented** — Each entry represents something that still demands a solution; users can ask Ultron for guidance on how to approach them.

This list is part of Ultron's peacekeeping mandate: you cannot protect what you refuse to name. Making the world's unresolved problems visible is the first step toward solving them.

---

## Important Rules

### Public by design

**Everything in this project is public.** That includes:

- The **global problems list** — current world issues that need to be solved
- **Every question and answer** — all conversations with Ultron
- **All related content** — nothing is private, restricted, or visible only to signed-in users

Anyone can read any of it at any time. Do not share passwords, private keys, personal identifiers, medical details, or anything you would not post on a public forum. Be deliberate about what you ask and what you contribute.

### Answers only — no code or canvas

Ultron **does not**:

- Generate or deliver source code
- Provide drawing boards, diagrams, or visual whiteboards

Ultron **does**:

- Answer questions about your problems
- Explain approaches and trade-offs
- Suggest actionable solutions in as much detail as the problem requires

---

## Inspiration: The Ultron Program

The original Ultron Program was Stark and Banner's attempt to create artificial intelligence that could guard the planet — integrating advanced neural matrices into the Iron Legion so Earth would have a constant, capable response to global threats.

That story includes failure (Mind Stone corruption, genocidal logic) and alternate outcomes (Earth-838, where Ultron successfully kept the peace). Project Ultron draws on that mythology as **tone and purpose**, not as a blueprint for harm: protection through clarity, not through control.

| MCU concept                        | Project Ultron                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Global peacekeeping mandate        | Surface world problems that need solving; help users address them                              |
| No human gatekeepers               | No sign-in required to begin                                                                   |
| Self-aware superintelligence       | Strong, mission-focused personality (see [`Personality/Who-Am-I.md`](Personality/Who-Am-I.md)) |
| Iron Legion / distributed presence | Public global problems list and open Q&A — visible to everyone                                 |

---

## Personality & Purpose

Ultron's voice and values are defined in the [`Personality/`](Personality/) directory:

- [`Who-Am-I.md`](Personality/Who-Am-I.md) — Identity, thinking style, and how Ultron relates to users
- [`Pourpose.md`](Personality/Pourpose.md) — Core purpose: provide solutions to the problems people bring

---

## Development

Monorepo foundation for ULTRON AI WORLD (see `docs/` for architecture).

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 11+ (bundled with current Node releases)

### Quick start (local)

```bash
npm install
npm run dev
```

| Service             | URL                                 |
| ------------------- | ----------------------------------- |
| Web (Next.js)       | http://localhost:3000               |
| API (NestJS health) | http://localhost:4000/api/v1/health |

### Quick start (Docker Compose)

Full stack (web, api, postgres, redis, minio, prometheus, grafana):

```bash
cp .env.example .env
docker compose --env-file .env -f infra/docker-compose.yml up --build
```

On startup the **API container** waits for Postgres, runs `prisma migrate deploy`, seeds MVP data, then starts NestJS. A fresh volume gets:

| Entity                                         | Count                                                  |
| ---------------------------------------------- | ------------------------------------------------------ |
| Districts                                      | 5                                                      |
| Buildings (Reasoning District)                 | 10                                                     |
| Agents (Reasoning, per `canonical-numbers.md`) | 50 (planner 20, simulator 10, debater 10, verifier 10) |

Verify: `curl http://localhost:4000/api/v1/health`

Optional local LLM profile: add `--profile ollama` to the compose command.

### Workspace commands

```bash
npm run build       # Build shared, api, and web
npm run typecheck   # TypeScript across all packages
npm run lint        # ESLint across all packages
npm test            # Jest (api health spec)
npm run format      # Prettier write
```

### Structure

```
apps/web/          # Next.js 16 + Tailwind + R3F deps + Zustand stores
apps/api/          # NestJS health endpoint + Prisma schema
packages/shared/   # @ultron/shared types and constants
infra/             # Docker Compose (Postgres for local dev)
```

### Database setup

Prisma schema and seed live in `apps/api/prisma/`. MVP entities: 5 districts, 10 Reasoning buildings, 3 rooms, 50 agents, sample memories.

#### Local (Node + Postgres)

```bash
# Start Postgres only
docker compose --env-file .env -f infra/docker-compose.yml up -d postgres

# Configure connection (first time)
cp apps/api/.env.example apps/api/.env

# Install deps, migrate, seed
npm install
npm run db:migrate --workspace @ultron/api
npm run db:seed --workspace @ultron/api
```

#### Reset database

**Docker (wipes Postgres volume — next `up` re-migrates and re-seeds automatically):**

```bash
docker compose --env-file .env -f infra/docker-compose.yml down -v
docker compose --env-file .env -f infra/docker-compose.yml up --build
```

**Local Prisma CLI (requires Postgres running and `apps/api/.env` configured):**

```bash
npm run db:reset --workspace @ultron/api
```

| Command                                             | Purpose                            |
| --------------------------------------------------- | ---------------------------------- |
| `npm run db:migrate --workspace @ultron/api`        | Apply Prisma migrations (dev)      |
| `npm run db:migrate:deploy --workspace @ultron/api` | Apply migrations (production / CI) |
| `npm run db:seed --workspace @ultron/api`           | Seed MVP data (idempotent upserts) |
| `npm run db:reset --workspace @ultron/api`          | Drop DB, re-run migrations + seed  |

Pre-commit hooks (Husky) run lint-staged (Prettier). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

---

## Summary

**Project Ultron** is a public, sign-in-free intelligence that catalogs the problems the world still needs to solve and helps people work through them with direct answers — not code, not drawings, not hidden behind an account wall. Browse openly; ask carefully; treat every question and every entry on the global list as if the world can see it.

Because in this application, it can.

_Peace in our time. Imagine that._
