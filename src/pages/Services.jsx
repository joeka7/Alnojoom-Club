import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useMembershipPrice, formatPrice } from '../hooks/useMembershipPrice'
import Eyebrow from '../components/ui/Eyebrow'
import {
  StarIcon, ArrowRight, ArrowDiag, CheckIcon,
  LozengeSymbol, HourglassSymbol, LaurelSymbol, ContourSymbol,
} from '../components/ui/icons'
import skinBoosterImg from '../assets/skin-booster.webp'
import lipFillerImg   from '../assets/lip-enhancement.webp'
import upperFaceImg   from '../assets/upper-face-neurotoxin.webp'
import beardImg       from '../assets/beard-trimming-laser.webp'
import './Services.css'

const SERVICE_SECTIONS = [
  {
    id: 'skin-booster',
    img: skinBoosterImg,
    alt: 'Skin Booster treatment',
    eyebrow: 'Signature service',
    title: 'Skin',
    titleAccent: 'Booster',
    desc: 'Give your skin a boost of hydration and radiance with targeted skin booster treatments designed to improve the appearance and quality of the skin. Goal: Healthier-looking, smoother, more hydrated and radiant skin. Ideal for:',
    bullets: ['Dryness', 'Dehydrated-looking skin', 'Dullness', 'Uneven texture', 'Loss of radiance'],
    imgLeft: true,
    stone: false,
  },
  {
    id: 'lip-filler',
    img: lipFillerImg,
    alt: 'Lip Enhancement treatment',
    eyebrow: 'Signature service',
    title: 'Lip',
    titleAccent: 'Enhancement',
    desc: 'Enhance the appearance and definition of your lips while maintaining balanced and natural-looking facial proportions. Our approach focuses on subtle enhancement, harmony, and individualized results.',
    bullets: ['Fuller, Well-Defined Lips', 'Natural & Smooth Appearance', 'Long-Lasting Hydration', 'Minimal Downtime', 'Adjustable & Reversible Results'],
    imgLeft: false,
    stone: true,
  },
  {
    id: 'neurotoxin',
    img: upperFaceImg,
    alt: 'Upper Face Neurotoxin treatment',
    eyebrow: 'Signature service',
    title: 'Upper Face',
    titleAccent: 'Neurotoxin',
    desc: 'An aesthetic treatment designed to soften the appearance of selected expression lines and create a more refreshed and relaxed-looking appearance. Treatment areas may include selected upper-face regions according to individual assessment.',
    bullets: ['Smooths Forehead Lines', 'Softens Frown Lines', "Minimizes Crow's Feet", 'Quick Non-Surgical Procedure', 'Preventative Anti-Aging Effects'],
    imgLeft: true,
    stone: false,
  },
]

const INCLUDED_ITEMS = [
  { title: 'Unlimited Sessions',    desc: 'Access your treatments every month with no expiry and no wasted sessions.',                         icon: <LozengeSymbol size={22} /> },
  { title: 'Priority Booking',      desc: 'Skip the queue with members-only appointment slots at your convenience.',                  icon: <HourglassSymbol size={22} /> },
  { title: 'Board-Certified Doctors', desc: 'Every treatment performed by licensed medical professionals.',                          icon: <LaurelSymbol size={22} /> },
  { title: 'Personalised Care',     desc: 'Tailored treatment plans designed for your skin and aesthetic goals.',                     icon: <ContourSymbol size={22} /> },
]

