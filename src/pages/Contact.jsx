import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import {
  StarIcon, ArrowDiag, LocationIcon, PhoneIcon, MailIcon, HoursIcon,
  Icon,
} from '../components/ui/icons'
import CountryPicker from '../components/ui/CountryPicker'
import Turnstile from '../components/ui/Turnstile'
import { useVisitorCountry } from '../hooks/useVisitorCountry'
import { DEFAULT_COUNTRY, byCode } from '../data/countries'
import './Contact.css'
import buildingImg from '../assets/EWMC-New-Building.webp'

const INFO_CARDS = [
  {
    label: 'Address',
    value: '446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE',
    href: 'https://maps.app.goo.gl/WQSCYByNBC5QJRAH6',
    icon: <LocationIcon size={22} />,
  },
  {
    label: 'Phone',
    value: '+971 600551615',
    href: 'tel:+971600551615',
    icon: <PhoneIcon size={22} />,
  },
  {
    label: 'Email',
    value: 'customer.service@everlastwellness.com',
    href: 'mailto:customer.service@everlastwellness.com',
    icon: <MailIcon size={22} />,
  },
]

const HOURS = [
  { day: 'Monday – Thursday', hours: '9:00 AM – 8:00 PM' },
  { day: 'Friday',            hours: '2:00 PM – 8:00 PM' },
  { day: 'Saturday – Sunday', hours: '10:00 AM – 6:00 PM' },
]

export default function Contact() {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <main ref={rootRef} className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__bg-dots" aria-hidden />
        <div className="contact-hero__inner">
          <span data-reveal className="contact-hero__badge">
            <StarIcon /> Get in touch
          </span>
          <h1 data-reveal data-delay="60" className="contact-hero__title">
            Get in touch <span className="contact-hero__title-accent">with</span> us.
          </h1>
          <p data-reveal data-delay="120" className="contact-hero__desc">
            We'd love to hear from you. Reach out with questions about membership, services, or to book a consultation — our team responds within one business day.
          </p>
        </div>
      </section>

      {/* ── Main section ── */}
      <section className="contact-main">
        <div className="contact-main__grid">

          {/* Form card */}
          <div data-reveal className="contact-form-card">
            <h2 className="contact-form-card__title">Send Us a Message</h2>
            <p className="contact-form-card__desc">
              Fill in the form below and we'll get back to you promptly.
            </p>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div data-reveal data-delay="80" className="contact-sidebar">
            {INFO_CARDS.map(card => (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener"
                className="contact-info-card"
              >
                <span className="contact-info-card__icon">{card.icon}</span>
                <div>
                  <div className="contact-info-card__label">{card.label}</div>
                  <div className="contact-info-card__value">{card.value}</div>
                </div>
              </a>
            ))}

            <div className="contact-hours">
              <div className="contact-hours__header">
                <span className="contact-hours__icon">
                  <HoursIcon size={22} />
                </span>
                <div>
                  <div className="contact-hours__eyebrow">Clinic hours</div>
                  <div className="contact-hours__title">Opening Hours</div>
                </div>
              </div>
              {HOURS.map(h => (
                <div key={h.day} className="contact-hours__row">
                  <span className="contact-hours__day">{h.day}</span>
                  <span className="contact-hours__time">{h.hours}</span>
                </div>
              ))}
            </div>

            <div className="contact-map">
              <img src={buildingImg} alt="Everlast Wellness Medical Center, Al Bateen, Abu Dhabi" className="contact-map__image" />
              <a href="https://maps.google.com/?q=Al+Bateen+Abu+Dhabi" target="_blank" rel="noopener" className="contact-map__link">
                <span className="contact-map__btn">View on Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <div data-reveal className="contact-cta">
        <div className="contact-cta__bg-dots" aria-hidden />
        <div className="contact-cta__copy">
          <span className="contact-cta__eyebrow">Exclusive membership</span>
          <h2 className="contact-cta__title">Ready to join Al Nojoom Club?</h2>
          <p className="contact-cta__desc">
            Unlock unlimited monthly aesthetic treatments with your exclusive membership from Everlast Wellness.
          </p>
        </div>
        <div className="contact-cta__actions">
          <a href="https://everlastwellness.store/product/alnojoom-club/" target="_blank" rel="noopener" className="contact-cta__join-btn">
            Join Al Nojoom Club <ArrowDiag />
          </a>
        </div>
      </div>

    </main>
  )
}

/* ─────────────────────────────────────
   Contact form
───────────────────────────────────── */

/* Public by design — the site key identifies the widget in the browser and is
   meant to be visible. The *secret* key is server-only and must never appear in
   a VITE_ variable, since anything prefixed VITE_ is inlined into the bundle. */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

/* Testing escape hatch, matching CONTACT_DISABLE_TURNSTILE on the server. Set
   VITE_DISABLE_TURNSTILE=true in .env to submit without verification.
   Both halves must be set — the server rejects unverified posts otherwise.
   REMOVES BOT PROTECTION; never enable in production. */
const TURNSTILE_OFF = import.meta.env.VITE_DISABLE_TURNSTILE === 'true'

