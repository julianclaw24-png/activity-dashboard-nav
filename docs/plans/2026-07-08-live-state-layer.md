# IDIOMEX OS Live State Layer Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make IDIOMEX OS feel alive by reflecting changes as work happens, not only when the static JSON is manually read.

**Architecture:** Keep the static-site model, but add a lightweight live layer in `assets/app.js`: auto-refresh the JSON, persist browser-local activity, and render freshness/status signals everywhere. This avoids introducing a backend while making the OS visibly reactive.

**Tech Stack:** Static HTML, vanilla JS, localStorage, JSON, CSS, GitHub Pages.

---

## Current state snapshot
- The app is still fundamentally JSON-backed and static.
- Tasks already persist browser-locally via `localStorage`.
- Recent activity exists in JSON, but it does not react much to what Navod does in the UI.
- There is no always-visible sync/freshness layer.

## What is still missing
- A visible "live" signal.
- Auto-refresh from the latest JSON without manual reload.
- A local activity journal that reacts to task movement.
- Cross-tab sync of browser-local updates.

## Final product vision
- When Navod changes task state, the OS immediately reflects it.
- When the JSON changes, the OS pulls it in automatically.
- The dashboard shows when it last synced and what just happened.

## Above-the-fold essentials
1. Last synced / freshness
2. Auto-refresh status
3. Local recent actions
4. Main operating view per page

## Secondary sections worth keeping
- Existing recent activity timeline
- CEO movement / changes since yesterday
- Task board interactions

## Sections to hide, collapse, or move deeper
- None for this phase; focus is behavior, not more layout change.

## Anti-goals
- Do not add a backend yet.
- Do not create fake real-time networking.
- Do not bloat the UI with debug-heavy controls.

## Task 1: Add live-state primitives
**Objective:** Introduce local live state, refresh timing, and persistence helpers.

**Files:**
- Modify: `assets/app.js`

## Task 2: Add auto-refresh + cross-tab sync
**Objective:** Re-fetch JSON on a timer and respond to browser storage changes.

**Files:**
- Modify: `assets/app.js`

## Task 3: Add live activity journal
**Objective:** Log task movements and recent local actions so the timeline changes immediately.

**Files:**
- Modify: `assets/app.js`

## Task 4: Add live status UI
**Objective:** Render a compact live-status bar and freshness indicators.

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`

## Task 5: Verify + publish
**Objective:** Prove the live layer works locally and on the public site.

**Files:**
- Modify: repo state via git

## Done now vs still to do
- Done now: feature plan.
- Still to do: implementation, verification, publish.

## Priority order recommendation
1. Persistence helpers
2. Auto-refresh
3. Local action logging
4. UI polish
5. Verification + deploy
