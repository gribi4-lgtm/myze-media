import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AnimatedBackground from './AnimatedBackground';
import CardBorder from './CardBorder';
import Entropy from './Entropy';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
    {
        num: '01',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M2 8h20" />
                <path d="M12 3v5" />
            </svg>
        ),
        title: 'Commercials',
        desc: 'We skillfully craft commercials tailored precisely to your core audience. Our industry knowledge combined with a strong creative vision ensures maximum impact — content that captivates and connects.',
    },
    {
        num: '02',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
        title: 'Promo Videos',
        desc: 'Promo content must immediately grab attention or it gets lost. We create promos with a clear, direct call to action — content that not only captivates your audience but inspires them to engage.',
    },
    {
        num: '03',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        title: 'Fashion',
        desc: 'Fashion shows, backstage coverage, and model portfolios — captured with cinematic precision. With 8 years in the fashion industry, we know how to tell your story in promo or documentary format.',
    },
    {
        num: '04',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
        title: 'Documentary',
        desc: 'We have executed documentary projects across the United States and Europe. Whether capturing compelling stories or significant events, we bring the expertise to take your narrative anywhere in the world.',
    },
];

const PORTFOLIO_REAL = [
    {
        vimeoId: '1183970428',
        tag: 'Music Video',
        title: 'Valkyrie',
    },
    {
        vimeoId: '1181225815',
        tag: 'AI Video',
        title: 'Trish Peng Bridal Concept',
    },
    {
        vimeoId: '1183969203',
        tag: 'Fashion Film',
        title: 'ISMAELINA',
    },
    {
        vimeoId: '1179769681',
        tag: 'Brand Documentary',
        title: 'Judaica Creations',
    },
    {
        vimeoId: '1179772667',
        tag: 'Commercial / Product',
        title: 'Under Armour',
    },
    {
        vimeoId: '1181245077',
        tag: 'AI Video',
        title: 'Bridal Designer Concept',
    },
    {
        vimeoId: '1180499080',
        tag: 'Bridal / Fashion',
        title: 'Joseph Sayadi Bridal',
    },
];

const PORTFOLIO_AI = [
    // AI-generated videos will be added here
];

const RESULTS = [
    { num: '91%', label: 'of businesses now use video as a marketing tool' },
    { num: '80%', label: 'higher conversions on landing pages with video' },
    { num: '49%', label: 'faster revenue growth for brands with video strategy' },
];

const CLIENTS = [
    { name: 'Judaica Creations' },
    { name: 'Under Armor' },
    { name: 'Complete Care' },
    { name: 'Jemme Huang Bridal' },
    { name: 'Momentum Capital' },
    { name: 'BB NYC' },
];

