import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import AnimatedBackground from './AnimatedBackground';
import Insights from './pages/Insights';
import ArticlePage from './pages/ArticlePage';
import NotFound from './pages/NotFound';
import { revealVariants, imageVariants, revealTransition, imageTransition, viewportOnce } from './utils/animation';
import { siteUrl, setMetaTag } from './utils/meta';
import './index.css';


const PROJECTS = [
  { id: '1186076334', tag: 'COMMERCIAL / PRODUCT', title: 'ELECTRONIKA WATCH' },
  { id: '1183970428', tag: 'MUSIC VIDEO',         title: 'VALKYRIE' },
  { id: '1179769681', tag: 'BRAND DOCUMENTARY',   title: 'JUDAICA CREATIONS' },
  { id: '1181225815', tag: 'AI VIDEO',             title: 'BRIDAL CONCEPT' },
  { id: '1183969203', tag: 'FASHION FILM',         title: 'ISMAELINA' },
  { id: '1179772667', tag: 'COMMERCIAL / PRODUCT', title: 'UNDER ARMOUR' },
  { id: '1181245077', tag: 'AI VIDEO',             title: 'BRIDAL DESIGNER CONCEPT' },
  { id: '1186075398', tag: '3D ANIMATION',         title: 'JUDAICA CREATIONS 3D' },
  { id: '1180499080', tag: 'BRIDAL / FASHION',     title: 'JOSEPH SAYADI BRIDAL' },
];

const DISCIPLINES = [
  {
    num: '01',
    title: 'BRAND FILMS',
    desc: 'Commercials, brand videos, interviews, product motion and social content. This is the core of the house.',
  },
  {
    num: '02',
    title: 'BRAND UPGRADE',
    desc: 'Visual direction, identity refinement, typography, imagery and tone. The brand starts looking like the business it has become.',
  },
  {
    num: '03',
    title: 'WEBSITE',
    desc: 'Editorial websites and landing pages that carry the same direction as the film and the brand.',
  },
];

const CASES = [
  {
    id: 'medspa-spec',
    discipline: 'WEB',
    tag: 'WEBSITE UPGRADE',
    client: 'MEDSPA · NEW YORK',
    title: 'From discount flyer\nto editorial skin studio.',
    before: '/work/medspa_before.jpg',
    after:  '/work/medspa_after_mockup.png',
    landscape: true,
    summary: 'A typical medspa storefront — strong treatments and real results, buried under a discount-flyer website: neon CTAs, starburst promos, stock smiles, ten things screaming for attention at once. We rebuilt it around one editorial idea per scroll: real skin, calmer language, a quieter palette. The kind of site that signals price by what it removes, not what it adds.',
    moves: ['Hero macro of real skin — no stock smiles, no before/after thumbnails', 'Warm bone palette and refined serif replace pink-and-teal template', 'One promise per scroll instead of a wall of badges and discounts'],
  },
  {
    id: 'lawyer-spec',
    discipline: 'REBRAND + WEB',
    tag: 'WEBSITE UPGRADE',
    client: 'TRIAL LAW FIRM · NEW YORK',
    title: 'From billboard lawyer\nto serious counsel.',
    before: '/work/lawyer_before.jpg',
    after:  '/work/lawyer_after_mockup.png',
    landscape: true,
    summary: 'A successful personal-injury and trial practice — strong record, serious lawyers — sold as a billboard: yellow CTAs, red banners, a money counter, three shield badges fighting for the same corner. We proposed the opposite. The site for a firm clients actually call before something serious: deep ink, a single editorial photograph, one quiet line that does the work of a ten-item homepage.',
    moves: ['Single editorial courtroom photograph replaces stock attorney portrait and flag', 'Ink-and-brass palette, refined serif, generous whitespace', 'One line of confident copy in place of trust badges and dollar counters'],
  },
  {
    id: 'dental-spec',
    discipline: 'WEB',
    tag: 'WEBSITE UPGRADE',
    client: 'COSMETIC DENTISTRY · NEW YORK',
    title: 'From clinical template\nto considered practice.',
    before: '/work/dental_before.jpg',
    after:  '/work/dental_after_mockup.png',
    landscape: true,
    summary: 'A boutique cosmetic dental practice doing premium work — and a website that looks like every other family-dentistry template: blue overlay, tooth icons, six services in a row, a $99 special. We rebuilt the homepage around one real photograph of the actual treatment room and one quiet line of copy. Calm, considered, unmistakably a dental practice — not a spa, not a clinic stock site.',
    moves: ['Real photograph of the treatment room replaces blue overlay and tooth icons', 'Editorial serif and warm neutrals replace medical-blue UI', 'One promise per scroll instead of a six-service icon row and discount banner'],
  },
];

