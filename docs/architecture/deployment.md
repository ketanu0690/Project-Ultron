# Deployment Architecture

## Purpose

Define the **infrastructure and deployment strategy** for ULTRON AI WORLD — containerization, hosting, monitoring, and CI/CD pipelines.

---

## Responsibilities

- Container architecture and orchestration
- Environment configuration and secrets management
- CI/CD pipeline design
- Monitoring, logging, and alerting
- Scaling strategy per environment
- Disaster recovery procedures

---

## Infrastructure Overview

```mermaid
graph TB
    subgraph Coolify Host
        subgraph Containers
            WEB[web: Next.js]
            API[api: NestJS]
            PG[(postgres: PostgreSQL)]
            REDIS[(redis: Redis)]
            MINIO[minio: Object Storage]
            OLLAMA[ollama: Local LLM]
        end
        COOLIFY[Coolify Manager]
    end

    subgraph External
        OR[OpenRouter API]
        CDN[CDN / Cloudflare]
    end

    subgraph Monitoring
        PROM[Prometheus]
        GRAF[Grafana]
        LOKI[Loki - future]
    end

    CDN --> WEB
    WEB --> API
    API --> PG
    API --> REDIS
    API --> MINIO
    API --> OLLAMA
    API --> OR
    WEB --> API
    API --> PROM
    PROM --> GRAF
    COOLIFY --> Containers
```

---

## Container Architecture

### Services

| Container    | Image                    | Port  | Resources (MVP)      |
| ------------ | ------------------------ | ----- | -------------------- |
| `web`        | `ultron-web:latest`      | 3000  | 1 CPU, 1 GB RAM      |
| `api`        | `ultron-api:latest`      | 4000  | 2 CPU, 2 GB RAM      |
| `postgres`   | `postgres:16-alpine`     | 5432  | 2 CPU, 4 GB RAM      |
| `redis`      | `redis:7-alpine`         | 6379  | 0.5 CPU, 512 MB RAM  |
| `minio`      | `minio/minio:latest`     | 9000  | 1 CPU, 1 GB RAM      |
| `ollama`     | `ollama/ollama:latest`   | 11434 | 4 CPU, 8 GB RAM, GPU |
| `prometheus` | `prom/prometheus:latest` | 9090  | 0.5 CPU, 512 MB RAM  |
| `grafana`    | `grafana/grafana:latest` | 3001  | 0.5 CPU, 512 MB RAM  |

### Docker Compose (Development)

```yaml
# Conceptual docker-compose.yml structure
services:
  web:
    build: ./apps/web
    ports: ['3000:3000']
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
      - NEXT_PUBLIC_WS_URL=ws://api:4000/ws
    depends_on: [api]

  api:
    build: ./apps/api
    ports: ['4000:4000']
    environment:
      - DATABASE_URL=postgresql://ultron:password@postgres:5432/ultron
      - REDIS_URL=redis://redis:6379
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on: [postgres, redis, ollama]

  postgres:
    image: pgvector/pgvector:pg16
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      - POSTGRES_DB=ultron
      - POSTGRES_USER=ultron
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes: [redisdata:/data]

  ollama:
    image: ollama/ollama:latest
    volumes: [ollamadata:/root/.ollama]
    deploy:
      resources:
        reservations:
          devices: [{ capabilities: [gpu] }]

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    volumes: [miniodata:/data]

  prometheus:
    image: prom/prometheus:latest
    volumes: [./infra/prometheus.yml:/etc/prometheus/prometheus.yml]

  grafana:
    image: grafana/grafana:latest
    volumes: [./infra/grafana/dashboards:/var/lib/grafana/dashboards]
```

---

## Environment Strategy

| Environment   | Purpose                | Infrastructure                  |
| ------------- | ---------------------- | ------------------------------- |
| `development` | Local dev              | Docker Compose                  |
| `staging`     | Pre-production testing | Coolify (single node)           |
| `production`  | Live users             | Coolify (single node → cluster) |

### Environment Variables

| Variable              | Service | Required | Secret |
| --------------------- | ------- | -------- | ------ |
| `DATABASE_URL`        | api     | Yes      | Yes    |
| `REDIS_URL`           | api     | Yes      | Yes    |
| `OPENROUTER_API_KEY`  | api     | Yes      | Yes    |
| `OLLAMA_BASE_URL`     | api     | Yes      | No     |
| `MINIO_ENDPOINT`      | api     | Yes      | No     |
| `MINIO_ACCESS_KEY`    | api     | Yes      | Yes    |
| `MINIO_SECRET_KEY`    | api     | Yes      | Yes    |
| `NEXT_PUBLIC_API_URL` | web     | Yes      | No     |
| `NEXT_PUBLIC_WS_URL`  | web     | Yes      | No     |
| `JWT_SECRET`          | api     | v1       | Yes    |

---

## CI/CD Pipeline

```mermaid
flowchart LR
    PUSH[Git Push] --> LINT[Lint + Type Check]
    LINT --> TEST[Unit Tests]
    TEST --> BUILD[Docker Build]
    BUILD --> PUSH_R[Push to Registry]
    PUSH_R --> DEPLOY_S[Deploy Staging]
    DEPLOY_S --> E2E[E2E Tests]
    E2E --> DEPLOY_P[Deploy Production]
```

### Pipeline Stages

