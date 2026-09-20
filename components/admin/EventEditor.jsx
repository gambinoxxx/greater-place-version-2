'use client'

import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CoverImageField from '@/components/admin/CoverImageField'
import useAdminForm from '@/components/admin/useAdminForm'
import { BTN_OUTLINE, BTN_RED, CONTENT, FIELD_ERROR, FOCUS, INPUT, LABEL } from '@/components/admin/ui'
import { validateEvent } from '@/lib/admin-validation'

// New / Edit Event. Fields are exactly the Event model's: title, slug, description, startsAt, location, image.
// There is no separate mockup: the layout follows the post editor's pattern. The date is entered in the
// admin's own time zone and stored as an instant (Event.startsAt has no zone column).
const toLocalInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function EventEditor({ event, imageEndpoint }) {
  const editing = Boolean(event)
  const form = useAdminForm({
    initial: {
      title: event?.title ?? '',
      slug: event?.slug ?? '',
      description: event?.description ?? '',
      location: event?.location ?? '',
      startsAt: toLocalInput(event?.startsAt),
      image: event?.image ?? '',
    },
    validate: (values) => validateEvent({ ...values, startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : '' }),
    endpoint: editing ? `/api/admin/events/${event.id}` : '/api/admin/events',
    method: editing ? 'PUT' : 'POST',
    redirectTo: '/admin/events',
    idPrefix: 'event',
    slugFrom: editing ? null : 'title',
  })
  const { values, set, errors, message, status, alertRef, saving } = form
  const save = () => form.submit({ startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : '' })

  return (
    <form noValidate aria-busy={saving} onSubmit={(e) => { e.preventDefault(); save() }}>
      <AdminTopbar title={editing ? 'Edit Event' : 'New Event'} back="/admin/events">
        <Link href="/admin/events" className={BTN_OUTLINE}>Cancel</Link>
        <button type="submit" className={BTN_RED} disabled={saving}>{saving ? 'Saving…' : 'Save Event'}</button>
      </AdminTopbar>
      <div className={`${CONTENT} max-w-3xl`}>
        {status === 'error' && message && (
          <div ref={alertRef} tabIndex={-1} role="alert" className="mb-6 rounded-md border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{message}</div>
        )}
        <label htmlFor="event-title" className={`${LABEL} !mt-0`}>Title</label>
        <input id="event-title" value={values.title} onChange={(e) => set('title', e.target.value)} maxLength={200} aria-invalid={Boolean(errors.title)} className={INPUT} />
        {errors.title && <p role="alert" className={FIELD_ERROR}>{errors.title}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12.5px] text-brand-ivory/[0.55]">
          <label htmlFor="event-slug">/events#</label>
          <input id="event-slug" value={values.slug} onChange={(e) => set('slug', e.target.value)} maxLength={120} aria-invalid={Boolean(errors.slug)} className={`min-w-0 max-w-full grow rounded-[3px] bg-brand-ivory/5 px-2 py-1 font-mono text-brand-ivory ${FOCUS}`} />
        </div>
        {errors.slug && <p role="alert" className={FIELD_ERROR}>{errors.slug}</p>}

        <div className="grid gap-x-6 sm:grid-cols-2">
          <div>
            <label htmlFor="event-startsAt" className={LABEL}>Date and time</label>
            <input id="event-startsAt" type="datetime-local" value={values.startsAt} onChange={(e) => set('startsAt', e.target.value)} aria-invalid={Boolean(errors.startsAt)} className={INPUT} />
            {errors.startsAt && <p role="alert" className={FIELD_ERROR}>{errors.startsAt}</p>}
          </div>
          <div>
            <label htmlFor="event-location" className={LABEL}>Location</label>
            <input id="event-location" value={values.location} onChange={(e) => set('location', e.target.value)} maxLength={200} aria-invalid={Boolean(errors.location)} className={INPUT} />
            {errors.location && <p role="alert" className={FIELD_ERROR}>{errors.location}</p>}
          </div>
        </div>

        <label htmlFor="event-description" className={LABEL}>Description</label>
        <textarea id="event-description" rows={5} value={values.description} onChange={(e) => set('description', e.target.value)} maxLength={2000} aria-invalid={Boolean(errors.description)} className={INPUT} />
        {errors.description && <p role="alert" className={FIELD_ERROR}>{errors.description}</p>}

        <CoverImageField label="Event Image" value={values.image} onChange={(v) => set('image', v)} error={errors.image} folder="/events" imageEndpoint={imageEndpoint} />
        <span id="event-image" tabIndex={-1} />
      </div>
    </form>
  )
}
