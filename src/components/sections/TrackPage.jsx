import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { useMembershipPrice, formatPrice } from '../../hooks/useMembershipPrice'
import Eyebrow from '../ui/Eyebrow'
import {
  StarIcon, ArrowRight, ArrowDiag, CheckIcon, ICON_SIZE,
  LozengeSymbol, LaurelSymbol, BloomSymbol, ContourSymbol,
  CrescentSymbol, StemSymbol,
} from '../ui/icons'
import './TrackPage.css'

/**
 * Shared layout for the two Services track pages (For Women / For Men).
 *
 * Both pages carry the same section rhythm, so the markup lives here once and
 * each page file supplies its own copy and images. See ForWomen.jsx / ForMen.jsx
 * for the shape of the `track` object.
 */

const JOIN_URL = 'https://everlastwellness.store/product/alnojoom-club/'

/**
 * Kebab-case anchor id for a treatment, derived from its name.
 *
 * Derived rather than hand-listed so a treatment can never end up with an id
 * that has drifted from its title — the footer's deep links (see
 * TREATMENT_LINKS in Footer.jsx) build the same slugs from the same names.
 *
 *   'Upper Face Neurotoxin' -> 'upper-face-neurotoxin'
 */
export const treatmentId = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/* Card symbols, keyed by meaning. These map onto the shared editorial set so
   the track pages carry the same visual language as the rest of the site. */
export const ICONS = {
  access: <LozengeSymbol />,
  shield: <LaurelSymbol />,
  droplet: <BloomSymbol />,
  heart: <ContourSymbol />,
  clock: <CrescentSymbol />,
  spark: <StemSymbol />,
  star: <StarIcon size={ICON_SIZE.lg} color="currentColor" />,
}

