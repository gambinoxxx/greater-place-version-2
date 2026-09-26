import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageAtmosphere from '@/components/PageAtmosphere'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import TeamMemberCard from '@/components/TeamMemberCard'
import CtaBand from '@/components/CtaBand'
import prisma from '@/lib/prisma'
import { SOCIAL_LINKS } from '@/lib/site'

// Narrative copy is verbatim from docs/design-references/our-story.html and is fixed prose, so it is
// hardcoded. The only database-backed part is the team (TeamMember): the founder strip and the
// leadership list are both rendered from one query.
export const metadata = {
  title: 'Our Story - Greater Place',
  description:
    'Greater Place began with a simple conviction: that dance could do more than entertain; it could help a young person discover confidence, character and purpose.',
}

// Team content is Prisma-backed and must stay fresh; this also keeps `next build` independent of the database.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

// TeamMember has no display-order or featured field, so the first four members (createdAt order)
// fill the four-up founder strip; the leadership list shows everyone.
const STRIP_SIZE = 4

// The four focus areas from the mockup's mission bands. Rendered neutral: the mockup colours them,
// but these names do not map to a category accent (docs/ui-context.md §4).
const FOCUS_AREAS = ['Performing Arts', 'Faith & Character', 'Leadership', 'Wellness']

function EmptyTeamNote() {
  return <p className="mt-10 border border-atmos-line p-8 text-atmos-muted">Team profiles are not listed yet.</p>
}

export default async function OurStoryPage() {
  // createdAt is the only ordering the schema supports; id breaks ties between rows created together.
  const team = await prisma.teamMember.findMany({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] })
  const strip = team.slice(0, STRIP_SIZE)

  return (
    <>
      <SiteHeader />
      <PageAtmosphere hero />
      <main id="main" className="text-atmos">
        <section data-theme="dark" className="relative flex h-[82vh] min-h-[520px] items-end overflow-hidden">
          <ImagePlaceholder label="Photography placeholder" className="absolute inset-0 border-0" />
          <div className={`${CONTAINER} relative flex items-end justify-between gap-6 pb-16`}>
            <h1 className="break-words font-serif text-3xl tracking-[0.04em] sm:text-4xl md:text-5xl">Our Story</h1>
            <span aria-hidden="true" className="mb-2 h-2 w-2 shrink-0 rounded-full bg-current" />
          </div>
        </section>

        <section data-theme="light" className="pb-10 pt-20 md:pt-24">
          <div className={CONTAINER}>
            <RevealOnScroll>
              <div aria-hidden="true" className="mb-6 h-[3px] w-[22px] bg-brand-red" />
              <p className="max-w-3xl text-lg leading-relaxed text-atmos-muted">
                Greater Place began with a simple conviction: that dance could do more than entertain; it could help a
                young person discover confidence, character and purpose. From a handful of dancers meeting after
                school, Greater Place has grown into a programme that shares performing arts, mentorship and faith
                back to the community that shaped it, reaching young people ages 8 to 33 across training, performance
                and leadership.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* The mockup's founder quote is unconfirmed placeholder copy attributed to a placeholder name, so
            no quote text or attribution is shown until a real one is supplied. */}
        <section data-theme="light" className="relative flex min-h-[520px] items-end overflow-hidden md:min-h-[70vh]">
          <ImagePlaceholder label="Photography placeholder" className="absolute inset-0 border-0" />
          <div className={`${CONTAINER} relative pb-16 pt-32`}>
            <RevealOnScroll>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">Founder quote placeholder</p>
              <p className="mt-4 max-w-2xl font-serif text-3xl italic leading-snug md:text-4xl">
                Founder quote to be supplied.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Our Founder" />
            <RevealOnScroll>
              <p className="mt-8 max-w-2xl leading-relaxed text-atmos-muted">
                Greater Place was founded on the belief that every young person deserves a place to grow: in skill, in
                character and in faith. That vision now runs through every instructor, mentor and volunteer who leads a
                class.
              </p>
              {strip.length > 0 ? (
                <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                  {strip.map((member) => (
                    <li key={member.id}>
                      <TeamMemberCard member={member} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyTeamNote />
              )}
            </RevealOnScroll>
          </div>
        </section>

        <section data-theme="light" className="pb-20 md:pb-28">
          <div className={CONTAINER}>
            <RevealOnScroll>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {FOCUS_AREAS.map((area) => (
                  <li
                    key={area}
                    className="flex min-h-[160px] items-end border border-atmos-line bg-atmos-tint p-6 md:min-h-[220px]"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.1em]">{area}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section id="leadership" data-theme="light" className={SECTION}>
          <div className={`${CONTAINER} grid gap-12 lg:grid-cols-2 lg:gap-[70px]`}>
            <div>
              <SectionHeader label="Our Leadership" />
              <RevealOnScroll>
                <h2 className="mt-8 font-serif text-3xl md:text-4xl">
                  Guided by people who show up for young people, week after week.
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-atmos-muted">
                  Greater Place is led by a small team of instructors, mentors and board members who each bring years
                  of experience in dance, ministry and youth development.
                </p>
              </RevealOnScroll>
            </div>
            <RevealOnScroll>
              {team.length > 0 ? (
                <ul className="border-b border-atmos-line">
                  {team.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-baseline justify-between gap-5 border-t border-atmos-line py-[18px]"
                    >
                      <span className="[overflow-wrap:anywhere] font-serif text-lg">{member.name}</span>
                      <span className="text-right text-sm text-atmos-muted [overflow-wrap:anywhere]">{member.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border border-atmos-line p-8 text-atmos-muted">Team profiles are not listed yet.</p>
              )}
            </RevealOnScroll>
          </div>
        </section>

        <section data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <RevealOnScroll>
              <ImagePlaceholder label="Team group photo placeholder" className="aspect-[2/1] min-h-[220px] w-full" />
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-atmos-muted">
                Meet the people of Greater Place, from instructors and mentors to volunteers and board members, all
                working toward the same goal.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* The mockup's "Read Our Full History" button pointed at href="#": there is no destination, so it is omitted. */}
        <section data-theme="light" className={SECTION}>
          <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-2 lg:gap-[60px]`}>
            <div>
              <SectionHeader label="Our History" />
              <RevealOnScroll>
                <h2 className="mt-8 font-serif text-3xl md:text-4xl">
                  A programme that grew from a single after-school class.
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-atmos-muted">
                  What started as informal rehearsals in a church hall has grown into a structured pathway serving young
                  people across the community, still rooted in the same values it started with.
                </p>
              </RevealOnScroll>
            </div>
            <RevealOnScroll>
              <ImagePlaceholder label="Archival photo placeholder" className="aspect-[5/4] w-full" />
            </RevealOnScroll>
          </div>
        </section>

        <CtaBand
          title="Every gift to Greater Place helps a young person discover their greater place."
          actions={
            <Button variant="solidRed" href="/#support">
              Donate
            </Button>
          }
        />
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
