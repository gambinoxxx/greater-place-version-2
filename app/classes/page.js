import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import ProgramCard from '@/components/ProgramCard'
import PageHero from '@/components/PageHero'
import BlogTeaser from '@/components/BlogTeaser'
import prisma from '@/lib/prisma'
import { SOCIAL_LINKS } from '@/lib/site'

// No classes mockup exists: the hero copy is the Culture intro from docs/design-references/programs.html.
export const metadata = {
  title: 'Classes — Greater Place',
  description:
    'Rooted in Igbo musical tradition and church worship alike — a reminder that this is African performing arts, not an imported form.',
}

// Content is Prisma-backed and must stay fresh; this also keeps `next build` independent of the database.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

export default async function ClassesPage() {
  const [classes, posts] = await Promise.all([
    prisma.class.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.post.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
  ])

  return (
    <>
      <SiteHeader />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="Classes"
          title="Movement & Culture."
          breadcrumb={[{ label: 'Programs', href: '/programs' }, { label: 'Classes' }]}
          actions={
            <>
              <Button variant="solidRed" href="/contact">
                Enroll Now
              </Button>
              <Button variant="outline" href="/programs">
                Back to Programs
              </Button>
            </>
          }
        >
          Rooted in Igbo musical tradition and church worship alike — a reminder that this is African performing arts,
          not an imported form.
        </PageHero>

        <section id="classes" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Classes" accent="purple" />
            <RevealOnScroll>
              {classes.length > 0 ? (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {classes.map((item) => (
                    <ProgramCard key={item.id} program={item} href={`/classes#${item.slug}`} expanded />
                  ))}
                </div>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">No classes are listed right now.</p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        <BlogTeaser posts={posts} />
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
