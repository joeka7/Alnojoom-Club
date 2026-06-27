import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../imgs/logo.png'
import '../css/Nav.css'

const LINKS = [
  { label: 'Home',       to: '/',         key: 'home' },
  { label: 'About us',   to: '/about',    key: 'about' },
  { label: 'Services',   to: '/services', key: 'services' },
  { label: 'Contact us', to: '/contact',  key: 'contact' },
]

export default function Nav({ active = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const [isMobile, setIsMobile]  = useState(false)

  useEffect(() => {
    const onScroll  = () => setScrolled(window.scrollY > 18)
    const onResize  = () => setIsMobile(window.innerWidth < 940)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll(); onResize()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">

        <Link to="/" className="nav__logo">
          <img src={logoImg} alt="Al Nojoom Club" className="nav__logo-icon" />
        </Link>

        {!isMobile && (
          <nav className="nav__links">
            {LINKS.map(link => (
              <Link
                key={link.key}
                to={link.to}
                className={`nav__link${active === link.key ? ' nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="nav__actions">
          {!isMobile && (
            <a
              href="https://everlastwellness.store/product/alnojoom-club/"
              target="_blank"
              rel="noopener"
              className="nav__join-btn"
            >
              Join the club
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          )}
          {isMobile && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="nav__hamburger"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="nav__mobile-overlay">
          <div className="nav__mobile-header">
            <Link to="/" onClick={() => setMenuOpen(false)} className="nav__mobile-logo">
              <img src={logoImg} alt="" className="nav__mobile-logo-icon" />
              <span className="nav__mobile-logo-name">
                Al Nojoom{' '}
                <span className="nav__mobile-logo-sub">Club</span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="nav__close-btn"
            >
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="nav__mobile-links">
            {LINKS.map(link => (
              <Link
                key={link.key}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`nav__mobile-link${active === link.key ? ' nav__mobile-link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__mobile-footer">
            <a
              href="https://everlastwellness.store/product/alnojoom-club/"
              target="_blank"
              rel="noopener"
              className="nav__mobile-cta"
            >
              Join Al Nojoom Club
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <a href="tel:+971600551615" className="nav__mobile-phone">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--aln-wine)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              +971 600551615
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

