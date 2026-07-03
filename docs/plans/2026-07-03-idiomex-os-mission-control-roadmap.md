# IDIOMEX OS Mission Control Roadmap

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn IDIOMEX OS from a strong static dashboard prototype into the operating system that runs an AI-first service business.

**Architecture:** Keep the product opinionated around how IDIOMEX actually works: Mission Control on the homepage, business-specific rooms below it, and AI-generated recommendations as the primary interface. Build in layers: first sharpen the operating model and interaction design, then add persistent data, then connect live agents and automations so the system behaves like a business partner instead of a UI shell.

**Tech Stack:** Static `index.html` + structured `data/idiomex-os.json` + GitHub Pages / public hosting today, with a future backend sync layer (likely Supabase) when the OS graduates from browser-local state to persistent multi-session operations.

---

## Product thesis

IDIOMEX OS should not compete with ClickUp, Monday, Notion, or Linear.

It should be positioned as:

**“The operating system that runs AI-first service businesses.”**

That means:
- not a generic dashboard
- not a task manager with extra branding
- not a chatbot floating beside normal software
- a business operating layer that thinks, prioritizes, and recommends action

The homepage should feel like **Mission Control**, not analytics.
The AI should behave like a **business partner / COO layer**, not a support bot.
The deeper rooms should reflect how IDIOMEX actually runs:
- Opportunities
- Products
- Installations
- AI Workforce
- Knowledge
- Intelligence
- Finance

---

## Current state snapshot

This is what is already done in the live prototype.

### Foundation already completed
- Reframed the product from a generic dashboard into **IDIOMEX Mission Control**
- Updated the workspace subtitle to **“The operating system that runs AI-first service businesses.”**
- Added a decision-first command header with:
  - business status
  - momentum
  - primary goal
  - recommendation framing
- Added a **Decision Centre** that tells Navod what to do next
- Added compact cockpit metrics for health, pipeline, AI workforce, momentum, and current priority
- Reworked the business flow around:
  - Idea
  - Opportunity
  - Proposal
  - Installation
  - Client
  - Recurring Revenue
- Added dedicated business-specific rooms instead of generic sections:
  - CRM room
  - AI Workforce room
  - Knowledge Vault
  - Finance & Reporting
- Added the command layer:
  - command palette
  - floating quick actions
  - assistant dock
- Added a **Company Brain** surface and recommendation framing
- Added mobile refinement work:
  - collapsible sections
  - room accordions
  - compact assistant sheet
  - cleaner mobile spacing / control layering
- Verified public access via hosted URL

### Business model already visible in the data layer
The current data model already reflects the right direction:
- opportunities instead of plain CRM language
- products instead of generic services
- installations instead of generic projects
- AI workforce as a first-class module
- company brain / intelligence direction already seeded

### What is still missing
The prototype is conceptually strong, but it is still mostly a **presentation layer**.
What is missing is the operating depth that makes it truly useful every day:
- real action-taking, not just display
- persistent shared data beyond browser-local state
- live agent outputs feeding the OS automatically
- a stronger morning-brief / company-brain workflow
- cleaner distinction between homepage intelligence and room-level execution
- production-grade hosted behavior

---

## Final product vision

The finished OS should answer, within seconds:
- What matters most right now?
- What should be ignored?
- What is blocked?
- Which opportunity is the fastest route to cash?
- Which installation is at risk?
- Which agent needs intervention?
- What changed since yesterday?
- What should be built, delegated, paused, or dropped?

### Desired homepage behavior
Mission Control should open with:
- company health
- today’s focus
- one clear recommended action
- AI-generated prioritization
- key changes since yesterday
- the shortest path to progress and cash

### Desired emotional feel
- calm
- high-signal
- sparse
- serious
- operational
- “NASA for a small AI-first business”

### What it should never become
- card soup
- generic productivity software
- a kanban-first app
- a report wall
- a chatbot bolted onto admin panels

---

## Business operating model to design around

All future work should align to these business entities.

### 1) Opportunities
Use opportunity thinking, not generic CRM thinking.

Each opportunity should have:
- lead / company
- offer fit
- score
- expected value
- probability
- source
- urgency
- next step
- owner
- deadline
- proposal state