const SKILLS = [
    { name: 'Cinematography', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    ), desc: 'Crafting visually stunning sequences that capture the essence of your brand' },
    { name: 'AI Integration', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" />
            <path d="M4.93 4.93a2 2 0 0 1 2.83 0l1.41 1.41a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0L4.93 7.76a2 2 0 0 1 0-2.83z" />
            <path d="M14.83 14.83a2 2 0 0 1 2.83 0l1.41 1.41a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-1.41-1.41a2 2 0 0 1 0-2.83z" />
            <path d="M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
            <path d="M16 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
        </svg>
    ), desc: 'We integrate AI into production when the project calls for it — smart tools, real results' },
    { name: 'Editing & Color', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    ), desc: 'Precision cuts and cinematic color grading — paced to hold attention, graded to set the mood' },
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

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accordionActive, setAccordionActive] = useState(0);
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
            PORTFOLIO_REAL.map((item) =>
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

            // ── Mobile: accordion fade-in ──────────────────────
            mm.add('(max-width: 767px)', () => {
              gsap.from('.accordion-panel', {
                scrollTrigger: {
                  trigger: '.accordion-portfolio',
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

            {/* ── Fixed 3D Background ────────────────── */}
            <div className="bg-canvas-wrap">
                <AnimatedBackground />
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
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ────────────────── */}
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

                {/* Entropy canvas animation — replaces hero model */}
                <Entropy style={{ opacity: 0.6, zIndex: 1 }} />

                <div className="hero-vignette" />

                {/* Text on top */}
                <div className="container hero-content">
                    <div className="hero-tag">CREATIVE VIDEO PRODUCTION HOUSE</div>
                    <h1 className="hero-headline">
                        We build<br /><em>brands</em><br />on screen.
                    </h1>
                    <p className="hero-subtext">
                        Real production meets AI innovation.<br />Commercial-grade results, every time.
                    </p>
                    <div className="hero-ctas">
                        <a href="#work" className="btn btn-primary">View Our Work</a>
                        <a href="#contact" className="btn btn-outline">Get In Touch</a>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-label">We blend creative direction with AI-accelerated production to deliver premium video faster</span>
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
                    <div className="services-header will-animate">
                        <div>
                            <span className="eyebrow">What We Do</span>
                            <h2 className="section-heading">Our<br />Arsenal</h2>
                        </div>
                        <p className="section-subtext">
                            Full-stack production capabilities tailored for brands that want to dominate their market.<br /><br />When a vision demands more than a camera can capture, we bring in AI — expanding what's possible without touching the quality.
                        </p>
                    </div>
                    <div className="services-grid">
                        {SERVICES.map((s) => (
                            <div className="service-card" key={s.num}>
                                <CardBorder />
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

            {/* ── How It Works ──────────────────────── */}
            <section id="process">
                <div className="container">
                    <div className="will-animate process-header">
                        <span className="eyebrow">Our Process</span>
                        <h2 className="section-heading">How It<br />Works</h2>
                    </div>
                    <div className="process-steps">
                        {[
                            {
                                num: '01', title: 'Discovery', desc: 'We start by understanding your goals, budget, and target audience. This is where we ask the right questions so nothing gets lost in production.',
                                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            },
                            {
                                num: '02', title: 'Proposal', desc: 'Based on the discovery, we build a tailored proposal with clear options. You know exactly what you\'re getting and what it costs — no surprises.',
                                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            },
                            {
                                num: '03', title: 'Creative Concepts', desc: 'Our team develops creative ideas that align with your brand strategy. We present concepts before we ever touch a camera.',
                                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/><circle cx="12" cy="12" r="4"/></svg>
                            },
                            {
                                num: '04', title: 'Production', desc: 'We handle everything — locations, crew, shooting, editing, and final delivery. Full-cycle production, start to finish, in-house.',
                                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            },
                        ].map((step) => (
                            <div className="process-card will-animate" key={step.num}>
                                <CardBorder />
                                <div className="process-step-num">{step.num}</div>
                                <div className="process-step-icon">{step.icon}</div>
                                <h3 className="process-step-title">{step.title}</h3>
                                <p className="process-step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="hairline" />

            {/* ── Portfolio ──────────────────────────── */}
            <section id="work">
                <div className="container">
                    <div className="will-animate portfolio-header">
                        <div>
                            <h2 className="section-heading">Portfolio</h2>
                        </div>
                    </div>
                </div>

                <div className="work-marquee-wrap">
                    <div className="work-marquee-track">
                        {['Social Media Videos', 'Brand Videos', 'Promo Videos', 'Commercials', 'Documentaries', 'Product Videos', 'Testimonial Videos', 'Corporate Videos', 'Music Videos', 'Cinematic Storytelling', 'AI-Enhanced Production', 'Color Grading', 'Motion Graphics'].map((item, i) => (
                            <span key={i} className="work-marquee-item">{item} <span className="work-marquee-dot">·</span></span>
                        ))}
                        {['Social Media Videos', 'Brand Videos', 'Promo Videos', 'Commercials', 'Documentaries', 'Product Videos', 'Testimonial Videos', 'Corporate Videos', 'Music Videos', 'Cinematic Storytelling', 'AI-Enhanced Production', 'Color Grading', 'Motion Graphics'].map((item, i) => (
                            <span key={`dup-${i}`} className="work-marquee-item">{item} <span className="work-marquee-dot">·</span></span>
                        ))}
                    </div>
                </div>

                <div className="accordion-portfolio">
                    {PORTFOLIO_REAL.map((p, index) => (
                        <div
                            key={p.vimeoId}
                            className={`accordion-panel${accordionActive === index ? ' active' : ''}`}
                            onMouseEnter={() => setAccordionActive(index)}
                            onClick={() => accordionActive === index ? setActiveVideo(p.vimeoId) : setAccordionActive(index)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Play ${p.title}`}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveVideo(p.vimeoId); } }}
                        >
                            {thumbnails[p.vimeoId] ? (
                                <img src={thumbnails[p.vimeoId]} alt={p.title} className="accordion-bg" loading="lazy" />
                            ) : (
                                <div className="accordion-bg-placeholder" />
                            )}
                            <div className="accordion-overlay" />
                            <div className="accordion-play">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            </div>
                            <div className="accordion-info">
                                <span className="accordion-tag">{p.tag}</span>
                                <span className="accordion-title-text">{p.title}</span>
                            </div>
                            <span className="accordion-title-vertical">{p.title}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="hairline" />

            {/* ── Results ────────────────────────────── */}
            <section id="results" className="results-section">
                <div className="container">
                    <div className="results-eyebrow will-animate">Industry Data, 2024</div>
                    <h2 className="results-heading will-animate">Video Is The<br />New Standard</h2>
                    <div className="results-grid">
                        {RESULTS.map((r) => (
                            <div className="result-stat" key={r.label}>
                                <CardBorder />
                                <div className="result-num">{r.num}</div>
                                <div className="result-label">{r.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="results-note">Source: Wyzowl State of Video Marketing 2024 — wyzowl.com/video-marketing-statistics</p>
                </div>
            </section>

            <div className="hairline" />

            {/* ── About ──────────────────────────────── */}
            <section id="about">
                <div className="container">
                    <div className="about-grid will-animate">
                        {/* Image side */}
                        <div className="about-image-wrapper">
                            <div className="about-image-placeholder">Behind the lens</div>
                            <div className="about-badge">Est. 2026 — NJ & NY</div>
                        </div>

                        {/* Text side */}
                        <div className="about-text">
                            <span className="eyebrow">Our DNA</span>
                            <h2 className="section-heading">Not Your<br />Average<br />Production<br />Company</h2>
                            <p className="section-subtext">
                                MYZE Media is a full-cycle video production house operating across NJ and NY. We shoot, direct, and edit everything in-house — no outsourcing, no middlemen, full creative control from concept to final delivery.
                            </p>
                            <p className="section-subtext" style={{ marginTop: '1.2rem' }}>
                                AI-powered workflows — 2x faster delivery, same cinematic quality. We're not replacing creativity; we're amplifying it.
                            </p>
                            <p className="section-subtext" style={{ marginTop: '1.2rem' }}>
                                Our work has earned recognition at PROMAX BDA and the Cannes Blue Dolphin — reflecting the caliber of craft we bring to every project.
                            </p>

                            <div className="skills-grid">
                                {SKILLS.map((skill) => (
                                    <div className="skill-card" key={skill.name}>
                                        <CardBorder />
                                        <div className="skill-icon">{skill.icon}</div>
                                        <div className="skill-info">
                                            <h4 className="skill-name">{skill.name}</h4>
                                            <p className="skill-desc">{skill.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <div className="hairline" />

            {/* ── Contact / Footer ──────────────────── */}
            <footer className="footer" id="contact">
                <div className="container">
                    {/* Social icons */}
                    <div className="footer-social">
                        {[
                            { name: 'Instagram', href: '#', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg> },
                            { name: 'LinkedIn', href: '#', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4"/><line x1="8" y1="11" x2="8" y2="16"/><line x1="8" y1="8" x2="8" y2="8.5"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 0 0-4 0"/></svg> },
                            { name: 'Vimeo', href: '#', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7.4c-.1 2.8-2 6.6-5.8 11.4C12.3 24 9.1 24 7.5 21c-.9-1.7-3.7-12.4-4.4-13.1-.5-.5-1.9.7-1.9.7L0 6.7C1.9 5 6.4.9 9 .7c2.8-.2 4.5 1.6 5.1 5.4.7 4 1.1 6.5 1.4 7.3.8 3.3 1.7 5 2.7 5 .8 0 2-1.3 3.6-3.8.8-1.3 1.2-2.3 1.2-3C23 10 22.2 9 21 9c-.5 0-1.1.2-1.7.6 1.1-3.7 3.3-5.5 2.7-2.2z"/></svg> },
                            { name: 'YouTube', href: '#', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8 1 12 1 12s0 4 .5 5.6a2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2C23 16 23 12 23 12s0-4-.5-5.6z"/><polygon points="10 15.5 16 12 10 8.5 10 15.5" fill="currentColor" stroke="none"/></svg> },
                            { name: 'Facebook', href: '#', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                        ].map(({ name, href, svg }) => (
                            <a key={name} href={href} className="footer-social-icon" aria-label={name} target="_blank" rel="noopener noreferrer">
                                {svg}
                            </a>
                        ))}
                    </div>

                    <div className="footer-contact">
                        <div className="footer-contact-left">
                            <span className="eyebrow">Contact Us</span>
                            <h2 className="footer-heading">
                                Let's Make<br />Something<br />Great.
                            </h2>
                            <p className="footer-tagline">We typically respond within 24 hours.</p>
                            <div className="footer-contact-details">
                                <a href="mailto:mike@myzemedia.com" className="contact-detail-row">
                                    <span className="contact-detail-label">Email</span>
                                    <span className="contact-detail-value">mike@myzemedia.com</span>
                                </a>
                                <a href="tel:+19733705432" className="contact-detail-row">
                                    <span className="contact-detail-label">Phone</span>
                                    <span className="contact-detail-value">(973) 370-5432</span>
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
                                        <textarea id="f-msg" rows="4" placeholder="Tell us about your project..." required />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-full">
                                        Send Brief →
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
                            src={`https://player.vimeo.com/video/${activeVideo}?autoplay=1&loop=1&title=0&byline=0&portrait=0&color=B65F46`}
                            className="modal-video"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={PORTFOLIO_REAL.find(p => p.vimeoId === activeVideo)?.title || 'Video'}
                        />
                    </div>
                </div>
            )}


        </div>
    );
}
