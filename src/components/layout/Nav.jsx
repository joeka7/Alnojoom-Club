import { useState, useEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { ArrowDiag, MenuIcon, CloseIcon } from '../ui/icons'
import logoImg from '../../assets/logo.png'
import './Nav.css'

const LINKS = [
  { label: 'Home',       to: '/',         key: 'home' },
  { label: 'About us',   to: '/about',    key: 'about' },
  {
    label: 'Services',
    to: '/services',
    key: 'services',
    children: [
      { label: 'For Women', to: '/services/for-women' },
      { label: 'For Men',   to: '/services/for-men' },
    ],
  },
  { label: 'Contact us', to: '/contact',  key: 'contact' },
]

export default function Nav({ active = 'home' }) {
  const { pathname } = useLocation()
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

  // Hiding the body scrollbar widens the viewport, which recomputes the
  // vw-based --container-pad and slides the logo sideways as the menu opens.
  // Padding the body by the scrollbar's width keeps the viewport constant.
  useEffect(() => {
    if (!menuOpen) return
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [menuOpen])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">

        <Link to="/" className="nav__logo">
          <img src={logoImg} alt="Al Nojoom Club" className="nav__logo-icon" />
        </Link>

        {!isMobile && (
          <nav className="nav__links">
            {LINKS.map(link => {
              const linkEl = (
                <Link
                  to={link.to}
                  className={`nav__link${active === link.key ? ' nav__link--active' : ''}${link.children ? ' nav__link--has-submenu' : ''}`}
                >
                  {link.label}
                  {link.children && (
                    <svg
                      className="nav__link-chevron"
                      width={13}
                      height={13}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
              )

              if (!link.children) return <Fragment key={link.key}>{linkEl}</Fragment>

              // Opens on hover, and on keyboard focus inside (CSS-only — see
              // the :has(:focus-visible) note in Nav.css).
              return (
                <div key={link.key} className="nav__dropdown">
                  {linkEl}
                  <div className="nav__submenu">
                    {link.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`nav__submenu-link${pathname === child.to ? ' nav__submenu-link--active' : ''}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
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
              <ArrowDiag size={15} />
            </a>
          )}
          {isMobile && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="nav__hamburger"
            >
              <MenuIcon />
            </button>
          )}
        </div>
      </div>

      {menuOpen &&
        createPortal(
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
              <CloseIcon size={22} />
            </button>
          </div>

          <nav className="nav__mobile-links">
            {LINKS.map(link => (
              <Fragment key={link.key}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`nav__mobile-link${active === link.key ? ' nav__mobile-link--active' : ''}`}
                >
                  {link.label}
                </Link>
                {link.children?.map(child => (
                  <Link
                    key={child.to}
                    to={child.to}
                    onClick={() => setMenuOpen(false)}
                    className={`nav__mobile-sublink${pathname === child.to ? ' nav__mobile-sublink--active' : ''}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </Fragment>
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
              <ArrowDiag size={17} />
            </a>
          </div>
        </div>,
          document.body
        )}
    </header>
  )
}

