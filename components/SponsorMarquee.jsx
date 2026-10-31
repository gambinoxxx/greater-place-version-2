import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

// "Supported by" logo strip. Server Component: the logos are ImageKit URLs (ImageKitImage reads a
// server-side env var), and the scrolling is pure CSS (.gp-marquee in app/globals.css), so no client JS.
//
//   fewer than MIN_FOR_MARQUEE sponsors -> a still, centred row (a "marquee" of 1-3 logos looks broken)
//   otherwise                           -> a seamless loop: the list is repeated to at least MIN_PER_LOOP
//                                          items, rendered twice, and translated by exactly -50%
//   prefers-reduced-motion              -> the CSS stops the animation, hides the second copy and wraps
//
// The second copy is aria-hidden and its links are removed from the tab order, so assistive tech and
// keyboard users meet each sponsor once.
const MIN_FOR_MARQUEE = 4
const MIN_PER_LOOP = 8
const SECONDS_PER_LOGO = 4

function Logo({ sponsor, hidden = false }) {
  const image = (
    <ImageKitImage
      src={sponsor.logo}
      alt={hidden ? '' : sponsor.name}
      sizes="180px"
      className="h-10 w-auto max-w-[170px] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-12"
    />
  )
  if (!sponsor.website) return <span className="group block">{image}</span>
  return (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={hidden ? -1 : undefined}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      {image}
      {!hidden && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}

export default function SponsorMarquee({ sponsors }) {
  const logos = sponsors.filter((sponsor) => isImageUrl(sponsor.logo))
  if (logos.length === 0) return null

  if (logos.length < MIN_FOR_MARQUEE) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {logos.map((sponsor) => (
          <li key={sponsor.id}>
            <Logo sponsor={sponsor} />
          </li>
        ))}
      </ul>
    )
  }

  const loop = Array.from({ length: Math.ceil(MIN_PER_LOOP / logos.length) }).flatMap(() => logos)

  return (
    <div className="gp-marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul className="gp-marquee-track" style={{ animationDuration: `${loop.length * SECONDS_PER_LOGO}s` }}>
        {loop.map((sponsor, index) => (
          <li key={`a-${sponsor.id}-${index}`} className="px-8 md:px-12">
            <Logo sponsor={sponsor} />
          </li>
        ))}
        {loop.map((sponsor, index) => (
          <li key={`b-${sponsor.id}-${index}`} aria-hidden="true" className="gp-marquee-dup px-8 md:px-12">
            <Logo sponsor={sponsor} hidden />
          </li>
        ))}
      </ul>
    </div>
  )
}
