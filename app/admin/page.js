import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isImageUrl } from '@/lib/image-url'
import { formatAdminDate, formatRelative, parseSubmissionMessage } from '@/lib/admin-format'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ImageKitImage from '@/components/ImageKitImage'
import StatusBadge from '@/components/admin/StatusBadge'
import { BTN_RED, CONTENT, FOCUS, PANEL } from '@/components/admin/ui'

// Dashboard (docs/design-references/admin-dashboard.html): post counts, recent posts, and the newest
// unread contact messages (read-only; the inbox is /admin/contact).
export const metadata = { title: 'Admin — Dashboard' }
export const dynamic = 'force-dynamic'

const STAT_ICON = {
  posts: { tint: 'bg-brand-purple/15', color: '#A78BFA', path: <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /> },
  published: { tint: 'bg-brand-green/15', color: '#3FBF6F', path: <path d="M5 13l4 4L19 7" /> },
  drafts: { tint: 'bg-brand-gold/20', color: '#D9A441', path: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></> },
  messages: { tint: 'bg-brand-storiesBlue/20', color: '#5B9BD5', path: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></> },
}

function StatCard({ label, value, note, noteClass = 'text-brand-ivory/[0.38]', icon }) {
  const i = STAT_ICON[icon]
  return (
    <div className={`${PANEL} px-[22px] py-5`}>
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.1em] text-brand-ivory/[0.38]">{label}</span>
        <div aria-hidden="true" className={`flex h-7 w-7 items-center justify-center rounded-md ${i.tint}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i.color} strokeWidth="2">{i.path}</svg>
        </div>
      </div>
      <div className="mt-3 font-serif text-[34px] leading-none">{value}</div>
      <div className={`mt-1.5 text-[11.5px] ${noteClass}`}>{note}</div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  await requireAdminPage()

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [total, published, drafts, newThisMonth, messages, unread, recentPosts, unreadMessages] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { isPublished: true } }),
    prisma.post.count({ where: { isPublished: false } }),
    prisma.post.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 4 }),
    prisma.contactSubmission.findMany({ where: { isRead: false }, orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  return (
    <>
      <AdminTopbar title="Dashboard">
        <Link href="/admin/posts/new" className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          New Post
        </Link>
      </AdminTopbar>

      <div className={CONTENT}>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="posts" label="Total Posts" value={total} note={newThisMonth > 0 ? `+${newThisMonth} this month` : 'None added this month'} noteClass={newThisMonth > 0 ? 'text-brand-green' : undefined} />
          <StatCard icon="published" label="Published" value={published} note="Live on the blog" />
          <StatCard icon="drafts" label="Drafts" value={drafts} note="Not visible on the blog" />
          <StatCard icon="messages" label="Contact Messages" value={messages} note={unread > 0 ? `${unread} unread` : 'All read'} noteClass={unread > 0 ? 'text-brand-red' : undefined} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-[22px] xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section aria-labelledby="recent-posts" className={PANEL}>
            <div className="flex items-center justify-between border-b border-brand-ivory/[0.14] px-[22px] py-[18px]">
              <h2 id="recent-posts" className="font-serif text-[15px]">Recent Posts</h2>
              <Link href="/admin/posts" className={`text-[10.5px] font-bold uppercase tracking-[0.08em] ${FOCUS}`}>View All</Link>
            </div>
            {recentPosts.length === 0 ? (
              <p className="px-[22px] py-8 text-sm text-brand-ivory/[0.55]">No posts yet. <Link href="/admin/posts/new" className="underline underline-offset-4">Write the first one.</Link></p>
            ) : (
              <ul>
                {recentPosts.map((post) => (
                  <li key={post.id} className="flex items-center gap-3.5 border-b border-brand-ivory/[0.08] px-[22px] py-[15px] last:border-b-0">
                    <div className="relative h-10 w-[52px] shrink-0 overflow-hidden rounded bg-brand-navy">
                      {isImageUrl(post.coverImage) && <ImageKitImage src={post.coverImage} sizes="52px" className="absolute inset-0 h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 grow">
                      <Link href={`/admin/posts/${post.id}/edit`} className={`block truncate text-[13px] font-semibold hover:underline ${FOCUS}`}>{post.title}</Link>
                      <div className="mt-0.5 text-[11px] text-brand-ivory/[0.38]">{post.category} · {post.isPublished ? formatAdminDate(post.publishedAt) : 'Draft'}</div>
                    </div>
                    <StatusBadge status={post.isPublished ? 'published' : 'draft'} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="new-messages" className={PANEL}>
            <div className="flex items-center justify-between border-b border-brand-ivory/[0.14] px-[22px] py-[18px]">
              <h2 id="new-messages" className="font-serif text-[15px]">New Messages</h2>
              <Link href="/admin/contact" className={`text-[10.5px] font-bold uppercase tracking-[0.08em] ${FOCUS}`}>Inbox</Link>
            </div>
            {unreadMessages.length === 0 ? (
              <p className="px-[22px] py-8 text-sm text-brand-ivory/[0.55]">No unread messages.</p>
            ) : (
              <ul>
                {unreadMessages.map((message) => (
                  <li key={message.id} className="border-b border-brand-ivory/[0.08] px-[22px] py-3.5 last:border-b-0">
                    <div className="flex justify-between gap-3">
                      <span className="truncate text-[12.5px] font-bold">{message.name}</span>
                      <span className="shrink-0 text-[10.5px] text-brand-ivory/[0.38]">{formatRelative(message.createdAt)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-normal text-brand-ivory/[0.55]">{parseSubmissionMessage(message.message).body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
