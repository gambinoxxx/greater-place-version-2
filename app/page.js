import Link from 'next/link'
import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import PageAtmosphere from '@/components/PageAtmosphere'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import ImageKitImage from '@/components/ImageKitImage'
import EventCard from '@/components/EventCard'
import ProgramCard from '@/components/ProgramCard'
import EventsCarousel from '@/components/EventsCarousel'
import prisma from '@/lib/prisma'
import { getEvents } from '@/lib/events'
import { isImageUrl } from '@/lib/image-url'
import { PATHWAY } from '@/lib/pathway'
import { SOCIAL_LINKS } from '@/lib/site'
import { buildChatHref, buildRsvpHref } from '@/lib/whatsapp'

// Content is Prisma-backed and must stay fresh; this also keeps `next build` independent of the database.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

// Working positioning from docs/project-overview.md.
const POSITIONING = [
  'Dance is the vehicle.',
  'Empowerment is the purpose.',
  'Culture is part of the identity.',
  'Opportunity is the outcome.',
]

// Pathway stage names come from lib/pathway.js (local constant; no Prisma model).
const PATHWAY_STAGES = PATHWAY.map((stage) => stage.name)

// Local constant: Culture has no Prisma model (open decision). The only culture-related content
// in the docs is the class list in docs/implementation-roadmap.md (Phase 4), so those names are
// used as captions; no descriptions until real copy or a data model exists.
const CULTURE_ITEMS = ['Ogene', 'Liturgical Dance', 'Praise & Worship', 'Drama & Skits']

const formatDate = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' })

