# IDIOMEX OS Multipage Split Implementation Plan

> **For Hermes:** Use this plan to turn the single long dashboard into a set of focused static pages.

**Goal:** Split IDIOMEX OS into simple, dedicated pages so Navod can focus on one operating area at a time instead of reading one dense homepage.

**Architecture:** Keep the app as a static HTML + JSON artifact, but replace the one-page layout with a shared shell (`assets/styles.css` + `assets/app.js`) and multiple focused HTML pages that all read from `data/idiomex-os.json`. Preserve lightweight local task state via `localStorage` so task movement still works on the tasks page and is reflected across pages.

**Tech Stack:** Static HTML/CSS/JS, shared JSON data contract, GitHub Pages.

---

## Current state snapshot
- The app is currently one long static page with many sections rendered from `data/idiomex-os.json`.
- The homepage already has a simplified summary, but the rest of the information is still trapped in one page.
- There is no page-level information architecture yet; focus requires scrolling and context-switching on the same screen.

## What is still missing
- Dedicated pages for attention, sales, projects, tasks, company brain, workforce, and systems.
- A shared simple navigation shell that works across all pages.
- A simplified homepage that acts as a launcher rather than a document.
- A clean shared renderer so the app is maintainable without duplicating logic in every HTML file.

## Final product vision
The finished OS should feel like a clean control center with one clear homepage and a small set of obvious pages. Each page should answer one question only: overview, what needs attention, sales, projects, tasks, company brain, workforce, or systems.

## Above-the-fold essentials
- Homepage: what’s going on, what needs doing, what is in progress, what has been done recently
- Persistent page navigation to focused pages
- Clear page title + one-sentence purpose per page

## Secondary sections worth keeping
- Company Brain insights
- AI Workforce details
- Systems/rooms data for knowledge, finance, products, inbox ops

## Sections to move off the homepage
- Full sales pipeline details
- Full projects list
- Full task queue
- Brain/recommendations/watchlist details
- Workforce details
- Systems/rooms details

## Phased roadmap
1. Build shared layout + renderer
2. Replace homepage with launcher-style overview
3. Create focused pages for each major operating area
4. Verify locally and publish live

## Done now vs still to do
- Done now: single-page app and JSON data model exist
- Still to do: multipage split, shared UI shell, verification, publish

## Priority order recommendation
1. Shared assets first
2. Homepage second
3. Focus pages next
4. Verification + publish last

## Anti-goals
- Do not add a backend
- Do not keep every old section visible on the homepage
- Do not create clever labels that reduce clarity

---

### Task 1: Create shared static assets

**Objective:** Centralize the shared layout, styling, and rendering logic for all pages.

**Files:**
- Create: `assets/styles.css`
- Create: `assets/app.js`

**Step 1:** Create shared CSS for shell, cards, lists, nav, and responsive layout.
**Step 2:** Create shared JS that fetches `data/idiomex-os.json`, merges local task state, and renders page-specific content based on `data-page`.
**Step 3:** Include helper functions for overview, attention, sales, projects, tasks, brain, workforce, and systems pages.
**Step 4:** Add task movement controls on the tasks page only.

### Task 2: Replace the homepage with a clean launcher

**Objective:** Turn `index.html` into a short overview + navigation page.

**Files:**
- Modify: `index.html`

**Step 1:** Replace the current long dashboard with a minimal shell.
**Step 2:** Keep summary cards for what’s going on / needs doing / in progress / done recently.
**Step 3:** Add page links so the homepage acts as the entry point to focused work.

### Task 3: Create focused operating pages

**Objective:** Give each major area its own dedicated page.

**Files:**
- Create: `attention.html`
- Create: `sales.html`
- Create: `projects.html`
- Create: `tasks.html`
- Create: `brain.html`
- Create: `workforce.html`
- Create: `systems.html`

**Step 1:** Add a shared shell to each page.
**Step 2:** Give each page one clear purpose and only the relevant sections.
**Step 3:** Wire each page to the shared renderer via `data-page`.

### Task 4: Verify and publish

**Objective:** Confirm the multipage OS works locally and publicly.

**Files:**
- Verify: `index.html`, all new `*.html`, `assets/styles.css`, `assets/app.js`, `data/idiomex-os.json`

**Step 1:** Run JSON validation on `data/idiomex-os.json`.
**Step 2:** Run `node --check` on `assets/app.js`.
**Step 3:** Serve locally and confirm each page returns HTTP 200.
**Step 4:** Confirm key page markers exist in fetched HTML.
**Step 5:** Publish and verify the public URL and at least one child page.

---

## Verification checklist
- [ ] Homepage is short and scan-first
- [ ] Sales, projects, tasks, brain, workforce, and systems each have their own page
- [ ] Navigation works across pages
- [ ] JS syntax passes `node --check`
- [ ] JSON passes validation
- [ ] Local HTTP returns 200 for homepage and child pages
- [ ] Public site returns 200 for homepage and child pages
- [ ] Public HTML markers confirm the new multipage layout is live
