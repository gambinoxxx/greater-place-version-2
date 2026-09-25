import Link from 'next/link'
import HeroVideo from '@/components/HeroVideo'

// Top-of-page hero for inner pages: optional breadcrumb, eyebrow, serif heading, supporting copy,
// an actions slot (buttons), an optional media slot below, and an optional full-bleed background
// video (backgroundVideo, backgroundVideoPoster) or background image (backgroundImage) behind
// everything else in the hero. If both are given, the video wins and backgroundImage is ignored.
export default function PageHero({
  eyebrow,
  title,
  children,
  breadcrumb,
  actions,
  media,
  backgroundVideo,
  backgroundVideoPoster,
  backgroundImage,
}) {
  const hasBackground = Boolean(backgroundVideo || backgroundImage)
  return (
    <section
      data-theme="dark"
      className={`pb-16 pt-32 md:pb-24 md:pt-40 ${hasBackground ? 'relative overflow-hidden' : ''}`}
    >
      {backgroundVideo && <HeroVideo src={backgroundVideo} poster={backgroundVideoPoster} />}
      {!backgroundVideo && backgroundImage && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={backgroundImage} alt="" className="h-full w-full object-cover" />
          {/* Scrim: dark gradient over the photo, keeps text readable regardless of the photo's own
              brightness. Stronger at the top (/75) than a first pass (/55) — the heading sits there,
              and get-involved.PNG's bright sky washed it out at /55. */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/75 via-brand-black/85 to-brand-black" />
        </div>
      )}
      <div className={`mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12 ${hasBackground ? 'relative' : ''}`}>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-8 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="underline-offset-4 hover:text-atmos hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-atmos">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl break-words font-serif text-4xl leading-[1.05] sm:text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-atmos-muted">{children}</p>
        {actions && <div className="mt-10 flex flex-wrap gap-4">{actions}</div>}
        {media && <div className="mt-14">{media}</div>}
      </div>
    </section>
  )
}
