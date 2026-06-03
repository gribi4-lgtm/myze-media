# Insights Section — Design Spec
**Date:** 2026-05-25  
**Project:** MYZE Media (`~/Desktop/MYZE-OS/MYZE-Media/`)

---

## Context

App.jsx is a ~1400-line monolith. It already contains the full Insights implementation (data, components, routing) — but as inline code with manual `window.location.pathname` routing. This refactor extracts Insights into proper files and upgrades routing to react-router-dom.

**Already exists:** 6 articles (INSIGHTS array), InsightsIndex component, InsightArticle component, Nav with INSIGHTS link, usePageMeta/buildArticleSchema helpers.  
**Missing:** react-router-dom, separate files, category filters, share buttons, vercel.json SPA rewrite.

---

## Architecture

```
src/
  data/
    articles.js         ← INSIGHTS array + insightBySlug lookup map
  utils/
    meta.js             ← setMetaTag(), usePageMeta(), buildArticleSchema()
  pages/
    Insights.jsx        ← InsightsIndex + category filter state
    ArticlePage.jsx     ← InsightArticle + share buttons
  App.jsx               ← BrowserRouter routes + home page sections (unchanged)
  main.jsx              ← add <BrowserRouter> wrapper
vercel.json             ← SPA rewrite rule (required for /insights/:slug on Vercel)
```

---

## Data Model

Keep the existing richer structure (not simplified `content` array):

```js
{
  slug: 'why-most-business-content-feels-disposable',
  category: 'CONTENT',
  date: 'May 25, 2026',
  isoDate: '2026-05-25',
  readTime: '5 MIN READ',
  title: 'Why Most Business Content Feels Disposable',
  dek: 'Short description...',
  image: '/business.png',
  meta: 'SEO meta description...',
  body: [
    { heading: 'Section heading', text: ['paragraph 1', 'paragraph 2'] }
  ]
}
```

`insightBySlug` is a pre-built lookup: `Object.fromEntries(INSIGHTS.map(a => [a.slug, a]))`.

---

## Routing

Install `react-router-dom`. Replace manual `window.location.pathname` + `popstate` with:

```jsx
// main.jsx
<BrowserRouter><App /></BrowserRouter>

// App.jsx
<Routes>
  <Route path="/"               element={<HomePage />} />
  <Route path="/insights"       element={<Insights />} />
  <Route path="/insights/:slug" element={<ArticlePage />} />
  <Route path="*"               element={<NotFound />} />
</Routes>
```

Nav uses `<Link>` from react-router-dom (no full-page reloads). For in-page hash anchors on home (e.g. `#work`), keep as `<a href="/#work">` — react-router-dom handles this correctly.

**vercel.json** (prevents 404 on direct URL access):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Insights.jsx (list page)

- Hero section: eyebrow + h1 + description + `/hero-bg.jpg` image (existing design)
- Featured article: first in INSIGHTS array — large card with image left, copy right
- Category filters: pill buttons above the grid — ALL + unique categories from INSIGHTS array. Active filter highlights in red. `featured` article always shows regardless of filter.
- Grid: 3 columns, remaining articles. Filtered by `activeCategory` state. Framer Motion stagger on cards.

---

## ArticlePage.jsx (single article)

- Reads `slug` param via `useParams()`
- Renders 404 if slug not found in `insightBySlug`
- Header: breadcrumb back to /insights, category + date + readTime meta, h1 title, dek paragraph
- Cover image full-width below header
- Body: maps `article.body` → `<section>` with `<h2>` heading + `<p>` paragraphs
- Share buttons section at bottom:
  - **X (Twitter):** `https://twitter.com/intent/tweet?url={url}&text={title}`
  - **LinkedIn:** `https://www.linkedin.com/sharing/share-offsite/?url={url}`
  - **Copy link:** `navigator.clipboard.writeText(url)` → button label flips to "COPIED" for 2s
- "More Insights" section: 3 cards linking to other articles (excluding current)
- SEO: `usePageMeta()` + `buildArticleSchema()` JSON-LD

---

## App.jsx After Refactor

- Imports `Routes, Route` from react-router-dom
- Home page sections stay in App.jsx (no extraction — user didn't request it, keeps the diff minimal)
- Remove: INSIGHTS array, insightBySlug, InsightsIndex, InsightArticle, NotFound, setMetaTag, usePageMeta, buildArticleSchema, manual path state + popstate listener
- Keep: PROJECTS, DISCIPLINES, CASES, STEPS, animation variants, all home sections, form logic, lightbox logic

---

## Error Handling

- Unknown slug → renders `<NotFound />` (not a crash)
- Clipboard API unavailable → share button hidden (feature detect on render)

---

## Out of Scope

- Pagination (6 articles fits one page)
- Search
- CMS integration
- Comments
