import Button from '@mui/material/Button'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RevealOnScroll from '@/components/RevealOnScroll'
import SectionHeader from '@/components/SectionHeader'
import PageHero from '@/components/PageHero'
import FaqAccordion from '@/components/FaqAccordion'
import ContactForm from '@/components/ContactForm'
import { buildMailtoHref, getContactEmail } from '@/lib/contact'
import { SOCIAL_LINKS } from '@/lib/site'
import { buildLearnMoreHref, buildQuickChatHref, getWhatsAppDisplay } from '@/lib/whatsapp'

// Copy is from docs/design-references/contact.html. The WhatsApp number and the email address are
// never hardcoded: they come from WHATSAPP_NUMBER / CONTACT_EMAIL (see lib/whatsapp.js, lib/contact.js),
// and each channel is omitted while its variable is unset.
export const metadata = {
  title: 'Contact — Greater Place',
  description:
    "Whether you're enrolling a dancer, booking a performance, volunteering or exploring a partnership — we'd love to hear from you.",
}

// Reads env vars (WhatsApp number, contact email) per request, so a changed value never needs a rebuild.
export const dynamic = 'force-dynamic'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const SECTION = 'scroll-mt-24 py-20 md:py-28'

const FAQ = [
  {
    question: 'What ages can enroll?',
    answer:
      'Greater Place welcomes young people ages 8 to 33 across all four stages of the pathway — Discover, Develop, Perform and Lead.',
  },
  {
    question: 'How do I enroll my child?',
    answer:
      'Message us on WhatsApp or fill out the form above with "Enroll a Dancer" selected as the reason — we\'ll follow up with next steps and available class times.',
  },
  {
    question: 'Can I book Greater Place for an event?',
    answer:
      'Yes — select "Partnership" in the form, or email us directly with your event date and details, and our programme team will get back to you.',
  },
  {
    question: 'How can I volunteer or mentor?',
    answer:
      "We're always looking for mentors, instructors and event volunteers. Choose \"Volunteer\" in the form above and tell us a bit about your background.",
  },
]

export default function ContactPage() {
  const whatsappHref = buildLearnMoreHref()
  const quickChatHref = buildQuickChatHref()
  const whatsappNumber = getWhatsAppDisplay()
  const mailtoHref = buildMailtoHref()
  const email = getContactEmail()
  const hasChannels = Boolean(whatsappHref || mailtoHref)

  return (
    <>
      <SiteHeader />
      <main id="main" className="text-atmos">
        <PageHero eyebrow="Get In Touch" title="Let's start a conversation.">
          Whether you&apos;re enrolling a dancer, booking a performance, volunteering or exploring a partnership —
          we&apos;d love to hear from you.
        </PageHero>

        {hasChannels && (
          <section data-theme="dark" className="pb-8">
            <div className={CONTAINER}>
              <RevealOnScroll className="grid gap-6 md:grid-cols-2">
                {whatsappHref && (
                  <div className="flex flex-col items-start gap-4 border border-atmos-line p-8">
                    <h2 className="font-serif text-3xl">WhatsApp</h2>
                    <p className="leading-relaxed text-atmos-muted">
                      Message us directly for the fastest response — enrolment questions, event details or a quick chat.
                    </p>
                    <Button variant="solidRed" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </Button>
                    <p className="text-sm text-atmos-muted">{whatsappNumber} · Mon–Fri, 9am–5pm</p>
                  </div>
                )}
                {mailtoHref && (
                  <div className="flex flex-col items-start gap-4 border border-atmos-line p-8">
                    <h2 className="font-serif text-3xl">Email</h2>
                    <p className="leading-relaxed text-atmos-muted">
                      Prefer to write it out? Send us an email and we&apos;ll get back to you within a few business days.
                    </p>
                    <Button variant="outline" href={mailtoHref}>
                      Email Us
                    </Button>
                    <p className="text-sm text-atmos-muted">{email}</p>
                  </div>
                )}
              </RevealOnScroll>
            </div>
          </section>
        )}

        <section id="message" data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <div className="max-w-3xl">
              <SectionHeader label="Send A Message" />
              <RevealOnScroll>
                <h2 className="mt-8 font-serif text-4xl md:text-5xl">Or fill out the form below</h2>
                <p className="mb-10 mt-6 text-lg leading-relaxed text-atmos-muted">
                  Tell us a little about what you need — we&apos;ll route it to the right person on our team.
                </p>
                <ContactForm />
                {quickChatHref && (
                  <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-atmos-line pt-8">
                    <p className="text-atmos-muted">Prefer something faster?</p>
                    <Button variant="outline" href={quickChatHref} target="_blank" rel="noopener noreferrer">
                      Message Us on WhatsApp
                    </Button>
                  </div>
                )}
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section data-theme="dark" className={SECTION}>
          <div className={CONTAINER}>
            <SectionHeader label="Frequently Asked" />
            <RevealOnScroll>
              <h2 className="mt-8 font-serif text-4xl md:text-5xl">Common questions</h2>
              <div className="mt-10">
                <FaqAccordion items={FAQ} />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <SiteFooter socialLinks={SOCIAL_LINKS} />
    </>
  )
}
