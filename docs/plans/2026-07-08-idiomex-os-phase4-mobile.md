# IDIOMEX OS Phase 4 Mobile + Actionability Plan

**Goal:** Push IDIOMEX OS from a cleaner dashboard into a more actionable operating surface, while making mobile navigation feel native with a bottom navigation bar.

**Current state:**
- Multipage static shell already exists.
- Homepage is much cleaner than before, but it still needs a stronger “what do I do now?” layer.
- Mobile still relies on the sidebar pattern, which is not ideal for quick phone use.

**This phase adds:**
- a mobile bottom navigation bar
- a stronger primary action / next move area on the homepage
- deadline and overdue visibility
- a clearer waiting / blocked concept
- a dedicated weekly review page

**Anti-goals:**
- do not add a backend
- do not make the homepage longer again
- do not hide the main current action behind extra taps

**Implementation slice:**
1. Extend shared navigation in `assets/app.js`
2. Add mobile bottom-nav styling in `assets/styles.css`
3. Upgrade overview/tasks/projects rendering for actionability
4. Convert `guide.html` into a shared-shell weekly review page
5. Add small supporting fields/content in `data/idiomex-os.json`
6. Verify locally, then publish and confirm the public URL

**Verification:**
- `node --check assets/app.js`
- JSON validation for `data/idiomex-os.json`
- local HTTP 200 for homepage + weekly page
- public HTTP 200 for homepage + weekly page
- public HTML markers confirm bottom nav / weekly review / primary action copy are live
