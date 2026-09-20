import Link from 'next/link'
import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

// Also used for Classes data: Class and Program share the same shape, so pass `href` to
// point at /classes#<slug> instead of the default /programs#<slug>. `badge` is a string or a node
// (e.g. <CategoryTag />); `expanded` shows the whole description instead of three lines.
export default function ProgramCard({
  program,
  badge,
  href = `/programs#${program.slug}`,
  ctaLabel = 'Learn more',
  expanded = false,
}) {
  const hasImage = isImageUrl(program.image)

  return (
    <article
      id={program.slug}
      className="group relative flex scroll-mt-24 flex-col border border-brand-ivory/20 bg-brand-navy text-brand-ivory"
    >
      <div className="relative aspect-[4/3] bg-brand-navyDeep">
        {hasImage && (
          <ImageKitImage
            src={program.image}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {badge && (
          <div className="absolute left-0 top-0">
            {typeof badge === 'string' ? (
              <span className="block bg-brand-ivory px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-black">
                {badge}
              </span>
            ) : (
              badge
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-2xl leading-tight">
          <Link
            href={href}
            className="underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand-ivory"
          >
            {program.title}
          </Link>
        </h3>
        <p className={`${expanded ? '' : 'line-clamp-3 '}text-sm leading-relaxed text-brand-ivory/60`}>{program.description}</p>
        <p aria-hidden="true" className="mt-auto pt-2 text-xs font-bold uppercase tracking-[0.16em]">
          {ctaLabel} →
        </p>
      </div>
    </article>
  )
}
