import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useParallax } from '../hooks/useParallax'
import Eyebrow from '../components/Eyebrow'
import aboutImg from '../imgs/Website-09.webp'
import mobAppImg from '../imgs/mob-app.webp'
import '../css/About.css'

function StarIcon({ size = 12, color = 'var(--aln-wine)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
    </svg>
  )
}
function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
function ArrowDiag({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

const WHY_CARDS = [
  { title: 'Board-Certified Specialists', desc: 'Our doctors and aesthetic practitioners deliver safe, precise, and effective treatments.', icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg> },
  { title: '10+ Years of Experience',     desc: 'A proven track record of exceptional aesthetic results using the latest techniques.',   icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 2"/></svg> },
  { title: 'State-of-the-Art Equipment', desc: 'Advanced technology for optimal results with minimal discomfort and downtime.',           icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6 4.5 4.5M18 6l1.5-1.5M6 18l-1.5 1.5M18 18l1.5 1.5"/><circle cx={12} cy={12} r={4}/></svg> },
  { title: 'Trusted by Thousands',        desc: 'A reputation for excellence and client satisfaction across Abu Dhabi.',                  icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A3.5 3.5 0 0 0 12 5.5 3.5 3.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg> },
]

const STATS = [
  { val: '10+',   label: 'Years of expertise' },
  { val: '3',     label: 'Signature treatments' },
  { val: '1000s', label: 'Members served' },
  { val: 'Both',  label: 'Women & men welcome', italic: true },
]

const STORE_BTNS = [
  {
    label: 'App Store', sub: 'Soon on the',
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.3 10.41.86 1.26 1.89 2.67 3.24 2.62 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.87 1.42-2.94-.03-.01-2.72-1.04-2.75-4.13M14.6 4.84c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-3 1.54-.66.76-1.24 1.98-1.08 3.15 1.14.09 2.31-.58 3.02-1.44"/></svg>,
  },
  {
    label: 'Google Play', sub: 'Soon on',
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M4 3.4v17.2c0 .37.4.6.72.42l9.3-5.3-3-3.04zM15.5 11.1 6.3 5.85l8.66 8.7zM6.3 18.15l9.2-5.25 2.3 2.32-9.3 5.32zM17.9 11.55l2.66 1.52c.5.28.5 1 0 1.28l-2.66 1.52-2.55-2.16z"/></svg>,
  },
]

export default function About() {
  const rootRef = useRef(null)
  useReveal(rootRef)
  useParallax(rootRef, 0.25)

  return (
    <main ref={rootRef} className="about-page">

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="about-hero">
        <div className="about-hero__bg-dots" aria-hidden />
        <div className="about-hero__inner">
          <span data-reveal className="about-hero__badge">
            <StarIcon /> About the club
          </span>
          <h1 data-reveal data-delay="60" className="about-hero__title">
            Al Nojoom Club, by <span className="about-hero__title-accent">Everlast Wellness</span>.
          </h1>
          <p data-reveal data-delay="120" className="about-hero__desc">
            An exclusive membership from a holistic clinic where science serves beauty â€” caring for both adults and students with rejuvenating, professional aesthetic therapies.
          </p>
        </div>
      </section>

      {/* â”€â”€ Story â”€â”€ */}
      <section className="about-story">
        <div data-reveal="left" className="about-story__grid">
          <div className="about-story__media">
            <img src={aboutImg} alt="Everlast Wellness clinic" data-parallax className="about-story__image" />
            <div className="about-story__location">
              <div className="about-story__location-city">Abu Dhabi</div>
              <div className="about-story__location-district">Al Bateen</div>
            </div>
          </div>
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="about-hero__title">Where science serves beauty.</h2>
            <p className="about-story__desc">
              Welcome to Al Nojoom Club, proudly presented by Everlast Wellness Medical Center. At Al Nojoom, we cater to both adults and students, understanding the unique skincare needs of each. Our exclusive therapies deeply cleanse, hydrate, and revitalize â€” promoting a clear, smooth, and radiant complexion that boosts your confidence.
            </p>
            <p className="about-story__desc">
              Everlast Wellness is an aesthetic wellness clinic specializing in dermatological and anti-aging treatments. Our mission is to serve the community with the highest level of health and wellness â€” body, mind, and spirit.
            </p>
            <Link to="/contact" className="about-story__cta">
              Contact us <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Stats band â”€â”€ */}
      <section className="about-stats">
        <div data-reveal className="about-stats__grid">
          {STATS.map(s => (
            <div key={s.label}>
              <div className={`about-stats__val${s.italic ? ' about-stats__val--italic' : ''}`}>{s.val}</div>
              <div className="about-stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Why Choose â”€â”€ */}
      <section className="about-why">
        <div className="about-why__inner">
          <div data-reveal className="about-why__header">
            <Eyebrow>Our advantages</Eyebrow>
            <h2 className="about-why__title">
              Why choose our <span className="about-why__title-accent">center</span>.
            </h2>
          </div>
          <div data-reveal data-delay="80" className="about-why__grid">
            {WHY_CARDS.map(c => (
              <div key={c.title} className="about-why-card">
                <span className="about-why-card__icon">{c.icon}</span>
                <h3 className="about-why-card__title">{c.title}</h3>
                <p className="about-why-card__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Mobile App â”€â”€ */}
      <section className="about-app">
        <div className="about-app__bg-dots" aria-hidden />
        <div data-reveal="scale" className="about-app__grid">
          <div>
            <span className="about-app__eyebrow">Coming soon</span>
            <h2 className="about-app__title">The Everlast Wellness app.</h2>
            <p className="about-app__desc">
              Manage your membership, book unlimited sessions, and track your journey â€” all from your phone. Launching soon on iOS and Android.
            </p>
            <div className="about-app__stores">
              {STORE_BTNS.map(s => (
                <span key={s.label} className="about-app__store-btn">
                  {s.icon}
                  <span className="about-app__store-btn-meta">
                    <span className="about-app__store-sub">{s.sub}</span>
                    <span className="about-app__store-name">{s.label}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="about-app__phone-wrap">
            <img src={mobAppImg} alt="Everlast Wellness mobile app" className="about-app__phone" />
          </div>
        </div>
      </section>

      {/* â”€â”€ Final CTA â”€â”€ */}
      <section className="about-cta">
        <div data-reveal className="about-cta__inner">
          <span className="about-cta__eyebrow">
            <StarIcon /> Join us
          </span>
          <h2 className="about-cta__title">
            Begin your journey to <span className="about-cta__title-accent">timeless</span> beauty.
          </h2>
          <div className="about-cta__actions">
            <a href="https://everlastwellness.store/product/alnojoom-club/" target="_blank" rel="noopener" className="about-cta__join-btn">
              Join the club <ArrowDiag />
            </a>
            <Link to="/services" className="about-cta__services-btn">
              View services
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

