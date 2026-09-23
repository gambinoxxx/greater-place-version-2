'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const ROTATE_MS = 10000

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-full border border-atmos-line transition-colors hover:bg-atmos-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

// Auto-rotates a short, hand-picked quote per testimony every 10s; the full testimony only opens in
// a dialog on request, so a long story is never cut off mid-read by the next slide arriving. Pauses
// on hover/focus, on prefers-reduced-motion, and while the dialog is open, and always offers a
// manual play/pause + prev/next (WCAG 2.2.2 — auto-updating content over 5s must be pausable).
// Same spirit as EventsCarousel: native APIs, explicit aria-*, no carousel library.
export default function StoriesRotator({ stories }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(query.matches)
    const onChange = (event) => setReduceMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const goTo = useCallback((index) => setCurrent((index + stories.length) % stories.length), [stories.length])
  const next = useCallback(() => goTo(current + 1), [goTo, current])

  const rotating = !reduceMotion && playing && !paused && openIndex === null

  // Re-runs whenever `current` changes (via `next`), so any manual navigation restarts the full 10s.
  useEffect(() => {
    if (!rotating) return undefined
    const timer = window.setInterval(next, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [rotating, next])

  const story = stories[current]
  const openStory = openIndex !== null ? stories[openIndex] : null

  return (
    <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
      {/* One shared photo behind every rotating testimony (public/testimony.jpg) — not per-person,
          so it doesn't change as the quote rotates. Swap for real per-testimony photography later.
          next/image because the source is a ~10MB 7360px original; it is served resized and re-encoded. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-atmos-line">
        <Image src="/testimony.jpg" alt="Greater Place dancers" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>

      <div
        className="min-w-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
        }}
      >
        {/* Announce slide changes only when rotation is stopped, so auto-advance never interrupts a screen reader. */}
        <div aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">
            Story {current + 1} of {stories.length}
          </p>
          <blockquote className="mt-4 font-serif text-2xl italic leading-snug md:text-3xl">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-atmos-muted">
            <span className="font-semibold text-atmos">{story.name}</span> — {story.role}
          </p>
        </div>
        <div className="mt-6">
          <Button variant="outline" onClick={() => setOpenIndex(current)}>
            Read Their Story
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button type="button" aria-label="Previous story" onClick={() => goTo(current - 1)} className={iconButton}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" aria-label="Next story" onClick={next} className={iconButton}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Plain buttons with aria-current rather than role="tab": there are no tabpanels or arrow-key
              roving focus here, so the tab pattern would promise behaviour it doesn't have. */}
          <div role="group" aria-label="Choose a story" className="flex gap-1">
            {stories.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-current={index === current ? 'true' : undefined}
                aria-label={`Show story ${index + 1}: ${item.name}`}
                onClick={() => goTo(index)}
                className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full transition-colors ${index === current ? 'bg-atmos' : 'bg-atmos-line'}`}
                />
              </button>
            ))}
          </div>

          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-pressed={!playing}
              aria-label={playing ? 'Pause automatic rotation' : 'Resume automatic rotation'}
              className={iconButton}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="5" y="4" width="5" height="16" />
                  <rect x="14" y="4" width="5" height="16" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4l14 8-14 8V4z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* A fixed dark surface (MUI dark palette, lib/theme.js) wherever the trigger sits, like every other
          MUI overlay here, so no atmosphere overrides. Paper is position:relative to anchor the close button. */}
      <Dialog
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        slotProps={{ paper: { sx: { position: 'relative' } } }}
      >
        {openStory && (
          <>
            <DialogTitle sx={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '1.75rem', pr: 8 }}>
              {openStory.name}
              <span className="mt-1 block font-sans text-xs font-normal uppercase tracking-[0.16em] text-brand-ivory/50">
                {openStory.role}
              </span>
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {openStory.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-brand-ivory/80">
                  {paragraph}
                </p>
              ))}
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  )
}
