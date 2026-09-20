import { requireAdminPage } from '@/lib/admin-page'
import { getImageEndpoint } from '@/lib/image-url'
import EventEditor from '@/components/admin/EventEditor'

export const metadata = { title: 'Admin — New Event' }
export const dynamic = 'force-dynamic'

export default async function NewEventPage() {
  await requireAdminPage()
  return <EventEditor event={null} imageEndpoint={getImageEndpoint() ?? null} />
}
