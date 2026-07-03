# Phase 5 — Mission Control Actionability Checklist

> **For Hermes:** Implement this checklist in order. Keep changes focused on making Mission Control more actionable without bloating the homepage.

**Goal:** Convert IDIOMEX Mission Control from a strong prototype into a control surface that tells Navod what to do now, what to defer, and what to ignore.

**Scope for this execution pass:** Homepage actionability, opportunity triage clarity, installation next-step clarity, and Company Brain morning-brief improvements.

---

## Success criteria

By the end of this phase, the first screen should:
- show one obvious primary action
- separate **do now / do later / ignore** clearly
- make the top installation blocker obvious
- make Company Brain feel like a practical COO briefing
- still feel lighter and calmer than before

---

## Checklist

### 1. Add a primary action rail to Mission Control
- [ ] Add a top-level action block near the header
- [ ] Show one main recommended action
- [ ] Show why it matters now
- [ ] Show estimated impact / time
- [ ] Add 1–2 secondary actions beneath it
- [ ] Ensure this remains readable on mobile first

### 2. Create explicit priority buckets
- [ ] Add **Do now** bucket
- [ ] Add **Do later** bucket
- [ ] Add **Ignore today** bucket
- [ ] Map current recommendations/opportunities into these buckets
- [ ] Make the bucket labels more important than raw card count

### 3. Make opportunities feel operational
- [ ] Show shortlist opportunities only at the top layer
- [ ] Surface expected value, probability, and next step clearly
- [ ] Add status language that supports immediate decisions
- [ ] Reduce generic CRM feel
- [ ] Keep lower-priority leads out of the main attention zone

### 4. Make installations feel executable
- [ ] Surface the most important installation blocker clearly
- [ ] Show next milestone / next step in one glance
- [ ] Highlight template/reusability value where relevant
- [ ] Reduce paragraph-heavy delivery presentation

### 5. Upgrade Company Brain into a morning brief
- [ ] Add a short “Good morning, Navod” style briefing header
- [ ] Summarize yesterday / today / risk / ignore guidance
- [ ] Keep it concise and high-signal
- [ ] Ensure it feels like a business partner, not a chatbot transcript

### 6. Reduce homepage clutter
- [ ] Remove or demote any blocks that feel like reports
- [ ] Keep supporting detail below the fold or inside rooms
- [ ] Tighten spacing and visual hierarchy where needed
- [ ] Check that the first screen answers “what matters now?” quickly

### 7. Update the data contract alongside the UI
- [ ] Extend `data/idiomex-os.json` with any new action-oriented objects
- [ ] Keep labels business-native: opportunities, installations, intelligence
- [ ] Avoid generic PM terminology
- [ ] Ensure defaults render safely if some fields are missing

### 8. Verify the implementation
- [ ] Local HTML returns HTTP 200
- [ ] Primary action text renders in the UI
- [ ] Company Brain morning brief renders in the UI
- [ ] Priority buckets render in the UI
- [ ] Mobile layout remains controlled
- [ ] Public hosted URL can be rechecked after deploy/update

---

## Recommended implementation order

1. Data model updates in `data/idiomex-os.json`
2. Homepage Mission Control markup updates in `index.html`
3. Rendering logic updates in `index.html`
4. Mobile refinement for new blocks
5. Local verification
6. Public verification

---

## Files to modify
- `index.html`
- `data/idiomex-os.json`
- optionally update strategy docs after implementation if the phase meaning changes

---

## Notes
- Treat this as an operating-system refinement, not a redesign from scratch.
- The homepage should become more decisive by showing less, not more.
- If a section does not help Navod decide what to do next, demote it.
