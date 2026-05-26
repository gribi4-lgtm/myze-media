# Perspective Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a «Perspective» section (3 blocks: manifesto, diagnosis, how we work) replacing About Blurb and Approach sections.

**Architecture:** Pure React component in App.jsx with CSS in index.css. Three vertically stacked text blocks using Framer Motion reveal animations. No new dependencies. Section id `perspective` for navigation.

**Tech Stack:** React 18, Framer Motion, CSS (no CSS modules)

---

### Task 1: Update Navigation

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Change nav link from ABOUT to PERSPECTIVE, update href**

Replace the three occurrences of `about` nav references. In `sectionHref` calls and in the `Insights` page nav.

In `sectionHref` — change the ABOUT label and href:

```jsx
// Line 105 — desktop nav
<a href={sectionHref('perspective')}>PERSPECTIVE</a>

// Line 121 — mobile nav
<a href={sectionHref('perspective')} onClick={() => setMenuOpen(false)}>PERSPECTIVE</a>
```

The old lines were:
```jsx
<a href={sectionHref('about')}>ABOUT</a>
```

- [ ] **Step 2: Verify no other `about` references remain in nav**

Run: `grep -n "sectionHref('about')\|#about" src/App.jsx`
Expected: no output (or only in comments/existing data)

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: update nav link from About to Perspective"
```

---

### Task 2: Remove About Blurb and Approach Sections

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remove About Blurb section (lines 557-596)**

Delete the entire `{/* ── BUILT ON CONTROL ───────────────────── */}` section including the `<section className="about-blurb">` block.

These lines to remove:
```jsx
        {/* ── BUILT ON CONTROL ───────────────────── */}
        <section className="about-blurb">
          <div className="split-text">
            <motion.h2
              className="about-blurb-headline"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={revealTransition}
            >
              THE BUSINESS<br />OUTGREW THE <span style={{color:'var(--red)'}}>SURFACE.</span>
            </motion.h2>
            <motion.p
              className="about-blurb-body"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              The service may be strong.<br />
              The work may be premium.<br />
              But if the first impression feels average,<br />
              the market reads it that way.
            </motion.p>
          </div>
          <motion.div
            className="perception-panel"
            variants={activeRi}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={imageTransition}
          >
            <p>
              We close the gap between what the business is worth
              and how it appears online.
            </p>
          </motion.div>
        </section>
