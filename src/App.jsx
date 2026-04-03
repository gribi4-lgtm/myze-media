import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ThreeBackground from './ThreeBackground';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
    {
        num: '01',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="4" />
            </svg>
        ),
        title: 'Concept Development',
        desc: 'We start with strategy. What\'s your goal? Who\'s your audience? We architect the story, define the message, and build the production plan before we ever pick up a camera.',
    },
    {
        num: '02',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M2 8h20" />
                <path d="M12 3v5" />
            </svg>
        ),
        title: 'Brand & Commercial Films',
        desc: 'TV commercials, corporate videos, and long-form brand films delivered at a cinematic level. Content that commands attention and communicates your premium positioning instantly.',
    },
    {
        num: '03',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
        title: 'Promo & Social Content',
        desc: 'High-impact promotional videos and social-first content for Instagram, TikTok, and YouTube — engineered to stop the scroll and drive measurable business results.',
    },
    {
        num: '04',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
        title: 'Documentary Production',
        desc: 'Thought-provoking documentary-style storytelling that builds deep trust with your audience. We find the human truth in your brand and put it on screen.',
    },
];

const PORTFOLIO = [
    {
        vimeoId: '1179769681',
        tag: 'Brand Documentary',
        title: 'Judaica Creations by Aliza Blizinski',
    },
    {
        vimeoId: '1179772667',
        tag: 'Commercial / Storytelling',
        title: 'BOOTS Director Cut',
    },
    {
        vimeoId: '1179772810',
        tag: 'Narrative Film',
        title: 'Narrative Test',
    },
];

const RESULTS = [
    { num: '250%', label: 'Increase in Conversions' },
    { num: '4.2x', label: 'Return on Investment' },
    { num: '180%', label: 'Increase in Brand Awareness' },
];

const SKILLS = [
    { name: 'Cinematography', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    ), desc: 'Crafting visually stunning sequences that capture the essence of your brand' },
    { name: 'Color Grading', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    ), desc: 'Setting the perfect cinematic mood with industry-standard grading' },
    { name: 'Video Editing', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    ), desc: 'Precision pacing that keeps audiences engaged from start to finish' },
    { name: 'Motion Design', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    ), desc: 'Elevating visuals with dynamic, high-end motion graphics' },
];

let audioCtx = null;
const playHoverSound = () => {
    if (typeof window === 'undefined') return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Premium soft UI "tick" (high to low sweep very fast)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.04);

        // Low volume to not be annoying
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
        // Ignored. Autoplay policies block audio until first user interaction.
    }
};

