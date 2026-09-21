import Button from '@mui/material/Button'
import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

function formatStart(startsAt) {
  const date = new Date(startsAt)
  if (Number.isNaN(date.getTime())) return null
  const day = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(date)
  const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)
  return { iso: date.toISOString(), label: `${day} · ${time}` }
}

// Surface colours come from the page atmosphere (--atmos-card*, see app/globals.css), like ProgramCard.
// layout: "card" (default, vertical) or "row" (image beside text from md up, used by the /events list).
// showDescription: also render event.description.
// secondaryAction: undefined = "Learn more" -> /events#<slug>; an object { label, href } replaces it; null hides it.
export default function EventCard({ event, rsvpHref, layout = 'card', showDescription = false, secondaryAction }) {
  const start = formatStart(event.startsAt)
  const hasImage = isImageUrl(event.image)
  const row = layout === 'row'
  const secondary = secondaryAction === undefined ? { label: 'Learn more', href: `/events#${event.slug}` } : secondaryAction

  return (
    <article
      id={event.slug}
      className={`flex scroll-mt-32 flex-col border border-atmos-line bg-atmos-card text-atmos ${row ? 'md:flex-row' : ''}`}
    >
      <div className={`relative aspect-[4/3] bg-atmos-card-media ${row ? 'md:aspect-auto md:min-h-[260px] md:w-2/5 md:shrink-0 lg:w-1/3' : ''}`}>
        {hasImage && (
          <ImageKitImage
            src={event.image}
            sizes={row ? '(min-width: 1024px) 33vw, (min-width: 768px) 40vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {start && (
          <time
            dateTime={start.iso}
            className="absolute left-0 top-0 bg-atmos px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-atmos-inverse"
          >
            {start.label}
          </time>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-2xl leading-tight">{event.title}</h3>
        <p className="text-sm text-atmos-card-muted">{event.location}</p>
        {showDescription && event.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-atmos-card-muted">{event.description}</p>
        )}
        <div className={`flex flex-wrap gap-3 pt-4 ${row ? 'md:mt-auto' : 'mt-auto'}`}>
          {rsvpHref && (
            <Button variant="solidRed" size="small" href={rsvpHref} target="_blank" rel="noopener noreferrer">
              RSVP
            </Button>
          )}
          {secondary && (
            <Button variant="outline" size="small" href={secondary.href}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
