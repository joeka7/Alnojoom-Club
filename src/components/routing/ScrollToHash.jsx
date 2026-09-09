import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element named by the URL hash after a client-side navigation.
 *
 * The browser only resolves a hash itself on a full document load. With React
 * Router the destination page mounts *after* the URL changes, so a link like
 * `/services/for-men#beard-trimming` arriving from another page would land at
 * the top with the hash silently ignored. This closes that gap.
 *
 * Mounted alongside <ScrollToTop>, which bails out whenever a hash is present
 * so the two never fight over the scroll position.
 *
 * The retry loop covers the case where the target has not painted yet on the
 * first frame — images above it are still resolving their height, so the
 * element's position is not final. It gives up after ~1s rather than looping
 * forever on a hash that matches nothing.
 *
 * Offsetting for the fixed nav is left to CSS: the targets carry
 * `scroll-margin-top` (see .track-treatment-card in Track.css), which
 * scrollIntoView honours.
 */
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return

    // decodeURIComponent so non-ASCII ids still resolve; slice(1) drops the '#'.
    let id
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      id = hash.slice(1)
    }
    if (!id) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let frame
    let elapsed = 0

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({
          behavior: reduce ? 'instant' : 'smooth',
          block: 'start',
        })
        return
      }
      // Not mounted yet — look again on the next frame, up to ~1s.
      elapsed += 16
      if (elapsed < 1000) frame = requestAnimationFrame(tryScroll)
    }

    frame = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(frame)
  }, [hash, pathname])

  return null
}
