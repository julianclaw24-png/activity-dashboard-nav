# Phase 6 Mission Control Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Simplify the IDIOMEX OS homepage further, add a recent activity timeline, and strengthen the Daily CEO Briefing with clear changes-since-yesterday visibility.

**Architecture:** Keep the existing static HTML + shared `assets/app.js` + `data/idiomex-os.json` architecture. Update the overview renderer to become a tighter cockpit, extend the JSON contract with timeline/change-tracking fields, and add minimal CSS for new timeline/change cards.

**Tech Stack:** Static HTML, vanilla JS, JSON, CSS, GitHub Pages.

---

## Current state snapshot
- Multipage dashboard is live on GitHub Pages.
- Overview is cleaner than before, with hero only on homepage.
- Daily CEO Briefing page exists.
- Workforce page already has run history.
- Homepage still has more sections than needed for a fast first scan.
- CEO page does not yet explicitly answer “what changed since yesterday?”.

## What is still missing
- A brutally simple first-screen homepage.
- A dedicated recent activity timeline on the homepage.
- A CEO change-tracking block that surfaces movement since yesterday.

## Final product vision
- Homepage answers in seconds: what is happening, what needs doing, what is waiting, what got done.
- Timeline proves movement without opening multiple pages.
- CEO briefing feels more alive by showing what changed, not just static priorities.

## Above-the-fold essentials
1. What’s going on
2. What needs doing now
3. What’s waiting / blocked
4. What got done

## Secondary sections worth keeping
- Recent activity timeline
- Quick launcher into focused pages

## Sections to hide, collapse, or move deeper
- Weekly review summary on homepage
- Repetitive Today/Waiting/Done panels that duplicate top snapshot
- Extra overview summaries better suited to child pages

## Anti-goals
- Do not add more dense cards to the homepage.
- Do not introduce a backend.
- Do not remove deeper detail from child pages.

## Task 1: Save Phase 6 data contract updates
**Objective:** Extend JSON with recent activity and CEO change-tracking fields.

**Files:**
- Modify: `data/idiomex-os.json`

**Steps:**
1. Add `recent_activity` array with short timeline items.
2. Add `changes_since_yesterday` array under `daily_ceo_briefing`.
3. Refresh version/status/generated_at markers.

## Task 2: Compress homepage renderer
**Objective:** Refactor overview into a tighter cockpit.

**Files:**
- Modify: `assets/app.js`

**Steps:**
1. Replace redundant overview sections with four short summary cards.
2. Keep one dominant primary-action card.
3. Add recent activity timeline section below the snapshot.
4. Keep launcher links as the final homepage section.

## Task 3: Strengthen CEO page
**Objective:** Add “changes since yesterday” visibility.

**Files:**
- Modify: `assets/app.js`

**Steps:**
1. Read `daily_ceo_briefing.changes_since_yesterday`.
2. Render a dedicated panel on the CEO page.
3. Keep existing decisions, risks, wins, and next checks intact.

## Task 4: Add CSS for timeline + compact cockpit cards
**Objective:** Style new sections without increasing visual noise.

**Files:**
- Modify: `assets/styles.css`

**Steps:**
1. Add timeline row styles.
2. Add compact snapshot card styles.
3. Ensure mobile layout remains clean.

## Task 5: Verify and publish
**Objective:** Prove the live site matches the local changes.

**Files:**
- Modify: repo state via git

**Steps:**
1. Run `node --check assets/app.js`.
2. Validate `data/idiomex-os.json`.
3. Serve locally and verify homepage/CEO markers and JSON fields.
4. Commit and push.
5. Verify public HTML, public shared JS markers, and public JSON version/fields.

## Done now vs still to do
- Done now: planning Phase 6.
- Still to do: implementation, verification, publish.

## Priority order recommendation
1. Data contract
2. Homepage simplification
3. CEO changes panel
4. CSS polish
5. Verification and deploy
