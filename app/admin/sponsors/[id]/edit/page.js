import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isRecordId } from '@/lib/admin-api'
import { getImageEndpoint } from '@/lib/image-url'
import SponsorEditor from '@/components/admin/SponsorEditor'

export const metadata = { title: 'Admin - Edit Sponsor' }
export const dynamic = 'force-dynamic'

export default async function EditSponsorPage({ params }) {
  await requireAdminPage()
  const { id } = await params
  if (!isRecordId(id)) notFound()
  const record = await prisma.sponsor.findUnique({ where: { id } })
  if (!record) notFound()
  return <SponsorEditor record={{ ...record, createdAt: undefined, updatedAt: undefined }} imageEndpoint={getImageEndpoint() ?? null} />
}
