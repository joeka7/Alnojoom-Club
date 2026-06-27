import { useEffect } from 'react'

export function useParallax(containerRef, speed = 0.3) {
  useEffect(() => {
    const root = containerRef?.current
    if (!root) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const els = root.querySelectorAll('[data-parallax]')
    if (!els.length) return

    const onScroll = () => {
      els.forEach(el => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const center = rect.top + rect.height / 2 - vh / 2
        el.style.transform = `translateY(${center * speed}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [containerRef, speed])
}
