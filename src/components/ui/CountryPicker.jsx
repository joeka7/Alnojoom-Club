import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES, PRIORITY_CODES, byCode } from '../../data/countries'

/* Scores a country against the query: name, dial code, or ISO code, so "ae",
   "971", "+971" and "emirates" all find the UAE. Digits are compared without
   the leading `+`, so typing it or not makes no difference.
 *
 * Returns a rank rather than a boolean because the obvious match has to come
 * first: "ae" matches Isr(ae)l on the name too, and alphabetical order would
 * otherwise put Israel above the country whose code was actually typed.
 * 0 = no match; higher is a better match. */
function score(country, query) {
  const q = query.trim().toLowerCase()
  if (!q) return 1

  const name = country.name.toLowerCase()
  const dial = country.dial.slice(1)
  const digits = q.replace(/\D/g, '')

  if (country.code.toLowerCase() === q) return 5
  if (name.startsWith(q)) return 4
  if (digits && dial === digits) return 3
  if (digits && dial.startsWith(digits)) return 2
  if (name.includes(q)) return 1
  return 0
}

/**
 * Dial-code picker: a button showing the current flag and code, opening a
 * searchable list.
 *
 * Replaces a native <select>, which cannot show flag images or be searched
 * beyond type-ahead. That trade means re-implementing what the native control
 * gave us for free, so the listbox keeps full keyboard support (arrows, Home/
 * End, Enter, Escape), closes on outside click, and carries the ARIA roles a
 * screen reader needs to announce it as a combobox.
 */
export default function CountryPicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const selected = byCode(value) || COUNTRIES[0]

  /* Unfiltered, the common origins sit on top so they need no scrolling. Once
     the user is searching, that ordering would just bury matches, so results
     are ranked by how well they match instead. */
  const results = useMemo(() => {
    if (query.trim()) {
      return COUNTRIES
        .map(c => ({ c, s: score(c, query) }))
        .filter(r => r.s > 0)
        // Best match first; ties stay alphabetical, since COUNTRIES already is.
        .sort((a, b) => b.s - a.s)
        .map(r => r.c)
    }
    const priority = PRIORITY_CODES.map(byCode).filter(Boolean)
    return [...priority, ...COUNTRIES.filter(c => !PRIORITY_CODES.includes(c.code))]
  }, [query])

  // Reset the highlight whenever the result set changes underneath it.
  useEffect(() => setActive(0), [query])

  // Focus the search box on open; clear the query on close so the next open
  // starts fresh rather than showing the last search.
  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery('')
  }, [open])

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = e => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const choose = country => {
    onChange(country.code)
    setOpen(false)
  }

  const onKeyDown = e => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive(i => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(results.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (results[active]) choose(results[active])
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      default:
    }
  }

  return (
    <div ref={rootRef} className="country-picker">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} ${selected.dial}`}
        className={`country-picker__trigger${open ? ' country-picker__trigger--open' : ''}`}
      >
        <img
          src={`/flags/${selected.code.toLowerCase()}.svg`}
          alt=""
          aria-hidden
          className="country-picker__flag"
        />
        <span className="country-picker__dial">{selected.dial}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="country-picker__menu">
          <div className="country-picker__search">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search country or code"
              aria-label="Search countries"
              className="country-picker__search-input"
            />
          </div>

          {results.length === 0 ? (
            <p className="country-picker__empty">No countries match "{query.trim()}"</p>
          ) : (
            <ul ref={listRef} role="listbox" className="country-picker__list">
              {results.map((c, i) => (
                <li
                  key={c.code}
                  role="option"
                  aria-selected={c.code === selected.code}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c)}
                  className={
                    'country-picker__option' +
                    (i === active ? ' country-picker__option--active' : '') +
                    (c.code === selected.code ? ' country-picker__option--selected' : '')
                  }
                >
                  <img
                    src={`/flags/${c.code.toLowerCase()}.svg`}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="country-picker__flag"
                  />
                  <span className="country-picker__name">{c.name}</span>
                  <span className="country-picker__option-dial">{c.dial}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function Chevron({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden
      className={`country-picker__chevron${open ? ' country-picker__chevron--open' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