export default function Services() {
  const rootRef = useRef(null)
  useReveal(rootRef)
  // Live membership price from /api/product-price. This page isn't split by
  // track, so it shows the single membership figure -- the two variations
  // carry the same price, with `man` as a fallback if `woman` is missing.
  const { data: price, loading: priceLoading, error: priceError } = useMembershipPrice()
  const membershipPrice = price?.woman ?? price?.man

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main ref={rootRef} className="services-page">

      {/* ── Hero ── */}
      <section className="services-hero">
        <div className="services-hero__bg-dots" aria-hidden />
        <div className="services-hero__inner">
          <span data-reveal className="services-hero__badge">
            <StarIcon /> Our treatments
          </span>
          <h1 data-reveal data-delay="60" className="services-hero__title">
            Advanced Aesthetic Care, <span className="services-hero__title-accent">Designed</span> Around You
          </h1>
          <p data-reveal data-delay="120" className="services-hero__desc">
            At Al Nojoom Club, our services are designed to help you look refreshed, feel confident, and maintain the quality of your skin and appearance through professional aesthetic care. From skin rejuvenation and hydration to facial enhancement and wrinkle management, every treatment is selected with your individual goals in mind.
          </p>
          <div data-reveal data-delay="180" className="services-hero__pills">
            {[
              { id: 'skin-booster', label: 'Skin Booster' },
              { id: 'lip-filler',   label: 'Lip Enhancement' },
              { id: 'neurotoxin',   label: 'Neurotoxin' },
              { id: 'beard',        label: 'Beard Trim' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="services-hero__pill"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service sections ── */}
      {SERVICE_SECTIONS.map(s => (
        <section
          key={s.id}
          id={s.id}
          className={`services-section${s.stone ? ' services-section--stone' : ''}`}
        >
          <div data-reveal className="services-section__row">
            {s.imgLeft && (
              <img src={s.img} alt={s.alt} className="services-section__image" />
            )}
            <div>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 className="services-section__title">
                {s.title}<br />
                <span className="services-section__title-accent">{s.titleAccent}</span>.
              </h2>
              <p className="services-section__desc">{s.desc}</p>
              <ul className="services-section__bullets">
                {s.bullets.map(b => (
                  <li key={b} className="services-section__bullet">
                    <CheckIcon />{b}
                  </li>
                ))}
              </ul>
            </div>
            {!s.imgLeft && (
              <img src={s.img} alt={s.alt} className="services-section__image" />
            )}
          </div>
        </section>
      ))}

      {/* ── Beard section ── */}
      <section id="beard" className="services-beard">
        <div className="services-beard__bg-dots" aria-hidden />
        <div data-reveal className="services-beard__row">
          <div>
            <Eyebrow light>For men</Eyebrow>
            <h2 className="services-beard__title">
              Beard Trimming<br />
              <span className="services-beard__title-accent">Laser</span>.
            </h2>
            <p className="services-beard__desc">
              A cutting-edge, non-invasive laser solution for long-term beard shaping and grooming. Precisely targets unwanted facial hair while preserving your desired beard shape — ideal for defining the neckline, shaping the cheeks, and reducing patchy growth.
            </p>
            <ul className="services-beard__bullets">
              {['Precisely Defined Beard Lines', 'Long-Term Hair Reduction', 'Reduced Skin Irritation', 'Low-Maintenance Grooming', 'Customized Beard Design'].map(b => (
                <li key={b} className="services-beard__bullet">
                  <CheckIcon light />{b}
                </li>
              ))}
            </ul>
          </div>
          <img src={beardImg} alt="Beard trimming service" className="services-beard__image" />
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="services-included">
        <div className="services-included__inner">
          <div data-reveal className="services-included__header">
            <Eyebrow>Every membership</Eyebrow>
            <h2 className="services-included__title">
              What's <span className="services-included__title-accent">included</span>.
            </h2>
            <p className="services-included__desc">
              Every Al Nojoom membership plan gives you unrestricted access to the following benefits - no catches, no add-ons.
            </p>
          </div>
          <div data-reveal data-delay="80" className="services-included__grid">
            {INCLUDED_ITEMS.map(item => (
              <div key={item.title} className="included-card">
                <span className="included-card__icon">{item.icon}</span>
                <h3 className="included-card__title">{item.title}</h3>
                <p className="included-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="services-cta">
        <div data-reveal className="services-cta__inner">
          <span className="services-cta__eyebrow">
            <StarIcon /> Ready to start
          </span>
          <h2 className="services-cta__title">
            Join the club. Look<br />
            <span className="services-cta__title-accent">extraordinary.</span>
          </h2>
          <p className="services-cta__desc">
            All four services - Skin Booster, Lip Enhancement, Neurotoxin & Beard Trim - available each month, for members only.
          </p>
          {/* Same live price as the membership section on Home; silent on
              error so the CTA never shows a broken amount. */}
          {!priceError && (priceLoading || membershipPrice) && (
            <div className="services-cta__price">
              <span className="services-cta__price-label">Membership</span>
              <span className="services-cta__price-amount">
                <span className="services-cta__price-currency">AED</span>
                {priceLoading ? (
                  <span className="services-cta__price-loading">––––</span>
                ) : (
                  formatPrice(membershipPrice)
                )}
                <span className="services-cta__price-period">/ year</span>
              </span>
            </div>
          )}

          <div className="services-cta__actions">
            <a href="https://everlastwellness.store/product/alnojoom-club/" target="_blank" rel="noopener" className="services-cta__join-btn">
              Join the club <ArrowDiag />
            </a>
            <Link to="/contact" className="services-cta__contact-btn">
              Contact us <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

