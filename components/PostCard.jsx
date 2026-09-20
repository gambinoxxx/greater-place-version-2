import Link from 'next/link'
import CategoryTag from '@/components/CategoryTag'
import { formatPostDate, readingMinutes } from '@/lib/blog'
import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

// Blog post card for /blog and "More from the journal". `featured` gives the wide layout used for
// the newest post. The title link is stretched over the whole card (one click target, one tab stop).
export default function PostCard({ post, featured = false }) {
  const hasImage = isImageUrl(post.coverImage)

  return (
    <article className={`group relative flex flex-col border border-atmos-line ${featured ? 'md:flex-row' : ''}`}>
      <div className={`relative aspect-[4/3] bg-atmos-tint ${featured ? 'md:aspect-auto md:min-h-[340px] md:w-1/2 md:shrink-0' : ''}`}>
        {hasImage && (
          <ImageKitImage
            src={post.coverImage}
            sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute left-0 top-0">
          <CategoryTag category={post.category} />
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-3 p-6 ${featured ? 'md:justify-center md:p-10' : ''}`}>
        <h3 className={`font-serif leading-tight ${featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
          <Link
            href={`/blog/${post.slug}`}
            className="underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-current"
          >
            {post.title}
          </Link>
        </h3>
        <p className={`text-sm leading-relaxed text-atmos-muted ${featured ? '' : 'line-clamp-3'}`}>{post.excerpt}</p>
        <p className="mt-auto pt-2 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">
          {post.authorName} · <time dateTime={new Date(post.publishedAt).toISOString()}>{formatPostDate(post.publishedAt)}</time> ·{' '}
          {readingMinutes(post.body)} min read
        </p>
      </div>
    </article>
  )
}
