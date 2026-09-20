import Link from 'next/link'
import { ACCENTS } from '@/lib/accents'

export default function SectionHeader({ label, href, linkLabel = 'See more', accent }) {
  const color = ACCENTS[accent]

  return (
    <div className={`flex items-center justify-between gap-6 border-t pt-4 ${color ? color.border : 'border-current'}`}>
      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">
        {color && <span aria-hidden="true" className={`h-2 w-2 ${color.bg}`} />}
        {label}
      </p>
      {href && (
        <Link
          href={href}
          className="text-xs font-bold uppercase tracking-[0.16em] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          {linkLabel}
          <span aria-hidden="true"> →</span>
        </Link>
      )}
    </div>
  )
}
