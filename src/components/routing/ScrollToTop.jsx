import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets the window scroll to the top on every route change.
 *
 * Mounted once inside <BrowserRouter>, so it covers every navigation the
 * router performs: <Link>, navigate(), and programmatic history changes.
 *
 * Keyed on `pathname` only, so in-page anchors (#services, #about) and the
 * scrollIntoView calls on the Services page keep working untouched.
 *
 * `behavior: 'instant'` (not 'auto') is required because index.css sets
 * `html { scroll-behavior: smooth }` — 'auto' defers to that CSS value and
 * would animate the jump.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // A hash target owns the scroll position for that navigation.
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
