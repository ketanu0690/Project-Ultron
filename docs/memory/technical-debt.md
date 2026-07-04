# Technical Debt

> **Cursor Memory File** — Known shortcuts and debt to address.

---

## Anticipated Debt (Pre-Implementation)

| Item                                         | Reason             | Address By            |
| -------------------------------------------- | ------------------ | --------------------- |
| Instant cuts instead of animated transitions | MVP scope saving   | v1                    |
| Single PostgreSQL instance                   | MVP infrastructure | v1 (read replica)     |
| No authentication                            | MVP scope saving   | v1                    |
| Timeline memory instead of graph             | MVP scope saving   | v2                    |
| 50 agents hardcoded in seed                  | MVP scale          | v1 (dynamic spawning) |
| No automated E2E tests                       | MVP velocity       | v1                    |
| Single API node                              | MVP infrastructure | v2 (API farm)         |
| No CDN for 3D assets                         | MVP infrastructure | v1                    |
| Ollama single GPU                            | MVP infrastructure | v2 (GPU cluster)      |
| No log aggregation                           | MVP infrastructure | v2 (Loki)             |

## Documentation Debt

| Item                        | Status                  |
| --------------------------- | ----------------------- |
| API OpenAPI spec            | Not yet generated       |
| Prisma schema diagram       | Awaiting implementation |
| Storybook for UI components | Awaiting implementation |
| Load test results           | Awaiting implementation |

## Resolved Debt

_None yet — project pre-implementation._

---

_Add items as shortcuts are taken during development._
