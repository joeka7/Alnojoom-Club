import { Link } from "react-router-dom";
import Eyebrow from "../ui/Eyebrow";
import { ArrowRight } from "../ui/icons";
import womenTrackImg from "../../assets/gallery1.webp";
import menTrackImg from "../../assets/Beard Trimming.webp";
import "./FeaturedServices.css";

/*  FEATURED SERVICES — the two treatment tracks  */
/* Neither page lists treatments here: the section hands the visitor the two
   experiences and lets the Women / Men pages carry the actual menu. */
const TRACKS = [
  {
    id: "women",
    to: "/services/for-women",
    eyebrow: "For Women",
    title: "Her",
    titleAccent: "experience",
    desc: "A curated aesthetic-care experience — skin hydration, facial enhancement and expression-line care, planned around your individual goals.",
    cta: "Explore women's treatments",
    img: womenTrackImg,
    alt: "Aesthetic care for women at Al Nojoom Club",
  },
  {
    id: "men",
    to: "/services/for-men",
    eyebrow: "For Men",
    title: "His",
    titleAccent: "experience",
    desc: "A tailored aesthetic-care experience combining advanced treatments with men's grooming — including laser beard shaping.",
    cta: "Explore men's treatments",
    img: menTrackImg,
    alt: "Aesthetic care for men at Al Nojoom Club",
  },
];

/**
 * Rendered on both the Home and About pages, with one set of markup but two
 * fully separate sets of class names.
 *
 * Every class is built from `block`, `grid` and `panel`, so each page owns its
 * own CSS namespace and no selector can reach across pages:
 *
 *   Home  (FeaturedServices.css) -> .services       / .tracks
 *                                   / .track-panel
 *   About (AboutServices.css)    -> .about-services / .about-tracks
 *                                   / .about-track-panel
 *
 * Home's markup is unchanged: the defaults reproduce its original class names
 * exactly. That is why the prefixes are props rather than a duplicated
 * component -- one component, two fully isolated stylesheets.
 *
 * `id` is likewise a prop so the two pages do not both claim the same fragment
 * target: Home keeps #services for its in-page anchor, About renders no id.
 */
export default function FeaturedServices({
  id,
  block = "services",
  grid = "tracks",
  panel = "track-panel",
}) {
  return (
    <section id={id} className={block}>
      <div className={`${block}__inner`}>
        <div data-reveal className={`${block}__header`}>
          <div className={`${block}__header-copy`}>
            <Eyebrow>Featured treatments</Eyebrow>
            <h2 className={`${block}__title`}>
              Care, <span className={`${block}__title-accent`}>Designed</span>{" "}
              Around You
            </h2>
          </div>
          <p className={`${block}__lede`}>
            Most treatments are shared across both experiences. What changes is
            how they are planned around you.
          </p>
        </div>

        <div className={grid}>
          {TRACKS.map((t, i) => (
            <Link
              key={t.id}
              to={t.to}
              data-reveal
              data-delay={i * 90}
              className={`${panel} ${panel}--${t.id}`}
            >
              <div className={`${panel}__media`}>
                <img src={t.img} alt={t.alt} className={`${panel}__image`} />
              </div>
              <div className={`${panel}__body`}>
                <Eyebrow>{t.eyebrow}</Eyebrow>
                <h3 className={`${panel}__title`}>
                  {t.title}{" "}
                  <span className={`${panel}__title-accent`}>
                    {t.titleAccent}
                  </span>
                  .
                </h3>
                <p className={`${panel}__desc`}>{t.desc}</p>
                <span className={`${panel}__cta`}>
                  <span className={`${panel}__cta-label`}>{t.cta}</span>
                  <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
