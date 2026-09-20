'use client'

import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CoverImageField from '@/components/admin/CoverImageField'
import useAdminForm from '@/components/admin/useAdminForm'
import { BTN_OUTLINE, BTN_RED, CONTENT, FIELD_ERROR, FOCUS, INPUT, LABEL } from '@/components/admin/ui'
import { validateProgramLike } from '@/lib/admin-validation'

// New / Edit for both Program and Class (two separate Prisma models with the same fields: title, slug,
// description, image). `kind` is "program" or "class" and selects the API and the public URL shape; the
// two models are never merged.
const KINDS = {
  program: { label: 'Program', segment: 'programs', publicPath: '/programs#', folder: '/programs' },
  class: { label: 'Class', segment: 'classes', publicPath: '/classes#', folder: '/classes' },
}

export default function ProgramEditor({ kind, record, imageEndpoint }) {
  const config = KINDS[kind]
  const editing = Boolean(record)
  const listHref = `/admin/programs?tab=${config.segment}`
  const form = useAdminForm({
    initial: { title: record?.title ?? '', slug: record?.slug ?? '', description: record?.description ?? '', image: record?.image ?? '' },
    validate: validateProgramLike,
    endpoint: editing ? `/api/admin/${config.segment}/${record.id}` : `/api/admin/${config.segment}`,
    method: editing ? 'PUT' : 'POST',
    redirectTo: listHref,
    idPrefix: 'record',
    slugFrom: editing ? null : 'title',
  })
  const { values, set, errors, message, status, alertRef, saving } = form

  return (
    <form noValidate aria-busy={saving} onSubmit={(e) => { e.preventDefault(); form.submit() }}>
      <AdminTopbar title={`${editing ? 'Edit' : 'New'} ${config.label}`} back={listHref}>
        <Link href={listHref} className={BTN_OUTLINE}>Cancel</Link>
        <button type="submit" className={BTN_RED} disabled={saving}>{saving ? 'Saving…' : `Save ${config.label}`}</button>
      </AdminTopbar>
      <div className={`${CONTENT} max-w-3xl`}>
        {status === 'error' && message && (
          <div ref={alertRef} tabIndex={-1} role="alert" className="mb-6 rounded-md border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{message}</div>
        )}
        <label htmlFor="record-title" className={`${LABEL} !mt-0`}>Title</label>
        <input id="record-title" value={values.title} onChange={(e) => set('title', e.target.value)} maxLength={120} aria-invalid={Boolean(errors.title)} className={INPUT} />
        {errors.title && <p role="alert" className={FIELD_ERROR}>{errors.title}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12.5px] text-brand-ivory/[0.55]">
          <label htmlFor="record-slug">{config.publicPath}</label>
          <input id="record-slug" value={values.slug} onChange={(e) => set('slug', e.target.value)} maxLength={120} aria-invalid={Boolean(errors.slug)} className={`min-w-0 max-w-full grow rounded-[3px] bg-brand-ivory/5 px-2 py-1 font-mono text-brand-ivory ${FOCUS}`} />
        </div>
        {errors.slug && <p role="alert" className={FIELD_ERROR}>{errors.slug}</p>}

        <label htmlFor="record-description" className={LABEL}>Description</label>
        <textarea id="record-description" rows={6} value={values.description} onChange={(e) => set('description', e.target.value)} maxLength={2000} aria-invalid={Boolean(errors.description)} className={INPUT} />
        {errors.description && <p role="alert" className={FIELD_ERROR}>{errors.description}</p>}

        <CoverImageField label={`${config.label} Image`} value={values.image} onChange={(v) => set('image', v)} error={errors.image} folder={config.folder} imageEndpoint={imageEndpoint} />
        <span id="record-image" tabIndex={-1} />
      </div>
    </form>
  )
}