const STEPS = [
  { num: '01', title: 'AUDIT',      desc: 'We look at your video, website, social and brand presence like a first-time customer would.' },
  { num: '02', title: 'DIRECTION', desc: 'We define what needs to change: film only, brand direction, website, or the full system.' },
  { num: '03', title: 'PRODUCTION',   desc: 'We shoot, design and build the pieces that will make the brand feel clearer and more valuable.' },
  { num: '04', title: 'HANDOFF',   desc: 'You leave with finished assets and a visual direction that can keep working after launch.' },
];


function Nav({ menuOpen, setMenuOpen }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const sectionHref = id => isHome ? `#${id}` : `/#${id}`;

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="MYZE Media" className="nav-logo-img" />
        </Link>
        <div className="nav-links">
          <a href={sectionHref('work')}>WORK</a>
          <a href={sectionHref('services')}>SERVICES</a>
          <a href={sectionHref('perspective')}>PERSPECTIVE</a>
          <Link to="/insights">INSIGHTS</Link>
          <a href={sectionHref('contact')}>CONTACT</a>
        </div>
        <div
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span />
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <a href={sectionHref('work')}     onClick={() => setMenuOpen(false)}>WORK</a>
          <a href={sectionHref('services')} onClick={() => setMenuOpen(false)}>SERVICES</a>
          <a href={sectionHref('perspective')}    onClick={() => setMenuOpen(false)}>PERSPECTIVE</a>
          <Link to="/insights"              onClick={() => setMenuOpen(false)}>INSIGHTS</Link>
          <a href={sectionHref('contact')}  onClick={() => setMenuOpen(false)}>CONTACT</a>
        </div>
      )}
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <span className="footer-copy">© 2026 MYZE Media. All rights reserved.</span>
    </footer>
  );
}


