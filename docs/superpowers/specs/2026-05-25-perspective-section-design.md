# Perspective Section — Design Spec

**Date:** 2026-05-25
**Status:** approved

## Purpose

Add a «Perspective» section that builds trust through expertise, replacing the current About Blurb and Approach sections. The section communicates MYZE's point of view on branding and invites the right clients to act.

## Problem

The site currently has no strong answer to «why should I trust you with my money?» — especially without a client list. About Blurb and Approach are generic and don't carry Mike's voice.

## Placement

Replaces About Blurb + Approach. Sits between Work/Transformations and Services.

New page order: Hero → Disciplines → Featured Film → Work → **Perspective** → Services → Who This Is For → Process → Contact

## Section Structure

Three blocks, vertical layout:

### Block 1 — WHAT WE SEE (Manifesto)

Headline: «Most brands don't have a budget problem. They have a vision problem.»

Three supporting points:
- **The Yellow Page trap** — everyone in the same grid, nobody's different
- **Cliché blindness** — drone shots, handshakes, whiteboards feel safe because everyone uses them
- **We widen the lens** — you don't need a bigger budget, you need to see what's possible

### Block 2 — DOES THIS SOUND FAMILIAR? (Diagnosis)

Headline: «You're successful. But your brand still looks like everyone else's.»

Four diagnostic statements (border-left accent, light background):
- Proud of your work — but your website doesn't show it
- You can deliver — but clients pick the cheaper option
- You've been given content — and liked it, because you haven't seen better
- You explain what you do — instead of making people feel it

### Block 3 — HOW WE WORK (The Fit)

Headline: «We're looking for businesses that want to look different.»

Body: Any business, any size. The only requirement is that YOU feel it's time for a change.
Honest positioning: «You'll hear from us, or you'll find us first.»

CTA box (dark background, red border): «You'll know when it's time. When you do — we're here.»

## Tone

- Direct, not aggressive
- Honest — no fake «we don't chase» posture
- Mike's voice: observant, not pretentious
- No metaphors (no tractors, no limousines in copy)
- English (site language)

## Visual Style

- Follows existing site aesthetic: dark background, red (#8B2D2D) accents
- Each block has subtle background separation (`bg-secondary`)
- Diagnosis items: left border accent, light hover
- CTA box: dark fill + red border stroke
- Standard reveal animation on scroll (use existing `revealVariants` + IntersectionObserver)

## Technical Notes

- Add as a new `<section>` in `App.jsx` with id `perspective`
- Remove About Blurb and Approach sections
- Update nav links: merge/rename nav items as needed
- CSS: add `.perspective-section` styles to `index.css`
- No new dependencies
- Text is static (no CMS needed)

## What We're Removing

- About Blurb section (lines ~557-596 in App.jsx)
- Approach section (lines ~599-669 in App.jsx)
- Related CSS

## Out of Scope

- Formspree integration (form stays on mailto fallback)
- A/B testing copy variants
- Translations
