import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { INSIGHTS } from '../data/articles';
import { usePageMeta, siteUrl } from '../utils/meta';
import { revealVariants, revealTransition, viewportOnce } from '../utils/animation';

export default function Insights() {
  const shouldReduceMotion = useReducedMotion();
  const activeRv = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : revealVariants;

  const [activeCategory, setActiveCategory] = useState('ALL');
  const categories = ['ALL', ...new Set(INSIGHTS.map(a => a.category))];

  const featured = INSIGHTS[0];
  const rest = INSIGHTS.slice(1);

  // Count articles per category
  const countFor = (cat) => cat === 'ALL' ? INSIGHTS.length : INSIGHTS.filter(a => a.category === cat).length;

  // Group articles by category (for ALL mode)
  const grouped = {};
  for (const cat of categories.slice(1)) {
    const articles = rest.filter(a => a.category === cat);
    if (articles.length) grouped[cat] = articles;
  }

  // Flat filtered list (for non-ALL mode)
  const filtered = activeCategory === 'ALL' ? rest : rest.filter(a => a.category === activeCategory);

  usePageMeta({
    title: 'Insights — MYZE Media',
    ogTitle: 'MYZE Media Insights',
    description: 'Insights on brand perception, visual strategy, content systems, video production and editorial websites for businesses that need to look more valuable.',
    url: `${siteUrl}/insights`,
    image: `${siteUrl}/insights/insights-hero.jpg`,
  });

  return (
    <main className="insights-page">
      <section className="insights-hero">
        <motion.div
          className="insights-hero-copy"
          variants={activeRv}
          initial="hidden"
          animate="visible"
          transition={revealTransition}
        >
          <span className="work-eyebrow">INSIGHTS</span>
          <h1>Thinking on brand perception, content, websites and visual value.</h1>
          <p>
            Practical notes for businesses that want to look more trusted, more considered,
            and more valuable online.
          </p>
        </motion.div>
        <div className="insights-hero-media" aria-hidden="true">
          <img src="/insights/insights-hero.jpg" alt="" />
        </div>
      </section>

      <section className="insights-list" aria-label="MYZE Media insights">

        {/* ── Category filters ───────────────────── */}
        <motion.div
          className="insights-filters"
          variants={activeRv}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={revealTransition}
        >
          <span className="insights-filters-label">Filter by topic:</span>
          <div className="insights-filters-row">
            {categories.map(cat => (
              <button
                key={cat}
                className={`insights-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="filter-cat">{cat === 'ALL' ? 'ALL TOPICS' : cat}</span>
                <span className="filter-count">{countFor(cat)}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Featured article ──────────────────── */}
        <motion.article
          className="insight-feature"
          variants={activeRv}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={revealTransition}
        >
          <Link to={`/insights/${featured.slug}`} className="insight-feature-image">
            <img src={featured.image} alt="" loading="lazy" />
          </Link>
          <div className="insight-feature-copy">
            <div className="insight-meta">
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
            </div>
            <h2><Link to={`/insights/${featured.slug}`}>{featured.title}</Link></h2>
            <p>{featured.dek}</p>
            <Link to={`/insights/${featured.slug}`} className="insight-link">READ INSIGHT</Link>
          </div>
        </motion.article>

        {/* ── Grouped by category (ALL mode) ────── */}
        {activeCategory === 'ALL' && Object.keys(grouped).length > 0 && (
          Object.entries(grouped).map(([catName, articles]) => (
            <div key={catName} className="insights-category-group">
              <h3 className="insights-category-header">{catName}</h3>
              <div className="insight-grid">
                {articles.map((article, index) => (
                  <motion.article
                    className="insight-card"
                    key={article.slug}
                    variants={activeRv}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ ...revealTransition, delay: (index % 3) * 0.06 }}
                  >
                    <Link to={`/insights/${article.slug}`} className="insight-card-image">
                      <img src={article.image} alt="" loading="lazy" />
                    </Link>
                    <div className="insight-card-copy">
                      <div className="insight-meta">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2>
                      <p>{article.dek}</p>
                      <Link to={`/insights/${article.slug}`} className="insight-link">READ INSIGHT</Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          ))
        )}

        {/* ── Flat grid (filtered mode) ─────────── */}
        {activeCategory !== 'ALL' && (
          filtered.length > 0 ? (
            <div className="insight-grid">
              {filtered.map((article, index) => (
                <motion.article
                  className="insight-card"
                  key={article.slug}
                  variants={activeRv}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ ...revealTransition, delay: (index % 3) * 0.06 }}
                >
                  <Link to={`/insights/${article.slug}`} className="insight-card-image">
                    <img src={article.image} alt="" loading="lazy" />
                  </Link>
                  <div className="insight-card-copy">
                    <div className="insight-meta">
                      <span>{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2>
                    <p>{article.dek}</p>
                    <Link to={`/insights/${article.slug}`} className="insight-link">READ INSIGHT</Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              className="insight-empty"
              variants={activeRv}
              initial="hidden"
              animate="visible"
              transition={revealTransition}
            >
              <p>Articles on this topic are coming soon.</p>
            </motion.div>
          )
        )}

        {/* ── CTA block — lead capture ──────────── */}
        <motion.div
          className="insights-cta"
          variants={activeRv}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={revealTransition}
        >
          <h2>Ready to upgrade how your brand is seen?</h2>
          <p>
            We create brand films, commercials, social content, and editorial websites
            for businesses that need to look more valuable. If your brand is ready for
            that conversation, we should talk.
          </p>
          <a href="/#contact" className="btn-primary">START A PROJECT</a>
        </motion.div>

      </section>
    </main>
  );
}
