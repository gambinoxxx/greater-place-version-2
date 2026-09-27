'use client'

import { useEffect, useRef, useState } from 'react'

// Full-bleed, auto-advancing background for the homepage hero: cycles through photos and one video,
// in the exact order given. Decorative only (aria-hidden), so — like HeroVideo — it carries no meaning
// that needs an accessible name, and it never autoplays or advances for anyone who has asked for
// reduced motion; they see the first slide only, matching the rest of the site's hero treatment.
const PHOTO_DURATION_MS = 6000
const TRANSITION_MS = 1200

export default function HomeHeroMedia({ slides }) {
  const [active, setActive] = useState(0)
  const [motionOk, setMotionOk] = useState(false)
  const videoRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionOk(!reduced.matches)
    const onChange = () => setMotionOk(!reduced.matches)
    reduced.addEventListener('change', onChange)
    return () => reduced.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!motionOk) return undefined
    const slide = slides[active]

    if (slide.type === 'video') {
      const video = videoRefs.current[active]
      if (!video) return undefined
      video.currentTime = 0
      video.play().catch(() => {})
      const advance = () => setActive((current) => (current + 1) % slides.length)
      video.addEventListener('ended', advance)
      return () => video.removeEventListener('ended', advance)
    }

    timerRef.current = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length)
    }, PHOTO_DURATION_MS)
    return () => window.clearTimeout(timerRef.current)
  }, [active, motionOk, slides])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-brand-black">
      {slides.map((slide, index) => {
        const isActive = motionOk ? index === active : index === 0
        return (
          <div
            key={slide.src}
            data-hero-slide={index}
            data-hero-active={isActive}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{ transitionDuration: `${TRANSITION_MS}ms`, opacity: isActive ? 1 : 0 }}
          >
            {slide.type === 'video' ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="auto"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.src}
                alt=""
                className="h-full w-full object-cover transition-transform ease-out"
                style={{
                  transitionDuration: `${PHOTO_DURATION_MS + TRANSITION_MS}ms`,
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                }}
              />
            )}
          </div>
        )
      })}
      {/* Scrim: same dark gradient every other full-bleed hero photo on the site uses, keeps the heading
          and eyebrow readable over any of the four slides, and blends to solid black at the section's
          own bottom edge so it meets the next (also dark) section with no visible seam. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/60 to-brand-black" />
    </div>
  )
}