```

- [ ] **Step 2: Remove Approach section (lines 598-669)**

Delete the entire `{/* ── OUR APPROACH ───────────────────────── */}` section including the `<section className="approach-section" id="about">` block.

These lines to remove:
```jsx
        {/* ── OUR APPROACH ───────────────────────── */}
        <section className="approach-section" id="about">
          <motion.div
            className="approach-collage"
            variants={activeRi}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={imageTransition}
          >
            <figure className="approach-collage-item">
              <img src="/fashion.png" alt="" loading="lazy" />
              <figcaption>Fashion</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/work/medspa_after_mockup.png" alt="" loading="lazy" />
              <figcaption>Wellness</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/work/lawyer_after_mockup.png" alt="" loading="lazy" />
              <figcaption>Law</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/business.png" alt="" loading="lazy" />
              <figcaption>Agencies</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/work/dental_after_mockup.png" alt="" loading="lazy" />
              <figcaption>Local Business</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src={thumbnails['1183970428'] || '/hero-bg.jpg'} alt="" loading="lazy" />
              <figcaption>Music Videos</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/work/defabio_after.jpg" alt="" loading="lazy" />
              <figcaption>Private Practice</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src="/approach-fitness.png" alt="" loading="lazy" />
              <figcaption>Fitness</figcaption>
            </figure>
            <figure className="approach-collage-item">
              <img src={thumbnails['1179772667'] || '/hero-bg.jpg'} alt="" loading="lazy" />
              <figcaption>Product Campaigns</figcaption>
            </figure>
          </motion.div>
          <div className="approach-text">
            <motion.h2
              className="about-blurb-headline"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={revealTransition}
            >
              OUR <span style={{color:'var(--red)'}}>APPROACH</span>
            </motion.h2>
            <motion.div
              className="approach-statement"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              <p>We work across industries<br />where perception matters.</p>
              <p>Fashion. Fitness. Wellness. Law.<br />Hospitality. Products.<br />Local businesses. Agencies.</p>
              <p>The category changes.<br />The job stays the same:<br />make the brand look more valuable,<br />more trusted and more considered.</p>
            </motion.div>
          </div>
        </section>
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove About Blurb and Approach sections"
```

---

### Task 3: Add Perspective Section to App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Insert Perspective section after Work section, before Services section**

Insert after the Work section closing `</section>` (around line 554) and before the Services section opening `{/* ── WHAT WE DO ─────────────────────────── */}` (around line 671, now shifted after removal):

```jsx
        {/* ── PERSPECTIVE ─────────────────────────── */}
        <section className="perspective-section" id="perspective">

          {/* Block 1: Manifesto */}
          <motion.div
            className="perspective-block"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <span className="perspective-label">WHAT WE SEE</span>
            <h2 className="perspective-headline">
              Most brands don't have a budget problem.<br />
              They have a <span style={{color:'var(--red)'}}>vision problem.</span>
            </h2>
            <p className="perspective-body">
              They've been given a template, and they're happy with it — because no one showed them
              what else is possible. They look around their industry and see everyone in the same box.
              Same layouts. Same stock footage. Same voice. They don't stand out because they don't
              know what standing out looks like.
            </p>
            <div className="perspective-points">
              <div className="perspective-point">
                <strong>The Yellow Page trap</strong>
                <p>Everyone in the same grid. Nobody's bad — but nobody's different either.</p>
              </div>
              <div className="perspective-point">
                <strong>Cliché blindness</strong>
                <p>Drone shots, handshakes, whiteboards. They feel safe because everyone uses them.</p>
              </div>
              <div className="perspective-point">
                <strong>We widen the lens</strong>
                <p>You don't need a bigger budget. You need to see what your brand could look like.</p>
              </div>
            </div>
          </motion.div>

          {/* Block 2: Diagnosis */}
          <motion.div
            className="perspective-block"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ ...revealTransition, delay: 0.1 }}
          >
            <span className="perspective-label">DOES THIS SOUND FAMILIAR?</span>
            <h3 className="perspective-subhead">
              You're successful. But your brand still looks like everyone else's.
            </h3>
            <div className="perspective-checks">
              <div className="perspective-check">
                <strong>You're proud of your work</strong> — but your website doesn't show it
              </div>
              <div className="perspective-check">
                <strong>You can deliver</strong> — but clients pick the cheaper option because they don't see the difference
              </div>
              <div className="perspective-check">
                <strong>You've been given content</strong> — and you liked it, because you haven't seen what better looks like
              </div>
              <div className="perspective-check">
                <strong>You explain what you do</strong> — instead of making people feel it
              </div>
            </div>
          </motion.div>

          {/* Block 3: How We Work */}
          <motion.div
            className="perspective-block"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ ...revealTransition, delay: 0.2 }}
          >
            <span className="perspective-label">HOW WE WORK</span>
            <h3 className="perspective-subhead">
              We're looking for businesses that want to look different.
            </h3>
            <p className="perspective-body">
              We work with any business — big, small, luxury, humble. Doesn't matter what you do
              or where you are. The only thing that matters is that <em>you</em> feel it's time for
              a change. That you look at your brand and think: this could be more.
            </p>
            <p className="perspective-body">
              If that's you — you'll hear from us, or you'll find us first. Either way, we should talk.
            </p>
            <div className="perspective-cta">
              <strong>You'll know when it's time.</strong>
              <span>When you do — we're here.</span>
            </div>
          </motion.div>

        </section>
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Perspective section (manifesto + diagnosis + how we work)"
```

---

### Task 4: Add Perspective CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add Perspective section styles**

Insert new CSS block after the existing section styles. Add after line 610 (end of `.approach-statement p + p` block, which we'll keep for now until cleanup):

```css
/* ── PERSPECTIVE ─────────────────────────── */
.perspective-section {
  padding: 80px 56px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.perspective-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.perspective-label {
  font-family: var(--f-mono);
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(220, 228, 210, 0.5);
}

.perspective-headline {
  font-family: var(--f-head);
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.03em;
  line-height: 1.05;
  margin: 0;
}

.perspective-subhead {
  font-family: var(--f-head);
  font-weight: 400;
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  letter-spacing: 0.03em;
  line-height: 1.15;
  margin: 0;
}

.perspective-body {
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.78;
  max-width: 680px;
  margin: 0;
}

.perspective-points {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.perspective-point {
  flex: 1;
  min-width: 160px;
}

.perspective-point strong {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--white);
}

.perspective-point p {
  font-size: 0.78rem;
  line-height: 1.5;
  opacity: 0.65;
  margin: 0;
}

.perspective-checks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perspective-check {
  padding: 14px 18px;
  background: rgba(220, 228, 210, 0.03);
  border-left: 2px solid rgba(220, 228, 210, 0.18);
  border-radius: 0 6px 6px 0;
  font-size: 0.88rem;
  line-height: 1.5;
  opacity: 0.82;
}

.perspective-check strong {
  font-weight: 500;
  color: var(--white);
}

.perspective-cta {
  margin-top: 8px;
  padding: 18px 24px;
  background: rgba(123, 48, 48, 0.08);
  border: 1px solid var(--red);
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.perspective-cta strong {
  font-size: 1rem;
  font-weight: 500;
  color: var(--white);
}

.perspective-cta span {
  font-size: 0.82rem;
  color: rgba(220, 228, 210, 0.5);
}

/* Mobile */
@media (max-width: 900px) {
  .perspective-section {
    padding: 56px 24px;
    gap: 48px;
  }

  .perspective-points {
    flex-direction: column;
    gap: 16px;
  }

  .perspective-point {
    min-width: 0;
  }

  .perspective-body {
    font-size: 0.88rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "style: add Perspective section CSS"
```

---

### Task 5: Clean Up Unused CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove unused CSS classes**

Remove these blocks from index.css (they were only used by About Blurb and Approach, which we deleted):

1. `.about-blurb-body` (lines 441-445)
2. `.perception-panel` and `.perception-panel p` (lines 447-461)
3. The `.about-blurb` and `.approach-section` from the shared padding block (lines 464-470) — update to keep only `.services-section`
4. In the desktop media query (around 473-501), remove `.about-blurb` and `.approach-section` references, keep only `.services-section`
5. `.approach-collage` block (lines 544-587)
6. `.approach-text` block (lines 590-604)
7. In mobile media query (around 1393-1425), remove `.about-blurb`, `.approach-section` related rules, `.perception-panel` rules

The shared padding block (lines 463-470) changes from:
```css
.about-blurb,
.approach-section,
.services-section {
  padding: 48px 56px;
  max-width: 1200px;
  margin: 0 auto;
}
```
To:
```css
.services-section {
  padding: 48px 56px;
  max-width: 1200px;
  margin: 0 auto;
}
```

The desktop media query block (lines 473-501) changes from:
```css
@media (min-width: 901px) {
  .about-blurb,
  .services-section {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 48px;
    align-items: start;
  }

  .approach-section {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 48px;
    align-items: start;
  }

  .about-blurb-body,
  .services-list {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    line-height: 1.4;
  }

  .perception-panel {
    margin-top: 8px;
  }
}
```
To:
```css
@media (min-width: 901px) {
  .services-section {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 48px;
    align-items: start;
  }

  .services-list {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    line-height: 1.4;
  }
}
```

The mobile responsive block (lines 1393-1434) changes — remove `.about-blurb`, `.approach-section` rules, `.perception-panel` rules:
```css
  /* ── SPLIT SECTIONS (mobile stack) ── */
  .services-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 40px 24px;
    max-width: 100%;
    margin: 0;
  }

  /* Images on mobile */
  .split-image { min-height: 0; }
  .split-img   { aspect-ratio: 4 / 3; height: auto; min-height: 0; }
```

Remove the `.approach-collage` mobile block (lines 1414-1425) entirely.

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "style: remove unused About Blurb and Approach CSS"
```

---

### Task 6: Verify Build

**Files:**
- None (verification only)

- [ ] **Step 1: Run production build**

```bash
cd src && npx vite build
```
Expected: build succeeds with no errors, output shows transformed modules and chunk sizes.

- [ ] **Step 2: Verify dev server still works**

Open http://localhost:5173/ in browser. Check:
- Perspective section renders between Work and Services
- Nav link «PERSPECTIVE» scrolls to the section
- All three blocks visible with proper spacing
- Mobile responsive layout works (check at 375px width)
- Old About and Approach sections are gone

- [ ] **Step 3: Commit final verification**

```bash
git add -A
git commit -m "chore: verify Perspective section build and rendering"
```
