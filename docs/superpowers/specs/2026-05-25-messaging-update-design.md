# Messaging Update — Design Spec
Date: 2026-05-25

## Goal
Add business-transformation language to the site without overhauling the existing voice.
Target: small/medium business owners who arrive via referral and need a credibility check.

## Change 1 — Hero Subheadline

**File:** `src/App.jsx` (hero-sub paragraph, ~line 317)

Current:
> "We create brand films, campaigns and content — then shape the website and visual identity around the same direction."

New:
> "We create brand films, campaigns and content — then build the website and visual identity your business actually deserves."

## Change 2 — New Section: "Who This Is For"

**File:** `src/App.jsx` — insert between Services section (`#services`) and Process section.

**Content:**
- Eyebrow: `WHO THIS IS FOR`
- Grid of 8 business types (2 columns):
  - MedSpas & Wellness
  - Law Firms
  - Cosmetic & Dental
  - Fashion & Retail
  - Fitness & Lifestyle
  - Hospitality
  - Local Businesses
  - Agencies
- Closing line: `The category changes. The standard doesn't.`

**Style:** matches existing section pattern — eyebrow label, headline, grid. Uses existing CSS variables and animation pattern (Framer Motion whileInView).

## Out of Scope
- Visual design changes
- Other GPT suggestions (hero headline, before/after format, packages rename, etc.)
- Form endpoint wiring
