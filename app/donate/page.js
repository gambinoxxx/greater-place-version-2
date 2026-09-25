import Link from 'next/link'
import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageAtmosphere from '@/components/PageAtmosphere'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import GiveButton from '@/components/GiveButton'
import { SOCIAL_LINKS } from '@/lib/site'

// Copy is from docs/design-references/donate.html and is fixed prose, so it is hardcoded (like
// /contact, /our-story and /get-involved). No payment processor is connected: the "give" buttons
// expand into an amount card that opens Cash App (components/GiveButton.jsx). The cashtag is a
// constant, so unlike /get-involved this page reads no env var and stays statically rendered.
export const metadata = {
  title: 'Donate — Greater Place',
  description:
    'Every gift covers something specific — a scholarship spot, a season of training, a stage a young person gets to stand on. Give once, or give monthly.',
}

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

// Illustrative figures from the mockup — replace with real numbers before launch.
const STATS = [
  { value: '100+', label: 'Young people trained each year' },
  { value: '38', label: 'Scholarship spots funded' },
  { value: '12', label: 'Public performances a season' },
  { value: '7 yrs+', label: 'Serving the community' },
]

// Illustrative breakdown from the mockup — replace with the real one before launch.
const ALLOCATION = [
  { label: 'Training & Instruction', note: 'Instructor pay, studio time, curriculum', percent: '58%' },
  { label: 'Scholarships', note: 'Tuition-free spots for families who need them', percent: '24%' },
  { label: 'Performances & Production', note: 'Venues, costumes, staging', percent: '13%' },
  { label: 'Operations', note: 'The essentials that keep the lights on', percent: '5%' },
]

const OTHER_WAYS = [
  {
    title: 'Partner With Us',
    description:
      'Corporate sponsorships, school partnerships, and in-kind support all move the work forward without a check.',
    href: '/get-involved#partner',
    cta: 'Explore Partnership →',
  },
  {
    title: 'Volunteer',
    description: 'Rehearsal support, event-day crew, mentorship — bring your time instead of, or alongside, a gift.',
    href: '/get-involved#volunteer',
    cta: 'See Volunteer Roles →',
  },
]

function GiveCard({ tag, title, description, amounts, children }) {
  return (
    <li className="flex flex-col items-start border border-atmos-line bg-atmos-card p-8">
      <span className="inline-block bg-atmos px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-atmos-inverse">
        {tag}
      </span>
      <h3 className="mt-5 font-serif text-2xl">{title}</h3>
      <p className="mb-6 mt-3 flex-1 text-sm leading-relaxed text-atmos-card-muted">{description}</p>
      <p className="mb-4 text-xs text-atmos-card-muted">{amounts}</p>
      {children}
    </li>
  )
}

