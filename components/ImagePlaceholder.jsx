// No real photography yet (docs/ui-context.md §11): explicit placeholder treatment that follows
// the page's colours. Replace with real imagery when assets are supplied.
export default function ImagePlaceholder({ label = 'Photography placeholder', className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-end border border-atmos-line bg-atmos-tint p-4 text-xs font-bold uppercase tracking-[0.16em] text-atmos-muted ${className}`}
    >
      {label}
    </div>
  )
}
