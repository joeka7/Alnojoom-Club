import { useEffect, useState } from 'react'
import { DEFAULT_COUNTRY, byCode } from '../data/countries'

const CACHE_KEY = 'aln:visitor-country'

/**
 * Resolves the visitor's ISO country code so a phone field can preselect their
 * dial code.
 *
 * Order of preference:
 *   1. sessionStorage — one lookup per session, not per page view.
 *   2. A geo-IP lookup (ipwho.is, with ipapi.co as a backup).
 *   3. DEFAULT_COUNTRY.
 *
 * The default is returned immediately and replaced if a lookup succeeds, so the
 * field is always usable — a blocked request, an ad blocker, an exhausted rate
 * limit, or being offline all just leave the default in place. `detected` says
 * whether the value came from a real lookup, which lets the caller avoid
 * overwriting a choice the user has already made themselves.
 */
export function useVisitorCountry() {
  const [country, setCountry] = useState(DEFAULT_COUNTRY)
  const [detected, setDetected] = useState(false)

  useEffect(() => {
    let cancelled = false

    const apply = code => {
      const match = byCode(code)
      if (!match || cancelled) return false
      setCountry(match.code)
      setDetected(true)
      return true
    }

    let cached = null
    try {
      cached = sessionStorage.getItem(CACHE_KEY)
    } catch {
      // Private mode / storage disabled — fall through to the network lookup.
    }
    if (cached && apply(cached)) return

    // Both endpoints are free, CORS-enabled, and need no API key. They are only
    // ever asked for a country code; no data about the visitor is sent.
    //
    // Note both signal failure *in the body* with HTTP 200 -- ipapi.co answers
    // a rate-limited request with `{ error: true }`, ipwho.is with
    // `{ success: false }` -- so checking res.ok is not enough. `pick` returns
    // undefined for those, and the code is validated against COUNTRIES below
    // before it is used.
    const SOURCES = [
      {
        url: 'https://ipwho.is/?fields=country_code,success',
        pick: d => (d && d.success !== false ? d.country_code : undefined),
      },
      {
        url: 'https://ipapi.co/json/',
        pick: d => (d && !d.error ? d.country_code : undefined),
      },
    ]

    const controller = new AbortController()
    // Never let a hanging request keep the request alive indefinitely.
    const timer = setTimeout(() => controller.abort(), 4000)

    ;(async () => {
      for (const src of SOURCES) {
        try {
          const res = await fetch(src.url, { signal: controller.signal })
          if (!res.ok) continue
          const code = src.pick(await res.json())
          if (!byCode(code)) continue
          try {
            sessionStorage.setItem(CACHE_KEY, code)
          } catch {
            // Caching is an optimisation; failing to cache is not an error.
          }
          if (apply(code)) return
        } catch {
          // Aborted, offline, blocked, or rate-limited: try the next source.
        }
      }
    })().finally(() => clearTimeout(timer))

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  return { country, detected }
}
