import { useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import Eyebrow from "../components/ui/Eyebrow";
import PaperShaderBackground from "../components/sections/PaperShaderBackground";
import FeaturedServices from "../components/sections/FeaturedServices";
import { useMembershipPrice, formatPrice } from "../hooks/useMembershipPrice";
import "./Home.css";

/*  Images  */
import heroImg from "../assets/hero-image.webp";
import heroImgMob from "../assets/hero-image-mob.webp";
import aboutImg from "../assets/about-the-club.webp";
import gal1 from "../assets/gallery1.webp";
import gal2 from "../assets/gallery2.webp";
import gal3 from "../assets/gallery3.webp";
import gal4 from "../assets/gallery4.webp";
import gal5 from "../assets/gallery5.webp";
import gal6 from "../assets/gallery6.webp";
import {
  StarIcon,
  ArrowRight,
  ArrowDiag,
  LaurelSymbol,
  CrescentSymbol,
  StemSymbol,
  ContourSymbol,
  FacetSymbol,
  RadianceSymbol,
  BloomSymbol,
  LeafSymbol,
  LocationIcon,
  ICON_SIZE,
} from "../components/ui/icons";

/*  HERO */
const STATS = [
  { val: "10+", label: "Years of expertise" },
  { val: "3", label: "Signature treatments" },
  { val: "Unlimited", label: "Member sessions", italic: true },
  { val: "2", label: "Women & men tracks" },
];

function Hero() {
  return (
    <section className="hero">
      <PaperShaderBackground className="hero__shader" />
      {/* Mobile-only backdrop: stands in for the hidden hero__media image */}
      <img src={heroImgMob} alt="" aria-hidden className="hero__mob-overlay" />
      <div className="hero__bg-dots" aria-hidden />
      <div className="hero__glow" aria-hidden />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--aln-wine)"
        strokeWidth={0.5}
        aria-hidden
        className="hero__star-deco"
      >
        <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
      </svg>

      <div className="hero__grid">
        {/* Left: copy */}
        <div>
          <div data-reveal className="hero__badge">
            <StarIcon size={12} />
            By Everlast Wellness
          </div>

          <h1 data-reveal data-delay="90" className="hero__title">
            Your Beauty Is Not a One-Time Treatment.
            <br />
            <span className="hero__title-accent">It's a Journey.</span>
          </h1>

          <p data-reveal data-delay="180" className="hero__desc">
            Welcome to Al Nojoom Club — a premium membership for radiant skin,
            enhanced natural beauty, and consistent professional care.
          </p>

          <div data-reveal data-delay="270" className="hero__actions">
            <a
              href="https://everlastwellness.store/product/alnojoom-club/"
              target="_blank"
              rel="noopener"
              className="hero__btn hero__btn--primary"
            >
              Join the club <ArrowDiag />
            </a>
            <Link to="/services" className="hero__btn hero__btn--secondary">
              Explore membership <ArrowRight />
            </Link>
          </div>

          <div data-reveal data-delay="360" className="hero__meta">
            <span className="hero__meta-location">
              <LocationIcon size={ICON_SIZE.sm} color="var(--aln-wine)" />
              Al Bateen, Abu Dhabi
            </span>
            <span className="hero__meta-dot" aria-hidden />
            <span>Board-certified specialists</span>
          </div>
        </div>

        {/* Right: image */}
        <div
          data-reveal
          data-anim="right"
          data-delay="220"
          className="hero__media"
        >
          <img
            src={heroImg}
            alt="Al Nojoom Club - timeless beauty"
            data-parallax
            className="hero__image"
          />

          <div className="hero__badge-float">
            <span className="hero__badge-float-icon">
              <StarIcon size={20} color="#fff" />
            </span>
            <div>
              <div className="hero__badge-float-title">Unlimited sessions</div>
              <div className="hero__badge-float-sub">One yearly membership</div>
            </div>
          </div>

          <div className="hero__pill-float">
            <StarIcon size={13} />
            <strong className="hero__pill-float-rating">5.0</strong>{" "}
            member-rated
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div data-reveal data-delay="120" className="hero__stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className={`hero__stat-val${s.italic ? " hero__stat-val--italic" : ""}`}
            >
              {s.val.includes("+") ? (
                <>
                  {s.val.replace("+", "")}
                  <span className="hero__stat-accent">+</span>
                </>
              ) : (
                s.val
              )}
            </div>
            <div className="hero__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/*  WHY CHOOSE US */
const WHY_CARDS = [
  {
    title: "Professional Expertise",
    desc: "Qualified aesthetic professionals provide personalized treatment guidance based on your needs.",
    icon: <LaurelSymbol />,
  },
  {
    title: "Long-Term Approach",
    desc: "We focus on helping you maintain your aesthetic goals—not simply achieving a short-term result.",
    icon: <CrescentSymbol size={ICON_SIZE.lg} />,
  },
  {
    title: "Advanced Technology",
    desc: "Modern aesthetic technologies selected to support a wide range of skin and aesthetic goals.",
    icon: <StemSymbol />,
  },
  {
    title: "Personalized Care",
    desc: "Your treatment approach is built around your individual concerns, features, and goals.",
    icon: <ContourSymbol />,
  },
];

function WhyChooseUs() {
  return (
    <section className="why">
      <div className="why__inner">
        <div data-reveal className="why__header">
          <Eyebrow>Why choose Al Nojoom</Eyebrow>
          <h2 className="why__title">
            Your Care Should Be{" "}
            <span className="why__title-accent">Personal.</span>
          </h2>
        </div>
        <div data-reveal data-delay="80" className="why__grid">
          {WHY_CARDS.map((c) => (
            <div key={c.title} className="why-card">
              <span className="why-card__icon">{c.icon}</span>
              <h3 className="why-card__title">{c.title}</h3>
              <p className="why-card__desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/*  MARQUEE  */
const MARQUEE_ITEMS = [
  "Skin Booster",
  "Lip Enhancement",
  "Upper Face Neurotoxin",
  "Beard Trimming",
];

/**
 * How many copies of the row the track needs.
 *
 * The loop translates the track by -50%, so half of it has to be wider than
 * the viewport or the tail of the cycle scrolls empty space into view. Two
 * copies only covered ~1220px, which left a growing gap from 1024px upward.
 * Returns an even count so the halfway frame is identical to the first one,
 * which is what keeps the loop seamless.
 */
function useMarqueeCopies(rowRef) {
  const [copies, setCopies] = useState(2);

  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      const rowWidth = rowRef.current?.getBoundingClientRect().width;
      if (!alive || !rowWidth) return;
      // +1 row of slack so the strip is never merely flush with the edge.
      setCopies(2 * (Math.ceil(window.innerWidth / rowWidth) + 1));
    };

    measure();
    window.addEventListener("resize", measure);
    // The display web font loads after first paint and changes the row width.
    document.fonts?.ready.then(measure);

    return () => {
      alive = false;
      window.removeEventListener("resize", measure);
    };
  }, [rowRef]);

  return copies;
}

function MarqueeStrip() {
  const rowRef = useRef(null);
  const copies = useMarqueeCopies(rowRef);

  return (
    <div className="marquee">
      {/* Home.css derives the animation duration from the copy count so the
          scroll speed stays the same however many copies are rendered. */}
      <div className="marquee__track" style={{ "--marquee-copies": copies }}>
        {Array.from({ length: copies }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? rowRef : undefined}
            className="marquee__row"
            aria-hidden={copy > 0 ? true : undefined}
          >
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="marquee__item">
                {item}
                <StarIcon size={14} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/*  ABOUT SNAPSHOT */
const ABOUT_STATS = [
  { val: "10+", label: "Years of expertise" },
  { val: "3", label: "Signature treatments" },
  { val: "1000s", label: "Members served" },
];

function AboutSnapshot() {
  return (
    <section id="about" className="about-snapshot">
      <div className="about-snapshot__grid">
        <div data-reveal className="about-snapshot__media">
          <img
            src={aboutImg}
            alt="Everlast Wellness clinic"
            className="about-snapshot__image"
          />
          <div className="about-snapshot__badge">
            <div className="about-snapshot__badge-val">10+</div>
            <div className="about-snapshot__badge-label">Years of care</div>
          </div>
        </div>

        <div data-reveal data-delay="100">
          <Eyebrow>What is Al Nojoom Club</Eyebrow>
          <h2 className="about-snapshot__title">
            More Than Treatments.{" "}
            <span className="about-snapshot__title-accent">
              It's Your Personal Beauty Membership
            </span>
            .
          </h2>
          <p className="about-snapshot__desc">
            Al Nojoom Club brings together professional aesthetic care, advanced
            technology, and personalized treatment planning in one exclusive
            membership experience. Instead of approaching aesthetic care as an
            occasional treatment, our membership helps you build a consistent
            routine designed around your individual needs and goals.
            Consistency. Professional Care. Natural-Looking Results.
          </p>
          <div className="about-snapshot__stats">
            {ABOUT_STATS.map((s) => (
              <div key={s.label}>
                <div className="about-snapshot__stat-val">{s.val}</div>
                <div className="about-snapshot__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/*  MEMBERSHIP TRACKS  */
const WOMEN_TREATMENTS = [
  {
    title: "Lip Enhancement",
    desc: "Enhances volume and definition for naturally plump, beautifully contoured lips.",
    icon: <FacetSymbol />,
  },
  {
    title: "Upper Face Neurotoxin",
    desc: "Say goodbye to wrinkles with expert Botox for a relaxed, youthful expression.",
    icon: <RadianceSymbol />,
  },
  {
    title: "Skin Booster",
    desc: "Deeply hydrates and improves skin texture, leaving you with a radiant glow.",
    icon: <BloomSymbol />,
  },
];
const MEN_TREATMENTS = [
  {
    title: "Beard Trimming",
    desc: "Sharp, defined beard lines - laser-precise shaping minus the razor irritation.",
    icon: <LeafSymbol />,
  },
  {
    title: "Upper Face Neurotoxin",
    desc: "Smooth expression lines and prevent new ones for a refreshed, natural look.",
    icon: <RadianceSymbol />,
  },
  {
    title: "Skin Booster",
    desc: "Hydrated, healthy-looking skin with a natural, well-rested glow.",
    icon: <BloomSymbol />,
  },
];

function MembershipTracks() {
  const [track, setTrack] = useState("women");
  // Per-gender membership price ({ man, woman }) fetched from the API; the
  // amount shown follows the active track.
  const { data: price, loading, error } = useMembershipPrice();
  const list = track === "women" ? WOMEN_TREATMENTS : MEN_TREATMENTS;
  const trackPrice = track === "women" ? price?.woman : price?.man;

  return (
    <section className="membership">
      <div className="membership__inner">
        <div data-reveal className="membership__header">
          <span className="membership__eyebrow">
            Membership · choose your path
          </span>
          <h2 className="membership__title">
            Designed for <span className="membership__title-accent">her</span>.
            And for <span className="membership__title-accent">him</span>.
          </h2>
          <div className="membership__tabs">
            <button
              onClick={() => setTrack("women")}
              className={`membership__tab${track === "women" ? " membership__tab--active" : ""}`}
            >
              For Women
            </button>
            <button
              onClick={() => setTrack("men")}
              className={`membership__tab${track === "men" ? " membership__tab--active" : ""}`}
            >
              For Men
            </button>
          </div>
        </div>

        <div key={track} className="membership__grid">
          {list.map((t) => (
            <div key={t.title} className="track-card">
              <span className="track-card__icon">{t.icon}</span>
              <h3 className="track-card__title">{t.title}</h3>
              <p className="track-card__desc">{t.desc}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="membership__cta">
          {/* Price comes from /api/product-price. Show the block while loading
              or once a price is available; stay silent on error so the CTA
              never displays a broken or placeholder amount. */}
          {!error && (loading || trackPrice) && (
            <div className="membership__price">
              <span className="membership__price-label">
                {track === "women" ? "For Women" : "For Men"} · membership
              </span>
              <span className="membership__price-amount">
                <span className="membership__price-currency">AED</span>
                {loading ? (
                  <span className="membership__price-loading">––––</span>
                ) : (
                  formatPrice(trackPrice)
                )}
                <span className="membership__price-period">/ year</span>
              </span>
            </div>
          )}
          <a
            href="https://everlastwellness.store/product/alnojoom-club/"
            target="_blank"
            rel="noopener"
            className="membership__join-btn"
          >
            Join Al Nojoom Club <ArrowDiag />
          </a>
        </div>
      </div>
    </section>
  );
}

/*  GALLERY  */
const GAL_IMAGES = [
  { src: gal6, ratio: "3/4", alt: "Gallery image 6" },
  { src: gal2, ratio: "1/1", alt: "Gallery image 2" },
  { src: gal3, ratio: "4/5", alt: "Gallery image 3" },
  { src: gal4, ratio: "4/5", alt: "Gallery image 4" },
  { src: gal1, ratio: "3/4", alt: "Gallery image 1" },
  { src: gal5, ratio: "1/1", alt: "Gallery image 5" },
];

function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery__inner">
        <div data-reveal className="gallery__header">
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="gallery__title">
            Step inside the{" "}
            <span className="gallery__title-accent">experience</span>.
          </h2>
        </div>
        <div data-reveal data-delay="80" className="gallery__masonry">
          {GAL_IMAGES.map((g, i) => (
            <img
              key={i}
              src={g.src}
              alt={g.alt}
              className="gallery__image"
              style={{ aspectRatio: g.ratio }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/*  TESTIMONIALS   */
const TESTIMONIALS = [
  {
    q: "A one-year membership with unlimited sessions on three services means I always look and feel my best. The results are amazing.",
    n: "Layla A.",
    r: "Member · Abu Dhabi",
    initial: "L",
  },
  {
    q: "The team is professional and the center is immaculate. My skin has never looked better since joining the club.",
    n: "Sara M.",
    r: "Member · Al Bateen",
    initial: "S",
  },
  {
    q: "As a busy professional, the unlimited sessions are convenient, luxurious, and completely worth it.",
    n: "Omar K.",
    r: "Member · Abu Dhabi",
    initial: "O",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials__inner">
        <div data-reveal className="testimonials__header">
          <Eyebrow>Loved by members</Eyebrow>
          <h2 className="testimonials__title">
            Results worth{" "}
            <span className="testimonials__title-accent">returning</span> for.
          </h2>
        </div>
        <div data-reveal data-delay="80" className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <figure key={t.n} className="testimonial">
              <blockquote className="testimonial__quote">"{t.q}"</blockquote>
              <figcaption className="testimonial__caption">
                <span className="testimonial__avatar">{t.initial}</span>
                <span>
                  <span className="testimonial__name">{t.n}</span>
                  <span className="testimonial__role">{t.r}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TRUST / FAMILY
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function TrustFamily() {
  return (
    <section className="trust">
      <div data-reveal className="trust__inner">
        <span className="trust__eyebrow">Trusted care</span>
        <h2 className="trust__title">Part of the Everlast Wellness family.</h2>
        <div className="trust__brands">
          {[
            "Everlast Wellness Medical Center",
            "Everlast Academy",
            "Al Jameela Club",
          ].map((name, i) => (
            <span key={name} className="trust__brand-group">
              <span className="trust__brand-name">{name}</span>
              {i < 2 && <StarIcon size={12} color="var(--aln-wine-soft)" />}
            </span>
          ))}
        </div>
        <p className="trust__desc">
          Over a decade of medical-grade aesthetic expertise, expert doctors,
          and trusted care - now in one exclusive membership.
        </p>
      </div>
    </section>
  );
}

/*  FINAL CTA  */
function FinalCTA() {
  return (
    <section id="contact" className="home-cta">
      <div className="home-cta__bg-dots" aria-hidden />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.5}
        aria-hidden
        className="home-cta__star home-cta__star--1"
      >
        <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.6}
        aria-hidden
        className="home-cta__star home-cta__star--2"
      >
        <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
      </svg>

      <div data-reveal className="home-cta__inner">
        <span className="home-cta__eyebrow">
          <StarIcon size={12} color="var(--aln-wine-soft)" /> Your membership
          awaits
        </span>
        <h2 className="home-cta__title">
          Your Beauty Journey Starts With{" "}
          <span className="home-cta__title-accent">You.</span>
        </h2>
        <p className="home-cta__desc">
          Whether your goal is healthier-looking skin, improved hydration, skin
          rejuvenation, facial enhancement, or simply maintaining your
          appearance, Al Nojoom Club is designed to support you throughout your
          journey. Don't just book a treatment. Build a relationship with your
          aesthetic care.
        </p>
        <div className="home-cta__actions">
          <a
            href="https://everlastwellness.store/product/alnojoom-club/"
            target="_blank"
            rel="noopener"
            className="home-cta__join-btn"
          >
            Join Al Nojoom Club <ArrowDiag />
          </a>
        </div>
      </div>
    </section>
  );
}

/*  HOME PAGE  */
export default function Home() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  useParallax(rootRef, 0.25);

  return (
    <main ref={rootRef} className="home">
      <Hero />
      <WhyChooseUs />
      <FeaturedServices id="services" />
      <MarqueeStrip />
      <AboutSnapshot />
      <MembershipTracks />
      <Gallery />
      <Testimonials />
      <TrustFamily />
      <FinalCTA />
    </main>
  );
}