export default function DonatePage() {
  return (
    <>
      <SiteHeader />
      <PageAtmosphere hero />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="Give"
          title="Fuel the next performance."
          backgroundImage="/donate.PNG"
          actions={
            <>
              <Button variant="solidRed" href="#give">
                Give Now
              </Button>
              <Button variant="outline" href="#where-it-goes">
                See Where It Goes
              </Button>
            </>
          }
        >
          Every gift covers something specific — a scholarship spot, a season of training, a stage a young person
          gets to stand on. Give once, or give monthly.
        </PageHero>

        <section data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="The Impact So Far" />
            <RevealOnScroll
              as="dl"
              className="mt-10 grid grid-cols-2 gap-px border border-atmos-line bg-atmos-line lg:grid-cols-4"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse bg-atmos-card px-6 py-8">
                  <dt className="mt-3 text-xs tracking-[0.06em] text-atmos-card-muted">{stat.label}</dt>
                  <dd className="font-serif text-4xl leading-none md:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        <section id="give" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Ways To Give" />
            <RevealOnScroll>
              <h2 className="mt-8 max-w-2xl font-serif text-4xl md:text-5xl">Choose the gift that fits.</h2>
              <ul className="mt-10 grid gap-6 lg:grid-cols-3">
                <GiveCard
                  tag="One-Time"
                  title="Make a Gift"
                  description="A single donation, any amount — put straight toward training, costumes, and performance costs for the current season."
                  amounts="Suggested: $25 · $75 · $150 · Other"
                >
                  <GiveButton ctaLabel="Give Once →" suggestedAmounts={[25, 75, 150]} />
                </GiveCard>
                <GiveCard
                  tag="Monthly"
                  title="Become a Sustainer"
                  description="Recurring gifts let us plan a full season in advance instead of season-to-season — the steadiest way to support the work."
                  amounts="Suggested: $10/mo · $25/mo · $50/mo"
                >
                  <GiveButton
                    ctaLabel="Give Monthly →"
                    buttonVariant="outline"
                    suggestedAmounts={[10, 25, 50]}
                    note="Cash App sends this as a single payment — give again each month, or contact us about setting up a recurring gift."
                  />
                </GiveCard>
                <GiveCard
                  tag="Sponsorship"
                  title="Sponsor a Dancer"
                  description="Cover one young person's tuition, shoes, and travel for a full season, and follow their progress across the year."
                  amounts="$600 covers one season"
                >
                  <Button variant="outline" href="/contact">
                    Ask About Sponsorship →
                  </Button>
                </GiveCard>
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-atmos-muted">
                Every &ldquo;Give&rdquo; button opens Cash App in a new tab with your amount pre-filled. Prefer to give
                another way?{' '}
                <Link href="/contact" className="underline underline-offset-4 hover:no-underline">
                  Contact us
                </Link>{' '}
                and we&apos;ll help you give directly.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section id="where-it-goes" data-theme="light" className={`relative overflow-hidden ${SECTION}`}>
          {/* Full-bleed background photo behind the whole section, blurred + washed with the page's own
              light background colour so the existing dark-on-light text and allocation list stay exactly
              as readable as before — same treatment as get-involved's #partner-types. */}
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/donate-where-It-goes.PNG"
              alt=""
              className="h-full w-full scale-110 object-cover blur-xl"
            />
            <div className="absolute inset-0 bg-brand-ivory/90" />
          </div>
          <div className={CONTAINER}>
            <RevealOnScroll className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeader label="Where It Goes" />
                <h2 className="mt-8 font-serif text-4xl md:text-5xl">Every dollar has a job.</h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-atmos-muted">
                  We keep overhead low so gifts reach the studio floor, not a back office. Figures below are
                  illustrative — replace with the real breakdown before this page ships.
                </p>
              </div>
              <ul>
                {ALLOCATION.map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between gap-4 border-t border-atmos-line py-5 last:border-b"
                  >
                    <span>
                      <span className="block">{item.label}</span>
                      <span className="mt-1 block text-sm text-atmos-muted">{item.note}</span>
                    </span>
                    <span className="font-serif text-2xl">{item.percent}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Not Ready To Give?" />
            <RevealOnScroll>
              <h2 className="mt-8 max-w-3xl font-serif text-3xl md:text-4xl">
                There&apos;s more than one way to support Greater Place.
              </h2>
              <ul className="mt-10 grid gap-6 md:grid-cols-2">
                {OTHER_WAYS.map((way) => (
                  <li
                    key={way.title}
                    className="flex flex-col items-start border border-atmos-line p-8 transition-colors hover:bg-atmos-tint"
                  >
                    <h3 className="font-serif text-2xl">{way.title}</h3>
                    <p className="mb-6 mt-2 text-sm leading-relaxed text-atmos-muted">{way.description}</p>
                    <Button variant="outline" href={way.href} className="mt-auto">
                      {way.cta}
                    </Button>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        {/* The mockup's own band rather than components/CtaBand.jsx: it is dark and needs a trust note below the buttons. */}
        <section
          data-theme="dark"
          className="bg-[radial-gradient(circle_at_30%_30%,rgba(217,164,65,0.16),transparent_65%)] py-20 text-center md:py-28"
        >
          <RevealOnScroll className={CONTAINER}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">Ready?</p>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl md:text-5xl">
              Your gift moves a young person forward.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-atmos-muted">
              However you give, it&apos;s felt in the studio.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button variant="solidRed" href="#give">
                Give Now
              </Button>
              <Button variant="outline" href="/contact">
                Talk to Someone First
              </Button>
            </div>
            <p className="mt-6 text-xs text-atmos-muted">
              Greater Place is a registered nonprofit. Gifts are tax-deductible where applicable — receipt details to
              be confirmed.
            </p>
          </RevealOnScroll>
        </section>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
