import Link from 'next/link'
import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import ProgramCard from '@/components/ProgramCard'
import PageHero from '@/components/PageHero'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import BlogTeaser from '@/components/BlogTeaser'
import FaqAccordion from '@/components/FaqAccordion'
import CtaBand from '@/components/CtaBand'
import prisma from '@/lib/prisma'
import { PATHWAY } from '@/lib/pathway'
import { SOCIAL_LINKS } from '@/lib/site'
import { buildEnrollHref } from '@/lib/whatsapp'

export const metadata = {
  title: 'Programs — Greater Place',
  description:
    'Four pillars run through everything we teach: disciplined training, faith and character, leadership, and wellness — woven into movement rooted in African performing arts.',
}

// Content is Prisma-backed and must stay fresh; this also keeps `next build` independent of the database.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

export default async function ProgramsPage() {
  const [programs, classes, posts] = await Promise.all([
    prisma.program.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.class.findMany({ orderBy: { createdAt: 'asc' }, take: 4 }),
    prisma.post.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
  ])

  const enrollHref = buildEnrollHref()
  // FAQ copy is verbatim from docs/design-references/programs.html; the WhatsApp number is never hardcoded.
  const faq = [
    {
      question: 'What age groups do you accept?',
      answer:
        'Greater Place welcomes dancers ages 8 through 33, grouped by Pathway stage rather than strictly by age, so placement depends on experience as much as it does age.',
    },
    {
      question: 'Do dancers need prior experience?',
      answer:
        'No. Stage One — Discover — is built for first-time dancers. Everyone starts there regardless of background and moves through the Pathway at their own pace.',
    },
    {
      question: 'Is faith participation required to join?',
      answer:
        'Greater Place is a faith-rooted program and devotion is part of every rehearsal, but dancers of any background are welcome to train with us.',
    },
    {
      question: 'How do I enroll?',
      answer: (
        <>
          Reach out on{' '}
          {enrollHref ? (
            <a href={enrollHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              WhatsApp
            </a>
          ) : (
            'WhatsApp'
          )}{' '}
          or through our{' '}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>{' '}
          and we&apos;ll walk you through placement and the next intake date.
        </>
      ),
    },
  ]

  return (
    <>
      <SiteHeader />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="What We Develop"
          title="Every dancer builds more than technique."
          actions={
            <>
              <Button variant="solidRed" href="/contact">
                Enroll Now
              </Button>
              <Button variant="outline" href="#pathway">
                See the Pathway
              </Button>
            </>
          }
        >
          Four pillars run through everything we teach: disciplined training, faith and character, leadership, and
          wellness — woven into movement rooted in African performing arts.
        </PageHero>

        <section id="pathway" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Training" accent="gold" href="/training" linkLabel="Explore training" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">The Greater Place Pathway</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-atmos-muted">
                A structured progression from a first class to a leadership role — every dancer moves through the same
                four stages, at their own pace.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="outline" href="/contact">
                  Ask About Enrolling
                </Button>
                <Button variant="outline" href="/training">
                  Explore training
                </Button>
              </div>
              <ImagePlaceholder label="Small ensemble, mid-rehearsal" className="mt-12 aspect-[16/7]" />
              <ol className="mt-10 grid border-t border-atmos-line sm:grid-cols-2 lg:grid-cols-4">
                {PATHWAY.map((stage) => (
                  <li key={stage.slug} className="border-b border-atmos-line sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
                    <Link
                      href={`/training#${stage.slug}`}
                      className="group block px-5 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">{stage.number}</span>
                      <span className="mt-4 block font-serif text-3xl underline-offset-4 group-hover:underline">{stage.name}</span>
                      <span className="mt-2 block text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">{stage.track}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </RevealOnScroll>
          </div>
        </section>

        <section id="programs" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Programs" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Faith, leadership &amp; wellness</h2>
              {programs.length > 0 ? (
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      href="/contact"
                      ctaLabel="Ask about this program"
                      expanded
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">No programs are listed right now.</p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        <section id="culture" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Culture" accent="purple" href="/classes" linkLabel="View all classes" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Movement &amp; Culture</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-atmos-muted">
                Rooted in Igbo musical tradition and church worship alike — a reminder that this is African performing
                arts, not an imported form.
              </p>
              {classes.length > 0 ? (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {classes.map((item) => (
                    <ProgramCard key={item.id} program={item} href={`/classes#${item.slug}`} />
                  ))}
                </div>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">No classes are listed right now.</p>
              )}
              <div className="mt-12">
                <Button variant="outline" href="/classes">
                  View all classes
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <BlogTeaser posts={posts} />

        <section data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Good to Know" />
            <RevealOnScroll className="mt-10">
              <FaqAccordion items={faq} />
            </RevealOnScroll>
          </div>
        </section>

        <CtaBand
          title="Ready to start the Pathway?"
          actions={
            <>
              <Button variant="solidRed" href="/contact">
                Enroll Now
              </Button>
              <Button variant="outline" href="/events">
                See Upcoming Events
              </Button>
            </>
          }
        >
          Enrollment for the 2027 season is open now — reach out and we&apos;ll help you find the right stage to begin.
        </CtaBand>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
