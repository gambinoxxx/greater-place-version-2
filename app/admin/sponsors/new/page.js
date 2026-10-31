import { requireAdminPage } from '@/lib/admin-page'
import { getImageEndpoint } from '@/lib/image-url'
import SponsorEditor from '@/components/admin/SponsorEditor'

export const metadata = { title: 'Admin - Add Sponsor' }
export const dynamic = 'force-dynamic'

export default async function NewSponsorPage() {
  await requireAdminPage()
  return <SponsorEditor record={null} imageEndpoint={getImageEndpoint() ?? null} />
}
