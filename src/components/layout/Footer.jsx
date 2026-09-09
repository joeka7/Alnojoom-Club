import { Link } from 'react-router-dom'
import logoIvoryImg from '../../assets/logo.png'
import { LocationIcon, PhoneIcon, MailIcon } from '../ui/icons'
import './Footer.css'

/* Real routes, not in-page anchors: the footer shows on every page, so a bare
   '#services' only worked from the homepage. */
const EXPLORE_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About us',   to: '/about-us' },
  { label: 'Services',   to: '/services' },
  { label: 'Contact us', to: '/contact' },
]

/* Deep links into the specific treatment on the track page that carries it.
   The hashes match the ids TrackPage gives each card, which it derives from the
   same names via treatmentId() — so these cannot drift apart silently.

   Skin Booster and Upper Face Neurotoxin appear on both tracks; the footer
   points each at one page so a single link has one unambiguous destination. */
const TREATMENT_LINKS = [
  { label: 'Skin Booster',          to: '/services/for-women#skin-booster' },
  { label: 'Lip Enhancement',       to: '/services/for-women#lip-enhancement' },
  { label: 'Upper Face Neurotoxin', to: '/services/for-women#upper-face-neurotoxin' },
  { label: 'Beard Trimming',        to: '/services/for-men#beard-trimming' },
]

const SOCIALS = [
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/everlastwellness/' },
  { label: 'Facebook',  icon: 'facebook',  href: 'https://www.facebook.com/everlastwellnessmc/' },
  { label: 'TikTok',    icon: 'tiktok',    href: 'https://www.tiktok.com/@everlastwellness' },
  { label: 'YouTube',   icon: 'youtube',   href: 'https://www.youtube.com/channel/UC8BxCEjG34knpcKLoFLNUgg' },
  { label: 'LinkedIn',  icon: 'linkedin',  href: 'https://www.linkedin.com/company/everlastwellnessmc/' },
  { label: 'Snapchat',  icon: 'snapchat',  href: 'https://www.snapchat.com/add/everlastwmc' },
]

const SOCIAL_ICONS = {
  instagram: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={18} height={18} rx={5}/><circle cx={12} cy={12} r={3.6}/><circle cx={17.4} cy={6.6} r={1.1} fill="currentColor" stroke="none"/>
    </svg>
  ),
  facebook: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9.3h2.4l.4-2.9H14V4.7c0-.84.27-1.4 1.46-1.4H17V.8C16.4.72 15.5.66 14.5.66 12.3.66 10.8 2 10.8 4.4v2H8.4v2.9h2.4V21H14z"/>
    </svg>
  ),
  youtube: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
      <rect x={2.5} y={6} width={19} height={12} rx={3.6}/><path d="M10.6 9.4v5.2L15 12z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  linkedin: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.2 8.9h3.6V21H3.2zM9.2 8.9h3.45v1.65h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.3 2.4 4.3 5.5V21h-3.6v-5.35c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21H9.2z"/>
    </svg>
  ),
  tiktok: (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.3 3c.35 2.1 1.78 3.74 3.94 3.96v2.93c-1.4.04-2.74-.4-3.94-1.2v5.45a5.36 5.36 0 1 1-5.36-5.36c.3 0 .58.03.86.08v3.02a2.43 2.43 0 1 0 1.67 2.3V3z"/>
    </svg>
  ),
  snapchat: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
      <path d="M12 3.2c2.3 0 3.7 1.7 3.7 3.9 0 .85.02 1.5.18 1.86.17.32.66.5 1.12.6.4.1.7.26.7.6 0 .5-.78.8-1.5.96.08.4.4.86 1.04 1.16.3.14.46.4.36.7-.2.6-1.5.48-2.16.78-.4.18-.5.86-.96.86-.4 0-.86-.36-1.62-.36-.86 0-1.32.56-2.58.56s-1.72-.56-2.58-.56c-.76 0-1.22.36-1.62.36-.46 0-.56-.68-.96-.86-.66-.3-1.96-.18-2.16-.78-.1-.3.06-.56.36-.7.64-.3.96-.76 1.04-1.16-.72-.16-1.5-.46-1.5-.96 0-.34.3-.5.7-.6.46-.1.95-.28 1.12-.6.16-.36.18-1 .18-1.86C8.3 4.9 9.7 3.2 12 3.2Z"/>
    </svg>
  ),
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bg-dots" aria-hidden />

      <div className="footer__inner">

        {/* ── Footer grid ── */}
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__col footer__col--brand">
            <img src={logoIvoryImg} alt="Al Nojoom Club" className="footer__logo" />
            <p className="footer__tagline">Experience timeless beauty.</p>
            <div className="footer__socials">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="footer__social-btn"
                >
                  {SOCIAL_ICONS[s.icon]}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="footer__col footer__col--explore">
            <h3 className="footer__col-title">Explore</h3>
            <ul className="footer__nav-list">
              {EXPLORE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer__nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div className="footer__col footer__col--treatments">
            <h3 className="footer__col-title">Treatments</h3>
            <ul className="footer__nav-list">
              {TREATMENT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer__nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit us */}
          <div className="footer__col footer__col--visit">
            <h3 className="footer__col-title">Visit us</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <LocationIcon className="footer__contact-icon" size={17} color="var(--aln-wine-soft)" />
                <a href="https://maps.app.goo.gl/WQSCYByNBC5QJRAH6" target="_blank" rel="noopener" className="footer__contact-link">
                  446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE
                </a>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <PhoneIcon className="footer__contact-icon" size={17} color="var(--aln-wine-soft)" />
                <a href="tel:+971600551615" className="footer__contact-link">+971 600551615</a>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <MailIcon className="footer__contact-icon" size={17} color="var(--aln-wine-soft)" />
                <a href="mailto:customer.service@everlastwellness.com" className="footer__contact-link">customer.service@everlastwellness.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">© {new Date().getFullYear()} ALNOJOOM CLUB. All Rights Reserved.</p>
          <p className="footer__region">Abu Dhabi · UAE</p>
        </div>
      </div>
    </footer>
  )
}

