import { useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import Eyebrow from '../components/Eyebrow'
import '../css/Contact.css'

function StarIcon({ size = 12, color = 'var(--aln-wine)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.6l2.55 6.18 6.67.49-5.1 4.32 1.58 6.5L12 17.1l-5.27 3.48 1.58-6.5-5.1-4.32 6.67-.49z" />
    </svg>
  )
}
function ArrowDiag({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

const INFO_CARDS = [
  {
    label: 'Address',
    value: '446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE',
    href: 'https://maps.app.goo.gl/WQSCYByNBC5QJRAH6',
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx={12} cy={10} r={3}/></svg>,
  },
  {
    label: 'Phone',
    value: '+971 600551615',
    href: 'tel:+971600551615',
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>,
  },
  {
    label: 'Email',
    value: 'customer.service@everlastwellness.com',
    href: 'mailto:customer.service@everlastwellness.com',
    icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect width={20} height={16} x={2} y={4} rx={2}/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
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
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="contact-form-card__title">Let's start a conversation.</h2>
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
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 2"/>
                  </svg>
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
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--aln-wine)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx={12} cy={10} r={3}/>
              </svg>
              <span>Al Bateen, Abu Dhabi</span>
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
          <a href="https://wa.me/971600551615" target="_blank" rel="noopener" className="contact-cta__whatsapp-btn">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.47 14.39c-.26-.13-1.55-.77-1.79-.85-.24-.09-.42-.13-.6.13-.18.26-.69.85-.84 1.02-.16.18-.31.2-.57.07-.26-.13-1.1-.41-2.1-1.29-.78-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.47.13-.16.17-.26.26-.44.09-.18.04-.33-.02-.47-.06-.13-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.33-.24.26-.93.91-.93 2.22 0 1.31.95 2.57 1.08 2.75.13.18 1.87 2.85 4.53 4 .63.27 1.12.43 1.51.55.63.2 1.21.17 1.66.1.51-.07 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.07-.11-.25-.17-.51-.3z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.08-1.34A9.945 9.945 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.67 0-3.23-.48-4.54-1.3l-.32-.19-3.02.8.81-2.95-.21-.34A7.944 7.944 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            WhatsApp us
          </a>
        </div>
      </div>

    </main>
  )
}

/* ─────────────────────────────────────
   Contact form
───────────────────────────────────── */
function ContactForm() {
  const [sent, setSent]           = useState(false)
  const [form, setForm]           = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="contact-form__success">
        <span className="contact-form__success-icon">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <h3 className="contact-form__success-title">Message received!</h3>
        <p className="contact-form__success-desc">
          Thank you for reaching out. Our team will get back to you within one business day.
        </p>
        <button
          type="button"
          className="contact-form__success-reset"
          onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }) }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <div className="contact-form__two-col">
        <FormField label="Full name"    name="name"  type="text" value={form.name}  onChange={handle} placeholder="Your name"          required />
        <FormField label="Phone number" name="phone" type="tel"  value={form.phone} onChange={handle} placeholder="+971 XX XXX XXXX" />
      </div>
      <FormField label="Email address" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
      <FormField label="Subject" name="subject" type="text" value={form.subject} onChange={handle} placeholder="How can we help?" required />
      <div className="contact-form__field">
        <label className="contact-form__label">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handle}
          placeholder="Tell us about your goals or questions…"
          rows={5}
          required
          className="contact-form__textarea"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`contact-form__submit${submitting ? ' contact-form__submit--loading' : ''}`}
      >
        {submitting ? 'Sending…' : <>Send message <ArrowDiag size={15} /></>}
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
