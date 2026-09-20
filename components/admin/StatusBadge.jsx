// Published / Draft (posts) and Upcoming / Past (events) pills, coloured like the admin mockups.
const STYLES = {
  published: 'bg-brand-green/15 text-brand-green',
  upcoming: 'bg-brand-green/15 text-brand-green',
  draft: 'bg-brand-gold/20 text-brand-gold',
  past: 'bg-brand-ivory/10 text-brand-ivory/[0.55]',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block w-fit shrink-0 rounded-[3px] px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.07em] ${STYLES[status]}`}>
      {status}
    </span>
  )
}
