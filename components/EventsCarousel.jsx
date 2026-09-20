'use client'

import { Children, useCallback, useEffect, useRef, useState } from 'react'

// Native scroll-snap carousel. The cards are rendered on the server and passed in as children.
// (react-multi-carousel was evaluated and rejected: it picks breakpoints from screen.width
// rather than the viewport and leaves focusable links inside aria-hidden slides.)
export default function EventsCarousel({ children, label = 'Upcoming events' }) {
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setEdges({
      start: track.scrollLeft <= 1,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scrollPage = (direction) => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reduced ? 'auto' : 'smooth' })
  }

  const button =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-current transition-colors hover:bg-atmos-line disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={update}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="-mx-3 flex snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="flex w-[85%] shrink-0 snap-start px-3 sm:w-1/2 lg:w-1/3 [&>*]:w-full">{child}</div>
        ))}
      </div>

      {!(edges.start && edges.end) && (
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" aria-label="Previous events" disabled={edges.start} onClick={() => scrollPage(-1)} className={button}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <button type="button" aria-label="Next events" disabled={edges.end} onClick={() => scrollPage(1)} className={button}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
