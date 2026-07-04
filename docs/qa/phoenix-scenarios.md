# Phoenix QA Scenarios — Realtime & Agent Dialogue

> Gherkin scenarios for Phoenix epic validation. Run against local stack:
> `docker compose --env-file .env -f infra/docker-compose.yml up --build`

---

## Feature: Open agent dialogue

```gherkin
Scenario: Visitor opens dialogue for a selected agent
  Given the visitor is at agent scale with agent "agent-sigma-7" selected
  When the visitor triggers openDialogue("agent-sigma-7")
  Then the dialogue panel is visible
  And the panel title shows the agent name
  And the public visibility warning is shown on first open

Scenario: Public warning is dismissed once per browser
  Given the visitor opens dialogue for the first time
  When the visitor clicks "I understand"
  Then the warning is hidden
  And localStorage key "ultron-dialogue-warning-seen" is set to "true"
  When the visitor closes and reopens dialogue
  Then the warning is not shown again
```

---

## Feature: Send message and stream response

```gherkin
Scenario: Visitor sends a message over WebSocket
  Given the WebSocket gateway is reachable at "/ws"
  And dialogue is open for a valid seeded agent id
  When the visitor sends "What is the current threat level?"
  Then a user message appears in the dialogue panel
  And assistant tokens stream into an agent message bubble
  And the stream completes with done=true

Scenario: Stub response when Ollama is unavailable
  Given OLLAMA_BASE_URL is not configured
  When the visitor sends any message
  Then the assistant response mentions stub mode
  And the response references the visitor message text

Scenario: Ollama response when configured
  Given OLLAMA_BASE_URL points to a running Ollama instance
  When the visitor sends a message
  Then tokens stream from the configured model
  And the dialogue completes without error
```

---

## Feature: Transport fallback

```gherkin
Scenario: SSE fallback when WebSocket is unavailable
  Given the WebSocket connection cannot be established
  When the visitor sends a message
  Then the client POSTs to "/api/v1/agents/:id/dialogue" with Accept "text/event-stream"
  And token events append to the agent message
  And a done event closes the stream
```

---

## Feature: Error handling

```gherkin
Scenario: Invalid agent id
  Given dialogue is open for agent id "00000000-0000-0000-0000-000000000099"
  When the visitor sends a message
  Then the API returns 404 Not Found
  And the dialogue panel shows an error state

Scenario: WebSocket disconnect during stream
  Given a dialogue stream is in progress
  When the WebSocket connection drops
  Then the client schedules exponential backoff reconnect
  And partial streamed text remains visible
  And the visitor may retry sending after reconnect

Scenario: Rate limit exceeded
  Given the visitor sends more than 120 WS dialogue messages in one minute
  When the next message is sent
  Then the server responds with 429 Too Many Requests
  And the dialogue panel shows a rate limit error
```

---

## Feature: Mobile layout

```gherkin
Scenario: Bottom sheet on narrow viewports
  Given the viewport width is below 768px
  When dialogue is open
  Then the panel anchors to the bottom of the canvas
  And max height is constrained to 70vh
  And the panel is not a centered modal
```

---

## Nexus integration handoff

```gherkin
Scenario: Nexus wires Talk button (owned by Nexus team)
  Given RightSidebar renders a Talk action for talkable agents
  When the visitor clicks Talk
  Then Nexus calls openDialogue(agentId) from "@/lib/open-dialogue"
  And Phoenix dialogue panel opens without Phoenix editing RightSidebar
```

---

## QA re-audit (2026-06-16)

### Verified shipped (Phoenix Dev)

| Area          | Implementation                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------- |
| API realtime  | `apps/api/src/modules/realtime/` — `WorldGateway`, `DialogueService`, `AgentsDialogueController`   |
| AI layer      | `ModelRouterService` (stub when no `OLLAMA_BASE_URL`, Ollama fallback), `AgentOrchestratorService` |
| REST          | `POST /api/v1/agents/:id/dialogue` — JSON `{ sessionId, agentId }` or SSE stream                   |
| WS            | `/ws` — `ping`/`pong`, `agent:dialogue`, `agent:status` (thinking → idle)                          |
| Web           | `useAgentDialogue`, `AgentDialogueSocket`, SSE fallback, full `DialoguePanel`, `agentStore`        |
| uiStore       | `openDialogue` / `closeDialogue` / `dialogueAgentId`                                               |
| Nexus handoff | `RightSidebar` Talk → `getAgentUuid` + `openDialogue` ✅                                           |
| Unit tests    | 3 specs under `apps/api/test/phoenix/`                                                             |

### Open gaps (QA → Dev)

| ID  | Gap                                                                    | Severity          |
| --- | ---------------------------------------------------------------------- | ----------------- |
| G9  | Jest config duplicate `roots` -> `apps/test` missing; `npm test` fails | **Blocker (CI)**  |
| G8  | No Vitest/Playwright in `apps/web`                                     | **Blocker (E2E)** |
| G11 | No `toolCall` in stream or UI cards                                    | Medium            |
| G12 | Agent double-click → dialogue not wired in `AgentScene`                | Medium            |
| G14 | No WS integration tests yet                                            | Medium            |
| G17 | Rate limit — server 429, no dedicated client copy                      | Low               |

### Scenario status vs implementation

| Scenario                       | Status                                                  |
| ------------------------------ | ------------------------------------------------------- |
| Open dialogue + public warning | ✅ Ready (manual / E2E when G8)                         |
| WS streaming + stub mode       | ✅ Ready                                                |
| SSE fallback                   | ✅ Ready (client auto-falls back when WS not connected) |
| Ollama when configured         | ✅ Ready (env-gated)                                    |
| Talk via Nexus                 | ✅ Done                                                 |
| Double-click agent             | ❌ G12                                                  |
| Tool call cards                | ❌ G11                                                  |
| Rate limit UX                  | ⚠️ Partial (error only)                                 |
