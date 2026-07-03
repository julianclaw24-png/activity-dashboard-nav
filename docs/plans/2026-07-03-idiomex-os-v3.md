# IDIOMEX OS V3 Implementation Plan

> **For Hermes:** Use this plan to keep V3 focused on decision-making, not reporting.

**Goal:** Turn the current report-like V2 dashboard into a cockpit-first CEO operating system where the first screen tells Navod what deserves attention immediately.

**Architecture:** Keep the app as a static HTML + JSON artifact, but restructure the homepage into three layers: (1) CEO cockpit above the fold, (2) compact operational summaries below, and (3) deeper detail views as dedicated sections/pages. V3 should compress text into metrics, statuses, and actions.

**Tech Stack:** Single-file static HTML/CSS/JS (`index.html`) + structured dashboard data (`data/idiomex-os.json`) + GitHub Pages.

---

## Product direction

### Core V3 principles
1. The first screen must answer: **what needs my attention right now?**
2. Every top-level component should be **decision-first** and **scan-first**.
3. Long narrative paragraphs should be replaced with:
   - metrics
   - badges
   - status signals
   - rows
   - compact cards
4. Dashboard != database view. Deep detail moves down-page or to separate views.
5. AI agents are a first-class operating surface, not a side feature.

### New information architecture
- **Layer 1 — CEO Cockpit**
  - business health header
  - today’s main goal
  - one-row KPI cockpit
  - today’s decisions
  - AI workforce health
  - urgent notifications
- **Layer 2 — Operational Dashboard**
  - compact CRM summary
  - project timelines
  - task summary
  - automation/workflow summary
- **Layer 3 — Detail Surfaces**
  - CRM details
  - project details
  - kanban board
  - knowledge / documents / finance / reports

---

## Phase 1 — Cockpit-first homepage (implement now)

**Files:**
- Modify: `index.html`
- Modify: `data/idiomex-os.json`

### Task 1: Replace the current welcome area with a command header
**Objective:** Make the first visible block feel like an operating system, not a generic dashboard.

**Implement:**
- Replace “Welcome back” copy with:
  - workspace title
  - today’s date
  - business health %
  - momentum
  - one primary goal
- Keep search and actions, but make search more OS-like (`Search anything...`).

### Task 2: Convert KPI cards into a cockpit metrics row
**Objective:** Make business health scannable in one glance.

**Implement:**
- First row metrics should include:
  - revenue pipeline
  - leads ready
  - projects active / attention needed
  - AI agents running / warning count
  - today’s tasks / high priority count
- Update JSON contract to support compact metric cards with primary + secondary signal.

### Task 3: Add a real Decision Centre
**Objective:** Surface the exact decisions/actions for today.

**Implement:**
- Add `decision_centre` to JSON.
- Render compact priority decisions with severity colors.
- Each row should show:
  - urgency
  - action title
  - expected value or impact
  - next move

### Task 4: Split AI workforce from generic automation
**Objective:** Let Navod instantly see if agents are healthy.

**Implement:**
- Add `ai_workforce` section to JSON.
- Render a compact workforce panel for:
  - CEO Agent
  - Lead Hunter
  - Research Agent
  - Outreach Agent
  - Backup / accounting / ops agents
- Show healthy / waiting / warning / error states.

### Task 5: Replace recent activity with notifications
**Objective:** Shift from passive history to actionable alerts.

**Implement:**
- Rename `activity` to a notifications-oriented surface in the UI.
- Add notification severity and type in JSON.
- Show compact rows like:
  - lead replied
  - proposal accepted
  - agent warning
  - invoice overdue

### Task 6: Compress the dashboard below the fold
**Objective:** Keep the homepage useful while removing the report feel.

**Implement:**
- Make CRM more table-like / row-like.
- Make projects read like progress timelines.
- Reduce kanban prominence; show only summary counts on dashboard.
- Keep deeper execution sections below the fold for now.

---

## Phase 2 — Operational surface redesign

**Files:**
- Modify: `index.html`
- Modify: `data/idiomex-os.json`
- Optional create later: `crm.html`, `agents.html`, `finance.html`

### Deliverables
- HubSpot-style CRM rows
- project timeline cards with milestone + ETA
- task summary with filters
- compact kanban summary instead of full dashboard board
- better sidebar grouping:
  - HOME
  - TODAY
  - SALES
  - OPERATIONS
  - AUTOMATION
  - ANALYTICS

---

## Phase 3 — Premium OS features

### Deliverables
- command palette (`Ctrl+K`)
- floating global quick action button
- AI assistant dock
- dedicated AI workforce page
- dedicated knowledge base page
- dedicated finance/reporting view

---

## JSON schema changes for V3

Extend `data/idiomex-os.json` with:
- `command_header`
  - `day_label`
  - `date_label`
  - `business_health`
  - `momentum`
  - `primary_goal`
  - `recommended_after`
- `cockpit_metrics[]`
  - `label`
  - `value`
  - `delta`
  - `subvalue`
  - `tone`
- `decision_centre[]`
  - `priority`
  - `title`
  - `impact`
  - `next_action`
  - `eta`
- `ai_workforce[]`
  - `name`
  - `status`
  - `mode`
  - `note`
- `notifications[]`
  - `type`
  - `severity`
  - `title`
  - `detail`
  - `time`

---

## Verification checklist

- [ ] First screen shows health, priorities, and decisions without scrolling much
- [ ] Search placeholder updated to `Search anything...`
- [ ] Decision Centre visible above the fold
- [ ] AI workforce status visible above the fold
- [ ] Notifications replace passive recent activity framing
- [ ] Local HTML returns HTTP 200
- [ ] Public GitHub Pages URL returns HTTP 200

---

## Implementation note

Start with **Phase 1 only** in this iteration. Get the cockpit right before adding command palette, quick actions, or extra pages.

## Phase 3.1 — Command layer shipped

**Delivered in this iteration**
- floating global quick action button
- command palette (`Ctrl+K`)
- persistent AI assistant dock
- quick-action shortcuts wired to search, rooms, and guide access

**Implementation notes**
- `index.html` now includes a modal command palette, floating quick-action tray, and docked assistant surface.
- `data/idiomex-os.json` now includes `quick_actions`, `quick_actions_summary`, and `assistant_dock` so the premium command layer stays data-driven.
- Verification should confirm the command-layer markers render in static HTML and that extracted inline JavaScript still passes `node --check`.


## Phase 4 — Dedicated rooms

**Delivered in this iteration**
- dedicated CRM room
- dedicated AI Workforce room
- dedicated Knowledge Vault
- dedicated Finance & Reporting room

**Implementation notes**
- `index.html` now adds deeper room surfaces below the homepage cockpit so the app can go deep without making the first screen feel like a long report again.
- `data/idiomex-os.json` now includes `crm_room`, `workforce_room`, `knowledge_room`, and `finance_room` objects to keep the new rooms data-driven.
- Navigation and quick actions should point into these deeper rooms so the command layer and the information architecture stay aligned.
