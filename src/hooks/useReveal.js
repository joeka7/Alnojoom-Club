import { useEffect } from 'react'

export function useReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current || document
    const els = root.querySelectorAll('[data-reveal]:not([data-shown])')
    if (!els.length) return

    const show = (el) => {
      el.setAttribute('data-shown', '1')
      el.classList.add('visible')
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(show)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target
            const d = parseInt(el.getAttribute('data-delay') || '0', 10)
            setTimeout(() => show(el), d)
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )

    const vh = window.innerHeight || 800
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.92 && r.bottom > -40) show(el)
      else io.observe(el)
    })

    const t = setTimeout(() => {
      root.querySelectorAll('[data-reveal]:not([data-shown])').forEach(show)
    }, 2400)

    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  })
}
