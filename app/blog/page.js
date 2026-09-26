import Link from 'next/link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageAtmosphere from '@/components/PageAtmosphere'
import PageHero from '@/components/PageHero'
import PostCard from '@/components/PostCard'
import { CATEGORY_NAMES } from '@/components/CategoryTag'
import prisma from '@/lib/prisma'
import { blogHref, buildPostWhere, parseBlogParams } from '@/lib/blog'
import { SOCIAL_LINKS } from '@/lib/site'

// Copy is from docs/design-references/blog.html. Filtering is server-side: every request reads
// `q` and `category` from the URL and queries Prisma; nothing is filtered in the browser.
export const metadata = {
  title: 'The Journal - Greater Place',
  description: 'Notes from the studio, the stage and everywhere in between, written by the people building Greater Place.',
}

const MAX_POSTS = 48
const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'

export default async function BlogPage({ searchParams }) {
  const { q, category } = parseBlogParams(await searchParams, CATEGORY_NAMES)
  const filtered = Boolean(q || category)

  const posts = await prisma.post.findMany({
    where: buildPostWhere({ q, category }),
    orderBy: { publishedAt: 'desc' },
    take: MAX_POSTS,
  })
  // The newest post is featured when nothing is filtered; filtered results are a plain grid.
  const featured = filtered ? null : posts[0]
  const grid = featured ? posts.slice(1) : posts

  const pill = (active) =>
    `inline-flex items-center border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
      active ? 'border-atmos bg-atmos text-atmos-inverse' : 'border-atmos-line hover:bg-atmos-line'
    }`

  return (
    <>
      <SiteHeader />
      <PageAtmosphere hero />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="The Journal"
          title="Stories, culture & community."
          backgroundImage="/blog-hero.png"
          // A portrait shot: stretched across the full hero it is scaled up to a thin, heavily zoomed band.
          // From md up it sits in the right half instead (less zoom, and clear of the copy), with its left
          // edge fading into the dark hero. On phones there is no free side, so it stays full-bleed behind a
          // dark wash. Tailwind 3.3 has no /15, /35 or /85 opacity steps.
          backgroundImageClassName="absolute inset-y-0 right-0 md:w-1/2 object-[center_35%]"
          scrim={
            <>
              <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-r from-brand-black via-brand-black/40 via-30% to-transparent md:block" />
              <div className="absolute inset-0 bg-brand-black/70 md:hidden" />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-transparent via-30% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-brand-black" />
            </>
          }
          actions={
            <form method="get" action="/blog" role="search" className="flex w-full max-w-xl flex-wrap items-stretch gap-3">
              <TextField
                name="q"
                type="search"
                label="Search articles"
                defaultValue={q}
                size="small"
                className="min-w-0 flex-1"
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit" variant="solidWhite" size="small">
                Search
              </Button>
            </form>
          }
        >
          Notes from the studio, the stage and everywhere in between, written by the people building Greater Place.
        </PageHero>

        <section data-theme="light" className="pb-20 md:pb-28">
          <div className={CONTAINER}>
            <nav aria-label="Filter by category" className="flex flex-wrap gap-3">
              <Link href={blogHref({ q })} aria-current={category ? undefined : 'page'} className={pill(!category)}>
                All Posts
              </Link>
              {CATEGORY_NAMES.map((name) => (
                <Link key={name} href={blogHref({ q, category: name })} aria-current={category === name ? 'page' : undefined} className={pill(category === name)}>
                  {name}
                </Link>
              ))}
            </nav>

            {filtered && (
              <p role="status" className="mt-8 text-sm text-atmos-muted">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                {category && <> in {category}</>}
                {q && <> matching “{q}”</>} ·{' '}
                <Link href="/blog" className="underline underline-offset-4 hover:text-atmos">
                  Clear filters
                </Link>
              </p>
            )}

            {featured && (
              <div className="mt-12">
                <PostCard post={featured} featured />
              </div>
            )}

            {grid.length > 0 && (
              <div className={`${featured ? 'mt-6' : 'mt-12'} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
                {grid.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {posts.length === 0 && (
              <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">
                {filtered
                  ? 'No articles match your search. Try a different keyword or filter.'
                  : 'No articles are listed right now.'}
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
