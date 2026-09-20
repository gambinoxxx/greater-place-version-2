import { ACCENTS } from '@/lib/accents'

// The single place a category maps to its accent color.
// Mirrors "Assigned meanings" in docs/ui-context.md.
const CATEGORY_ACCENT = {
  culture: 'purple',
  community: 'green',
  pathway: 'gold',
  training: 'gold',
  wellness: 'teal',
  events: 'red',
  stories: 'blue',
}

// Category names offered as filters (e.g. on /blog), in display order. Derived from the map above so
// there is one list of known categories; "training" shares Pathway's accent and is not a separate filter.
export const CATEGORY_NAMES = Object.keys(CATEGORY_ACCENT)
  .filter((key) => key !== 'training')
  .map((key) => key[0].toUpperCase() + key.slice(1))

// Categories are free-form strings until the vocabulary is approved, so match on any
// word ("Pathway / Training" -> gold) and fall back to a neutral outline.
function accentFor(category) {
  const words = category.toLowerCase().split(/[^a-z]+/)
  const key = words.find((word) => CATEGORY_ACCENT[word])
  return key ? ACCENTS[CATEGORY_ACCENT[key]] : null
}

export default function CategoryTag({ category }) {
  if (!category) return null
  const accent = accentFor(category)

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
        accent ? `${accent.bg} text-brand-black` : 'border border-current'
      }`}
    >
      {category}
    </span>
  )
}
