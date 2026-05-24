import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useAnimationControls } from 'framer-motion';
import { gsap } from 'gsap';
import AnimatedBackground from './AnimatedBackground';
import './index.css';

/* ── FRAMER MOTION VARIANTS ──────────────────── */
const revealVariants = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0,  filter: 'none' },
};
const revealTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };

const imageVariants = {
  hidden:  { opacity: 0, scale: 1.04, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    filter: 'none' },
};
const imageTransition = { duration: 1.8, ease: [0.22, 1, 0.36, 1] };

const viewportOnce = { once: true, amount: 0.2 };

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


export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const tickerControls     = useAnimationControls();

  /* active variants — no animation when user prefers reduced motion */
  const activeRv  = shouldReduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : revealVariants;
  const activeRi  = shouldReduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : imageVariants;

  const [lightbox, setLightbox]     = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [menuOpen, setMenuOpen]     = useState(false);
  const [formOpen, setFormOpen]     = useState(false);
  const [formSent, setFormSent]     = useState(false);
  const [formData, setFormData]     = useState({ name: '', email: '', details: '' });
  const [activeWork, setActiveWork] = useState(0);

  /* ticker animation — start on mount, pause on hover */
  useEffect(() => {
    if (!shouldReduceMotion) {
      tickerControls.start({
        x: ['0%', '-50%'],
        transition: { duration: 38, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
      });
    }
  }, [shouldReduceMotion]);

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

  return (
    <>
      {/* ── GLOBAL ANIMATED BACKGROUND ─────────── */}
      <div className="global-anim"><AnimatedBackground /></div>

      {/* ── NAV ────────────────────────────────── */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <img src="/logo.png" alt="MYZE Media" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          <a href="#work">WORK</a>
          <a href="#services">SERVICES</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </div>
        <div
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span />
        </div>
      </nav>

      {/* ── MOBILE MENU ────────────────────────── */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <a href="#work"    onClick={() => setMenuOpen(false)}>WORK</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>SERVICES</a>
          <a href="#about"   onClick={() => setMenuOpen(false)}>ABOUT</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
        </div>
      )}

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
            then shape the website and visual identity<br />
            around the same direction.
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
      <div
        className="ticker"
        aria-hidden="true"
        onMouseEnter={() => tickerControls.stop()}
        onMouseLeave={() => { if (!shouldReduceMotion) tickerControls.start({ x: ['0%', '-50%'], transition: { duration: 38, ease: 'linear', repeat: Infinity, repeatType: 'loop' } }); }}
      >
        <motion.div
          className="ticker-track"
          animate={tickerControls}
        >
          {[0, 1].map(n => (
            <span key={n} className="ticker-set">
              {['BRAND FILMS','COMMERCIALS','SOCIAL CONTENT','INTERVIEWS','REBRAND','WEBSITE UPGRADE','VISUAL DIRECTION','BRAND CLARITY'].map(item => (

                <span key={item} className="ticker-item">
                  {item}<span className="ticker-dot">·</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
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
            WE CREATE THE CONTENT,<br /><span style={{color:'var(--red)'}}>THEN SHAPE THE BRAND AROUND IT.</span>
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
      <footer className="footer">
        <span className="footer-copy">© 2026 MYZE Media. All rights reserved.</span>
      </footer>

      {/* ── LIGHTBOX ───────────────────────────── */}
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

      {/* ── CONTACT FORM ───────────────────────── */}
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
