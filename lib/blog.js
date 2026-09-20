import { cache } from 'react'
import prisma from '@/lib/prisma'

const POST_DATE = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatPostDate = (date) => POST_DATE.format(new Date(date))

// Reading time is computed from the Markdown body (about 200 words a minute); it is not stored.
export const readingMinutes = (body) =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200))

const first = (value) => (Array.isArray(value) ? value[0] : value)

// /blog URL parameters: `q` (search text) and `category` (one of the known category names,
// matched case-insensitively; anything else is ignored). Returns normalised values.
export function parseBlogParams(searchParams, categoryNames) {
  const q = (first(searchParams.q) ?? '').trim().slice(0, 100)
  const raw = (first(searchParams.category) ?? '').trim().toLowerCase()
  const category = categoryNames.find((name) => name.toLowerCase() === raw) ?? ''
  return { q, category }
}

// Prisma's `contains` does not escape SQL LIKE wildcards, so "%" or "_" typed into the search box
// would match everything. Escape them (and the escape character) so they match literally.
export const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&')

// Server-side filter: only published posts, plus an exact (case-insensitive) category and a
// case-insensitive "contains" on title or excerpt. The last two are optional and combine with AND.
export function buildPostWhere({ q, category }) {
  const term = q && escapeLike(q)
  return {
    isPublished: true, // drafts (Admin CMS) are never public
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(q && {
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { excerpt: { contains: term, mode: 'insensitive' } },
      ],
    }),
  }
}

export function blogHref({ q, category } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

// cache(): generateMetadata and the page share one query per request. A NUL byte cannot exist in a
// Postgres text value (the query would throw and surface as a 500), and no slug is that long, so
// such requests are treated as "not found".
// Only published posts are found: a draft's URL is a 404 until it is published.
export const getPostBySlug = cache((slug) =>
  slug.includes('\u0000') || slug.length > 200 ? null : prisma.post.findFirst({ where: { slug, isPublished: true } })
)