### 2) Products
IDIOMEX sells installable business systems, not vague services.

Each product should have:
- product name
- revenue potential
- ideal client type
- template / delivery model
- proposal asset
- ROI framing
- documentation
- automation coverage

### 3) Installations
Treat client delivery as a business installation workflow.

Each installation should have:
- client
- product
- stage
- knowledge status
- testing status
- training status
- deployment status
- monitoring status
- blockers
- next milestone
- template extraction value

### 4) AI Workforce
Agents are part of the operating system, not a side widget.

Each agent should expose:
- role
- health
- current job
- last report
- memory health
- cost
- performance
- blocked / waiting / online state
- recommended intervention

### 5) Knowledge
Knowledge is reusable business infrastructure.

Knowledge should include:
- templates
- playbooks
- prompts
- SOUL files
- proposals
- guides
- client docs
- case studies
- lessons learned

### 6) Intelligence
Intelligence replaces passive reporting.

The OS should continuously answer:
- what changed today?
- what opportunity appeared?
- who replied?
- what agent improved or failed?
- what deserves focus?
- what should stop?

---

## Delivery roadmap

## Phase 5 — Operating actions layer

**Outcome:** Turn the prototype from “good to look at” into “useful to operate.”

### What this phase should achieve
- homepage recommendations become actionable, not just informative
- opportunity, installation, and agent items can trigger quick workflows
- the OS starts feeling like a control surface instead of a report

### Build in this phase
1. **Mission Control action rail**
   - add a single primary action block near the top
   - examples:
     - Continue Cycle Matter
     - Send XYZ proposal
     - Review top 3 MTD opportunities
   - every recommendation should map to one explicit action

2. **Inline action states**
   - allow quick status changes for:
     - opportunities
     - installations
     - tasks
     - agent health follow-ups
   - use lightweight interactions, not heavy forms

3. **Homepage simplification pass**
   - reduce card density further
   - ensure the first screen is mostly:
     - status
     - focus
     - recommendation
     - what changed
   - move supporting detail lower or into rooms

4. **Opportunity command flow**
   - create a better top-opportunity shortlist workflow
   - explicitly show:
     - pursue now
     - queue later
     - ignore today

5. **Installation command flow**
   - make installations read like executable client rollouts
   - expose blockers, next step, and template extraction value more clearly

6. **Company Brain morning brief v1**
   - morning brief should summarize:
     - yesterday’s changes
     - today’s focus
     - revenue opportunities
     - execution risks
     - what to ignore

### Definition of done
- Mission Control tells Navod what to do next in one screen
- top recommendations have explicit action affordances
- opportunities and installations feel like operating objects, not static cards
- homepage becomes cleaner, calmer, and more decisive

---

## Phase 6 — Persistent data + real operating memory

**Outcome:** Move from browser-local prototype to a real business system.

### What this phase should achieve
- data persists across devices and sessions
- the public URL is not just viewable anywhere, but operational anywhere
- the OS becomes a stable daily workspace

### Build in this phase
1. **Backend selection and schema**
   - introduce Supabase or equivalent backend
   - define schema for:
     - opportunities
     - products
     - installations
     - agent reports
     - knowledge items
     - daily intelligence events

2. **Sync layer**
   - replace browser-local-only edits with persistent writes
   - keep the static-feel UX, but back it with real storage

3. **Event model**
   - store important operating events such as:
     - agent discoveries
     - lead replies
     - proposal sent
     - install milestone reached
     - backup completed

4. **Daily briefing persistence**
   - store the generated morning brief and important recommendations
   - make it possible to compare today vs yesterday

5. **Basic authentication / access control**
   - simple owner-first auth
   - keep it light; avoid enterprise overhead

### Definition of done
- data edits survive refresh, browser changes, and new devices
- opportunities / installations / intelligence are stored as real records
- hosted Mission Control becomes reliable for daily use

---

## Phase 7 — Agent-native operating system

**Outcome:** The AI workforce becomes the engine of the OS, not just something reported on.

### What this phase should achieve
- agents feed recommendations into the OS automatically
- the OS synthesizes activity into decisions
- Mission Control behaves like a business partner / COO layer

