// A full-bleed, looping background video for a hero section. Decorative only (aria-hidden), so it
// carries no meaning that needs an accessible name. Renders only for people who haven't asked for
// reduced motion (motion-safe:block on a hidden-by-default element) — display:none videos don't
// autoplay in any current browser, so this alone is enough to keep the video from playing (and, with
// preload="none", from fetching) for anyone with prefers-reduced-motion: reduce; they see the
// poster-derived dark background and scrim instead, which matches the rest of the site's hero look.
export default function HeroVideo({ src, poster }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <video
        className="hidden h-full w-full object-cover motion-safe:block"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Scrim: keeps hero text readable regardless of the video's own brightness/content. */}
      <div className="absolute inset-0 bg-brand-black/50" />
    </div>
  )
}