function ContactForm() {
  const [sent, setSent]           = useState(false)
  const [form, setForm]           = useState({ name: '', country: DEFAULT_COUNTRY, phone: '', email: '', message: '', company: '' })
  const [submitting, setSubmitting] = useState(false)
  const [touchedCountry, setTouchedCountry] = useState(false)
  const [token, setToken]         = useState(null)
  const [error, setError]         = useState('')

  const { country: geoCountry, detected } = useVisitorCountry()

  /* Adopt the detected country, but never overwrite a deliberate choice: once
     the user has opened the picker themselves, a late-arriving lookup is
     ignored. */
  useEffect(() => {
    if (!detected || touchedCountry) return
    setForm(f => ({ ...f, country: geoCountry }))
  }, [detected, geoCountry, touchedCountry])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const selected = byCode(form.country) || byCode(DEFAULT_COUNTRY)

  const submit = async e => {
    e.preventDefault()
    if (submitting) return

    if (!TURNSTILE_OFF && !token) {
      setError('Please complete the verification below.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          country: form.country,
          dial: selected.dial,
          phone: form.phone,
          email: form.email,
          message: form.message,
          company: form.company,
          turnstileToken: token,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        /* The server's messages are written for visitors and never carry SMTP
           or server detail, so they can be shown as-is. These two cases get
           clearer wording than a generic failure would give. */
        const fallback =
          res.status === 429
            ? 'You have sent several messages already. Please try again in a few minutes.'
            : res.status === 503
              ? 'The contact form is temporarily unavailable. Please call or email us instead.'
              : "We couldn't send your message. Please try again."
        setError(data.error || fallback)
        /* Turnstile tokens are single-use, so the one just spent is dead
           whether or not the request succeeded. Clearing it makes the widget's
           reset visible as "verify again" rather than letting a retry fail with
           a token the server has already seen. */
        setToken(null)
        window.turnstile?.reset()
        return
      }
      setSent(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setToken(null)
      window.turnstile?.reset()
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="contact-form__success">
        <span className="contact-form__success-icon">
          <Icon size={28} color="currentColor" strokeWidth={2}>
            <path d="m5 12 5 5L20 7" />
          </Icon>
        </span>
        <h3 className="contact-form__success-title">Message received!</h3>
        <p className="contact-form__success-desc">
          Thank you for reaching out. Our team will get back to you within one business day.
        </p>
        <button
          type="button"
          className="contact-form__success-reset"
          onClick={() => { setSent(false); setForm(f => ({ name: '', country: f.country, phone: '', email: '', message: '', company: '' })) }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <FormField label="Full name" name="name" type="text" value={form.name} onChange={handle} placeholder="Your full name" required />

      {/* State holds the ISO country code, not the dial code: +1 and +44 are
          each shared by several countries, so the code alone cannot say which
          flag to show. The dial code is derived from it, and the two halves
          combine (`selected.dial + form.phone`) when this form is wired to a
          real endpoint. */}
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-phone">
          Phone number<span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__phone">
          <CountryPicker
            id="contact-country"
            value={form.country}
            onChange={code => { setTouchedCountry(true); setForm(f => ({ ...f, country: code })) }}
          />
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder={selected.example}
            required
            className="contact-form__input"
          />
        </div>
      </div>

      <FormField label="Email address" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required />
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-message">
          Message<span className="contact-form__required">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handle}
          placeholder="Tell us how we can help you..."
          rows={5}
          required
          className="contact-form__textarea"
        />
      </div>
      {/* Honeypot. Hidden from people (and from screen readers via aria-hidden),
          so only a bot that fills every field it finds will populate it. Not
          `display:none` — some bots skip those; this is off-screen instead. */}
      <div className="contact-form__hp" aria-hidden>
        <label htmlFor="contact-company">Company (leave blank)</label>
        <input
          id="contact-company"
          type="text"
          name="company"
          value={form.company}
          onChange={handle}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {TURNSTILE_OFF ? (
        <p className="contact-form__error" role="alert">
          Verification is disabled for testing — this form is unprotected.
        </p>
      ) : SITE_KEY ? (
        <Turnstile
          siteKey={SITE_KEY}
          onVerify={setToken}
          onError={() => setError('Verification could not load. Please refresh and try again.')}
        />
      ) : (
        /* Without a site key the widget cannot render, and the server refuses
           every submission — so say so here rather than letting the form look
           usable and fail on submit. */
        <p className="contact-form__error" role="alert">
          The contact form isn't configured yet. Please call or email us in the meantime.
        </p>
      )}

      {error && (
        <p className="contact-form__error" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || (!TURNSTILE_OFF && !token)}
        className={`contact-form__submit${submitting ? ' contact-form__submit--loading' : ''}`}
      >
        {submitting ? 'Sending…' : <>Send Message <ArrowDiag size={15} /></>}
      </button>
    </form>
  )
}

function FormField({ label, name, type, value, onChange, placeholder, required }) {
  return (
    <div className="contact-form__field">
      <label className="contact-form__label">
        {label}
        {required && <span className="contact-form__required">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="contact-form__input"
      />
    </div>
  )
}
