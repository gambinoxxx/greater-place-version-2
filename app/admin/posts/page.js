import Link from 'next/link'
import Form from 'next/form'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { escapeLike } from '@/lib/blog'
import { isImageUrl } from '@/lib/image-url'
import { formatAdminDate } from '@/lib/admin-format'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AutoSubmitSelect from '@/components/admin/AutoSubmitSelect'
import CategoryTag, { CATEGORY_NAMES } from '@/components/CategoryTag'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImageKitImage from '@/components/ImageKitImage'
import StatusBadge from '@/components/admin/StatusBadge'
import { BTN_RED, CONTENT, FOCUS, HAIR, ICON_BTN, SEGMENT_WRAP, segment } from '@/components/admin/ui'

// Blog Posts list (docs/design-references/admin-posts.html). Unlike /blog it shows drafts too.
// Filters are URL parameters: q (title/excerpt), status (all | published | draft), category.
export const metadata = { title: 'Admin - Blog Posts' }
export const dynamic = 'force-dynamic'

const MAX_ROWS = 200
const first = (value) => (Array.isArray(value) ? value[0] : value)

export default async function AdminPostsPage({ searchParams }) {
  await requireAdminPage()
  const params = await searchParams
  const q = (first(params.q) ?? '').trim().slice(0, 100)
  const status = ['published', 'draft'].includes(first(params.status)) ? first(params.status) : 'all'
  const category = CATEGORY_NAMES.find((name) => name.toLowerCase() === (first(params.category) ?? '').toLowerCase()) ?? ''

  const where = {
    ...(status === 'published' && { isPublished: true }),
    ...(status === 'draft' && { isPublished: false }),
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(q && { OR: [{ title: { contains: escapeLike(q), mode: 'insensitive' } }, { excerpt: { contains: escapeLike(q), mode: 'insensitive' } }] }),
  }
  const posts = await prisma.post.findMany({ where, orderBy: { publishedAt: 'desc' }, take: MAX_ROWS })

  const href = (next) => {
    const merged = { q, category, status, ...next }
    const query = new URLSearchParams()
    if (merged.q) query.set('q', merged.q)
    if (merged.category) query.set('category', merged.category)
    if (merged.status !== 'all') query.set('status', merged.status)
    const text = query.toString()
    return text ? `/admin/posts?${text}` : '/admin/posts'
  }

  return (
    <>
      <AdminTopbar title="Blog Posts">
        <Link href="/admin/posts/new" className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          New Post
        </Link>
      </AdminTopbar>

      <div className={CONTENT}>
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <Form action="/admin/posts" className="flex flex-wrap items-center gap-2.5">
            {status !== 'all' && <input type="hidden" name="status" value={status} />}
            <label className="relative">
              <span className="sr-only">Search posts</span>
              <svg aria-hidden="true" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-ivory/[0.38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
              <input type="search" name="q" defaultValue={q} placeholder="Search posts..." className={`w-56 rounded border border-brand-ivory/[0.14] bg-brand-ivory/[0.04] py-2 pl-[34px] pr-3.5 text-[12.5px] placeholder:text-brand-ivory/[0.38] ${FOCUS}`} />
            </label>
            <AutoSubmitSelect name="category" label="Category" value={category} options={CATEGORY_NAMES} />
          </Form>
          <nav aria-label="Filter by status" className={SEGMENT_WRAP}>
            {[['all', 'All'], ['published', 'Published'], ['draft', 'Draft']].map(([value, label]) => (
              <Link key={value} href={href({ status: value })} aria-current={status === value ? 'true' : undefined} className={segment(status === value)}>{label}</Link>
            ))}
          </nav>
        </div>

        {posts.length === 0 ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/[0.55] ${HAIR}`}>
            {q || category || status !== 'all' ? 'No posts match these filters.' : 'No posts yet.'}{' '}
            <Link href="/admin/posts/new" className="underline underline-offset-4">Create a post</Link>
          </p>
        ) : (
          <div className={`relative overflow-x-auto rounded-lg border ${HAIR}`}>
            <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
              <thead>
                <tr className={`border-b bg-brand-ivory/[0.03] text-[10px] uppercase tracking-[0.1em] text-brand-ivory/[0.38] ${HAIR}`}>
                  <th className="w-[74px] px-5 py-3" scope="col"><span className="sr-only">Image</span></th>
                  <th scope="col" className="py-3 font-normal">Title</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Category</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Status</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Author</th>
                  <th scope="col" className="py-3 pr-3 font-normal">Date</th>
                  <th scope="col" className="w-[100px] py-3 pr-5 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-brand-ivory/[0.08] last:border-b-0">
                    <td className="px-5 py-3">
                      <div className="relative h-[34px] w-[46px] overflow-hidden rounded bg-brand-navy">
                        {isImageUrl(post.coverImage) && <ImageKitImage src={post.coverImage} sizes="46px" className="absolute inset-0 h-full w-full object-cover" />}
                      </div>
                    </td>
                    <td className="max-w-[320px] py-3 pr-3">
                      <Link href={`/admin/posts/${post.id}/edit`} className={`block truncate font-semibold hover:underline ${FOCUS}`}>{post.title}</Link>
                    </td>
                    <td className="py-3 pr-3"><CategoryTag category={post.category} /></td>
                    <td className="py-3 pr-3"><StatusBadge status={post.isPublished ? 'published' : 'draft'} /></td>
                    <td className="py-3 pr-3 text-[12.5px] text-brand-ivory/[0.55]">{post.authorName}</td>
                    <td className="py-3 pr-3 text-[12.5px] text-brand-ivory/[0.55]">{post.isPublished ? formatAdminDate(post.publishedAt) : '-'}</td>
                    <td className="relative py-3 pr-5">
                      <div className="flex gap-1.5">
                        <Link href={`/admin/posts/${post.id}/edit`} aria-label={`Edit post: ${post.title}`} className={ICON_BTN}>
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                        </Link>
                        <div className="relative"><ConfirmDelete endpoint={`/api/admin/posts/${post.id}`} name={post.title} kind="post" /></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {posts.length === MAX_ROWS && <p className="mt-3 text-xs text-brand-ivory/[0.38]">Showing the newest {MAX_ROWS} posts. Use search or filters to narrow the list.</p>}
      </div>
    </>
  )
}
