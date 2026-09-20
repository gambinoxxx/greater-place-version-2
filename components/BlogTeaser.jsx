import SectionHeader from '@/components/SectionHeader'
import RevealOnScroll from '@/components/RevealOnScroll'
import ProgramCard from '@/components/ProgramCard'
import CategoryTag from '@/components/CategoryTag'

// Teaser: `posts` are Prisma `Post` rows fetched by the page. Each card links to its post at
// /blog/<slug>; "View all" links to /blog.
export default function BlogTeaser({ posts }) {
  return (
    <section id="blog" data-theme="dark" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12">
        <SectionHeader label="From the blog" href="/blog" linkLabel="View all" />
        <RevealOnScroll>
          <h2 className="mt-8 font-serif text-4xl md:text-5xl">Stories, culture &amp; community.</h2>
          {posts.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ProgramCard
                  key={post.id}
                  program={{ title: post.title, slug: post.slug, description: post.excerpt, image: post.coverImage }}
                  badge={<CategoryTag category={post.category} />}
                  href={`/blog/${post.slug}`}
                  ctaLabel="Read more"
                />
              ))}
            </div>
          ) : (
            <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">No posts are listed right now.</p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
