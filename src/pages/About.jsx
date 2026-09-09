import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import Eyebrow from '../components/ui/Eyebrow'
import FeaturedServices from '../components/sections/FeaturedServices'
import {
  StarIcon, ArrowDiag,
  LaurelSymbol, CrescentSymbol, StemSymbol, ContourSymbol, ICON_SIZE,
} from '../components/ui/icons'
import aboutBannerImg from '../assets/about-us-banner.webp'
import aboutImg from '../assets/about-us.webp'
import mobAppImg from '../assets/mob-app.webp'
import './About.css'
import './AboutBanner.css'
import './AboutServices.css'

const WHY_CARDS = [
  { title: 'Professional Expertise', desc: 'Qualified aesthetic professionals provide personalized treatment guidance based on your needs.', icon: <LaurelSymbol /> },
  { title: 'Long-Term Approach',     desc: 'We focus on helping you maintain your aesthetic goals—not simply achieving a short-term result.',   icon: <CrescentSymbol size={ICON_SIZE.lg} /> },
  { title: 'Advanced Technology', desc: 'Modern aesthetic technologies selected to support a wide range of skin and aesthetic goals.',           icon: <StemSymbol /> },
  { title: 'Personalized Care',        desc: 'Your treatment approach is built around your individual concerns, features, and goals.',                  icon: <ContourSymbol /> },
]

const STATS = [
  { val: '10+',   label: 'Years of expertise' },
  { val: '3',     label: 'Signature treatments' },
  { val: '1000s', label: 'Members served' },
  { val: 'Both',  label: 'Women & men welcome', italic: true },
]

const STORE_BTNS = [
  {
    label: 'App Store',
    sub: 'Download on the',
    href: 'https://apps.apple.com/eg/app/everlast-wellness/id6737142880',
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.3 10.41.86 1.26 1.89 2.67 3.24 2.62 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.87 1.42-2.94-.03-.01-2.72-1.04-2.75-4.13M14.6 4.84c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-3 1.54-.66.76-1.24 1.98-1.08 3.15 1.14.09 2.31-.58 3.02-1.44"/></svg>,
  },
  {
    label: 'Google Play',
    sub: 'Get it on',
    href: 'https://play.google.com/store/apps/details?id=com.everlast.wellness&hl=en&pli=1',
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M4 3.4v17.2c0 .37.4.6.72.42l9.3-5.3-3-3.04zM15.5 11.1 6.3 5.85l8.66 8.7zM6.3 18.15l9.2-5.25 2.3 2.32-9.3 5.32zM17.9 11.55l2.66 1.52c.5.28.5 1 0 1.28l-2.66 1.52-2.55-2.16z"/></svg>,
  },
]

export default function About() {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <main ref={rootRef} className="about-page">

      {/* ── Hero banner ──
          ONE unified overlay hero at every breakpoint: full-bleed photograph,
          scrim, copy layered on top. Never splits into an image column and a
          text column — the art direction shifts instead, moving the copy from
          beside the couple (wide) to below them (narrow). See AboutBanner.css.

          The background lives on a --banner-src custom property so the CSS owns
          the whole composition while Vite still fingerprints the asset. Its own
          `about-banner__*` namespace keeps it isolated from every other hero. */}
      <section
        className="about-banner"
        style={{ '--banner-src': `url(${aboutBannerImg})` }}
      >
        <div
          className="about-banner__media"
          role="img"
          aria-label="A member and her partner in the Al Nojoom Club lounge, Al Bateen"
        />
        <div className="about-banner__scrim" aria-hidden />

        <div className="about-banner__inner">
          <div className="about-banner__copy">
            <span data-reveal className="about-banner__eyebrow">
              <StarIcon /> About the club
            </span>
            <h1 data-reveal data-delay="80" className="about-banner__title">
              More Than Aesthetic Treatments.{' '}
              <span className="about-banner__title-accent">
                A Commitment to You
              </span>
              .
            </h1>
            <p data-reveal data-delay="160" className="about-banner__lede">
              At Al Nojoom Club, we believe that aesthetic care should be a
              journey—not a one-time experience.
            </p>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="about-story">
        <div data-reveal="left" className="about-story__grid">
          <div className="about-story__media">
            <img src={aboutImg} alt="Everlast Wellness clinic" className="about-story__image" />
            <div className="about-story__location">
              <div className="about-story__location-city">Abu Dhabi</div>
              <div className="about-story__location-district">Al Bateen</div>
            </div>
          </div>
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="about-story__title">A New Approach to Aesthetic Care</h2>
            <p className="about-story__desc">
              You shouldn't have to wait for a concern to appear before you start taking care of yourself. Your skin and appearance change over time. Lifestyle, environment, aging, and everyday habits can all influence the way you look and feel.
            </p>
            <p className="about-story__desc">
              That's why Al Nojoom Club focuses on consistent, professional, and personalized aesthetic care rather than isolated treatments. Our goal is to help you build a long-term relationship with your aesthetic care—one that evolves with your needs.
            </p>
            {/* Moved down from the old hero paragraph, which was too long to
                set over the banner photograph. Kept verbatim. */}
            <p className="about-story__desc">
              Our mission is to create a premium environment where professional aesthetic care becomes a consistent part of your lifestyle, helping you maintain healthier-looking skin, enhance your natural features, and feel confident in the way you look. We bring together professional expertise, advanced aesthetic technology, personalized care, and a membership-focused approach to create an experience built around you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
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

      {/* ── Why Choose ── */}
      <section className="about-why">
        <div className="about-why__inner">
          <div data-reveal className="about-why__header">
            <Eyebrow>Our advantages</Eyebrow>
            <h2 className="about-why__title">
              Your Care Should Be <span className="about-why__title-accent">Personal</span>.
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

      {/* Featured services. Same component as Home, but the prefixes point it
          at AboutServices.css so the two pages share no CSS at all -- restyling
          one cannot affect the other. No id: Home owns #services. */}
      <FeaturedServices
        block="about-services"
        grid="about-tracks"
        panel="about-track-panel"
      />

      {/* ── Mobile App ── */}
      <section className="about-app">
        <div className="about-app__bg-dots" aria-hidden />
        <div data-reveal="scale" className="about-app__grid">
          <div>
            <span className="about-app__eyebrow">Out now</span>
            <h2 className="about-app__title">The Everlast Wellness app is here.</h2>
            <p className="about-app__desc">
              Manage your membership, book unlimited sessions, and track your journey - all from your phone. Download it today on iOS and Android.
            </p>
            <div className="about-app__stores">
              {STORE_BTNS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="about-app__store-btn"
                >
                  {s.icon}
                  <span className="about-app__store-btn-meta">
                    <span className="about-app__store-sub">{s.sub}</span>
                    <span className="about-app__store-name">{s.label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="about-app__phone-wrap">
            <img src={mobAppImg} alt="Everlast Wellness mobile app" className="about-app__phone" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
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

