import { useState } from 'react'
import logoIvoryImg from '../imgs/logo.png'
import '../css/Footer.css'

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
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) setSent(true)
  }

  return (
    <footer className="footer">
      <div className="footer__bg-dots" aria-hidden />

      <div className="footer__inner">

        {/* â"€â"€ Newsletter â"€â"€ */}
        <div className="footer__newsletter">
          <div className="footer__newsletter-copy">
            <span className="footer__newsletter-eyebrow">Members get more</span>
            <h2 className="footer__newsletter-title">
              Subscribe &amp; save <span className="footer__newsletter-accent">10%</span>
            </h2>
            <p className="footer__newsletter-desc">
              Be the first to know about new treatments, member events, and seasonal offers.
            </p>
          </div>

          {sent ? (
            <div className="footer__newsletter-success">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#86e0aa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Subscribed - talk soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="footer__form">
              <div className="footer__form-input-wrap">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(247,243,237,0.55)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={3} y={5} width={18} height={14} rx={2}/><path d="m3 7 9 6 9-6"/>
                </svg>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="footer__form-input"
                />
              </div>
              <button type="submit" className="footer__subscribe-btn">
                Subscribe
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* â"€â"€ Footer grid â"€â"€ */}
        <div className="footer__grid">

          {/* Brand */}
          <div>
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
          <div>
            <h3 className="footer__col-title">Explore</h3>
            <ul className="footer__nav-list">
              {[['Home', '#hero'], ['About us', '#about'], ['Services', '#services'], ['Contact us', '#contact']].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="footer__nav-link">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h3 className="footer__col-title">Treatments</h3>
            <ul className="footer__nav-list">
              {['Skin Booster', 'Lip Filler', 'Upper Face Neurotoxin', 'Beard Trimming'].map(t => (
                <li key={t}>
                  <a href="#services" className="footer__nav-link">{t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit us */}
          <div>
            <h3 className="footer__col-title">Visit us</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <svg className="footer__contact-icon" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="var(--aln-wine-soft)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx={12} cy={10} r={3}/>
                </svg>
                <a href="https://maps.app.goo.gl/WQSCYByNBC5QJRAH6" target="_blank" rel="noopener" className="footer__contact-link">
                  446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE
                </a>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <svg className="footer__contact-icon" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="var(--aln-wine-soft)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
                </svg>
                <a href="tel:+971600551615" className="footer__contact-link">+971 600551615</a>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <svg className="footer__contact-icon" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="var(--aln-wine-soft)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={3} y={5} width={18} height={14} rx={2}/><path d="m3 7 9 6 9-6"/>
                </svg>
                <a href="mailto:customer.service@everlastwellness.com" className="footer__contact-link">customer.service@everlastwellness.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* â"€â"€ Bottom bar â"€â"€ */}
        <div className="footer__bottom">
          <p className="footer__copyright">© 2025 ALNOJOOM CLUB. All Rights Reserved.</p>
          <p className="footer__region">Abu Dhabi · UAE</p>
        </div>
      </div>
    </footer>
  )
}

