import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isImageUrl } from '@/lib/image-url'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImageKitImage from '@/components/ImageKitImage'
import { BTN_RED, CONTENT, FOCUS, HAIR, ICON_BTN } from '@/components/admin/ui'

// Sponsors: the logos shown in the homepage "Supported by" marquee. Add, edit and remove only; the
// marquee order is the order they were added (oldest first).
export const metadata = { title: 'Admin - Sponsors' }
export const dynamic = 'force-dynamic'

export default async function AdminSponsorsPage() {
  await requireAdminPage()
  const sponsors = await prisma.sponsor.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <>
      <AdminTopbar title="Sponsors">
        <Link href="/admin/sponsors/new" className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          Add Sponsor
        </Link>
      </AdminTopbar>

      <div className={CONTENT}>
        {sponsors.length === 0 ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/[0.55] ${HAIR}`}>
            No sponsors yet, so the homepage &ldquo;Supported by&rdquo; section is hidden.{' '}
            <Link href="/admin/sponsors/new" className="underline underline-offset-4">Add the first one</Link>
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sponsors.map((sponsor) => (
              <li key={sponsor.id} className="flex flex-col gap-3 rounded-lg border border-brand-ivory/[0.14] bg-brand-ivory/[0.02] p-[18px]">
                {/* Light tile so dark logos on a transparent background stay visible in the dark admin. */}
                <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-md bg-brand-ivory p-4">
                  {isImageUrl(sponsor.logo) && (
                    <ImageKitImage src={sponsor.logo} alt={sponsor.name} sizes="240px" className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <h2 className="truncate font-serif text-base">
                  <Link href={`/admin/sponsors/${sponsor.id}/edit`} className={`hover:underline ${FOCUS}`}>{sponsor.name}</Link>
                </h2>
                <div className="flex items-center justify-between gap-2 border-t border-brand-ivory/[0.14] pt-3">
                  <span className="truncate font-mono text-[11px] text-brand-ivory/[0.38]">
                    {sponsor.website ? sponsor.website.replace(/^https?:\/\//, '') : 'No website'}
                  </span>
                  <div className="flex gap-1.5">
                    <Link href={`/admin/sponsors/${sponsor.id}/edit`} aria-label={`Edit sponsor: ${sponsor.name}`} className={ICON_BTN}>
                      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                    </Link>
                    <ConfirmDelete endpoint={`/api/admin/sponsors/${sponsor.id}`} name={sponsor.name} kind="sponsor" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