export default function App() {
    const navRef = useRef(null);
    const trackRef = useRef(null);
    const counterRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [thumbnails, setThumbnails] = useState({});
    const preloaderNumRef = useRef(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (navigator.vibrate) navigator.vibrate([15, 100, 30]); // Success haptic feedback
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        Promise.all(
            PORTFOLIO.map((item) =>
                fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${item.vimeoId}&width=1280`)
                    .then(r => r.json())
                    .then(data => data.thumbnail_url ? [item.vimeoId, data.thumbnail_url] : null)
                    .catch(() => null)
            )
        ).then(results => {
            const merged = {};
            results.forEach(entry => { if (entry) merged[entry[0]] = entry[1]; });
            setThumbnails(merged);
        });
    }, []);

    useEffect(() => {
        const handleHover = (e) => {
            const el = e.target.closest('a, button, .portfolio-slide, .nav-logo');
            if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) {
                playHoverSound();
            }
        };

        const handleClick = (e) => {
            const el = e.target.closest('a, button, .portfolio-slide, .nav-logo');
            if (el) {
                if (navigator.vibrate) {
                    navigator.vibrate(15);
                }
            }
        };

        const handleMagneticMove = (e) => {
            if(window.innerWidth < 1024) return;
            const btn = e.target.closest('.btn, .nav-logo');
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Magnet strength: 0.35
                gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
            }
        };

        const handleMagneticOut = (e) => {
            if(window.innerWidth < 1024) return;
            const btn = e.target.closest('.btn, .nav-logo');
            if (btn && (!e.relatedTarget || !btn.contains(e.relatedTarget))) {
                // Snap back physics
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            }
        };

        document.addEventListener('mouseover', handleHover, { passive: true });
        document.addEventListener('click', handleClick, { passive: true });
        document.addEventListener('mousemove', handleMagneticMove, { passive: true });
        document.addEventListener('mouseout', handleMagneticOut, { passive: true });

        return () => {
            document.removeEventListener('mouseover', handleHover);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('mousemove', handleMagneticMove);
            document.removeEventListener('mouseout', handleMagneticOut);
        };
    }, []);

    useEffect(() => {
        if (!activeVideo) return;
        const onKey = (e) => { if (e.key === 'Escape') setActiveVideo(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeVideo]);

    useEffect(() => {
        const nav = navRef.current;
        const onScroll = () => {
            if (window.scrollY > 60) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll);

        const ctx = gsap.context(() => {
            // Cinematic Preloader Sequence
            let countObj = { value: 0 };
            gsap.to(countObj, {
                value: 100,
                duration: 2.2,
                ease: "power3.inOut",
                onUpdate: () => {
                    if (preloaderNumRef.current) {
                        preloaderNumRef.current.innerText = Math.round(countObj.value) + '%';
                    }
                },
                onComplete: () => {
                    gsap.to('.preloader-wrapper', {
                        yPercent: -100,
                        duration: 1.2,
                        ease: "power4.inOut",
                        onComplete: () => setIsLoading(false)
                    });
                }
            });

            gsap.set('.will-animate', { opacity: 0, y: 35 });

            // Adjusted delays so content appears exactly as preloader black curtain slides up
            gsap.from('.hero-tag', { opacity: 0, y: 20, duration: 0.8, delay: 2.5, ease: 'power3.out' });
            gsap.from('.hero-headline', { opacity: 0, y: 40, duration: 1, delay: 2.7, ease: 'power3.out' });
            gsap.from('.hero-subtext', { opacity: 0, y: 30, duration: 0.8, delay: 2.9, ease: 'power3.out' });
            gsap.from('.hero-ctas', { opacity: 0, y: 20, duration: 0.7, delay: 3.1, ease: 'power3.out' });
            gsap.from('.hero-scroll', { opacity: 0, duration: 0.6, delay: 3.5, ease: 'power3.out' });

            gsap.utils.toArray('.will-animate').forEach((el) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 35 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                    }
                );
            });

            gsap.from('.service-card', {
                scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });

            gsap.from('.result-stat', {
                scrollTrigger: { trigger: '.results-grid', start: 'top 85%' },
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });

            const mm = gsap.matchMedia();

            // ── Desktop: pin + horizontal scroll ──────────────
            mm.add('(min-width: 768px)', () => {
              const track = trackRef.current;
              if (!track) return;

              gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                  trigger: '#work',
                  start: 'top top',
                  end: () => `+=${track.scrollWidth - window.innerWidth}`,
                  pin: true,
                  scrub: 1,
                  invalidateOnRefresh: true,
                  anticipatePin: 1,
                  onUpdate: (self) => {
                    const index = Math.min(
                      PORTFOLIO.length - 1,
                      Math.round(self.progress * (PORTFOLIO.length - 1))
                    );
                    if (counterRef.current) {
                      const activeSpan = counterRef.current.querySelector('.active-num');
                      if (activeSpan) {
                        activeSpan.textContent = String(index + 1).padStart(2, '0');
                      }
                    }
                  },
                },
              });
            });

            // ── Mobile: vertical fade-in ──────────────────────
            mm.add('(max-width: 767px)', () => {
              gsap.from('.portfolio-slide', {
                scrollTrigger: {
                  trigger: '.portfolio-track',
                  start: 'top 85%',
                },
                opacity: 0,
                scale: 0.96,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
              });
            });
        });

        return () => {
            window.removeEventListener('scroll', onScroll);
            ctx.revert();
        };
    }, []);

    return (
        <div className={`app${menuOpen ? ' menu-is-open' : ''}`}>

            {/* ── Preloader ─────────────────────────── */}
            {isLoading && (
                <div className="preloader-wrapper">
                    <span className="preloader-num" ref={preloaderNumRef}>0%</span>
                </div>
            )}

            {/* ── Fixed Full-Page 3D Background ──────── */}
            <div className="bg-canvas-wrap">
                <ThreeBackground />
            </div>

            {/* ── Navigation ────────────────────────── */}
            <nav className="nav" ref={navRef}>
                <div className="container nav-inner">
                    <a href="#" className="nav-logo" onClick={closeMenu}>
                        <img src="/logo.png" alt="MYZE Media" className="nav-logo-img" />
                    </a>
                    <div className="nav-links">
                        <a href="#services">Services</a>
                        <a href="#work">Work</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <button
                        className={`hamburger${menuOpen ? ' is-open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* ── Fullscreen Menu Overlay ───────────── */}
            <div className={`menu-overlay${menuOpen ? ' is-open' : ''}`}>
                <nav className="menu-overlay-nav">
                    <a href="#services" onClick={closeMenu}>Services</a>
                    <a href="#work" onClick={closeMenu}>Work</a>
                    <a href="#about" onClick={closeMenu}>About</a>
                    <a href="#contact" onClick={closeMenu}>Contact</a>
                </nav>
                <div className="menu-overlay-footer">
                    <span>New Jersey &amp; New York, NY</span>
                    <span className="text-accent">myze.media</span>
                </div>
            </div>

            {/* ── Hero ──────────────────────────────── */}
            <section className="hero" id="hero">
                <div className="hero-vignette" />

                <div className="container hero-content">
                    <div className="hero-tag">
                        Creative Video House
                    </div>
                    <h1 className="hero-headline">
                        Your brand doesn't need another video. It needs a <em>story worth watching.</em>
                    </h1>
                    <p className="hero-subtext">
                        MYZE Media is a full-service video production studio helping brands, businesses, and agencies inspire audiences — through cinematic storytelling that drives real results.
                    </p>
                    <div className="hero-ctas">
                        <a href="#work" className="btn btn-primary">View Our Work →</a>
                        <a href="#contact" className="btn btn-outline">Get In Touch</a>
                    </div>
                </div>

                <div className="hero-scroll">
                    <div className="scroll-line" />
                    <span>Scroll</span>
                </div>
            </section>

            {/* ── Services ──────────────────────────── */}
            <section id="services">
                <div className="container">
                    <div className="will-animate">
                        <span className="eyebrow">What We Do</span>
                        <h2 className="section-heading">
                            Strategy. Creative. Production.<br /><em>Tailor-made for you.</em>
                        </h2>
                        <p className="section-subtext">
                            Every engagement begins with your goals. We develop the concept, craft the narrative, and execute at a level that commands attention — with no wasted time or budget.
                        </p>
                    </div>

                    <div className="services-grid">
                        {SERVICES.map((s) => (
                            <div className="service-card" key={s.num}>
                                <div className="service-num">{s.num}</div>
                                <div className="service-icon">{s.icon}</div>
                                <h3 className="service-title">{s.title}</h3>
                                <p className="service-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="hairline" />

            {/* ── Portfolio Film Reel ─────────────────── */}
            <section id="work">
              <div className="container">
                <div className="will-animate portfolio-header">
                  <div>
                    <span className="eyebrow">Our Work</span>
                    <h2 className="section-heading">Selected Projects</h2>
                  </div>
                  <span className="portfolio-counter" ref={counterRef}>
                    <span className="active-num">01</span> / {String(PORTFOLIO.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="portfolio-reel">
                <div className="portfolio-track" ref={trackRef}>
                  {PORTFOLIO.map((p) => (
                    <div
                      className="portfolio-slide"
                      key={p.vimeoId}
                      role="button"
                      tabIndex={0}
                      aria-label={`Play ${p.title}`}
                      onClick={() => setActiveVideo(p.vimeoId)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveVideo(p.vimeoId); } }}
                    >
                      <div className="portfolio-slide-inner">
                        {thumbnails[p.vimeoId] ? (
                          <img
                            src={thumbnails[p.vimeoId]}
                            alt={p.title}
                            className="portfolio-video"
                            loading="lazy"
                          />
                        ) : (
                          <div className="portfolio-thumb-placeholder" />
                        )}
                        <div className="portfolio-overlay">
                          <div className="portfolio-play">▶</div>
                          <div className="portfolio-tag">{p.tag}</div>
                          <div className="portfolio-title">{p.title}</div>
                        </div>
                      </div>
                      <div className="portfolio-slide-meta">
                        <div className="portfolio-tag">{p.tag}</div>
                        <div className="portfolio-title">{p.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="hairline" />

            {/* ── Built For Results ─────────────────── */}
            <section id="results" className="results-section">
                <div className="container">
                    <div className="results-eyebrow will-animate">Built For Results</div>
                    <div className="results-grid">
                        {RESULTS.map((r) => (
                            <div className="result-stat" key={r.label}>
                                <div className="result-num">{r.num}</div>
                                <div className="result-label">{r.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="results-note">Based on average client data, 2023–2025</p>
                </div>
            </section>

            <div className="hairline" />

            {/* ── About ──────────────────────────────── */}
            <section id="about">
                <div className="container">
                    <div className="about-text will-animate">
                        <span className="eyebrow">About MYZE Media</span>
                        <h2 className="section-heading">
                            We're not just a production company.
                        </h2>
                        <p className="section-subtext">
                            MYZE Media is a full-cycle video production studio operating across NJ and NY — specializing in brand films, TV commercials, and documentary content. We shoot, direct, and edit everything in-house: no outsourcing, no middlemen, full creative control from concept to final delivery.
                        </p>
                        <p className="section-subtext">
                            When it gives us an edge, we integrate AI into our workflow — for smarter scripting, faster iteration, and sharper storytelling. We're not replacing creativity; we're amplifying it.
                        </p>
                        <p className="section-subtext">
                            Your brand is unique — and so should its story. We partner with businesses to uncover their voice and connect with audiences through innovative, passionate filmmaking. Our work has earned recognition at PROMAX BDA and the Cannes Blue Dolphin, reflecting the caliber of craft we bring to every project.
                        </p>
                    </div>

                    <div className="skills-grid will-animate">
                        {SKILLS.map((skill) => (
                            <div className="skill-card" key={skill.name}>
                                <div className="skill-icon">{skill.icon}</div>
                                <div className="skill-info">
                                    <h4 className="skill-name">{skill.name}</h4>
                                    <p className="skill-desc">{skill.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="how-we-work will-animate">
                        <div className="hww-card">
                            <div className="hww-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                                    <line x1="16" y1="8" x2="2" y2="22" />
                                    <line x1="17.5" y1="15" x2="9" y2="6.5" />
                                </svg>
                            </div>
                            <h4 className="hww-title">We Do It Ourselves</h4>
                            <p className="hww-desc">Every project shot and edited in-house — by the same team, start to finish.</p>
                        </div>
                        <div className="hww-card">
                            <div className="hww-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                                    <rect x="3" y="11" width="18" height="10" rx="2" />
                                    <circle cx="12" cy="5" r="2" />
                                    <path d="M12 7v4" />
                                    <line x1="8" y1="16" x2="8" y2="16" />
                                    <line x1="16" y1="16" x2="16" y2="16" />
                                </svg>
                            </div>
                            <h4 className="hww-title">AI-Enhanced</h4>
                            <p className="hww-desc">We use AI to work smarter, not harder — faster turnarounds, sharper results.</p>
                        </div>
                        <div className="hww-card">
                            <div className="hww-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h4 className="hww-title">Scalable Team</h4>
                            <p className="hww-desc">We scale up with trusted collaborators for bigger productions when needed.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="hairline" />

            {/* ── Footer with Contact ───────────────── */}
            <footer className="footer" id="contact">
                <div className="container">

                    <div className="footer-contact">
                        <div className="footer-contact-left">
                            <span className="eyebrow">Contact Us</span>
                            <h2 className="section-heading footer-heading">
                                Ready to make<br />something amazing?
                            </h2>
                            <p className="footer-tagline">
                                We typically respond within 24 hours.
                            </p>
                            <div className="footer-contact-details">
                                <a href="mailto:mikes@heet.nyc" className="contact-detail-row">
                                    <span className="contact-detail-label">Email</span>
                                    <span className="contact-detail-value">mikes@heet.nyc</span>
                                </a>
                                <a href="tel:+13472542324" className="contact-detail-row">
                                    <span className="contact-detail-label">Phone</span>
                                    <span className="contact-detail-value">(347) 254-2324</span>
                                </a>
                            </div>
                        </div>

                        <form className="footer-form" onSubmit={handleFormSubmit}>
                            {isSubmitted ? (
                                <div className="form-success-message">
                                    <h3>Message Sent</h3>
                                    <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="f-name">Full Name</label>
                                        <input id="f-name" type="text" placeholder="John Smith" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="f-email">Email</label>
                                        <input id="f-email" type="email" placeholder="john@company.com" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="f-msg">Message</label>
                                        <textarea id="f-msg" rows="3" placeholder="Tell us about your project..." required />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-full">
                                        Send Message →
                                    </button>
                                </>
                            )}
                        </form>
                    </div>

                    <div className="hairline footer-hairline" />

                    <div className="footer-bottom">
                        <span className="footer-copy">© 2026 MYZE Media. All rights reserved.</span>
                        <div className="footer-links">
                            <a href="#services">Services</a>
                            <a href="#work">Work</a>
                            <a href="#about">About</a>
                        </div>
                    </div>

                </div>
            </footer>

            {/* ── Video Modal ───────────────────────── */}
            {activeVideo && (
                <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
                    <button className="video-modal-close" onClick={() => setActiveVideo(null)}>✕</button>
                    <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                        <iframe
                            src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&title=0&byline=0&portrait=0&color=B65F46`}
                            className="modal-video"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={PORTFOLIO.find(p => p.vimeoId === activeVideo)?.title || 'Video'}
                        />
                    </div>
                </div>
            )}


        </div>
    );
}
