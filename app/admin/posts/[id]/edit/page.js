import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isRecordId } from '@/lib/admin-api'
import { getImageEndpoint } from '@/lib/image-url'
import { CATEGORY_NAMES } from '@/components/CategoryTag'
import PostEditor from '@/components/admin/PostEditor'

export const metadata = { title: 'Admin — Edit Post' }
export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }) {
  await requireAdminPage()
  const { id } = await params
  if (!isRecordId(id)) notFound()
  const [post, team] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' }, select: { name: true } }),
  ])
  if (!post) notFound()

  // Client components get plain, serialisable data. An older free-form category stays selectable.
  const categories = CATEGORY_NAMES.includes(post.category) ? CATEGORY_NAMES : [...CATEGORY_NAMES, post.category]
  const record = { ...post, publishedAt: post.publishedAt.toISOString(), createdAt: undefined, updatedAt: undefined }
  return <PostEditor post={record} categories={categories} authors={team.map((m) => m.name)} imageEndpoint={getImageEndpoint() ?? null} />
}
