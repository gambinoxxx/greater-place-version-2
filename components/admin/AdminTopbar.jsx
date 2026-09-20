import Link from 'next/link'
import { FOCUS, HAIR } from '@/components/admin/ui'

// Page title bar for every admin screen. `back` adds the ← link used by the editors; `children` holds the
// page's actions (New Post, Save Draft / Publish, ...). Also rendered by the client editors.
export default function AdminTopbar({ title, back, children }) {
  return (
    <header className={`flex min-h-[76px] flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-9 ${HAIR}`}>
      <div className="flex min-w-0 items-center gap-3.5">
        {back && (
          <Link
            href={back}
            aria-label="Back to the list"
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-brand-ivory/[0.14] text-brand-ivory/70 hover:text-brand-ivory ${FOCUS}`}
          >
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="truncate font-serif text-[22px]">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </header>
  )
}
