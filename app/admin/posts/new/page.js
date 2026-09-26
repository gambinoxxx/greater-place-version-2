import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { getImageEndpoint } from '@/lib/image-url'
import { CATEGORY_NAMES } from '@/components/CategoryTag'
import PostEditor from '@/components/admin/PostEditor'

export const metadata = { title: 'Admin - New Post' }
export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  await requireAdminPage()
  const team = await prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' }, select: { name: true } })
  return <PostEditor post={null} categories={CATEGORY_NAMES} authors={team.map((m) => m.name)} imageEndpoint={getImageEndpoint() ?? null} />
}
