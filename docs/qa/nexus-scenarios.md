# Nexus QA Scenarios

> Gherkin-style acceptance scenarios for World Data Layer & UI Shell Integration.

---

## Feature: API readiness

### Scenario: Database readiness check

- **Given** the API is running with a connected PostgreSQL database
- **When** the client calls `GET /api/v1/ready`
- **Then** the response status is 200
- **And** the envelope `data.status` is `ready`
- **And** `data.checks.database` is `ok`

### Scenario: Liveness unchanged

- **Given** the API is running
- **When** the client calls `GET /api/v1/health`
- **Then** the response status is 200
- **And** `data.status` is `ok`

---

## Feature: World data hydration

### Scenario: Districts load from API

- **Given** seed data is applied
- **When** the web app mounts `useWorldSync`
- **Then** `worldStore.isHydrated` becomes true
- **And** Reasoning District appears in `worldStore.districts`

### Scenario: Entity detail from API

- **Given** world data is hydrated
- **When** the user selects `building-planning-tower`
- **Then** the RightSidebar shows Planning Tower from API data
- **And** metrics reflect seed utilization values

---

## Feature: Breadcrumb navigation

### Scenario: Breadcrumbs reflect agent path

- **Given** the user navigates to agent `agent-sigma-7`
- **When** the navigation API responds
- **Then** breadcrumbs show Megacity → Reasoning → Planning Tower → Strategy Room → Analyst Sigma-7

### Scenario: Breadcrumb ascend

- **Given** breadcrumbs are visible in the TopBar
- **When** the user clicks "Planning Tower"
- **Then** scale transitions to `building`
- **And** focus entity is `building-planning-tower`

---

## Feature: Left sidebar hierarchy

### Scenario: Toggle with Tab

- **Given** the shell is loaded
- **When** the user presses `Tab`
- **Then** the left sidebar opens with the megacity hierarchy tree

### Scenario: Tree navigation

- **Given** the left sidebar is open
- **When** the user clicks "Analyst Sigma-7"
- **Then** scale transitions to `agent`
- **And** focus entity is `agent-sigma-7`

---

## Feature: View Memory

### Scenario: Memory timeline from API

- **Given** the user has selected agent `agent-sigma-7`
- **When** they click **View Memory**
- **Then** scale transitions to `memory`
- **And** the RightSidebar shows a chronological memory list from `GET /api/v1/agents/agent-sigma-7/memory`

### Scenario: Expand memory entry

- **Given** the memory timeline is visible
- **When** the user clicks a memory row
- **Then** the full memory content expands inline

---

## Feature: Talk integration (Phoenix handoff)

### Scenario: Talk opens dialogue state

- **Given** the user has selected an agent
- **When** they click **Talk**
- **Then** `uiStore.dialogueOpen` is true
- **And** `uiStore.dialogueAgentId` is the agent UUID
- **And** Nexus does not render streaming dialogue content (Phoenix owns `DialoguePanel`)

---

## Feature: Keyboard shortcuts

### Scenario: Shortcuts overlay

- **Given** the shell is focused
- **When** the user presses `?`
- **Then** the shortcuts overlay appears

### Scenario: Escape deselects

- **Given** an entity is selected and the right sidebar is open
- **When** the user presses `Escape`
- **Then** focus is cleared and sidebars close

---

## Feature: Bottom HUD metrics

### Scenario: Megacity metrics from API

- **Given** world data is hydrated
- **When** the user is at megacity scale
- **Then** BottomHUD shows district count and total agents from API aggregates

---

## Feature: CI pipeline

### Scenario: Merge request validation

- **Given** a merge request is opened
- **When** GitLab CI runs
- **Then** lint, typecheck, API tests, and build stages complete successfully