### Build in this phase
1. **Agent report ingestion**
   - connect research, lead, CEO, and ops agents into the data model
   - each agent should write structured output, not free-form noise

2. **Recommendation engine**
   - rank opportunities by leverage, expected cash, speed, and confidence
   - rank installations by blocker severity and template value
   - rank actions by business importance

3. **Attention protection logic**
   - explicitly tell Navod what to ignore today
   - suppress low-value noise
   - elevate only the few items that deserve intervention

4. **Agent intervention layer**
   - if an agent is blocked, stale, or degraded, Mission Control should say exactly what to do

5. **Company Brain v2**
   - transform raw events into:
     - what changed
     - what matters
     - what to do now
     - what can wait
     - what likely makes money fastest

### Definition of done
- agent outputs update the OS automatically
- the OS produces meaningful prioritization without manual curation every time
- Navod can trust Mission Control to narrow attention and suggest next moves

---

## Phase 8 — Production polish + productization

**Outcome:** Refine IDIOMEX OS into something stable enough to rely on daily and potentially reuse as a product template.

### What this phase should achieve
- smooth operational UX
- stronger public-hosted reliability
- cleaner product identity
- reuse potential for future client installs

### Build in this phase
1. **UX polish**
   - animation restraint
   - cleaner transitions
   - stronger typography hierarchy
   - more native-feeling mobile flows

2. **Deployment hardening**
   - stable hosted route
   - health checks
   - version markers
   - safe update flow

3. **Template extraction**
   - identify what parts of the OS are reusable for future businesses
   - separate core engine from client-specific data and language

4. **Product narrative**
   - document positioning and product copy:
     - AI-first service business OS
     - Mission Control
     - Company Brain
     - AI Workforce

5. **Selective automation hooks**
   - trigger proposal reminders
   - installation milestone reminders
   - agent degradation alerts
   - morning brief generation

### Definition of done
- the OS feels stable, coherent, and daily-usable
- it is clearly differentiated from generic PM software
- parts of it can be reused or sold as a system pattern later

---

## What is done vs what remains

## Done now
- Mission Control direction established
- AI-first business OS positioning established
- rooms-based information architecture established
- command layer established
- company-brain framing established
- mobile refinement pass completed
- live hosted access available

## Still to do
- stronger homepage simplification
- action-first operating workflows
- persistent backend sync
- automatic agent-to-OS ingestion
- recommendation logic / prioritization engine
- production-grade reliability
- template/product extraction

---

## Priority order recommendation

If the goal is maximum practical value fastest, the next order should be:

1. **Phase 5** — make Mission Control operational
2. **Phase 6** — add persistence so the OS is real
3. **Phase 7** — connect live agents and decision intelligence
4. **Phase 8** — polish, harden, and extract product value

This order matters because:
- polishing before actionability is premature
- agent intelligence before persistence becomes fragile
- backend before operating model clarity risks building the wrong system

---

## Explicit anti-goals

Do **not** optimize toward:
- building a generic kanban-first app
- copying SaaS patterns because they feel familiar
- adding lots of charts for visual density
- making every room equally prominent
- overcomplicating auth, teams, or enterprise settings too early
- treating AI as a sidebar assistant instead of the operating layer

---

## Recommended next implementation brief

The next build brief should be:

**Phase 5 — Make Mission Control actionable**

### Exact objective
When Navod opens the OS, the first screen should:
- show what matters
- show what to ignore
- show one main action
- allow immediate progress without hunting through rooms

### Files likely to modify
- `index.html`
- `data/idiomex-os.json`
- `docs/plans/2026-07-03-idiomex-os-v3.md` (optional update if folding this roadmap back into the delivery plan)

### Verification checklist
- homepage feels simpler, not busier
- primary recommendation is visually obvious
- at least one recommendation can be acted on immediately
- opportunities clearly separate now / later / ignore
- installations clearly show blocker + next step
- mobile layout still feels controlled
- local HTML returns HTTP 200
- hosted public URL returns HTTP 200

---

## Save note

This roadmap is intended to become the new strategic reference for IDIOMEX OS so future implementation phases stay aligned to the final product vision instead of drifting back toward generic dashboard software.
