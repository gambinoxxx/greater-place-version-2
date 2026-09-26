import Link from 'next/link'
import Form from 'next/form'
import { requireAdminPage } from '@/lib/admin-page'
import { listMediaFiles } from '@/lib/imagekit'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ImageKitImage from '@/components/ImageKitImage'
import { CopyUrlButton, MediaUploadButton } from '@/components/admin/MediaUpload'
import { CONTENT, FOCUS, HAIR, PANEL } from '@/components/admin/ui'

// Media Library (docs/design-references/admin-media.html): the newest images in the ImageKit account,
// newest first, with search, upload, and a Copy URL button (the stored value for a post or event image).
// Read-only listing plus upload; there is no delete here. Search matches file names in the newest 200.
export const metadata = { title: 'Admin - Media Library' }
export const dynamic = 'force-dynamic'

const PAGE = 40
const SEARCH_WINDOW = 200
const first = (value) => (Array.isArray(value) ? value[0] : value)
const bytes = (n) => (n == null ? '' : n >= 1048576 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`)

export default async function AdminMediaPage({ searchParams }) {
  await requireAdminPage()
  const params = await searchParams
  const q = (first(params.q) ?? '').trim().slice(0, 100)
  const page = Math.max(1, Math.min(200, Number.parseInt(first(params.page) ?? '1', 10) || 1))

  let files = null
  let hasMore = false
  let failed = false
  try {
    if (q) {
      const all = await listMediaFiles({ skip: 0, limit: SEARCH_WINDOW })
      files = all && all.filter((file) => file.name.toLowerCase().includes(q.toLowerCase()))
    } else {
      const batch = await listMediaFiles({ skip: (page - 1) * PAGE, limit: PAGE + 1 })
      hasMore = Boolean(batch) && batch.length > PAGE
      files = batch && batch.slice(0, PAGE)
    }
  } catch (error) {
    console.error('[admin/media] could not list images:', error?.name ?? 'unknown')
    failed = true
  }

  const pageHref = (n) => `/admin/media?${new URLSearchParams({ ...(q && { q }), page: String(n) })}`

  return (
    <>
      <AdminTopbar title="Media Library">
        <Form action="/admin/media" className="relative w-full sm:w-auto">
          <label>
            <span className="sr-only">Search images</span>
            <svg aria-hidden="true" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-ivory/[0.38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
            <input type="search" name="q" defaultValue={q} placeholder="Search images..." className={`w-full rounded border sm:w-52 border-brand-ivory/[0.14] bg-brand-ivory/[0.04] py-2 pl-[34px] pr-3.5 text-[12.5px] placeholder:text-brand-ivory/[0.38] ${FOCUS}`} />
          </label>
        </Form>
        {files !== null && !failed && <MediaUploadButton />}
      </AdminTopbar>

      <div className={CONTENT}>
        {failed ? (
          <p role="alert" className={`rounded-lg border p-8 text-sm text-brand-ivory/70 ${HAIR}`}>The image library could not be loaded. Check the ImageKit settings and try again.</p>
        ) : files === null ? (
          <p className={`rounded-lg border p-8 text-sm text-brand-ivory/70 ${HAIR}`}>ImageKit is not configured yet, so there is no library to show. Set the IMAGEKIT_* variables to enable uploads and this library.</p>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {files.map((file) => (
                <li key={file.fileId} className="overflow-hidden rounded-md border border-brand-ivory/[0.14]">
                  <div className="relative aspect-[4/3] bg-brand-navy">
                    <ImageKitImage src={file.url} alt={file.name} sizes="(min-width: 1536px) 15vw, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="bg-brand-ivory/[0.03] px-2.5 py-2">
                    <div className="truncate text-[11px] font-semibold" title={file.name}>{file.name}</div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-brand-ivory/[0.38]">{[file.width && file.height ? `${file.width}×${file.height}` : null, bytes(file.size)].filter(Boolean).join(' · ')}</span>
                      <CopyUrlButton url={file.url} name={file.name} />
                    </div>
                  </div>
                </li>
              ))}
              {!q && <li><MediaUploadButton tile /></li>}
            </ul>
            {files.length === 0 && (
              <p className={`${PANEL} mt-4 p-6 text-sm text-brand-ivory/[0.55]`}>{q ? `No images match "${q}" in the newest ${SEARCH_WINDOW}.` : 'No images yet. Upload the first one.'}</p>
            )}
            {!q && (page > 1 || hasMore) && (
              <nav aria-label="Pages" className="mt-6 flex items-center gap-4 text-xs">
                {page > 1 && <Link href={pageHref(page - 1)} className={`underline underline-offset-4 ${FOCUS}`}>← Newer</Link>}
                <span className="text-brand-ivory/[0.38]">Page {page}</span>
                {hasMore && <Link href={pageHref(page + 1)} className={`underline underline-offset-4 ${FOCUS}`}>Older →</Link>}
              </nav>
            )}
          </>
        )}
      </div>
    </>
  )
}
