'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { FOCUS } from '@/components/admin/ui'

// Admin navigation. This is the final list: there is deliberately no Settings entry (it was deferred, and
// a link that goes nowhere is a defect). Client component only for active-link highlighting and Log out.
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }
const NAV = [
  { label: 'Dashboard', href: '/admin', icon: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></> },
  { label: 'Blog Posts', href: '/admin/posts', icon: <><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" /></> },
  { label: 'Media Library', href: '/admin/media', icon: <><rect x="3" y="4" width="18" height="15" rx="1.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 15l-5.5-5.5L4 20" /></> },
  { label: 'Events', href: '/admin/events', icon: <><rect x="3" y="4" width="18" height="17" rx="1.5" /><path d="M3 9h18M8 2v4M16 2v4" /></> },
  { label: 'Programs & Classes', href: '/admin/programs', icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
  { label: 'Contact', href: '/admin/contact', icon: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></>, badge: true },
]

const LOGOUT = `text-[11px] text-brand-ivory/[0.55] underline-offset-4 hover:text-brand-ivory hover:underline ${FOCUS}`

export default function AdminSidebar({ unread = 0, email }) {
  const pathname = usePathname()

  return (
    <aside className="border-b border-brand-ivory/[0.14] bg-brand-navyDeep lg:fixed lg:bottom-0 lg:top-0 lg:flex lg:w-[260px] lg:flex-col lg:border-b-0 lg:border-r lg:py-7">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:mb-4 lg:block lg:border-b lg:border-brand-ivory/[0.14] lg:px-7 lg:pb-6 lg:pt-0">
        <div>
          <div className="font-serif text-sm tracking-[0.16em]">GREATER PLACE</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-brand-ivory/[0.38]">Admin</div>
        </div>
        <SignOutButton redirectUrl="/">
          <button type="button" className={`${LOGOUT} lg:hidden`}>Log out</button>
        </SignOutButton>
      </div>

      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-4 pb-3 lg:grow lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {NAV.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors ${FOCUS} ${active ? 'bg-brand-ivory/[0.07] font-bold text-brand-ivory' : 'font-semibold text-brand-ivory/[0.55] hover:text-brand-ivory'}`}
            >
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" className="shrink-0" {...stroke}>{item.icon}</svg>
              {item.label}
              {item.badge && unread > 0 && (
                <span className="ml-auto rounded-lg bg-brand-red px-1.5 text-[10px] font-extrabold text-white" aria-label={`${unread} unread`}>{unread}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mx-4 hidden items-center gap-2.5 border-t border-brand-ivory/[0.14] px-3 pt-4 lg:flex">
        <div aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full bg-brand-storiesBlue/40" />
        <div className="min-w-0">
          <div className="truncate text-[12.5px] font-bold" title={email}>{email}</div>
          <SignOutButton redirectUrl="/">
            <button type="button" className={LOGOUT}>Log out</button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