export default function TrackPage({ track }) {
  const rootRef = useRef(null)
  useReveal(rootRef)

  const { hero, treatments, highlight, cards, steps, cta } = track
  // Live membership price from /api/product-price (scraped from the store, so
  // a price change there flows through without a redeploy). `hero.priceKey`
  // picks this track's variation.
  const { data: price, loading: priceLoading, error: priceError } = useMembershipPrice()
  const trackPrice = hero.priceKey ? price?.[hero.priceKey] : null

  return (
    <main ref={rootRef} className="track-page">

      {/* ── Hero ── */}
      <section className="track-hero">
        <div className="track-hero__bg-dots" aria-hidden />
        <div className="track-hero__grid">
          <div>
            <span data-reveal className="track-hero__badge">
              <StarIcon /> {hero.badge}
            </span>
            <h1 data-reveal data-delay="90" className="track-hero__title">
              {hero.title}{' '}
              <span className="track-hero__title-accent">{hero.titleAccent}</span>
            </h1>
            {hero.paragraphs.map(p => (
              <p key={p} data-reveal data-delay="180" className="track-hero__desc">{p}</p>
            ))}
            {/* Price block mirrors Home's membership CTA. Shown while loading or
                once a price is available; silent on error so the hero never
                displays a broken or placeholder amount. */}
            {hero.priceKey && !priceError && (priceLoading || trackPrice) && (
              <div data-reveal data-delay="240" className="track-hero__price">
                <div className="track-hero__price-inner">
                  <span className="track-hero__price-label">
                    {hero.badge} · membership
                  </span>
                  <span className="track-hero__price-amount">
                    <span className="track-hero__price-currency">AED</span>
                    {priceLoading ? (
                      <span className="track-hero__price-loading">––––</span>
                    ) : (
                      formatPrice(trackPrice)
                    )}
                    <span className="track-hero__price-period">/ year</span>
                  </span>
                </div>
              </div>
            )}

            {/* Each hero button is opt-in per track: `joinLabel` renders the
                primary join button, `consultLabel` the secondary consultation
                link. A track omitting both renders no actions row. */}
            {(hero.joinLabel || hero.consultLabel) && (
              <div data-reveal data-delay="270" className="track-hero__actions">
                {hero.joinLabel && (
                  <a href={JOIN_URL} target="_blank" rel="noopener" className="track-btn track-btn--primary">
                    {hero.joinLabel} <ArrowDiag />
                  </a>
                )}
                {hero.consultLabel && (
                  <Link to="/contact" className="track-btn track-btn--secondary">
                    {hero.consultLabel} <ArrowRight />
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Sibling of the grid, not a child: on mobile it becomes the
            full-bleed background layer, which requires the section -- not the
            copy grid -- as its containing block. On desktop CSS places it back
            into the grid's second column. */}
        <div data-reveal="right" data-delay="220" className="track-hero__media">
          <img src={hero.image} alt={hero.imageAlt} className="track-hero__image" />
        </div>
      </section>

      {/* ── Treatments ── */}
      <section className="track-section track-treatments">
        <div className="track-section__inner">
          <div data-reveal className="track-section__header">
            <Eyebrow>{treatments.eyebrow}</Eyebrow>
            <h2 className="track-section__title">
              {treatments.title}{' '}
              <span className="track-section__title-accent">{treatments.titleAccent}</span>.
            </h2>
            <p className="track-section__desc">{treatments.desc}</p>
          </div>
          <div data-reveal data-delay="80" className="track-treatments__grid">
            {treatments.items.map(t => (
              <article
                key={t.name}
                id={treatmentId(t.name)}
                className="track-treatment-card"
              >
                <img src={t.image} alt={t.name} className="track-treatment-card__image" />
                <div className="track-treatment-card__body">
                  <span className="track-treatment-card__tag">{t.tag}</span>
                  <h3 className="track-treatment-card__title">{t.name}</h3>
                  {t.paragraphs.map(p => (
                    <p key={p} className="track-treatment-card__desc">{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlight ── */}
      <section className="track-section track-section--stone track-highlight">
        <div data-reveal className="track-highlight__row">
          <div className="track-highlight__media">
            <img src={highlight.image} alt={highlight.imageAlt} className="track-highlight__image" />
          </div>
          <div>
            <Eyebrow>{highlight.eyebrow}</Eyebrow>
            <h2 className="track-section__title">
              {highlight.title}{' '}
              <span className="track-section__title-accent">{highlight.titleAccent}</span>.
            </h2>
            {highlight.paragraphs.map(p => (
              <p key={p} className="track-highlight__desc">{p}</p>
            ))}
            <ul className="track-highlight__bullets">
              {highlight.bullets.map(b => (
                <li key={b} className="track-highlight__bullet">
                  <CheckIcon />{b}
                </li>
              ))}
            </ul>
            <p className="track-highlight__closing">{highlight.closing}</p>
          </div>
        </div>
      </section>

      {/* ── Benefit / philosophy cards ── */}
      <section className="track-section track-cards">
        <div className="track-section__inner">
          <div data-reveal className="track-section__header track-section__header--center">
            <Eyebrow>{cards.eyebrow}</Eyebrow>
            <h2 className="track-section__title">
              {cards.title}{' '}
              <span className="track-section__title-accent">{cards.titleAccent}</span>
            </h2>
            {cards.desc && <p className="track-section__desc">{cards.desc}</p>}
          </div>
          <div data-reveal data-delay="80" className="track-cards__grid">
            {cards.items.map(c => (
              <div key={c.title} className="track-card">
                <span className="track-card__icon">{c.icon}</span>
                <h3 className="track-card__title">{c.title}</h3>
                <p className="track-card__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="track-section track-section--stone track-steps">
        <div className="track-section__inner">
          <div data-reveal className="track-section__header track-section__header--center">
            <Eyebrow>{steps.eyebrow}</Eyebrow>
            <h2 className="track-section__title">
              {steps.title}{' '}
              <span className="track-section__title-accent">{steps.titleAccent}</span>
            </h2>
          </div>
          <div data-reveal data-delay="80" className="track-steps__grid">
            {steps.items.map(s => (
              <div key={s.num} className="track-step">
                <span className="track-step__num">{s.num}</span>
                <h3 className="track-step__title">{s.title}</h3>
                <p className="track-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
          {steps.closing && (
            <p data-reveal className="track-steps__closing">{steps.closing}</p>
          )}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="track-cta">
        <div className="track-cta__bg-dots" aria-hidden />
        <div data-reveal className="track-cta__inner">
          <span className="track-cta__eyebrow">
            <StarIcon color="var(--aln-wine-soft)" /> {cta.eyebrow}
          </span>

          {cta.stages ? (
            <h2 className="track-cta__stages">
              {cta.stages.map((stage, i) => (
                <span key={stage} className="track-cta__stage">
                  {stage}
                  {i < cta.stages.length - 1 && <StarIcon color="var(--aln-wine-soft)" />}
                </span>
              ))}
            </h2>
          ) : (
            <h2 className="track-cta__title">
              {cta.title}{' '}
              <span className="track-cta__title-accent">{cta.titleAccent}</span>
            </h2>
          )}

          {cta.paragraphs.map(p => (
            <p key={p} className="track-cta__desc">{p}</p>
          ))}

          {/* Same live price as the hero, on the dark closing panel. */}
          {hero.priceKey && !priceError && (priceLoading || trackPrice) && (
            <div className="track-cta__price">
              <span className="track-cta__price-label">
                {hero.badge} · membership
              </span>
              <span className="track-cta__price-amount">
                <span className="track-cta__price-currency">AED</span>
                {priceLoading ? (
                  <span className="track-cta__price-loading">––––</span>
                ) : (
                  formatPrice(trackPrice)
                )}
                <span className="track-cta__price-period">/ year</span>
              </span>
            </div>
          )}

          <div className="track-cta__actions">
            <a href={JOIN_URL} target="_blank" rel="noopener" className="track-btn track-btn--primary">
              {cta.joinLabel} <ArrowDiag />
            </a>
            <Link to="/contact" className="track-btn track-btn--light">
              Contact Us <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
