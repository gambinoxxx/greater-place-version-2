import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdminPage } from '@/lib/admin-page'
import { isImageUrl } from '@/lib/image-url'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImageKitImage from '@/components/ImageKitImage'
import { BTN_RED, CONTENT, FOCUS, HAIR, ICON_BTN, SEGMENT_WRAP, segment } from '@/components/admin/ui'

// Programs & Classes (docs/design-references/admin-programs.html): ONE admin section over TWO separate
// Prisma models, shown as tabs. Program and Class have the same four fields (title, slug, description,
// image) and no relation, so the mockup's "classes linked", age group, level, and schedule are not shown:
// the schema has nowhere to store them.
export const metadata = { title: 'Admin - Programs & Classes' }
export const dynamic = 'force-dynamic'

const TABS = {
  programs: { label: 'Programs', kind: 'program', singular: 'Program', model: 'program', endpoint: 'programs' },
  classes: { label: 'Classes', kind: 'class', singular: 'Class', model: 'class', endpoint: 'classes' },
}
const first = (value) => (Array.isArray(value) ? value[0] : value)

export default async function AdminProgramsPage({ searchParams }) {
  await requireAdminPage()
  const params = await searchParams
  const tab = first(params.tab) === 'classes' ? 'classes' : 'programs'
  const config = TABS[tab]

  const [programCount, classCount, records] = await Promise.all([
    prisma.program.count(),
    prisma.class.count(),
    prisma[config.model].findMany({ orderBy: { createdAt: 'asc' } }),
  ])
  const counts = { programs: programCount, classes: classCount }

  return (
    <>
      <AdminTopbar title="Programs & Classes">
        <Link href={`/admin/programs/new?type=${config.kind}`} className={BTN_RED}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          New {config.singular}
        </Link>
      </AdminTopbar>

      <div className={CONTENT}>
        <nav aria-label="Programs or classes" className={`${SEGMENT_WRAP} mb-6`}>
          {Object.entries(TABS).map(([key, item]) => (
            <Link key={key} href={`/admin/programs?tab=${key}`} aria-current={tab === key ? 'true' : undefined} className={segment(tab === key)}>
              {item.label} ({counts[key]})
            </Link>
          ))}
        </nav>

        {records.length === 0 ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/[0.55] ${HAIR}`}>
            No {config.label.toLowerCase()} yet. <Link href={`/admin/programs/new?type=${config.kind}`} className="underline underline-offset-4">Create one</Link>
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <li key={record.id} className="flex flex-col gap-3 rounded-lg border border-brand-ivory/[0.14] bg-brand-ivory/[0.02] p-[22px]">
                <div className="relative h-24 overflow-hidden rounded-md bg-brand-navy">
                  {isImageUrl(record.image) && <ImageKitImage src={record.image} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 90vw" className="absolute inset-0 h-full w-full object-cover" />}
                </div>
                <h2 className="font-serif text-base">
                  <Link href={`/admin/programs/${record.id}/edit?type=${config.kind}`} className={`hover:underline ${FOCUS}`}>{record.title}</Link>
                </h2>
                <p className="line-clamp-3 grow text-[12.5px] leading-relaxed text-brand-ivory/[0.55]">{record.description}</p>
                <div className="flex items-center justify-between border-t border-brand-ivory/[0.14] pt-3">
                  <span className="truncate font-mono text-[11px] text-brand-ivory/[0.38]">{record.slug}</span>
                  <div className="flex gap-1.5">
                    <Link href={`/admin/programs/${record.id}/edit?type=${config.kind}`} aria-label={`Edit ${config.kind}: ${record.title}`} className={ICON_BTN}>
                      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                    </Link>
                    <ConfirmDelete endpoint={`/api/admin/${config.endpoint}/${record.id}`} name={record.title} kind={config.kind} />
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
