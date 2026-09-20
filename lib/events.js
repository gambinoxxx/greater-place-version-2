import prisma from '@/lib/prisma'

// Single source of "events" for the homepage and /events. One query, partitioned at request time:
// upcoming = soonest first, past = most recent first. Every event appears in exactly one list, so
// every /events#<slug> link resolves.
export async function getEvents() {
  const events = await prisma.event.findMany({ orderBy: { startsAt: 'asc' } })
  const now = Date.now()
  return {
    upcoming: events.filter((event) => new Date(event.startsAt).getTime() >= now),
    past: events.filter((event) => new Date(event.startsAt).getTime() < now).reverse(),
  }
}
