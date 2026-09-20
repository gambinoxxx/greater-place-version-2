import Link from 'next/link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const PROGRAM_LINKS = [
  { label: 'Programs', href: '/programs' },
  { label: 'Classes', href: '/classes' },
  { label: 'Training', href: '/training' },
]

const ORGANISATION_LINKS = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'
const HEADING = 'text-xs font-bold uppercase tracking-[0.2em] text-brand-ivory/60'
const LINK =
  'text-sm text-brand-ivory/60 underline-offset-4 hover:text-brand-ivory hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ivory'

// socialLinks: [{ label, href }]. No real accounts are hardcoded; the block is hidden until supplied.
export default function SiteFooter({ socialLinks = [] }) {
  return (
    <footer data-theme="dark" className="bg-brand-footerBg text-brand-ivory">
      <div className={`${CONTAINER} grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <p className="font-serif text-2xl font-semibold tracking-tight">Greater Place</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-ivory/60">
            Where movement becomes opportunity.
          </p>
        </div>

        <nav aria-labelledby="footer-programs" className="lg:col-span-2">
          <h2 id="footer-programs" className={HEADING}>
            Programs
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {PROGRAM_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-organisation" className="lg:col-span-2">
          <h2 id="footer-organisation" className={HEADING}>
            Organisation
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {ORGANISATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-4">
          {/* Newsletter is UI only: no <form> and no handler until the newsletter decision is made. */}
          <div role="group" aria-labelledby="footer-newsletter">
            <h2 id="footer-newsletter" className={HEADING}>
              Newsletter
            </h2>
            <div className="mt-5 flex items-stretch gap-3">
              <TextField
                id="footer-newsletter-email"
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                size="small"
                fullWidth
              />
              <Button type="button" variant="solidWhite" size="small">
                Subscribe
              </Button>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <nav aria-labelledby="footer-social" className="mt-10">
              <h2 id="footer-social" className={HEADING}>
                Follow
              </h2>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {socialLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      {...(/^https?:\/\//i.test(link.href) && { target: '_blank', rel: 'noopener noreferrer' })}
                      className={LINK}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="border-t border-brand-ivory/10">
        <div className={`${CONTAINER} py-6 text-xs text-brand-ivory/60`}>
          © {new Date().getFullYear()} Greater Place
        </div>
      </div>
    </footer>
  )
}
