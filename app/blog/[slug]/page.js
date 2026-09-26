import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageAtmosphere from '@/components/PageAtmosphere'
import SectionHeader from '@/components/SectionHeader'
import CategoryTag from '@/components/CategoryTag'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import ImageKitImage from '@/components/ImageKitImage'
import MarkdownBody from '@/components/MarkdownBody'
import PostCard from '@/components/PostCard'
import ShareRail from '@/components/ShareRail'
import prisma from '@/lib/prisma'
import { formatPostDate, getPostBySlug, readingMinutes } from '@/lib/blog'
import { isImageUrl } from '@/lib/image-url'
import { SOCIAL_LINKS } from '@/lib/site'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: `${post.title} - Greater Place`, description: post.excerpt }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // "More from the journal": other posts, same category first, then the newest.
  const others = await prisma.post.findMany({
    where: { slug: { not: post.slug }, isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  })
  const sameCategory = (other) => other.category.toLowerCase() === post.category.toLowerCase()
  const related = [...others.filter(sameCategory), ...others.filter((other) => !sameCategory(other))].slice(0, 3)

  return (
    <>
      <SiteHeader />
      <PageAtmosphere hero />
      <main id="main" className="text-atmos">
        <article>
          <header data-theme="dark" className="pb-12 pt-32 md:pb-16 md:pt-40">
            <div className={CONTAINER}>
              <nav aria-label="Breadcrumb" className="mb-8 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/blog" className="underline-offset-4 hover:text-atmos hover:underline">
                      The Journal
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-atmos">
                    {post.category}
                  </li>
                </ol>
              </nav>
              <CategoryTag category={post.category} />
              <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.08] md:text-6xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-atmos-muted md:text-xl">{post.excerpt}</p>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">
                {post.authorName} · <time dateTime={post.publishedAt.toISOString()}>{formatPostDate(post.publishedAt)}</time> ·{' '}
                {readingMinutes(post.body)} min read
              </p>
              <div className="relative mt-12 aspect-[16/8]">
                {isImageUrl(post.coverImage) ? (
                  <ImageKitImage
                    src={post.coverImage}
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="Cover image placeholder" className="absolute inset-0" />
                )}
              </div>
            </div>
          </header>

          <div data-theme="light" className="pb-20 md:pb-28">
            <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16`}>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <ShareRail path={`/blog/${post.slug}`} title={post.title} />
              </div>
              <div className="max-w-2xl pb-4">
                <MarkdownBody>{post.body}</MarkdownBody>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section data-theme="light" className="border-t border-atmos-line py-20 md:py-28">
            <div className={CONTAINER}>
              <SectionHeader label="More from the journal" href="/blog" linkLabel="View all" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((other) => (
                  <PostCard key={other.id} post={other} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
