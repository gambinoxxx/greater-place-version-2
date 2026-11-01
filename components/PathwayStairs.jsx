'use client'

import { useEffect, useRef, useState } from 'react'

// Homepage "Pathway & Training" composition: the four stages are ascending steps with a dancer on the
// top one. On scroll the steps rise one after another, then the sun and dancer arrive. It plays once.
// The copy (children) is never hidden, and nothing is hidden at all without JavaScript or when the
// visitor prefers reduced motion. Styles for the states live in app/globals.css (.gp-stairs).

// Fixed positions so server and client render the same markup.
const MOTES = [
  { left: 12, dur: 9.5, wait: 1, size: 4 },
  { left: 21, dur: 12, wait: 6, size: 3 },
  { left: 29, dur: 8.5, wait: 3, size: 5 },
  { left: 37, dur: 11, wait: 8, size: 3 },
  { left: 45, dur: 10, wait: 0, size: 4 },
  { left: 52, dur: 13, wait: 5, size: 3 },
  { left: 60, dur: 9, wait: 2, size: 5 },
  { left: 68, dur: 11.5, wait: 7, size: 4 },
  { left: 74, dur: 8, wait: 4, size: 3 },
  { left: 82, dur: 12.5, wait: 9, size: 4 },
  { left: 89, dur: 10.5, wait: 1.5, size: 3 },
  { left: 95, dur: 9.5, wait: 6.5, size: 5 },
]

const HEIGHTS = ['lg:h-[120px]', 'lg:h-[190px]', 'lg:h-[260px]', 'lg:h-[330px]']
const TINTS = [0.1, 0.16, 0.22, 0.3]

export default function PathwayStairs({ stages, children }) {
  const ref = useRef(null)
  const [armed, setArmed] = useState(false)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || typeof IntersectionObserver === 'undefined') return undefined
    setArmed(true)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlay(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-armed={armed}
      data-play={play}
      className="gp-stairs relative mt-2 lg:h-[640px]"
    >
      {MOTES.map((mote) => (
        <i
          key={mote.left}
          aria-hidden="true"
          className="gp-mote pointer-events-none absolute bottom-0 hidden rounded-full bg-[#C68E2B] lg:block"
          style={{ left: `${mote.left}%`, width: mote.size, height: mote.size, '--dur': `${mote.dur}s`, '--wait': `${mote.wait}s` }}
        />
      ))}

      <div className="relative z-40 pt-7 lg:absolute lg:left-0 lg:top-10 lg:max-w-[560px] lg:pt-0">{children}</div>

      <div
        aria-hidden="true"
        className="pointer-events-none relative z-20 mx-auto -mb-10 mt-3 h-[300px] w-fit lg:absolute lg:bottom-[318px] lg:right-3.5 lg:z-20 lg:m-0 lg:h-[318px]"
      >
        <div className="gp-sun absolute inset-0 m-auto h-[276px] w-[276px] rounded-full bg-[radial-gradient(circle_at_38%_32%,#F0C468,#D9A441_58%,#C68E2B)] lg:inset-auto lg:-bottom-[72px] lg:-right-2.5 lg:h-[380px] lg:w-[380px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/training-dancer.webp"
          alt=""
          width="673"
          height="712"
          loading="lazy"
          className="gp-dancer relative h-full w-auto max-lg:[mask-image:linear-gradient(to_top,transparent,black_22%)] lg:[filter:drop-shadow(0_12px_22px_rgba(10,13,18,0.28))]"
        />
      </div>

      <ol className="pointer-events-none relative z-30 lg:absolute lg:inset-0 lg:grid lg:grid-cols-4 lg:items-end">
        {stages.map((stage, i) => (
          <li
            key={stage.name}
            className={`gp-step pointer-events-auto border-t-[3px] border-brand-gold px-5 py-5 text-brand-ivory max-lg:ml-[calc(var(--i)*7%)] lg:px-6 lg:pb-0 lg:pt-[22px] ${HEIGHTS[i]} lg:shadow-[-1px_0_0_rgba(255,255,255,0.07)]`}
            style={{ '--i': i, '--a': TINTS[i] }}
          >
            <p className="text-[13px] font-semibold text-brand-gold">Stage {i + 1}</p>
            <p className="mb-2 mt-1.5 font-serif text-[28px] leading-[1.1]">{stage.name}</p>
            <p className="max-w-[220px] text-[15px] leading-6 text-brand-ivory/70 max-lg:max-w-none">{stage.headline}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
