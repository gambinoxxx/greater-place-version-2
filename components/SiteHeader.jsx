'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Classes, Training, and Blog are intentionally not in the main navigation: they are reached
// through CTAs on /programs and the blog teasers.
const NAV_LINKS = [
  { label: 'Programs', href: '/programs' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/#team' },
  { label: 'Support', href: '/#support' },
  { label: 'Contact', href: '/contact' },
]

// Keyed by the data-theme of the section currently under the header.
// "dark" = header sits over a dark section (light text); "light" = over a light section (dark text).
const THEMES = {
  dark: {
    text: 'text-brand-ivory',
    surface: 'bg-brand-black/80 border-brand-ivory/10',
    pill: 'bg-brand-red text-brand-white hover:bg-brand-redDeep',
    focus: 'focus-visible:outline-brand-ivory',
  },
  light: {
    text: 'text-brand-black',
    surface: 'bg-brand-ivory/90 border-brand-black/10',
    pill: 'bg-brand-black text-brand-ivory hover:bg-brand-navy',
    focus: 'focus-visible:outline-brand-black',
  },
}

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12'

export default function SiteHeader() {
  const pathname = usePathname()
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [sectionTheme, setSectionTheme] = useState('dark')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Watch a 1px band at the header's vertical midline so exactly one
  // [data-theme] section is "under" the header at any time.
  useEffect(() => {
    const sections = document.querySelectorAll('[data-theme]')
    if (!sections.length || typeof IntersectionObserver === 'undefined') {
      setSectionTheme('dark')
      return undefined
    }

    let observer
    const observe = () => {
      observer?.disconnect()
      const headerHeight = headerRef.current?.offsetHeight ?? 72
      const top = Math.round(headerHeight / 2)
      const bottom = Math.max(window.innerHeight - top - 1, 0)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // Pages that mount PageAtmosphere drive the theme through html[data-atmosphere] instead.
            if (entry.isIntersecting && !document.documentElement.hasAttribute('data-atmosphere')) {
              setSectionTheme(entry.target.dataset.theme === 'light' ? 'light' : 'dark')
            }
          }
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 }
      )
      sections.forEach((section) => observer.observe(section))
    }

    observe()
    window.addEventListener('resize', observe)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [pathname])

  // When a page mounts PageAtmosphere, the atmosphere is the single source of truth for the
  // theme behind the header, so the header flips exactly when the page background does.
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const atmosphere = root.getAttribute('data-atmosphere')
      if (atmosphere) setSectionTheme(atmosphere === 'light' ? 'light' : 'dark')
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-atmosphere'] })
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // An open mobile menu always renders on the dark palette so it stays legible.
  const t = THEMES[open ? 'dark' : sectionTheme]
  const surface =
    scrolled || open
      ? `${open ? 'bg-brand-black border-brand-ivory/10' : t.surface} backdrop-blur-md`
      : 'border-transparent bg-transparent'
  const focus = `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${t.focus}`
  const iconButton = `inline-flex h-11 w-11 items-center justify-center rounded-full transition-opacity hover:opacity-70 motion-reduce:transition-none ${focus}`

  return (
    <header
      ref={headerRef}
      data-scrolled={scrolled}
      data-header-theme={open ? 'dark' : sectionTheme}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 motion-reduce:transition-none ${surface} ${t.text}`}
    >
      <nav aria-label="Primary" className={`${CONTAINER} flex h-[72px] items-center justify-between gap-6`}>
        <Link href="/" className={`font-serif text-xl font-semibold tracking-tight ${focus}`}>
          Greater Place
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.16em] underline-offset-8 hover:underline ${focus}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search" className={iconButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/#support"
            className={`hidden items-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors motion-reduce:transition-none sm:inline-flex ${t.pill} ${focus}`}
          >
            Get Involved
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className={`${iconButton} lg:hidden`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-brand-ivory/10 bg-brand-black text-brand-ivory lg:hidden">
          <ul className={`${CONTAINER} flex flex-col py-4`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm font-bold uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 sm:hidden">
              <Link
                href="/#support"
                className="inline-flex items-center rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-white hover:bg-brand-redDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ivory"
              >
                Get Involved
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
