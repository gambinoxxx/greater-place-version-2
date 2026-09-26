import { requireAdminPage } from '@/lib/admin-page'
import { getImageEndpoint } from '@/lib/image-url'
import ProgramEditor from '@/components/admin/ProgramEditor'

export const metadata = { title: 'Admin - New Program or Class' }
export const dynamic = 'force-dynamic'

// ?type=program (default) or ?type=class
export default async function NewProgramPage({ searchParams }) {
  await requireAdminPage()
  const { type } = await searchParams
  return <ProgramEditor kind={type === 'class' ? 'class' : 'program'} record={null} imageEndpoint={getImageEndpoint() ?? null} />
}
