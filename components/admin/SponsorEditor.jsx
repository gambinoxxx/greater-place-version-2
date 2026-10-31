'use client'

import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CoverImageField from '@/components/admin/CoverImageField'
import useAdminForm from '@/components/admin/useAdminForm'
import { BTN_OUTLINE, BTN_RED, CONTENT, FIELD_ERROR, INPUT, LABEL } from '@/components/admin/ui'
import { validateSponsor } from '@/lib/admin-validation'

// Add / Edit a sponsor: name, logo and an optional website. Mirrors ProgramEditor; there is no slug
// because sponsors have no page of their own, they only appear in the homepage marquee.
const LIST_HREF = '/admin/sponsors'

export default function SponsorEditor({ record, imageEndpoint }) {
  const editing = Boolean(record)
  const form = useAdminForm({
    initial: { name: record?.name ?? '', website: record?.website ?? '', logo: record?.logo ?? '' },
    validate: validateSponsor,
    endpoint: editing ? `/api/admin/sponsors/${record.id}` : '/api/admin/sponsors',
    method: editing ? 'PUT' : 'POST',
    redirectTo: LIST_HREF,
    idPrefix: 'sponsor',
    slugFrom: null,
  })
  const { values, set, errors, message, status, alertRef, saving } = form

  return (
    <form noValidate aria-busy={saving} onSubmit={(e) => { e.preventDefault(); form.submit() }}>
      <AdminTopbar title={editing ? 'Edit Sponsor' : 'Add Sponsor'} back={LIST_HREF}>
        <Link href={LIST_HREF} className={BTN_OUTLINE}>Cancel</Link>
        <button type="submit" className={BTN_RED} disabled={saving}>{saving ? 'Saving…' : 'Save Sponsor'}</button>
      </AdminTopbar>
      <div className={`${CONTENT} max-w-3xl`}>
        {status === 'error' && message && (
          <div ref={alertRef} tabIndex={-1} role="alert" className="mb-6 rounded-md border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{message}</div>
        )}
        <label htmlFor="sponsor-name" className={`${LABEL} !mt-0`}>Name</label>
        <input id="sponsor-name" value={values.name} onChange={(e) => set('name', e.target.value)} maxLength={120} aria-invalid={Boolean(errors.name)} className={INPUT} />
        {errors.name && <p role="alert" className={FIELD_ERROR}>{errors.name}</p>}

        <label htmlFor="sponsor-website" className={LABEL}>Website (optional)</label>
        <input id="sponsor-website" type="url" inputMode="url" value={values.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" maxLength={2000} aria-invalid={Boolean(errors.website)} className={INPUT} />
        {errors.website && <p role="alert" className={FIELD_ERROR}>{errors.website}</p>}

        <CoverImageField
          label="Logo"
          value={values.logo}
          onChange={(v) => set('logo', v)}
          error={errors.logo}
          folder="/sponsors"
          imageEndpoint={imageEndpoint}
          hint="PNG with a transparent background works best, up to 10 MB"
          contain
        />
        <span id="sponsor-logo" tabIndex={-1} />
      </div>
    </form>
  )
}
