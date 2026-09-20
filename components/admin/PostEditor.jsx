'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CoverImageField from '@/components/admin/CoverImageField'
import MarkdownField from '@/components/admin/MarkdownField'
import useAdminForm from '@/components/admin/useAdminForm'
import { BTN_OUTLINE, BTN_RED, CONTENT, FIELD_ERROR, FOCUS, INPUT, LABEL, PANEL } from '@/components/admin/ui'
import { validatePost } from '@/lib/admin-validation'

// New / Edit Post (docs/design-references/admin-post-editor.html). `post` is null for a new post. The
// Draft / Published state is a real column (Post.isPublished): "Save Draft" stores a post that is NOT
// public; "Publish" makes it visible on /blog. The cover image and body images go through Phase 9's
// ImageKit upload.
const ymd = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function PostEditor({ post, categories, authors, imageEndpoint }) {
  const editing = Boolean(post)
  const initialDate = post ? ymd(post.publishedAt) : ymd(new Date())
  const [date, setDate] = useState(initialDate)
  const form = useAdminForm({
    initial: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      body: post?.body ?? '',
      category: post?.category ?? '',
      authorName: post?.authorName ?? '',
      coverImage: post?.coverImage ?? '',
      isPublished: post ? post.isPublished : false,
    },
    validate: (values) => validatePost(values, { categories }),
    endpoint: editing ? `/api/admin/posts/${post.id}` : '/api/admin/posts',
    method: editing ? 'PUT' : 'POST',
    redirectTo: '/admin/posts',
    idPrefix: 'post',
    slugFrom: editing ? null : 'title',
  })
  const { values, set, errors, message, status, alertRef, saving } = form

  // The publish date is only sent when it was changed (or for a new post), so an untouched date keeps the
  // exact stored timestamp. Noon UTC keeps the calendar day stable in every time zone.
  const save = (isPublished) =>
    form.submit({ isPublished, ...(date && (!editing || date !== initialDate) ? { publishedAt: `${date}T12:00:00.000Z` } : {}) })

  return (
    <form
      id="post-editor"
      noValidate
      aria-busy={saving}
      onSubmit={(event) => { event.preventDefault(); save(values.isPublished) }}
    >
      <AdminTopbar title={editing ? 'Edit Post' : 'New Post'} back="/admin/posts">
        <button type="button" className={BTN_OUTLINE} disabled={saving} onClick={() => save(false)}>Save Draft</button>
        <button type="button" className={BTN_RED} disabled={saving} onClick={() => save(true)}>{saving ? 'Saving…' : 'Publish'}</button>
      </AdminTopbar>

      <div className={CONTENT}>
        {status === 'error' && message && (
          <div ref={alertRef} tabIndex={-1} role="alert" className="mb-6 rounded-md border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm text-brand-ivory">
            {message}
          </div>
        )}

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <label htmlFor="post-title" className="sr-only">Title</label>
            <input
              id="post-title"
              value={values.title}
              onChange={(event) => set('title', event.target.value)}
              placeholder="Post title"
              maxLength={200}
              aria-invalid={Boolean(errors.title)}
              className={`w-full border-b border-brand-ivory/[0.14] bg-transparent pb-3.5 font-serif text-[30px] text-brand-ivory placeholder:text-brand-ivory/[0.38] ${FOCUS}`}
            />
            {errors.title && <p role="alert" className={FIELD_ERROR}>{errors.title}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12.5px] text-brand-ivory/[0.55]">
              <label htmlFor="post-slug">/blog/</label>
              <input
                id="post-slug"
                value={values.slug}
                onChange={(event) => set('slug', event.target.value)}
                maxLength={120}
                aria-invalid={Boolean(errors.slug)}
                className={`min-w-0 max-w-full grow rounded-[3px] bg-brand-ivory/5 px-2 py-1 font-mono text-brand-ivory ${FOCUS}`}
              />
            </div>
            {errors.slug && <p role="alert" className={FIELD_ERROR}>{errors.slug}</p>}

            <label htmlFor="post-excerpt" className={LABEL}>Excerpt</label>
            <textarea
              id="post-excerpt"
              rows={3}
              value={values.excerpt}
              onChange={(event) => set('excerpt', event.target.value)}
              maxLength={500}
              aria-invalid={Boolean(errors.excerpt)}
              className={`${INPUT} resize-none`}
            />
            {errors.excerpt && <p role="alert" className={FIELD_ERROR}>{errors.excerpt}</p>}

            <MarkdownField id="post-body" value={values.body} onChange={(value) => set('body', value)} error={errors.body} folder="/posts" />

            <CoverImageField value={values.coverImage} onChange={(value) => set('coverImage', value)} error={errors.coverImage} folder="/posts" imageEndpoint={imageEndpoint} />
            <span id="post-coverImage" tabIndex={-1} />
          </div>

          <div className="flex flex-col gap-4">
            <div className={`${PANEL} p-[18px]`}>
              <p className="mb-3 text-[10.5px] uppercase tracking-[0.1em] text-brand-ivory/[0.38]">Publish</p>
              <div role="group" aria-label="Post status" className="mb-3.5 flex gap-1.5 rounded-md bg-brand-ivory/5 p-[3px]">
                {[['Draft', false], ['Published', true]].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={values.isPublished === value}
                    onClick={() => set('isPublished', value)}
                    className={`flex-1 rounded-[3px] py-2 text-[11.5px] font-bold ${FOCUS} ${values.isPublished === value ? (value ? 'bg-brand-green/[0.18] text-brand-green' : 'bg-brand-gold/20 text-brand-gold') : 'text-brand-ivory/50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-brand-ivory/10 pt-2.5 text-[12.5px]">
                <label htmlFor="post-publishedAt">Publish date</label>
                <input id="post-publishedAt" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`rounded bg-brand-ivory/5 px-2 py-1 text-[12.5px] font-semibold text-brand-ivory ${FOCUS}`} />
              </div>
              {errors.publishedAt && <p role="alert" className={FIELD_ERROR}>{errors.publishedAt}</p>}
              {errors.isPublished && <p role="alert" className={FIELD_ERROR}>{errors.isPublished}</p>}
              <p className="mt-3 text-[11.5px] leading-relaxed text-brand-ivory/[0.38]">
                {values.isPublished ? 'Visible on the blog once saved.' : 'Drafts are not visible on the public site.'}
              </p>
            </div>

            <div className={`${PANEL} p-[18px]`}>
              <p id="post-category-label" className="mb-3 text-[10.5px] uppercase tracking-[0.1em] text-brand-ivory/[0.38]">Category</p>
              <div id="post-category" tabIndex={-1} role="group" aria-labelledby="post-category-label" className="flex flex-wrap gap-[7px]">
                {categories.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={values.category === name}
                    onClick={() => set('category', name)}
                    className={`rounded px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] ${FOCUS} ${values.category === name ? 'bg-brand-purple text-brand-navyDeep shadow-[0_0_0_2px_#A78BFA]' : 'bg-brand-ivory/[0.06] text-brand-ivory/60 hover:text-brand-ivory'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              {errors.category && <p role="alert" className={FIELD_ERROR}>{errors.category}</p>}
            </div>

            <div className={`${PANEL} p-[18px]`}>
              <label htmlFor="post-authorName" className="mb-3 block text-[10.5px] uppercase tracking-[0.1em] text-brand-ivory/[0.38]">Author</label>
              <input
                id="post-authorName"
                list="post-authors"
                value={values.authorName}
                onChange={(event) => set('authorName', event.target.value)}
                maxLength={100}
                aria-invalid={Boolean(errors.authorName)}
                className={INPUT}
              />
              <datalist id="post-authors">{authors.map((name) => <option key={name} value={name} />)}</datalist>
              {errors.authorName && <p role="alert" className={FIELD_ERROR}>{errors.authorName}</p>}
              <p className="mt-2 text-[11.5px] text-brand-ivory/[0.38]">Type a name, or pick a team member.</p>
            </div>

            <Link href="/admin/posts" className={`text-center text-xs text-brand-ivory/[0.55] underline underline-offset-4 hover:text-brand-ivory ${FOCUS}`}>Cancel and go back</Link>
          </div>
        </div>
      </div>
    </form>
  )
}
