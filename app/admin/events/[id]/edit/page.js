import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isRecordId } from '@/lib/admin-api'
import { getImageEndpoint } from '@/lib/image-url'
import EventEditor from '@/components/admin/EventEditor'

export const metadata = { title: 'Admin — Edit Event' }
export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }) {
  await requireAdminPage()
  const { id } = await params
  if (!isRecordId(id)) notFound()
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()
  return <EventEditor event={{ ...event, startsAt: event.startsAt.toISOString(), createdAt: undefined, updatedAt: undefined }} imageEndpoint={getImageEndpoint() ?? null} />
}
