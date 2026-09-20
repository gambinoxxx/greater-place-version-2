import Link from 'next/link'
import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import FaqAccordion from '@/components/FaqAccordion'
import CtaBand from '@/components/CtaBand'
import { PATHWAY } from '@/lib/pathway'
import { SOCIAL_LINKS } from '@/lib/site'

export const metadata = {
  title: 'Training — The Greater Place Pathway',
  description:
    "A structured, four-stage progression from a dancer's very first class to a leadership role in the company — every dancer moves through the same stages, at their own pace, building technique, character and confidence along the way.",
}

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-16 md:py-24'

// FAQ copy is verbatim from docs/design-references/training.html.
const FAQ = [
  {
    question: 'How long does it take to move between stages?',
    answer:
      'It depends on the dancer — most spend two to three terms in Discover and Develop before moving on, but progression is based on readiness, not a fixed calendar.',
  },
  {
    question: 'Can an older beginner start in Discover?',
    answer:
      'Yes. Placement is based on experience, not age — a 25-year-old brand new to dance starts in Discover alongside younger first-timers.',
  },
  {
    question: 'Is there an audition to join?',
    answer:
      'No audition is required to start at Discover. Placement above Stage One is assessed by our instructors during the first few classes.',
  },
]

export default function TrainingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="text-atmos">
        <PageHero
          eyebrow="Training"
          title="The Greater Place Pathway."
          breadcrumb={[{ label: 'Programs', href: '/programs' }, { label: 'Training' }]}
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
          media={<ImagePlaceholder label="Small ensemble, mid-rehearsal" className="aspect-[16/7]" />}
        >
          A structured, four-stage progression from a dancer&apos;s very first class to a leadership role in the
          company — every dancer moves through the same stages, at their own pace, building technique, character and
          confidence along the way.
        </PageHero>

        <section data-theme="dark" className="pb-8">
          <div className={CONTAINER}>
            <SectionHeader label="The Four Stages" accent="gold" />
            <ol className="mt-8 grid border-t border-atmos-line sm:grid-cols-2 lg:grid-cols-4">
              {PATHWAY.map((stage) => (
                <li key={stage.slug} className="border-b border-atmos-line px-5 py-6">
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">{stage.number}</span>
                  <span className="mt-4 block font-serif text-3xl">{stage.name}</span>
                  <span className="mt-2 block text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">{stage.track}</span>
                  <Link
                    href={`#${stage.slug}`}
                    className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.16em] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    View →
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {PATHWAY.map((stage, index) => (
          <section key={stage.slug} id={stage.slug} data-theme="dark" className={SECTION}>
            <div className={CONTAINER}>
              <RevealOnScroll className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <ImagePlaceholder label={stage.photo} className={`aspect-[4/3] ${index % 2 === 1 ? 'lg:order-2' : ''}`} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-atmos-muted">
                    {stage.number} · {stage.name}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">{stage.headline}</h2>
                  <p className="mt-6 leading-relaxed text-atmos-muted">{stage.description}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-atmos-line py-4">
                    {stage.meta.map((item) => (
                      <div key={item.label}>
                        <dt className="text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted">{item.label}</dt>
                        <dd className="mt-1 font-serif text-lg">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-6 list-disc space-y-2 pl-5 text-atmos-muted marker:text-atmos-muted">
                    {stage.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="outline" href={stage.cta.href}>
                      {stage.cta.label}
                    </Button>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>
        ))}

        <section data-theme="dark" className="scroll-mt-24 py-20 md:py-28">
          <div className={CONTAINER}>
            <SectionHeader label="Good to Know" />
            <RevealOnScroll className="mt-10">
              <FaqAccordion items={FAQ} />
            </RevealOnScroll>
          </div>
        </section>

        <CtaBand
          title="Start at Stage One."
          actions={
            <>
              <Button variant="solidRed" href="/contact">
                Enroll Now
              </Button>
              <Button variant="outline" href="/programs">
                Explore All Programs
              </Button>
            </>
          }
        >
          Enrollment for the 2027 season is open now — reach out and we&apos;ll help place you at the right stage.
        </CtaBand>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
