# IDIOMEX OS Leads Page Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a dedicated leads page to IDIOMEX OS that acts like a lead memory / dossier surface, so Navod can see the important context for each lead in one place.

**Architecture:** Keep `sales.html` as the higher-level pipeline/opportunity view, and add a new `leads.html` page for richer per-lead detail. Extend the existing `lead_pipeline.leads` JSON objects with optional dossier fields instead of creating a second disconnected data model.

**Tech Stack:** Static HTML, vanilla JS, JSON, CSS, GitHub Pages.

---

## Current state snapshot
- `sales.html` exists and shows top opportunities in a compact pipeline table.
- Lead data already exists in `data/idiomex-os.json` under `lead_pipeline.leads`.
- The current lead objects are useful but too shallow for “everything I need to know”.

## What is still missing
- A dedicated lead intelligence page.
- Richer fields per lead.
- A clean way to scan a lead’s status, next move, blockers, fit, and notes.

## Final product vision
- Sales page = compact pipeline summary.
- Leads page = working CRM memory page.
- Each lead card answers: who they are, why they matter, what is blocking, and what happens next.

## Task 1: Add the route and navigation
**Objective:** Create a new page shell and expose it in navigation.

**Files:**
- Create: `leads.html`
- Modify: `assets/app.js`

## Task 2: Expand lead data
**Objective:** Enrich current lead objects with dossier-style fields.

**Files:**
- Modify: `data/idiomex-os.json`

## Task 3: Render the new leads page
**Objective:** Add stats + rich lead cards.

**Files:**
- Modify: `assets/app.js`

## Task 4: Add page-specific styling
**Objective:** Make lead cards readable and scan-friendly on desktop and mobile.

**Files:**
- Modify: `assets/styles.css`

## Task 5: Verify and publish
**Objective:** Confirm the route, render logic, and JSON all deploy correctly.

**Files:**
- Modify: repo state via git
