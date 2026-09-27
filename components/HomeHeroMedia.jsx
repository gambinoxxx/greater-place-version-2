'use client'

import { useEffect, useRef, useState } from 'react'

// Full-bleed, auto-advancing background for the homepage hero: cycles through photos and one video,
// in the exact order given. Decorative only (aria-hidden), so — like HeroVideo — it carries no meaning
// that needs an accessible name, and it never autoplays or advances for anyone who has asked for
// reduced motion; they see the first slide only, matching the rest of the site's hero treatment.
const PHOTO_DURATION_MS = 6000
const TRANSITION_MS = 1200
// If the video hasn't actually started playing this long after its turn comes up (a slow mobile
// connection still buffering it), skip it rather than leave the slideshow stuck on a blank/frozen
// slide — nothing else would advance it, since the only other trigger is the video's own 'ended' event.
const VIDEO_STALL_TIMEOUT_MS = 5000

export default function HomeHeroMedia({ slides }) {
  const [active, setActive] = useState(0)
  const [motionOk, setMotionOk] = useState(false)
  const [videoAllowed, setVideoAllowed] = useState(true)
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
    // Network Information API: Chromium/Android only (no Safari/iOS support), so this is a bonus
    // check on top of the stall timeout below, not a replacement for it.
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType))) {
      setVideoAllowed(false)
    }
  }, [])

  const effectiveSlides = videoAllowed ? slides : slides.filter((slide) => slide.type !== 'video')

  useEffect(() => {
    if (!motionOk) return undefined
    const slide = effectiveSlides[active % effectiveSlides.length]

    if (slide.type === 'video') {
      const video = videoRefs.current[active]
      if (!video) return undefined
      const advance = () => setActive((current) => (current + 1) % effectiveSlides.length)

      video.currentTime = 0
      video.play().catch(advance)
      const stallTimer = window.setTimeout(() => {
        if (video.paused || video.readyState < video.HAVE_FUTURE_DATA) advance()
      }, VIDEO_STALL_TIMEOUT_MS)
      video.addEventListener('ended', advance)
      return () => {
        window.clearTimeout(stallTimer)
        video.removeEventListener('ended', advance)
      }
    }

    timerRef.current = window.setTimeout(() => {
      setActive((current) => (current + 1) % effectiveSlides.length)
    }, PHOTO_DURATION_MS)
    return () => window.clearTimeout(timerRef.current)
  }, [active, motionOk, effectiveSlides])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-brand-black">
      {effectiveSlides.map((slide, index) => {
        const isActive = motionOk ? index === active % effectiveSlides.length : index === 0
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
                poster={slide.poster}
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