export default function App() {
  const shouldReduceMotion = useReducedMotion();

  /* active variants — no animation when user prefers reduced motion */
  const activeRv  = shouldReduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : revealVariants;
  const activeRi  = shouldReduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : imageVariants;

  const [lightbox, setLightbox]     = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [menuOpen, setMenuOpen]     = useState(false);
  const [formOpen, setFormOpen]     = useState(false);
  const [formSent, setFormSent]     = useState(false);
  const [formData, setFormData]     = useState({ name: '', email: '', details: '' });
  const { pathname } = useLocation();


  /* fetch Vimeo thumbnails */
  useEffect(() => {
    Promise.all(
      PROJECTS.map(p =>
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${p.id}&width=1280`)
          .then(r => r.json())
          .then(d => [p.id, d.thumbnail_url])
          .catch(() => [p.id, null])
      )
    ).then(results => {
      const map = {};
      results.forEach(([id, url]) => { if (url) map[id] = url; });
      setThumbnails(map);
    });
  }, []);

  /* hero headline — line by line (GSAP, stays) */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        gsap.utils.toArray('.hero-line').forEach((line, i) => {
          gsap.fromTo(line,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.2 + i * 0.15 }
          );
        });
      } else {
        gsap.set('.hero-line', { opacity: 1, y: 0 });
      }
    });

    return () => ctx.revert();
  }, []);

  /* escape key closes lightbox + form */
  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') { setLightbox(null); setFormOpen(false); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  /* form submit → mailto fallback (reliable, no third-party).
     Swap to Formspree by setting FORM_ENDPOINT to your form id. */
  const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/abcd1234'
  const handleSubmit = async e => {
    e.preventDefault();
    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name:    formData.name,
            email:   formData.email,
            message: formData.details,
          }),
        });
        if (res.ok) {
          setFormSent(true);
          setFormData({ name: '', email: '', details: '' });
          return;
        }
      } catch (_) { /* fall through to mailto */ }
    }
    /* fallback — open user's mail client with a prefilled message */
    const subject = encodeURIComponent(`New project inquiry — ${formData.name || 'MYZE Media'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.details}`
    );
    window.location.href = `mailto:mike@myzemedia.com?subject=${subject}&body=${body}`;
    setFormSent(true);
    setFormData({ name: '', email: '', details: '' });
  };

  /* glass nav on scroll */
  useEffect(() => {
    const nav = document.querySelector('.nav');
    const fn = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);


  /* HOW IT WORKS — scroll animation (mobile only) */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    if (prefersReduced || !isMobile) return;

    const cards = Array.from(document.querySelectorAll('.process-card'));
    const transition = [
      'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)',
      'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
      'filter 600ms cubic-bezier(0.22, 1, 0.36, 1)',
    ].join(', ');

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.filter = 'blur(4px)';
      card.style.transition = transition;
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const index = cards.indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.filter = 'blur(0px)';
          }, index * 100);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;
    const page = {
      title: 'MYZE Media — Brand Films, Campaigns, Rebrands & Websites. NJ & NY',
      ogTitle: 'MYZE Media — Brand Films, Rebrands & Editorial Websites',
      description: 'MYZE Media creates brand films, commercials, social content, rebrands and editorial websites for businesses in New Jersey and New York that need a clearer, more premium first impression.',
      url: siteUrl,
      image: `${siteUrl}/OG_image.png`,
    };
    document.title = page.title;
    setMetaTag('meta[name="description"]', 'content', page.description);
    setMetaTag('meta[property="og:title"]', 'content', page.ogTitle);
    setMetaTag('meta[property="og:description"]', 'content', page.description);
    setMetaTag('meta[property="og:url"]', 'content', page.url);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    setMetaTag('meta[property="og:image"]', 'content', page.image);
    setMetaTag('meta[name="twitter:title"]', 'content', page.ogTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', page.description);
    setMetaTag('meta[name="twitter:image"]', 'content', page.image);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', page.url);
  }, [pathname]);

  return (
    <>
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={
          <>
        {/* ── GLOBAL ANIMATED BACKGROUND ─────────── */}
        <div className="global-anim"><AnimatedBackground /></div>
  
        {/* ── HERO ───────────────────────────────── */}
        <section className="hero">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-bg.jpg"
            aria-hidden="true"
          >
            <source src="/myze-hero-loop-mobile.mp4" type="video/mp4" media="(max-width: 900px)" />
            <source src="/myze-hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="sr-only">Brand Films, Commercial Content, Rebrands and Editorial Websites — NJ &amp; NY</h1>
            <h2 className="hero-headline">
              <span className="hero-line">PERCEPTION</span>
              <span className="hero-line">IS</span>
              <span className="hero-line">EVERYTHING</span>
            </h2>
            <motion.p
              className="hero-sub"
              variants={activeRv}
              initial="hidden"
              animate="visible"
              transition={{ ...revealTransition, delay: 0.75 }}
            >
              We create brand films, campaigns and content —<br />
              then build the website and visual identity<br />
              your business actually deserves.
            </motion.p>
            <motion.div
              className="hero-btns"
              variants={activeRv}
              initial="hidden"
              animate="visible"
              transition={{ ...revealTransition, delay: 0.95 }}
            >
              <a href="#film" className="btn-primary">VIEW VIDEO WORK</a>
              <button className="btn-outline" onClick={() => { setFormOpen(true); setFormSent(false); }}>START A PROJECT</button>
            </motion.div>
          </div>
          <div className="hero-side-label">
            <div className="hero-side-line" />
            <span className="hero-side-text">CREATIVE MEDIA HOUSE — MOVING BRANDS FORWARD</span>
            <div className="hero-side-dot" />
          </div>
          <div className="hero-scroll">
            <span>SCROLL</span>
            <div className="scroll-line" />
          </div>
        </section>
  
        {/* ── TICKER ─────────────────────────────── */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map(n => (
              <span key={n} className="ticker-set">
                {['BRAND FILMS','COMMERCIALS','SOCIAL CONTENT','INTERVIEWS','REBRAND','WEBSITE UPGRADE','VISUAL DIRECTION','BRAND CLARITY'].map(item => (
                  <span key={item} className="ticker-item">
                    {item}<span className="ticker-dot">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
  
        {/* ── THREE DISCIPLINES ────────────────────── */}
        <section className="disciplines-section" id="disciplines">
          <motion.div
            className="disciplines-intro"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <span className="work-eyebrow">WHAT WE DO</span>
            <h2 className="work-headline">
              WE CREATE CONTENT THAT SHAPES<br />HOW THE <span style={{color:'var(--red)'}}>BRAND IS SEEN.</span>
            </h2>
            <p className="work-lede">
              We create the visual side of your marketing: the videos, campaigns, website, and brand
              content that make people take the business seriously.
            </p>
            <p className="work-service-line">
              Campaign Creative · Social Content System · Ad Creative Production · Brand Launch Package · Visual Content Library
            </p>
          </motion.div>
  
          <div className="disciplines-grid">
            {DISCIPLINES.map((d, i) => (
              <motion.div
                key={d.title}
                className="discipline-card"
                variants={activeRv}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ ...revealTransition, delay: i * 0.08 }}
              >
                <span className="discipline-num">{d.num}</span>
                <h3 className="discipline-title">{d.title}</h3>
                <p className="discipline-desc">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
  
        {/* ── FILM WORK ──────────────────────────── */}
        <section className="film-section" id="film">
          <motion.div
            className="film-intro"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <span className="film-eyebrow">FILM &amp; MOTION</span>
            <h2 className="film-headline">
              THE ORIGINAL<br /><span style={{color:'var(--red)'}}>STRENGTH.</span>
            </h2>
            <p className="film-lede">
              Commercials, brand films, product motion, interviews, fashion film and social content.
              Shot, edited and graded in-house.
            </p>
          </motion.div>
  
          <div className="film-grid">
            {PROJECTS.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                className="film-tile"
                onClick={() => setLightbox(p.id)}
                variants={activeRi}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ ...imageTransition, delay: (i % 3) * 0.05 }}
              >
                <div className="film-tile-media">
                  {thumbnails[p.id] ? (
                    <img src={thumbnails[p.id]} alt={p.title} loading="lazy" />
                  ) : (
                    <div className="film-tile-placeholder" />
                  )}
                  <span className="film-tile-play" aria-hidden="true">▶</span>
                </div>
                <div className="film-tile-text">
                  <span className="film-tile-tag">{p.tag}</span>
                  <span className="film-tile-title">{p.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
  
        </section>
  
        {/* ── WORK / TRANSFORMATIONS ────────────────── */}
        <section className="work-section transformations" id="work">
          <motion.div
            className="work-intro"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <span className="work-eyebrow">BRAND &amp; WEBSITE UPGRADES</span>
            <h2 className="work-headline">
              WHEN THE BRAND<br />NEEDS MORE THAN <span style={{color:'var(--red)'}}>VIDEO.</span>
            </h2>
            <p className="work-lede">
              Some projects stay focused on film. Others need the website, identity and content system
              to catch up. These studies show how we raise the whole surface of a brand.
            </p>
          </motion.div>
  
          <div className="cases">
            {CASES.map((c, idx) => (
              <motion.article
                key={c.id}
                className={`case${c.landscape ? ' case--landscape' : ''}`}
                variants={activeRv}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ ...revealTransition, delay: 0.05 }}
              >
                <div className="case-media">
                  {c.before ? (
                    <div className="case-compare">
                      <figure className="case-frame">
                        <span className="case-frame-label">BEFORE</span>
                        <img src={c.before} alt={`${c.client} before`} loading="lazy" />
                      </figure>
                      <figure className="case-frame case-frame--after">
                        <span className="case-frame-label">AFTER</span>
                        <img src={c.after} alt={`${c.client} after`} loading="lazy" />
                      </figure>
                    </div>
                  ) : (
                    <figure className="case-frame case-frame--solo">
                      <span className="case-frame-label">PROPOSED DIRECTION</span>
                      <img src={c.after} alt={c.client} loading="lazy" />
                    </figure>
                  )}
                </div>
                <div className="case-text">
                  <span className="case-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="case-tag">{c.tag}</span>
                  {c.discipline && <span className="case-discipline">{c.discipline}</span>}
                  <h3 className="case-client">{c.client}</h3>
                  <p className="case-title">{c.title.split('\n').map((l, i) => (
                    <span key={i}>{l}<br /></span>
                  ))}</p>
                  <p className="case-summary">{c.summary}</p>
                  <ul className="case-moves">
                    {c.moves.map(m => <li key={m}>{m}</li>)}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
  
          <div className="work-footnote">
            <p>
              Video remains the core of the house
            </p>
          </div>
        </section>
  
  
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

        {/* ── WHAT WE DO ─────────────────────────── */}
        <section className="services-section" id="services">
          <div className="split-text">
            <motion.h2
              className="about-blurb-headline"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={revealTransition}
            >
              WHAT YOU CAN<br />HIRE US <span style={{color:'var(--red)'}}>FOR</span>
            </motion.h2>
            <motion.p
              className="services-mantra"
              variants={activeRv}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ ...revealTransition, delay: 0.05 }}
            >
              We create content that shapes how the brand is seen.
            </motion.p>
            <div className="services-simple">
              <motion.div
                className="services-list"
                variants={activeRv}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ ...revealTransition, delay: 0.1 }}
              >
                <div className="service-row">
                  <span className="service-num">01</span>
                  <div>
                    <h3 className="service-title">FILM &amp; CONTENT</h3>
                    <p className="service-desc">Commercials, brand films, product videos, interviews, campaign assets and social content. Direction, shoot, edit and color in-house.</p>
                  </div>
                </div>
                <div className="service-row">
                  <span className="service-num">02</span>
                  <div>
                    <h3 className="service-title">BRAND UPGRADE</h3>
                    <p className="service-desc">Visual direction, identity refinement, typography, image style, tone and content system. For brands that need to look more established.</p>
                  </div>
                </div>
                <div className="service-row">
                  <span className="service-num">03</span>
                  <div>
                    <h3 className="service-title">WEBSITE UPGRADE</h3>
                    <p className="service-desc">Editorial websites and landing pages that make the business easier to trust, understand and buy from.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="split-image">
            <motion.img
              src="/whatwedo.png"
              alt=""
              className="split-img"
              variants={activeRi}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={imageTransition}
            />
          </div>
        </section>
  
        {/* ── WHO THIS IS FOR ────────────────────── */}
        <section className="for-section">
          <motion.div
            className="for-intro"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <span className="work-eyebrow">WHO THIS IS FOR</span>
          </motion.div>
          <motion.div
            className="for-grid"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ ...revealTransition, delay: 0.1 }}
          >
            {['MedSpas & Wellness','Law Firms','Cosmetic & Dental','Fashion & Retail','Fitness & Lifestyle','Hospitality','Local Businesses','Agencies'].map(item => (
              <div className="for-item" key={item}>{item}</div>
            ))}
          </motion.div>
          <motion.p
            className="for-closing"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ ...revealTransition, delay: 0.2 }}
          >
            The category changes. The standard doesn't.
          </motion.p>
        </section>
  
        {/* ── HOW IT WORKS ───────────────────────── */}
        <section className="process-section">
          <motion.h2
            className="about-blurb-headline"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            HOW IT <span style={{color:'var(--red)'}}>WORKS</span>
          </motion.h2>
          <div className="process-steps">
            {STEPS.map(s => (
              <div className="process-card" key={s.num}>
                <span className="process-num">{s.num}</span>
                <h3 className="process-title">{s.title}</h3>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* ── CONTACT ────────────────────────────── */}
        <section className="contact-section" id="contact">
          <div className="contact-side-label">LET'S TALK</div>
          <motion.div
            className="contact-text"
            variants={activeRv}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={revealTransition}
          >
            <div className="contact-social">
              <a href="https://www.instagram.com/myze.media" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
              <a href="https://vimeo.com/myzemedia" target="_blank" rel="noopener noreferrer">VIMEO</a>
              <a href="mailto:mike@myzemedia.com">EMAIL</a>
            </div>
            <h2 className="contact-headline">
              Ready to look like<br />the brand you actually are?
            </h2>
            <p className="contact-tagline">Creative media house for brand video, campaigns and websites.</p>
            <button className="btn-cta" onClick={() => { setFormOpen(true); setFormSent(false); }}>
              START A PROJECT
            </button>
            <p className="contact-location">
              Prefer email for all inquiries<br />
              New Jersey / New York
            </p>
          </motion.div>
        </section>
  
        {/* ── FOOTER ─────────────────────────────── */}
        <SiteFooter />
          </>
        } />

        <Route path="/insights" element={
          <><div className="global-anim"><AnimatedBackground /></div><Insights /></>
        } />

        <Route path="/insights/:slug" element={
          <><div className="global-anim"><AnimatedBackground /></div><ArticlePage /></>
        } />

        <Route path="*" element={
          <><div className="global-anim"><AnimatedBackground /></div><NotFound /></>
        } />
      </Routes>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <iframe
              src={`https://player.vimeo.com/video/${lightbox}?autoplay=1&loop=1&color=8B2D2D&title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="MYZE Media"
            />
          </div>
        </div>
      )}

      {formOpen && (
        <div className="form-overlay" onClick={() => setFormOpen(false)}>
          <div className="form-modal" onClick={e => e.stopPropagation()}>
            <button className="form-close" onClick={() => setFormOpen(false)}>✕</button>

            {formSent ? (
              <div className="form-success">
                <h3>Message sent.</h3>
                <p>We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <h3 className="form-title">START A PROJECT</h3>
                <form onSubmit={handleSubmit} className="form-fields">
                  <div className="form-field">
                    <label>NAME</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-field">
                    <label>EMAIL</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-field">
                    <label>PROJECT DETAILS</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.details}
                      onChange={e => setFormData(d => ({ ...d, details: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="form-submit">SEND MESSAGE</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
