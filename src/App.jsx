import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from './AnimatedBackground';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

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

  /* scroll reveal */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

    const ctx = gsap.context(() => {

      /* hero headline — line by line */
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

      /* .reveal — text elements: soft upward fade */
      gsap.utils.toArray('.reveal').forEach(el => {
        const isHero = el.closest('.hero');
        if (prefersReduced) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(el,
          { opacity: 0, y: prefersReduced ? 0 : 18 },
          {
            opacity: 1, y: 0,
            duration: 1.1,
            ease,
            delay: isHero ? 0.3 : 0,
            scrollTrigger: isHero ? null : { trigger: el, start: 'top 92%' },
          }
        );
      });

      /* .reveal-stagger — stagger children */
      gsap.utils.toArray('.reveal-stagger').forEach(container => {
        if (prefersReduced) {
          gsap.set(container.children, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(Array.from(container.children),
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0,
            duration: 1.0,
            ease,
            stagger: 0.1,
            scrollTrigger: { trigger: container, start: 'top 90%' },
          }
        );
      });

      /* .reveal-image — images: fade + subtle scale */
      gsap.utils.toArray('.reveal-image').forEach(el => {
        if (prefersReduced) {
          gsap.set(el, { opacity: 1, scale: 1 });
          return;
        }
        gsap.fromTo(el,
          { opacity: 0, scale: 1.03 },
          {
            opacity: 1, scale: 1,
            duration: 1.3,
            ease,
            scrollTrigger: { trigger: el, start: 'top 92%' },
          }
        );
      });

      /* about-blurb: заголовок → текст */
      const blurbH = document.querySelector('.about-blurb-headline');
      const blurbB = document.querySelector('.about-blurb-body');
      if (blurbH && !prefersReduced) {
        gsap.fromTo(blurbH,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.0, ease,
            scrollTrigger: { trigger: blurbH, start: 'top 90%' } }
        );
        gsap.fromTo(blurbB,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.22,
            scrollTrigger: { trigger: blurbH, start: 'top 90%' } }
        );
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

    /* Начальное состояние */
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
          <h1 className="hero-headline">
            <span className="hero-line">PERCEPTION</span>
            <span className="hero-line">IS</span>
            <span className="hero-line">EVERYTHING</span>
          </h1>
          <p className="hero-sub reveal">
            Most brands don't lose to competitors.<br />
            They lose to how they look.<br />
            <br />
            We fix that.
          </p>
          <div className="hero-btns reveal">
            <a href="#work" className="btn-primary">VIEW SELECTED WORK</a>
            <button className="btn-outline" onClick={() => { setFormOpen(true); setFormSent(false); }}>START A PROJECT</button>
          </div>
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
        <div className="ticker-track">
          {[0, 1].map(n => (
            <span key={n} className="ticker-set">
              {['BRAND FILMS','COMMERCIAL VIDEOS','SOCIAL CONTENT','TESTIMONIAL VIDEOS','CORPORATE VIDEOS','MUSIC VIDEOS','CINEMATIC STORYTELLING','AI-ENHANCED PRODUCTION'].map(item => (
                <span key={item} className="ticker-item">
                  {item}<span className="ticker-dot">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK ───────────────────────────────── */}
      <section className="work-section" id="work">
        <div className="work-left reveal">
          <h2 className="work-headline">
            VISUALS THAT<br />POSITION.<br />NOT JUST IMPRESS.
          </h2>
          <a href="https://vimeo.com/myzemedia" target="_blank" rel="noopener noreferrer" className="text-link work-view-all">VIEW ALL WORK <span style={{color:'var(--red)'}}>→</span></a>
        </div>
        <div className="work-scroll-wrap">

          {/* ── MOBILE: горизонтальный скролл карточек ── */}
          <div className="work-mobile">
            <div className="work-cards reveal-stagger">
              {PROJECTS.map(p => (
                <button
                  key={p.id}
                  className="work-card reveal"
                  onClick={() => setLightbox(p.id)}
                >
                  <div
                    className="work-card-img"
                    style={thumbnails[p.id] ? { backgroundImage: `url(${thumbnails[p.id]})` } : {}}
                  />
                  <div className="work-card-info">
                    <span className="work-card-title">{p.title}</span>
                    <span className="work-card-tag">{p.tag}</span>
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
          <h2 className="about-blurb-headline">BUILT ON <span style={{color:'var(--red)'}}>CONTROL.</span></h2>
          <p className="about-blurb-body">
            Direction first.<br />
            Production follows.<br />
            Execution stays controlled.
          </p>
        </div>
        <div className="split-image">
          <img src="/fasion.png" alt="" className="split-img" />
        </div>
      </section>

      {/* ── OUR APPROACH ───────────────────────── */}
      <section className="approach-section" id="about">
        <div className="split-image">
          <img src="/business.png" alt="" className="split-img" />
        </div>
        <div className="approach-text">
          <h2 className="about-blurb-headline">
            OUR <span style={{color:'var(--red)'}}>APPROACH</span>
          </h2>
          <div className="approach-statement">
            <p>We don't start with cameras.<br />We start with perception.</p>
            <p>Direction defines everything.<br />Production follows.<br />Execution stays controlled.</p>
            <p>From first idea to final frame.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ─────────────────────────── */}
      <section className="services-section" id="services">
        <div className="split-text">
          <h2 className="about-blurb-headline">WHAT <span style={{color:'var(--red)'}}>WE DO</span></h2>
          <div className="services-simple">
            <p className="services-list">
              We create cinematic systems.<br />
              We direct how brands are perceived.<br />
              We build controlled visual outcomes.
            </p>
            </div>
        </div>
        <div className="split-image">
          <img src="/whatwedo.png" alt="" className="split-img" />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────── */}
      <section className="process-section">
        <h2 className="about-blurb-headline reveal">
          HOW IT <span style={{color:'var(--red)'}}>WORKS</span>
        </h2>
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
        <div className="contact-text reveal">
          <div className="contact-social">
            <a href="https://www.instagram.com/myzem_edia" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">VIMEO</a>
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
        </div>
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
              src={`https://player.vimeo.com/video/${lightbox}?autoplay=1&color=8B2D2D&title=0&byline=0&portrait=0`}
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
