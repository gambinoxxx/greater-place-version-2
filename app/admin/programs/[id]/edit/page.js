import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isRecordId } from '@/lib/admin-api'
import { getImageEndpoint } from '@/lib/image-url'
import ProgramEditor from '@/components/admin/ProgramEditor'

export const metadata = { title: 'Admin - Edit Program or Class' }
export const dynamic = 'force-dynamic'

// ?type=program (default) or ?type=class picks the model; the two are separate tables.
export default async function EditProgramPage({ params, searchParams }) {
  await requireAdminPage()
  const [{ id }, { type }] = await Promise.all([params, searchParams])
  if (!isRecordId(id)) notFound()
  const kind = type === 'class' ? 'class' : 'program'
  const record = await prisma[kind].findUnique({ where: { id } })
  if (!record) notFound()
  return <ProgramEditor kind={kind} record={{ ...record, createdAt: undefined, updatedAt: undefined }} imageEndpoint={getImageEndpoint() ?? null} />
}