| Stage             | Tools                      | Gate                       |
| ----------------- | -------------------------- | -------------------------- |
| Lint              | ESLint, Prettier, tsc      | Zero errors                |
| Unit test         | Jest (api), Vitest (web)   | > 80% coverage on services |
| Build             | Docker multi-stage         | Image < 500 MB             |
| Integration test  | Supertest + testcontainers | All pass                   |
| Deploy staging    | Coolify webhook            | Manual approval            |
| E2E test          | Playwright                 | Critical paths pass        |
| Deploy production | Coolify webhook            | Manual approval            |

### Docker Multi-Stage Build

```dockerfile
# Conceptual api Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

---

## Monitoring

### Prometheus Metrics

| Metric                             | Type      | Source                     |
| ---------------------------------- | --------- | -------------------------- |
| `http_requests_total`              | Counter   | API (per endpoint, status) |
| `http_request_duration_seconds`    | Histogram | API                        |
| `ws_connections_active`            | Gauge     | WebSocket gateway          |
| `ws_messages_total`                | Counter   | WebSocket gateway          |
| `agent_dialogue_duration_seconds`  | Histogram | Agent orchestrator         |
| `agent_dialogue_tokens_total`      | Counter   | Model router               |
| `inference_cost_usd`               | Counter   | Model router               |
| `simulation_tick_duration_seconds` | Histogram | Simulation engine          |
| `db_query_duration_seconds`        | Histogram | Prisma                     |
| `client_fps`                       | Histogram | Frontend (reported)        |

### Grafana Dashboards

| Dashboard          | Panels                                      |
| ------------------ | ------------------------------------------- |
| System Overview    | CPU, memory, disk, network                  |
| API Performance    | Request rate, latency P50/P95/P99, errors   |
| WebSocket Health   | Connections, messages/sec, latency          |
| AI Operations      | Inference count, token usage, cost, latency |
| Agent Activity     | Active agents, dialogues, tool calls        |
| World Simulation   | Tick duration, events, world state          |
| Client Performance | FPS distribution, scene load times          |

### Alerting Rules

| Alert               | Condition                   | Severity |
| ------------------- | --------------------------- | -------- |
| API down            | `up{job="api"} == 0` for 1m | Critical |
| High error rate     | 5xx > 5% for 5m             | Critical |
| WS connections drop | > 50% drop in 5m            | Warning  |
| Inference latency   | P95 > 10s for 5m            | Warning  |
| Disk space          | < 20% free                  | Warning  |
| DB connections      | > 80% pool for 5m           | Warning  |

---

## Scaling Path

| Phase  | Users   | Infrastructure                                   |
| ------ | ------- | ------------------------------------------------ |
| MVP    | 50      | Single Coolify node, all containers              |
| v1     | 1,000   | Separate API and DB hosts                        |
| v2     | 10,000  | API farm (3+ nodes), Redis cluster, read replica |
| Future | 100,000 | Kubernetes, sharded DB, GPU cluster              |

---

## Backup Strategy

| Data               | Method                  | Schedule                    | Retention |
| ------------------ | ----------------------- | --------------------------- | --------- |
| PostgreSQL         | pg_dump + WAL           | Daily full + continuous WAL | 30 days   |
| Redis              | RDB snapshot            | Hourly                      | 24 hours  |
| MinIO assets       | Bucket replication      | On upload                   | 90 days   |
| Grafana dashboards | Git version control     | On change                   | Forever   |
| Environment config | Coolify encrypted store | On change                   | Forever   |

---

## Constraints

1. **Docker-only deployment** — No bare-metal installs
2. **Coolify for orchestration** — No Kubernetes at MVP
3. **Single region** — No multi-region at MVP
4. **HTTPS required** — Coolify handles TLS via Let's Encrypt
5. **No secrets in git** — Environment variables only
6. **Database migrations run on deploy** — `prisma migrate deploy` in entrypoint

---

## Future Considerations

- Kubernetes migration for v2 scale
- Multi-region deployment with geographic routing
- CDN for 3D assets (Cloudflare R2 or AWS CloudFront)
- Dedicated GPU nodes for Ollama and training
- Log aggregation with Loki + Grafana
- Distributed tracing with Jaeger
- Blue-green deployments
- Infrastructure as Code (Terraform/Pulumi)

---

## Technical Decisions

| Decision               | Rationale                      | Tradeoff             |
| ---------------------- | ------------------------------ | -------------------- |
| Coolify over K8s       | Simpler ops for small team     | Scale ceiling        |
| Docker Compose for dev | Fast local setup               | Dev/prod parity gaps |
| Prometheus + Grafana   | Industry standard, self-hosted | Operational overhead |
| pgvector image         | Vector support out of box      | Larger image         |
| Ollama sidecar         | Local fallback, no API cost    | GPU requirement      |

---

## Implementation Guidance

1. Create `docker-compose.yml` in project root
2. Create multi-stage Dockerfiles in `apps/web` and `apps/api`
3. Configure Coolify project with environment variables
4. Set up Prometheus scrape config for API metrics endpoint
5. Import Grafana dashboards from `infra/grafana/dashboards/`
6. Add health check endpoints: `GET /health` and `GET /ready`
7. Configure Coolify auto-deploy on push to `main`
8. Document local dev setup in project README (not docs — per user rules)
