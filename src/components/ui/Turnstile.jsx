import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise = null

/* Loads the Turnstile script once per page, however many widgets mount. */
function loadScript() {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = SCRIPT_SRC
    el.async = true
    el.defer = true
    el.onload = () => resolve()
    el.onerror = () => {
      // Let a later mount retry rather than caching the failure forever.
      scriptPromise = null
      reject(new Error('turnstile-script-failed'))
    }
    document.head.appendChild(el)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile widget.
 *
 * Rendered explicitly (rather than via auto-render) so its lifecycle follows
 * React's: the widget is created on mount and removed on unmount, instead of
 * Cloudflare scanning the DOM and leaving an orphaned widget behind when the
 * form swaps to its success state.
 *
 * The token this produces is only a claim. It means nothing until the server
 * exchanges it with Cloudflare — see server/turnstile.js.
 *
 * @param {(token: string|null) => void} onVerify  Called with the token when
 *        the challenge passes, and with null when it expires or errors.
 */
export default function Turnstile({ siteKey, onVerify, onError }) {
  const ref = useRef(null)
  // Kept in a ref so the effect never re-runs (and re-renders the widget) just
  // because the parent passed a new closure.
  const cbRef = useRef({ onVerify, onError })
  cbRef.current = { onVerify, onError }

  useEffect(() => {
    if (!siteKey) return

    let widgetId = null
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !ref.current) return
        widgetId = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: token => cbRef.current.onVerify?.(token),
          // A token is short-lived. Clearing it on expiry means a form left
          // open in a tab cannot submit a token the server would reject.
          'expired-callback': () => cbRef.current.onVerify?.(null),
          'error-callback': () => {
            cbRef.current.onVerify?.(null)
            cbRef.current.onError?.()
          },
        })
      })
      .catch(() => {
        if (!cancelled) cbRef.current.onError?.()
      })

    return () => {
      cancelled = true
      if (widgetId !== null) {
        try {
          window.turnstile?.remove(widgetId)
        } catch {
          // Already torn down with the DOM node; nothing to clean up.
        }
      }
    }
  }, [siteKey])

  return <div ref={ref} className="contact-form__turnstile" />
}
