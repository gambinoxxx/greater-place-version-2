import Link from 'next/link'
import Form from 'next/form'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { escapeLike } from '@/lib/blog'
import { isImageUrl } from '@/lib/image-url'
import { formatAdminDate } from '@/lib/admin-format'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImageKitImage from '@/components/ImageKitImage'
import StatusBadge from '@/components/admin/StatusBadge'
import { BTN_RED, CONTENT, FOCUS, HAIR, ICON_BTN, SEGMENT_WRAP, segment } from '@/components/admin/ui'

// Events list (docs/design-references/admin-events.html). Columns are the Event model's real fields;
// Upcoming / Past is computed from startsAt (there is no status column).
export const metadata = { title: 'Admin - Events' }
export const dynamic = 'force-dynamic'

const MAX_ROWS = 200
const first = (value) => (Array.isArray(value) ? value[0] : value)

export default async function AdminEventsPage({ searchParams }) {
  await requireAdminPage()
  const params = await searchParams
  const q = (first(params.q) ?? '').trim().slice(0, 100)
  const status = ['upcoming', 'past'].includes(first(params.status)) ? first(params.status) : 'all'
  const now = new Date()

  const events = await prisma.event.findMany({
    where: {
      ...(status === 'upcoming' && { startsAt: { gte: now } }),
      ...(status === 'past' && { startsAt: { lt: now } }),
      ...(q && { OR: [{ title: { contains: escapeLike(q), mode: 'insensitive' } }, { location: { contains: escapeLike(q), mode: 'insensitive' } }] }),
    },
    orderBy: { startsAt: 'desc' },
    take: MAX_ROWS,
  })

  const href = (next) => {
    const merged = { q, status, ...next }
    const query = new URLSearchParams()
    if (merged.q) query.set('q', merged.q)
    if (merged.status !== 'all') query.set('status', merged.status)
    return query.toString() ? `/admin/events?${query}` : '/admin/events'
  }

  return (
    <>
      <AdminTopbar title="Events">
        <Link href="/admin/events/new" className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          New Event
        </Link>
      </AdminTopbar>

      <div className={CONTENT}>
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <Form action="/admin/events" className="relative">
            {status !== 'all' && <input type="hidden" name="status" value={status} />}
            <label>
              <span className="sr-only">Search events</span>
              <svg aria-hidden="true" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-ivory/[0.38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
              <input type="search" name="q" defaultValue={q} placeholder="Search events..." className={`w-64 rounded-md border border-brand-ivory/[0.14] bg-brand-ivory/[0.04] py-2.5 pl-9 pr-3.5 text-[13px] placeholder:text-brand-ivory/[0.38] ${FOCUS}`} />
            </label>
          </Form>
          <nav aria-label="Filter by date" className={SEGMENT_WRAP}>
            {[['all', 'All'], ['upcoming', 'Upcoming'], ['past', 'Past']].map(([value, label]) => (
              <Link key={value} href={href({ status: value })} aria-current={status === value ? 'true' : undefined} className={segment(status === value)}>{label}</Link>
            ))}
          </nav>
        </div>

        {events.length === 0 ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/[0.55] ${HAIR}`}>
            {q || status !== 'all' ? 'No events match these filters.' : 'No events yet.'} <Link href="/admin/events/new" className="underline underline-offset-4">Create an event</Link>
          </p>
        ) : (
          <div className={`relative overflow-x-auto rounded-lg border ${HAIR}`}>
            <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
              <thead>
                <tr className={`border-b bg-brand-ivory/[0.03] text-[11px] uppercase tracking-[0.06em] text-brand-ivory/[0.38] ${HAIR}`}>
                  <th scope="col" className="w-[76px] px-5 py-3"><span className="sr-only">Image</span></th>
                  <th scope="col" className="py-3 font-normal">Event</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Date</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Location</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Status</th>
                  <th scope="col" className="w-[100px] py-3 pr-5 font-normal"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const past = event.startsAt < now
                  return (
                    <tr key={event.id} className={`border-b border-brand-ivory/[0.08] last:border-b-0 ${past ? 'opacity-[0.55]' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-md bg-brand-navy">
                          {isImageUrl(event.image) && <ImageKitImage src={event.image} sizes="44px" className="absolute inset-0 h-full w-full object-cover" />}
                        </div>
                      </td>
                      <td className="max-w-[320px] py-3 pr-3">
                        <Link href={`/admin/events/${event.id}/edit`} className={`block truncate font-bold hover:underline ${FOCUS}`}>{event.title}</Link>
                        <div className="mt-0.5 truncate text-[11.5px] text-brand-ivory/[0.38]">{event.description}</div>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">{formatAdminDate(event.startsAt)}</td>
                      <td className="py-3 pr-3">{event.location}</td>
                      <td className="py-3 pr-3"><StatusBadge status={past ? 'past' : 'upcoming'} /></td>
                      <td className="py-3 pr-5">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/admin/events/${event.id}/edit`} aria-label={`Edit event: ${event.title}`} className={ICON_BTN}>
                            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                          </Link>
                          <ConfirmDelete endpoint={`/api/admin/events/${event.id}`} name={event.title} kind="event" />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {events.length === MAX_ROWS && <p className="mt-3 text-xs text-brand-ivory/[0.38]">Showing the newest {MAX_ROWS} events. Use search or filters to narrow the list.</p>}
      </div>
    </>
  )
}
