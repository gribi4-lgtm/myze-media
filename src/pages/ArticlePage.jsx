import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { INSIGHTS, insightBySlug } from '../data/articles';
import { usePageMeta, buildArticleSchema, siteUrl } from '../utils/meta';
import { revealVariants, revealTransition } from '../utils/animation';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = insightBySlug[slug];

  const shouldReduceMotion = useReducedMotion();
  const activeRv = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : revealVariants;

  const [copied, setCopied] = useState(false);
  const url = article ? `${siteUrl}/insights/${article.slug}` : `${siteUrl}/404`;

  usePageMeta(
    article
      ? {
          title: `${article.title} — MYZE Media`,
          description: article.meta,
          url,
          image: `${siteUrl}${article.image}`,
          type: 'article',
        }
      : {
          title: 'Page Not Found — MYZE Media',
          description: 'The page you are looking for could not be found.',
          url: `${siteUrl}/404`,
        }
  );

  useEffect(() => {
    if (!article) return;
    const id = 'insight-article-schema';
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildArticleSchema(article));
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [article]);

  if (!article) {
    return (
      <main className="not-found-page">
        <motion.div
          variants={activeRv}
          initial="hidden"
          animate="visible"
          transition={revealTransition}
        >
          <span className="work-eyebrow">404</span>
          <h1>Page not found.</h1>
          <p>The page may have moved, or the link may be outdated.</p>
          <Link to="/" className="btn-outline">RETURN HOME</Link>
        </motion.div>
      </main>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl  = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <main className="article-page">
      <article>
        <header className="article-hero">
          <motion.div
            className="article-hero-copy"
            variants={activeRv}
            initial="hidden"
            animate="visible"
            transition={revealTransition}
          >
            <Link to="/insights" className="article-back">INSIGHTS</Link>
            <div className="insight-meta">
              <span>{article.category}</span>
              <span>{article.date}</span>
              <span>{article.readTime}</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.dek}</p>
          </motion.div>
          <motion.figure
            className="article-hero-image"
            variants={activeRv}
            initial="hidden"
            animate="visible"
            transition={{ ...revealTransition, delay: 0.12 }}
          >
            <img src={article.image} alt="" />
          </motion.figure>
        </header>

        <div className="article-body">
          {article.body.map(section => (
            <section key={section.heading} className="article-section">
              <h2>{section.heading}</h2>
              {section.text.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        <div className="article-share">
          <span className="article-share-label">SHARE</span>
          <div className="article-share-btns">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
            >
              X / TWITTER
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
            >
              LINKEDIN
            </a>
            <button className="share-btn" onClick={handleCopy}>
              {copied ? 'COPIED' : 'COPY LINK'}
            </button>
          </div>
        </div>
      </article>

      <section className="article-next">
        <span className="work-eyebrow">MORE INSIGHTS</span>
        <div className="article-next-grid">
          {INSIGHTS.filter(item => item.slug !== article.slug).slice(0, 3).map(item => (
            <Link to={`/insights/${item.slug}`} className="article-next-card" key={item.slug}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
