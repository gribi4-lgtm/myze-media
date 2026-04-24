import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import AnimatedBackground from './AnimatedBackground';
import './index.css';

/* ── FRAMER MOTION VARIANTS ──────────────────── */
const rv = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
};
const rt = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };

const ri = {
  hidden:  { opacity: 0, scale: 1.04, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    filter: 'blur(0px)' },
};
const rit = { duration: 1.8, ease: [0.22, 1, 0.36, 1] };

const vp = { once: true, amount: 0.2 };

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

const STEPS = [
  { num: '01', title: 'DISCOVERY',   desc: 'We start with your goals, audience, and brand position. The right questions asked early save weeks of revision later.' },
  { num: '02', title: 'CONCEPT',     desc: 'We develop a creative direction before touching a camera. Every visual decision starts with intent.' },
  { num: '03', title: 'PRODUCTION',  desc: 'Full-cycle execution — locations, crew, direction, and editing. Controlled from first frame to final cut.' },
  { num: '04', title: 'DELIVERY',    desc: 'Optimised assets delivered on time. Ready for any platform, without compromise.' },
];


export default function App() {
  const [lightbox, setLightbox]     = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [menuOpen, setMenuOpen]     = useState(false);
  const [formOpen, setFormOpen]     = useState(false);
  const [formSent, setFormSent]     = useState(false);
  const [formData, setFormData]     = useState({ name: '', email: '', details: '' });
  const [activeWork, setActiveWork] = useState(0);

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

  /* form submit → Formspree */
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
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
    }
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
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="sr-only">Cinematic Brand Films &amp; Commercial Production — NJ &amp; NY</h1>
          <h2 className="hero-headline">
            <span className="hero-line">PERCEPTION</span>
            <span className="hero-line">IS</span>
            <span className="hero-line">EVERYTHING</span>
          </h2>
          <motion.p
            className="hero-sub"
            variants={rv}
            initial="hidden"
            animate="visible"
            transition={{ ...rt, delay: 0.75 }}
          >
            Most brands don't lose to competitors.<br />
            They lose to how they look.<br />
            <br />
            We fix that.
          </motion.p>
          <motion.div
            className="hero-btns"
            variants={rv}
            initial="hidden"
            animate="visible"
            transition={{ ...rt, delay: 0.95 }}
          >
            <a href="#work" className="btn-primary">VIEW SELECTED WORK</a>
            <button className="btn-outline" onClick={() => { setFormOpen(true); setFormSent(false); }}>START A PROJECT</button>
          </motion.div>
        </div>
        <div className="hero-side-label">
          <div className="hero-side-line" />
          <span className="hero-side-text">CINEMATIC BRAND STUDIO</span>
          <div className="hero-side-dot" />
        </div>
        <div className="hero-scroll">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── TICKER ─────────────────────────────── */}
      <div className="ticker" aria-hidden="true">
        <motion.div
          className="ticker-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 38, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        >
          {[0, 1].map(n => (
            <span key={n} className="ticker-set">
              {['BRAND FILMS','COMMERCIAL VIDEOS','SOCIAL CONTENT','TESTIMONIAL VIDEOS','CORPORATE VIDEOS','MUSIC VIDEOS','CINEMATIC STORYTELLING','AI-ENHANCED PRODUCTION'].map(item => (
                <span key={item} className="ticker-item">
                  {item}<span className="ticker-dot">·</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── WORK ───────────────────────────────── */}
      <section className="work-section" id="work">
        <motion.div
          className="work-left"
          variants={rv}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={rt}
        >
          <h2 className="work-headline">
            VISUALS THAT<br />POSITION.<br />NOT JUST IMPRESS.
          </h2>
          <a href="https://vimeo.com/myzemedia" target="_blank" rel="noopener noreferrer" className="text-link work-view-all">VIEW ALL WORK <span style={{color:'var(--red)'}}>→</span></a>
        </motion.div>
        <div className="work-scroll-wrap">

          {/* ── MOBILE: вертикальный аккордеон ── */}
          <div className="work-mobile">
            <div className="wm-acc">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  className={`wm-panel${activeWork === i ? ' active' : ''}`}
                  style={thumbnails[p.id] ? { backgroundImage: `url(${thumbnails[p.id]})` } : {}}
                  onClick={() => activeWork === i ? setLightbox(p.id) : setActiveWork(i)}
                  aria-label={activeWork === i ? `Play ${p.title}` : `Open ${p.title}`}
                >
                  <div className="wm-overlay" />
                  {activeWork === i && (
                    <div className="wm-play">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  )}
                  <div className="wm-info">
                    <span className="wm-tag">{p.tag}</span>
                    <span className="wm-title">{p.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── DESKTOP: горизонтальный аккордеон ── */}
          <div className="work-desktop">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className={`wa-panel${activeWork === i ? ' active' : ''}`}
                onMouseEnter={() => setActiveWork(i)}
                onClick={() => activeWork === i ? setLightbox(p.id) : setActiveWork(i)}
                role="button"
                tabIndex={0}
                aria-label={`Play ${p.title}`}
              >
                {thumbnails[p.id]
                  ? <img src={thumbnails[p.id]} alt={p.title} className="wa-bg" loading="lazy" />
                  : <div className="wa-bg-placeholder" />
                }
                <div className="wa-overlay" />
                <div className="wa-play">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <div className="wa-info">
                  <span className="wa-tag">{p.tag}</span>
                  <span className="wa-title-text">{p.title}</span>
                </div>
                <span className="wa-title-vert">{p.title}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── BUILT ON CONTROL ───────────────────── */}
      <section className="about-blurb">
        <div className="split-text">
          <motion.h2
            className="about-blurb-headline"
            variants={rv}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rt}
          >
            BUILT ON <span style={{color:'var(--red)'}}>CONTROL.</span>
          </motion.h2>
          <motion.p
            className="about-blurb-body"
            variants={rv}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ ...rt, delay: 0.1 }}
          >
            Direction first.<br />
            Production follows.<br />
            Execution stays controlled.
          </motion.p>
        </div>
        <div className="split-image">
          <motion.img
            src="/fasion.png"
            alt=""
            className="split-img"
            variants={ri}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rit}
          />
        </div>
      </section>

      {/* ── OUR APPROACH ───────────────────────── */}
      <section className="approach-section" id="about">
        <div className="split-image">
          <motion.img
            src="/business.png"
            alt=""
            className="split-img"
            variants={ri}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rit}
          />
        </div>
        <div className="approach-text">
          <motion.h2
            className="about-blurb-headline"
            variants={rv}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rt}
          >
            OUR <span style={{color:'var(--red)'}}>APPROACH</span>
          </motion.h2>
          <motion.div
            className="approach-statement"
            variants={rv}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ ...rt, delay: 0.1 }}
          >
            <p>We don't start with cameras.<br />We start with perception.</p>
            <p>Direction defines everything.<br />Production follows.<br />Execution stays controlled.</p>
            <p>From first idea to final frame.</p>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT WE DO ─────────────────────────── */}
      <section className="services-section" id="services">
        <div className="split-text">
          <motion.h2
            className="about-blurb-headline"
            variants={rv}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rt}
          >
            WHAT <span style={{color:'var(--red)'}}>WE DO</span>
          </motion.h2>
          <div className="services-simple">
            <motion.p
              className="services-list"
              variants={rv}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              transition={{ ...rt, delay: 0.1 }}
            >
              We create cinematic systems.<br />
              We direct how brands are perceived.<br />
              We build controlled visual outcomes.
            </motion.p>
          </div>
        </div>
        <div className="split-image">
          <motion.img
            src="/whatwedo.png"
            alt=""
            className="split-img"
            variants={ri}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={rit}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────── */}
      <section className="process-section">
        <motion.h2
          className="about-blurb-headline"
          variants={rv}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={rt}
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
          variants={rv}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={rt}
        >
          <div className="contact-social">
            <a href="https://www.instagram.com/myze.media" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            <a href="https://vimeo.com/myzemedia" target="_blank" rel="noopener noreferrer">VIMEO</a>
            <a href="mailto:mike@myzemedia.com">EMAIL</a>
          </div>
          <h2 className="contact-headline">
            Ready to look like<br />a brand people trust?
          </h2>
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
