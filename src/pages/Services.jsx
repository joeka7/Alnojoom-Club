import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import Eyebrow from '../components/Eyebrow'
import skinBoosterImg from '../imgs/Skin-Booster-scaled.webp'
import lipFillerImg   from '../imgs/Lip-Filler-scaled.webp'
import upperFaceImg   from '../imgs/Upper-Face-scaled.webp'
import beardImg       from '../imgs/bearded-man.webp'
import '../css/Services.css'

function StarIcon({ size = 12, color = 'var(--aln-wine)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
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
function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
function CheckIcon({ light = false }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={light ? 'var(--aln-wine-soft)' : 'var(--aln-wine)'} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

const SERVICE_SECTIONS = [
  {
    id: 'skin-booster',
    img: skinBoosterImg,
    alt: 'Skin Booster treatment',
    eyebrow: 'Signature service',
    title: 'Skin',
    titleAccent: 'Booster',
    desc: 'A cutting-edge injectable treatment that delivers pure hyaluronic acid deep into the skin, restoring moisture and stimulating collagen. Ideal for dehydration, dullness, fine lines, uneven skin tone, and loss of elasticity.',
    bullets: ['Deep skin hydration', 'Collagen stimulation', 'Fine line reduction', 'Radiance & elasticity'],
    imgLeft: true,
    stone: false,
  },
  {
    id: 'lip-filler',
    img: lipFillerImg,
    alt: 'Lip Filler treatment',
    eyebrow: 'Signature service',
    title: 'Lip',
    titleAccent: 'Filler',
    desc: 'Using premium hyaluronic acid fillers to enhance volume, symmetry, and definition. Whether seeking subtle enhancement or a bolder pout, our specialists tailor the treatment to your desired aesthetic with a natural, beautiful result.',
    bullets: ['Natural volume enhancement', 'Improved symmetry', "Defined cupid's bow", 'Long-lasting results'],
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
    desc: "Targeting forehead lines, frown lines, and crow's feet, our upper face neurotoxin treatment uses medical-grade botulinum toxin to relax facial muscles. The result is a naturally smooth, refreshed, and youthful appearance.",
    bullets: ['Forehead line smoothing', 'Frown line treatment', "Crow's feet reduction", 'Natural-looking results'],
    imgLeft: true,
    stone: false,
  },
]

const INCLUDED_ITEMS = [
  { title: 'Unlimited Sessions',    desc: 'One treatment per month for each service â€” no expiry, no waste.',                         icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="m10 14 11-11"/></svg> },
  { title: 'Priority Booking',      desc: 'Skip the queue with members-only appointment slots at your convenience.',                  icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 2"/></svg> },
  { title: 'Board-Certified Doctors', desc: 'Every treatment performed by licensed medical professionals.',                          icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg> },
  { title: 'Personalised Care',     desc: 'Tailored treatment plans designed for your skin and aesthetic goals.',                     icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg> },
]

export default function Services() {
  const rootRef = useRef(null)
  useReveal(rootRef)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main ref={rootRef} className="services-page">

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="services-hero">
        <div className="services-hero__bg-dots" aria-hidden />
        <div className="services-hero__inner">
          <span data-reveal className="services-hero__badge">
            <StarIcon /> Our treatments
          </span>
          <h1 data-reveal data-delay="60" className="services-hero__title">
            Aesthetic services that <span className="services-hero__title-accent">define</span> you.
          </h1>
          <p data-reveal data-delay="120" className="services-hero__desc">
            Every Al Nojoom membership includes monthly access to our signature aesthetic services â€” delivered by board-certified specialists.
          </p>
          <div data-reveal data-delay="180" className="services-hero__pills">
            {[
              { id: 'skin-booster', label: 'Skin Booster' },
              { id: 'lip-filler',   label: 'Lip Filler' },
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

      {/* â”€â”€ Service sections â”€â”€ */}
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
              <a
                href="https://everlastwellness.store/product/alnojoom-club/"
                target="_blank"
                rel="noopener"
                className="services-section__cta"
              >
                Join the club <ArrowDiag />
              </a>
            </div>
            {!s.imgLeft && (
              <img src={s.img} alt={s.alt} className="services-section__image" />
            )}
          </div>
        </section>
      ))}

      {/* â”€â”€ Beard section â”€â”€ */}
      <section id="beard" className="services-beard">
        <div className="services-beard__bg-dots" aria-hidden />
        <div data-reveal className="services-beard__row">
          <div>
            <Eyebrow light>For men</Eyebrow>
            <h2 className="services-beard__title">
              Beard<br />
              <span className="services-beard__title-accent">Trimming</span>.
            </h2>
            <p className="services-beard__desc">
              More than a haircut â€” it's a signature look. Our barber specialists shape, style, and define your beard with precision, using premium products and techniques that complement your facial structure.
            </p>
            <ul className="services-beard__bullets">
              {['Precision shaping & styling', 'Hot towel shave option', 'Premium beard products', 'Tailored to face shape'].map(b => (
                <li key={b} className="services-beard__bullet">
                  <CheckIcon light />{b}
                </li>
              ))}
            </ul>
            <a
              href="https://everlastwellness.store/product/alnojoom-club/"
              target="_blank"
              rel="noopener"
              className="services-beard__cta"
            >
              Join the club <ArrowDiag />
            </a>
          </div>
          <img src={beardImg} alt="Beard trimming service" className="services-beard__image" />
        </div>
      </section>

      {/* â”€â”€ What's Included â”€â”€ */}
      <section className="services-included">
        <div className="services-included__inner">
          <div data-reveal className="services-included__header">
            <Eyebrow>Every membership</Eyebrow>
            <h2 className="services-included__title">
              What's <span className="services-included__title-accent">included</span>.
            </h2>
            <p className="services-included__desc">
              Every Al Nojoom membership plan gives you unrestricted access to the following benefits â€” no catches, no add-ons.
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

      {/* â”€â”€ Final CTA â”€â”€ */}
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
            All four services â€” Skin Booster, Lip Filler, Neurotoxin & Beard Trim â€” available each month, for members only.
          </p>
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

