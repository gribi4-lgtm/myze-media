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

        <div className="insights-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`insights-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
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
        )}
      </section>
    </main>
  );
}
