import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { formatAdminDateTime, formatRelative, parseSubmissionMessage } from '@/lib/admin-format'
import AdminTopbar from '@/components/admin/AdminTopbar'
import MarkReadButton from '@/components/admin/MarkReadButton'
import { CONTENT, HAIR, SEGMENT_WRAP, segment } from '@/components/admin/ui'

// Contact inbox (docs/design-references/admin-contact.html): read-only list of ContactSubmission rows,
// newest first, unread ones highlighted, each markable read / unread. No edit, reply, or delete.
export const metadata = { title: 'Admin - Contact' }
export const dynamic = 'force-dynamic'

const MAX_ROWS = 200
const PLAIN_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
const first = (value) => (Array.isArray(value) ? value[0] : value)

export default async function AdminContactPage({ searchParams }) {
  await requireAdminPage()
  const params = await searchParams
  const filter = first(params.filter) === 'unread' ? 'unread' : 'all'

  const [total, unread, messages] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.contactSubmission.findMany({ where: filter === 'unread' ? { isRead: false } : {}, orderBy: { createdAt: 'desc' }, take: MAX_ROWS }),
  ])

  return (
    <>
      <AdminTopbar title="Contact" />
      <div className={`${CONTENT} max-w-[920px]`}>
        <nav aria-label="Filter messages" className={`${SEGMENT_WRAP} mb-5`}>
          <Link href="/admin/contact" aria-current={filter === 'all' ? 'true' : undefined} className={segment(filter === 'all')}>All ({total})</Link>
          <Link href="/admin/contact?filter=unread" aria-current={filter === 'unread' ? 'true' : undefined} className={segment(filter === 'unread')}>Unread ({unread})</Link>
        </nav>

        {messages.length === 0 ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/[0.55] ${HAIR}`}>{filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {messages.map((message) => {
              const { reason, phone, body } = parseSubmissionMessage(message.message)
              return (
                <li
                  key={message.id}
                  className={`relative rounded-lg border py-[18px] pl-6 pr-5 ${message.isRead ? 'border-brand-ivory/[0.14] bg-brand-ivory/[0.02]' : 'border-brand-ivory/[0.22] bg-brand-ivory/[0.045]'}`}
                >
                  {!message.isRead && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] rounded-l-lg bg-brand-red" />}
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
                      <span className="text-sm font-bold">
                        {!message.isRead && <span aria-hidden="true" className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-brand-red" />}
                        {message.name}
                        {!message.isRead && <span className="sr-only"> (unread)</span>}
                      </span>
                      {/* Only plain addresses become links: "?" or "&" in a stored address could add a subject or body to the mailto. */}
                      {PLAIN_EMAIL.test(message.email) ? (
                        <a href={`mailto:${message.email}`} className="truncate text-xs text-brand-ivory/[0.38] underline-offset-2 hover:underline">{message.email}</a>
                      ) : (
                        <span className="truncate text-xs text-brand-ivory/[0.38]">{message.email}</span>
                      )}
                    </div>
                    <time dateTime={message.createdAt.toISOString()} title={formatAdminDateTime(message.createdAt)} className="shrink-0 text-[11.5px] text-brand-ivory/[0.38]">
                      {formatRelative(message.createdAt)}
                    </time>
                  </div>
                  {(reason || phone) && (
                    <p className="mb-2 text-[11.5px] text-brand-ivory/[0.38]">
                      {reason && <>Reason: <span className="text-brand-ivory/70">{reason}</span></>}
                      {reason && phone && ' · '}
                      {phone && <>Phone: <span className="text-brand-ivory/70">{phone}</span></>}
                    </p>
                  )}
                  <p className="mb-3.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-brand-ivory/[0.55] [overflow-wrap:anywhere]">{body}</p>
                  <MarkReadButton id={message.id} isRead={message.isRead} name={message.name} />
                </li>
              )
            })}
          </ul>
        )}
        {messages.length === MAX_ROWS && <p className="mt-3 text-xs text-brand-ivory/[0.38]">Showing the newest {MAX_ROWS} messages.</p>}
      </div>
    </>
  )
}
