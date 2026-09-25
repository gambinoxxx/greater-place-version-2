import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageAtmosphere from '@/components/PageAtmosphere'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import { SOCIAL_LINKS } from '@/lib/site'
import { buildVolunteerHref } from '@/lib/whatsapp'

// Copy is verbatim from docs/design-references/get-involved.html and is fixed prose, so it is hardcoded
// (like /contact and /our-story). The WhatsApp number is never hardcoded: the button is omitted while
// WHATSAPP_NUMBER is unset. The two "apply" CTAs preselect the contact form's reason via ?reason=.
export const metadata = {
  title: 'Get Involved — Greater Place',
  description:
    'Greater Place runs on people who show up — in the studio, backstage, and behind the scenes. Volunteer your time, or partner with us as an organization.',
}

// Reads WHATSAPP_NUMBER per request, so a changed value never needs a rebuild.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

// Commitment level -> tag colours from the mockup (low green, medium gold, high purple).
// Class names are written out in full so Tailwind's scanner can detect them.
const COMMITMENT = {
  low: 'bg-brand-green text-[#06210f]',
  medium: 'bg-brand-gold text-[#2a1c04]',
  high: 'bg-brand-purple text-[#20123f]',
}

const VOLUNTEER_ROLES = [
  {
    title: 'Event Day Crew',
    tag: 'One-Off',
    commitment: 'low',
    description:
      'Check-in, ushering, and setup/breakdown for performances and the Annual Gala. A few hours, a handful of times a year.',
  },
  {
    title: 'Rehearsal Support',
    tag: 'One-Off',
    commitment: 'low',
    description: 'Help supervise, run music, or manage props during weekday rehearsals — as your schedule allows.',
  },
  {
    title: 'Administrative Help',
    tag: 'Ongoing, Light',
    commitment: 'medium',
    description: 'Data entry, scheduling, or communications support a few hours a month — remote-friendly.',
  },
  {
    title: 'Mentorship',
    tag: 'Season-Long',
    commitment: 'high',
    description:
      'Pair with a young dancer for a season — a consistent, background-checked commitment with real relationship.',
  },
]

const PARTNERSHIP_TYPES = [
  {
    title: 'Corporate Sponsorship',
    description:
      'Fund a program, a performance, or a season, with your organization credited across the site and at events.',
  },
  {
    title: 'School Partnerships',
    description: 'Bring training, workshops, or a pipeline into enrollment directly to your students.',
  },
  {
    title: 'In-Kind Support',
    description: 'Studio space, costumes, equipment, printing, or professional services in place of a cash gift.',
  },
  {
    title: 'Community Organizations',
    description: 'Co-host events, cross-promote programs, or refer families into a shared pipeline of support.',
  },
]

function VolunteerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function PartnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V9.5" />
      <path d="M15 3h4a2 2 0 0 1 2 2v4.5" />
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

export default function GetInvolvedPage() {
  const volunteerChatHref = buildVolunteerHref()

  return (
    <>
      <SiteHeader />
      <PageAtmosphere hero />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="Get Involved"
          title="Bring your time, your network, or your platform."
          backgroundImage="/get-involved.PNG"
          // The volunteer sits right of center in the photo: keep them in frame on narrow screens, and fade the
          // scrim out toward them so the vest reads clearly while the bright sky behind the headline stays dark.
          backgroundImageClassName="object-[68%_center]"
          scrim={
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-black/70 via-brand-black/35 to-brand-black/5" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-brand-black" />
            </>
          }
        >
          Greater Place runs on people who show up — in the studio, backstage, and behind the scenes. Volunteer your
          time, or partner with us as an organization.
        </PageHero>

        <section data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Two Ways In" />
            <RevealOnScroll className="mt-10 grid gap-px border border-atmos-line bg-atmos-line md:grid-cols-2">
              <div id="volunteer" className="flex scroll-mt-24 flex-col items-start bg-atmos-card p-8 md:p-11">
                <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-green text-[#06210f]">
                  <VolunteerIcon />
                </div>
                <h2 className="font-serif text-3xl">Volunteer</h2>
                <p className="mb-6 mt-3 max-w-md leading-relaxed text-atmos-card-muted">
                  Give an afternoon, a performance night, or a season. No dance background required — just show up and
                  help.
                </p>
                <Button variant="solidRed" href="#volunteer-roles" className="mt-auto">
                  See Volunteer Roles →
                </Button>
              </div>
              <div id="partner" className="flex scroll-mt-24 flex-col items-start bg-atmos-card p-8 md:p-11">
                <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-purple text-[#20123f]">
                  <PartnerIcon />
                </div>
                <h2 className="font-serif text-3xl">Partner With Us</h2>
                <p className="mb-6 mt-3 max-w-md leading-relaxed text-atmos-card-muted">
                  Bring your company, school, or organization alongside ours — sponsorship, in-kind support, or a
                  standing partnership.
                </p>
                <Button variant="outline" href="#partner-types" className="mt-auto">
                  Explore Partnership Types →
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="volunteer-roles" data-theme="light" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Volunteer" />
            <RevealOnScroll>
              <h2 className="mt-8 max-w-2xl font-serif text-4xl md:text-5xl">Ways to help, by time commitment.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">
                Pick what fits your schedule — every role below directly supports a program or an event.
              </p>
              <ul className="mt-10 grid gap-6 md:grid-cols-2">
                {VOLUNTEER_ROLES.map((role) => (
                  <li key={role.title} className="border border-atmos-line bg-atmos-card p-8">
                    <span
                      className={`inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${COMMITMENT[role.commitment]}`}
                    >
                      {role.tag}
                    </span>
                    <h3 className="mt-4 font-serif text-2xl">{role.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-atmos-card-muted">{role.description}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="solidRed" href="/contact?reason=Volunteer">
                  Apply to Volunteer →
                </Button>
                {volunteerChatHref && (
                  <Button variant="outline" href={volunteerChatHref} target="_blank" rel="noopener noreferrer">
                    Ask on WhatsApp
                  </Button>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="partner-types" data-theme="light" className={`relative overflow-hidden ${SECTION}`}>
          {/* Full-bleed background photo behind the whole section, lightly blurred + washed with the page's
              own light background colour: enough to keep the dark-on-light text readable while the photo
              stays recognizable. It sits behind everything, never inside the card layout. */}
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/get-involved-partner-with-us.PNG"
              alt=""
              className="h-full w-full scale-110 object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-brand-ivory/65" />
          </div>
          <div className={CONTAINER}>
            <SectionHeader label="Partner With Us" />
            <RevealOnScroll>
              <h2 className="mt-8 max-w-2xl font-serif text-4xl md:text-5xl">Four ways organizations get involved.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">
                From a one-time gift-in-kind to a standing sponsorship, here&apos;s what partnership can look like.
              </p>
              <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {PARTNERSHIP_TYPES.map((type, index) => (
                  <li key={type.title} className="border border-atmos-line bg-atmos-card px-6 py-7 text-center">
                    <p aria-hidden="true" className="font-serif text-3xl">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 font-bold">{type.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-atmos-card-muted">{type.description}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <Button variant="solidRed" href="/contact?reason=Partnership">
                  Start a Conversation →
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* /donate is an approved destination that is not built yet; this link 404s until it ships. */}
        <CtaBand
          title="Tell us how you want to help."
          actions={
            <>
              <Button variant="solidRed" href="/contact">
                Get In Touch
              </Button>
              <Button variant="outline" href="/donate">
                Prefer To Give Instead? →
              </Button>
            </>
          }
        >
          One short form, routed to the right person on our team.
        </CtaBand>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
