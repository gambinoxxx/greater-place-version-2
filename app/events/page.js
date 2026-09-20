import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import EventCard from '@/components/EventCard'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { getEvents } from '@/lib/events'
import { SOCIAL_LINKS } from '@/lib/site'
import { buildGeneralRsvpHref, buildGroupHref, buildRsvpHref } from '@/lib/whatsapp'

// Copy is from docs/design-references/events.html. Event data comes only from the database.
export const metadata = {
  title: 'Events — Greater Place',
  description:
    'From intimate community showcases to the Annual Gala — every performance is a chance to see what a season of training builds.',
}

// Content is Prisma-backed and must stay fresh; this also keeps `next build` independent of the database.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

const formatYear = new Intl.DateTimeFormat('en', { year: 'numeric' })

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()
  const rsvpHref = buildGeneralRsvpHref()
  const groupHref = buildGroupHref()

  return (
    <>
      <SiteHeader />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="Performances"
          title="See the work on stage."
          actions={
            <>
              {rsvpHref && (
                <Button variant="solidRed" href={rsvpHref} target="_blank" rel="noopener noreferrer">
                  RSVP via WhatsApp
                </Button>
              )}
              <Button variant="outline" href="#upcoming">
                See Upcoming Events
              </Button>
            </>
          }
        >
          From intimate community showcases to the Annual Gala — every performance is a chance to see what a season of
          training builds.
        </PageHero>

        <section id="upcoming" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Upcoming" accent="red" />
            <RevealOnScroll>
              {upcoming.length > 0 ? (
                <div className="mt-12 flex flex-col gap-6">
                  {upcoming.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      layout="row"
                      showDescription
                      rsvpHref={buildRsvpHref(event)}
                      secondaryAction={{ label: 'Ask a question', href: '/contact' }}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-12 border border-atmos-line p-8 text-atmos-muted">
                  No upcoming events are listed right now.
                </p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        {past.length > 0 && (
          <section id="past" data-theme="dark" className={SECTION}>
            <div className={CONTAINER}>
              <SectionHeader label="Past Highlights" accent="red" />
              <RevealOnScroll>
                {/* Each row carries id=<slug> so /events#<slug> links to past events resolve too. */}
                <ul className="mt-12 border-b border-atmos-line">
                  {past.map((event) => (
                    <li
                      key={event.id}
                      id={event.slug}
                      className="scroll-mt-32 border-t border-atmos-line py-6 font-serif text-2xl md:text-3xl"
                    >
                      {event.title} —{' '}
                      <time dateTime={new Date(event.startsAt).toISOString()}>{formatYear.format(new Date(event.startsAt))}</time>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            </div>
          </section>
        )}

        <CtaBand
          title="Want to bring a group?"
          actions={
            <>
              {groupHref && (
                <Button variant="solidRed" href={groupHref} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </Button>
              )}
              <Button variant="outline" href="/contact">
                Contact Us
              </Button>
            </>
          }
        >
          We can hold seats for churches, schools and community groups — just reach out ahead of the date.
        </CtaBand>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