export default async function Home() {
  const [{ upcoming, past }, programs, team] = await Promise.all([
    getEvents(),
    prisma.program.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' } }),
  ])

  const chatHref = buildChatHref()
  // On Stage: upcoming events first, then the most recent past ones. Every one links to /events#<slug>.
  const repertory = [...upcoming, ...past].slice(0, 6)

  return (
    <>
      <SiteHeader />
      <PageAtmosphere />
      <main id="main" className="text-atmos">
        <section data-theme="dark">
          <div className={`${CONTAINER} grid items-center gap-12 pb-20 pt-32 md:pb-28 md:pt-40 lg:grid-cols-12`}>
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">
                Performing arts · Ministry · Youth development
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">
                A greater place to move, grow &amp; lead.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">
                Where movement becomes opportunity.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="solidRed" href="/#support">
                  Get Involved
                </Button>
                <Button variant="outline" href="/programs">
                  Explore programs
                </Button>
              </div>
            </div>
            <ImagePlaceholder className="aspect-[4/5] lg:col-span-5" />
          </div>
        </section>

        <section id="our-story" data-theme="dark" className="scroll-mt-24">
          <div className="grid lg:grid-cols-2">
            <ImagePlaceholder label="Our Story photography placeholder" className="min-h-[360px] border-0 lg:min-h-[640px]" />
            <RevealOnScroll className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
              <div className="lg:max-w-xl">
                <SectionHeader label="Our Story" href="/our-story" linkLabel="Read our story" />
                <ul className="mt-10 space-y-2 font-serif text-3xl leading-tight md:text-4xl">
                  {POSITIONING.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-8 leading-relaxed text-atmos-muted">
                  Greater Place is a performing arts, ministry, and youth-development nonprofit serving young people
                  approximately ages 8–33.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="performances" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Performances" accent="red" href="/events" linkLabel="All events" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Upcoming performances</h2>
              <div className="mt-12">
                {upcoming.length > 0 ? (
                  <EventsCarousel>
                    {upcoming.map((event) => (
                      <EventCard key={event.id} event={event} rsvpHref={buildRsvpHref(event)} />
                    ))}
                  </EventsCarousel>
                ) : (
                  <p className="border border-atmos-line p-8 text-atmos-muted">
                    No upcoming events are listed right now.
                  </p>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="training" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Pathway & Training" accent="gold" href="/training" linkLabel="Explore training" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Discover, develop, perform, lead.</h2>
              <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {PATHWAY_STAGES.map((stage, index) => (
                  <li key={stage} className="border-t-2 border-brand-gold pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-6 font-serif text-3xl md:text-4xl">{stage}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-12">
                <Button variant="solidRed" href="/training">
                  Explore training
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="programs" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Programs" href="/programs" linkLabel="All programs" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Our programs</h2>
              {programs.length > 0 ? (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">
                  No programs are listed right now.
                </p>
              )}
              <div className="mt-12 flex flex-wrap gap-4">
                <Button variant="solidRed" href="/programs">
                  Explore programs
                </Button>
                <Button variant="outline" href="/classes">
                  Browse classes
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="culture" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Movement & Culture" accent="purple" href="/classes" linkLabel="Explore classes" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Movement &amp; culture</h2>
              <ul className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {CULTURE_ITEMS.map((item) => (
                  <li key={item}>
                    <figure>
                      <ImagePlaceholder label="Photo placeholder" className="aspect-[3/4]" />
                      <figcaption className="mt-4 font-serif text-2xl">{item}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section id="team" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Team" href="/our-story#leadership" linkLabel="Full Team" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">The team</h2>
              {team.length > 0 ? (
                <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                  {team.map((member) => (
                    <li key={member.id}>
                      <div className="relative aspect-square">
                        {isImageUrl(member.image) ? (
                          <ImageKitImage
                            src={member.image}
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <ImagePlaceholder label="Portrait placeholder" className="absolute inset-0" />
                        )}
                      </div>
                      <h3 className="mt-4 font-serif text-2xl leading-tight">{member.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">{member.role}</p>
                      {member.bio && (
                        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-atmos-muted">{member.bio}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">
                  Team profiles are not listed yet.
                </p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        <section id="on-stage" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="On Stage" accent="red" href="/events" linkLabel="All events" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">On stage</h2>
              {repertory.length > 0 ? (
                <ul className="mt-12 border-b border-atmos-line">
                  {repertory.map((event) => (
                    <li key={event.id} className="border-t border-atmos-line">
                      <Link
                        href={`/events#${event.slug}`}
                        className="group grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
                      >
                        <time
                          dateTime={new Date(event.startsAt).toISOString()}
                          className="text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted md:col-span-3"
                        >
                          {formatDate.format(new Date(event.startsAt))}
                        </time>
                        <span className="font-serif text-2xl underline-offset-4 group-hover:underline md:col-span-6 md:text-3xl">
                          {event.title}
                        </span>
                        <span className="text-sm text-atmos-muted md:col-span-3 md:text-right">{event.location}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">
                  No events are listed right now.
                </p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        <section id="stories" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Stories of Change" accent="blue" href="/blog" linkLabel="More stories" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Stories of change</h2>
              <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
                <ImagePlaceholder label="Story photo placeholder" className="aspect-[4/3]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">Story placeholder</p>
                  <p className="mt-4 font-serif text-3xl md:text-4xl">A story of change</p>
                  <p className="mt-4 leading-relaxed text-atmos-muted">
                    Real stories from the young people and families of Greater Place will be shared here. Story content
                    to be supplied.
                  </p>
                  <div className="mt-8">
                    {/* Approved placeholder destination. */}
                    <Button variant="outline" href="#">
                      Read Their Story
                    </Button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="support" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Support Greater Place" />
            <RevealOnScroll>
              <h2 className="mt-8 max-w-3xl font-serif text-4xl md:text-5xl">Support Greater Place</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">
                Give, partner, or volunteer to help young people move, grow &amp; lead.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="solidRed" href="/donate">
                  Donate
                </Button>
                <Button variant="solidWhite" href="/get-involved#partner">
                  Partner With Us
                </Button>
                <Button variant="outline" href="/get-involved#volunteer">
                  Volunteer
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Contact" href="/contact" linkLabel="Contact page" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Get in touch</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">
                Questions about programs, classes, or events? Reach out to the Greater Place team.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="solidRed" href="/contact">
                  Contact us
                </Button>
                {chatHref && (
                  <Button variant="outline" href={chatHref} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp
                  </Button>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
