import { useState, useRef } from "react";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import Eyebrow from "../components/Eyebrow";
import "../css/Home.css";

/* â"€â"€ Images â"€â"€ */
import heroImg from "../imgs/hero.webp";
import skinImg from "../imgs/Skin-Booster-scaled.webp";
import lipImg from "../imgs/Lip-Filler-scaled.webp";
import upperImg from "../imgs/Upper-Face-scaled.webp";
import beardImg from "../imgs/bearded-man.webp";
import aboutImg from "../imgs/Website-09.webp";
import gal1 from "../imgs/beauty.webp";
import gal2 from "../imgs/face.webp";
import gal3 from "../imgs/Upper-Lower-Face.webp";
import gal4 from "../imgs/skincare-1.png";
import gal5 from "../imgs/mesotherapy-1.png";
import gal6 from "../imgs/lip-augmentation-3-1.png";

/* â"€â"€ Inline SVG icons â"€â"€ */
function StarIcon({ size = 14, color = "var(--aln-wine)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
    </svg>
  );
}
function ArrowRight({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ArrowDiag({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STATS = [
  { val: "10+", label: "Years of expertise" },
  { val: "3", label: "Signature treatments" },
  { val: "Unlimited", label: "Member sessions", italic: true },
  { val: "2", label: "Women & men tracks" },
];

function Hero() {
  return (
    <section className="hero">
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
            Experience
            <br />
            timeless <span className="hero__title-accent">beauty.</span>
          </h1>

          <p data-reveal data-delay="180" className="hero__desc">
            Al Nojoom Club is the destination for premium aesthetic treatments.
            One exclusive membership grants unlimited access to three
            transformative beauty services - for a naturally youthful, flawless
            look.
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
            <a href="#services" className="hero__btn hero__btn--secondary">
              Explore services <ArrowRight />
            </a>
          </div>

          <div data-reveal data-delay="360" className="hero__meta">
            <span className="hero__meta-location">
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--aln-wine)"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WHY CHOOSE US
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const WHY_CARDS = [
  {
    title: "Board-Certified Specialists",
    desc: "Our doctors and aesthetic practitioners deliver safe, precise, and effective treatments.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "10+ Years of Experience",
    desc: "A proven track record of exceptional aesthetic results using the latest techniques.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "State-of-the-Art Equipment",
    desc: "Advanced technology for optimal results with minimal discomfort and downtime.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6 4.5 4.5M18 6l1.5-1.5M6 18l-1.5 1.5M18 18l1.5 1.5" />
        <circle cx={12} cy={12} r={4} />
      </svg>
    ),
  },
  {
    title: "Trusted by Thousands",
    desc: "A reputation for excellence and client satisfaction across Abu Dhabi.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A3.5 3.5 0 0 0 12 5.5 3.5 3.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    ),
  },
];

function WhyChooseUs() {
  return (
    <section className="why">
      <div className="why__inner">
        <div data-reveal className="why__header">
          <Eyebrow>Why Al Nojoom</Eyebrow>
          <h2 className="why__title">
            Beauty, backed by <span className="why__title-accent">medical</span>{" "}
            expertise.
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FEATURED SERVICES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const SERVICES = [
  {
    id: "svc-skin",
    tag: "Hydration",
    title: "Skin Booster",
    img: skinImg,
    desc: "Microdroplets of hyaluronic acid that deeply hydrate, restore radiance, and smooth texture for a naturally refreshed glow.",
  },
  {
    id: "svc-lip",
    tag: "Definition",
    title: "Lip Filler",
    img: lipImg,
    desc: "Premium HA filler to enhance volume, symmetry and hydration - from a subtle boost to a fuller, beautifully defined shape.",
  },
  {
    id: "svc-botox",
    tag: "Smoothing",
    title: "Upper Face Neurotoxin",
    img: upperImg,
    desc: "Expert Botox that softens forehead lines, frown lines and crow's feet for a relaxed, youthful expression.",
  },
];

function FeaturedServices() {
  return (
    <section id="services" className="services">
      <div className="services__inner">
        <div data-reveal className="services__header">
          <div className="services__header-copy">
            <Eyebrow>Signature treatments</Eyebrow>
            <h2 className="services__title">
              Three transformative treatments.{" "}
              <span className="services__title-accent">One</span> membership.
            </h2>
          </div>
          <a href="#services" className="services__all-link">
            All services <ArrowRight />
          </a>
        </div>

        <div data-reveal data-delay="80" className="services__grid">
          {SERVICES.map((s) => (
            <a key={s.id} href="#services" className="service-card">
              <img src={s.img} alt={s.title} className="service-card__image" />
              <div className="service-card__body">
                <span className="service-card__tag">{s.tag}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <span className="service-card__read-more">
                  Read more <ArrowRight size={15} />
                </span>
              </div>
            </a>
          ))}
        </div>

        <a href="#services" data-reveal data-delay="140" className="beard-card">
          <img
            src={beardImg}
            alt="Beard trimming treatment"
            className="beard-card__image"
          />
          <div className="beard-card__body">
            <span className="beard-card__eyebrow">For men</span>
            <h3 className="beard-card__title">Beard Trimming</h3>
            <p className="beard-card__desc">
              A precision laser treatment that shapes and defines the beard
              line, reduces unwanted growth, and ends razor irritation - for a
              consistently sharp, sculpted look.
            </p>
            <span className="beard-card__cta">
              Discover the men's track <ArrowRight />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MARQUEE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const MARQUEE_ITEMS = [
  "Skin Booster",
  "Lip Filler",
  "Upper Face Neurotoxin",
  "Beard Trimming",
];

function MarqueeStrip() {
  const row = (
    <div className="marquee__row">
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={i} className="marquee__item">
          {item}
          <StarIcon size={14} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ABOUT SNAPSHOT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
          <Eyebrow>About the club</Eyebrow>
          <h2 className="about-snapshot__title">
            Al Nojoom Club, by{" "}
            <span className="about-snapshot__title-accent">
              Everlast Wellness
            </span>
            .
          </h2>
          <p className="about-snapshot__desc">
            Everlast Wellness is an aesthetic wellness clinic specializing in
            dermatological and anti-aging treatments. Our mission is to serve
            the community with the highest level of health and wellness - body,
            mind, and spirit - supported by a team of medical experts with over
            a decade of experience.
          </p>
          <div className="about-snapshot__stats">
            {ABOUT_STATS.map((s) => (
              <div key={s.label}>
                <div className="about-snapshot__stat-val">{s.val}</div>
                <div className="about-snapshot__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <a href="#about" className="about-snapshot__cta">
            Read our story <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MEMBERSHIP TRACKS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const WOMEN_TREATMENTS = [
  {
    title: "Lip Filler",
    desc: "Enhances volume and definition for naturally plump, beautifully contoured lips.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-4.5-9.3-9.2C1.2 8.7 2.6 5.5 5.6 5.1c1.9-.2 3.4.9 4.4 2.3 1-1.4 2.5-2.5 4.4-2.3 3 .4 4.4 3.6 2.9 6.7C19 16.5 12 21 12 21Z" />
      </svg>
    ),
  },
  {
    title: "Upper Face Neurotoxin",
    desc: "Say goodbye to wrinkles with expert Botox for a relaxed, youthful expression.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx={12} cy={12} r={3.2} />
      </svg>
    ),
  },
  {
    title: "Skin Booster",
    desc: "Deeply hydrates and improves skin texture, leaving you with a radiant glow.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.5S5 9 5 14a7 7 0 0 0 14 0c0-5-7-11.5-7-11.5Z" />
      </svg>
    ),
  },
];
const MEN_TREATMENTS = [
  {
    title: "Beard Trimming",
    desc: "Sharp, defined beard lines - laser-precise shaping minus the razor irritation.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M7 6v6a5 5 0 0 0 10 0V6M9 21l3-4 3 4" />
      </svg>
    ),
  },
  {
    title: "Upper Face Neurotoxin",
    desc: "Smooth expression lines and prevent new ones for a refreshed, natural look.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx={12} cy={12} r={3.2} />
      </svg>
    ),
  },
  {
    title: "Skin Booster",
    desc: "Hydrated, healthy-looking skin with a natural, well-rested glow.",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.5S5 9 5 14a7 7 0 0 0 14 0c0-5-7-11.5-7-11.5Z" />
      </svg>
    ),
  },
];

function MembershipTracks() {
  const [track, setTrack] = useState("women");
  const list = track === "women" ? WOMEN_TREATMENTS : MEN_TREATMENTS;

  return (
    <section className="membership">
      <div className="membership__inner">
        <div data-reveal className="membership__header">
          <span className="membership__eyebrow">
            Membership Â· choose your path
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GALLERY
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const GAL_IMAGES = [
  { src: gal1, ratio: "3/4", alt: "Beauty treatment" },
  { src: gal2, ratio: "1/1", alt: "Facial treatment" },
  { src: gal3, ratio: "4/5", alt: "Upper & lower face" },
  { src: gal4, ratio: "4/5", alt: "Skincare treatment" },
  { src: gal5, ratio: "1/1", alt: "Mesotherapy" },
  { src: gal6, ratio: "3/4", alt: "Lip augmentation" },
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TESTIMONIALS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const TESTIMONIALS = [
  {
    q: "A one-year membership with unlimited sessions on three services means I always look and feel my best. The results are amazing.",
    n: "Layla A.",
    r: "Member Â· Abu Dhabi",
    initial: "L",
  },
  {
    q: "The team is professional and the center is immaculate. My skin has never looked better since joining the club.",
    n: "Sara M.",
    r: "Member Â· Al Bateen",
    initial: "S",
  },
  {
    q: "As a busy professional, the unlimited sessions are convenient, luxurious, and completely worth it.",
    n: "Omar K.",
    r: "Member Â· Abu Dhabi",
    initial: "O",
  },
];

function Stars() {
  return (
    <div className="testimonial__stars">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} size={16} />
      ))}
    </div>
  );
}

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
              <Stars />
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FINAL CTA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
          Ready to <span className="home-cta__title-accent">glow?</span>
        </h2>
        <p className="home-cta__desc">
          Join Al Nojoom Club today and unlock a full year of unlimited, premium
          aesthetic treatments.
        </p>
        <div className="home-cta__actions">
          <a
            href="https://everlastwellness.store/product/alnojoom-club/"
            target="_blank"
            rel="noopener"
            className="home-cta__join-btn"
          >
            Join the club <ArrowDiag />
          </a>
          <a href="tel:+971600551615" className="home-cta__phone-btn">
            <svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            +971 600551615
          </a>
        </div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HOME PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Home() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  useParallax(rootRef, 0.25);

  return (
    <main ref={rootRef} className="home">
      <Hero />
      <WhyChooseUs />
      <FeaturedServices />
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
