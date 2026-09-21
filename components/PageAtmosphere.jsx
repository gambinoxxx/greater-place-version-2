'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const lerp = (a, b, u) => a + (b - a) * u
const clamp01 = (n) => Math.min(1, Math.max(0, n))
// smootherstep: eases in and out, and crosses the muddy mid-tones quickly.
const smooth = (u) => u * u * u * (u * (u * 6 - 15) + 10)
const target = (section) => (section.dataset.theme === 'light' ? 1 : 0)

// One page-wide background "atmosphere" driven by scroll position. Sections only declare where
// the page should be dark or light via data-theme; this component turns the viewport's centre
// line into a value t (0 = dark, 1 = light) that eases across roughly 70% of a viewport of
// scrolling around each dark/light boundary. It only writes --atmos-t and html[data-atmosphere];
// globals.css turns those into the background and text colours, so text always contrasts with the
// current background. The flip of the text colour happens at t = 0.5.
//
// The footer is left out on purpose: it is a fixed dark surface with its own background, so it must
// not pull the page dark just above it (an inner page that ends on a light section stays light down
// to the footer). While the centre line is over the footer the last themed section wins.
//
// `hero` is for inner pages that open with one dark hero band and stay light below it. The homepage
// samples the viewport centre (0.5), which only reads as "dark at the top" when the first section is
// taller than about 85% of the viewport. A hero band is shorter than that, so with `hero` the line
// sits near the top (0.2) and the page opens fully dark, then eases to light as the hero scrolls away.
const CENTRE_LINE = 0.5
const HERO_LINE = 0.2

export default function PageAtmosphere({ hero = false }) {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const sections = [...document.querySelectorAll('[data-theme]:not(footer)')]
    if (!sections.length) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const compute = () => {
      frame = 0
      const vh = window.innerHeight
      const line = vh * (hero ? HERO_LINE : CENTRE_LINE)
      const span = Math.max(vh * 0.7, 320)
      const rects = sections.map((section) => section.getBoundingClientRect())

      let i = rects.findIndex((rect) => line >= rect.top && line < rect.bottom)
      if (i === -1) i = line < rects[0].top ? 0 : sections.length - 1

      const own = target(sections[i])
      let t = own
      const previous = sections[i - 1]
      const next = sections[i + 1]
      if (previous && target(previous) !== own) {
        const u = 0.5 + (line - rects[i].top) / span
        if (u < 1) t = lerp(target(previous), own, smooth(clamp01(u)))
      }
      if (next && target(next) !== own) {
        const w = 0.5 - (rects[i].bottom - line) / span
        if (w > 0) {
          const candidate = lerp(own, target(next), smooth(clamp01(w)))
          if (Math.abs(candidate - own) > Math.abs(t - own)) t = candidate
        }
      }

      if (reduced.matches) t = t >= 0.5 ? 1 : 0
      root.style.setProperty('--atmos-t', t.toFixed(4))
      const atmosphere = t >= 0.5 ? 'light' : 'dark'
      if (root.getAttribute('data-atmosphere') !== atmosphere) root.setAttribute('data-atmosphere', atmosphere)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(document.body)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
      resizeObserver.disconnect()
      root.removeAttribute('data-atmosphere')
      root.style.removeProperty('--atmos-t')
    }
  }, [pathname, hero])

  return null
}
